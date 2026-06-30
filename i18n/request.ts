import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { DEFAULT_LOCALE, getActiveLocaleCodes } from '@/lib/i18n/locales'
import { getUiStrings, nestStrings } from '@/lib/i18n/ui-strings'
import { DEFAULT_UI_STRINGS_EN } from '@/lib/i18n/default-messages'

export default getRequestConfig(async ({ requestLocale }) => {
  // Prefer the middleware-set `x-locale` header — it's set unconditionally on
  // every public request and survives async-context boundaries. `requestLocale`
  // depends on `setRequestLocale()` propagating through next-intl's
  // AsyncLocalStorage, which silently breaks on Next 16 server components and
  // leaves the navbar/footer rendered in English under a Spanish page.
  let requested: string | undefined
  try {
    const h = await headers()
    requested = h.get('x-locale') ?? undefined
  } catch {
    // headers() unavailable — fall back to requestLocale.
  }
  if (!requested) requested = await requestLocale
  const active = await getActiveLocaleCodes()
  const locale = hasLocale(active, requested) ? requested : DEFAULT_LOCALE

  // Build the message catalog:
  //   baseline English defaults
  //     ← overridden by English DB rows (admin edits)
  //     ← overridden by non-default-locale DB rows for the requested locale
  // The result is then nested by dotted-key namespace so useTranslations('nav')
  // looks up `nav.about` etc.
  const dbEnglish = await getUiStrings(DEFAULT_LOCALE)
  const dbLocale = locale === DEFAULT_LOCALE ? {} : await getUiStrings(locale)
  const flat = { ...DEFAULT_UI_STRINGS_EN, ...dbEnglish, ...dbLocale }

  return {
    locale,
    messages: nestStrings(flat) as Record<string, string>,
  }
})
