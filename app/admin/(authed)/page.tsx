import Link from 'next/link'
import { asc, desc, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { documents, groupCompanies, users, activityLog } from '@/lib/db/schema'
import { CATEGORY_LABELS, CATEGORY_PLURAL, ALL_CATEGORIES } from '@/lib/cms/categories'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import ActivityList from '@/app/admin/_components/ActivityList'
import { timeAgo } from '@/lib/cms/time'
import { IconChevronRight } from '@/app/admin/_icons'
import NewDocumentTrigger from './documents/NewDocumentTrigger'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [docCounts, draftCount, companyCount, userCount, recentDocs, recentActivity, companies] = await Promise.all([
    db
      .select({ category: documents.category, count: sql<number>`count(*)::int` })
      .from(documents)
      .groupBy(documents.category),
    db.select({ count: sql<number>`count(*)::int` }).from(documents).where(sql`${documents.isPublished} = false`),
    db.select({ count: sql<number>`count(*)::int` }).from(groupCompanies),
    db.select({ count: sql<number>`count(*)::int` }).from(users),
    db
      .select({
        id: documents.id,
        title: documents.title,
        category: documents.category,
        updatedAt: documents.updatedAt,
        isPublished: documents.isPublished,
      })
      .from(documents)
      .orderBy(desc(documents.updatedAt))
      .limit(8),
    db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(8),
    db
      .select({ id: groupCompanies.id, name: groupCompanies.name })
      .from(groupCompanies)
      .orderBy(asc(groupCompanies.displayOrder)),
  ])

  const totalDocs = docCounts.reduce((acc, r) => acc + r.count, 0)
  const draft = draftCount[0]?.count ?? 0
  const counts = new Map<string, number>(docCounts.map((r) => [r.category, r.count]))

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of catalog content across the public site."
        actions={<NewDocumentTrigger groupCompanies={companies} />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Documents"     value={totalDocs}                  hint={`${draft} draft`} href="/admin/documents" />
        <Stat label="Group companies" value={companyCount[0]?.count ?? 0} href="/admin/group-companies" />
        <Stat label="Admins"        value={userCount[0]?.count ?? 0}    href="/admin/users" />
        <Stat label="Activity (24h)" value={recentActivity.filter(a => Date.now() - a.createdAt.getTime() < 86400000).length} href="/admin/activity" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recently updated documents */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recently updated</h2>
            <Link href="/admin/documents" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          {recentDocs.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">No documents yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDocs.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/admin/documents/${d.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{d.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{CATEGORY_LABELS[d.category]} · {timeAgo(d.updatedAt)}</p>
                    </div>
                    {!d.isPublished && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Draft</span>
                    )}
                    <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            <Link href="/admin/activity" className="text-xs font-medium text-primary hover:underline">All</Link>
          </div>
          <div className="px-5">
            <ActivityList rows={recentActivity} />
          </div>
        </div>
      </div>

      {/* By-category breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Documents by category</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {ALL_CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/admin/documents?category=${cat}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors group"
              >
                <span className="text-sm font-medium text-slate-900">{CATEGORY_PLURAL[cat]}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-500">{counts.get(cat) ?? 0}</span>
                  <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value, hint, href }: { label: string; value: number; hint?: string; href: string }) {
  return (
    <Link
      href={href}
      className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="font-display text-3xl font-bold text-slate-900">{value}</div>
        {hint && <div className="text-xs text-slate-500">{hint}</div>}
      </div>
    </Link>
  )
}
