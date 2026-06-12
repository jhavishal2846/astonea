import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Financial Results',
  description: 'Astonea Labs Limited financial results — quarterly and annual financial statements.',
}

type Item = { title: string; period?: string; fileUrl?: string }

type Section = {
  eyebrow: string
  heading: string
  badge: { label: string; bg: string; text: string }
  items: Item[]
}

const SECTIONS: Section[] = [
  {
    eyebrow: 'Annual Financial Statements',
    heading: 'Annual',
    badge: { label: 'Annual', bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
    items: [
      { title: 'FY 2024-2025', fileUrl: '/pdf/Financial Statements FY 2024-25.pdf' },
      { title: 'FY 2023-2024', fileUrl: '/pdf/Financial Statements FY 2023-24.pdf' },
      { title: 'FY 2022-2023', fileUrl: '/pdf/ASTONEA BS 2023.pdf' },
      { title: 'FY 2021-2022', fileUrl: '/pdf/ASTONEA BS-21-22.pdf' },
      { title: 'FY 2020-2021', fileUrl: '/pdf/Balance Sheet 20-21.pdf' },
    ],
  },
  {
    eyebrow: 'Half-Yearly Results',
    heading: 'Half Yearly',
    badge: { label: 'Half-Yearly', bg: 'rgba(232,169,0,0.12)', text: '#8A6000' },
    items: [
      { title: 'Financial Results — Sep 2025', period: 'Half-year ended 30 Sep 2025', fileUrl: '/pdf/financialresults-Half Yearly Result- 30.09.2025.pdf' },
      { title: 'Financial Results — Mar 2026', period: 'Half-year & year ended 31 Mar 2026', fileUrl: '/pdf/BM Outcome 30.05.2026.pdf' },
    ],
  },
  {
    eyebrow: 'Restated Statements',
    heading: 'Restated Financial Statements',
    badge: { label: 'Restated', bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
    items: [
      { title: 'RFS — 31 Dec 2024', period: 'Restated as at 31 December 2024', fileUrl: '/pdf/R.F.S. 31-12-2024.pdf' },
      { title: 'RFS — 31 Mar 2024', period: 'Restated as at 31 March 2024', fileUrl: '/pdf/SIGNED R.F.S 2023-24.pdf' },
    ],
  },
]

export default function FinancialResultsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Financial Results"
        description="Astonea Labs Limited's audited annual financial statements, half-yearly results and restated financial statements."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Financial Results', href: '/financial-results' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {SECTIONS.map((section, si) => (
              <div key={section.heading}>
                <Reveal delay={si * 40}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                    {section.eyebrow}
                  </p>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-6" style={{ color: 'var(--color-ink)' }}>
                    {section.heading}
                  </h2>
                </Reveal>
                <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
                  {section.items.map((item, ii) => (
                    <Reveal key={item.title} delay={si * 40 + ii * 30}>
                      <div className="flex items-center justify-between gap-3 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
                            <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-primary)' }}>DOC</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                            {item.period && <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{item.period}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: section.badge.bg, color: section.badge.text }}>
                            {section.badge.label}
                          </span>
                          {item.fileUrl ? (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50"
                              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                            >
                              PDF
                            </a>
                          ) : (
                            <span className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-default" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}

            <Reveal>
              <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                  <strong style={{ color: 'var(--color-ink-muted)' }}>Disclaimer:</strong> The financial results listed above are submitted to BSE as per SEBI LODR Regulations. For the latest filings, please also refer to the BSE India portal using CIN L24304CH2017PLC041482.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
