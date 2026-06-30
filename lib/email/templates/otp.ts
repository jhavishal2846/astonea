import { emailShell, escapeHtml } from './_layout'

/**
 * Transactional template for the 6-digit verification code. We intentionally
 * keep it brutally short — long marketing-style OTP emails get caught in spam
 * filters more often than terse single-purpose ones.
 */
export function otpEmailTemplate({ code }: { code: string; locale: string }): {
  subject: string
  html: string
  text: string
} {
  const subject = `Astonea verification code: ${code}`
  const text = `Your Astonea verification code is ${code}.\n\nIt expires in 10 minutes. Do not share this code with anyone.\n\nIf you didn't request this code, you can ignore this email.`
  const html = emailShell({
    preheader: `Your verification code is ${code}. Expires in 10 minutes.`,
    body: `
      <p style="margin:0 0 14px;">Enter this code on the Astonea form to continue:</p>
      <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:32px;letter-spacing:.32em;font-weight:700;background:#f1f5f9;border-radius:8px;padding:18px 24px;text-align:center;margin:8px 0 22px;">${escapeHtml(code)}</div>
      <p style="margin:0 0 8px;color:#475569;">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
      <p style="margin:0;color:#475569;">If you didn't request this code, you can safely ignore this email.</p>
    `,
  })
  return { subject, html, text }
}
