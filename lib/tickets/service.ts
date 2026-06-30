import 'server-only'
import { and, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  tickets,
  ticketMessages,
  ticketAttachments,
  ticketEvents,
  ticketCategories,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
  type TicketSource,
  type TicketMessageVisibility,
  type TicketMessageAuthorType,
  type TicketAttachmentUploaderType,
  type TicketEventType,
  type TicketEventActorType,
} from '@/lib/db/schema'
import { generatePublicToken, verifyPublicToken } from './token'
import { nextShortCode } from './short-code'

export type CreateTicketInput = {
  submitterName: string
  submitterEmail: string
  /** E.164 phone, asserted-verified by the OTP gate the caller just passed. */
  submitterPhone: string
  submitterCompany?: string | null
  submitterCity?: string | null
  submitterLocale: string
  subject: string
  body: string
  source: TicketSource
  categoryId?: string | null
  ipAddressHash?: string | null
  userAgent?: string | null
  /** Pre-uploaded R2 objects to attach as part of the initial message. */
  attachments?: Array<{
    filename: string
    mimeType: string
    sizeBytes: number
    r2Key: string
  }>
}

export type CreatedTicket = {
  id: string
  publicToken: string
  shortCode: string
}

/**
 * Insert a ticket + its first message + any attachments, returning the public
 * handles the caller needs to redirect / email. Phone is assumed pre-verified
 * (the action layer is responsible for the OTP gate — we just stamp
 * `phone_verified_at = now()`).
 *
 * Due-date is derived from the category's `sla_hours` when set. We don't
 * fan out emails from here — the action layer schedules those via `after()` so
 * the request returns immediately even when SMTP is slow.
 *
 * D1 doesn't expose transactions to the drizzle adapter, so we order writes
 * parent-first and tolerate orphans on partial failure (no attachments without
 * their message; messages cascade-delete with their ticket if a follow-up
 * recovery script ever needs to clean up).
 */
export async function createTicket(input: CreateTicketInput): Promise<CreatedTicket> {
  const now = new Date()
  const slaHours = input.categoryId
    ? (
        await db
          .select({ slaHours: ticketCategories.slaHours })
          .from(ticketCategories)
          .where(eq(ticketCategories.id, input.categoryId))
          .limit(1)
      )[0]?.slaHours ?? null
    : null
  const dueBy = slaHours ? new Date(now.getTime() + slaHours * 60 * 60 * 1000) : null

  // Atomically insert the ticket + first message + attachments in a single D1
  // batch. Two reasons:
  //   1. Consistency — D1 with replica reads can otherwise have the message
  //      insert hit a replica that hasn't seen the parent ticket row yet, so
  //      the foreign key fails (SQLITE_CONSTRAINT). Batch runs all statements
  //      on the primary in order.
  //   2. All-or-nothing — if any statement fails, none persists; no orphan
  //      ticket without its first message.
  //
  // Drizzle's batch can't read the RETURNING of an earlier statement, so we
  // pre-generate the UUIDs client-side and reuse them for FK references.
  // Retry once on short_code uniqueness collision (see lib/tickets/short-code.ts).
  let attempt = 0
  let publicToken = ''
  let shortCode = ''
  const ticketId = crypto.randomUUID()
  const messageId = crypto.randomUUID()

  while (attempt < 2) {
    publicToken = await generatePublicToken()
    shortCode = await nextShortCode()
    try {
      const ticketInsert = db.insert(tickets).values({
        id: ticketId,
        publicToken,
        shortCode,
        submitterName: input.submitterName,
        submitterEmail: input.submitterEmail,
        submitterPhone: input.submitterPhone,
        submitterCompany: input.submitterCompany ?? null,
        submitterCity: input.submitterCity ?? null,
        submitterLocale: input.submitterLocale,
        phoneVerifiedAt: now,
        subject: input.subject,
        source: input.source,
        categoryId: input.categoryId ?? null,
        status: 'open',
        priority: 'normal',
        dueBy,
        ipAddressHash: input.ipAddressHash ?? null,
        userAgent: input.userAgent ?? null,
      })
      const messageInsert = db.insert(ticketMessages).values({
        id: messageId,
        ticketId,
        authorType: 'submitter',
        visibility: 'public',
        body: input.body,
      })
      if (input.attachments?.length) {
        const attachmentsInsert = db.insert(ticketAttachments).values(
          input.attachments.map((a) => ({
            ticketId,
            messageId,
            uploadedByType: 'submitter' as TicketAttachmentUploaderType,
            filename: a.filename,
            mimeType: a.mimeType,
            sizeBytes: a.sizeBytes,
            r2Key: a.r2Key,
          })),
        )
        await db.batch([ticketInsert, messageInsert, attachmentsInsert])
      } else {
        await db.batch([ticketInsert, messageInsert])
      }
      return { id: ticketId, publicToken, shortCode }
    } catch (err) {
      attempt += 1
      if (attempt >= 2) throw err
    }
  }
  throw new Error('Failed to create ticket after retry')
}

