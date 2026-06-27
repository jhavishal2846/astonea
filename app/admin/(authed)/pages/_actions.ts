'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { and, asc, eq, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { documents, pages, pageBlocks, pageBlockTranslations, pageVersions } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import {
  getBlockDescriptor,
  expandTranslatablePaths,
  getByPath,
  setByPath,
} from '@/lib/cms/blocks'
import { pageTag, pageLocaleTag } from '@/lib/cms/pages'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

export type ActionState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

function normalisePath(input: string): string {
  let p = input.trim()
  if (!p.startsWith('/')) p = '/' + p
  // Collapse double slashes and trailing slash (except for root).
  p = p.replace(/\/+/g, '/')
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  // Forbid characters that would break routing.
  if (!/^\/[\w\-/]*$/.test(p)) {
    throw new Error('Path can only contain letters, numbers, hyphens and slashes.')
  }
  return p
}

function invalidatePagePublic(path: string) {
  revalidatePath(path)
  updateTag(pageTag(path))
}

// ─── Page versioning ─────────────────────────────────────────────────────

const SNAPSHOT_DEBOUNCE_MS = 30_000

type BlockSnapshot = {
  blockType: string
  displayOrder: number
  isLocked: boolean
  props: Record<string, unknown>
}

/**
 * Snapshot the current state of a page's blocks into page_versions. Auto-debounced —
 * if the last snapshot for this page is within the past 30 s, skips. This batches
 * rapid edits (typing in the rich-text body fires updateBlockProps once every
 * 600 ms) into a single version.
 */
async function snapshotPage(
  pageId: string,
  user: SessionUser,
  label?: string,
): Promise<void> {
  const [latest] = await db
    .select({ createdAt: pageVersions.createdAt })
    .from(pageVersions)
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(sql`${pageVersions.createdAt} DESC`)
    .limit(1)

  if (latest && Date.now() - latest.createdAt.getTime() < SNAPSHOT_DEBOUNCE_MS) {
    return
  }

  const blocks = await db
    .select({
      blockType: pageBlocks.blockType,
      displayOrder: pageBlocks.displayOrder,
      isLocked: pageBlocks.isLocked,
      props: pageBlocks.props,
    })
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, pageId))
    .orderBy(asc(pageBlocks.displayOrder))

  await db.insert(pageVersions).values({
    pageId,
    snapshot: { blocks: blocks as BlockSnapshot[] },
    label: label ?? null,
    createdBy: user.id,
  })
}

export async function restorePageVersion(versionId: string) {
  const user = await requireAdmin()
  const [version] = await db
    .select()
    .from(pageVersions)
    .where(eq(pageVersions.id, versionId))
    .limit(1)
  if (!version) throw new Error('Version not found')

  const snapshot = version.snapshot as { blocks?: BlockSnapshot[] } | null
  const blocksToRestore = Array.isArray(snapshot?.blocks) ? snapshot.blocks : []

  // First snapshot the current state so the restore itself is undoable.
  await snapshotPage(version.pageId, user, 'Auto-snapshot before restore')

  await db.delete(pageBlocks).where(eq(pageBlocks.pageId, version.pageId))
  if (blocksToRestore.length > 0) {
    const rows = blocksToRestore.map((b) => ({
      pageId: version.pageId,
      blockType: b.blockType,
      displayOrder: b.displayOrder,
      isLocked: b.isLocked,
      props: b.props as Record<string, unknown>,
    }))
    // D1 caps bound params at 100/statement; pageBlocks has 8 cols → 12 rows/batch
    const CHUNK = 12
    for (let i = 0; i < rows.length; i += CHUNK) {
      await db.insert(pageBlocks).values(rows.slice(i, i + CHUNK))
    }
  }

  const path = await getPagePath(version.pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${version.pageId}/edit`)

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Page: ${path}`,
      detail: `Restored to version ${new Date(version.createdAt).toLocaleString()} (${blocksToRestore.length} blocks)`,
      user,
    }),
  )
}

