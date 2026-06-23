'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  languages,
  products,
  productToCategories,
  productTranslations,
  productCategories as productCategoriesTable,
  productUrlAliases,
  type NewProduct,
  type ProductStatus,
} from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import {
  productsTag,
  productTag,
  productCategoriesTag,
  PRODUCTS_ALL_TAG,
} from '@/lib/cms/cache-tags'
import {
  CATEGORY_SCHEMAS,
  translatableKeys,
  type CategorySchema,
  type CategorySlug,
} from '@/lib/products/category-schemas'

export type ActionState = { error?: string; ok?: boolean }

const VALID_STATUSES = new Set<ProductStatus>([
  'draft', 'in_review', 'approved', 'scheduled', 'published', 'archived',
])

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

function emptyToUndef(s: FormDataEntryValue | null): string | undefined {
  if (typeof s !== 'string') return undefined
  const t = s.trim()
  return t === '' ? undefined : t
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[()[\]/\\]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function getSchemaOrThrow(slug: string): CategorySchema {
  const schema = (CATEGORY_SCHEMAS as Record<string, CategorySchema>)[slug]
  if (!schema) throw new Error(`Unknown category: ${slug}`)
  return schema
}

/**
 * Parse a FormData blob into the shape needed to upsert a product + its
 * primary pivot + default-locale translation. Attribute fields are read by key
 * using the prefix `attr:` to namespace them from universal columns.
 */
async function readFormToValues(formData: FormData, opts?: { existingSlug?: string }) {
  const categorySlug = String(formData.get('categorySlug') ?? '')
  const schema = getSchemaOrThrow(categorySlug)

  const name = String(formData.get('name') ?? '').trim()
  if (!name) throw new Error('Name is required')

  const slugRaw = emptyToUndef(formData.get('slug'))
  const slug = slugRaw ? slugify(slugRaw) : slugify(name)
  if (!slug) throw new Error('Slug could not be derived from name')

  const description = emptyToNull(formData.get('description'))
  const subCategory = emptyToNull(formData.get('subCategory'))

  const statusRaw = String(formData.get('status') ?? 'draft') as ProductStatus
  const status: ProductStatus = VALID_STATUSES.has(statusRaw) ? statusRaw : 'draft'

  const displayOrderRaw = emptyToNull(formData.get('displayOrder'))
  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) : 0

  const publishedAtRaw = emptyToNull(formData.get('publishedAt'))
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null

  const synonymsRaw = emptyToUndef(formData.get('synonyms'))
  const synonyms = synonymsRaw
    ? synonymsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  // Attributes: prefixed with attr: in form. Split canonical vs translatable
  // per schema.
  const translatable = translatableKeys(schema)
  const canonicalAttrs: Record<string, unknown> = {}
  const defaultLocaleAttrs: Record<string, unknown> = {}

  for (const field of schema.attributes) {
    const raw = formData.get(`attr:${field.key}`)
    const value = readAttributeValue(field.type, raw, formData, `attr:${field.key}`)
    if (value === undefined) continue
    if (translatable.has(field.key)) defaultLocaleAttrs[field.key] = value
    else canonicalAttrs[field.key] = value
  }

  const translatedName = emptyToUndef(formData.get('translatedName')) ?? name
  const translatedDescription = emptyToNull(formData.get('translatedDescription')) ?? description

  return {
    categorySlug: categorySlug as CategorySlug,
    schema,
    productPatch: {
      slug,
      name,
      description,
      attributes: canonicalAttrs,
      synonyms,
      status,
      publishedAt,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    } satisfies Partial<NewProduct>,
    pivot: { subCategory },
    translation: {
      name: translatedName,
      description: translatedDescription,
      attributes: defaultLocaleAttrs,
    },
    previousSlug: opts?.existingSlug,
  }
}

/**
 * Convert raw form values for an attribute field into the JSONB-ready shape.
 * Returns undefined when the field is empty (so we don't pollute the JSON).
 */
