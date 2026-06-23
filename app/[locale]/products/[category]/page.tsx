import Link from '@/components/LocaleLink'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ProductPageHeader from '@/components/ProductPageHeader'
import CatalogPagination from './CatalogPagination'
import { pageMeta } from '@/lib/seo/generate-metadata'
import {
  getCategoryBySlug,
  listProductsByCategory,
  type CatalogRow,
} from '@/lib/products/public-queries'
import {
  getCategorySchema,
  type CategorySchema,
} from '@/lib/products/category-schemas'

export const revalidate = 300

const PER_PAGE = 25

type Params = { locale: string; category: string }
type SearchParams = { q?: string; subcat?: string; page?: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category: catSlug } = await params
  const category = await getCategoryBySlug(catSlug)
  if (!category) return { title: 'Catalog not found' }
  return pageMeta(`/products/${catSlug}`, {
    title: `${category.label} | Astonea Labs`,
    description: category.description ?? `Browse our ${category.label} catalog.`,
  })
}

export default async function CategoryCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { category: catSlug } = await params
  const { q, subcat, page: pageRaw } = await searchParams
  const t = await getTranslations()

  const category = await getCategoryBySlug(catSlug)
  if (!category) notFound()

  const schema = getCategorySchema(catSlug)
  const search = (q ?? '').trim()
  const activeSubCat = subcat?.trim() || null
  const requested = Math.max(1, Number(pageRaw) || 1)
  const offset = (requested - 1) * PER_PAGE

  const { rows, total, subCategories } = await listProductsByCategory(catSlug, {
    subCategory: activeSubCat,
    q: search,
    limit: PER_PAGE,
    offset,
  })

  const listingColumns = schema?.listingColumns ?? ['name', 'subCategory']

  return (
    <>
      <ProductPageHeader
        title={schema?.pluralLabel ?? category.label}
        subtitle={category.description ?? undefined}
        breadcrumbs={[
          { label: t('products.breadcrumb.products'), href: '/products' },
          { label: category.label },
        ]}
        variant="dark"
        tag={schema?.label ?? category.label}
      />

      <section className="py-20 bg-bg">
        <div className="container-wide">
          {/* Toolbar */}
          <form method="get" className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-56 max-w-md">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder={t('products.catalog.search_placeholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150"
              />
              {activeSubCat && <input type="hidden" name="subcat" value={activeSubCat} />}
            </div>
            {(search || activeSubCat) && (
              <Link
                href={`/products/${catSlug}`}
                className="text-xs font-medium text-ink-subtle hover:text-primary transition-colors"
              >
                {t('products.catalog.clear_filters')}
              </Link>
            )}
          </form>

          {/* Sub-category chips */}
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Chip
                href={`/products/${catSlug}${search ? `?q=${encodeURIComponent(search)}` : ''}`}
                label={t('products.catalog.all')}
                active={!activeSubCat}
              />
              {subCategories.map((s) => (
                <Chip
                  key={s}
                  href={`/products/${catSlug}?subcat=${encodeURIComponent(s)}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
                  label={s}
                  active={activeSubCat === s}
                />
              ))}
            </div>
          )}

          {/* Table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-raised">
                    {listingColumns.map((key) => (
                      <th
                        key={key}
                        className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest text-ink-subtle"
                      >
                        {labelForColumn(key, schema, t)}
                      </th>
                    ))}
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border last:border-0 group transition-colors hover:bg-primary-xlight"
                    >
                      {listingColumns.map((key, ci) => (
                        <td key={key} className={cellClass(key, ci)}>
                          {ci === 0 ? (
                            <Link
                              href={`/products/${catSlug}/${row.slug}`}
                              className="font-medium text-ink hover:text-primary transition-colors"
                            >
                              {valueForColumn(key, row)}
                            </Link>
                          ) : (
                            <span>{valueForColumn(key, row)}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/products/${catSlug}/${row.slug}`}
                          className="inline-flex items-center"
                          aria-label={t('products.catalog.view_aria', { name: row.name })}
                        >
                          <svg
                            className="w-4 h-4 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {rows.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-ink-muted font-medium mb-2">{t('products.catalog.empty_heading')}</p>
                  <p className="text-sm text-ink-subtle mb-4">
                    {search || activeSubCat
                      ? t('products.catalog.empty_filtered')
                      : t('products.catalog.empty_unfiltered')}
                  </p>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                  >
                    {t('products.catalog.request_quote')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <CatalogPagination total={total} perPage={PER_PAGE} current={requested} />
        </div>
      </section>
    </>
  )
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'bg-surface border border-border text-ink-muted hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </Link>
  )
}

// Column keys with English defaults registered in [lib/i18n/default-messages.ts].
// next-intl returns the key itself when a message is missing, so we restrict
// translation to known columns and fall back to the schema's label for
// anything else.
const TRANSLATABLE_COLUMNS = new Set([
  'name', 'subCategory', 'casNumber', 'grade', 'molecularFormula',
  'molecularWeight', 'purity', 'appearance', 'storageConditions', 'use',
  'pelletSize', 'pelletType', 'eNumber', 'colourIndex', 'parentApi', 'type',
  'standardisation', 'applications', 'packaging',
])

function labelForColumn(
  key: string,
  schema: CategorySchema | undefined,
  t: (k: string) => string,
): string {
  if (TRANSLATABLE_COLUMNS.has(key)) return t(`products.col.${key}`)
  const def = schema?.attributes.find((a) => a.key === key)
  return def?.label ?? key
}

function valueForColumn(key: string, row: CatalogRow): string {
  if (key === 'name') return row.name
  if (key === 'subCategory') return row.subCategory ?? '—'
  const v = row.translatedAttributes[key] ?? row.attributes[key]
  if (typeof v === 'string' || typeof v === 'number') return String(v) || '—'
  return '—'
}

function cellClass(key: string, columnIndex: number): string {
  // CAS / E-number / Colour Index → mono font
  const monoKeys = new Set(['casNumber', 'eNumber', 'colourIndex'])
  if (monoKeys.has(key)) {
    return 'px-6 py-4 font-mono text-xs text-ink-muted'
  }
  if (key === 'grade') {
    return 'px-6 py-4'
  }
  if (columnIndex === 0) {
    return 'px-6 py-4'
  }
  return 'px-6 py-4 text-xs text-ink-subtle'
}
