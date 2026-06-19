import 'server-only'
import { unstable_cache } from 'next/cache'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  pages,
  pageBlocks,
  pageBlockTranslations,
  type Page,
  type PageBlock,
} from '@/lib/db/schema'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

export type ResolvedBlock = {
  id: string
  blockType: string
  displayOrder: number
  isLocked: boolean
  props: Record<string, unknown>
}

export type ResolvedPage = {
  page: Page
  blocks: ResolvedBlock[]
}

export function pageTag(path: string) {
  return `page:${path}`
}

export function pageLocaleTag(path: string, locale: string) {
  return `page:${path}:${locale}`
}

async function loadPageWithBlocks(path: string): Promise<{
  page: Page | null
  blocks: PageBlock[]
}> {
  const [page] = await db.select().from(pages).where(eq(pages.path, path)).limit(1)
  if (!page) return { page: null, blocks: [] }
  const blocks = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(asc(pageBlocks.displayOrder))
  return { page, blocks }
}

/**
 * Deep-merge a translation patch into the base props. The patch only contains
 * translatable string fields, so any nested key absent from the patch keeps
 * the base value. Arrays merge index-by-index using object merge per row.
 */
function mergePatch(base: unknown, patch: unknown): unknown {
  if (patch == null) return base
  if (Array.isArray(base) && Array.isArray(patch)) {
    return base.map((b, i) => mergePatch(b, patch[i]))
  }
  if (
    typeof base === 'object' &&
    base !== null &&
    typeof patch === 'object' &&
    patch !== null &&
    !Array.isArray(base) &&
    !Array.isArray(patch)
  ) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = mergePatch(out[k], v)
    }
    return out
  }
  // Scalar override.
  return patch
}

/**
 * Fetch a page + its blocks for the active locale. Translatable string fields
 * from `page_block_translations` are merged onto the base props using a deep
 * merge so non-translated fields fall through to English.
 *
 * Cached with two tags so admin mutations can invalidate precisely:
 *   - page:<path>            → fires when blocks are reordered/added/removed
 *   - page:<path>:<locale>   → fires when translations for this locale change
 */
export async function getResolvedPage(
  path: string,
  locale: string,
): Promise<ResolvedPage | null> {
  const cached = unstable_cache(
    async () => {
      const { page, blocks } = await loadPageWithBlocks(path)
      if (!page) return null

      let translations: { blockId: string; props: unknown }[] = []
      if (locale !== DEFAULT_LOCALE && blocks.length > 0) {
        translations = await db
          .select({
            blockId: pageBlockTranslations.blockId,
            props: pageBlockTranslations.props,
          })
          .from(pageBlockTranslations)
          .where(
            and(
              eq(pageBlockTranslations.locale, locale),
              inArray(
                pageBlockTranslations.blockId,
                blocks.map((b) => b.id),
              ),
            ),
          )
      }
      const patchById = new Map(translations.map((t) => [t.blockId, t.props]))

      const resolved: ResolvedBlock[] = blocks.map((b) => {
        const patch = patchById.get(b.id)
        const props =
          patch && typeof patch === 'object'
            ? (mergePatch(b.props, patch) as Record<string, unknown>)
            : (b.props as Record<string, unknown>)
        return {
          id: b.id,
          blockType: b.blockType,
          displayOrder: b.displayOrder,
          isLocked: b.isLocked,
          props,
        }
      })

      return { page, blocks: resolved }
    },
    ['resolved-page', path, locale],
    {
      tags: [pageTag(path), pageLocaleTag(path, locale)],
      revalidate: 3600,
    },
  )
  return cached()
}

export async function listAllPages(): Promise<Page[]> {
  return db.select().from(pages).orderBy(asc(pages.path))
}