export async function listPageVersions(pageId: string) {
  await requireAdmin()
  const rows = await db
    .select({
      id: pageVersions.id,
      label: pageVersions.label,
      createdAt: pageVersions.createdAt,
      createdBy: pageVersions.createdBy,
      snapshot: pageVersions.snapshot,
    })
    .from(pageVersions)
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(sql`${pageVersions.createdAt} DESC`)
    .limit(50)
  return rows.map((r) => {
    const snap = r.snapshot as { blocks?: BlockSnapshot[] } | null
    const blockCount = Array.isArray(snap?.blocks) ? snap.blocks.length : 0
    return {
      id: r.id,
      label: r.label,
      createdAt: r.createdAt,
      blockCount,
    }
  })
}

// ─── Pages ───────────────────────────────────────────────────────────────

export async function createPage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin()
  let createdPath = ''
  let createdId = ''
  try {
    const rawPath = String(formData.get('path') ?? '')
    const label = String(formData.get('label') ?? '').trim()
    if (!label) throw new Error('Label is required')
    const path = normalisePath(rawPath)

    const existing = await db
      .select({ id: pages.id })
      .from(pages)
      .where(eq(pages.path, path))
      .limit(1)
    if (existing.length > 0) {
      throw new Error(`A page already exists at ${path}.`)
    }

    const [row] = await db
      .insert(pages)
      .values({ path, label, isPublished: false })
      .returning({ id: pages.id })
    createdId = row.id
    createdPath = path
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create page' }
  }

  revalidatePath('/admin/pages')
  after(() =>
    recordActivity({
      action: 'create',
      entityType: 'document',
      entityId: null,
      entityTitle: `Page: ${createdPath}`,
      detail: 'Created a new CMS page',
      user,
    }),
  )
  redirect(`/admin/pages/${createdId}/edit?ok=created`)
}

export async function updatePageMeta(
  pageId: string,
  patch: { label?: string; isPublished?: boolean; showInNav?: boolean },
) {
  const user = await requireAdmin()
  const [existing] = await db
    .select({ path: pages.path })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1)
  if (!existing) throw new Error('Page not found')

  await db
    .update(pages)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(pages.id, pageId))

  invalidatePagePublic(existing.path)
  revalidatePath('/admin/pages')
  revalidatePath(`/admin/pages/${pageId}/edit`)

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Page: ${existing.path}`,
      detail: 'Updated page settings',
      user,
    }),
  )
}

export async function deletePage(pageId: string) {
  const user = await requireAdmin()
  const [existing] = await db
    .select({ path: pages.path })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1)
  if (!existing) return
  // page_blocks + page_block_translations cascade via FK.
  await db.delete(pages).where(eq(pages.id, pageId))
  invalidatePagePublic(existing.path)
  revalidatePath('/admin/pages')
  after(() =>
    recordActivity({
      action: 'delete',
      entityType: 'document',
      entityId: null,
      entityTitle: `Page: ${existing.path}`,
      detail: 'Deleted CMS page',
      user,
    }),
  )
}

// ─── Blocks ──────────────────────────────────────────────────────────────

async function getPagePath(pageId: string): Promise<string> {
  const [row] = await db
    .select({ path: pages.path })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1)
  if (!row) throw new Error('Page not found')
  return row.path
}

export async function addBlock(pageId: string, blockType: string, insertAt?: number) {
  const user = await requireAdmin()
  await snapshotPage(pageId, user, `Before adding ${blockType}`)
  const descriptor = getBlockDescriptor(blockType)
  if (!descriptor) throw new Error(`Unknown block type: ${blockType}`)

  let order: number
  if (typeof insertAt === 'number') {
    // Shift later blocks down to make room.
    await db
      .update(pageBlocks)
      .set({ displayOrder: sql`${pageBlocks.displayOrder} + 1` })
      .where(
        and(
          eq(pageBlocks.pageId, pageId),
          gte(pageBlocks.displayOrder, insertAt),
        ),
      )
    order = insertAt
  } else {
    const [last] = await db
      .select({ order: pageBlocks.displayOrder })
      .from(pageBlocks)
      .where(eq(pageBlocks.pageId, pageId))
      .orderBy(sql`${pageBlocks.displayOrder} DESC`)
      .limit(1)
    order = (last?.order ?? -1) + 1
  }

  const [row] = await db
    .insert(pageBlocks)
    .values({
      pageId,
      blockType,
      displayOrder: order,
      props: descriptor.defaults as Record<string, unknown>,
    })
    .returning({ id: pageBlocks.id })

  const path = await getPagePath(pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${pageId}/edit`)
  return row.id
}

