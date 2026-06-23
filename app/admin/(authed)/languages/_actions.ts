'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  languages,
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
  translationJobs,
  type TranslationJobStatus,
} from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { LOCALES_TAG, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { uiStringsTag } from '@/lib/i18n/ui-strings'
import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'
import { getAllPageDefaults } from '@/lib/cms/page-defaults'
import { DEFAULT_UI_STRINGS_EN } from '@/lib/i18n/default-messages'
import { getBlockDescriptor, expandTranslatablePaths, getByPath, setByPath } from '@/lib/cms/blocks'
import { pageTag, pageLocaleTag } from '@/lib/cms/pages'
import {
  translateOne,
  TranslationError,
  type TranslatedBatch,
} from '@/lib/i18n/translate'

export type LangActionState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

// ─── Language CRUD ───────────────────────────────────────────────────────

const LOCALE_CODE_RE = /^[a-z]{2,3}(-[A-Z]{2})?$/

export async function addLanguage(
  _prev: LangActionState,
  formData: FormData,
): Promise<LangActionState> {
  const user = await requireAdmin()
  const code = String(formData.get('code') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const nativeName = String(formData.get('nativeName') ?? '').trim() || name

  if (!LOCALE_CODE_RE.test(code))
    return { error: 'Locale code must be 2-3 lowercase letters, optionally followed by -XX (e.g. en, hi, en-GB).' }
  if (!name) return { error: 'Language name is required.' }
  if (code === DEFAULT_LOCALE)
    return { error: 'The default locale "en" already exists and cannot be re-added.' }

  try {
    await db
      .insert(languages)
      .values({
        code,
        name,
        nativeName,
        isActive: true,
        isDefault: false,
        displayOrder: 100,
      })
      .onConflictDoNothing()
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to add language' }
  }

  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)

  after(() =>
    recordActivity({
      action: 'create',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${name} (${code})`,
      detail: 'Added a new site language',
      user,
    }),
  )

  return { ok: true }
}

export async function setLanguageActive(code: string, active: boolean) {
  const user = await requireAdmin()
  if (code === DEFAULT_LOCALE && !active)
    throw new Error('Cannot deactivate the default locale')

  await db.update(languages).set({ isActive: active }).where(eq(languages.code, code))
  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)

  after(() =>
    recordActivity({
      action: active ? 'publish' : 'unpublish',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${code}`,
      detail: active ? 'Activated' : 'Deactivated',
      user,
    }),
  )
}

/**
 * Force-fail any running translation job for this locale. Use this to
 * recover from a stuck row — for example when the dev server was killed
 * mid-run and the row is still marked `running`, blocking re-clicks of
 * "Generate translations".
 */
export async function cancelTranslationJob(locale: string) {
  const user = await requireAdmin()
  if (locale === DEFAULT_LOCALE) throw new Error('No translation jobs run on the default locale')

  const updated = await db
    .update(translationJobs)
    .set({
      status: 'failed',
      errorMessage: 'Cancelled by admin',
      finishedAt: new Date(),
    })
    .where(
      and(
        eq(translationJobs.locale, locale),
        inArray(translationJobs.status, ['queued', 'running']),
      ),
    )
    .returning({ id: translationJobs.id })

  revalidatePath('/admin/languages')

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Translations: ${locale}`,
      detail: `Cancelled ${updated.length} in-flight translation job${updated.length === 1 ? '' : 's'}.`,
      user,
    }),
  )

  return { cancelled: updated.length }
}

export async function deleteLanguage(code: string) {
  const user = await requireAdmin()
  if (code === DEFAULT_LOCALE) throw new Error('Cannot delete the default locale')

  await db.delete(languages).where(eq(languages.code, code))
  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)
  updateTag(uiStringsTag(code))

  after(() =>
    recordActivity({
      action: 'delete',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${code}`,
      detail: 'Removed site language and all its translations',
      user,
    }),
  )
}

// ─── Translation generation (long-running) ───────────────────────────────

