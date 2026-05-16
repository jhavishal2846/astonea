import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Group Companies',
  description: 'The corporate family of Astonea Labs Limited — group entities and affiliated organisations.',
}

const companies = [
  {
    name: 'Astonea Labs Limited',
    type: 'Parent Company',
    cin: 'L24304CH2017PLC041482',
    desc: 'The SEBI-listed parent entity and primary operating company — a pharmaceutical and cosmetic manufacturer headquartered in Chandigarh, India.',
    tag: 'Listed',
  },
  {
    name: 'Ascot Biolabs Private Limited',
    type: 'Group Entity',
    desc: 'Part of the Astonea group structure, operating within the pharmaceutical and biological sciences segment.',
    tag: 'Private',
  },
  {
    name: 'Shinto Organics Private Limited',
    type: 'Group Entity',
    desc: 'An operational entity within the group with activities in organics and chemical-related manufacturing.',
    tag: 'Private',
  },
  {
    name: 'Astonea One Private Limited',
    type: 'Group Entity',
    desc: 'A group company contributing to the diversified operational structure of the Astonea corporate family.',
    tag: 'Private',
  },
  {
    name: 'Astonea Limited',
    type: 'Related Entity',
    desc: 'A related company within the broader Astonea group ecosystem.',
    tag: 'Private',
  },
  {
    name: 'Chemist India Limited',
    type: 'Group Entity',
    desc: 'Part of the corporate structure, engaged in pharmaceutical and chemical sector operations.',
    tag: 'Private',
  },
  {
    name: 'Astonea Foundation',
    type: 'Non-Profit Entity',
    desc: 'The corporate social responsibility arm of the Astonea group — supporting ecological preservation, social empowerment, and community advancement.',
    tag: 'Non-Profit',
  },
]

const tagStyles: Record<string, { bg: string; text: string }> = {
  Listed:       { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  Private:      { bg: 'var(--color-slate-100)',       text: 'var(--color-slate-600)' },
  'Non-Profit': { bg: 'rgba(16,185,129,0.1)',         text: '#059669' },
}

const groupFinancials: { company: string; docs: { label: string; period: string; href?: string }[] }[] = [
  {
    company: 'Ascot Biolabs Private Limited',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Ascot Biolabs - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Ascot Biolabs - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023' },
    ],
  },
  {
    company: 'Shinto Organics Private Limited',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/SHINTO ORGANIC PVT LTD B.S.  2024-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Shinto Organics - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023', href: '/pdf/Shinto Organics - Financial Statements 22-23.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2021–2022', href: '/pdf/Shinto Organics - Financial Statements 21-22.pdf' },
    ],
  },
  {
    company: 'Astonea One Private Limited',
    docs: [
      { label: 'Balance Sheet', period: 'FY 2024–2025', href: '/pdf/ASTONEA ONE -BS 2024-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023' },
    ],
  },
  {
    company: 'Astonea Limited',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Astonea Limited - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Astonea Limited-23-24.pdf' },
      { label: 'Balance Sheet', period: 'FY 2022–2023', href: '/pdf/ASTONEA LIMITED BALANCE SHEET-22-23.pdf' },
    ],
  },
  {
    company: 'Chemist India Limited',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Chemist India Ltd - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Chemist India Ltd - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023', href: '/pdf/Chemist India Ltd - Financial Statements 22-23.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2021–2022', href: '/pdf/Chemist India Ltd - Financial Statements 21-22.pdf' },
    ],
  },
  {
    company: 'Astonea Foundation',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Astonea Foundation- Financial Statements 24-25.pdf' },
    ],
  },
]

function DocRow({ label, period, href }: { label: string; period: string; href?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{period}</p>
        </div>
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
          PDF
        </a>
      ) : (
        <span className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Soon
        </span>
      )}
    </div>
  )
}

export default function GroupCompaniesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Corporate Structure"
        title="Group Companies"
        description="Astonea Labs Limited operates alongside several affiliated entities forming a diversified pharmaceutical and cosmetic group."
        breadcrumb={[{ label: 'Group Companies', href: '/group-companies' }]}
      />

      {/* Companies grid */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Corporate Family
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Entities within the Astonea group
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c, i) => {
              const tag = tagStyles[c.tag]
              return (
                <Reveal key={c.name} delay={i * 60}>
                  <div className="flex flex-col p-8 rounded-2xl border h-full" style={{
                    background: c.tag === 'Listed' ? 'var(--color-slate-950)' : 'var(--color-surface)',
                    borderColor: c.tag === 'Listed' ? 'rgba(255,255,255,0.08)' : 'var(--color-border)',
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tag.bg, color: tag.text }}>
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: c.tag === 'Listed' ? 'white' : 'var(--color-ink)' }}>
                      {c.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.tag === 'Listed' ? 'var(--color-primary-light)' : 'var(--color-primary)' }}>
                      {c.type}
                    </p>
                    {c.cin && (
                      <p className="text-xs font-mono mb-3" style={{ color: c.tag === 'Listed' ? 'rgba(255,255,255,0.4)' : 'var(--color-ink-subtle)' }}>
                        CIN: {c.cin}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed flex-1" style={{ color: c.tag === 'Listed' ? 'rgba(255,255,255,0.55)' : 'var(--color-ink-muted)' }}>
                      {c.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Group financials */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Financial Documents
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-4 text-balance" style={{ color: 'var(--color-ink)' }}>
              Group company financials
            </h2>
            <p className="text-base mb-14 max-w-2xl" style={{ color: 'var(--color-ink-muted)' }}>
              Annual financial statements for each entity within the Astonea group. For Astonea Labs Limited financials, refer to the{' '}
              <Link href="/financial-results" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Financial Results
              </Link>{' '}
              and{' '}
              <Link href="/annual-reports" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Annual Reports
              </Link>{' '}
              pages.
            </p>
          </Reveal>

          <div className="space-y-12 max-w-3xl">
            {groupFinancials.map((group, gi) => (
              <Reveal key={group.company} delay={gi * 60}>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-4 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                    {group.company}
                  </h3>
                  <div className="space-y-3">
                    {group.docs.map((doc, di) => (
                      <DocRow key={`${group.company}-${doc.period}`} {...doc} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
