import 'server-only'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { pageMetadata, pageMetadataTranslations } from '@/lib/db/schema'
import { PAGE_REGISTRY_BY_PATH } from '@/lib/seo/pages-registry'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

export type SeoOverrides = {
  title?: string
  description?: string
  keywords?: string
}

const SITE = {
  siteName: 'Astonea Labs Limited',
  defaultTitle: 'Astonea Labs Limited',
  defaultDescription:
    'Astonea Labs Limited — a BSE-SME listed pharmaceutical & specialty chemicals company.',
} as const

export function seoTag(path: string) {
  return `page-meta:${path}`
}

export function seoTranslationTag(path: string, locale: string) {
  return `page-meta:${path}:${locale}`
}

async function currentLocale(): Promise<string> {
  try {
    return await getLocale()
  } catch {
    return DEFAULT_LOCALE
  }
}

async function loadBase(path: string) {
  try {
    const [row] = await db
      .select()
      .from(pageMetadata)
      .where(eq(pageMetadata.pagePath, path))
      .limit(1)
    return row ?? null
  } catch {
    return null
  }
}

async function loadTranslation(path: string, locale: string) {
  try {
    const [row] = await db
      .select({
        title: pageMetadataTranslations.title,
        description: pageMetadataTranslations.description,
        keywords: pageMetadataTranslations.keywords,
      })
      .from(pageMetadataTranslations)
      .where(
        and(
          eq(pageMetadataTranslations.pagePath, path),
          eq(pageMetadataTranslations.locale, locale),
        ),
      )
      .limit(1)
    return row ?? null
  } catch {
    return null
  }
}

const getCachedBase = (path: string) =>
  unstable_cache(
    () => loadBase(path),
    ['page-metadata-base', path],
    { tags: [seoTag(path), 'page-meta:all'], revalidate: 3600 },
  )()

const getCachedTranslation = (path: string, locale: string) =>
  unstable_cache(
    () => loadTranslation(path, locale),
    ['page-metadata-translation', path, locale],
    {
      tags: [seoTranslationTag(path, locale), seoTag(path), 'page-meta:all'],
      revalidate: 3600,
    },
  )()

/**
 * Resolve page metadata in priority order:
 *   1. Per-locale translation row (`page_metadata_translations`)
 *   2. Admin-customised base row (`page_metadata`)
 *   3. Explicit overrides passed by the calling page
 *   4. Registry defaults for this path (lib/seo/pages-registry.ts)
 *   5. Site-wide defaults
 *
 * The active request locale is resolved from next-intl. For non-English
 * locales, registry defaults still come from English — they will only be
 * superseded once the admin runs "Generate translations" for that locale.
 */
export async function pageMeta(
  path: string,
  fallback: SeoOverrides = {},
): Promise<Metadata> {
  const locale = await currentLocale()
  const [base, trans, registry] = await Promise.all([
    getCachedBase(path),
    locale === DEFAULT_LOCALE ? Promise.resolve(null) : getCachedTranslation(path, locale),
    Promise.resolve(PAGE_REGISTRY_BY_PATH[path]),
  ])

  const title =
    trans?.title ??
    base?.title ??
    fallback.title ??
    registry?.defaultTitle ??
    SITE.defaultTitle
  const description =
    trans?.description ??
    base?.description ??
    fallback.description ??
    registry?.defaultDescription ??
    SITE.defaultDescription
  const keywords =
    trans?.keywords ??
    base?.keywords ??
    fallback.keywords ??
    registry?.defaultKeywords

  const meta: Metadata = { title, description }

  if (keywords) meta.keywords = keywords

  if (base?.ogImage) {
    meta.openGraph = {
      title,
      description,
      images: [base.ogImage],
      siteName: SITE.siteName,
    }
    meta.twitter = {
      card: 'summary_large_image',
      title,
      description,
      images: [base.ogImage],
    }
  } else {
    meta.openGraph = { title, description, siteName: SITE.siteName }
  }
  if (base?.canonical) meta.alternates = { canonical: base.canonical }
  if (base?.noIndex) meta.robots = { index: false, follow: false }

  return meta
}
