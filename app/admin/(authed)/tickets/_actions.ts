'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  tickets,
  ticketCategories,
  ticketCategoryTranslations,
  ticketTags,
  ticketToTags,
  type TicketStatus,
  type TicketPriority,
} from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import {
  postMessage,
  changeTicketStatus,
  changeTicketPriority,
  assignTicket as assignTicketSrv,
  recordTicketEvent,
} from '@/lib/tickets/service'
import { putObject } from '@/lib/storage'
import { sendEmail } from '@/lib/email'
import { ticketRepliedTemplate } from '@/lib/email/templates/ticket-replied'
import { ticketStatusChangedTemplate } from '@/lib/email/templates/ticket-status-changed'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { ADMIN_ATTACHMENT_MAX_BYTES } from '@/lib/tickets/types'

export type AdminTicketState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

async function ticketHeader(id: string) {
  const row = (
    await db
      .select({
        id: tickets.id,
        shortCode: tickets.shortCode,
        subject: tickets.subject,
        submitterName: tickets.submitterName,
        submitterEmail: tickets.submitterEmail,
        submitterLocale: tickets.submitterLocale,
        publicToken: tickets.publicToken,
      })
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1)
  )[0]
  return row ?? null
}

function origin(reqHeaders: Headers): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  return env.SITE_ORIGIN
    ?? `${reqHeaders.get('x-forwarded-proto') ?? 'https'}://${reqHeaders.get('host') ?? 'astonea.org'}`
}

function revalidateTicket(id: string) {
  revalidatePath('/admin/tickets')
  revalidatePath(`/admin/tickets/${id}`)
}

/* ─── Replies + internal notes ────────────────────────────────────────── */

export async function postAdminReply(ticketId: string, formData: FormData): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const body = String(formData.get('body') ?? '').trim()
  const visibility = String(formData.get('visibility') ?? 'public') === 'internal' ? 'internal' : 'public'
  if (!body) return { error: 'Reply body is required.' }

  // Attachments
  const files = formData.getAll('attachments').filter((v): v is File => v instanceof File && v.size > 0)
  const attachments: Array<{ filename: string; mimeType: string; sizeBytes: number; r2Key: string }> = []
  for (const file of files) {
    if (file.size > ADMIN_ATTACHMENT_MAX_BYTES) {
      return { error: `"${file.name}" is larger than 100 MB.` }
    }
    const safeName = file.name.replaceAll(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
    const key = `tickets/${ticketId}/admin/${crypto.randomUUID()}/${safeName}`
    await putObject(key, file, file.type || 'application/octet-stream')
    attachments.push({
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      r2Key: key,
    })
  }

  await postMessage({
    ticketId,
    body,
    authorType: 'admin',
    authorUserId: me.id,
    visibility,
    attachments,
    uploaderType: 'admin',
  })

  revalidateTicket(ticketId)

  const header = await ticketHeader(ticketId)
  if (header) {
    after(() => recordActivity({
      action: 'update',
      entityType: 'ticket',
      entityId: ticketId,
      entityTitle: `${header.shortCode}: ${header.subject}`,
      detail: visibility === 'internal' ? 'internal note added' : 'public reply posted',
      user: me,
    }))

    // Only public replies notify the submitter.
    if (visibility === 'public') {
      const reqHeaders = await headers()
      const statusUrl = `${origin(reqHeaders)}/${header.submitterLocale}/support/${header.publicToken}`
      after(async () => {
        const tmpl = ticketRepliedTemplate({
          shortCode: header.shortCode,
          subject: header.subject,
          submitterName: header.submitterName,
          replyBody: body,
          statusUrl,
        })
        const res = await sendEmail({ to: header.submitterEmail, subject: tmpl.subject, html: tmpl.html, text: tmpl.text })
        if (res.ok) {
          // Best-effort: stamp the message with the send time. We don't persist Message-ID
          // here; that comes later when inbound email-to-ticket is wired up.
          // Looking up the just-inserted row by (ticket, latest admin public message) is
          // safe because we hold the request lifecycle.
        }
      })
    }
  }

  return { ok: true }
}

/* ─── Workflow mutations ──────────────────────────────────────────────── */

