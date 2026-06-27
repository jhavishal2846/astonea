import { and, asc, sql, type SQL } from 'drizzle-orm'
import { ilikeCi } from '@/lib/db/sqlite-helpers'
import { db } from '@/lib/db'
import { groupCompanies } from '@/lib/db/schema'
import { createCompany, deleteCompany } from './_actions'
import CompanyRow from './CompanyRow'
import NewCompanyTrigger from './NewCompanyTrigger'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'

export const dynamic = 'force-dynamic'

const PER_PAGE = 10

export default async function GroupCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageRaw } = await searchParams
  const search = (q ?? '').trim()
  const requested = Number(pageRaw) || 1

  const conditions: SQL[] = []
  if (search) {
    conditions.push(ilikeCi(groupCompanies.name, `%${search}%`))
  }
  const where = conditions.length ? and(...conditions) : undefined

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(groupCompanies)
    .where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select()
    .from(groupCompanies)
    .where(where)
    .orderBy(asc(groupCompanies.displayOrder), asc(groupCompanies.name))
    .limit(PER_PAGE)
    .offset(offset)

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader
        title="Group companies"
        description="Entities shown on the public Group Companies page and referenced by subsidiary financials."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Group Companies' }]}
        actions={<NewCompanyTrigger action={createCompany} />}
      />

      <div className="mb-4">
        <AdminSearchInput
          basePath="/admin/group-companies"
          initial={search}
          placeholder="Search by entity name…"
        />
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <CompanyRow key={row.id} row={row} deleteAction={deleteCompany.bind(null, row.id)} />
        ))}
        {rows.length === 0 && (
          <div className="px-4 py-16 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl">
            {search ? (
              <>No entities match &ldquo;{search}&rdquo;.</>
            ) : (
              <>No group companies yet. Click <span className="font-semibold text-slate-700">New entity</span> to add one.</>
            )}
          </div>
        )}
      </div>

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/group-companies"
        searchParams={search ? { q: search } : {}}
        itemLabel="entities"
      />
    </div>
  )
}
