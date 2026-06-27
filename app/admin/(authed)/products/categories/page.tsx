import { asc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { productCategories, productToCategories } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import CategoryRow from './CategoryRow'
import NewCategoryTrigger from './NewCategoryTrigger'

export const dynamic = 'force-dynamic'

export default async function ProductCategoriesPage() {
  const rows = await db
    .select({
      id: productCategories.id,
      slug: productCategories.slug,
      label: productCategories.label,
      description: productCategories.description,
      heroImage: productCategories.heroImage,
      icon: productCategories.icon,
      displayOrder: productCategories.displayOrder,
      isActive: productCategories.isActive,
      productCount: sql<number>`(
        select count(*) from ${productToCategories}
        where ${productToCategories.categoryId} = ${productCategories.id}
      )`,
    })
    .from(productCategories)
    .orderBy(asc(productCategories.displayOrder), asc(productCategories.label))

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader
        title="Product categories"
        description="Buckets shown on the public products section. Attribute schemas per category are defined in code."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Products', href: '/admin/products' },
          { label: 'Categories' },
        ]}
        actions={<NewCategoryTrigger />}
      />

      <div className="space-y-3">
        {rows.map((row) => (
          <CategoryRow key={row.id} row={row} productCount={row.productCount} />
        ))}
        {rows.length === 0 && (
          <div className="px-4 py-16 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl">
            No product categories yet. Click <span className="font-semibold text-slate-700">New category</span> above to add one.
          </div>
        )}
      </div>
    </div>
  )
}
