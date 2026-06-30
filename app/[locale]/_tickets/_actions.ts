'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ticketCategories } from '@/lib/db/schema'
import { issueOtp, verifyOtp } from '@/lib/otp'
import { parsePhone } from '@/lib/tickets/phone'
import { hashIp, ipFromHeaders } from '@/lib/tickets/ip'
import { createTicket } from '@/lib/tickets/service'
import { putObject } from '@/lib/storage'
import { sendEmail } from '@/lib/email'
import { ticketCreatedTemplate } from '@/lib/email/templates/ticket-created'
import { ticketAdminNotifyTemplate } from '@/lib/email/templates/ticket-admin-notify'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import {
  PUBLIC_ATTACHMENT_MAX_BYTES,
  PUBLIC_ATTACHMENT_MIME_ALLOWLIST,
} from '@/lib/tickets/types'
import type { TicketSource } from '@/lib/db/schema'

/**
 * Public-facing ticket actions. Two-step flow:
 *
 *   1. `requestSubmissionOtp` — validates the form, normalises the phone to
 *      E.164, runs the bot-gate (honeypot + Turnstile), and dispatches a
 *      6-digit OTP via Twilio SMS (or email if the caller selected fallback).
 *   2. `submitTicket` — re-validates everything, verifies the OTP, and
 *      creates the ticket + first message + attachments.
 *
 * Errors are returned as `{ error: string }` with deliberately generic wording
 * — never reveal which check failed (whether the phone is on the system, which
 * country triggered the rate limit, etc.).
 */

export type RequestOtpResult = { ok: true } | { error: string }
export type SubmitTicketResult =
  | { ok: true; token: string; shortCode: string; locale: string }
  | { error: string }

function trimmedString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}

