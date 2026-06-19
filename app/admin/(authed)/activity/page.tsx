import { and, desc, ilike, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { activityLog } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'
import ActivityList from '@/app/admin/_components/ActivityList'

export const dynamic = 'force-dynamic'

const PER_PAGE = 30

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageRaw } = await searchParams
  const search = (q ?? '').trim()
  const requested = Number(pageRaw) || 1

  const conditions: SQL[] = []
  if (search) {
    const like = `%${search}%`
    // entityTitle/detail are text; userEmail is the only user-identifying text
    // column (no userName field). action/entityType are enums and intentionally
    // excluded from text search.
    conditions.push(
      or(
        ilike(activityLog.entityTitle, like),
        ilike(activityLog.detail, like),
        ilike(activityLog.userEmail, like),
      )!,
    )
  }
  const where = conditions.length ? and(...conditions) : undefined

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(activityLog)
    .where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select()
    .from(activityLog)
    .where(where)
    .orderBy(desc(activityLog.createdAt))
    .limit(PER_PAGE)
    .offset(offset)

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader
        title="Activity log"
        description={
          total === 0
            ? search
              ? `No events match "${search}".`
              : 'No activity recorded yet.'
            : `${total} change${total === 1 ? '' : 's'}${search ? ` matching "${search}"` : ' across the CMS.'}`
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Activity log' }]}
      />

      <div className="mb-4">
        <AdminSearchInput
          basePath="/admin/activity"
          initial={search}
          placeholder="Search by entity, detail, or admin email…"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl px-5">
        <ActivityList rows={rows} />
      </div>

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/activity"
        searchParams={search ? { q: search } : {}}
        itemLabel="events"
      />
    </div>
  )
}
