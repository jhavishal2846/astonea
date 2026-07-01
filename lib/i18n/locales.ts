import 'server-only'
import { unstable_cache } from 'next/cache'
import { eq, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, type Language } from '@/lib/db/schema'

export const DEFAULT_LOCALE = 'en'

export const LOCALES_TAG = 'i18n:locales'

async function fetchActiveLocales(): Promise<Language[]> {
  // Do NOT swallow DB errors here: this function is wrapped in `unstable_cache`,
  // which would otherwise persist an empty result for the full revalidate window
  // and break every non-default locale until the tag is invalidated. Let the
  // error propagate so nothing gets cached; callers (middleware) decide how to
  // degrade for the current request.
  return db
    .select()
    .from(languages)
    .where(eq(languages.isActive, true))
    .orderBy(asc(languages.displayOrder), asc(languages.code))
}

export const getActiveLocales = unstable_cache(
  fetchActiveLocales,
  ['i18n-active-locales'],
  { tags: [LOCALES_TAG], revalidate: 3600 },
)

export async function getActiveLocaleCodes(): Promise<string[]> {
  const rows = await getActiveLocales()
  if (rows.length === 0) return [DEFAULT_LOCALE]
  return rows.map((r) => r.code)
}

export async function isActiveLocale(code: string): Promise<boolean> {
  const codes = await getActiveLocaleCodes()
  return codes.includes(code)
}
