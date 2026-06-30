import 'server-only'
import type { ReactNode } from 'react'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { pageTextOverrides } from '@/lib/db/schema'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

export function pageTextTag(path: string) {
  return `page-text:${path}`
}
export function pageTextLocaleTag(path: string, locale: string) {
  return `page-text:${path}:${locale}`
}

async function currentLocale(): Promise<string> {
  // Prefer the middleware-set `x-locale` header — it's set unconditionally
  // before the layout runs and survives whether or not `setRequestLocale()`
  // propagated to this async scope. `getLocale()` from next-intl only works
  // when setRequestLocale has been seen in the SAME async context (it uses
  // AsyncLocalStorage), which silently breaks inside child pages on Next 16
  // server components and was the cause of pages rendering English bodies
  // under a Spanish hero.
  try {
    const h = await headers()
    const headerLocale = h.get('x-locale')
    if (headerLocale && headerLocale.length > 0) return headerLocale
  } catch {
    // headers() may throw outside a request context (e.g. unstable_cache
    // inner function) — fall through to getLocale.
  }
  try {
    return await getLocale()
  } catch {
    return DEFAULT_LOCALE
  }
}

async function isEditModeActive(): Promise<boolean> {
  try {
    const h = await headers()
    return h.get('x-cms-edit') === '1'
  } catch {
    return false
  }
}

async function loadOverridesMap(
  path: string,
  locale: string,
): Promise<Record<string, string>> {
  try {
    const rows = await db
      .select({ key: pageTextOverrides.key, value: pageTextOverrides.value })
      .from(pageTextOverrides)
      .where(
        and(
          eq(pageTextOverrides.pagePath, path),
          eq(pageTextOverrides.locale, locale),
        ),
      )
    const out: Record<string, string> = {}
    for (const r of rows) out[r.key] = r.value
    return out
  } catch {
    return {}
  }
}

const cached = (path: string, locale: string) =>
  unstable_cache(
    () => loadOverridesMap(path, locale),
    ['page-text', path, locale],
    {
      tags: [pageTextTag(path), pageTextLocaleTag(path, locale)],
      revalidate: 3600,
    },
  )()

/**
 * Returns the full map of overrides for a page at the request's active locale,
 * falling back to default-locale rows for any key missing in the requested one.
 *
 * In **normal mode** the returned function gives back a plain string.
 *
 * In **edit mode** (admin opened the page with `?edit=1`) the returned function
 * gives back a `<span data-cms-key=…>` wrapper around the text — the
 * `<CmsEditOverlay>` client component picks those up and makes them
 * click-to-edit.
 *
 *   const t = await getPageText('/about-us')
 *   <h2>{t('hero.title', 'About Us')}</h2>
 */
export async function getPageText(path: string) {
  const locale = await currentLocale()
  const editMode = await isEditModeActive()
  const localeMap = await cached(path, locale)
  const defaultMap =
    locale === DEFAULT_LOCALE ? localeMap : await cached(path, DEFAULT_LOCALE)

  return (key: string, fallback: string): ReactNode => {
    const value =
      key in localeMap
        ? localeMap[key]
        : key in defaultMap
        ? defaultMap[key]
        : fallback
    if (!editMode) return value
    return (
      <span
        data-cms-key={key}
        data-cms-path={path}
        data-cms-locale={locale}
        data-cms-default={fallback}
        className="cms-editable"
      >
        {value}
      </span>
    )
  }
}

export async function adminGetOverride(
  path: string,
  key: string,
  locale: string,
): Promise<string | null> {
  const [row] = await db
    .select({ value: pageTextOverrides.value })
    .from(pageTextOverrides)
    .where(
      and(
        eq(pageTextOverrides.pagePath, path),
        eq(pageTextOverrides.key, key),
        eq(pageTextOverrides.locale, locale),
      ),
    )
    .limit(1)
  return row?.value ?? null
}
