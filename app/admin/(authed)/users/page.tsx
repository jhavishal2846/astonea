import { asc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { createAdmin } from './_actions'
import NewAdminTrigger from './NewAdminTrigger'
import UserResetForm from './UserResetForm'
import DeleteAdminButton from './DeleteAdminButton'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'

export const dynamic = 'force-dynamic'

const PER_PAGE = 10

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageRaw } = await searchParams
  const requested = Number(pageRaw) || 1

  const me = await getCurrentUser()
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(users)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt))
    .limit(PER_PAGE)
    .offset(offset)

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title="Admins"
        description="Anyone in this list can sign in to /admin and manage content."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Admins' }]}
        actions={<NewAdminTrigger action={createAdmin} />}
      />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {rows.map((u) => {
            const isMe = me?.id === u.id
            return (
              <li key={u.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {(u.name ?? u.email).slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900">{u.name ?? u.email}</span>
                      {isMe && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-xlight text-primary">you</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {u.email} · added {u.createdAt.toISOString().slice(0, 10)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <UserResetForm userId={u.id} />
                  {!isMe && <DeleteAdminButton id={u.id} email={u.email} />}
                </div>
              </li>
            )
          })}
          {rows.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-slate-500">
              No admins yet.
            </li>
          )}
        </ul>
      </div>

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/users"
        itemLabel="admins"
      />
    </div>
  )
}