/**
 * Build the full English source for a target locale:
 *   - UI strings (baseline + admin overrides)
 *   - Page metadata (title, description, keywords) for every page in the registry
 *   - Every published document (title, description)
 *
 * Returns a flat map of stable keys → English strings.
 *
 * Key prefixes let us dispatch translations back to the right table:
 *   ui::<key>
 *   page::<path>::title|description|keywords
 *   doc::<id>::title|description
 */
async function fetchExistingTranslationKeys(locale: string): Promise<Set<string>> {
  const [uiRows, pageRows, docRows, blockRows, overrideRows, prodCatRows, prodRows] = await Promise.all([
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
  ])
  const existing = new Set<string>()
  for (const r of uiRows) existing.add(`ui::${r.key}`)
  // For pages/docs/blocks, the presence of one row means every translatable
  // field for that entity counts as already translated.
  for (const r of pageRows) {
    existing.add(`page::${r.pagePath}::title`)
    existing.add(`page::${r.pagePath}::description`)
    existing.add(`page::${r.pagePath}::keywords`)
  }
  for (const r of docRows) {
    existing.add(`doc::${r.id}::title`)
    existing.add(`doc::${r.id}::description`)
  }
  // Block keys are dynamic per field; we mark only the block id so the corpus
  // builder can skip the whole block (good enough — admins re-translate at
  // block granularity, not field granularity).
  for (const r of blockRows) existing.add(`block::${r.blockId}`)
  // Page-scoped text overrides: every (pagePath, key) row counts as already
  // translated. The resumable filter then skips that exact (path, key) tuple
  // on re-runs — useful when an admin curated a single string by hand or a
  // partial translation job finished some pages.
  for (const r of overrideRows) {
    existing.add(`pagetext::${r.pagePath}::${r.key}`)
  }
  // Product / category translations: presence of one row counts the whole
  // entity (label+description for categories, name+description for products)
  // as already translated. Matches the doc/page convention.
  for (const r of prodCatRows) {
    existing.add(`prodcat::${r.id}::label`)
    existing.add(`prodcat::${r.id}::description`)
  }
  for (const r of prodRows) {
    existing.add(`prod::${r.id}::name`)
    existing.add(`prod::${r.id}::description`)
  }
  return existing
}

