import { notFound } from 'next/navigation'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  languages,
  productCategories,
  products,
  productToCategories,
  productTranslations,
} from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import ProductForm, { type FormLanguage, type LocaleTranslation } from '../../ProductForm'
import { updateProduct, type ActionState } from '../../_actions'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const row = (await db.select().from(products).where(eq(products.id, id)).limit(1))[0]
  if (!row) notFound()

  const [primaryPivot, langs, allTranslations] = await Promise.all([
    db
      .select({
        categoryId: productToCategories.categoryId,
        subCategory: productToCategories.subCategory,
        categorySlug: productCategories.slug,
      })
      .from(productToCategories)
      .leftJoin(productCategories, eq(productToCategories.categoryId, productCategories.id))
      .where(
        and(eq(productToCategories.productId, id), eq(productToCategories.isPrimary, true)),
      )
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select({
        code: languages.code,
        name: languages.name,
        nativeName: languages.nativeName,
        isDefault: languages.isDefault,
      })
      .from(languages)
      .where(eq(languages.isActive, true))
      .orderBy(asc(languages.displayOrder), asc(languages.code)),
    db
      .select()
      .from(productTranslations)
      .where(eq(productTranslations.productId, id)),
  ])

  const formLanguages: FormLanguage[] = langs.length
    ? langs
    : [{ code: 'en', name: 'English', nativeName: 'English', isDefault: true }]
  const defaultLang = formLanguages.find((l) => l.isDefault) ?? formLanguages[0]

  // Build translations map keyed by locale
  const translations: Record<string, LocaleTranslation> = {}
  for (const tr of allTranslations) {
    translations[tr.locale] = {
      name: tr.name,
      description: tr.description,
      attributes: (tr.attributes as Record<string, unknown>) ?? {},
    }
  }

  // Default-locale values used to populate the default tab's name/description/attrs
  const defaultTr = translations[defaultLang.code]
  const translatedName = defaultTr?.name
  const translatedDescription = defaultTr?.description
  const translatedAttrs = defaultTr?.attributes ?? {}

  const boundUpdate = async (prev: ActionState, formData: FormData) => {
    'use server'
    return updateProduct(id, prev, formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title="Edit product"
        description={row.name}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: 'Edit' },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
        <ProductForm
          action={boundUpdate}
          languages={formLanguages}
          initialValue={{
            id: row.id,
            categorySlug: primaryPivot?.categorySlug ?? undefined,
            subCategory: primaryPivot?.subCategory ?? null,
            name: translatedName ?? row.name,
            slug: row.slug,
            description: translatedDescription ?? row.description,
            attributes: (row.attributes as Record<string, unknown>) ?? {},
            translatedAttributes: translatedAttrs,
            translations,
            synonyms: row.synonyms ?? [],
            status: row.status,
            publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
            displayOrder: row.displayOrder,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
