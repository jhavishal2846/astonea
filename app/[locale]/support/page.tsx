import Link from '@/app/_nav/AppLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'
import { getPageText } from '@/lib/cms/page-text'

export const generateMetadata = () =>
  pageMeta('/support', {
    title: 'Customer Support',
    description: 'Raise a support ticket or file a complaint with Astonea Labs. Track every reply on a single status page.',
  })

/**
 * Public support landing. Two doors:
 *   • New ticket → /support/[locale]/new (phone-OTP-gated)
 *   • Already have a ticket → paste your status link (which they got by email)
 *
 * Intentionally short on chrome: someone who lands here is usually in a
 * not-great mood and wants a fast path to a form. Big buttons, no marketing
 * copy, no carousel.
 */
export default async function SupportLanding({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getPageText('/support')
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Customer Support') as string}
        title={t('header.title', 'How can we help?') as string}
        description={t('header.description', "Raise a support ticket or file a complaint. We'll respond by email and the same status link lets you follow up.") as string}
        breadcrumb={[{ label: t('support.status.breadcrumb', 'Support') as string, href: `/${locale}/support` }]}
      />

      <section className="py-14 lg:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-border)' }}>
            <Reveal>
              <Link
                href={`/${locale}/support/new`}
                className="block p-8 h-full transition-colors hover:bg-slate-50"
                style={{ background: 'var(--color-surface)' }}
              >
                <p className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>{t('support.door_1.kicker', '01')}</p>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{t('support.door_1.title', 'Raise a new ticket')}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                  {t('support.door_1.body', "Describe your issue, verify your phone with a 6-digit code, and you'll receive a tracking link by email.")}
                </p>
                <span className="inline-flex items-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {t('support.door_1.cta', 'Start a ticket →')}
                </span>
              </Link>
            </Reveal>

            <Reveal delay={80}>
              <div className="block p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                <p className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>{t('support.door_2.kicker', '02')}</p>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{t('support.door_2.title', 'I already have a ticket')}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                  {t('support.door_2.body', 'The confirmation email we sent you contains a status link in the form /support/<token>. Open it to view replies and post follow-ups.')}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>
                  {t('support.door_2.lost_email', "Lost the email? Raise a new ticket and mention your previous one — we'll merge them.")}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="mt-10 p-6 rounded-2xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{t('support.covers.title', 'What support covers')}</h4>
              <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1" style={{ color: 'var(--color-ink-muted)' }}>
                <li>{t('support.covers.item_0', 'Issues with a product or order you received from Astonea Labs')}</li>
                <li>{t('support.covers.item_1', 'Complaints about quality, packaging, delivery, or service')}</li>
                <li>{t('support.covers.item_2', 'Questions about an existing engagement (open POs, in-flight shipments, prior correspondence)')}</li>
              </ul>
              <p className="text-xs mt-3" style={{ color: 'var(--color-ink-subtle)' }}>
                {t('support.covers.redirect_prefix', 'For new business enquiries or job applications, please use the')}{' '}
                <Link href={`/${locale}/contact-us`} className="underline" style={{ color: 'var(--color-primary)' }}>{t('support.covers.contact_link', 'contact')}</Link>{' '}
                {t('support.covers.or_word', 'or')}{' '}
                <Link href={`/${locale}/career`} className="underline" style={{ color: 'var(--color-primary)' }}>{t('support.covers.career_link', 'career')}</Link>{' '}
                {t('support.covers.redirect_suffix', 'page instead.')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
