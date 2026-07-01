import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getActiveLocaleCodes, DEFAULT_LOCALE } from '@/lib/i18n/locales'

const SESSION_COOKIE = 'astonea_session'

// Middleware runs on every public request. `unstable_cache` is unreliable
// here (especially in dev), so memoize the locale list at module level with
// a short TTL — admin language toggles propagate within TTL_MS.
const LOCALES_TTL_MS = 60_000
let localesCache: { codes: string[]; expiresAt: number } | null = null

async function getCachedLocaleCodes(): Promise<string[]> {
  const now = Date.now()
  if (localesCache && localesCache.expiresAt > now) return localesCache.codes
  try {
    const codes = await getActiveLocaleCodes()
    localesCache = { codes, expiresAt: now + LOCALES_TTL_MS }
    return codes
  } catch {
    // D1 not warm yet (cold start) or a transient failure. Fail open with the
    // default locale for this request only — do NOT populate `localesCache`,
    // so the next request retries instead of serving broken non-default
    // locales for the full TTL.
    return [DEFAULT_LOCALE]
  }
}

// Kick off the locale fetch as soon as the middleware module loads so the
// first request doesn't pay the cold DB hit. Silent failure: if the DB isn't
// ready yet, the request-time call will retry.
void getCachedLocaleCodes().catch(() => {})

/**
 * Edge-runtime middleware (`middleware.ts`).
 *
 * In Next.js 16 the file convention was renamed `middleware.ts` → `proxy.ts`,
 * and `proxy.ts` is locked to the Node.js runtime (the `runtime` config option
 * is rejected there). OpenNext for Cloudflare 1.x does not yet support
 * Node.js middleware, so for the Cloudflare deployment we keep the
 * still-supported legacy `middleware.ts` convention with `runtime = 'edge'`.
 *
 * Two responsibilities — order matters:
 *   1. /admin gate: redirect unauthenticated admins to /admin/login.
 *   2. i18n routing: rewrite `/about-us` → `/en/about-us` internally, and
 *      pass through `/hi/about-us` etc. for non-default locales. Active
 *      locales are read from the `languages` table at request time
 *      (memoized 60s at module level — `unstable_cache` is unreliable in
 *      middleware) so admins can add a language and have it live without
 *      redeploying.
 *
 * Note: do not export `runtime = 'edge'` here. In Next.js 16 the legacy
 * `middleware.ts` convention still defaults to the Edge runtime, and
 * explicitly setting `runtime` triggers the page-runtime validator which
 * demands the experimental name instead. The bare middleware file is what
 * OpenNext for Cloudflare expects.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE)
  // CMS in-place editing: only honour `?edit=1` when the visitor has an admin
  // session. We forward it to the page via a request header so the layout
  // and content components can switch into edit mode.
  const editMode = searchParams.get('edit') === '1' && hasSession

  // ─── Admin auth ──────────────────────────────────────────────────────
  if (pathname === '/admin/login' && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  // Admin routes don't need locale rewriting.
  if (pathname.startsWith('/admin')) return NextResponse.next()

  // ─── i18n routing ────────────────────────────────────────────────────
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0] ?? ''
  const locales = await getCachedLocaleCodes()

  // URL already carries a non-default locale prefix.
  if (locales.includes(first) && first !== DEFAULT_LOCALE) {
    const headers = new Headers(request.headers)
    headers.set('x-locale', first)
    headers.set('x-pathname', pathname)
    if (editMode) headers.set('x-cms-edit', '1')
    return NextResponse.next({ request: { headers } })
  }

  // Strip an accidentally-prefixed /en
  if (first === DEFAULT_LOCALE) {
    const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
    const url = request.nextUrl.clone()
    url.pathname = stripped
    return NextResponse.redirect(url)
  }

  // No locale prefix → default English. Rewrite internally to /en/<rest>
  // so the [locale] dynamic segment matches without changing the URL.
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  url.search = search
  const headers = new Headers(request.headers)
  headers.set('x-locale', DEFAULT_LOCALE)
  headers.set('x-pathname', pathname)
  if (editMode) headers.set('x-cms-edit', '1')
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Run on admin AND public routes; skip Next internals, api, static assets.
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
}
