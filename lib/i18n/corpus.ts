/**
 * Translation corpus — shared between the admin "Generate translations"
 * server action and the CLI scripts in scripts/translations-*.ts.
 *
 * Must remain free of:
 *   - 'server-only' imports
 *   - next/cache, next/server
 *   - React component imports (the block impl files pull in components,
 *     so we mirror their `translatableFields` arrays here as plain data).
 *
 * The `db` handle is passed in so this module works against the request-time
 * D1 binding (lib/db) AND the local better-sqlite3 handle (lib/db/script-client)
 * unchanged.
 */
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import {
  documents,
  documentTranslations,
  pageMetadata,
  pageMetadataTranslations,
  pageBlocks,
  pageBlockTranslations,
  pages,
  pageTextOverrides,
  uiStrings,
  productCategories,
  productCategoryTranslations,
  products,
  productTranslations,
  ticketCategories,
  ticketCategoryTranslations,
} from '@/lib/db/schema'
import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'
import { getAllPageDefaults } from '@/lib/cms/page-defaults'
import { DEFAULT_UI_STRINGS_EN } from '@/lib/i18n/default-messages'
import { expandTranslatablePaths, getByPath, setByPath } from '@/lib/cms/blocks/types'

const DEFAULT_LOCALE = 'en'

// Mirror of each block descriptor's `translatableFields`. Duplicated here so
// corpus.ts stays free of React imports (the block impl tsx files pull in
// page components, which can't load in a plain `tsx` script). If a new block
// type is added in lib/cms/blocks/impl, add its entry here too.
const BLOCK_TRANSLATABLE_FIELDS: Record<string, string[]> = {
  hero: ['eyebrow', 'title', 'description', 'breadcrumb.*.label'],
  textSection: ['eyebrow', 'heading', 'body'],
  pdfList: ['eyebrow', 'heading', 'emptyMessage'],
  statsCountUp: ['eyebrow', 'heading', 'stats.*.label', 'stats.*.sublabel', 'stats.*.suffix'],
  contactCta: ['heading', 'subheading', 'primary.label', 'secondary.label'],
  imageWithText: ['eyebrow', 'heading', 'body', 'imageAlt'],
}

// Loose db type: matches the surface used here (.select/.insert/.update) for
// both `drizzle-orm/d1` (server) and `drizzle-orm/better-sqlite3` (scripts).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CorpusDb = any

export type CorpusItems = Record<string, string>
export type TranslatedBatch = Record<string, string>

/**
 * Build the full English source corpus across every translatable surface:
 *   1. UI strings (baseline + admin overrides)
 *   2. Page metadata (title/description/keywords) for every page in the registry
 *   3. Published documents (title + description)
 *   4. Page-scoped editorial slots from lib/cms/page-defaults.ts
 *   5. Page blocks on published pages
 *   6. Product categories (label + description)
 *   7. Published products (name + description)
 *
 * Key prefixes drive dispatch in persistTranslations():
 *   ui::<key>
 *   page::<path>::title|description|keywords
 *   doc::<id>::title|description
 *   block::<id>::<dotted.path>
 *   pagetext::<path>::<slot.key>
 *   prodcat::<id>::label|description
 *   prod::<id>::name|description
 *   tcat::<id>::name
 */
