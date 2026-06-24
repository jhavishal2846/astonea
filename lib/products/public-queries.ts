import 'server-only'
import { unstable_cache } from 'next/cache'
import { and, asc, eq, ilike, isNull, ne, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { productCategoriesTag, PRODUCTS_ALL_TAG } from '@/lib/cms/cache-tags'
import {
  languages,
  productCategories,
  products,
  productToCategories,
  productTranslations,
  productUrlAliases,
} from '@/lib/db/schema'

/**
 * Read helpers for the public `/products/...` routes.
 *
 * All queries filter to `status='published' AND deleted_at IS NULL` to keep
 * drafts/archived/trashed rows off the public site. Default-locale strings
 * fall back to the canonical row when no translation exists.
 */

const PUBLIC_PREDICATE = sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`

async function defaultLocale(): Promise<string> {
  const row = (await db.select().from(languages).where(eq(languages.isDefault, true)).limit(1))[0]
  if (row) return row.code
  const en = (await db.select().from(languages).where(eq(languages.code, 'en')).limit(1))[0]
  return en?.code ?? 'en'
}

export type ActiveCategory = {
  id: string
  slug: string
  label: string
  description: string | null
  heroImage: string | null
  icon: string | null
  productCount: number
}

async function fetchActiveCategories(): Promise<ActiveCategory[]> {
  return db
    .select({
      id: productCategories.id,
      slug: productCategories.slug,
      label: productCategories.label,
      description: productCategories.description,
      heroImage: productCategories.heroImage,
      icon: productCategories.icon,
      productCount: sql<number>`(
        select count(*)::int
        from ${productToCategories} ptc
        join ${products} p on p.id = ptc.product_id
        where ptc.category_id = "product_categories"."id"
          and p.status = 'published' and p.deleted_at is null
      )`,
    })
    .from(productCategories)
    .where(and(eq(productCategories.isActive, true), isNull(productCategories.deletedAt)))
    .orderBy(asc(productCategories.displayOrder), asc(productCategories.label))
}

export const getActiveCategories = unstable_cache(
  fetchActiveCategories,
  ['public:active-categories'],
  { tags: [productCategoriesTag(), PRODUCTS_ALL_TAG], revalidate: 300 },
)

export async function getCategoryBySlug(slug: string) {
  return (
    await db
      .select()
      .from(productCategories)
      .where(
        and(
          eq(productCategories.slug, slug),
          eq(productCategories.isActive, true),
          isNull(productCategories.deletedAt),
        ),
      )
      .limit(1)
  )[0]
}

export type CatalogRow = {
  id: string
  slug: string
  name: string
  attributes: Record<string, unknown>
  translatedAttributes: Record<string, unknown>
  subCategory: string | null
}

export type CatalogListing = {
  rows: CatalogRow[]
  total: number
  subCategories: string[]
}

export async function listProductsByCategory(
  catSlug: string,
  opts: {
    locale?: string
    subCategory?: string | null
    q?: string | null
    limit: number
    offset: number
  },
): Promise<CatalogListing> {
  const locale = opts.locale ?? (await defaultLocale())
  const category = await getCategoryBySlug(catSlug)
  if (!category) return { rows: [], total: 0, subCategories: [] }

  const conds: SQL[] = [
    eq(productToCategories.categoryId, category.id),
    sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`,
  ]
  if (opts.subCategory) conds.push(eq(productToCategories.subCategory, opts.subCategory))

  if (opts.q && opts.q.trim()) {
    const like = `%${opts.q.trim()}%`
    conds.push(
      or(
        ilike(products.name, like),
        ilike(sql`coalesce(${products.attributes}->>'casNumber','')`, like),
        ilike(sql`coalesce(${products.attributes}->>'eNumber','')`, like),
        ilike(sql`coalesce(${products.attributes}->>'colourIndex','')`, like),
      )!,
    )
  }

  const where = and(...conds)

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(products)
    .innerJoin(
      productToCategories,
      and(eq(productToCategories.productId, products.id), eq(productToCategories.categoryId, category.id)),
    )
    .where(where)

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      attributes: products.attributes,
      translatedAttributes: productTranslations.attributes,
      translatedName: productTranslations.name,
      subCategory: productToCategories.subCategory,
    })
    .from(products)
    .innerJoin(
      productToCategories,
      and(eq(productToCategories.productId, products.id), eq(productToCategories.categoryId, category.id)),
    )
    .leftJoin(
      productTranslations,
      and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale)),
    )
    .where(where)
    .orderBy(asc(productToCategories.displayOrder), asc(products.name))
    .limit(opts.limit)
    .offset(opts.offset)

  // Distinct sub-categories present in this category (drives filter chips).
  const subCatRows = await db
    .selectDistinct({ subCategory: productToCategories.subCategory })
    .from(productToCategories)
    .innerJoin(products, eq(productToCategories.productId, products.id))
    .where(
      and(
        eq(productToCategories.categoryId, category.id),
        sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`,
      ),
    )
  const subCategories = subCatRows
    .map((r) => r.subCategory)
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .sort((a, b) => a.localeCompare(b))

  return {
    rows: rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.translatedName ?? r.name,
      attributes: (r.attributes as Record<string, unknown>) ?? {},
      translatedAttributes: (r.translatedAttributes as Record<string, unknown>) ?? {},
      subCategory: r.subCategory,
    })),
    total: total ?? 0,
    subCategories,
  }
}

export type PublicProduct = {
  id: string
  slug: string
  name: string
  description: string | null
  synonyms: string[]
  /** Canonical + translated, merged. */
  attributes: Record<string, unknown>
  subCategory: string | null
  categorySlug: string
  categoryLabel: string
}

export async function getProductByCategoryAndSlug(
  catSlug: string,
  prodSlug: string,
  opts?: { locale?: string },
): Promise<PublicProduct | null> {
  const locale = opts?.locale ?? (await defaultLocale())
  const row = (
    await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        description: products.description,
        attributes: products.attributes,
        synonyms: products.synonyms,
        subCategory: productToCategories.subCategory,
        categorySlug: productCategories.slug,
        categoryLabel: productCategories.label,
        translatedName: productTranslations.name,
        translatedDescription: productTranslations.description,
        translatedAttributes: productTranslations.attributes,
      })
      .from(products)
      .innerJoin(productToCategories, eq(productToCategories.productId, products.id))
      .innerJoin(productCategories, eq(productCategories.id, productToCategories.categoryId))
      .leftJoin(
        productTranslations,
        and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale)),
      )
      .where(
        and(
          eq(products.slug, prodSlug),
          eq(productCategories.slug, catSlug),
          sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`,
        ),
      )
      .limit(1)
  )[0]
  if (!row) return null

  return {
    id: row.id,
    slug: row.slug,
    name: row.translatedName ?? row.name,
    description: row.translatedDescription ?? row.description,
    synonyms: row.synonyms ?? [],
    attributes: {
      ...((row.attributes as Record<string, unknown>) ?? {}),
      ...((row.translatedAttributes as Record<string, unknown>) ?? {}),
    },
    subCategory: row.subCategory,
    categorySlug: row.categorySlug,
    categoryLabel: row.categoryLabel,
  }
}

