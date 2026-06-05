import { desc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { activityLog } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import ActivityList from '@/app/admin/_components/ActivityList'

export const dynamic = 'force-dynamic'

const PER_PAGE = 30

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageRaw } = await searchParams
  const requested = Number(pageRaw) || 1

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(activityLog)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select()
    .from(activityLog)
    .orderBy(desc(activityLog.createdAt))
    .limit(PER_PAGE)
    .offset(offset)

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader
        title="Activity log"
        description={
          total === 0
            ? 'No activity recorded yet.'
            : `${total} change${total === 1 ? '' : 's'} across the CMS.`
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Activity log' }]}
      />

      <div className="bg-white border border-slate-200 rounded-2xl px-5">
        <ActivityList rows={rows} />
      </div>

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/activity"
        itemLabel="events"
      />
    </div>
  )
}