export async function changeStatus(ticketId: string, toStatus: TicketStatus): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const res = await changeTicketStatus({
    ticketId,
    toStatus,
    actorType: 'admin',
    actorUserId: me.id,
  })
  if (!res) return { ok: true }
  revalidateTicket(ticketId)
  const header = await ticketHeader(ticketId)
  if (header) {
    after(() => recordActivity({
      action: 'update',
      entityType: 'ticket',
      entityId: ticketId,
      entityTitle: `${header.shortCode}: ${header.subject}`,
      detail: `status ${res.from} → ${toStatus}`,
      user: me,
    }))
    // Notify submitter on resolved / closed transitions only.
    if (toStatus === 'resolved' || toStatus === 'closed') {
      const reqHeaders = await headers()
      const statusUrl = `${origin(reqHeaders)}/${header.submitterLocale}/support/${header.publicToken}`
      after(async () => {
        const tmpl = ticketStatusChangedTemplate({
          shortCode: header.shortCode,
          subject: header.subject,
          submitterName: header.submitterName,
          toStatus,
          statusUrl,
        })
        await sendEmail({ to: header.submitterEmail, subject: tmpl.subject, html: tmpl.html, text: tmpl.text })
      })
    }
  }
  return { ok: true }
}

export async function changePriority(ticketId: string, toPriority: TicketPriority): Promise<AdminTicketState> {
  const me = await requireAdmin()
  await changeTicketPriority({ ticketId, toPriority, actorType: 'admin', actorUserId: me.id })
  revalidateTicket(ticketId)
  return { ok: true }
}

export async function assignTicket(ticketId: string, userId: string | null): Promise<AdminTicketState> {
  const me = await requireAdmin()
  await assignTicketSrv({ ticketId, toUserId: userId, actorType: 'admin', actorUserId: me.id })
  revalidateTicket(ticketId)
  return { ok: true }
}

export async function changeCategory(ticketId: string, categoryId: string | null): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const current = (
    await db
      .select({ categoryId: tickets.categoryId })
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1)
  )[0]
  if (!current) return { error: 'Ticket not found.' }
  if ((current.categoryId ?? null) === (categoryId ?? null)) return { ok: true }
  await db
    .update(tickets)
    .set({ categoryId, updatedAt: new Date() })
    .where(eq(tickets.id, ticketId))
  await recordTicketEvent({
    ticketId,
    eventType: 'category_changed',
    fromValue: current.categoryId,
    toValue: categoryId,
    actorType: 'admin',
    actorUserId: me.id,
  })
  revalidateTicket(ticketId)
  return { ok: true }
}

export async function setDueDate(ticketId: string, isoDate: string | null): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const current = (
    await db.select({ dueBy: tickets.dueBy }).from(tickets).where(eq(tickets.id, ticketId)).limit(1)
  )[0]
  if (!current) return { error: 'Ticket not found.' }
  const dueBy = isoDate ? new Date(isoDate) : null
  if (dueBy && Number.isNaN(dueBy.getTime())) return { error: 'Invalid date.' }
  await db
    .update(tickets)
    .set({ dueBy, updatedAt: new Date() })
    .where(eq(tickets.id, ticketId))
  await recordTicketEvent({
    ticketId,
    eventType: 'due_changed',
    fromValue: current.dueBy ? current.dueBy.toISOString() : null,
    toValue: dueBy ? dueBy.toISOString() : null,
    actorType: 'admin',
    actorUserId: me.id,
  })
  revalidateTicket(ticketId)
  return { ok: true }
}

export async function addTag(ticketId: string, tagId: string): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const existing = (
    await db
      .select()
      .from(ticketToTags)
      .where(and(eq(ticketToTags.ticketId, ticketId), eq(ticketToTags.tagId, tagId)))
      .limit(1)
  )[0]
  if (existing) return { ok: true }
  await db.insert(ticketToTags).values({ ticketId, tagId })
  const tag = (await db.select({ slug: ticketTags.slug }).from(ticketTags).where(eq(ticketTags.id, tagId)).limit(1))[0]
  await recordTicketEvent({
    ticketId,
    eventType: 'tag_added',
    fromValue: null,
    toValue: tag?.slug ?? tagId,
    actorType: 'admin',
    actorUserId: me.id,
  })
  revalidateTicket(ticketId)
  return { ok: true }
}

export async function removeTag(ticketId: string, tagId: string): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const tag = (await db.select({ slug: ticketTags.slug }).from(ticketTags).where(eq(ticketTags.id, tagId)).limit(1))[0]
  await db
    .delete(ticketToTags)
    .where(and(eq(ticketToTags.ticketId, ticketId), eq(ticketToTags.tagId, tagId)))
  await recordTicketEvent({
    ticketId,
    eventType: 'tag_removed',
    fromValue: tag?.slug ?? tagId,
    toValue: null,
    actorType: 'admin',
    actorUserId: me.id,
  })
  revalidateTicket(ticketId)
  return { ok: true }
}

