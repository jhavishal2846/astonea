import Link from '@/app/_nav/AppLink'
import { and, asc, desc, eq, isNull, isNotNull, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  languages,
  productCategories,
  products,
  productToCategories,
} from '@/lib/db/schema'
import { ilikeCi } from '@/lib/db/sqlite-helpers'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'
import { IconBuilding, IconPlus } from '@/app/admin/_icons'
import NewProductTrigger from './NewProductTrigger'
import { StatusBadge, RowActions } from './RowActions'
import StatusFilter, { type StatusValue } from './StatusFilter'

const PER_PAGE = 25

export const dynamic = 'force-dynamic'

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; q?: string; page?: string }>
}) {
  const { category, status, q, page: pageRaw } = await searchParams
  const search = (q ?? '').trim()
  const activeStatus = (status ?? 'all') as StatusValue

  const conds: SQL[] = []
  if (activeStatus === 'trash') {
    conds.push(isNotNull(products.deletedAt))
  } else {
    conds.push(isNull(products.deletedAt))
    if (activeStatus !== 'all') {
      conds.push(eq(products.status, activeStatus))
    }
  }
  if (category) {
    conds.push(eq(productCategories.slug, category))
  }
  if (search) {
    const like = `%${search}%`
    conds.push(
      or(
        ilikeCi(products.name, like),
        ilikeCi(products.slug, like),
        ilikeCi(sql`coalesce(json_extract(${products.attributes}, '$.casNumber'), '')`, like),
      )!,
    )
  }
  const where = and(...conds)

  const requested = Number(pageRaw) || 1

  const [{ count: total }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(
      productToCategories,
      and(
        eq(productToCategories.productId, products.id),
        eq(productToCategories.isPrimary, true),
      ),
    )
    .leftJoin(productCategories, eq(productToCategories.categoryId, productCategories.id))
    .where(where)

  const totalPages = Math.max(1, Math.ceil((total ?? 0) / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const [rows, categoryRows, langRows, subCatRows] = await Promise.all([
    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        status: products.status,
        deletedAt: products.deletedAt,
        updatedAt: products.updatedAt,
        publishedAt: products.publishedAt,
        cas: sql<string | null>`json_extract(${products.attributes}, '$.casNumber')`,
        grade: sql<string | null>`json_extract(${products.attributes}, '$.grade')`,
        categorySlug: productCategories.slug,
        categoryLabel: productCategories.label,
        subCategory: productToCategories.subCategory,
      })
      .from(products)
      .leftJoin(
        productToCategories,
        and(
          eq(productToCategories.productId, products.id),
          eq(productToCategories.isPrimary, true),
        ),
      )
      .leftJoin(productCategories, eq(productToCategories.categoryId, productCategories.id))
      .where(where)
      .orderBy(desc(products.updatedAt))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({
        slug: productCategories.slug,
        label: productCategories.label,
      })
      .from(productCategories)
      .where(eq(productCategories.isActive, true))
      .orderBy(asc(productCategories.displayOrder)),
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
    // Distinct sub-category values across all products. Used as datalist
    // suggestions in ProductForm so admins see what's already in use.
    db
      .selectDistinct({ subCategory: productToCategories.subCategory })
      .from(productToCategories),
  ])

  const existingSubCategories = subCatRows
    .map((r) => r.subCategory)
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .sort((a, b) => a.localeCompare(b))

  const formLanguages = langRows.length
    ? langRows
    : [{ code: 'en', name: 'English', nativeName: 'English', isDefault: true }]

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Products"
        description={
          total === 0
            ? 'No products match the current filter.'
            : `${total} record${total === 1 ? '' : 's'}${search ? ` matching "${search}"` : ''}.`
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Products' }]}
        actions={
          <>
            <Link
              href="/admin/products/categories"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-all"
            >
              <IconBuilding className="w-3.5 h-3.5" /> Categories
            </Link>
            <NewProductTrigger
              languages={formLanguages}
              categories={categoryRows}
              existingSubCategories={existingSubCategories}
            />
          </>
        }
      />

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <AdminSearchInput basePath="/admin/products" placeholder="Search name, slug, CAS…" initial={search} />
        <StatusFilter value={activeStatus} />
      </div>

      {/* Category chips */}
      <div className="mb-5 -mx-1 px-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 pb-1">
          <CategoryChip
            href={buildUrl({ status: activeStatus, q: search })}
            label="All categories"
            active={!category}
          />
          {categoryRows.map((c) => (
            <CategoryChip
              key={c.slug}
              href={buildUrl({ status: activeStatus, q: search, category: c.slug })}
              label={c.label}
              active={category === c.slug}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Product</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">CAS</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Grade</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3 max-w-sm">
                    <Link
                      href={`/admin/products/${row.id}/edit`}
                      className="font-medium text-slate-900 hover:text-primary transition-colors line-clamp-1"
                    >
                      {row.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">{row.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{row.categoryLabel ?? '—'}</span>
                      {row.subCategory && (
                        <span className="text-slate-500 mt-0.5">{row.subCategory}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
                    {row.cas ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {row.grade ? (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded">{row.grade}</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} deleted={!!row.deletedAt} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <RowActions
                        id={row.id}
                        slug={row.slug}
                        categorySlug={row.categorySlug ?? null}
                        status={row.status}
                        deleted={!!row.deletedAt}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-3 text-slate-500">
                      <IconPlus className="w-8 h-8 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">No products found</p>
                        <p className="text-xs mt-1">
                          {activeStatus === 'trash'
                            ? 'No soft-deleted products.'
                            : 'Try a different filter, or add your first product.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPagination
        total={total ?? 0}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/products"
        searchParams={{
          ...(category ? { category } : {}),
          ...(activeStatus !== 'all' ? { status: activeStatus } : {}),
          ...(search ? { q: search } : {}),
        }}
        itemLabel="products"
      />
    </div>
  )
}

function CategoryChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
        ${active
          ? 'bg-slate-900 text-white'
          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
        }
      `}
    >
      {label}
    </Link>
  )
}

function buildUrl(parts: { status?: string; q?: string; category?: string }): string {
  const p = new URLSearchParams()
  if (parts.category) p.set('category', parts.category)
  if (parts.status && parts.status !== 'all') p.set('status', parts.status)
  if (parts.q) p.set('q', parts.q)
  const qs = p.toString()
  return qs ? `/admin/products?${qs}` : '/admin/products'
}
