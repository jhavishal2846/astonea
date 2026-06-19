import 'server-only'
import { getLocale } from 'next-intl/server'
import { getResolvedPage } from '@/lib/cms/pages'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { BlockRenderer } from '@/components/cms/BlockRenderer'

/**
 * Wraps a static page's JSX with the CMS-block override mechanism.
 *
 *   - If a published `pages` row exists for `path` AND has at least one
 *     block, render those blocks instead of `children` (the original
 *     static content).
 *   - Otherwise render `children` (the original design stays untouched).
 *
 * Drop this around the JSX of any static page you want editors to be able
 * to override from the admin panel.
 *
 * @example
 *   export default async function AboutPage() {
 *     return (
 *       <CmsPageOverride path="/about-us">
 *         { the existing static JSX … }
 *       </CmsPageOverride>
 *     )
 *   }
 */
export default async function CmsPageOverride({
  path,
  children,
}: {
  path: string
  children: React.ReactNode
}) {
  let locale = DEFAULT_LOCALE
  try {
    locale = await getLocale()
  } catch {
    // Outside a request scope (e.g. metadata) — fall back to default.
  }

  const resolved = await getResolvedPage(path, locale)

  if (
    resolved &&
    resolved.page.isPublished &&
    resolved.blocks.length > 0
  ) {
    return (
      <div className="flex-1 flex flex-col">
        <BlockRenderer blocks={resolved.blocks} />
      </div>
    )
  }

  return <>{children}</>
}
