import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ticketTags } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import { upsertTag, deleteTag } from '../_actions'
import TagForm from './TagForm'
import RowDelete from '../categories/RowDelete'

export const dynamic = 'force-dynamic'

export default async function TicketTagsPage() {
  const tags = await db
    .select()
    .from(ticketTags)
    .orderBy(asc(ticketTags.slug))

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title="Ticket tags"
        description="Free-form labels admins can pin on tickets — separate from categories. Use for ad-hoc workflows like 'vip', 'escalated', 'qa-bug'."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Tickets', href: '/admin/tickets' },
          { label: 'Tags' },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Add tag</h2>
        <TagForm action={upsertTag} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {tags.map((t) => (
            <li key={t.id} className="px-5 py-4 flex items-center gap-4">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  background: t.color ? `${t.color}1a` : '#f1f5f9',
                  borderColor: t.color ?? '#cbd5e1',
                  color: t.color ?? '#475569',
                }}
              >
                {t.label}
              </span>
              <code className="text-xs text-slate-500 flex-1">{t.slug}</code>
              <RowDelete id={t.id} label={t.label} action={deleteTag} />
            </li>
          ))}
          {tags.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-slate-500">No tags yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
