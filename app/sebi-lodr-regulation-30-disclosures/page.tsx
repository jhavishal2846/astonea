import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 30 Disclosures',
  description: 'Event-based disclosures by Astonea Labs Limited under SEBI LODR Regulation 30.',
}

const eventCategories = [
  {
    heading: 'Corporate Actions',
    items: [
      { title: 'Board Meeting Outcomes', date: 'Ongoing', desc: 'Outcomes of Board of Directors meetings — financial results, dividends, appointments, and other material decisions.' },
      { title: 'AGM / EGM Outcomes', date: 'Ongoing', desc: 'Outcomes and resolutions passed at Annual and Extraordinary General Meetings of shareholders.' },
      { title: 'Dividend Declarations', date: 'As declared', desc: 'Details of any interim or final dividends declared by the Board.' },
    ],
  },
  {
    heading: 'Structural Changes',
    items: [
      { title: 'Incorporation of WOS — USA (Astonea LLC)', date: 'FY 2024-25', desc: 'Disclosure regarding incorporation of Astonea LLC as a Wholly Owned Subsidiary in the United States of America.' },
      { title: 'Director Appointments & Resignations', date: 'Ongoing', desc: 'All changes in the composition of the Board of Directors as and when they occur.' },
      { title: 'Key Managerial Personnel Changes', date: 'Ongoing', desc: 'Appointments, resignations, and changes in Key Managerial Personnel (CFO, CS, CEO).' },
    ],
  },
  {
    heading: 'Regulatory & Compliance',
    items: [
      { title: 'Insider Trading Window Closures', date: 'Quarterly', desc: 'Notices of trading window closure issued to designated persons ahead of financial results announcements.' },
      { title: 'Newspaper Advertisements', date: 'As published', desc: 'Copies of newspaper publications of financial results, notices, and other statutory advertisements.' },
      { title: 'USFDA Audit Completion', date: 'FY 2023-24', desc: 'Disclosure regarding completion of USFDA audit for OTC product manufacturing at the Haripur facility.' },
    ],
  },
  {
    heading: 'Financial Disclosures',
    items: [
      { title: 'Half-Yearly Financial Results — Sep 2025', date: 'Oct 2025', desc: 'Unaudited half-yearly financial results for the period ending September 30, 2025.' },
      { title: 'Restated Financial Statements — Dec 2024', date: 'Jan 2025', desc: 'Restated financial statements as at December 31, 2024.' },
      { title: 'Restated Financial Statements — Mar 2024', date: 'Apr 2024', desc: 'Restated financial statements as at March 31, 2024.' },
    ],
  },
]

export default function Regulation30Page() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="SEBI Disclosures"
        title="SEBI LODR Regulation 30 Disclosures"
        description="Event-based material disclosures filed with BSE and NSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
        ]}
      />

      {/* Context */}
      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              <strong>Regulation 30 — SEBI LODR, 2015:</strong> All listed companies must promptly disclose material
              events and information to the stock exchanges. The following disclosures have been filed with BSE and NSE
              by Astonea Labs Limited (CIN: L24304CH2017PLC041482).
            </p>
          </div>
        </div>
      </section>

      {/* Disclosures by category */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {eventCategories.map((cat, ci) => (
              <div key={cat.heading}>
                <Reveal>
                  <h2 className="font-display text-xl font-bold mb-6 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                    {cat.heading}
                  </h2>
                </Reveal>
                <div className="space-y-3">
                  {cat.items.map((item, ii) => (
                    <Reveal key={item.title} delay={(ci + ii) * 40}>
                      <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                            <span className="text-xs font-mono flex-shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.desc}</p>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                          View
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-12 max-w-3xl">
              <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                All Regulation 30 disclosures are filed simultaneously with BSE and NSE and are available on their
                respective portals. For complete filings, search for CIN: L24304CH2017PLC041482.
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
