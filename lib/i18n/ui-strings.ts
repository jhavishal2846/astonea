import 'server-only'
import { unstable_cache } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { uiStrings } from '@/lib/db/schema'

export function uiStringsTag(locale: string) {
  return `ui-strings:${locale}`
}

async function fetchUiStrings(locale: string): Promise<Record<string, string>> {
  try {
    const rows = await db
      .select({ key: uiStrings.key, value: uiStrings.value })
      .from(uiStrings)
      .where(eq(uiStrings.locale, locale))
    const out: Record<string, string> = {}
    for (const r of rows) out[r.key] = r.value
    return out
  } catch {
    return {}
  }
}

export function getUiStrings(locale: string) {
  const cached = unstable_cache(
    () => fetchUiStrings(locale),
    ['ui-strings', locale],
    { tags: [uiStringsTag(locale), 'ui-strings:all'], revalidate: 3600 },
  )
  return cached()
}

/**
 * Convert flat dotted keys ('nav.about', 'cta.read_more') into a nested
 * object so next-intl can use namespace lookup (e.g. useTranslations('nav')).
 */
export function nestStrings(flat: Record<string, string>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let cur: Record<string, unknown> = out
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {}
      cur = cur[p] as Record<string, unknown>
    }
    cur[parts[parts.length - 1]] = value
  }
  return out
}
