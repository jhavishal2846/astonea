import 'server-only'

/**
 * 6-digit OTP from a CSPRNG. We draw a Uint32, reject the biased tail
 * (the range above floor(2^32 / 1_000_000) * 1_000_000), and reduce — so the
 * output is uniform across [0, 999_999]. Zero-pad to keep the visual length
 * constant on the wire.
 *
 * `Math.random` would also produce 6 digits, but its distribution is implementation-
 * dependent and not suitable for security-sensitive codes. WebCrypto is
 * available on every Workers runtime.
 */
const RANGE = 1_000_000
const REJECT_THRESHOLD = Math.floor(0x100000000 / RANGE) * RANGE

export function generateCode(): string {
  const buf = new Uint32Array(1)
  let n: number
  do {
    crypto.getRandomValues(buf)
    n = buf[0]
  } while (n >= REJECT_THRESHOLD)
  return (n % RANGE).toString().padStart(6, '0')
}
