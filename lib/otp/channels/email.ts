import 'server-only'
import { sendEmail } from '@/lib/email'
import { otpEmailTemplate } from '@/lib/email/templates/otp'

export type EmailOtpResult = { ok: true } | { ok: false; reason: 'transient' | 'final_failure' }

/**
 * Fallback channel for when SMS delivery hits a final-failure code or the
 * submitter explicitly asks for the code by email. Delegates to the shared
 * Cloudflare `send_email` binding.
 */
export async function sendOtpEmail({
  to,
  code,
  locale,
}: {
  to: string
  code: string
  locale: string
}): Promise<EmailOtpResult> {
  const tmpl = otpEmailTemplate({ code, locale })
  const res = await sendEmail({ to, subject: tmpl.subject, html: tmpl.html, text: tmpl.text })
  if (res.ok) return { ok: true }
  return { ok: false, reason: res.reason === 'send_failed' ? 'final_failure' : 'transient' }
}
