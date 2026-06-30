import { emailShell, escapeHtml } from './_layout'

export function ticketAdminNotifyTemplate({
  shortCode,
  subject,
  submitterName,
  submitterEmail,
  submitterPhone,
  bodyPreview,
  adminUrl,
}: {
  shortCode: string
  subject: string
  submitterName: string
  submitterEmail: string
  submitterPhone: string
  bodyPreview: string
  adminUrl: string
}): { subject: string; html: string; text: string } {
  const subj = `New ticket ${shortCode}: ${subject}`
  const text = `New ticket ${shortCode}\n\nFrom: ${submitterName} <${submitterEmail}> ${submitterPhone}\nSubject: ${subject}\n\n${bodyPreview}\n\nOpen: ${adminUrl}`
  const html = emailShell({
    preheader: `New ticket ${shortCode} from ${submitterName}`,
    body: `
      <p style="margin:0 0 8px;color:#64748b;font-size:12px;letter-spacing:.06em;font-weight:600;">NEW TICKET · ${escapeHtml(shortCode)}</p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:600;">${escapeHtml(subject)}</p>
      <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:13px;color:#475569;margin:0 0 16px;">
        <tr><td style="padding:2px 0;width:80px;color:#94a3b8;">From</td><td>${escapeHtml(submitterName)} &lt;${escapeHtml(submitterEmail)}&gt;</td></tr>
        <tr><td style="padding:2px 0;color:#94a3b8;">Phone</td><td>${escapeHtml(submitterPhone)}</td></tr>
      </table>
      <p style="margin:0 0 18px;padding:12px 14px;background:#f8fafc;border-radius:6px;white-space:pre-wrap;">${escapeHtml(bodyPreview)}</p>
      <p style="margin:0;"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600;font-size:13px;">Open in admin</a></p>
    `,
  })
  return { subject: subj, html, text }
}
