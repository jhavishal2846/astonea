import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 46 Disclosures',
  description: 'Statutory disclosures by Astonea Labs Limited under SEBI LODR Regulation 46.',
}

const disclosureCategories = [
  {
    heading: 'Corporate Details',
    items: [
      { title: 'Memorandum and Articles of Association', desc: 'Constitutional documents of the company as filed with the Registrar of Companies.' },
      { title: 'Details of Business', desc: 'Overview of the company\'s business operations, product categories, and service segments.' },
      { title: 'Financial Information', desc: 'Audited financial statements and notes as per the latest annual report.' },
    ],
  },
  {
    heading: 'Board & Governance',
    items: [
      { title: 'Shareholding Pattern', desc: 'Quarterly shareholding pattern filed with stock exchanges including promoter and public holdings.' },
      { title: 'Profiles of Board of Directors & KMPs', desc: 'Biographical and qualification details of all directors and key managerial personnel.' },
      { title: 'Code of Conduct', desc: 'The Board-adopted code of conduct for directors and senior management personnel.' },
    ],
  },
  {
    heading: 'Committees',
    items: [
      { title: 'Composition of Committees', desc: 'Constituted committees of the Board: Audit, NRC, Stakeholders\' Relationship, CSR, and Risk Management.' },
      { title: 'Terms of Reference', desc: 'Scope, roles, and responsibilities of each Board committee as per the Companies Act and SEBI regulations.' },
    ],
  },
  {
    heading: 'Investor Information',
    items: [
      { title: 'Dividend Distribution Policy', desc: 'Policy governing the framework and parameters for dividend declaration.' },
      { title: 'Policy on Related Party Transactions', desc: 'Policy and procedures for identification and approval of transactions with related parties.' },
      { title: 'Whistle Blower / Vigil Mechanism Policy', desc: 'Policy enabling employees and directors to report genuine concerns without fear of reprisal.' },
      { title: 'Contact Information for Investor Grievances', desc: 'Details of the Compliance Officer and Registrar & Share Transfer Agent for investor grievance redressal.' },
    ],
  },
  {
    heading: 'Trading Window',
    items: [
      { title: 'Trading Window Closure Notices', desc: 'Notices of trading window closure periods issued to designated persons under the Insider Trading Code.' },
      { title: 'Integrated Filings', desc: 'Integrated annual and half-yearly compliance reports as per SEBI LODR requirements.' },
    ],
  },
]

export default function Regulation46Page() {
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

      {/* Context */}
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

      {/* Disclosures */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {disclosureCategories.map((cat, ci) => (
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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-primary)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.desc}</p>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
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
                For event-based disclosures and material information filed with BSE and NSE, refer to{' '}
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