export type PostMessageInput = {
  ticketId: string
  body: string
  authorType: TicketMessageAuthorType
  authorUserId?: string | null
  visibility: TicketMessageVisibility
  attachments?: Array<{
    filename: string
    mimeType: string
    sizeBytes: number
    r2Key: string
  }>
  uploaderType: TicketAttachmentUploaderType
}

/**
 * Append a message (admin reply, internal note, submitter follow-up) to a
 * ticket. Bumps `tickets.updated_at` and stamps `first_response_at` the first
 * time an admin posts a public reply. Auto-reopens a ticket if a submitter
 * follow-up arrives on a resolved/closed thread.
 */
export async function postMessage(input: PostMessageInput): Promise<{ messageId: string }> {
  const now = new Date()
  const [message] = await db
    .insert(ticketMessages)
    .values({
      ticketId: input.ticketId,
      authorType: input.authorType,
      authorUserId: input.authorUserId ?? null,
      visibility: input.visibility,
      body: input.body,
    })
    .returning({ id: ticketMessages.id })

  if (input.attachments?.length) {
    await db.insert(ticketAttachments).values(
      input.attachments.map((a) => ({
        ticketId: input.ticketId,
        messageId: message.id,
        uploadedByType: input.uploaderType,
        uploadedByUserId: input.authorType === 'admin' ? input.authorUserId ?? null : null,
        filename: a.filename,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
        r2Key: a.r2Key,
      })),
    )
  }

  // first_response_at: first public admin reply on an existing ticket.
  if (input.authorType === 'admin' && input.visibility === 'public') {
    await db
      .update(tickets)
      .set({ updatedAt: now, firstResponseAt: now })
      .where(and(eq(tickets.id, input.ticketId), isNull(tickets.firstResponseAt)))
  }

  // Submitter follow-up on a resolved ticket → auto-reopen.
  if (input.authorType === 'submitter') {
    const ticket = (
      await db
        .select({ status: tickets.status })
        .from(tickets)
        .where(eq(tickets.id, input.ticketId))
        .limit(1)
    )[0]
    if (ticket && (ticket.status === 'resolved' || ticket.status === 'closed')) {
      await db
        .update(tickets)
        .set({ status: 'open', resolvedAt: null, closedAt: null, updatedAt: now })
        .where(eq(tickets.id, input.ticketId))
      await db.insert(ticketEvents).values({
        ticketId: input.ticketId,
        eventType: 'reopened',
        fromValue: ticket.status,
        toValue: 'open',
        actorType: 'submitter',
      })
    }
  }

  await db.update(tickets).set({ updatedAt: now }).where(eq(tickets.id, input.ticketId))
  return { messageId: message.id }
}

