/**
 * Cloudflare Web Analytics beacon. Renders nothing unless
 * `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is set in the deployment env — which is
 * only on the Cloudflare Worker (Phase 5). On Vercel the env var stays
 * unset, so no beacon is emitted there.
 *
 * Vercel Analytics (`@vercel/analytics`) was retired in Phase 1; until the
 * Cloudflare beacon is wired up at cutover, no analytics are emitted.
 */
export default function SiteAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
  if (!token) return null
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  )
}
