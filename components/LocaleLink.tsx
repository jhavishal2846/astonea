'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { ComponentProps } from 'react'

const DEFAULT_LOCALE = 'en'

/**
 * A drop-in replacement for `next/link` that prefixes the current locale to
 * internal hrefs. Default-locale ('en') links stay bare; non-default
 * locales get a `/<code>` prefix so navigation through the nav, footer, or
 * page bodies preserves the active language.
 *
 * Hrefs are left untouched when:
 *   - the locale is the default
 *   - the href is an absolute URL (`http(s)://…`)
 *   - the href is an anchor (`#…`) or mailto/tel (`mailto:`, `tel:`)
 *   - the href is already prefixed with the active locale
 */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const locale = useLocale()

  if (typeof href !== 'string' || locale === DEFAULT_LOCALE) {
    return <Link href={href} {...rest} />
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return <Link href={href} {...rest} />
  }

  const prefix = `/${locale}`
  const localized =
    href === '/' ? prefix : href.startsWith(`${prefix}/`) || href === prefix ? href : `${prefix}${href.startsWith('/') ? href : `/${href}`}`

  return <Link href={localized} {...rest} />
}
