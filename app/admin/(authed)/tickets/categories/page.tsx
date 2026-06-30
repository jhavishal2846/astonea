import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ticketCategories, ticketCategoryTranslations } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import { upsertCategory, deleteCategory } from '../_actions'
import CategoryForm from './CategoryForm'
import RowDelete from './RowDelete'

export const dynamic = 'force-dynamic'

export default async function TicketCategoriesPage() {
  const cats = await db
    .select({
      id: ticketCategories.id,
      slug: ticketCategories.slug,
      slaHours: ticketCategories.slaHours,
      sortOrder: ticketCategories.sortOrder,
      isActive: ticketCategories.isActive,
      name: ticketCategoryTranslations.name,
      defaultAssignedToUserId: ticketCategories.defaultAssignedToUserId,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .orderBy(asc(ticketCategories.sortOrder), asc(ticketCategories.slug))

  // Collapse duplicates from the LEFT JOIN by preferring an `en` translation.
  const dedup = new Map<string, typeof cats[number]>()
  for (const c of cats) {
    if (!dedup.has(c.id) || c.name) dedup.set(c.id, c)
  }
  const rows = Array.from(dedup.values())

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader
        title="Ticket categories"
        description="Departments / topic buckets the public form can pre-select. Optional SLA hours auto-populate ticket due-dates."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Tickets', href: '/admin/tickets' },
          { label: 'Categories' },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Add category</h2>
        <CategoryForm action={upsertCategory} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {rows.map((c) => (
            <li key={c.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{c.name ?? c.slug}</span>
                  <code className="text-xs text-slate-500">{c.slug}</code>
                  {!c.isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                      inactive
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {c.slaHours ? `SLA ${c.slaHours}h` : 'No SLA'} · sort {c.sortOrder}
                </div>
              </div>
              <RowDelete id={c.id} label={c.name ?? c.slug} action={deleteCategory} />
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-slate-500">
              No categories yet — add one above. The form will offer &ldquo;General Enquiry&rdquo; as a fallback when none exist.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
