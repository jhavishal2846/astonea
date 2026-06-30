import { emailShell, escapeHtml } from './_layout'

/**
 * Submitter confirmation when a ticket is created. Carries the tokenized
 * status-link they can revisit to read replies / post follow-ups.
 */
export function ticketCreatedTemplate({
  shortCode,
  subject,
  statusUrl,
  submitterName,
}: {
  shortCode: string
  subject: string
  statusUrl: string
  submitterName: string
}): { subject: string; html: string; text: string } {
  const subj = `[${shortCode}] We've received your enquiry`
  const text = `Hi ${submitterName},\n\nThanks for getting in touch. We've logged your enquiry as ${shortCode}: "${subject}".\n\nYou can track the status and reply at:\n${statusUrl}\n\nOur team usually responds within one business day.\n\n— Astonea Labs`
  const html = emailShell({
    preheader: `Your enquiry has been logged as ${shortCode}. Track it at the link inside.`,
    body: `
      <p style="margin:0 0 14px;">Hi ${escapeHtml(submitterName)},</p>
      <p style="margin:0 0 14px;">Thanks for getting in touch — we've logged your enquiry as <strong>${escapeHtml(shortCode)}</strong>:</p>
      <p style="margin:0 0 18px;padding:12px 14px;background:#f1f5f9;border-radius:6px;border-left:3px solid #0f172a;">${escapeHtml(subject)}</p>
      <p style="margin:0 0 6px;">You can view replies and post follow-ups here:</p>
      <p style="margin:0 0 22px;"><a href="${escapeHtml(statusUrl)}" style="color:#0f172a;font-weight:600;text-decoration:underline;">${escapeHtml(statusUrl)}</a></p>
      <p style="margin:0 0 14px;color:#475569;">For security, posting a reply requires a fresh code sent to your phone or email.</p>
      <p style="margin:0;color:#475569;">Our team usually responds within one business day.</p>
    `,
  })
  return { subject: subj, html, text }
}
