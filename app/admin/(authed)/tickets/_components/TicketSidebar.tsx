'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TICKET_STATUS_VALUES,
  TICKET_PRIORITY_VALUES,
  type TicketStatus,
  type TicketPriority,
} from '@/lib/db/schema'
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/lib/tickets/types'
import {
  changeStatus,
  changePriority,
  assignTicket,
  changeCategory,
  setDueDate,
  addTag,
  removeTag,
} from '../_actions'

type Member = { id: string; name: string | null; email: string }
type Category = { id: string; slug: string; label: string }
type Tag = { id: string; slug: string; label: string; color: string | null }

export default function TicketSidebar({
  ticketId,
  status,
  priority,
  assigneeId,
  categoryId,
  dueBy,
  members,
  categories,
  tags,
  appliedTagIds,
}: {
  ticketId: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId: string | null
  categoryId: string | null
  dueBy: Date | null
  members: Member[]
  categories: Category[]
  tags: Tag[]
  appliedTagIds: string[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function run(fn: () => Promise<{ ok?: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  const selectCls =
    'w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:opacity-50 cursor-pointer appearance-none bg-[url("data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27none%27 stroke=%27%2394a3b8%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M3 4.5l3 3 3-3%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.65rem_center] bg-[length:0.85rem]'

  const dueRelative = dueBy ? formatDue(dueBy) : null

  return (
    <aside className="space-y-5 lg:sticky lg:top-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
        <Section title="Status">
          <select
            value={status}
            onChange={(e) => run(() => changeStatus(ticketId, e.target.value as TicketStatus))}
            disabled={pending}
            className={selectCls}
            aria-label="Change ticket status"
          >
            {(TICKET_STATUS_VALUES as readonly TicketStatus[]).map((s) => (
              <option key={s} value={s}>{TICKET_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </Section>

        <Section title="Priority">
          <select
            value={priority}
            onChange={(e) => run(() => changePriority(ticketId, e.target.value as TicketPriority))}
            disabled={pending}
            className={selectCls}
            aria-label="Change ticket priority"
          >
            {(TICKET_PRIORITY_VALUES as readonly TicketPriority[]).map((p) => (
              <option key={p} value={p}>{TICKET_PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </Section>

        <Section title="Assignee">
          <select
            value={assigneeId ?? ''}
            onChange={(e) => run(() => assignTicket(ticketId, e.target.value || null))}
            disabled={pending}
            className={selectCls}
            aria-label="Assign ticket"
          >
            <option value="">— Unassigned —</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name ?? m.email}</option>
            ))}
          </select>
        </Section>

        <Section title="Category">
          <select
            value={categoryId ?? ''}
            onChange={(e) => run(() => changeCategory(ticketId, e.target.value || null))}
            disabled={pending}
            className={selectCls}
            aria-label="Set ticket category"
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Section>

        <Section
          title="Due by"
          accessory={
            dueRelative ? (
              <span className={`text-[10px] font-semibold ${dueRelative.overdue ? 'text-rose-600' : 'text-slate-500'}`}>
                {dueRelative.label}
              </span>
            ) : null
          }
        >
          <input
            type="datetime-local"
            defaultValue={dueBy ? toLocalDtValue(dueBy) : ''}
            onBlur={(e) => run(() => setDueDate(ticketId, e.target.value || null))}
            disabled={pending}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
        </Section>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <Section title="Tags">
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-6">
            {tags
              .filter((t) => appliedTagIds.includes(t.id))
              .map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => run(() => removeTag(ticketId, t.id))}
                  disabled={pending}
                  className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all disabled:opacity-50"
                  style={{
                    background: t.color ? `${t.color}1a` : '#f1f5f9',
                    borderColor: t.color ?? '#cbd5e1',
                    color: t.color ?? '#475569',
                  }}
                  title="Click to remove"
                >
                  <span>{t.label}</span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden>×</span>
                </button>
              ))}
            {appliedTagIds.length === 0 && (
              <span className="text-xs text-slate-400 italic">No tags applied</span>
            )}
          </div>
          {tags.filter((t) => !appliedTagIds.includes(t.id)).length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) run(() => addTag(ticketId, e.target.value))
              }}
              disabled={pending}
              className={selectCls}
              aria-label="Add a tag"
            >
              <option value="">+ Add tag…</option>
              {tags
                .filter((t) => !appliedTagIds.includes(t.id))
                .map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
            </select>
          )}
        </Section>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs" role="alert">
          {error}
        </div>
      )}
    </aside>
  )
}

function Section({
  title,
  accessory,
  children,
}: {
  title: string
  accessory?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</div>
        {accessory}
      </div>
      {children}
    </div>
  )
}

function formatDue(due: Date): { label: string; overdue: boolean } {
  const diff = due.getTime() - Date.now()
  const overdue = diff < 0
  const abs = Math.abs(diff)
  const days = Math.floor(abs / 86_400_000)
  const hours = Math.floor((abs % 86_400_000) / 3_600_000)
  let span: string
  if (days >= 1) span = `${days}d`
  else if (hours >= 1) span = `${hours}h`
  else span = `${Math.max(1, Math.floor(abs / 60_000))}m`
  return { label: overdue ? `${span} overdue` : `in ${span}`, overdue }
}

function toLocalDtValue(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yy}-${mm}-${dd}T${hh}:${mi}`
}
