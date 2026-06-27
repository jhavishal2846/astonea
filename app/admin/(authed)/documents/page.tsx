import Link from '@/app/_nav/AppLink'
import { and, asc, eq, or, sql, type SQL } from 'drizzle-orm'
import { ilikeCi } from '@/lib/db/sqlite-helpers'
import { db } from '@/lib/db'
import { documents, groupCompanies, type DocumentCategory } from '@/lib/db/schema'
import { CATEGORY_LABELS, CATEGORY_PLURAL, SUBCATEGORY_LABELS, ALL_CATEGORIES, isValidCategory } from '@/lib/cms/categories'
import { publicUrlForCategory } from '@/lib/cms/public-urls'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import { IconDownload, IconFile } from '@/app/admin/_icons'
import SearchInput from './SearchInput'
import { ToggleButton, RowActions } from './RowActions'
import NewDocumentTrigger from './NewDocumentTrigger'

const PER_PAGE = 20

export const dynamic = 'force-dynamic'

export default async function DocumentsListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const { category, q, page: pageRaw } = await searchParams
  const activeCategory = category && isValidCategory(category) ? category : null
  const search = (q ?? '').trim()
  const requested = Number(pageRaw) || 1

  const conditions: SQL[] = []
  if (activeCategory) conditions.push(eq(documents.category, activeCategory))
  if (search) {
    const like = `%${search}%`
    conditions.push(
      or(
        ilikeCi(documents.title, like),
        ilikeCi(documents.period, like),
        ilikeCi(documents.fileUrl, like),
      )!,
    )
  }
  const where = conditions.length ? and(...conditions) : undefined

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(documents)
    .where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const [rows, companies, subcatRows] = await Promise.all([
    db
      .select({
        id: documents.id,
        title: documents.title,
        category: documents.category,
        subcategory: documents.subcategory,
        period: documents.period,
        fileUrl: documents.fileUrl,
        externalLink: documents.externalLink,
        isPublished: documents.isPublished,
        displayOrder: documents.displayOrder,
        entityName: groupCompanies.name,
      })
      .from(documents)
      .leftJoin(groupCompanies, eq(documents.entityId, groupCompanies.id))
      .where(where)
      .orderBy(asc(documents.category), asc(documents.displayOrder), asc(documents.title))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ id: groupCompanies.id, name: groupCompanies.name })
      .from(groupCompanies)
      .orderBy(asc(groupCompanies.displayOrder)),
    // Distinct (category, subcategory) pairs already in use — surfaced as
    // datalist suggestions in DocumentForm.
    db
      .selectDistinct({
        category: documents.category,
        subcategory: documents.subcategory,
      })
      .from(documents),
  ])

  const existingSubcategoriesByCategory = subcatRows.reduce<Partial<Record<DocumentCategory, string[]>>>(
    (acc, r) => {
      if (!r.subcategory) return acc
      const bucket = acc[r.category] ?? []
      if (!bucket.includes(r.subcategory)) bucket.push(r.subcategory)
      acc[r.category] = bucket
      return acc
    },
    {},
  )

  const exportHref = `/admin/documents/export.csv?${activeCategory ? `category=${activeCategory}&` : ''}${search ? `q=${encodeURIComponent(search)}` : ''}`

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Documents"
        description={
          total === 0
            ? 'No documents match the current filter.'
            : `${total} ${activeCategory ? CATEGORY_PLURAL[activeCategory].toLowerCase() : 'records'}${search ? ` matching "${search}"` : ''}.`
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Documents' }]}
        actions={
          <>
            <Link
              href={exportHref}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-all"
            >
              <IconDownload className="w-3.5 h-3.5" /> CSV
            </Link>
            <NewDocumentTrigger
              groupCompanies={companies}
              presetCategory={activeCategory ?? undefined}
              existingSubcategoriesByCategory={existingSubcategoriesByCategory}
            />
          </>
        }
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchInput initial={search} />
      </div>

      {/* Category tabs */}
      <div className="mb-5 -mx-1 px-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 pb-1">
          <FilterChip
            href={`/admin/documents${search ? `?q=${encodeURIComponent(search)}` : ''}`}
            label="All"
            active={!activeCategory}
          />
          {ALL_CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              href={`/admin/documents?category=${c}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
              label={CATEGORY_LABELS[c]}
              active={activeCategory === c}
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
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Title</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Period</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">File</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3 max-w-xs">
                    <Link href={`/admin/documents/${row.id}/edit`} className="font-medium text-slate-900 hover:text-primary transition-colors line-clamp-1">
                      {row.title}
                    </Link>
                    {row.entityName && <p className="text-xs text-slate-500 mt-0.5 truncate">{row.entityName}</p>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs flex flex-col">
                      <span className="font-medium text-slate-900">{CATEGORY_LABELS[row.category]}</span>
                      {row.subcategory && (
                        <span className="text-slate-500 mt-0.5">{SUBCATEGORY_LABELS[row.subcategory] ?? row.subcategory}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{row.period ?? '—'}</td>
                  <td className="px-4 py-3 text-xs">
                    <FileChip url={row.fileUrl} externalLink={row.externalLink} />
                  </td>
                  <td className="px-4 py-3">
                    <ToggleButton id={row.id} isPublished={row.isPublished} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <RowActions id={row.id} publicUrl={publicUrlForCategory(row.category)} fileUrl={row.fileUrl} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-3 text-slate-500">
                      <IconFile className="w-8 h-8 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">No documents found</p>
                        <p className="text-xs mt-1">Try a different search or category filter.</p>
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
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/documents"
        searchParams={{
          ...(activeCategory ? { category: activeCategory } : {}),
          ...(search ? { q: search } : {}),
        }}
        itemLabel="documents"
      />
    </div>
  )
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
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

function FileChip({ url, externalLink }: { url: string | null; externalLink: string | null }) {
  if (url) {
    const isBlob = url.startsWith('http')
    const label = isBlob ? 'Blob' : url.split('/').pop() ?? 'file'
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium max-w-[14rem] truncate ${
          isBlob ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-700'
        }`}
        title={url}
      >
        <IconFile className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </span>
    )
  }
  if (externalLink) {
    return <span className="text-[11px] text-slate-500">↗ {externalLink}</span>
  }
  return <span className="text-[11px] text-slate-400 italic">no file</span>
}
