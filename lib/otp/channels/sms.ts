import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Twilio Programmable SMS via the HTTPS REST API. The Node SDK uses node:http
 * directly and doesn't run on Workers, so we hand-roll a `fetch()` call
 * against `api.twilio.com`. Auth is HTTP Basic with Account SID + Auth Token.
 *
 * We try `TWILIO_MESSAGING_SERVICE_SID` first (recommended for sender-pool /
 * sticky-sender) and fall back to `TWILIO_FROM_NUMBER` (single-number sender).
 * One of the two must be set; the OTP issuer surfaces a generic failure if
 * neither is configured.
 */

export type TwilioSendResult =
  | { ok: true; sid: string }
  | { ok: false; reason: 'config_missing' | 'transient' | 'final_failure'; detail?: string }

type TwilioErrorBody = { code?: number; message?: string }

/**
 * Twilio "final failure" error codes — no point retrying / falling back to the
 * same number. Subset of https://www.twilio.com/docs/api/errors.
 */
const FINAL_FAILURE_CODES = new Set<number>([
  21211, // Invalid 'To' Phone Number
  21408, // Permission denied for region
  21610, // Recipient is blacklisted
  21612, // Unreachable carrier
  21614, // 'To' number is not a valid mobile number
  30003, // Unreachable destination handset
  30004, // Message blocked by carrier
  30005, // Unknown destination handset
  30006, // Landline / unreachable carrier
])

export async function sendOtpSms({
  to,
  code,
}: {
  to: string
  code: string
}): Promise<TwilioSendResult> {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const sid = env.TWILIO_ACCOUNT_SID
  const token = env.TWILIO_AUTH_TOKEN
  const messagingServiceSid = env.TWILIO_MESSAGING_SERVICE_SID
  const fromNumber = env.TWILIO_FROM_NUMBER

  if (!sid || !token || (!messagingServiceSid && !fromNumber)) {
    return { ok: false, reason: 'config_missing' }
  }

  const body = new URLSearchParams({
    To: to,
    Body: `Your Astonea verification code is ${code}. It expires in 10 minutes. Do not share this code.`,
  })
  if (messagingServiceSid) {
    body.set('MessagingServiceSid', messagingServiceSid)
  } else if (fromNumber) {
    body.set('From', fromNumber)
  }

  let res: Response
  try {
    res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    )
  } catch (err) {
    // Network-layer failure — caller may retry or fall back to email.
    console.error('[otp/sms] fetch threw', err)
    return { ok: false, reason: 'transient' }
  }

  if (res.ok) {
    const json = (await res.json()) as { sid: string }
    return { ok: true, sid: json.sid }
  }

  let parsed: TwilioErrorBody = {}
  try {
    parsed = (await res.json()) as TwilioErrorBody
  } catch {
    // ignore
  }
  // NEVER log `body` — it contains the OTP code in plaintext.
  console.warn('[otp/sms] twilio rejected', {
    status: res.status,
    code: parsed.code,
    message: parsed.message,
  })

  if (parsed.code && FINAL_FAILURE_CODES.has(parsed.code)) {
    return { ok: false, reason: 'final_failure', detail: String(parsed.code) }
  }
  return { ok: false, reason: 'transient', detail: String(parsed.code ?? res.status) }
}