export async function buildSourceCorpus(db: CorpusDb): Promise<{
  items: CorpusItems
  uiOverrides: Map<string, string>
}> {
  // 1. UI strings: baseline defaults overridden by `en` rows in DB.
  const uiOverridesRows = await db
    .select({ key: uiStrings.key, value: uiStrings.value })
    .from(uiStrings)
    .where(eq(uiStrings.locale, DEFAULT_LOCALE))
  const uiOverrides = new Map<string, string>(
    uiOverridesRows.map((r: { key: string; value: string }) => [r.key, r.value]),
  )

  const items: CorpusItems = {}

  for (const [k, v] of Object.entries(DEFAULT_UI_STRINGS_EN)) {
    const value = uiOverrides.get(k) ?? v
    if (value.length === 0) continue
    items[`ui::${k}`] = value
  }
  for (const [k, v] of uiOverrides) {
    if (v.length === 0) continue
    if (!(`ui::${k}` in items)) items[`ui::${k}`] = v
  }

  // 2. Page metadata.
  const pmRows = await db.select().from(pageMetadata)
  const pmByPath = new Map<string, { title: string; description: string | null; keywords: string | null }>(
    pmRows.map((r: { pagePath: string; title: string; description: string | null; keywords: string | null }) => [
      r.pagePath,
      r,
    ]),
  )

  for (const entry of PAGE_REGISTRY) {
    const row = pmByPath.get(entry.path)
    items[`page::${entry.path}::title`] = row?.title ?? entry.defaultTitle
    items[`page::${entry.path}::description`] = row?.description ?? entry.defaultDescription
    items[`page::${entry.path}::keywords`] = row?.keywords ?? entry.defaultKeywords
  }

  // 3. Documents (only published).
  const docs = await db
    .select({
      id: documents.id,
      title: documents.title,
      description: documents.description,
    })
    .from(documents)
    .where(eq(documents.isPublished, true))

  for (const d of docs as Array<{ id: string; title: string; description: string | null }>) {
    items[`doc::${d.id}::title`] = d.title
    if (d.description) items[`doc::${d.id}::description`] = d.description
  }

  // 4. Page-scoped editorial slots.
  for (const page of getAllPageDefaults()) {
    for (const slot of page.slots) {
      const value = slot.defaultValue
      if (typeof value !== 'string' || value.trim().length === 0) continue
      items[`pagetext::${page.path}::${slot.key}`] = value
    }
  }

  // 5. Page blocks (only on published pages).
  const blockRows = await db
    .select({
      blockId: pageBlocks.id,
      blockType: pageBlocks.blockType,
      props: pageBlocks.props,
      pagePublished: pages.isPublished,
    })
    .from(pageBlocks)
    .leftJoin(pages, eq(pageBlocks.pageId, pages.id))

  for (const row of blockRows as Array<{
    blockId: string
    blockType: string
    props: Record<string, unknown> | string
    pagePublished: boolean | null
  }>) {
    if (row.pagePublished === false) continue
    const translatableFields = BLOCK_TRANSLATABLE_FIELDS[row.blockType]
    if (!translatableFields) continue
    // better-sqlite3 returns JSON columns as raw strings; D1 returns parsed objects.
    const props =
      typeof row.props === 'string'
        ? (JSON.parse(row.props) as Record<string, unknown>)
        : (row.props as Record<string, unknown>)
    const paths = expandTranslatablePaths(props, translatableFields)
    for (const p of paths) {
      const val = getByPath(props, p)
      if (typeof val === 'string' && val.trim().length > 0) {
        items[`block::${row.blockId}::${p}`] = val
      }
    }
  }

  // 6. Product categories.
  const catRows = await db
    .select({
      id: productCategories.id,
      label: productCategories.label,
      description: productCategories.description,
    })
    .from(productCategories)
    .where(and(eq(productCategories.isActive, true), isNull(productCategories.deletedAt)))
  for (const c of catRows as Array<{ id: string; label: string; description: string | null }>) {
    items[`prodcat::${c.id}::label`] = c.label
    if (c.description && c.description.trim().length > 0) {
      items[`prodcat::${c.id}::description`] = c.description
    }
  }

  // 7. Products.
  const prodRows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
    })
    .from(products)
    .where(and(eq(products.status, 'published'), isNull(products.deletedAt)))
  for (const p of prodRows as Array<{ id: string; name: string; description: string | null }>) {
    items[`prod::${p.id}::name`] = p.name
    if (p.description && p.description.trim().length > 0) {
      items[`prod::${p.id}::description`] = p.description
    }
  }

  // 8. Ticket categories — source name lives in the default-locale translation
  //    row (`en`). The category table itself stores only the slug and metadata.
  const tcatRows = await db
    .select({
      id: ticketCategories.id,
      name: ticketCategoryTranslations.name,
      translationLocale: ticketCategoryTranslations.locale,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .where(eq(ticketCategories.isActive, true))
  const tcatEnglish = new Map<string, string>()
  for (const r of tcatRows as Array<{ id: string; name: string | null; translationLocale: string | null }>) {
    if (r.translationLocale === DEFAULT_LOCALE && r.name) tcatEnglish.set(r.id, r.name)
  }
  for (const [id, name] of tcatEnglish) {
    items[`tcat::${id}::name`] = name
  }

  return { items, uiOverrides }
}

export async function fetchExistingTranslationKeys(
  db: CorpusDb,
  locale: string,
): Promise<Set<string>> {
  const [uiRows, pageRows, docRows, blockRows, overrideRows, prodCatRows, prodRows, tcatRows] = await Promise.all([
    db.select({ key: uiStrings.key }).from(uiStrings).where(eq(uiStrings.locale, locale)),
    db
      .select({ pagePath: pageMetadataTranslations.pagePath })
      .from(pageMetadataTranslations)
      .where(eq(pageMetadataTranslations.locale, locale)),
    db
      .select({ id: documentTranslations.documentId })
      .from(documentTranslations)
      .where(eq(documentTranslations.locale, locale)),
    db
      .select({ blockId: pageBlockTranslations.blockId })
      .from(pageBlockTranslations)
      .where(eq(pageBlockTranslations.locale, locale)),
    db
      .select({ pagePath: pageTextOverrides.pagePath, key: pageTextOverrides.key })
      .from(pageTextOverrides)
      .where(eq(pageTextOverrides.locale, locale)),
    db
      .select({ id: productCategoryTranslations.categoryId })
      .from(productCategoryTranslations)
      .where(eq(productCategoryTranslations.locale, locale)),
    db
      .select({ id: productTranslations.productId })
      .from(productTranslations)
      .where(eq(productTranslations.locale, locale)),
    db
      .select({ id: ticketCategoryTranslations.categoryId })
      .from(ticketCategoryTranslations)
      .where(eq(ticketCategoryTranslations.locale, locale)),
  ])
  const existing = new Set<string>()
  for (const r of uiRows as Array<{ key: string }>) existing.add(`ui::${r.key}`)
  for (const r of pageRows as Array<{ pagePath: string }>) {
    existing.add(`page::${r.pagePath}::title`)
    existing.add(`page::${r.pagePath}::description`)
    existing.add(`page::${r.pagePath}::keywords`)
  }
  for (const r of docRows as Array<{ id: string }>) {
    existing.add(`doc::${r.id}::title`)
    existing.add(`doc::${r.id}::description`)
  }
  for (const r of blockRows as Array<{ blockId: string }>) existing.add(`block::${r.blockId}`)
  for (const r of overrideRows as Array<{ pagePath: string; key: string }>) {
    existing.add(`pagetext::${r.pagePath}::${r.key}`)
  }
  for (const r of prodCatRows as Array<{ id: string }>) {
    existing.add(`prodcat::${r.id}::label`)
    existing.add(`prodcat::${r.id}::description`)
  }
  for (const r of prodRows as Array<{ id: string }>) {
    existing.add(`prod::${r.id}::name`)
    existing.add(`prod::${r.id}::description`)
  }
  for (const r of tcatRows as Array<{ id: string }>) {
    existing.add(`tcat::${r.id}::name`)
  }
  return existing
}

export async function persistTranslations(
  db: CorpusDb,
  targetLocale: string,
  translated: TranslatedBatch,
): Promise<{ affectedPagePaths: Set<string> }> {
  type UiUpsert = { key: string; locale: string; value: string }
  type PageUpsert = {
    pagePath: string
    locale: string
    title: string
    description: string | null
    keywords: string | null
  }
  type DocUpsert = {
    documentId: string
    locale: string
    title: string
    description: string | null
  }
  type PageTextUpsert = { pagePath: string; key: string; locale: string; value: string }
  type ProdCatUpsert = {
    categoryId: string
    locale: string
    label: string
    description: string | null
  }
  type ProdUpsert = {
    productId: string
    locale: string
    name: string
    description: string | null
  }
  type TcatUpsert = { categoryId: string; locale: string; name: string }

  const ui: UiUpsert[] = []
  const pageUpserts: Map<string, PageUpsert> = new Map()
  const docs: Map<string, DocUpsert> = new Map()
  const blockPatches: Map<string, Record<string, unknown>> = new Map()
  const blockPagePaths: Map<string, string> = new Map()
  const pageTextUpserts: PageTextUpsert[] = []
  const pageTextPagePaths = new Set<string>()
  const prodCatUpserts: Map<string, ProdCatUpsert> = new Map()
  const prodUpserts: Map<string, ProdUpsert> = new Map()
  const tcatUpserts: Map<string, TcatUpsert> = new Map()

  for (const [k, value] of Object.entries(translated)) {
    if (k.startsWith('ui::')) {
      const key = k.slice(4)
      ui.push({ key, locale: targetLocale, value })
      continue
    }
    if (k.startsWith('page::')) {
      const rest = k.slice(6)
      const lastSep = rest.lastIndexOf('::')
      const path = rest.slice(0, lastSep)
      const field = rest.slice(lastSep + 2) as 'title' | 'description' | 'keywords'
      const cur =
        pageUpserts.get(path) ??
        ({ pagePath: path, locale: targetLocale, title: '', description: null, keywords: null } as PageUpsert)
      if (field === 'title') cur.title = value
      if (field === 'description') cur.description = value
      if (field === 'keywords') cur.keywords = value
      pageUpserts.set(path, cur)
      continue
    }
    if (k.startsWith('doc::')) {
      const rest = k.slice(5)
      const lastSep = rest.lastIndexOf('::')
      const id = rest.slice(0, lastSep)
      const field = rest.slice(lastSep + 2) as 'title' | 'description'
      const cur =
        docs.get(id) ??
        ({ documentId: id, locale: targetLocale, title: '', description: null } as DocUpsert)
      if (field === 'title') cur.title = value
      if (field === 'description') cur.description = value
      docs.set(id, cur)
      continue
    }
    if (k.startsWith('block::')) {
      const rest = k.slice(7)
      const firstSep = rest.indexOf('::')
      if (firstSep === -1) continue
      const blockId = rest.slice(0, firstSep)
      const path = rest.slice(firstSep + 2)
      const cur = blockPatches.get(blockId) ?? {}
      setByPath(cur, path, value)
      blockPatches.set(blockId, cur)
      continue
    }
    if (k.startsWith('pagetext::')) {
      const rest = k.slice(10)
      const lastSep = rest.lastIndexOf('::')
      if (lastSep === -1) continue
      const pagePath = rest.slice(0, lastSep)
      const slotKey = rest.slice(lastSep + 2)
      pageTextUpserts.push({ pagePath, key: slotKey, locale: targetLocale, value })
      pageTextPagePaths.add(pagePath)
      continue
    }
    if (k.startsWith('prodcat::')) {
      const rest = k.slice(9)
      const lastSep = rest.lastIndexOf('::')
      if (lastSep === -1) continue
      const id = rest.slice(0, lastSep)
      const field = rest.slice(lastSep + 2) as 'label' | 'description'
      const cur =
        prodCatUpserts.get(id) ??
        ({ categoryId: id, locale: targetLocale, label: '', description: null } as ProdCatUpsert)
      if (field === 'label') cur.label = value
      if (field === 'description') cur.description = value
      prodCatUpserts.set(id, cur)
      continue
    }
    if (k.startsWith('prod::')) {
      const rest = k.slice(6)
      const lastSep = rest.lastIndexOf('::')
      if (lastSep === -1) continue
      const id = rest.slice(0, lastSep)
      const field = rest.slice(lastSep + 2) as 'name' | 'description'
      const cur =
        prodUpserts.get(id) ??
        ({ productId: id, locale: targetLocale, name: '', description: null } as ProdUpsert)
      if (field === 'name') cur.name = value
      if (field === 'description') cur.description = value
      prodUpserts.set(id, cur)
      continue
    }
    if (k.startsWith('tcat::')) {
      const rest = k.slice(6)
      const lastSep = rest.lastIndexOf('::')
      if (lastSep === -1) continue
      const id = rest.slice(0, lastSep)
      const field = rest.slice(lastSep + 2) as 'name'
      if (field !== 'name') continue
      tcatUpserts.set(id, { categoryId: id, locale: targetLocale, name: value })
    }
  }

  if (ui.length > 0) {
    await db
      .insert(uiStrings)
      .values(ui)
      .onConflictDoUpdate({
        target: [uiStrings.key, uiStrings.locale],
        set: {
          value: sql`excluded.value`,
          updatedAt: new Date(),
        },
      })
  }

  for (const p of pageUpserts.values()) {
    if (!p.title) continue
    await db
      .insert(pageMetadataTranslations)
      .values(p)
      .onConflictDoUpdate({
        target: [pageMetadataTranslations.pagePath, pageMetadataTranslations.locale],
        set: { title: p.title, description: p.description, keywords: p.keywords, updatedAt: new Date() },
      })
  }

  for (const d of docs.values()) {
    if (!d.title) continue
    await db
      .insert(documentTranslations)
      .values(d)
      .onConflictDoUpdate({
        target: [documentTranslations.documentId, documentTranslations.locale],
        set: { title: d.title, description: d.description, updatedAt: new Date() },
      })
  }

  if (blockPatches.size > 0) {
    const blockIds = [...blockPatches.keys()]
    const ownerRows = await db
      .select({ blockId: pageBlocks.id, path: pages.path })
      .from(pageBlocks)
      .leftJoin(pages, eq(pageBlocks.pageId, pages.id))
      .where(inArray(pageBlocks.id, blockIds))
    for (const r of ownerRows as Array<{ blockId: string; path: string | null }>) {
      if (r.path) blockPagePaths.set(r.blockId, r.path)
    }

    for (const [blockId, patch] of blockPatches) {
      await db
        .insert(pageBlockTranslations)
        .values({ blockId, locale: targetLocale, props: patch })
        .onConflictDoUpdate({
          target: [pageBlockTranslations.blockId, pageBlockTranslations.locale],
          set: { props: patch, updatedAt: new Date() },
        })
    }
  }

  for (const h of pageTextUpserts) {
    await db
      .insert(pageTextOverrides)
      .values(h)
      .onConflictDoUpdate({
        target: [pageTextOverrides.pagePath, pageTextOverrides.key, pageTextOverrides.locale],
        set: { value: h.value, updatedAt: new Date() },
      })
  }

  for (const c of prodCatUpserts.values()) {
    if (!c.label) continue
    await db
      .insert(productCategoryTranslations)
      .values(c)
      .onConflictDoUpdate({
        target: [productCategoryTranslations.categoryId, productCategoryTranslations.locale],
        set: { label: c.label, description: c.description, updatedAt: new Date() },
      })
  }

  for (const p of prodUpserts.values()) {
    if (!p.name) continue
    await db
      .insert(productTranslations)
      .values(p)
      .onConflictDoUpdate({
        target: [productTranslations.productId, productTranslations.locale],
        set: { name: p.name, description: p.description, updatedAt: new Date() },
      })
  }

  for (const c of tcatUpserts.values()) {
    if (!c.name) continue
    await db
      .insert(ticketCategoryTranslations)
      .values(c)
      .onConflictDoUpdate({
        target: [ticketCategoryTranslations.categoryId, ticketCategoryTranslations.locale],
        set: { name: c.name, updatedAt: new Date() },
      })
  }

  const affectedPagePaths = new Set<string>([
    ...blockPagePaths.values(),
    ...pageTextPagePaths,
  ])

  return { affectedPagePaths }
}
