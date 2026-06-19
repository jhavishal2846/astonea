import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listReg30Events } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/sebi-lodr-regulation-30-disclosures', {
    title: 'SEBI LODR Regulation 30 Disclosures',
    description:
      'Event-based disclosures by Astonea Labs Limited under SEBI LODR Regulation 30.',
  })

function formatDate(d: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export default async function Regulation30Page() {
  const events = await listReg30Events()
  const t = await getPageText('/sebi-lodr-regulation-30-disclosures')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'SEBI Disclosures') as string}
        title={t('header.title', 'SEBI LODR Regulation 30 Disclosures') as string}
        description={t('header.description', 'Event-based material disclosures filed with BSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
        ]}
      />

      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              {t('reg30.intro', 'Regulation 30 — SEBI LODR, 2015: All listed companies must promptly disclose material events and information to the stock exchanges. The following disclosures have been filed with BSE by Astonea Labs Limited (CIN: L24304CH2017PLC041482).')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            {events.length === 0 ? (
              <Reveal>
                <div className="p-6 rounded-xl border text-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                  {t('doc.empty', 'No Regulation 30 disclosures have been published yet.')}
                </div>
              </Reveal>
            ) : (
              <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
                {events.map((event, i) => {
                  const dateLabel = formatDate(event.eventDate)
                  return (
                    <Reveal key={event.id} delay={i * 25}>
                      <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{event.title}</p>
                            {dateLabel && (
                              <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                                {dateLabel}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--color-ink-muted)' }}>{event.description}</p>
                          )}
                        </div>
                        {event.fileUrl ? (
                          <a
                            href={event.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                          >
                            PDF
                          </a>
                        ) : (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                            Soon
                          </span>
                        )}
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            )}

            <Reveal delay={300}>
              <div className="mt-12 max-w-3xl">
                <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                  All Regulation 30 disclosures are filed with BSE and are available on the exchange portal.
                  Search using CIN: L24304CH2017PLC041482.
                  Website disclosures under Regulation 46 are available{' '}
                  <Link href="/sebi-lodr-regulation-46-disclosures" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                    here
                  </Link>.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
