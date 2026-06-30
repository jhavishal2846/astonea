import 'server-only'

/**
 * Hash the request IP with a daily-rotating salt so we can do abuse counting
 * (rate limits, repeated submissions from the same source) without ever
 * persisting raw IPs to D1. Salt rotates at UTC midnight — a determined
 * abuser running across a day boundary appears as two distinct keys for ~one
 * day, which we accept as the privacy/utility trade-off.
 */
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function dailySalt(): string {
  const now = new Date()
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`
}

export async function hashIp(ip: string): Promise<string> {
  return sha256Hex(`${dailySalt()}|${ip}`)
}

/** Best-effort IP extraction. Cloudflare always sets CF-Connecting-IP; we fall back through the usual chain. */
export function ipFromHeaders(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}
