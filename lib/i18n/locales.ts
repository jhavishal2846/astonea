import 'server-only'
import { unstable_cache } from 'next/cache'
import { eq, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, type Language } from '@/lib/db/schema'

export const DEFAULT_LOCALE = 'en'

export const LOCALES_TAG = 'i18n:locales'

async function fetchActiveLocales(): Promise<Language[]> {
  try {
    return await db
      .select()
      .from(languages)
      .where(eq(languages.isActive, true))
      .orderBy(asc(languages.displayOrder), asc(languages.code))
  } catch {
    return []
  }
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
