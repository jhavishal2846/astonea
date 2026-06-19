'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pageMetadata } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { PAGE_REGISTRY_BY_PATH } from '@/lib/seo/pages-registry'
import { seoTag } from '@/lib/seo/generate-metadata'

export type SeoActionState = { error?: string; ok?: boolean }

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB OG image ceiling

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

export async function upsertPageMetadata(
  _prev: SeoActionState,
  formData: FormData,
): Promise<SeoActionState> {
  const user = await requireAdmin()
  let savedPath = ''
  try {
    const path = String(formData.get('pagePath') ?? '').trim()
    if (!path) throw new Error('Page path is required')
    if (!PAGE_REGISTRY_BY_PATH[path]) {
      throw new Error(`Unknown page path: ${path}`)
    }

    const title = String(formData.get('title') ?? '').trim()
    if (!title) throw new Error('Title is required')

    const description = emptyToNull(formData.get('description'))
    const keywords = emptyToNull(formData.get('keywords'))
    const canonical = emptyToNull(formData.get('canonical'))
    const noIndex =
      formData.get('noIndex') === 'on' || formData.get('noIndex') === 'true'

    let ogImage = emptyToNull(formData.get('ogImageUrl'))
    const file = formData.get('ogImageFile') as File | null
    if (file && file.size > 0) {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(
          `OG image too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB)`,
        )
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._\- ]+/g, '_')
      const key = `og/${Date.now()}-${safeName}`
      const blob = await put(key, file, {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.type || 'image/png',
      })
      ogImage = blob.url
    }

    await db
      .insert(pageMetadata)
      .values({
        pagePath: path,
        title,
        description,
        keywords,
        canonical,
        noIndex,
        ogImage,
        updatedAt: new Date(),
        updatedBy: user.id,
      })
      .onConflictDoUpdate({
        target: pageMetadata.pagePath,
        set: {
          title,
          description,
          keywords,
          canonical,
          noIndex,
          ogImage,
          updatedAt: new Date(),
          updatedBy: user.id,
        },
      })

    savedPath = path
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save SEO' }
  }

  revalidatePath('/admin/seo')
  revalidatePath(savedPath)
  updateTag(seoTag(savedPath))
  updateTag('page-meta:all')

  const path = savedPath
  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `SEO: ${path}`,
      detail: 'Updated page metadata',
      user,
    }),
  )

  redirect(`/admin/seo?ok=updated`)
}

export async function deletePageMetadata(path: string) {
  const user = await requireAdmin()
  if (!PAGE_REGISTRY_BY_PATH[path]) throw new Error(`Unknown page path: ${path}`)
  await db.delete(pageMetadata).where(eq(pageMetadata.pagePath, path))
  revalidatePath('/admin/seo')
  revalidatePath(path)
  updateTag(seoTag(path))
  updateTag('page-meta:all')
  after(() =>
    recordActivity({
      action: 'delete',
      entityType: 'document',
      entityId: null,
      entityTitle: `SEO: ${path}`,
      detail: 'Cleared page metadata (falls back to defaults)',
      user,
    }),
  )
}