export async function updateBlockProps(blockId: string, props: Record<string, unknown>) {
  const user = await requireAdmin()
  const [row] = await db
    .select({ pageId: pageBlocks.pageId, blockType: pageBlocks.blockType })
    .from(pageBlocks)
    .where(eq(pageBlocks.id, blockId))
    .limit(1)
  if (!row) throw new Error('Block not found')
  await snapshotPage(row.pageId, user, `Before editing ${row.blockType}`)

  const descriptor = getBlockDescriptor(row.blockType)
  if (!descriptor) throw new Error(`Unknown block type: ${row.blockType}`)

  // Validate through the schema with defaults filled in for any missing keys.
  const parsed = descriptor.schema.safeParse({ ...descriptor.defaults, ...props })
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
  }

  await db
    .update(pageBlocks)
    .set({ props: parsed.data as Record<string, unknown>, updatedAt: new Date() })
    .where(eq(pageBlocks.id, blockId))

  const path = await getPagePath(row.pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${row.pageId}/edit`)
}

/**
 * Save a per-locale translation patch for a block. Only fields declared as
 * translatable in the block descriptor are kept; anything else is silently
 * dropped (the base English row remains the source of truth for structure
 * and non-translatable props like colours, dropdown values, image URLs).
 *
 * For the default locale this is a thin wrapper around `updateBlockProps`.
 */
export async function updateBlockTranslation(
  blockId: string,
  locale: string,
  fullProps: Record<string, unknown>,
) {
  // Default locale always writes to the base row.
  if (locale === DEFAULT_LOCALE) {
    return updateBlockProps(blockId, fullProps)
  }

  const user = await requireAdmin()

  const [row] = await db
    .select({ pageId: pageBlocks.pageId, blockType: pageBlocks.blockType })
    .from(pageBlocks)
    .where(eq(pageBlocks.id, blockId))
    .limit(1)
  if (!row) throw new Error('Block not found')

  const descriptor = getBlockDescriptor(row.blockType)
  if (!descriptor) throw new Error(`Unknown block type: ${row.blockType}`)

  // Build a sparse patch that contains ONLY translatable leaf values. Wildcard
  // paths (`breadcrumb.*.label`) expand against the incoming props so each
  // array row is handled.
  const paths = expandTranslatablePaths(fullProps, descriptor.translatableFields)
  const patch: Record<string, unknown> = {}
  for (const p of paths) {
    const v = getByPath(fullProps, p)
    if (typeof v === 'string') setByPath(patch, p, v)
  }

  if (Object.keys(patch).length === 0) {
    // Nothing translatable was changed; bail out so we don't write empty rows.
    return
  }

  await snapshotPage(row.pageId, user, `Before editing ${locale} translation`)

  await db
    .insert(pageBlockTranslations)
    .values({ blockId, locale, props: patch })
    .onConflictDoUpdate({
      target: [pageBlockTranslations.blockId, pageBlockTranslations.locale],
      set: { props: patch, updatedAt: new Date() },
    })

  const path = await getPagePath(row.pageId)
  invalidatePagePublic(path)
  updateTag(pageLocaleTag(path, locale))
  revalidatePath(`/admin/pages/${row.pageId}/edit`)
}

export async function deleteBlock(blockId: string) {
  const user = await requireAdmin()
  const [row] = await db
    .select({ pageId: pageBlocks.pageId, displayOrder: pageBlocks.displayOrder })
    .from(pageBlocks)
    .where(eq(pageBlocks.id, blockId))
    .limit(1)
  if (!row) return
  await snapshotPage(row.pageId, user, 'Before deleting block')

  await db.delete(pageBlocks).where(eq(pageBlocks.id, blockId))
  // Close the gap.
  await db
    .update(pageBlocks)
    .set({ displayOrder: sql`${pageBlocks.displayOrder} - 1` })
    .where(
      and(
        eq(pageBlocks.pageId, row.pageId),
        gte(pageBlocks.displayOrder, row.displayOrder),
      ),
    )

  const path = await getPagePath(row.pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${row.pageId}/edit`)
}

