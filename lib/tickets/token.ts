import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Public ticket tokens: `<random:43>.<sig:43>` — both base64url, no padding.
 *
 * The 32-byte random half is the unguessable handle; the HMAC half binds it to
 * our server secret so an attacker can't forge a valid-looking token even if
 * they discover the format. Rotating `TICKET_TOKEN_SECRET` invalidates every
 * outstanding link (intentional — useful for incident response). We don't put
 * any ticket data inside the token itself; lookup is by the random half against
 * `tickets.public_token`, so there's no payload to leak.
 */

const RANDOM_BYTES = 32
const SECRET_NAME = 'TICKET_TOKEN_SECRET'

function getSecret(): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  const v = env[SECRET_NAME]
  if (!v || v.length < 32) {
    throw new Error(
      `${SECRET_NAME} missing or too short — set via \`wrangler secret put ${SECRET_NAME}\` (>= 32 chars)`,
    )
  }
  return v
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : ''
  const b64 = (s + pad).replaceAll('-', '+').replaceAll('_', '/')
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmac(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return new Uint8Array(sig)
}

/** Generate a new HMAC-signed public token. The whole string is what gets put in URLs. */
export async function generatePublicToken(): Promise<string> {
  const random = new Uint8Array(RANDOM_BYTES)
  crypto.getRandomValues(random)
  const randomPart = bytesToBase64Url(random)
  const sig = await hmac(getSecret(), randomPart)
  const sigPart = bytesToBase64Url(sig)
  return `${randomPart}.${sigPart}`
}

/** Constant-time compare on two equal-length byte arrays. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/**
 * Verify a token and return the random part if the signature is good. Caller
 * looks the random part up against `tickets.public_token` — we store the whole
 * `<random>.<sig>` string there so an attacker who somehow guesses a random
 * half still can't construct the matching signature without the secret.
 *
 * Returns `null` on any failure (bad shape, bad sig, etc) — never throws, never
 * reveals which check failed.
 */
export async function verifyPublicToken(token: string): Promise<string | null> {
  const dot = token.indexOf('.')
  if (dot <= 0 || dot >= token.length - 1) return null
  const randomPart = token.slice(0, dot)
  const sigPart = token.slice(dot + 1)

  let givenSig: Uint8Array
  try {
    givenSig = base64UrlToBytes(sigPart)
  } catch {
    return null
  }

  let expectedSig: Uint8Array
  try {
    expectedSig = await hmac(getSecret(), randomPart)
  } catch {
    return null
  }

  return timingSafeEqual(givenSig, expectedSig) ? token : null
}
