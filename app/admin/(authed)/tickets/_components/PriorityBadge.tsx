import { TICKET_PRIORITY_LABELS } from '@/lib/tickets/types'
import type { TicketPriority } from '@/lib/db/schema'

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: 'text-slate-500',
  normal: 'text-slate-700',
  high: 'text-amber-600',
  urgent: 'text-rose-600',
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${PRIORITY_STYLES[priority]}`}>
      {priority === 'urgent' || priority === 'high' ? '▲' : '·'} {TICKET_PRIORITY_LABELS[priority]}
    </span>
  )
}
