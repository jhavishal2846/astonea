import 'server-only'
import bcrypt from 'bcryptjs'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { db } from '@/lib/db'
import { otpVerifications, type OtpChannel, type OtpPurpose } from '@/lib/db/schema'
import { generateCode } from './code'
import { buildKey, checkAndIncrement } from './rate-limit'
import { sendOtpSms } from './channels/sms'
import { sendOtpEmail } from './channels/email'
import { sendOtpWhatsapp } from './channels/whatsapp'

const BCRYPT_ROUNDS = 10
const TTL_MS = 10 * 60 * 1000
const ATTEMPTS_DEFAULT = 5

const LIMIT_DEST_PER_15MIN = 3
const LIMIT_IP_PER_HOUR = 10
const LIMIT_COUNTRY_PER_HOUR_DEFAULT = 200

const WINDOW_15MIN = 15 * 60 * 1000
const WINDOW_1HR = 60 * 60 * 1000

/**
 * Public API. `destination` is the address the user typed (email, E.164 phone,
 * WhatsApp number) — never the OTP itself. The result is intentionally vague
 * on the reason for refusal so we don't enumerate-back to the caller's caller
 * which destinations have outstanding codes / which IPs are blocked.
 */
export type IssueOtpResult =
  | { ok: true }
  | { ok: false; reason: 'rate_limited' | 'unsupported_country' | 'channel_failed' | 'invalid_destination'; retryAfterMs?: number }

export type VerifyOtpResult =
  | { ok: true; verificationId: string }
  | { ok: false; reason: 'invalid' | 'expired' | 'consumed' | 'attempts_exhausted' }

export type IssueOtpInput = {
  channel: OtpChannel
  destination: string
  purpose: OtpPurpose
  ipHash: string
  /** Country ISO2 — used for the country-cap rate limit when the channel is SMS. */
  countryIso2?: string
  /** Submitter's UI locale, used only by the email channel for template selection. */
  locale?: string
}

function getCountryAllowlist(): string[] | null {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const raw = env.OTP_ALLOWED_COUNTRY_CODES
  if (!raw) return null
  const parts = raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
  return parts.length ? parts : null
}

function getCountryHourlyCap(): number {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const raw = env.OTP_COUNTRY_HOURLY_CAP
  const n = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(n) && n > 0 ? n : LIMIT_COUNTRY_PER_HOUR_DEFAULT
}

export async function issueOtp(input: IssueOtpInput): Promise<IssueOtpResult> {
  if (!input.destination) return { ok: false, reason: 'invalid_destination' }

  // 1. Country allowlist (SMS only — email isn't tied to a country).
  if (input.channel === 'sms' || input.channel === 'whatsapp') {
    const allowlist = getCountryAllowlist()
    if (allowlist && (!input.countryIso2 || !allowlist.includes(input.countryIso2.toUpperCase()))) {
      return { ok: false, reason: 'unsupported_country' }
    }
  }

  // 2. Rate limits: per-destination, per-IP, and (for SMS) per-country.
  const destKey = await buildKey('dest', input.destination)
  const destCheck = await checkAndIncrement({
    key: destKey,
    limit: LIMIT_DEST_PER_15MIN,
    windowMs: WINDOW_15MIN,
  })
  if (!destCheck.allowed) {
    return { ok: false, reason: 'rate_limited', retryAfterMs: destCheck.retryAfterMs }
  }

  const ipKey = await buildKey('ip', input.ipHash)
  const ipCheck = await checkAndIncrement({
    key: ipKey,
    limit: LIMIT_IP_PER_HOUR,
    windowMs: WINDOW_1HR,
  })
  if (!ipCheck.allowed) {
    return { ok: false, reason: 'rate_limited', retryAfterMs: ipCheck.retryAfterMs }
  }

  if ((input.channel === 'sms' || input.channel === 'whatsapp') && input.countryIso2) {
    const countryKey = await buildKey('country', input.countryIso2.toUpperCase())
    const countryCheck = await checkAndIncrement({
      key: countryKey,
      limit: getCountryHourlyCap(),
      windowMs: WINDOW_1HR,
    })
    if (!countryCheck.allowed) {
      return { ok: false, reason: 'rate_limited', retryAfterMs: countryCheck.retryAfterMs }
    }
  }

  // 3. Mint & store the code (bcrypt-hashed; raw code lives in the outbound message only).
  const code = generateCode()
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS)
  await db.insert(otpVerifications).values({
    channel: input.channel,
    destination: input.destination,
    purpose: input.purpose,
    codeHash,
    attemptsRemaining: ATTEMPTS_DEFAULT,
    expiresAt: new Date(Date.now() + TTL_MS),
    ipAddressHash: input.ipHash,
  })

  // 4. Dispatch via the selected channel.
  const sent =
    input.channel === 'sms'
      ? await sendOtpSms({ to: input.destination, code })
      : input.channel === 'whatsapp'
      ? await sendOtpWhatsapp({ to: input.destination, code })
      : await sendOtpEmail({ to: input.destination, code, locale: input.locale ?? 'en' })

  if (!sent.ok) {
    // The bcrypt-hashed code lives on, but the user has no way to read it — so this is
    // mostly cosmetic. We still return failure so the UI can offer to switch channel.
    return { ok: false, reason: 'channel_failed' }
  }
  return { ok: true }
}

export type VerifyOtpInput = {
  channel: OtpChannel
  destination: string
  purpose: OtpPurpose
  code: string
}

/**
 * Match the supplied code against the most recent un-consumed, un-expired row
 * for `(destination, purpose, channel)`. Bcrypt's compare is constant-time per
 * implementation. On success we mark the row consumed atomically — the
 * `WHERE consumed_at IS NULL` clause means a racing verify can't double-spend
 * the same code.
 *
 * The 5-attempts counter is decremented on every wrong code; on the 5th wrong
 * code the row is marked consumed so subsequent guesses fail fast.
 */
export async function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResult> {
  const now = new Date()
  const row = (
    await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.destination, input.destination),
          eq(otpVerifications.purpose, input.purpose),
          eq(otpVerifications.channel, input.channel),
          isNull(otpVerifications.consumedAt),
        ),
      )
      .orderBy(desc(otpVerifications.createdAt))
      .limit(1)
  )[0]

  if (!row) return { ok: false, reason: 'invalid' }
  if (row.expiresAt.getTime() < now.getTime()) return { ok: false, reason: 'expired' }
  if (row.attemptsRemaining <= 0) return { ok: false, reason: 'attempts_exhausted' }

  const match = await bcrypt.compare(input.code, row.codeHash)
  if (!match) {
    const remaining = row.attemptsRemaining - 1
    await db
      .update(otpVerifications)
      .set({
        attemptsRemaining: remaining,
        consumedAt: remaining <= 0 ? now : null,
      })
      .where(eq(otpVerifications.id, row.id))
    return { ok: false, reason: remaining <= 0 ? 'attempts_exhausted' : 'invalid' }
  }

  // Single-use commit. The WHERE on `consumed_at IS NULL` prevents a racing
  // second verify from also "succeeding" on the same row.
  const upd = await db
    .update(otpVerifications)
    .set({ consumedAt: now })
    .where(and(eq(otpVerifications.id, row.id), isNull(otpVerifications.consumedAt)))
    .returning({ id: otpVerifications.id })

  if (upd.length === 0) return { ok: false, reason: 'consumed' }
  return { ok: true, verificationId: row.id }
}

/** Maintenance: drop OTP rows older than 1 day. */
export async function pruneOldOtps(): Promise<void> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  await db.delete(otpVerifications).where(sql`${otpVerifications.createdAt} < ${cutoff}`)
}