function readAttributeValue(
  type: CategorySchema['attributes'][number]['type'],
  raw: FormDataEntryValue | null,
  formData: FormData,
  prefix: string,
): unknown {
  if (type === 'string-list') {
    // applications etc.: list submitted as `${prefix}[]` repeated
    const items = formData
      .getAll(`${prefix}[]`)
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .filter(Boolean)
    return items.length ? items : undefined
  }
  if (type === 'kv-list') {
    const sizes = formData.getAll(`${prefix}[size]`).map((v) => String(v))
    const types = formData.getAll(`${prefix}[type]`).map((v) => String(v))
    const items: Array<{ size: string; type: string }> = []
    const n = Math.max(sizes.length, types.length)
    for (let i = 0; i < n; i++) {
      const size = (sizes[i] ?? '').trim()
      const ty = (types[i] ?? '').trim()
      if (size || ty) items.push({ size, type: ty })
    }
    return items.length ? items : undefined
  }
  // text / textarea / select
  if (typeof raw !== 'string') return undefined
  const t = raw.trim()
  return t === '' ? undefined : t
}

async function defaultLocale(): Promise<string> {
  const row = (await db.select().from(languages).where(eq(languages.isDefault, true)).limit(1))[0]
  if (row) return row.code
  const en = (await db.select().from(languages).where(eq(languages.code, 'en')).limit(1))[0]
  if (en) return en.code
  throw new Error('No default locale configured. Seed `languages` first.')
}

async function ensureCategoryRow(slug: string) {
  const existing = (await db.select().from(productCategoriesTable).where(eq(productCategoriesTable.slug, slug)).limit(1))[0]
  if (existing) return existing
  const schema = getSchemaOrThrow(slug)
  const [row] = await db
    .insert(productCategoriesTable)
    .values({
      slug,
      label: schema.label,
      description: schema.description ?? null,
      isActive: true,
    })
    .returning()
  return row
}

function invalidate(categorySlug: string, productId?: string) {
  updateTag(productsTag(categorySlug))
  updateTag(PRODUCTS_ALL_TAG)
  updateTag(productCategoriesTag())
  if (productId) updateTag(productTag(productId))
}

/**
 * Force-revalidate the public-side pages so admin edits go live immediately
 * instead of waiting for the 5-minute ISR window. The [locale] segment is
 * literal — Next.js revalidates every locale that has been generated.
 */
function revalidatePublicPaths(args: {
  categorySlug?: string
  oldCategorySlug?: string | null
  slug?: string
  oldSlug?: string | null
}) {
  revalidatePath('/[locale]/products', 'page')
  if (args.categorySlug) {
    revalidatePath(`/[locale]/products/${args.categorySlug}`, 'page')
    if (args.slug) {
      revalidatePath(`/[locale]/products/${args.categorySlug}/${args.slug}`, 'page')
    }
  }
  if (args.oldCategorySlug && args.oldCategorySlug !== args.categorySlug) {
    revalidatePath(`/[locale]/products/${args.oldCategorySlug}`, 'page')
    if (args.oldSlug) {
      revalidatePath(
        `/[locale]/products/${args.oldCategorySlug}/${args.oldSlug}`,
        'page',
      )
    }
  } else if (args.oldSlug && args.categorySlug && args.oldSlug !== args.slug) {
    revalidatePath(`/[locale]/products/${args.categorySlug}/${args.oldSlug}`, 'page')
  }
}

/**
 * Read per-locale translation data submitted via `tr:<locale>:<field>` inputs.
 * Skips the default locale (whose data comes from the main unprefixed fields)
 * and any locale whose name field is empty (admin hasn't translated it yet).
 */
function readPerLocaleTranslations(
  formData: FormData,
  schema: CategorySchema,
  activeLocales: ReadonlyArray<{ code: string }>,
  defaultLocaleCode: string,
): Array<{
  locale: string
  name: string
  description: string | null
  attributes: Record<string, unknown>
}> {
  const translatable = translatableKeys(schema)
  const out: ReturnType<typeof readPerLocaleTranslations> = []

  for (const lang of activeLocales) {
    if (lang.code === defaultLocaleCode) continue
    const name = emptyToUndef(formData.get(`tr:${lang.code}:name`))
    if (!name) continue // admin hasn't filled this locale yet — skip
    const description = emptyToNull(formData.get(`tr:${lang.code}:description`))

    const attributes: Record<string, unknown> = {}
    for (const field of schema.attributes) {
      if (!translatable.has(field.key)) continue
      const prefix = `tr:${lang.code}:attr:${field.key}`
      const raw = formData.get(prefix)
      const value = readAttributeValue(field.type, raw, formData, prefix)
      if (value !== undefined) attributes[field.key] = value
    }
    out.push({ locale: lang.code, name, description, attributes })
  }
  return out
}

