import 'server-only'
import { and, eq, lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { otpRateLimits } from '@/lib/db/schema'

/**
 * Sliding-window counters keyed by `<scope>:<sha256-or-iso>`. Buckets are 15
 * minutes wide; the caller passes a window size in ms (we round down to a
 * multiple of 15 min to keep buckets aligned). The "sliding" part is just
 * "count rows whose window_start is within the last N minutes" — close enough
 * to a true sliding window for abuse-deterrence purposes and cheap to query.
 *
 * Cleanup of stale rows lives in the OTP cleanup script (see plan §Cleanup).
 */
const BUCKET_MS = 15 * 60 * 1000

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export type RateLimitScope = 'ip' | 'dest' | 'country'

function makeKey(scope: RateLimitScope, raw: string, hashed: boolean): Promise<string> | string {
  if (!hashed) return Promise.resolve(`${scope}:${raw}`)
  return sha256Hex(raw).then((h) => `${scope}:${h}`)
}

export async function buildKey(scope: RateLimitScope, raw: string): Promise<string> {
  // Country codes are short and not PII — store them in the clear so the
  // operator can grep abuse without re-hashing.
  return await makeKey(scope, raw, scope !== 'country')
}

/**
 * Increment the current bucket and check whether the rolling count over
 * `windowMs` is still under `limit`. Returns `{ allowed: true }` on accept,
 * `{ allowed: false, retryAfterMs }` on reject. We optimistically increment
 * first then check — a small over-count on the boundary is fine.
 */
export async function checkAndIncrement({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}): Promise<{ allowed: true } | { allowed: false; retryAfterMs: number }> {
  const now = Date.now()
  const bucket = Math.floor(now / BUCKET_MS) * BUCKET_MS
  const cutoff = now - windowMs

  await db
    .insert(otpRateLimits)
    .values({ key, windowStart: bucket, count: 1 })
    .onConflictDoUpdate({
      target: [otpRateLimits.key, otpRateLimits.windowStart],
      set: { count: sql`${otpRateLimits.count} + 1` },
    })

  const total = (
    await db
      .select({ sum: sql<number>`COALESCE(SUM(${otpRateLimits.count}), 0)` })
      .from(otpRateLimits)
      .where(and(eq(otpRateLimits.key, key), sql`${otpRateLimits.windowStart} >= ${cutoff}`))
  )[0]?.sum ?? 0

  if (total <= limit) return { allowed: true }
  // Caller can use this to surface "Try again in N minutes" — we conservatively
  // return the time until the oldest in-window bucket expires.
  return { allowed: false, retryAfterMs: Math.max(0, bucket + BUCKET_MS - now) }
}

/** Maintenance: prune rate-limit buckets older than 1 day. */
export async function pruneRateLimits(): Promise<void> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  await db.delete(otpRateLimits).where(lt(otpRateLimits.windowStart, cutoff))
}
