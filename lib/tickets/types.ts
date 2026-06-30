// NOTE: do *not* add `import 'server-only'` here. This module is intentionally
// isomorphic — it only exports static type aliases, label maps, and size
// constants. Client components (admin sidebar, reply composer, ticket badges)
// import these for display, which is why a server-only marker would explode
// the entire admin route with a Pages-Router compatibility error.
import type {
  TicketStatus,
  TicketPriority,
  TicketSource,
  TicketEventType,
  TicketEventActorType,
  OtpChannel,
  OtpPurpose,
} from '@/lib/db/schema'

export type {
  TicketStatus,
  TicketPriority,
  TicketSource,
  TicketEventType,
  TicketEventActorType,
  OtpChannel,
  OtpPurpose,
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  waiting: 'Waiting on customer',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export const TICKET_SOURCE_LABELS: Record<TicketSource, string> = {
  support_form: 'Support form',
  admin_created: 'Created by admin',
}

/** Statuses considered "active" (the count surfaced in the admin sidebar badge). */
export const ACTIVE_TICKET_STATUSES: TicketStatus[] = ['open', 'in_progress', 'waiting']

/** Attachments rejected unless mime type starts with one of these. Public side is stricter. */
export const PUBLIC_ATTACHMENT_MIME_ALLOWLIST = [
  'image/',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.',
  'application/vnd.ms-excel',
  'text/',
] as const

export const PUBLIC_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024
export const ADMIN_ATTACHMENT_MAX_BYTES = 100 * 1024 * 1024