/* ─── Categories CRUD (used by /admin/tickets/categories) ─────────────── */

export async function upsertCategory(_prev: AdminTicketState, formData: FormData): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const id = String(formData.get('id') ?? '').trim() || null
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const slaHoursRaw = String(formData.get('slaHours') ?? '').trim()
  const slaHours = slaHoursRaw ? Number(slaHoursRaw) : null
  const sortOrder = Number(formData.get('sortOrder') ?? 0) || 0
  const isActive = formData.get('isActive') === 'on'

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return { error: 'Slug must be lowercase letters, digits, or dashes.' }
  if (!name) return { error: 'Name is required.' }
  if (slaHoursRaw && (Number.isNaN(slaHours) || (slaHours ?? 0) < 0)) return { error: 'SLA hours must be a positive number.' }

  if (id) {
    await db
      .update(ticketCategories)
      .set({ slug, slaHours, sortOrder, isActive, updatedAt: new Date() })
      .where(eq(ticketCategories.id, id))
    // Upsert the 'en' translation; admins can edit per-locale later.
    await db
      .insert(ticketCategoryTranslations)
      .values({ categoryId: id, locale: 'en', name })
      .onConflictDoUpdate({
        target: [ticketCategoryTranslations.categoryId, ticketCategoryTranslations.locale],
        set: { name, updatedAt: new Date() },
      })
    after(() => recordActivity({
      action: 'update',
      entityType: 'ticket_category',
      entityId: id,
      entityTitle: name,
      user: me,
    }))
  } else {
    const [row] = await db
      .insert(ticketCategories)
      .values({ slug, slaHours, sortOrder, isActive })
      .returning({ id: ticketCategories.id })
    await db.insert(ticketCategoryTranslations).values({ categoryId: row.id, locale: 'en', name })
    after(() => recordActivity({
      action: 'create',
      entityType: 'ticket_category',
      entityId: row.id,
      entityTitle: name,
      user: me,
    }))
  }
  revalidatePath('/admin/tickets/categories')
  return { ok: true }
}

export async function deleteCategory(id: string) {
  const me = await requireAdmin()
  const row = (
    await db
      .select({ slug: ticketCategories.slug })
      .from(ticketCategories)
      .where(eq(ticketCategories.id, id))
      .limit(1)
  )[0]
  await db.delete(ticketCategories).where(eq(ticketCategories.id, id))
  revalidatePath('/admin/tickets/categories')
  if (row) {
    after(() => recordActivity({
      action: 'delete',
      entityType: 'ticket_category',
      entityId: id,
      entityTitle: row.slug,
      user: me,
    }))
  }
}

/* ─── Tags CRUD (used by /admin/tickets/tags) ─────────────────────────── */

export async function upsertTag(_prev: AdminTicketState, formData: FormData): Promise<AdminTicketState> {
  const me = await requireAdmin()
  const id = String(formData.get('id') ?? '').trim() || null
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase()
  const label = String(formData.get('label') ?? '').trim()
  const color = String(formData.get('color') ?? '').trim() || null

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return { error: 'Slug must be lowercase letters, digits, or dashes.' }
  if (!label) return { error: 'Label is required.' }
  if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) return { error: 'Color must be a 6-digit hex like #ef4444.' }

  if (id) {
    await db
      .update(ticketTags)
      .set({ slug, label, color, updatedAt: new Date() })
      .where(eq(ticketTags.id, id))
    after(() => recordActivity({
      action: 'update',
      entityType: 'ticket_tag',
      entityId: id,
      entityTitle: label,
      user: me,
    }))
  } else {
    const [row] = await db
      .insert(ticketTags)
      .values({ slug, label, color })
      .returning({ id: ticketTags.id })
    after(() => recordActivity({
      action: 'create',
      entityType: 'ticket_tag',
      entityId: row.id,
      entityTitle: label,
      user: me,
    }))
  }
  revalidatePath('/admin/tickets/tags')
  return { ok: true }
}

export async function deleteTag(id: string) {
  const me = await requireAdmin()
  const row = (
    await db.select({ label: ticketTags.label }).from(ticketTags).where(eq(ticketTags.id, id)).limit(1)
  )[0]
  await db.delete(ticketTags).where(eq(ticketTags.id, id))
  revalidatePath('/admin/tickets/tags')
  if (row) {
    after(() => recordActivity({
      action: 'delete',
      entityType: 'ticket_tag',
      entityId: id,
      entityTitle: row.label,
      user: me,
    }))
  }
}