async function listActiveLanguages(): Promise<Array<{ code: string }>> {
  return db.select({ code: languages.code }).from(languages).where(eq(languages.isActive, true))
}

/** Resolve a product's current public path (primary category slug + product slug). */
async function getPrimaryPath(
  productId: string,
): Promise<{ categorySlug: string; slug: string } | null> {
  const row = (
    await db
      .select({
        slug: products.slug,
        categorySlug: productCategoriesTable.slug,
      })
      .from(products)
      .innerJoin(
        productToCategories,
        and(eq(productToCategories.productId, products.id), eq(productToCategories.isPrimary, true)),
      )
      .innerJoin(productCategoriesTable, eq(productCategoriesTable.id, productToCategories.categoryId))
      .where(eq(products.id, productId))
      .limit(1)
  )[0]
  return row ?? null
}

/* ─── createProduct ──────────────────────────────────────────────────────── */

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin()
  let createdId: string | null = null
  let createdName = ''
  let createdCategory = ''
  let createdSlug = ''
  try {
    const parsed = await readFormToValues(formData)
    const locale = await defaultLocale()
    const activeLangs = await listActiveLanguages()
    const otherTranslations = readPerLocaleTranslations(formData, parsed.schema, activeLangs, locale)
    const category = await ensureCategoryRow(parsed.categorySlug)

    // Slug clash check
    const conflict = (await db.select({ id: products.id }).from(products).where(eq(products.slug, parsed.productPatch.slug!)).limit(1))[0]
    if (conflict) throw new Error(`A product with slug "${parsed.productPatch.slug}" already exists`)

    const [row] = await db
      .insert(products)
      .values({
        ...parsed.productPatch,
        slug: parsed.productPatch.slug!,
        name: parsed.productPatch.name!,
        createdBy: user.id,
        updatedBy: user.id,
      })
      .returning({ id: products.id })

    createdId = row.id
    createdName = parsed.productPatch.name!
    createdCategory = parsed.categorySlug
    createdSlug = parsed.productPatch.slug!

    await db.insert(productToCategories).values({
      productId: row.id,
      categoryId: category.id,
      subCategory: parsed.pivot.subCategory ?? parsed.schema.defaultSubCategory ?? null,
      isPrimary: true,
    })

    await db.insert(productTranslations).values({
      productId: row.id,
      locale,
      name: parsed.translation.name,
      description: parsed.translation.description,
      attributes: parsed.translation.attributes,
    })

    for (const t of otherTranslations) {
      await db.insert(productTranslations).values({
        productId: row.id,
        locale: t.locale,
        name: t.name,
        description: t.description,
        attributes: t.attributes,
      })
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  if (createdCategory) invalidate(createdCategory, createdId ?? undefined)
  revalidatePublicPaths({ categorySlug: createdCategory, slug: createdSlug })

  if (createdId) {
    const id = createdId
    const name = createdName
    after(() =>
      recordActivity({
        action: 'create',
        entityType: 'product',
        entityId: id,
        entityTitle: name,
        detail: createdCategory,
        user,
      }),
    )
  }

  return { ok: true }
}

/* ─── updateProduct ──────────────────────────────────────────────────────── */

export async function updateProduct(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin()
  let updatedName = ''
  let updatedCategory = ''
  let updatedSlug = ''
  let oldCategorySlugForRevalidate: string | null = null
  let oldSlugForRevalidate: string | null = null

  try {
    const existing = (await db.select().from(products).where(eq(products.id, id)).limit(1))[0]
    if (!existing) throw new Error('Product not found')

    const parsed = await readFormToValues(formData, { existingSlug: existing.slug })
    const locale = await defaultLocale()
    const activeLangs = await listActiveLanguages()
    const otherTranslations = readPerLocaleTranslations(formData, parsed.schema, activeLangs, locale)
    const category = await ensureCategoryRow(parsed.categorySlug)

    // Slug change → record alias so old URL keeps working
    const slugChanged = parsed.productPatch.slug !== existing.slug
    if (slugChanged) {
      const clash = (await db.select({ id: products.id }).from(products).where(eq(products.slug, parsed.productPatch.slug!)).limit(1))[0]
      if (clash) throw new Error(`Another product already uses slug "${parsed.productPatch.slug}"`)
    }

    await db
      .update(products)
      .set({
        ...parsed.productPatch,
        updatedBy: user.id,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))

    // Primary pivot — change category if needed
    const existingPivot = (
      await db
        .select()
        .from(productToCategories)
        .where(and(eq(productToCategories.productId, id), eq(productToCategories.isPrimary, true)))
        .limit(1)
    )[0]

    if (!existingPivot) {
      await db.insert(productToCategories).values({
        productId: id,
        categoryId: category.id,
        subCategory: parsed.pivot.subCategory ?? parsed.schema.defaultSubCategory ?? null,
        isPrimary: true,
      })
    } else if (existingPivot.categoryId !== category.id) {
      // Drop old primary, insert new (compound PK changes)
      await db
        .delete(productToCategories)
        .where(
          and(
            eq(productToCategories.productId, id),
            eq(productToCategories.categoryId, existingPivot.categoryId),
          ),
        )
      await db.insert(productToCategories).values({
        productId: id,
        categoryId: category.id,
        subCategory: parsed.pivot.subCategory ?? parsed.schema.defaultSubCategory ?? null,
        isPrimary: true,
      })
    } else {
      await db
        .update(productToCategories)
        .set({ subCategory: parsed.pivot.subCategory ?? parsed.schema.defaultSubCategory ?? null })
        .where(
          and(
            eq(productToCategories.productId, id),
            eq(productToCategories.categoryId, existingPivot.categoryId),
          ),
        )
    }

    // Default-locale translation upsert
    await db
      .insert(productTranslations)
      .values({
        productId: id,
        locale,
        name: parsed.translation.name,
        description: parsed.translation.description,
        attributes: parsed.translation.attributes,
      })
      .onConflictDoUpdate({
        target: [productTranslations.productId, productTranslations.locale],
        set: {
          name: parsed.translation.name,
          description: parsed.translation.description,
          attributes: parsed.translation.attributes,
          updatedAt: new Date(),
        },
      })

    // Upsert per-locale (non-default) translations
    for (const t of otherTranslations) {
      await db
        .insert(productTranslations)
        .values({
          productId: id,
          locale: t.locale,
          name: t.name,
          description: t.description,
          attributes: t.attributes,
        })
        .onConflictDoUpdate({
          target: [productTranslations.productId, productTranslations.locale],
          set: {
            name: t.name,
            description: t.description,
            attributes: t.attributes,
            updatedAt: new Date(),
          },
        })
    }

    // URL alias for old slug if changed
    if (slugChanged) {
      const oldCategorySlug =
        existingPivot
          ? ((
              await db
                .select({ slug: productCategoriesTable.slug })
                .from(productCategoriesTable)
                .where(eq(productCategoriesTable.id, existingPivot.categoryId))
                .limit(1)
            )[0]?.slug ?? parsed.categorySlug)
          : parsed.categorySlug
      oldCategorySlugForRevalidate = oldCategorySlug
      oldSlugForRevalidate = existing.slug
      await db
        .insert(productUrlAliases)
        .values({
          productId: id,
          locale,
          categorySlug: oldCategorySlug,
          productSlug: existing.slug,
        })
        .onConflictDoNothing()
    } else if (existingPivot && existingPivot.categoryId !== category.id) {
      // Category changed but slug didn't — also need to invalidate the old URL
      const oldCat = (
        await db
          .select({ slug: productCategoriesTable.slug })
          .from(productCategoriesTable)
          .where(eq(productCategoriesTable.id, existingPivot.categoryId))
          .limit(1)
      )[0]?.slug
      oldCategorySlugForRevalidate = oldCat ?? null
    }

    updatedName = parsed.productPatch.name!
    updatedCategory = parsed.categorySlug
    updatedSlug = parsed.productPatch.slug!
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  revalidatePath(`/admin/products/${id}/edit`)
  invalidate(updatedCategory, id)
  revalidatePublicPaths({
    categorySlug: updatedCategory,
    slug: updatedSlug,
    oldCategorySlug: oldCategorySlugForRevalidate,
    oldSlug: oldSlugForRevalidate,
  })

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'product',
      entityId: id,
      entityTitle: updatedName,
      detail: updatedCategory,
      user,
    }),
  )

  redirect(`/admin/products?ok=updated`)
}

