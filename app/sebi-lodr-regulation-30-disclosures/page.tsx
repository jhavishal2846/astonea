import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listReg30Events, groupBySubcategory } from '@/lib/cms/queries'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 30 Disclosures',
  description: 'Event-based disclosures by Astonea Labs Limited under SEBI LODR Regulation 30.',
}

export const dynamic = 'force-dynamic'

const SUBCATEGORY_HEADINGS: { sub: string; heading: string }[] = [
  { sub: 'board_meeting',   heading: 'Board Meeting Outcomes' },
  { sub: 'agm_egm',         heading: 'AGM & EGM' },
  { sub: 'director_kmp',    heading: 'Director & KMP Changes' },
  { sub: 'structural',      heading: 'Structural Changes' },
  { sub: 'ipo_acquisition', heading: 'IPO & Acquisitions' },
  { sub: 'property_ops',    heading: 'Property & Operations' },
]

export default async function Regulation30Page() {
  const all = await listReg30Events()
  const grouped = groupBySubcategory(all)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="SEBI Disclosures"
        title="SEBI LODR Regulation 30 Disclosures"
        description="Event-based material disclosures filed with BSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
        ]}
      />

      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              <strong>Regulation 30 — SEBI LODR, 2015:</strong> All listed companies must promptly disclose material
              events and information to the stock exchanges. The following disclosures have been filed with BSE
              by Astonea Labs Limited (CIN: L24304CH2017PLC041482).
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {SUBCATEGORY_HEADINGS.map(({ sub, heading }, ci) => {
              const items = grouped[sub] ?? []
              if (items.length === 0) return null
              return (
                <div key={sub}>
                  <Reveal>
                    <h2 className="font-display text-xl font-bold mb-6 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                      {heading}
                    </h2>
                  </Reveal>
                  <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                    {items.map((item, ii) => (
                      <Reveal key={item.id} delay={(ci + ii) * 40}>
                        <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                              {item.period && (
                                <span className="text-xs font-mono flex-shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                                  {item.period}
                                </span>
                              )}
                            </div>
                            {item.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.description}</p>}
                          </div>
                          {item.fileUrl && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50"
                              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

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
      </section>
    </div>
  )
}
