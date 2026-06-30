import { emailShell, escapeHtml } from './_layout'

export function ticketRepliedTemplate({
  shortCode,
  subject,
  submitterName,
  replyBody,
  statusUrl,
}: {
  shortCode: string
  subject: string
  submitterName: string
  replyBody: string
  statusUrl: string
}): { subject: string; html: string; text: string } {
  const subj = `[${shortCode}] New reply on your enquiry`
  const text = `Hi ${submitterName},\n\nYour Astonea enquiry "${subject}" has a new reply:\n\n${replyBody}\n\nView the full thread and respond at:\n${statusUrl}\n\n— Astonea Labs`
  const html = emailShell({
    preheader: `New reply on ${shortCode}: ${subject}`,
    body: `
      <p style="margin:0 0 14px;">Hi ${escapeHtml(submitterName)},</p>
      <p style="margin:0 0 14px;">Our team has replied to your enquiry <strong>${escapeHtml(shortCode)}</strong> — <em>${escapeHtml(subject)}</em>:</p>
      <div style="margin:0 0 22px;padding:14px 16px;background:#f1f5f9;border-radius:6px;border-left:3px solid #0f172a;white-space:pre-wrap;font-size:14px;line-height:1.55;">${escapeHtml(replyBody)}</div>
      <p style="margin:0;"><a href="${escapeHtml(statusUrl)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600;font-size:13px;">View &amp; reply</a></p>
    `,
  })
  return { subject: subj, html, text }
}
