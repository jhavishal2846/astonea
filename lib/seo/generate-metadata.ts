import 'server-only'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pageMetadata } from '@/lib/db/schema'
import { PAGE_REGISTRY_BY_PATH } from '@/lib/seo/pages-registry'

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

async function loadFromDb(path: string) {
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

const getCached = (path: string) =>
  unstable_cache(
    async () => loadFromDb(path),
    ['page-metadata', path],
    { tags: [seoTag(path), 'page-meta:all'], revalidate: 3600 },
  )()

/**
 * Resolve page metadata in priority order:
 *   1. Admin-customised row in `page_metadata` (DB)
 *   2. Explicit overrides passed by the calling page
 *   3. Registry defaults for this path (lib/seo/pages-registry.ts)
 *   4. Site-wide defaults
 *
 * This means every page automatically gets registry-defined keywords / titles /
 * descriptions without each page restating them, while still letting admins
 * override anything from the SEO admin panel.
 */
export async function pageMeta(
  path: string,
  fallback: SeoOverrides = {},
): Promise<Metadata> {
  const [row, registry] = [await getCached(path), PAGE_REGISTRY_BY_PATH[path]]

  const title =
    row?.title ?? fallback.title ?? registry?.defaultTitle ?? SITE.defaultTitle
  const description =
    row?.description ??
    fallback.description ??
    registry?.defaultDescription ??
    SITE.defaultDescription
  const keywords =
    row?.keywords ?? fallback.keywords ?? registry?.defaultKeywords

  const meta: Metadata = { title, description }

  if (keywords) meta.keywords = keywords

  if (row?.ogImage) {
    meta.openGraph = {
      title,
      description,
      images: [row.ogImage],
      siteName: SITE.siteName,
    }
    meta.twitter = {
      card: 'summary_large_image',
      title,
      description,
      images: [row.ogImage],
    }
  } else {
    meta.openGraph = { title, description, siteName: SITE.siteName }
  }
  if (row?.canonical) meta.alternates = { canonical: row.canonical }
  if (row?.noIndex) meta.robots = { index: false, follow: false }

  return meta
}
