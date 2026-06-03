import 'server-only'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq, lt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sessions, users } from '@/lib/db/schema'

export const SESSION_COOKIE = 'astonea_session'
const SESSION_TTL_DAYS = 30
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

function newToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const id = newToken()
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await db.insert(sessions).values({ id, userId, expiresAt })
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

export type SessionUser = {
  id: string
  email: string
  name: string | null
}

/**
 * Reads the session cookie, validates it against the DB, returns the user — or null.
 * Side effect: deletes expired sessions it encounters.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

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

  return { id: row.userId, email: row.email, name: row.name }
}

export async function deleteCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, token))
  }
  await clearSessionCookie()
}

/** Maintenance: drop sessions whose expiry has passed. */
export async function purgeExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()))
}
