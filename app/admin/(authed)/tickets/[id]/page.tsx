import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  tickets,
  ticketMessages,
  ticketAttachments,
  ticketEvents,
  ticketCategories,
  ticketCategoryTranslations,
  ticketTags,
  ticketToTags,
  users,
  type TicketAttachment,
  type TicketMessage,
} from '@/lib/db/schema'
import { TICKET_STATUS_LABELS } from '@/lib/tickets/types'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import { StatusBadge } from '../_components/StatusBadge'
import { PriorityBadge } from '../_components/PriorityBadge'
import TicketSidebar from '../_components/TicketSidebar'
import ReplyComposer from '../_components/ReplyComposer'

export const dynamic = 'force-dynamic'

function r2PublicUrl(key: string): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  return `${env.R2_PUBLIC_BASE ?? ''}/${key}`
}

export default async function AdminTicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = (await db.select().from(tickets).where(eq(tickets.id, id)).limit(1))[0]
  if (!ticket) notFound()

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, id))
    .orderBy(asc(ticketMessages.createdAt))

  const attachments = await db
    .select()
    .from(ticketAttachments)
    .where(eq(ticketAttachments.ticketId, id))

  const events = await db
    .select({
      id: ticketEvents.id,
      eventType: ticketEvents.eventType,
      fromValue: ticketEvents.fromValue,
      toValue: ticketEvents.toValue,
      actorType: ticketEvents.actorType,
      actorUserId: ticketEvents.actorUserId,
      createdAt: ticketEvents.createdAt,
    })
    .from(ticketEvents)
    .where(eq(ticketEvents.ticketId, id))
    .orderBy(asc(ticketEvents.createdAt))

  const members = await db.select({ id: users.id, name: users.name, email: users.email }).from(users)

  const categoryRows = await db
    .select({
      id: ticketCategories.id,
      slug: ticketCategories.slug,
      label: ticketCategoryTranslations.name,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .where(eq(ticketCategories.isActive, true))
  const categoriesById = new Map<string, { id: string; slug: string; label: string }>()
  for (const r of categoryRows) {
    const existing = categoriesById.get(r.id)
    const label = r.label ?? r.slug
    if (!existing) categoriesById.set(r.id, { id: r.id, slug: r.slug, label })
  }
  const categories = Array.from(categoriesById.values())

  const tags = await db
    .select({ id: ticketTags.id, slug: ticketTags.slug, label: ticketTags.label, color: ticketTags.color })
    .from(ticketTags)

  const appliedTagIds = (
    await db.select({ tagId: ticketToTags.tagId }).from(ticketToTags).where(eq(ticketToTags.ticketId, id))
  ).map((r) => r.tagId)

  const attachmentsByMessage = new Map<string | null, TicketAttachment[]>()
  for (const a of attachments) {
    const k = a.messageId ?? null
    const list = attachmentsByMessage.get(k) ?? []
    list.push(a)
    attachmentsByMessage.set(k, list)
  }
  const headerAttachments = attachmentsByMessage.get(null) ?? []

  const renderedAt = Date.now()
  const overdue = ticket.dueBy && ticket.dueBy.getTime() < renderedAt && ['open', 'in_progress', 'waiting'].includes(ticket.status)

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        title={ticket.subject}
        description={
          <span className="inline-flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] tabular-nums text-slate-500">{ticket.shortCode}</span>
            <span className="text-slate-300">·</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {overdue && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                Overdue
              </span>
            )}
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              opened {ticket.createdAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </span>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Tickets', href: '/admin/tickets' },
          { label: ticket.shortCode },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          {/* Submitter summary card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                  {ticket.submitterName.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{ticket.submitterName}</div>
                  <div className="text-xs text-slate-500">
                    via {ticket.source.replace('_', ' ')}
                  </div>
                </div>
              </div>
              {ticket.dueBy && (
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Due</div>
                  <div className={`text-xs ${overdue ? 'text-rose-700 font-semibold' : 'text-slate-700'}`}>
                    {ticket.dueBy.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              )}
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <Field label="Email">
                <a href={`mailto:${ticket.submitterEmail}`} className="text-primary hover:underline break-all">
                  {ticket.submitterEmail}
                </a>
              </Field>
              <Field label="Phone">
                <a href={`tel:${ticket.submitterPhone}`} className="text-primary hover:underline">
                  {ticket.submitterPhone}
                </a>
              </Field>
              {ticket.submitterCompany && <Field label="Company">{ticket.submitterCompany}</Field>}
              {ticket.submitterCity && <Field label="City">{ticket.submitterCity}</Field>}
              <Field label="Locale">{ticket.submitterLocale.toUpperCase()}</Field>
            </dl>
            {headerAttachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Attachments</div>
                <div className="flex flex-wrap gap-2">
                  {headerAttachments.map((a) => (
                    <AttachmentChip key={a.id} filename={a.filename} sizeBytes={a.sizeBytes} href={r2PublicUrl(a.r2Key)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message thread — timeline-style left rail with author avatars */}
          <ol className="relative space-y-3 pl-6 sm:pl-8 before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:w-px before:bg-slate-200">
            {messages.map((m: TicketMessage) => {
              const atts = attachmentsByMessage.get(m.id) ?? []
              const isInternal = m.visibility === 'internal'
              const isAdmin = m.authorType === 'admin'
              const author = isAdmin
                ? members.find((u) => u.id === m.authorUserId)
                : null
              const authorLabel = isAdmin
                ? author?.name ?? author?.email ?? 'Admin'
                : m.authorType === 'submitter'
                ? ticket.submitterName
                : 'System'
              const initial = authorLabel.slice(0, 1).toUpperCase()
              const avatarTone = isInternal
                ? 'bg-amber-500 text-white'
                : isAdmin
                ? 'bg-slate-900 text-white'
                : 'bg-primary/10 text-primary'
              const cardTone = isInternal
                ? 'bg-amber-50/60 border-amber-200'
                : isAdmin
                ? 'bg-white border-slate-200'
                : 'bg-slate-50/70 border-slate-200'
              return (
                <li key={m.id} className="relative">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${avatarTone}`}
                  >
                    {initial}
                  </div>
                  <div className={`rounded-2xl border p-4 ${cardTone}`}>
                    <div className="flex items-center justify-between mb-2 text-xs gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{authorLabel}</span>
                      <div className="flex items-center gap-2">
                        {isInternal && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                            Internal note
                          </span>
                        )}
                        <time
                          className="text-slate-500"
                          dateTime={new Date(m.createdAt).toISOString()}
                          title={new Date(m.createdAt).toLocaleString()}
                        >
                          {new Date(m.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </time>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap text-slate-800 leading-relaxed">{m.body}</p>
                    {atts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {atts.map((a) => (
                          <AttachmentChip
                            key={a.id}
                            filename={a.filename}
                            sizeBytes={a.sizeBytes}
                            href={r2PublicUrl(a.r2Key)}
                            light
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          <ReplyComposer ticketId={ticket.id} />

          {events.length > 0 && (
            <details className="bg-white border border-slate-200 rounded-2xl p-4 group">
              <summary className="text-xs font-bold uppercase tracking-widest text-slate-500 cursor-pointer flex items-center gap-2 select-none">
                <span className="inline-block transition-transform group-open:rotate-90">›</span>
                Event log ({events.length})
              </summary>
              <ol className="mt-3 space-y-1.5 text-xs">
                {events.map((e) => {
                  const actorName =
                    e.actorUserId
                      ? members.find((u) => u.id === e.actorUserId)?.name
                        ?? members.find((u) => u.id === e.actorUserId)?.email
                        ?? 'admin'
                      : e.actorType
                  return (
                    <li key={e.id} className="text-slate-600">
                      <span className="text-slate-400 mr-2 font-mono tabular-nums">
                        {new Date(e.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      <span className="font-semibold text-slate-700">{actorName}</span>{' '}
                      <span>{describeEvent(e)}</span>
                    </li>
                  )
                })}
              </ol>
            </details>
          )}
        </div>

        <TicketSidebar
          ticketId={ticket.id}
          status={ticket.status}
          priority={ticket.priority}
          assigneeId={ticket.assignedToUserId}
          categoryId={ticket.categoryId}
          dueBy={ticket.dueBy}
          members={members}
          categories={categories}
          tags={tags}
          appliedTagIds={appliedTagIds}
        />
      </div>
    </div>
  )
}

function AttachmentChip({
  filename,
  sizeBytes,
  href,
  light,
}: {
  filename: string
  sizeBytes: number
  href: string
  light?: boolean
}) {
  const size = formatBytes(sizeBytes)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2 max-w-[20rem] px-3 py-1.5 rounded-full text-xs border transition-colors ${
        light ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
      }`}
      title={`${filename} (${size})`}
    >
      <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.5l-9.193 9.193a4 4 0 01-5.657-5.657L14.243 8.05a2.5 2.5 0 013.535 3.535L9.5 19.864" />
      </svg>
      <span className="truncate font-medium text-slate-700">{filename}</span>
      <span className="text-slate-400 shrink-0">{size}</span>
    </a>
  )
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800">{children}</dd>
    </div>
  )
}

function describeEvent(e: {
  eventType: string
  fromValue: string | null
  toValue: string | null
}): string {
  const arrow = e.fromValue && e.toValue ? `${e.fromValue} → ${e.toValue}` : e.toValue ?? e.fromValue ?? ''
  switch (e.eventType) {
    case 'status_changed': return `changed status ${arrow}`
    case 'priority_changed': return `changed priority ${arrow}`
    case 'assigned': return `assigned ticket`
    case 'unassigned': return `unassigned ticket`
    case 'category_changed': return `changed category ${arrow}`
    case 'tag_added': return `added tag ${e.toValue}`
    case 'tag_removed': return `removed tag ${e.fromValue}`
    case 'reopened': return `reopened ticket (was ${e.fromValue})`
    case 'due_changed': return `changed due date`
    default: return e.eventType
  }
}
