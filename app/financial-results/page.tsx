import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Financial Results',
  description: 'Astonea Labs Limited financial results — quarterly and annual financial statements.',
}

const annualResults = [
  { period: 'FY 2024–2025', label: 'Annual Financial Statements', type: 'Annual', href: '/pdf/Financial Statements FY 2024-25.pdf' },
  { period: 'FY 2023–2024', label: 'Annual Financial Statements', type: 'Annual', href: '/pdf/Financial Statements FY 2023-24.pdf' },
  { period: 'FY 2022–2023', label: 'Annual Financial Statements', type: 'Annual', href: '/pdf/Annual Report FY 2022-23.pdf' },
  { period: 'FY 2021–2022', label: 'Annual Financial Statements', type: 'Annual', href: '/pdf/Annual Report FY 2021-22.pdf' },
  { period: 'FY 2020–2021', label: 'Annual Financial Statements', type: 'Annual', href: '/pdf/Annual Report FY 2020-21.pdf' },
]

const interimResults = [
  { period: 'Half-Yearly — Sep 2025', label: 'Unaudited Financial Results for H1 FY2025-26', type: 'Half-Yearly', href: '/pdf/financialresults-Half Yearly Result- 30.09.2025.pdf' },
  { period: 'Restated — Dec 31, 2024', label: 'Restated Financial Statements as at Dec 31, 2024', type: 'Restated' },
  { period: 'Restated — Mar 31, 2024', label: 'Restated Financial Statements as at Mar 31, 2024', type: 'Restated' },
]

const annualReturns = [
  { period: 'FY 2024–2025', label: 'Annual Return — Form MGT-7', href: '/pdf/Form MGT-7 2024-25.pdf' },
  { period: 'FY 2023–2024', label: 'Annual Return — Form MGT-7', href: '/pdf/Form MGT 7 23-24.pdf' },
  { period: 'FY 2022–2023', label: 'Annual Return — Form MGT-7', href: '/pdf/Form MGT 7 22-23.pdf' },
  { period: 'FY 2021–2022', label: 'Annual Return — Form MGT-7A', href: '/pdf/Form MGT 7A 21-22.pdf' },
  { period: 'FY 2020–2021', label: 'Annual Return — Form MGT-7', href: '/pdf/Form MGT 7 20-21.pdf' },
  { period: 'FY 2019–2020', label: 'Annual Return — Form MGT-7', href: '/pdf/Form MGT 7 19-20.pdf' },
]

const boardNotices = [
  { date: '6 Nov 2025', label: 'Board Meeting Notice — 6th November 2025', href: '/pdf/board-meeting-ntc-06th Nov, 2025.pdf' },
  { date: '4 Jul 2025', label: 'Board Meeting Notice — 4th July 2025', href: '/pdf/board-meeting-ntc-04th July, 2025.pdf' },
]

const deviationStatements = [
  { period: 'H1 FY 2025–26 (Sep 30, 2025)', label: 'Non-Applicability of Statement of Deviation or Variation', href: '/pdf/Non- Applicability of Statement of Variation or Deviation.pdf' },
]

const typeColors: Record<string, { bg: string; text: string }> = {
  Annual:        { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  'Half-Yearly': { bg: 'rgba(232,169,0,0.12)',        text: '#8A6000' },
  Restated:      { bg: 'var(--color-slate-100)',       text: 'var(--color-slate-600)' },
}

function DocRow({ period, label, type, href }: { period: string; label: string; type?: string; href?: string }) {
  const tc = type ? (typeColors[type] ?? typeColors.Restated) : null

  return (
    <div className="flex items-center justify-between p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center gap-4">
        <div className="px-2.5 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-primary)' }}>DOC</span>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{period}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {tc && (
          <span className="hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tc.bg, color: tc.text }}>
            {type}
          </span>
        )}
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            PDF
          </a>
        ) : (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-default" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
            Soon
          </span>
        )}
      </div>
    </div>
  )
}

function Section({ eyebrow, heading, children }: { eyebrow: string; heading: string; children: React.ReactNode }) {
  return (
    <div>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-6" style={{ color: 'var(--color-ink)' }}>
          {heading}
        </h2>
      </Reveal>
      <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
        {children}
      </div>
    </div>
  )
}

export default function FinancialResultsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Financial Results"
        description="Astonea Labs Limited's audited annual financial statements and interim financial results."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Financial Results', href: '/financial-results' },
        ]}
      />

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">

            <Section eyebrow="Annual Financial Statements" heading="Audited Annual Results">
              {annualResults.map((r, i) => (
                <Reveal key={r.period} delay={i * 50}>
                  <DocRow {...r} />
                </Reveal>
              ))}
            </Section>

            <Section eyebrow="Interim & Restated Statements" heading="Half-Yearly & Restated Results">
              {interimResults.map((r, i) => (
                <Reveal key={r.period} delay={i * 50}>
                  <DocRow {...r} />
                </Reveal>
              ))}
            </Section>

            <Section eyebrow="Annual Returns" heading="Form MGT-7">
              {annualReturns.map((r, i) => (
                <Reveal key={r.period} delay={i * 50}>
                  <DocRow {...r} />
                </Reveal>
              ))}
            </Section>

            <Section eyebrow="Board Meeting Notices" heading="Notices for Financial Results">
              {boardNotices.map((r, i) => (
                <Reveal key={r.date} delay={i * 50}>
                  <DocRow label={r.label} period={r.date} href={r.href} />
                </Reveal>
              ))}
            </Section>

            <Section eyebrow="Statement of Deviation or Variation" heading="IPO Proceeds Utilisation">
              {deviationStatements.map((r, i) => (
                <Reveal key={r.period} delay={i * 50}>
                  <DocRow {...r} />
                </Reveal>
              ))}
            </Section>

            <Reveal>
              <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                  <strong style={{ color: 'var(--color-ink-muted)' }}>Disclaimer:</strong> The financial results listed above are submitted to BSE and NSE as per SEBI LODR Regulations. For the latest filings, please also refer to the BSE India and NSE India portals using CIN L24304CH2017PLC041482.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </div>
  )
}