export async function duplicateBlock(blockId: string) {
  const user = await requireAdmin()
  const [block] = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.id, blockId))
    .limit(1)
  if (block) await snapshotPage(block.pageId, user, 'Before duplicating block')
  if (!block) throw new Error('Block not found')

  const insertAt = block.displayOrder + 1

  // Make room for the new block by shifting later blocks down by one.
  await db
    .update(pageBlocks)
    .set({ displayOrder: sql`${pageBlocks.displayOrder} + 1` })
    .where(
      and(
        eq(pageBlocks.pageId, block.pageId),
        gte(pageBlocks.displayOrder, insertAt),
      ),
    )

  const [row] = await db
    .insert(pageBlocks)
    .values({
      pageId: block.pageId,
      blockType: block.blockType,
      displayOrder: insertAt,
      props: block.props,
    })
    .returning({ id: pageBlocks.id })

  const path = await getPagePath(block.pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${block.pageId}/edit`)
  return row.id
}

export async function moveBlock(blockId: string, direction: 'up' | 'down') {
  const user = await requireAdmin()
  const [block] = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.id, blockId))
    .limit(1)
  if (!block) return
  await snapshotPage(block.pageId, user, 'Before reordering block')

  const targetOrder =
    direction === 'up' ? block.displayOrder - 1 : block.displayOrder + 1
  if (targetOrder < 0) return

  const [neighbour] = await db
    .select()
    .from(pageBlocks)
    .where(
      and(
        eq(pageBlocks.pageId, block.pageId),
        eq(pageBlocks.displayOrder, targetOrder),
      ),
    )
    .limit(1)
  if (!neighbour) return

  // Swap. Use a temporary value to dodge the unique-by-page-and-order constraint
  // even though we don't have one — being defensive in case we add one later.
  await db
    .update(pageBlocks)
    .set({ displayOrder: -1 })
    .where(eq(pageBlocks.id, block.id))
  await db
    .update(pageBlocks)
    .set({ displayOrder: block.displayOrder })
    .where(eq(pageBlocks.id, neighbour.id))
  await db
    .update(pageBlocks)
    .set({ displayOrder: targetOrder })
    .where(eq(pageBlocks.id, block.id))

  const path = await getPagePath(block.pageId)
  invalidatePagePublic(path)
  revalidatePath(`/admin/pages/${block.pageId}/edit`)
}

// ─── Document picker (used by the pdfList block) ─────────────────────────

export type PickerDocument = {
  id: string
  title: string
  category: string
  subcategory: string | null
  period: string | null
  isPublished: boolean
  fileUrl: string | null
}

/**
 * List published-or-not documents for the admin document-picker. Limits the
 * result so the picker stays responsive even if the library grows large.
 */
export async function listDocumentsForPicker(options?: {
  category?: string
  query?: string
  limit?: number
}): Promise<PickerDocument[]> {
  await requireAdmin()
  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      category: documents.category,
      subcategory: documents.subcategory,
      period: documents.period,
      isPublished: documents.isPublished,
      fileUrl: documents.fileUrl,
    })
    .from(documents)
    .orderBy(asc(documents.category), asc(documents.displayOrder), asc(documents.title))
    .limit(options?.limit ?? 500)

  let filtered = rows as PickerDocument[]
  if (options?.category) {
    filtered = filtered.filter((r) => r.category === options.category)
  }
  if (options?.query) {
    const q = options.query.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.period?.toLowerCase().includes(q) ?? false),
    )
  }
  return filtered
}

/**
 * Fetch a specific set of documents in the order the IDs were passed.
 */
export async function getDocumentsByIds(ids: string[]): Promise<PickerDocument[]> {
  if (ids.length === 0) return []
  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      category: documents.category,
      subcategory: documents.subcategory,
      period: documents.period,
      isPublished: documents.isPublished,
      fileUrl: documents.fileUrl,
    })
    .from(documents)
  const byId = new Map(rows.map((r) => [r.id, r as PickerDocument]))
  return ids.map((id) => byId.get(id)).filter((r): r is PickerDocument => Boolean(r))
}

export async function clearBlockTranslations(blockId: string, locale?: string) {
  await requireAdmin()
  if (locale) {
    await db
      .delete(pageBlockTranslations)
      .where(
        and(
          eq(pageBlockTranslations.blockId, blockId),
          eq(pageBlockTranslations.locale, locale),
        ),
      )
  } else {
    await db.delete(pageBlockTranslations).where(eq(pageBlockTranslations.blockId, blockId))
  }
}

