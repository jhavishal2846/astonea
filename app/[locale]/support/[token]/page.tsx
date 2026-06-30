import { notFound } from 'next/navigation'
import { asc, eq, and } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import {
  ticketMessages,
  ticketAttachments,
  ticketCategories,
  ticketCategoryTranslations,
  type TicketAttachment,
  type TicketMessage,
} from '@/lib/db/schema'
import { getTicketByPublicToken } from '@/lib/tickets/service'
import { PageHeader } from '@/components/PageHeader'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import ReplyForm from './_components/ReplyForm'

/**
 * Submitter-facing status page. The token in the URL is enough to *read* —
 * verification just ensures the token wasn't tampered with. Posting a reply
 * requires a fresh OTP (handled by ReplyForm). Internal notes are filtered
 * out at query time so they can never reach the client even if the renderer
 * is changed.
 */

export const dynamic = 'force-dynamic'

type Params = { locale: string; token: string }

function r2PublicUrl(key: string): string {
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>
  return `${env.R2_PUBLIC_BASE ?? ''}/${key}`
}

export default async function SupportPage({ params }: { params: Promise<Params> }) {
  const { locale, token } = await params
  const ticket = await getTicketByPublicToken(token)
  if (!ticket) notFound()

  const t = await getTranslations()

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(and(eq(ticketMessages.ticketId, ticket.id), eq(ticketMessages.visibility, 'public')))
    .orderBy(asc(ticketMessages.createdAt))

  const attachments = await db
    .select()
    .from(ticketAttachments)
    .where(eq(ticketAttachments.ticketId, ticket.id))

  let categoryName: string | null = null
  if (ticket.categoryId) {
    const tr = (
      await db
        .select({ name: ticketCategoryTranslations.name })
        .from(ticketCategoryTranslations)
        .where(
          and(
            eq(ticketCategoryTranslations.categoryId, ticket.categoryId),
            eq(ticketCategoryTranslations.locale, locale),
          ),
        )
        .limit(1)
    )[0]
    if (tr) {
      categoryName = tr.name
    } else {
      const cat = (
        await db
          .select({ slug: ticketCategories.slug })
          .from(ticketCategories)
          .where(eq(ticketCategories.id, ticket.categoryId))
          .limit(1)
      )[0]
      if (cat) categoryName = cat.slug
    }
  }

  const attachmentsByMessage = new Map<string | null, TicketAttachment[]>()
  for (const a of attachments) {
    const k = a.messageId ?? null
    const list = attachmentsByMessage.get(k) ?? []
    list.push(a)
    attachmentsByMessage.set(k, list)
  }
  const headerAttachments = attachmentsByMessage.get(null) ?? []

  const statusLabel = t(`ticket.status.${ticket.status}`)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={`${t('support.status.enquiry_prefix')} ${ticket.shortCode}`}
        title={ticket.subject}
        description={`${t('support.status.status_prefix')} ${statusLabel}${categoryName ? ` · ${categoryName}` : ''}`}
        breadcrumb={[{ label: t('support.status.breadcrumb'), href: `/${locale}/support/${token}` }]}
      />

      <section className="py-10 lg:py-14" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide max-w-3xl">
          <div className="rounded-2xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
            <div className="p-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="font-semibold text-base mb-1" style={{ color: 'var(--color-ink)' }}>{t('support.conversation.title')}</h2>
              <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>
                {t('support.conversation.opened_prefix')} {new Date(ticket.createdAt).toLocaleString()} {t('support.conversation.opened_by')} {ticket.submitterName}
              </p>
              {headerAttachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {headerAttachments.map((a) => (
                    <a
                      key={a.id}
                      href={r2PublicUrl(a.r2Key)}
                      className="px-3 py-1.5 rounded-full text-xs border bg-slate-50 hover:bg-slate-100"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                    >
                      📎 {a.filename}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <ol className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {messages.map((m: TicketMessage) => {
                const atts = attachmentsByMessage.get(m.id) ?? []
                const isYou = m.authorType === 'submitter'
                const authorLabel = isYou
                  ? t('support.author.you')
                  : m.authorType === 'admin'
                  ? t('support.author.admin')
                  : t('support.author.system')
                return (
                  <li key={m.id} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: isYou ? 'var(--color-ink-subtle)' : 'var(--color-primary)' }}
                      >
                        {authorLabel}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-ink)' }}>{m.body}</p>
                    {atts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {atts.map((a) => (
                          <a
                            key={a.id}
                            href={r2PublicUrl(a.r2Key)}
                            className="px-3 py-1.5 rounded-full text-xs border bg-slate-50 hover:bg-slate-100"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                          >
                            📎 {a.filename}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="mt-6">
            <ReplyForm
              token={token}
              locale={locale}
              submitterEmail={ticket.submitterEmail}
              submitterPhone={ticket.submitterPhone}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
