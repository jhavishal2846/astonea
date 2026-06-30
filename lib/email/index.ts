import 'server-only'
import { createMimeMessage } from 'mimetext/browser'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Outbound email via the Cloudflare `send_email` Worker binding (declared in
 * wrangler.jsonc as `[[send_email]] name = "EMAIL"`). The binding only accepts
 * RFC 5322 messages and only sends to the destination address it was bound to
 * (Cloudflare enforces this on their side — there is no "send anywhere"
 * primitive on Workers without going through a third-party SMTP provider).
 *
 * `from` defaults to `EMAIL_FROM_ADDRESS` (Workers secret/var) but the calling
 * domain has to publish SPF / DKIM that authorises Cloudflare to send on its
 * behalf, otherwise major inboxes will reject. See `cloudflare-email-service`
 * skill for the deliverability setup.
 *
 * We use `mimetext/browser` because the Node entrypoint pulls in `node:crypto`
 * helpers that opennext-cloudflare doesn't always polyfill cleanly.
 */
type SendInput = {
  to: string
  subject: string
  html: string
  text: string
  from?: { address: string; name?: string }
  /** Extra RFC 5322 headers (e.g. Reply-To, In-Reply-To for threading). */
  headers?: Record<string, string>
}

type SendEmailBinding = {
  send(message: unknown): Promise<unknown>
}

let _EmailMessage: (new (from: string, to: string, raw: string) => unknown) | null | undefined

async function loadEmailMessage() {
  if (_EmailMessage !== undefined) return _EmailMessage
  try {
    // Dynamic import — the module is only available on the Workers runtime.
    // On `next dev` (Node) the import throws and we fall back to a no-op.
    const mod = (await import(/* webpackIgnore: true */ 'cloudflare:email')) as {
      EmailMessage: new (from: string, to: string, raw: string) => unknown
    }
    _EmailMessage = mod.EmailMessage
  } catch {
    _EmailMessage = null
  }
  return _EmailMessage
}

function getDefaultFrom() {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const address = env.EMAIL_FROM_ADDRESS ?? 'support@astonea.org'
  const name = env.EMAIL_FROM_NAME ?? 'Astonea Labs'
  return { address, name }
}

function getBinding(): SendEmailBinding | null {
  const env = getCloudflareContext().env as unknown as Record<string, unknown>
  return (env.EMAIL as SendEmailBinding | undefined) ?? null
}

export async function sendEmail(input: SendInput): Promise<{ ok: true } | { ok: false; reason: string }> {
  const binding = getBinding()
  const from = input.from ?? getDefaultFrom()

  const msg = createMimeMessage()
  msg.setSender({ name: from.name, addr: from.address })
  msg.setRecipient(input.to)
  msg.setSubject(input.subject)
  msg.addMessage({ contentType: 'text/plain', data: input.text })
  msg.addMessage({ contentType: 'text/html', data: input.html })
  for (const [k, v] of Object.entries(input.headers ?? {})) {
    msg.setHeader(k, v)
  }

  if (!binding) {
    // No Workers binding (local `next dev` outside the worker runtime, or
    // missing wrangler config). Log the raw message so devs can see what would
    // have gone out — never include the rendered email body in production logs.
    if (process.env.NODE_ENV !== 'production') {
      console.info('[email] (no binding) would send →', input.to, input.subject)
    } else {
      console.warn('[email] EMAIL binding missing — message dropped', { to: input.to })
    }
    return { ok: false, reason: 'binding_missing' }
  }

  const EmailMessage = await loadEmailMessage()
  if (!EmailMessage) {
    console.warn('[email] cloudflare:email module unavailable — message dropped', { to: input.to })
    return { ok: false, reason: 'module_missing' }
  }

  try {
    const raw = msg.asRaw()
    const message = new EmailMessage(from.address, input.to, raw)
    await binding.send(message)
    return { ok: true }
  } catch (err) {
    console.error('[email] send failed', err)
    return { ok: false, reason: 'send_failed' }
  }
}
