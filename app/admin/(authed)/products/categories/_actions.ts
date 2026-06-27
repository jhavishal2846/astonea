'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { productCategories, productToCategories } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { productCategoriesTag, PRODUCTS_ALL_TAG } from '@/lib/cms/cache-tags'

export type CategoryState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function readForm(formData: FormData) {
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const label = String(formData.get('label') ?? '').trim()
  if (!label) throw new Error('Label is required')
  const slug = slugify(slugRaw || label)
  if (!slug) throw new Error('Slug could not be derived')

  const description = String(formData.get('description') ?? '').trim() || null
  const heroImage = String(formData.get('heroImage') ?? '').trim() || null
  const icon = String(formData.get('icon') ?? '').trim() || null
  const displayOrder = Number(formData.get('displayOrder') ?? '0') || 0
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true'

  return { slug, label, description, heroImage, icon, displayOrder, isActive }
}

function invalidate(slug?: string) {
  updateTag(productCategoriesTag())
  updateTag(PRODUCTS_ALL_TAG)
  revalidatePath('/admin/products/categories')
  revalidatePath('/admin/products')
  revalidatePath('/[locale]/products', 'page')
  if (slug) revalidatePath(`/[locale]/products/${slug}`, 'page')
}

export async function createCategory(
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const user = await requireAdmin()
  let created: { id: string; label: string; slug: string } | null = null
  try {
    const values = readForm(formData)
    const clash = (
      await db.select({ id: productCategories.id }).from(productCategories).where(eq(productCategories.slug, values.slug)).limit(1)
    )[0]
    if (clash) throw new Error(`A category with slug "${values.slug}" already exists`)
    const [row] = await db.insert(productCategories).values(values).returning({
      id: productCategories.id,
      label: productCategories.label,
      slug: productCategories.slug,
    })
    created = row
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create category' }
  }
  invalidate(created?.slug)
  if (created) {
    const row = created
    after(() =>
      recordActivity({
        action: 'create',
        entityType: 'product_category',
        entityId: row.id,
        entityTitle: row.label,
        detail: row.slug,
        user,
      }),
    )
  }
  return { ok: true }
}

export async function updateCategory(
  id: string,
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const user = await requireAdmin()
  let label = ''
  let savedSlug: string | undefined
  let priorSlug: string | undefined
  try {
    const values = readForm(formData)
    label = values.label
    savedSlug = values.slug
    priorSlug = (
      await db.select({ slug: productCategories.slug }).from(productCategories).where(eq(productCategories.id, id)).limit(1)
    )[0]?.slug
    // Slug uniqueness if changed
    const clash = (
      await db.select({ id: productCategories.id }).from(productCategories).where(eq(productCategories.slug, values.slug)).limit(1)
    )[0]
    if (clash && clash.id !== id) {
      throw new Error(`Slug "${values.slug}" is already used by another category`)
    }
    await db.update(productCategories).set({ ...values, updatedAt: new Date() }).where(eq(productCategories.id, id))
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update category' }
  }
  invalidate(savedSlug)
  if (priorSlug && priorSlug !== savedSlug) invalidate(priorSlug)
  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'product_category',
      entityId: id,
      entityTitle: label,
      user,
    }),
  )
  return { ok: true }
}

export async function toggleCategoryActive(id: string, next: boolean) {
  const user = await requireAdmin()
  await db.update(productCategories).set({ isActive: next, updatedAt: new Date() }).where(eq(productCategories.id, id))
  const [row] = await db
    .select({ label: productCategories.label, slug: productCategories.slug })
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1)
  invalidate(row?.slug)
  if (row) {
    after(() =>
      recordActivity({
        action: 'update',
        entityType: 'product_category',
        entityId: id,
        entityTitle: row.label,
        detail: next ? 'activated' : 'deactivated',
        user,
      }),
    )
  }
}

export async function deleteCategory(id: string): Promise<CategoryState> {
  const user = await requireAdmin()
  // Refuse if any products still reference it
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(productToCategories)
    .where(eq(productToCategories.categoryId, id))
  if ((count ?? 0) > 0) {
    return { error: `Cannot delete — ${count} product${count === 1 ? '' : 's'} still reference this category.` }
  }
  const [row] = await db
    .select({ label: productCategories.label, slug: productCategories.slug })
    .from(productCategories)
    .where(eq(productCategories.id, id))
    .limit(1)
  await db.delete(productCategories).where(eq(productCategories.id, id))
  invalidate(row?.slug)
  if (row) {
    after(() =>
      recordActivity({
        action: 'delete',
        entityType: 'product_category',
        entityId: id,
        entityTitle: row.label,
        user,
      }),
    )
  }
  return { ok: true }
}