function siteOrigin(reqHeaders: Headers): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const fromEnv = env.SITE_ORIGIN
  if (fromEnv) return fromEnv
  const host = reqHeaders.get('host') ?? 'astonea.org'
  const proto = reqHeaders.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}`
}

async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const secret = env.TURNSTILE_SECRET_KEY
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  // Turnstile is only enforced when BOTH the secret AND the public site key are
  // configured — that's the signal that the form is actually rendering a widget
  // capable of producing a token. Setting only the secret (a common dev/staging
  // half-config) silently skips the check rather than blocking every submission.
  if (!secret || !siteKey) return true
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success: boolean }
    return !!data.success
  } catch {
    return false
  }
}

export async function requestSubmissionOtp(formData: FormData): Promise<RequestOtpResult> {
  const reqHeaders = await headers()
  const ip = ipFromHeaders(reqHeaders)
  const ipHash = await hashIp(ip)

  // Honeypot — bots fill every visible field.
  if (trimmedString(formData, 'website')) {
    return { error: 'Submission rejected.' }
  }

  const channel = trimmedString(formData, 'otpChannel') === 'email' ? 'email' : 'sms'
  const countryIso2 = trimmedString(formData, 'countryIso2') || 'IN'
  const phoneNational = trimmedString(formData, 'phone')
  const email = trimmedString(formData, 'email').toLowerCase()
  const message = trimmedString(formData, 'message')
  const name = trimmedString(formData, 'name')
  const turnstileToken = (formData.get('turnstileToken') as string | null) ?? null

  // Validate the same fields submitTicket will require, so we don't burn an SMS
  // credit on a submission that's guaranteed to fail at step 2.
  if (!name) return { error: 'Please enter your name.' }
  if (!email || !email.includes('@')) {
    return { error: 'A valid email address is required.' }
  }
  if (message.length < 5) {
    return { error: 'Please write a short message (at least 5 characters).' }
  }

  const phone = parsePhone(countryIso2, phoneNational)
  if (!phone.ok) {
    return {
      error:
        phone.reason === 'unsupported_country'
          ? 'That country is not supported. Choose another from the list.'
          : "That mobile number doesn't look right. Check the country code and digits.",
    }
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { error: 'Bot check failed. Refresh the page and try again.' }
  }

  const destination = channel === 'sms' ? phone.phone.e164 : email
  const res = await issueOtp({
    channel,
    destination,
    purpose: 'ticket_create',
    ipHash,
    countryIso2: phone.phone.iso2,
    locale: trimmedString(formData, 'locale') || 'en',
  })
  if (!res.ok) {
    if (res.reason === 'rate_limited') {
      const mins = Math.ceil((res.retryAfterMs ?? 0) / 60_000)
      return { error: `Too many requests. Try again in about ${Math.max(1, mins)} minute(s).` }
    }
    if (res.reason === 'unsupported_country') {
      return { error: 'That country is not supported for verification.' }
    }
    if (res.reason === 'channel_failed') {
      return {
        error:
          channel === 'sms'
            ? "Couldn't send a code by SMS. Choose 'Send code by email instead' and try again."
            : "Couldn't send a code by email. Please try SMS instead.",
      }
    }
    return { error: 'Could not send the code. Try again shortly.' }
  }
  return { ok: true }
}

async function uploadAttachments(
  files: File[],
  source: TicketSource,
): Promise<
  | { ok: true; attachments: Array<{ filename: string; mimeType: string; sizeBytes: number; r2Key: string }> }
  | { error: string }
> {
  const attachments: Array<{ filename: string; mimeType: string; sizeBytes: number; r2Key: string }> = []
  for (const file of files) {
    if (!file || typeof file === 'string') continue
    if (!(file instanceof File) || file.size === 0) continue
    if (file.size > PUBLIC_ATTACHMENT_MAX_BYTES) {
      return { error: `"${file.name}" is larger than 25 MB.` }
    }
    if (!PUBLIC_ATTACHMENT_MIME_ALLOWLIST.some((p) => file.type.startsWith(p))) {
      return { error: `"${file.name}" is not an allowed file type.` }
    }
    const safeName = file.name.replaceAll(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
    const key = `tickets/inbox/${source}/${crypto.randomUUID()}/${safeName}`
    await putObject(key, file, file.type || 'application/octet-stream')
    attachments.push({
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      r2Key: key,
    })
  }
  return { ok: true, attachments }
}

export async function submitTicket(formData: FormData): Promise<SubmitTicketResult> {
  const reqHeaders = await headers()
  const ip = ipFromHeaders(reqHeaders)
  const ipHash = await hashIp(ip)
  const userAgent = reqHeaders.get('user-agent') ?? null

  if (trimmedString(formData, 'website')) return { error: 'Submission rejected.' }

  // Only one public source today (the /support form). `admin_created` is
  // reserved for when an admin opens a ticket on a customer's behalf and
  // never comes in via this action.
  const source: TicketSource = 'support_form'

  const name = trimmedString(formData, 'name')
  const email = trimmedString(formData, 'email').toLowerCase()
  const phoneNational = trimmedString(formData, 'phone')
  const countryIso2 = trimmedString(formData, 'countryIso2') || 'IN'
  const company = trimmedString(formData, 'company') || null
  const city = trimmedString(formData, 'city') || null
  const message = trimmedString(formData, 'message')
  const categorySlug = trimmedString(formData, 'categorySlug')
  const locale = trimmedString(formData, 'locale') || 'en'
  const code = trimmedString(formData, 'code')
  const channel = trimmedString(formData, 'otpChannel') === 'email' ? 'email' : 'sms'

  if (!name) return { error: 'Name is required.' }
  if (!email.includes('@')) return { error: 'A valid email address is required.' }
  if (!message || message.length < 5) return { error: 'Please write a short message.' }
  if (!/^\d{6}$/.test(code)) return { error: 'Enter the 6-digit code.' }

  const phone = parsePhone(countryIso2, phoneNational)
  if (!phone.ok) return { error: 'That phone number is not valid for the selected country.' }

  const destination = channel === 'sms' ? phone.phone.e164 : email
  const verify = await verifyOtp({
    channel,
    destination,
    purpose: 'ticket_create',
    code,
  })
  if (!verify.ok) {
    return {
      error:
        verify.reason === 'expired'
          ? 'That code has expired. Request a new one.'
          : verify.reason === 'attempts_exhausted'
          ? 'Too many wrong attempts. Request a new code.'
          : verify.reason === 'consumed'
          ? 'That code has already been used.'
          : 'That code is not correct.',
    }
  }

  // Category lookup is best-effort — submitter UI may not have it.
  let categoryId: string | null = null
  if (categorySlug) {
    const row = (
      await db
        .select({ id: ticketCategories.id })
        .from(ticketCategories)
        .where(eq(ticketCategories.slug, categorySlug))
        .limit(1)
    )[0]
    categoryId = row?.id ?? null
  }

  // Attachments (career-form CV, contact-form optional files).
  const files = formData.getAll('attachments').filter((v): v is File => v instanceof File)
  const uploadRes = await uploadAttachments(files, source)
  if ('error' in uploadRes) return { error: uploadRes.error }

  // Subject: explicit field on career form; first 80 chars of message on contact form.
  const subjectRaw = trimmedString(formData, 'subject')
  const subject =
    subjectRaw ||
    (message.length > 80 ? `${message.slice(0, 77)}...` : message) ||
    'Enquiry'

  const created = await createTicket({
    submitterName: name,
    submitterEmail: email,
    submitterPhone: phone.phone.e164,
    submitterCompany: company,
    submitterCity: city,
    submitterLocale: locale,
    subject,
    body: message,
    source,
    categoryId,
    ipAddressHash: ipHash,
    userAgent,
    attachments: uploadRes.attachments,
  })

  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const origin = siteOrigin(reqHeaders)
  const statusUrl = `${origin}/${locale}/support/${created.publicToken}`
  const adminUrl = `${origin}/admin/tickets/${created.id}`
  const notifyTo = env.TICKET_NOTIFY_ADDRESS ?? env.EMAIL_FROM_ADDRESS ?? 'support@astonea.org'

  after(async () => {
    const tmpl = ticketCreatedTemplate({
      shortCode: created.shortCode,
      subject,
      statusUrl,
      submitterName: name,
    })
    await sendEmail({ to: email, subject: tmpl.subject, html: tmpl.html, text: tmpl.text })
  })

  after(async () => {
    const tmpl = ticketAdminNotifyTemplate({
      shortCode: created.shortCode,
      subject,
      submitterName: name,
      submitterEmail: email,
      submitterPhone: phone.phone.e164,
      bodyPreview: message.length > 800 ? `${message.slice(0, 800)}...` : message,
      adminUrl,
    })
    await sendEmail({ to: notifyTo, subject: tmpl.subject, html: tmpl.html, text: tmpl.text })
  })

  return { ok: true, token: created.publicToken, shortCode: created.shortCode, locale }
}
