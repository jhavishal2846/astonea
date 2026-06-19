'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import { and, eq, inArray, sql } from 'drizzle-orm'
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
  uiStrings,
  translationJobs,
  type TranslationJobStatus,
} from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { LOCALES_TAG, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { uiStringsTag } from '@/lib/i18n/ui-strings'
import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'
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
  const [uiRows, pageRows, docRows, blockRows] = await Promise.all([
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

  // 4. Page blocks (only on published pages). Walk each block's
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

  const ui: UiUpsert[] = []
  const pageUpserts: Map<string, PageUpsert> = new Map()
  const docs: Map<string, DocUpsert> = new Map()
  // For blocks: collect translated field paths per block, then merge them into
  // a sparse props patch (only the translated leaves) for the translation row.
  const blockPatches: Map<string, Record<string, unknown>> = new Map()
  const blockPagePaths: Map<string, string> = new Map()

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

  return { affectedPagePaths: new Set(blockPagePaths.values()) }
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
      const PERSIST_EVERY = 15 // flush partial results every N items
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
          const { affectedPagePaths: paths } = await persistTranslations(locale, accumulator)
          for (const p of paths) affectedPagePaths.add(p)
          await setJobStatus(job.id, { completedItems: done })
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
