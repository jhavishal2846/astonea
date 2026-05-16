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
      { title: 'Memorandum of Association', desc: 'Memorandum of Association of the Company as filed with the Registrar of Companies.', href: '/pdf/MOA ALL.pdf' },
      { title: 'Articles of Association', desc: 'Articles of Association of the Company including the new set adopted at EGM on 27th March 2026.', href: '/pdf/AOA FNL.pdf' },
      { title: 'Details of Business', desc: 'Overview of the company\'s business operations, product categories, and service segments.' },
      { title: 'Financial Information', desc: 'Audited financial statements and notes — refer to Financial Results and Annual Reports pages.', href: '/financial-results' },
    ],
  },
  {
    heading: 'Board & Governance',
    items: [
      { title: 'Shareholding Pattern', desc: 'Quarterly shareholding pattern filed with stock exchanges — quarter ended September 30, 2025.', href: '/pdf/Shareholding Pattern (1).pdf' },
      { title: 'Profiles of Board of Directors & KMPs', desc: 'Biographical and qualification details of all directors and key managerial personnel — refer to Board of Directors page.', href: '/board-of-directors' },
      { title: 'Code of Conduct for Board & Senior Management', desc: 'The Board-adopted code of conduct for directors and senior management personnel.', href: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
      { title: 'Terms & Conditions — Appointment of Independent Directors', desc: 'Formal terms and conditions governing the appointment of Independent Directors of the Company.', href: '/pdf/T&C- Appointment of Independent Directors.pdf' },
    ],
  },
  {
    heading: 'Committees',
    items: [
      { title: 'Composition of Board Committees', desc: 'Constituted committees of the Board: Audit, NRC, Stakeholders\' Relationship, CSR, and Risk Management.', href: '/pdf/14. Composition of Committees.pdf' },
      { title: 'Terms of Reference', desc: 'Scope, roles, and responsibilities of each Board committee as per the Companies Act and SEBI regulations.' },
    ],
  },
  {
    heading: 'Investor Information',
    items: [
      { title: 'Dividend Distribution Policy', desc: 'Policy governing the framework and parameters for dividend declaration.' },
      { title: 'Policy on Related Party Transactions', desc: 'Policy and procedures for identification and approval of transactions with related parties.' },
      { title: 'Whistle Blower / Vigil Mechanism Policy', desc: 'Policy enabling employees and directors to report genuine concerns without fear of reprisal.', href: '/pdf/Vigil Mechanism Policy.pdf' },
      { title: 'Contact Information for Investor Grievances', desc: 'Details of the Compliance Officer and Registrar & Share Transfer Agent — contact cs@astonea.org.' },
    ],
  },
  {
    heading: 'Financial Filings',
    items: [
      { title: 'Statement of Deviation or Variation — H1 FY 2025-26', desc: 'Non-applicability of Statement of Deviation or Variation in use of IPO proceeds for the half-year ended 30th September 2025.', href: '/pdf/Non- Applicability of Statement of Variation or Deviation.pdf' },
      { title: 'Board Meeting Notices for Financial Results', desc: 'Notices of Board meetings convened for approval of financial results.', href: '/financial-results' },
      { title: 'Annual Returns (Form MGT-7)', desc: 'Annual returns filed with the Registrar of Companies — all years available on the Financial Results page.', href: '/financial-results' },
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
            {disclosureCategories.map((cat, ci) => {
              let itemIndex = 0
              return (
                <div key={cat.heading}>
                  <Reveal>
                    <h2 className="font-display text-xl font-bold mb-6 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                      {cat.heading}
                    </h2>
                  </Reveal>
                  <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                    {cat.items.map((item, ii) => {
                      itemIndex++
                      const idx = itemIndex
                      return (
                        <Reveal key={item.title} delay={(ci + ii) * 40}>
                          <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                              {String(idx).padStart(2, '0')}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.desc}</p>
                            </div>
                            {item.href ? (
                              item.href.startsWith('/pdf/') ? (
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                  PDF
                                </a>
                              ) : (
                                <Link href={item.href} className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
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