/** Record a workflow transition into the audit table. Fire-and-forget. */
export async function recordTicketEvent(input: {
  ticketId: string
  eventType: TicketEventType
  fromValue: string | null
  toValue: string | null
  actorType: TicketEventActorType
  actorUserId?: string | null
}): Promise<void> {
  await db.insert(ticketEvents).values({
    ticketId: input.ticketId,
    eventType: input.eventType,
    fromValue: input.fromValue,
    toValue: input.toValue,
    actorType: input.actorType,
    actorUserId: input.actorUserId ?? null,
  })
}

/**
 * Stamps status side-effects (`resolved_at`, `closed_at`) and logs the event.
 * Caller is expected to have already authorised the change.
 */
export async function changeTicketStatus(input: {
  ticketId: string
  toStatus: TicketStatus
  actorType: TicketEventActorType
  actorUserId?: string | null
}): Promise<{ from: TicketStatus } | null> {
  const current = (
    await db
      .select({ status: tickets.status })
      .from(tickets)
      .where(eq(tickets.id, input.ticketId))
      .limit(1)
  )[0]
  if (!current || current.status === input.toStatus) return null

  const now = new Date()
  const patch: Partial<Ticket> = { status: input.toStatus, updatedAt: now }
  if (input.toStatus === 'resolved') patch.resolvedAt = now
  if (input.toStatus === 'closed') patch.closedAt = now
  if (input.toStatus === 'open' || input.toStatus === 'in_progress' || input.toStatus === 'waiting') {
    patch.resolvedAt = null
    patch.closedAt = null
  }
  await db.update(tickets).set(patch).where(eq(tickets.id, input.ticketId))

  await recordTicketEvent({
    ticketId: input.ticketId,
    eventType: 'status_changed',
    fromValue: current.status,
    toValue: input.toStatus,
    actorType: input.actorType,
    actorUserId: input.actorUserId,
  })
  return { from: current.status }
}

export async function changeTicketPriority(input: {
  ticketId: string
  toPriority: TicketPriority
  actorType: TicketEventActorType
  actorUserId?: string | null
}): Promise<void> {
  const current = (
    await db
      .select({ priority: tickets.priority })
      .from(tickets)
      .where(eq(tickets.id, input.ticketId))
      .limit(1)
  )[0]
  if (!current || current.priority === input.toPriority) return
  await db
    .update(tickets)
    .set({ priority: input.toPriority, updatedAt: new Date() })
    .where(eq(tickets.id, input.ticketId))
  await recordTicketEvent({
    ticketId: input.ticketId,
    eventType: 'priority_changed',
    fromValue: current.priority,
    toValue: input.toPriority,
    actorType: input.actorType,
    actorUserId: input.actorUserId,
  })
}

export async function assignTicket(input: {
  ticketId: string
  toUserId: string | null
  actorType: TicketEventActorType
  actorUserId?: string | null
}): Promise<void> {
  const current = (
    await db
      .select({ assignedToUserId: tickets.assignedToUserId })
      .from(tickets)
      .where(eq(tickets.id, input.ticketId))
      .limit(1)
  )[0]
  if (!current) return
  if ((current.assignedToUserId ?? null) === (input.toUserId ?? null)) return
  await db
    .update(tickets)
    .set({ assignedToUserId: input.toUserId, updatedAt: new Date() })
    .where(eq(tickets.id, input.ticketId))
  await recordTicketEvent({
    ticketId: input.ticketId,
    eventType: input.toUserId ? 'assigned' : 'unassigned',
    fromValue: current.assignedToUserId,
    toValue: input.toUserId,
    actorType: input.actorType,
    actorUserId: input.actorUserId,
  })
}

/** Resolve a token from the URL → the matching ticket row, or `null`. Public read path. */
export async function getTicketByPublicToken(token: string): Promise<Ticket | null> {
  const verified = await verifyPublicToken(token)
  if (!verified) return null
  const row = (
    await db
      .select()
      .from(tickets)
      .where(eq(tickets.publicToken, verified))
      .limit(1)
  )[0]
  return row ?? null
}
