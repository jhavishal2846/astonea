import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Financial Results',
  description: 'Astonea Labs Limited financial results — quarterly and annual financial statements.',
}

const annualResults = [
  { period: 'FY 2024–2025', label: 'Annual Financial Statements', type: 'Annual' },
  { period: 'FY 2023–2024', label: 'Annual Financial Statements', type: 'Annual' },
  { period: 'FY 2022–2023', label: 'Annual Financial Statements', type: 'Annual' },
  { period: 'FY 2021–2022', label: 'Annual Financial Statements', type: 'Annual' },
  { period: 'FY 2020–2021', label: 'Annual Financial Statements', type: 'Annual' },
]

const interimResults = [
  { period: 'Half-Yearly — Sep 2025', label: 'Unaudited Financial Results for H1 FY2025-26', type: 'Half-Yearly' },
  { period: 'Restated — Dec 31, 2024', label: 'Restated Financial Statements as at Dec 31, 2024', type: 'Restated' },
  { period: 'Restated — Mar 31, 2024', label: 'Restated Financial Statements as at Mar 31, 2024', type: 'Restated' },
]

function DocRow({ period, label, type }: { period: string; label: string; type: string }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    Annual:     { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
    'Half-Yearly': { bg: 'rgba(232,169,0,0.1)', text: 'var(--color-accent-dark)' },
    Restated:   { bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
  }
  const tc = typeColors[type] ?? typeColors.Restated

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border transition-colors hover:border-blue-200" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{period}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tc.bg, color: tc.text }}>
          {type}
        </span>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-default" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          PDF
        </span>
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

            {/* Annual */}
            <div>
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Annual Financial Statements
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-8" style={{ color: 'var(--color-ink)' }}>
                  Audited Annual Results
                </h2>
              </Reveal>
              <div className="space-y-3">
                {annualResults.map((r, i) => (
                  <Reveal key={r.period} delay={i * 50}>
                    <DocRow {...r} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Interim */}
            <div>
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Interim & Restated Statements
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-8" style={{ color: 'var(--color-ink)' }}>
                  Half-Yearly & Restated Results
                </h2>
              </Reveal>
              <div className="space-y-3">
                {interimResults.map((r, i) => (
                  <Reveal key={r.period} delay={i * 50}>
                    <DocRow {...r} />
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
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