async function buildSourceCorpus(): Promise<{
  items: Record<string, string>
  uiOverrides: Map<string, string>
}> {
  // 1. UI strings: baseline defaults overridden by `en` rows in DB.
  const uiOverridesRows = await db
    .select({ key: uiStrings.key, value: uiStrings.value })
    .from(uiStrings)
    .where(eq(uiStrings.locale, DEFAULT_LOCALE))
  const uiOverrides = new Map(uiOverridesRows.map((r) => [r.key, r.value]))

  const items: Record<string, string> = {}

  for (const [k, v] of Object.entries(DEFAULT_UI_STRINGS_EN)) {
    items[`ui::${k}`] = uiOverrides.get(k) ?? v
  }
  for (const [k, v] of uiOverrides) {
    if (!(`ui::${k}` in items)) items[`ui::${k}`] = v
  }

  // 2. Page metadata: prefer DB row, fall back to registry default.
  const pmRows = await db.select().from(pageMetadata)
  const pmByPath = new Map(pmRows.map((r) => [r.pagePath, r]))

  for (const entry of PAGE_REGISTRY) {
    const row = pmByPath.get(entry.path)
    items[`page::${entry.path}::title`] = row?.title ?? entry.defaultTitle
    items[`page::${entry.path}::description`] =
      row?.description ?? entry.defaultDescription
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

  for (const d of docs) {
    items[`doc::${d.id}::title`] = d.title
    if (d.description) items[`doc::${d.id}::description`] = d.description
  }

  // 4. Page-scoped editorial slots from lib/cms/page-defaults.ts. Each public
  // page registers its admin-editable strings (hero eyebrow/title/desc plus
  // every section heading, label, card title, stat label, etc.). These keys
  // are scoped to (pagePath, key) — the same `header.title` key has a
  // different value on /about-us vs /career — so they belong in
  // page_text_overrides, not the global ui_strings catalog.
  for (const page of getAllPageDefaults()) {
    for (const slot of page.slots) {
      const value = slot.defaultValue
      if (typeof value !== 'string' || value.trim().length === 0) continue
      items[`pagetext::${page.path}::${slot.key}`] = value
    }
  }

  // 5. Page blocks (only on published pages). Walk each block's
  // translatable-field paths from its registered descriptor.
  const blockRows = await db
    .select({
      blockId: pageBlocks.id,
      blockType: pageBlocks.blockType,
      props: pageBlocks.props,
      pagePublished: pages.isPublished,
    })
    .from(pageBlocks)
    .leftJoin(pages, eq(pageBlocks.pageId, pages.id))

  for (const row of blockRows) {
    if (row.pagePublished === false) continue
    const descriptor = getBlockDescriptor(row.blockType)
    if (!descriptor) continue
    const props = row.props as Record<string, unknown>
    const paths = expandTranslatablePaths(props, descriptor.translatableFields)
    for (const p of paths) {
      const val = getByPath(props, p)
      if (typeof val === 'string' && val.trim().length > 0) {
        items[`block::${row.blockId}::${p}`] = val
      }
    }
  }

  // 6. Product categories — translate label + description for every active,
  // non-deleted category. The slug stays canonical (per-locale slug overrides
  // are an admin-curated feature, not something MT should guess).
  const catRows = await db
    .select({
      id: productCategories.id,
      label: productCategories.label,
      description: productCategories.description,
    })
    .from(productCategories)
    .where(
      and(eq(productCategories.isActive, true), isNull(productCategories.deletedAt)),
    )
  for (const c of catRows) {
    items[`prodcat::${c.id}::label`] = c.label
    if (c.description && c.description.trim().length > 0) {
      items[`prodcat::${c.id}::description`] = c.description
    }
  }

  // 7. Products — name + description for every published product. Translatable
  // attribute fields (per category-schemas.ts) are intentionally skipped here:
  // they're a mix of strings, arrays, and kv-lists, and the resumable filter
  // tracks at entity granularity so adding them later doesn't re-translate
  // already-done names.
  const prodRows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
    })
    .from(products)
    .where(and(eq(products.status, 'published'), isNull(products.deletedAt)))
  for (const p of prodRows) {
    items[`prod::${p.id}::name`] = p.name
    if (p.description && p.description.trim().length > 0) {
      items[`prod::${p.id}::description`] = p.description
    }
  }

  return { items, uiOverrides }
}

async function setJobStatus(
  id: string,
  patch: Partial<{
    status: TranslationJobStatus
    completedItems: number
    errorMessage: string | null
    startedAt: Date
    finishedAt: Date
  }>,
) {
  await db
    .update(translationJobs)
    .set(patch)
    .where(eq(translationJobs.id, id))
}

/**
 * Retry a transient DB op (Neon HTTP can drop one-off connections) up to
 * `attempts` times with exponential backoff. Returns null after exhausting
 * retries — the caller decides whether to treat that as fatal or skip. We
 * use this around the in-loop progress flush so a single connection blip
 * can't stall the bar at 27% or push the whole job to "failed".
 */
async function withRetry<T>(
  label: string,
  op: () => Promise<T>,
  attempts = 3,
): Promise<T | null> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await op()
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 1_000 * (i + 1)))
      }
    }
  }
  console.error(`[translation-job] ${label} failed after ${attempts} attempts:`, lastErr)
  return null
}

