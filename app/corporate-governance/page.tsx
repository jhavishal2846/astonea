import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Corporate Governance',
  description: 'Astonea Labs Limited corporate governance — board committees, meetings, and governance framework.',
}

const committees = [
  {
    name: 'Audit Committee',
    desc: 'Oversees financial reporting, internal controls, and the audit process. Ensures integrity of financial statements and compliance with accounting standards.',
    chair: 'Independent Director',
  },
  {
    name: 'Nomination & Remuneration Committee',
    desc: 'Responsible for identifying and recommending Board candidates, and determining the remuneration policy for directors and key managerial personnel.',
    chair: 'Independent Director',
  },
  {
    name: 'Stakeholders Relationship Committee',
    desc: 'Handles investor grievances, share transfers, and ensures timely resolution of shareholder queries and complaints.',
    chair: 'Non-Executive Director',
  },
  {
    name: 'CSR Committee',
    desc: 'Formulates and monitors the Corporate Social Responsibility Policy, overseeing CSR spending and activities in line with the Companies Act, 2013.',
    chair: 'Managing Director',
  },
  {
    name: 'Risk Management Committee',
    desc: 'Identifies, assesses, and manages business risks — financial, operational, regulatory, and reputational.',
    chair: 'Independent Director',
  },
]

const governanceDocs = [
  { title: 'Corporate Documents', desc: 'Memorandum and Articles of Association, incorporation documents, and statutory registers.', href: '/governance-policies-codes-and-frameworks' },
  { title: 'Governance Policies', desc: 'Formal policies governing operations, related-party transactions, whistleblower mechanism, and more.', href: '/governance-policies-codes-and-frameworks' },
  { title: 'Codes of Conduct', desc: 'Code of conduct for Directors, Key Managerial Personnel, and Senior Management of the Company.', href: '/governance-policies-codes-and-frameworks' },
  { title: 'Secretarial Audit Report', desc: 'Annual secretarial audit report from a practicing Company Secretary as required under the Companies Act, 2013.', href: '/annual-reports' },
  { title: 'Board Meeting Notices & Minutes', desc: 'Notices of Board meetings and committee meetings as disclosed under SEBI LODR Regulations.', href: '/sebi-lodr-regulation-46-disclosures' },
  { title: 'SEBI Disclosures', desc: 'Statutory disclosures under SEBI LODR Regulation 30 (event-based) and Regulation 46 (website disclosures).', href: '/sebi-lodr-regulation-46-disclosures' },
]

export default function CorporateGovernancePage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Corporate Governance"
        description="Astonea Labs Limited's governance structure — transparent, accountable, and fully compliant with SEBI Listing Obligations."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Corporate Governance', href: '/corporate-governance' },
        ]}
      />

      {/* Governance commitment */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  Our Commitment
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Transparent by design
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                  As a SEBI-listed company on BSE and NSE, Astonea Labs Limited (CIN: L24304CH2017PLC041482) is
                  committed to the highest standards of corporate governance — ensuring transparency, accountability,
                  and protection of shareholder interests at every level.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  Our governance framework is anchored in the Companies Act 2013, SEBI LODR Regulations, SEBI
                  (Prohibition of Insider Trading) Regulations, and other applicable laws and best practices.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                {[
                  { label: 'Board Strength', value: '9 Directors', note: '3 Independent · 1 Non-Executive · 5 Executive' },
                  { label: 'Listed On', value: 'BSE & NSE', note: 'Bombay Stock Exchange & National Stock Exchange' },
                  { label: 'Compliance Framework', value: 'SEBI LODR', note: 'Listing Obligations & Disclosure Requirements' },
                  { label: 'Statutory Auditor', value: 'Independent CA Firm', note: 'Appointed by shareholders at AGM' },
                ].map((f) => (
                  <div key={f.label} className="p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-subtle)' }}>{f.label}</p>
                    <p className="font-display text-lg font-semibold mb-0.5" style={{ color: 'var(--color-ink)' }}>{f.value}</p>
                    <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{f.note}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Board Committees */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Board Committees
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Specialised oversight for every domain
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <div className="flex flex-col p-8 rounded-2xl border h-full" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>{c.name}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-ink-muted)' }}>{c.desc}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-ink-subtle)' }}>
                    Chairperson: {c.chair}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Document links */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Governance Resources
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Documents & disclosures
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {governanceDocs.map((d, i) => (
              <Reveal key={d.title} delay={i * 50}>
                <Link href={d.href} className="group flex items-start gap-4 p-5 rounded-xl border transition-all hover:border-blue-200 hover:shadow-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors" style={{ color: 'var(--color-ink)' }}>{d.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{d.desc}</p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-ink-subtle)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
