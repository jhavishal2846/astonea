import 'server-only'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq, lt } from 'drizzle-orm'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { db } from '@/lib/db'
import { sessions, users } from '@/lib/db/schema'

export const SESSION_COOKIE = 'astonea_session'
const SESSION_TTL_DAYS = 30
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

export type SessionUser = {
  id: string
  email: string
  name: string | null
}

type CachedSession = {
  user: SessionUser
  expiresAtMs: number
}

/**
 * Two-tier session cache so authenticated requests don't slam D1 with a
 * `sessions ⋈ users` JOIN on every page load. Same isolate handles many
 * requests, so an in-memory LRU is real money saved.
 *
 *   L1: module-scope Map, 60 s TTL, ~500-entry LRU (per Worker isolate).
 *   L2: Cloudflare KV (`SESSION_CACHE`), 5-min TTL (or remaining session
 *       lifetime, whichever is shorter).
 *   L3: D1 (canonical store).
 *
 * Trade-off: KV is eventually consistent globally (~60 s). A logout in one
 * region can briefly remain valid in another — acceptable for an admin tool.
 */
const L1_TTL_MS = 60_000
const L1_MAX = 500
const KV_TTL_SECONDS = 300

const l1 = new Map<string, CachedSession>()

function l1Get(id: string): CachedSession | null {
  const hit = l1.get(id)
  if (!hit) return null
  if (hit.expiresAtMs < Date.now()) {
    l1.delete(id)
    return null
  }
  // LRU touch
  l1.delete(id)
  l1.set(id, hit)
  return hit
}

function l1Set(id: string, value: CachedSession): void {
  if (l1.size >= L1_MAX) {
    const oldest = l1.keys().next().value
    if (oldest !== undefined) l1.delete(oldest)
  }
  l1.set(id, value)
}

function l1Delete(id: string): void {
  l1.delete(id)
}

function kvKey(sessionId: string): string {
  return `session:${sessionId}`
}

function newToken(): string {
  return randomBytes(32).toString('hex')
}

function tryGetKv() {
  try {
    return getCloudflareContext().env.SESSION_CACHE ?? null
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const id = newToken()
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await db.insert(sessions).values({ id, userId, expiresAt })

  // Prime caches so the very next request from this user is L1/KV hot.
  const userRow = (
    await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  )[0]
  if (userRow) {
    const cached: CachedSession = {
      user: { id: userRow.id, email: userRow.email, name: userRow.name },
      expiresAtMs: expiresAt.getTime(),
    }
    l1Set(id, { ...cached, expiresAtMs: Math.min(cached.expiresAtMs, Date.now() + L1_TTL_MS) })
    const kv = tryGetKv()
    if (kv) {
      const ttl = Math.min(KV_TTL_SECONDS, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
      if (ttl > 0) {
        await kv.put(kvKey(id), JSON.stringify(cached), { expirationTtl: ttl })
      }
    }
  }

  return { id, expiresAt }
}

export async function setSessionCookie(id: string, expiresAt: Date) {
  const store = await cookies()
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/**
 * Reads the session cookie, validates it (cache → KV → D1), returns the user
 * or null. Side effect: deletes expired sessions from D1 when it sees them.
 *
 * Public pages should never look up a session — this short-circuits to null
 * on no cookie so a logged-out visitor never touches D1.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  // L1
  const l1Hit = l1Get(token)
  if (l1Hit) return l1Hit.user

  // L2 (KV)
  const kv = tryGetKv()
  if (kv) {
    const raw = await kv.get(kvKey(token))
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CachedSession
        if (parsed.expiresAtMs > Date.now()) {
          l1Set(token, {
            user: parsed.user,
            expiresAtMs: Math.min(parsed.expiresAtMs, Date.now() + L1_TTL_MS),
          })
          return parsed.user
        }
      } catch {
        // Fall through to D1
      }
    }
  }

  // L3 (D1) — canonical
  const rows = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
      name: users.name,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, token))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, row.sessionId))
    return null
  }

  const user: SessionUser = { id: row.userId, email: row.email, name: row.name }
  const cached: CachedSession = { user, expiresAtMs: row.expiresAt.getTime() }

  l1Set(token, {
    user,
    expiresAtMs: Math.min(cached.expiresAtMs, Date.now() + L1_TTL_MS),
  })

  if (kv) {
    const ttl = Math.min(KV_TTL_SECONDS, Math.floor((row.expiresAt.getTime() - Date.now()) / 1000))
    if (ttl > 0) {
      await kv.put(kvKey(token), JSON.stringify(cached), { expirationTtl: ttl })
    }
  }

  return user
}

export async function deleteCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, token))
    l1Delete(token)
    const kv = tryGetKv()
    if (kv) await kv.delete(kvKey(token))
  }
  await clearSessionCookie()
}

/** Maintenance: drop sessions whose expiry has passed. */
export async function purgeExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()))
}
