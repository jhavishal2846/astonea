import { TICKET_STATUS_LABELS } from '@/lib/tickets/types'
import type { TicketStatus } from '@/lib/db/schema'

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: 'bg-rose-50 text-rose-700 border border-rose-200',
  in_progress: 'bg-amber-50 text-amber-800 border border-amber-200',
  waiting: 'bg-sky-50 text-sky-700 border border-sky-200',
  resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {TICKET_STATUS_LABELS[status]}
    </span>
  )
}
