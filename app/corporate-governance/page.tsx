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
    num: '01',
    name: 'Audit Committee',
    desc: 'Oversees financial reporting, internal controls, and the audit process. Ensures integrity of financial statements and compliance with accounting standards.',
    chair: 'Independent Director',
  },
  {
    num: '02',
    name: 'Nomination & Remuneration Committee',
    desc: 'Responsible for identifying and recommending Board candidates, and determining the remuneration policy for directors and key managerial personnel.',
    chair: 'Independent Director',
  },
  {
    num: '03',
    name: 'Stakeholders Relationship Committee',
    desc: 'Handles investor grievances, share transfers, and ensures timely resolution of shareholder queries and complaints.',
    chair: 'Non-Executive Director',
  },
  {
    num: '04',
    name: 'CSR Committee',
    desc: 'Formulates and monitors the Corporate Social Responsibility Policy, overseeing CSR spending and activities in line with the Companies Act, 2013.',
    chair: 'Managing Director',
  },
  {
    num: '05',
    name: 'Risk Management Committee',
    desc: 'Identifies, assesses, and manages business risks — financial, operational, regulatory, and reputational.',
    chair: 'Independent Director',
  },
]

const governanceDocs = [
  { num: '01', title: 'Corporate Documents',     desc: 'Memorandum and Articles of Association, incorporation documents, and statutory registers.', href: '/corporate-documents' },
  { num: '02', title: 'Policies',                desc: 'Board-approved governance policies covering POSH, RPT, succession, board diversity and more.', href: '/policies' },
  { num: '03', title: 'Codes',                   desc: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.', href: '/codes' },
  { num: '04', title: 'Board of Directors',      desc: 'Composition of the Board — Executive, Non-Executive, and Independent Directors leading the Company.', href: '/board-of-directors' },
  { num: '05', title: 'Committees of BOD',       desc: 'Board sub-committees overseeing audit, nomination, remuneration, stakeholder, CSR and risk functions.', href: '/pdf/14. Composition of Committees.pdf' },
  { num: '06', title: 'Secretarial Audit Report', desc: 'Annual secretarial audit report from a practicing Company Secretary as required under the Companies Act, 2013.', href: '/pdf/Secretarial Audit Report.pdf' },
  { num: '07', title: 'Board Meetings',          desc: 'Notices and outcomes of Board meetings as disclosed under SEBI LODR Regulations.', href: '/board-meetings' },
]

const governanceFacts = [
  { label: 'Board Strength', value: '9 Directors', note: '3 Independent · 1 Non-Executive · 5 Executive' },
  { label: 'Listed On', value: 'BSE', note: 'Bombay Stock Exchange & National Stock Exchange' },
  { label: 'Compliance Framework', value: 'SEBI LODR', note: 'Listing Obligations & Disclosure Requirements' },
  { label: 'Statutory Auditor', value: 'Independent CA Firm', note: 'Appointed by shareholders at AGM' },
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
                  As a BSE-SME company on BSE, Astonea Labs Limited (CIN: L24304CH2017PLC041482) is
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
              <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                {governanceFacts.map((f) => (
                  <div key={f.label} className="p-5" style={{ background: 'var(--color-surface)' }}>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--color-border)' }}>
            {committees.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <div className="flex flex-col gap-3 p-8 h-full" style={{ background: 'var(--color-bg)' }}>
                  <span className="font-display text-4xl font-bold tracking-tighter leading-none select-none" style={{ color: 'var(--color-primary-xlight)' }}>
                    {c.num}
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>{c.name}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{c.desc}</p>
                  <p className="text-xs font-medium pt-3 border-t" style={{ color: 'var(--color-ink-subtle)', borderColor: 'var(--color-border)' }}>
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
          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {governanceDocs.map((d, i) => (
              <Reveal key={d.title} delay={i * 50}>
                <Link href={d.href} className="group flex items-start gap-4 p-5 transition-all hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                    {d.num}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{d.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{d.desc}</p>
                  </div>
                  <span className="text-sm font-medium flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" style={{ color: 'var(--color-ink-subtle)' }}>→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
