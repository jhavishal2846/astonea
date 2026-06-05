import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 46 Disclosures',
  description: 'Statutory disclosures by Astonea Labs Limited under SEBI LODR Regulation 46.',
}

export const dynamic = 'force-dynamic'

const SUBCATEGORY_HEADINGS: { sub: string; heading: string }[] = [
  { sub: 'corporate_details', heading: 'Corporate Details' },
  { sub: 'board_governance',  heading: 'Board & Governance' },
  { sub: 'committees',        heading: 'Committees' },
  { sub: 'investor_info',     heading: 'Investor Information' },
  { sub: 'financial_filings', heading: 'Financial Filings' },
]

export default async function Regulation46Page() {
  const all = await listPublishedByCategory('reg46')
  const grouped = groupBySubcategory(all)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="SEBI Disclosures"
        title="SEBI LODR Regulation 46 Disclosures"
        description="Statutory disclosures maintained on the company website as required under Regulation 46 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 46', href: '/sebi-lodr-regulation-46-disclosures' },
        ]}
      />

      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              <strong>Regulation 46 — SEBI LODR, 2015:</strong> Listed companies are required to maintain and disseminate
              certain information on their websites for public access. The following disclosures are maintained in
              accordance with these requirements. CIN: L24304CH2017PLC041482.
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
              let idx = 0
              return (
                <div key={sub}>
                  <Reveal>
                    <h2 className="font-display text-xl font-bold mb-6 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                      {heading}
                    </h2>
                  </Reveal>
                  <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                    {items.map((item, ii) => {
                      idx++
                      const link = item.fileUrl ?? item.externalLink
                      return (
                        <Reveal key={item.id} delay={(ci + ii) * 40}>
                          <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                              {String(idx).padStart(2, '0')}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                              {item.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.description}</p>}
                            </div>
                            {link ? (
                              item.fileUrl ? (
                                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                  PDF
                                </a>
                              ) : (
                                <Link href={item.externalLink!} className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                  View
                                </Link>
                              )
                            ) : (
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                                Soon
                              </span>
                            )}
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <Reveal delay={300}>
            <div className="mt-12 max-w-3xl">
              <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                For event-based disclosures and material information filed with BSE, refer to{' '}
                <Link href="/sebi-lodr-regulation-30-disclosures" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  SEBI LODR Regulation 30 Disclosures
                </Link>.
                For queries, contact <a href="mailto:cs@astonea.org" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>cs@astonea.org</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