/* ─── setStatus ──────────────────────────────────────────────────────────── */

export async function setProductStatus(id: string, next: ProductStatus) {
  if (!VALID_STATUSES.has(next)) throw new Error(`Invalid status: ${next}`)
  const user = await requireAdmin()
  await db
    .update(products)
    .set({
      status: next,
      publishedAt: next === 'published' ? new Date() : undefined,
      updatedBy: user.id,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  invalidate('*', id)
  const path = await getPrimaryPath(id)
  if (path) revalidatePublicPaths({ categorySlug: path.categorySlug, slug: path.slug })

  after(async () => {
    const [row] = await db
      .select({ name: products.name })
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    if (!row) return
    await recordActivity({
      action: next === 'published' ? 'publish' : next === 'archived' ? 'unpublish' : 'update',
      entityType: 'product',
      entityId: id,
      entityTitle: row.name,
      detail: `status → ${next}`,
      user,
    })
  })
}

/* ─── softDelete / restore ───────────────────────────────────────────────── */

export async function softDeleteProduct(id: string) {
  const user = await requireAdmin()
  const [row] = await db
    .select({ name: products.name })
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

  const path = await getPrimaryPath(id) // capture BEFORE delete since path lookup needs the pivot

  await db
    .update(products)
    .set({ deletedAt: new Date(), updatedBy: user.id, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath('/admin/products')
  revalidatePath('/admin')
  invalidate('*', id)
  if (path) revalidatePublicPaths({ categorySlug: path.categorySlug, slug: path.slug })

  if (row) {
    after(() =>
      recordActivity({
        action: 'delete',
        entityType: 'product',
        entityId: id,
        entityTitle: row.name,
        user,
      }),
    )
  }
}

export async function restoreProduct(id: string) {
  const user = await requireAdmin()
  await db
    .update(products)
    .set({ deletedAt: null, updatedBy: user.id, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath('/admin/products')
  invalidate('*', id)
  const path = await getPrimaryPath(id)
  if (path) revalidatePublicPaths({ categorySlug: path.categorySlug, slug: path.slug })
}

/* ─── duplicate ──────────────────────────────────────────────────────────── */

export async function duplicateProduct(id: string) {
  const user = await requireAdmin()
  const [source] = await db.select().from(products).where(eq(products.id, id)).limit(1)
  if (!source) return

  const sourcePivot = (
    await db
      .select()
      .from(productToCategories)
      .where(and(eq(productToCategories.productId, id), eq(productToCategories.isPrimary, true)))
      .limit(1)
  )[0]

  const newSlug = await uniqueSlug(`${source.slug}-copy`)

  const [created] = await db
    .insert(products)
    .values({
      slug: newSlug,
      name: `${source.name} (copy)`,
      description: source.description,
      attributes: source.attributes,
      synonyms: source.synonyms,
      status: 'draft',
      displayOrder: source.displayOrder + 1,
      createdBy: user.id,
      updatedBy: user.id,
    })
    .returning({ id: products.id, name: products.name })

  if (sourcePivot) {
    await db.insert(productToCategories).values({
      productId: created.id,
      categoryId: sourcePivot.categoryId,
      subCategory: sourcePivot.subCategory,
      isPrimary: true,
    })
  }

  // Copy default-locale translation
  const locale = await defaultLocale()
  const sourceTr = (
    await db
      .select()
      .from(productTranslations)
      .where(and(eq(productTranslations.productId, id), eq(productTranslations.locale, locale)))
      .limit(1)
  )[0]
  if (sourceTr) {
    await db.insert(productTranslations).values({
      productId: created.id,
      locale,
      name: `${sourceTr.name} (copy)`,
      description: sourceTr.description,
      attributes: sourceTr.attributes,
    })
  }

  revalidatePath('/admin/products')
  invalidate('*', created.id)
  const path = await getPrimaryPath(created.id)
  if (path) revalidatePublicPaths({ categorySlug: path.categorySlug, slug: path.slug })

  after(() =>
    recordActivity({
      action: 'duplicate',
      entityType: 'product',
      entityId: created.id,
      entityTitle: created.name,
      detail: `from "${source.name}"`,
      user,
    }),
  )

  redirect(`/admin/products/${created.id}/edit?ok=duplicated`)
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = slugify(base)
  for (let n = 0; n < 50; n++) {
    const try_ = n === 0 ? candidate : `${candidate}-${n + 1}`
    const taken = (await db.select({ id: products.id }).from(products).where(eq(products.slug, try_)).limit(1))[0]
    if (!taken) return try_
  }
  // Extreme fallback
  return `${candidate}-${Date.now()}`
}
