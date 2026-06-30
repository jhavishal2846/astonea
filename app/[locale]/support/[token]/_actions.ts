'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tickets, users } from '@/lib/db/schema'
import { issueOtp, verifyOtp } from '@/lib/otp'
import { hashIp, ipFromHeaders } from '@/lib/tickets/ip'
import { getTicketByPublicToken, postMessage } from '@/lib/tickets/service'
import { putObject } from '@/lib/storage'
import { sendEmail } from '@/lib/email'
import { ticketRepliedTemplate } from '@/lib/email/templates/ticket-replied'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { PUBLIC_ATTACHMENT_MAX_BYTES, PUBLIC_ATTACHMENT_MIME_ALLOWLIST } from '@/lib/tickets/types'

/**
 * Submitter-side reply actions. Read access requires only the token (delivered
 * by email at create time). Write access requires a fresh OTP — defaults to
 * email since we already have a verified address on the ticket; the user can
 * opt into SMS instead.
 */

export type RequestReplyOtpResult = { ok: true; destinationMasked: string } | { error: string }
export type PostReplyResult = { ok: true } | { error: string }

function maskEmail(e: string): string {
  const [user, host] = e.split('@')
  if (!host) return '•••@•••'
  const u = user.length <= 2 ? user[0] + '•' : user.slice(0, 2) + '•'.repeat(Math.max(1, user.length - 2))
  return `${u}@${host}`
}

function maskPhone(p: string): string {
  if (p.length <= 4) return p
  return p.slice(0, p.length - 4).replace(/\d/g, '•') + p.slice(-4)
}

export async function requestReplyOtp(
  token: string,
  channel: 'email' | 'sms',
): Promise<RequestReplyOtpResult> {
  const ticket = await getTicketByPublicToken(token)
  if (!ticket) return { error: 'Ticket not found.' }

  const reqHeaders = await headers()
  const ipHash = await hashIp(ipFromHeaders(reqHeaders))
  const destination = channel === 'sms' ? ticket.submitterPhone : ticket.submitterEmail

  const res = await issueOtp({
    channel,
    destination,
    purpose: 'ticket_reply',
    ipHash,
    locale: ticket.submitterLocale,
  })
  if (!res.ok) {
    if (res.reason === 'rate_limited') {
      const mins = Math.ceil((res.retryAfterMs ?? 0) / 60_000)
      return { error: `Too many requests. Try again in about ${Math.max(1, mins)} minute(s).` }
    }
    return { error: "Couldn't send the code. Try the other channel." }
  }
  return {
    ok: true,
    destinationMasked: channel === 'sms' ? maskPhone(ticket.submitterPhone) : maskEmail(ticket.submitterEmail),
  }
}

export async function postSubmitterReply(
  token: string,
  formData: FormData,
): Promise<PostReplyResult> {
  const ticket = await getTicketByPublicToken(token)
  if (!ticket) return { error: 'Ticket not found.' }

  const body = String(formData.get('body') ?? '').trim()
  const code = String(formData.get('code') ?? '').trim()
  const channel = String(formData.get('channel') ?? 'email') === 'sms' ? 'sms' : 'email'

  if (!body || body.length < 2) return { error: 'Please write a message.' }
  if (!/^\d{6}$/.test(code)) return { error: 'Enter the 6-digit code.' }

  const destination = channel === 'sms' ? ticket.submitterPhone : ticket.submitterEmail
  const verify = await verifyOtp({ channel, destination, purpose: 'ticket_reply', code })
  if (!verify.ok) {
    return {
      error:
        verify.reason === 'expired'
          ? 'That code has expired. Request a new one.'
          : verify.reason === 'attempts_exhausted'
          ? 'Too many wrong attempts. Request a new code.'
          : 'That code is not correct.',
    }
  }

  // Validate + upload attachments (smaller cap, allow-listed mime types).
  const files = formData.getAll('attachments').filter((v): v is File => v instanceof File && v.size > 0)
  const attachments: Array<{ filename: string; mimeType: string; sizeBytes: number; r2Key: string }> = []
  for (const file of files) {
    if (file.size > PUBLIC_ATTACHMENT_MAX_BYTES) {
      return { error: `"${file.name}" is larger than 25 MB.` }
    }
    if (!PUBLIC_ATTACHMENT_MIME_ALLOWLIST.some((p) => file.type.startsWith(p))) {
      return { error: `"${file.name}" is not an allowed file type.` }
    }
    const safeName = file.name.replaceAll(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
    const key = `tickets/${ticket.id}/reply/${crypto.randomUUID()}/${safeName}`
    await putObject(key, file, file.type || 'application/octet-stream')
    attachments.push({
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      r2Key: key,
    })
  }

  await postMessage({
    ticketId: ticket.id,
    body,
    authorType: 'submitter',
    visibility: 'public',
    attachments,
    uploaderType: 'submitter',
  })

  revalidatePath(`/${ticket.submitterLocale}/support/${token}`)

  // Notify the currently-assigned admin (if any) by email.
  after(async () => {
    if (!ticket.assignedToUserId) return
    const assignee = (
      await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, ticket.assignedToUserId!))
        .limit(1)
    )[0]
    if (!assignee) return
    const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
    const host = (await headers()).get('host') ?? 'astonea.org'
    const proto = (await headers()).get('x-forwarded-proto') ?? 'https'
    const adminUrl = `${env.SITE_ORIGIN ?? `${proto}://${host}`}/admin/tickets/${ticket.id}`
    const tmpl = ticketRepliedTemplate({
      shortCode: ticket.shortCode,
      subject: ticket.subject,
      submitterName: ticket.submitterName,
      replyBody: body,
      statusUrl: adminUrl,
    })
    await sendEmail({ to: assignee.email, subject: `[FOLLOW-UP] ${tmpl.subject}`, html: tmpl.html, text: tmpl.text })
  })

  // Touch updated_at so the admin inbox sorts this ticket to the top.
  await db.update(tickets).set({ updatedAt: new Date() }).where(eq(tickets.id, ticket.id))
  return { ok: true }
}
