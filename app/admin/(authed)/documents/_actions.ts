'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { eq } from 'drizzle-orm'
import { put } from '@vercel/blob'
import { db } from '@/lib/db'
import { documents, type NewDocument, type DocumentCategory } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { isValidCategory, CATEGORY_LABELS } from '@/lib/cms/categories'
import { recordActivity } from '@/lib/cms/audit'

export type ActionState = { error?: string; ok?: boolean }

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024 // 25 MB ceiling

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

function emptyToNull(s: FormDataEntryValue | null): string | null {
  if (typeof s !== 'string') return null
  const t = s.trim()
  return t === '' ? null : t
}

async function readFormToValues(formData: FormData) {
  const category = String(formData.get('category') ?? '')
  if (!isValidCategory(category)) throw new Error(`Invalid category: ${category}`)

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const file = formData.get('file') as File | null
  const manualFileUrl = emptyToNull(formData.get('fileUrl'))

  let fileUrl: string | null = manualFileUrl
  let fileSizeBytes: number | null = null

  if (file && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(`File too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB)`)
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._\- ]+/g, '_')
    const key = `documents/${Date.now()}-${safeName}`
    const blob = await put(key, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type || 'application/pdf',
    })
    fileUrl = blob.url
    fileSizeBytes = file.size
  }

  const period = emptyToNull(formData.get('period'))
  const description = emptyToNull(formData.get('description'))
  const subcategory = emptyToNull(formData.get('subcategory'))
  const externalLink = emptyToNull(formData.get('externalLink'))
  const eventDate = emptyToNull(formData.get('eventDate'))
  const entityId = emptyToNull(formData.get('entityId'))
  const displayOrderRaw = emptyToNull(formData.get('displayOrder'))
  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) : 0
  const isPublished = formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true'

  return {
    category: category as DocumentCategory,
    title,
    description,
    fileUrl,
    fileSizeBytes,
    period,
    eventDate,
    entityId,
    externalLink,
    subcategory,
    displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    isPublished,
  } satisfies Partial<NewDocument> & { category: DocumentCategory; title: string }
}

export async function createDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin()
  let createdId: string | null = null
  let createdTitle = ''
  let createdCategory: DocumentCategory | null = null
  try {
    const values = await readFormToValues(formData)
    const [row] = await db.insert(documents).values(values as NewDocument).returning({ id: documents.id })
    createdId = row.id
    createdTitle = values.title
    createdCategory = values.category
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create document' }
  }
  revalidatePath('/admin/documents')
  revalidatePath('/admin')
  if (createdId && createdCategory) {
    const id = createdId
    const title = createdTitle
    const cat = createdCategory
    after(() => recordActivity({
      action: 'create',
      entityType: 'document',
      entityId: id,
      entityTitle: title,
      detail: CATEGORY_LABELS[cat],
      user,
    }))
  }
  return { ok: true }
}

export async function updateDocument(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin()
  let updatedTitle = ''
  let updatedCategory: DocumentCategory | null = null
  try {
    const values = await readFormToValues(formData)
    updatedTitle = values.title
    updatedCategory = values.category

    const preserveExisting = !formData.get('file') || (formData.get('file') as File).size === 0
    const explicitlyClearedUrl = formData.get('fileUrl') === '' && formData.get('clearFile') === 'true'

    const patch: Partial<NewDocument> & { updatedAt: Date } = {
      ...values,
      updatedAt: new Date(),
    }

    if (preserveExisting && !explicitlyClearedUrl && !values.fileUrl) {
      delete (patch as Record<string, unknown>).fileUrl
      delete (patch as Record<string, unknown>).fileSizeBytes
    }

    await db.update(documents).set(patch).where(eq(documents.id, id))
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update document' }
  }
  revalidatePath('/admin/documents')
  revalidatePath('/admin')
  revalidatePath(`/admin/documents/${id}/edit`)
  const title = updatedTitle
  const cat = updatedCategory
  after(() => recordActivity({
    action: 'update',
    entityType: 'document',
    entityId: id,
    entityTitle: title,
    detail: cat ? CATEGORY_LABELS[cat] : null,
    user,
  }))
  redirect('/admin/documents?ok=updated')
}

export async function deleteDocument(id: string) {
  const user = await requireAdmin()
  const [row] = await db.select({ title: documents.title, category: documents.category }).from(documents).where(eq(documents.id, id)).limit(1)
  await db.delete(documents).where(eq(documents.id, id))
  revalidatePath('/admin/documents')
  revalidatePath('/admin')
  if (row) {
    after(() => recordActivity({
      action: 'delete',
      entityType: 'document',
      entityId: id,
      entityTitle: row.title,
      detail: CATEGORY_LABELS[row.category],
      user,
    }))
  }
}

export async function togglePublish(id: string, next: boolean) {
  const user = await requireAdmin()
  await db.update(documents).set({ isPublished: next, updatedAt: new Date() }).where(eq(documents.id, id))
  revalidatePath('/admin/documents')
  revalidatePath('/admin')
  after(async () => {
    const [row] = await db.select({ title: documents.title }).from(documents).where(eq(documents.id, id)).limit(1)
    if (row) {
      await recordActivity({
        action: next ? 'publish' : 'unpublish',
        entityType: 'document',
        entityId: id,
        entityTitle: row.title,
        user,
      })
    }
  })
}

export async function duplicateDocument(id: string) {
  const user = await requireAdmin()
  const [source] = await db.select().from(documents).where(eq(documents.id, id)).limit(1)
  if (!source) return
  const [created] = await db
    .insert(documents)
    .values({
      category: source.category,
      subcategory: source.subcategory,
      title: `${source.title} (copy)`,
      description: source.description,
      fileUrl: null,            // don't copy file; admin uploads a new one
      fileSizeBytes: null,
      period: source.period,
      eventDate: source.eventDate,
      entityId: source.entityId,
      externalLink: source.externalLink,
      displayOrder: source.displayOrder + 1,
      isPublished: false,        // copies start as drafts
    })
    .returning({ id: documents.id, title: documents.title })

  revalidatePath('/admin/documents')
  revalidatePath('/admin')
  after(() => recordActivity({
    action: 'duplicate',
    entityType: 'document',
    entityId: created.id,
    entityTitle: created.title,
    detail: `from "${source.title}"`,
    user,
  }))
  redirect(`/admin/documents/${created.id}/edit?ok=duplicated`)
}
