/**
 * One-shot migration: seed the new `products` schema from the existing
 * hardcoded data in `lib/products/data.ts`.
 *
 * Run with: `npx tsx --env-file=.env.local scripts/migrate-products.ts`
 *
 * Idempotent:
 *   - Categories upserted by slug.
 *   - Products upserted by globally-unique slug.
 *   - Primary product↔category pivot row upserted per (productId, categoryId).
 *   - Default-locale translation row upserted per (productId, locale).
 *
 * Does NOT touch:
 *   - `product_documents` — legacy data only has slot labels (COA/MSDS/…), not
 *     document IDs. Admin links real documents via the UI after migration.
 *   - `product_images` — no source images in the hardcoded data.
 *   - Non-default locale translations — populated later by translation_jobs.
 */
import { eq } from 'drizzle-orm'
import { db } from '../lib/db'
import {
  languages,
  productCategories,
  products,
  productToCategories,
  productTranslations,
} from '../lib/db/schema'
import { allProductsByCategory } from '../lib/products/data'
import type { ProductDetail } from '../lib/products/types'
import {
  ALL_CATEGORY_SLUGS,
  CATEGORY_SCHEMAS,
  translatableKeys,
  type CategorySchema,
  type CategorySlug,
} from '../lib/products/category-schemas'

const log = (msg: string) => console.log(`[migrate-products] ${msg}`)