export type RelatedProduct = {
  id: string
  slug: string
  name: string
  cas: string | null
  grade: string | null
}

export async function getRelatedProducts(
  productId: string,
  catSlug: string,
  limit: number,
  opts?: { locale?: string },
): Promise<RelatedProduct[]> {
  const locale = opts?.locale ?? (await defaultLocale())
  const category = await getCategoryBySlug(catSlug)
  if (!category) return []

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      cas: sql<string | null>`${products.attributes}->>'casNumber'`,
      grade: sql<string | null>`${products.attributes}->>'grade'`,
      translatedName: productTranslations.name,
    })
    .from(products)
    .innerJoin(
      productToCategories,
      and(eq(productToCategories.productId, products.id), eq(productToCategories.categoryId, category.id)),
    )
    .leftJoin(
      productTranslations,
      and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, locale)),
    )
    .where(
      and(
        ne(products.id, productId),
        sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`,
      ),
    )
    .orderBy(asc(productToCategories.displayOrder), asc(products.name))
    .limit(limit)

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.translatedName ?? r.name,
    cas: r.cas,
    grade: r.grade,
  }))
}

/**
 * Look up a historical (alias) URL → current product. Used in the detail page
 * to 301-redirect old URLs after slug or primary-category changes.
 */
export async function lookupAliasRedirect(
  locale: string,
  catSlug: string,
  prodSlug: string,
): Promise<{ categorySlug: string; productSlug: string } | null> {
  const alias = (
    await db
      .select({ productId: productUrlAliases.productId })
      .from(productUrlAliases)
      .where(
        and(
          eq(productUrlAliases.locale, locale),
          eq(productUrlAliases.categorySlug, catSlug),
          eq(productUrlAliases.productSlug, prodSlug),
        ),
      )
      .limit(1)
  )[0]
  if (!alias) return null

  const current = (
    await db
      .select({
        productSlug: products.slug,
        categorySlug: productCategories.slug,
      })
      .from(products)
      .innerJoin(
        productToCategories,
        and(eq(productToCategories.productId, products.id), eq(productToCategories.isPrimary, true)),
      )
      .innerJoin(productCategories, eq(productCategories.id, productToCategories.categoryId))
      .where(
        and(
          eq(products.id, alias.productId),
          sql`${products.status} = 'published' AND ${products.deletedAt} IS NULL`,
        ),
      )
      .limit(1)
  )[0]
  if (!current) return null

  // Avoid redirect loops if the alias somehow matches the current URL.
  if (current.categorySlug === catSlug && current.productSlug === prodSlug) return null

  return current
}

// keep PUBLIC_PREDICATE referenced so tree-shaking doesn't warn on it
void PUBLIC_PREDICATE
