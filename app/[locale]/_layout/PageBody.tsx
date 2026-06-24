import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { and, eq, inArray } from 'drizzle-orm'
import { BlockRenderer } from '@/components/cms/BlockRenderer'
import PageTextProvider from '@/components/PageTextProvider'
import CmsEditOverlay from '@/components/cms/CmsEditOverlay'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { getResolvedPage } from '@/lib/cms/pages'
import { db } from '@/lib/db'
import { pageTextOverrides } from '@/lib/db/schema'
import { pageTextTag, pageTextLocaleTag } from '@/lib/cms/page-text'

type OverrideRow = { key: string; locale: string; value: string }

function getCachedOverrides(path: string, locales: string[]) {
  const localesKey = locales.join('|')
  const tags = [pageTextTag(path), ...locales.map((l) => pageTextLocaleTag(path, l))]
  return unstable_cache(
    async (): Promise<OverrideRow[]> =>
      db
        .select({
          key: pageTextOverrides.key,
          locale: pageTextOverrides.locale,
          value: pageTextOverrides.value,
        })
        .from(pageTextOverrides)
        .where(
          and(
            eq(pageTextOverrides.pagePath, path),
            inArray(pageTextOverrides.locale, locales),
          ),
        ),
    ['page-text-overrides-multi', path, localesKey],
    { tags, revalidate: 3600 },
  )()
}

export default async function PageBody({
  locale,
  children,
}: {
  locale: string
  children: React.ReactNode
}) {
  const headerStore = await headers()
  const rawPathname = headerStore.get('x-pathname') ?? ''
  const localePrefix = `/${locale}`
  const cmsPath =
    rawPathname === localePrefix
      ? '/'
      : rawPathname.startsWith(`${localePrefix}/`)
      ? rawPathname.slice(localePrefix.length)
      : rawPathname

  const localeList =
    locale === DEFAULT_LOCALE ? [DEFAULT_LOCALE] : [locale, DEFAULT_LOCALE]

  const [resolved, overrideRows] = await Promise.all([
    cmsPath ? getResolvedPage(cmsPath, locale) : Promise.resolve(null),
    cmsPath ? getCachedOverrides(cmsPath, localeList) : Promise.resolve<OverrideRow[]>([]),
  ])

  let content: React.ReactNode = children
  if (resolved && resolved.page.isPublished && resolved.blocks.length > 0) {
    content = (
      <div className="flex-1 flex flex-col">
        <BlockRenderer blocks={resolved.blocks} />
      </div>
    )
  }

  const textOverrides: Record<string, string> = {}
  for (const r of overrideRows) {
    if (r.locale === DEFAULT_LOCALE) textOverrides[r.key] = r.value
  }
  if (locale !== DEFAULT_LOCALE) {
    for (const r of overrideRows) {
      if (r.locale === locale) textOverrides[r.key] = r.value
    }
  }

  const editMode = headerStore.get('x-cms-edit') === '1'

  return (
    <PageTextProvider
      overrides={textOverrides}
      path={cmsPath || '/'}
      locale={locale}
      editMode={editMode}
    >
      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        {content}
      </main>
      {editMode && <CmsEditOverlay />}
    </PageTextProvider>
  )
}