async function main() {
  /* ─── 1. Resolve default locale ────────────────────────────────────────── */

  const defaultLangRows = await db.select().from(languages).where(eq(languages.isDefault, true))
  let defaultLocale = defaultLangRows[0]?.code
  if (!defaultLocale) {
    const en = (await db.select().from(languages).where(eq(languages.code, 'en'))).at(0)
    if (!en) {
      throw new Error(
        'No default language and no "en" row in `languages`. ' +
          'Seed at least one language before running this script.',
      )
    }
    defaultLocale = en.code
    log('No isDefault=true language; falling back to "en".')
  }
  log(`Using default locale: ${defaultLocale}`)

  /* ─── 2. Upsert categories ─────────────────────────────────────────────── */

  const categoryIdBySlug = new Map<string, string>()
  for (const [index, slug] of ALL_CATEGORY_SLUGS.entries()) {
    const schema = CATEGORY_SCHEMAS[slug]
    const existing = (
      await db.select().from(productCategories).where(eq(productCategories.slug, slug)).limit(1)
    )[0]

    if (existing) {
      await db
        .update(productCategories)
        .set({
          label: schema.label,
          description: schema.description ?? null,
          displayOrder: index,
          updatedAt: new Date(),
        })
        .where(eq(productCategories.id, existing.id))
      categoryIdBySlug.set(slug, existing.id)
    } else {
      const [row] = await db
        .insert(productCategories)
        .values({
          slug,
          label: schema.label,
          description: schema.description ?? null,
          displayOrder: index,
          isActive: true,
        })
        .returning({ id: productCategories.id })
      categoryIdBySlug.set(slug, row.id)
      log(`+ category: ${slug}`)
    }
  }

  /* ─── 3. Per-product upsert ────────────────────────────────────────────── */

  let inserted = 0
  let updated = 0
  let skipped = 0
  const seenSlugs = new Set<string>()

  for (const [catSlug, items] of Object.entries(allProductsByCategory)) {
    const schema = CATEGORY_SCHEMAS[catSlug as CategorySlug]
    const categoryId = categoryIdBySlug.get(catSlug)
    if (!schema || !categoryId) {
      log(`! no schema/category for "${catSlug}", skipping ${items.length} rows`)
      skipped += items.length
      continue
    }
    const translatable = translatableKeys(schema)
    const legacyMap = legacyKeyMapFor(catSlug as CategorySlug)

    let catInserted = 0
    let catUpdated = 0
    let catDup = 0

    for (const item of items) {
      if (seenSlugs.has(item.slug)) {
        // Same slug appearing in two source arrays — common for cross-listed
        // chemicals. Add a secondary (non-primary) pivot row and move on.
        catDup += 1
        const productId = (
          await db.select({ id: products.id }).from(products).where(eq(products.slug, item.slug)).limit(1)
        )[0]?.id
        if (productId) {
          await upsertPivot({
            productId,
            categoryId,
            subCategory: pickSubCategory(item, schema),
            isPrimary: false,
          })
        }
        continue
      }
      seenSlugs.add(item.slug)

      const { canonicalAttrs, translatedAttrs } = splitAttributes(item, legacyMap, translatable)

      const existing = (
        await db.select().from(products).where(eq(products.slug, item.slug)).limit(1)
      )[0]

      let productId: string
      if (existing) {
        productId = existing.id
        await db
          .update(products)
          .set({
            name: item.name,
            description: item.description ?? null,
            attributes: canonicalAttrs,
            status: 'published',
            publishedAt: existing.publishedAt ?? new Date(),
            updatedAt: new Date(),
          })
          .where(eq(products.id, productId))
        catUpdated += 1
        updated += 1
      } else {
        const [row] = await db
          .insert(products)
          .values({
            slug: item.slug,
            name: item.name,
            description: item.description ?? null,
            attributes: canonicalAttrs,
            status: 'published',
            publishedAt: new Date(),
          })
          .returning({ id: products.id })
        productId = row.id
        catInserted += 1
        inserted += 1
      }

      await upsertPivot({
        productId,
        categoryId,
        subCategory: pickSubCategory(item, schema),
        isPrimary: true,
      })

      await upsertTranslation({
        productId,
        locale: defaultLocale!,
        name: item.name,
        description: item.description ?? null,
        attributes: translatedAttrs,
      })
    }

    const dupNote = catDup > 0 ? `, ${catDup} cross-listed` : ''
    log(`  ${catSlug}: +${catInserted} new, ${catUpdated} updated${dupNote}`)
  }

  log('')
  log(`Done. Inserted ${inserted}, updated ${updated}, skipped ${skipped}.`)
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function pickSubCategory(item: ProductDetail, schema: CategorySchema): string | null {
  return item.category?.trim() || schema.defaultSubCategory || null
}

/**
 * Maps legacy ProductDetail field names to the schema attribute keys.
 * Returned object is `{ legacyFieldName: schemaAttributeKey }`.
 */
function legacyKeyMapFor(slug: CategorySlug): Record<string, string> {
  const base: Record<string, string> = {
    cas: 'casNumber',
    grade: 'grade',
    molecularFormula: 'molecularFormula',
    molecularWeight: 'molecularWeight',
    purity: 'purity',
    appearance: 'appearance',
    storageConditions: 'storageConditions',
    applications: 'applications',
    packaging: 'packaging',
  }
  switch (slug) {
    case 'herbal-extracts':
      return { ...base, standardisation: 'standardisation' }
    case 'food-chemicals':
      return { ...base, eno: 'eNumber', use: 'use' }
    case 'dyes-and-intermediates':
      return { ...base, ci: 'colourIndex', use: 'use' }
    case 'impurities':
      return { ...base, api: 'parentApi' }
    case 'excipients':
      return { ...base, use: 'use' }
    case 'organic-inorganic':
      return { ...base, type: 'type' }
    case 'pellets':
      return { ...base, size: 'pelletSize', type: 'pelletType', use: 'use' }
    default:
      return base
  }
}

function splitAttributes(
  item: ProductDetail,
  legacyMap: Record<string, string>,
  translatable: Set<string>,
): { canonicalAttrs: Record<string, unknown>; translatedAttrs: Record<string, unknown> } {
  const canonicalAttrs: Record<string, unknown> = {}
  const translatedAttrs: Record<string, unknown> = {}

  for (const [legacyKey, schemaKey] of Object.entries(legacyMap)) {
    const value = (item as unknown as Record<string, unknown>)[legacyKey]
    if (!isMeaningful(value)) continue
    if (translatable.has(schemaKey)) translatedAttrs[schemaKey] = value
    else canonicalAttrs[schemaKey] = value
  }
  return { canonicalAttrs, translatedAttrs }
}

function isMeaningful(v: unknown): boolean {
  if (v === undefined || v === null) return false
  if (typeof v === 'string') {
    const t = v.trim()
    return t !== '' && t !== '—' && t !== '-'
  }
  if (Array.isArray(v)) return v.length > 0
  return true
}

async function upsertPivot(args: {
  productId: string
  categoryId: string
  subCategory: string | null
  isPrimary: boolean
}) {
  await db
    .insert(productToCategories)
    .values({
      productId: args.productId,
      categoryId: args.categoryId,
      subCategory: args.subCategory,
      isPrimary: args.isPrimary,
    })
    .onConflictDoUpdate({
      target: [productToCategories.productId, productToCategories.categoryId],
      set: {
        subCategory: args.subCategory,
        // Don't demote an existing primary if this call is for a secondary listing
        ...(args.isPrimary ? { isPrimary: true } : {}),
      },
    })
}

async function upsertTranslation(args: {
  productId: string
  locale: string
  name: string
  description: string | null
  attributes: Record<string, unknown>
}) {
  await db
    .insert(productTranslations)
    .values({
      productId: args.productId,
      locale: args.locale,
      name: args.name,
      description: args.description,
      attributes: args.attributes,
    })
    .onConflictDoUpdate({
      target: [productTranslations.productId, productTranslations.locale],
      set: {
        name: args.name,
        description: args.description,
        attributes: args.attributes,
        updatedAt: new Date(),
      },
    })
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error('[migrate-products] FAILED')
    console.error(err)
    process.exit(1)
  },
)