async function persistTranslations(
  targetLocale: string,
  translated: TranslatedBatch,
) {
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

  const ui: UiUpsert[] = []
  const pageUpserts: Map<string, PageUpsert> = new Map()
  const docs: Map<string, DocUpsert> = new Map()
  // For blocks: collect translated field paths per block, then merge them into
  // a sparse props patch (only the translated leaves) for the translation row.
  const blockPatches: Map<string, Record<string, unknown>> = new Map()
  const blockPagePaths: Map<string, string> = new Map()
  // Per-page editorial text overrides (hero, section labels, card titles —
  // every slot declared in lib/cms/page-defaults.ts). Each row is keyed by
  // (pagePath, key, locale).
  const pageTextUpserts: PageTextUpsert[] = []
  const pageTextPagePaths = new Set<string>()
  // Product catalog: category labels/descriptions and product names/descriptions.
  const prodCatUpserts: Map<string, ProdCatUpsert> = new Map()
  const prodUpserts: Map<string, ProdUpsert> = new Map()

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
      // Key shape: block::<id>::<path.with.dots>
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
      // Key shape: pagetext::<pagePath>::<slot.key>
      // Page paths can contain '/' (e.g. '/products/apis'), and slot keys
      // contain '.' but never '::', so the last '::' is the path/key boundary.
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
      // Key shape: prodcat::<uuid>::label|description
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
      // Key shape: prod::<uuid>::name|description
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

  // Persist block translations. For each translated block, look up its page so
  // we can return tags to invalidate the public cache.
  if (blockPatches.size > 0) {
    const blockIds = [...blockPatches.keys()]
    const ownerRows = await db
      .select({ blockId: pageBlocks.id, path: pages.path })
      .from(pageBlocks)
      .leftJoin(pages, eq(pageBlocks.pageId, pages.id))
      .where(inArray(pageBlocks.id, blockIds))
    for (const r of ownerRows) {
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

  // Persist per-page editorial overrides into page_text_overrides. Composite
  // PK (pagePath, key, locale) makes the upsert safe on rerun.
  for (const h of pageTextUpserts) {
    await db
      .insert(pageTextOverrides)
      .values(h)
      .onConflictDoUpdate({
        target: [pageTextOverrides.pagePath, pageTextOverrides.key, pageTextOverrides.locale],
        set: { value: h.value, updatedAt: new Date() },
      })
  }

  // Product category translations. Skip incomplete rows defensively (every
  // category should have a label, but a translation can miss it if MT errored
  // on that one string and we fell back to source).
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

  // Product translations. Same defensive skip on missing name.
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

  const affectedPagePaths = new Set<string>([
    ...blockPagePaths.values(),
    ...pageTextPagePaths,
  ])

  return { affectedPagePaths }
}

export async function generateTranslationsForLocale(
  locale: string,
): Promise<{ jobId: string }> {
  const user = await requireAdmin()
  if (locale === DEFAULT_LOCALE) throw new Error('Cannot translate into the default locale')

  const [lang] = await db.select().from(languages).where(eq(languages.code, locale)).limit(1)
  if (!lang) throw new Error(`Language ${locale} is not registered`)

  // Avoid stacking jobs.
  const existing = await db
    .select({ id: translationJobs.id })
    .from(translationJobs)
    .where(and(eq(translationJobs.locale, locale), eq(translationJobs.status, 'running')))
    .limit(1)
  if (existing.length > 0) {
    throw new Error('A translation job is already running for this locale')
  }

  const { items: allItems } = await buildSourceCorpus()
  const alreadyTranslated = await fetchExistingTranslationKeys(locale)

  // Resumable: skip anything we already have a translation for.
  const items: Record<string, string> = {}
  for (const [k, v] of Object.entries(allItems)) {
    if (!alreadyTranslated.has(k)) items[k] = v
  }
  const total = Object.keys(items).length
  const skipped = Object.keys(allItems).length - total

  if (total === 0) {
    throw new Error(
      `Everything is already translated for ${locale}. To re-translate, delete the existing rows from document_translations / page_metadata_translations / ui_strings first.`,
    )
  }

  const [job] = await db
    .insert(translationJobs)
    .values({
      locale,
      status: 'queued',
      totalItems: total,
      completedItems: 0,
      createdBy: user.id,
    })
    .returning({ id: translationJobs.id })

  revalidatePath('/admin/languages')

  // Run in the background after the response returns.
  after(async () => {
    try {
      await setJobStatus(job.id, { status: 'running', startedAt: new Date() })

      const keys = Object.keys(items)
      const accumulator: TranslatedBatch = {}
      const affectedPagePaths = new Set<string>()
      let done = 0
      // Flush partial results every N items. Kept small so the progress bar
      // moves visibly (every ~1.3s at MyMemory's 260ms pace) rather than
      // jumping in 4-second steps.
      const PERSIST_EVERY = 5
      let lastFlushAt = 0
      let quotaHit = false
      let quotaMessage = ''

      for (const k of keys) {
        try {
          accumulator[k] = await translateOne(items[k], locale)
        } catch (e) {
          const msg = e instanceof Error ? e.message : ''
          if (/quota|429|too many requests|all available free|limit/i.test(msg)) {
            quotaHit = true
            quotaMessage = msg
            break
          }
          // Non-quota error on this string → fall back to source and continue.
          accumulator[k] = items[k]
        }
        done++

        if (done - lastFlushAt >= PERSIST_EVERY) {
          // Retry the flush so a transient Neon connection blip doesn't
          // freeze the bar or push the whole job to "failed". If it still
          // fails after retries we skip this flush and keep translating —
          // the final post-loop flush (also retried) picks up the slack.
          const result = await withRetry('persistTranslations', () =>
            persistTranslations(locale, accumulator),
          )
          if (result) {
            for (const p of result.affectedPagePaths) affectedPagePaths.add(p)
          }
          await withRetry('setJobStatus', () =>
            setJobStatus(job.id, { completedItems: done }),
          )
          lastFlushAt = done
        }
      }

      // Always flush whatever we accumulated.
      if (Object.keys(accumulator).length > lastFlushAt) {
        const { affectedPagePaths: paths } = await persistTranslations(locale, accumulator)
        for (const p of paths) affectedPagePaths.add(p)
      }

      updateTag(uiStringsTag(locale))
      updateTag('ui-strings:all')
      updateTag(LOCALES_TAG)
      for (const path of affectedPagePaths) {
        updateTag(pageTag(path))
        updateTag(pageLocaleTag(path, locale))
      }

      if (quotaHit) {
        const friendly = `MyMemory daily quota exhausted after ${done}/${total} strings. ${
          skipped > 0 ? `(${skipped} already-translated items were skipped before this run.) ` : ''
        }Re-run "Generate translations" once the quota resets — it will resume where it stopped. Set MYMEMORY_EMAIL in .env.local and restart dev to raise the daily limit from 5K to 50K words.`
        await setJobStatus(job.id, {
          status: 'failed',
          completedItems: done,
          errorMessage: friendly + ` Original error: ${quotaMessage}`,
          finishedAt: new Date(),
        })
        await recordActivity({
          action: 'update',
          entityType: 'document',
          entityId: null,
          entityTitle: `Translations: ${lang.name} (${locale})`,
          detail: `Partial: ${done}/${total} translated before MyMemory quota hit.`,
          user,
        })
        return
      }

      await setJobStatus(job.id, {
        status: 'completed',
        completedItems: total,
        finishedAt: new Date(),
        errorMessage: null,
      })

      await recordActivity({
        action: 'update',
        entityType: 'document',
        entityId: null,
        entityTitle: `Translations: ${lang.name} (${locale})`,
        detail: `Auto-translated ${total} new strings (${skipped} already-translated items skipped) via MyMemory.`,
        user,
      })
    } catch (e) {
      const msg =
        e instanceof TranslationError
          ? e.message
          : e instanceof Error
          ? e.message
          : 'Unknown error'
      await setJobStatus(job.id, {
        status: 'failed',
        errorMessage: msg,
        finishedAt: new Date(),
      })
    }
  })

  return { jobId: job.id }
}
