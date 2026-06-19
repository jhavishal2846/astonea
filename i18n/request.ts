import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { DEFAULT_LOCALE, getActiveLocaleCodes } from '@/lib/i18n/locales'
import { getUiStrings, nestStrings } from '@/lib/i18n/ui-strings'
import { DEFAULT_UI_STRINGS_EN } from '@/lib/i18n/default-messages'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
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
