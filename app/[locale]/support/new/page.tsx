import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ticketCategories, ticketCategoryTranslations } from '@/lib/db/schema'
import { getPageText } from '@/lib/cms/page-text'
import NewTicketClient from './NewTicketClient'

export const dynamic = 'force-dynamic'

export const generateMetadata = () =>
  pageMeta('/support/new', {
    title: 'Raise a support ticket',
    description: 'Send Astonea Labs your support enquiry or complaint. Verify by SMS and receive a tracked email link.',
  })

export default async function NewTicketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getPageText('/support/new')

  // Pull the active category list, preferring the requested locale's translation
  // but falling back to the canonical slug when no translation exists.
  const rows = await db
    .select({
      slug: ticketCategories.slug,
      name: ticketCategoryTranslations.name,
      translationLocale: ticketCategoryTranslations.locale,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .where(eq(ticketCategories.isActive, true))
    .orderBy(asc(ticketCategories.sortOrder), asc(ticketCategories.slug))

  const bySlug = new Map<string, string>()
  for (const r of rows) {
    if (r.translationLocale === locale && r.name) {
      bySlug.set(r.slug, r.name)
    } else if (!bySlug.has(r.slug)) {
      bySlug.set(r.slug, r.name ?? r.slug)
    }
  }
  const categoryOptions = Array.from(bySlug.entries()).map(([slug, label]) => ({ slug, label }))

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Customer Support') as string}
        title={t('header.title', 'Raise a support ticket') as string}
        description={t('header.description', "Tell us what's wrong and we'll pick it up. You'll get an email confirmation and a link to track replies.") as string}
        breadcrumb={[
          { label: t('support_new.breadcrumb.parent', 'Support') as string, href: `/${locale}/support` },
          { label: t('support_new.breadcrumb.self', 'New ticket') as string, href: `/${locale}/support/new` },
        ]}
      />

      <section className="py-12 lg:py-14" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide max-w-2xl">
          <Reveal>
            <div className="rounded-2xl border p-6 lg:p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
              <NewTicketClient categoryOptions={categoryOptions} />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-4 text-xs text-center" style={{ color: 'var(--color-ink-subtle)' }}>
              {t('support_new.sms_disclaimer', "We'll send a 6-digit code to your mobile to confirm you. Standard SMS rates may apply.")}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
