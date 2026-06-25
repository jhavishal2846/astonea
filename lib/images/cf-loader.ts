/**
 * Custom `next/image` loader that routes through Cloudflare Image Resizing.
 *
 * Cloudflare's URL-based transforms are reached via `/cdn-cgi/image/<opts>/<src>`.
 * Relative paths stay relative — Cloudflare resolves them against the current
 * host, so the same build works on the staging domain and on the eventual
 * production domain without rebuilding. Absolute URLs pass through and are
 * fetched as remote origins (must be listed in `next.config.ts`
 * `images.remotePatterns`).
 *
 * `format=auto` lets Cloudflare pick WebP/AVIF per the request's `Accept`
 * header. Requires Workers Paid (Image Resizing is gated behind a paid plan).
 */
export default function cfLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  const params = [`width=${width}`, `quality=${quality ?? 75}`, 'format=auto']
  const target = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`
  return `/cdn-cgi/image/${params.join(',')}/${target}`
}
