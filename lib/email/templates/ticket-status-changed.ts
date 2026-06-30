import { emailShell, escapeHtml } from './_layout'
import { TICKET_STATUS_LABELS } from '@/lib/tickets/types'
import type { TicketStatus } from '@/lib/db/schema'

export function ticketStatusChangedTemplate({
  shortCode,
  subject,
  submitterName,
  toStatus,
  statusUrl,
}: {
  shortCode: string
  subject: string
  submitterName: string
  toStatus: TicketStatus
  statusUrl: string
}): { subject: string; html: string; text: string } {
  const label = TICKET_STATUS_LABELS[toStatus]
  const subj = `[${shortCode}] Status updated: ${label}`
  const text = `Hi ${submitterName},\n\nYour enquiry "${subject}" is now marked: ${label}.\n\nView the thread at:\n${statusUrl}\n\n— Astonea Labs`
  const html = emailShell({
    preheader: `Status now: ${label}`,
    body: `
      <p style="margin:0 0 14px;">Hi ${escapeHtml(submitterName)},</p>
      <p style="margin:0 0 14px;">Your enquiry <strong>${escapeHtml(shortCode)}</strong> — <em>${escapeHtml(subject)}</em> — is now marked <strong>${escapeHtml(label)}</strong>.</p>
      ${toStatus === 'resolved' || toStatus === 'closed' ? `<p style="margin:0 0 18px;color:#475569;">If anything's still outstanding, just reply on the status page and we'll re-open it.</p>` : ''}
      <p style="margin:0;"><a href="${escapeHtml(statusUrl)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600;font-size:13px;">View thread</a></p>
    `,
  })
  return { subject: subj, html, text }
}
