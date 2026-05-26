import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Annual Reports',
  description: 'Astonea Labs Limited annual reports — full-year consolidated reports for shareholders and investors.',
}

const reports = [
  {
    year: '2024–25',
    title: 'Annual Report FY 2024–2025',
    desc: 'Consolidated annual report including audited financials, board report, and corporate governance disclosures for FY 2024-25.',
    href: '/pdf/Annual Report for the FY 2024-25.pdf',
  },
  {
    year: '2023–24',
    title: 'Annual Report FY 2023–2024',
    desc: 'Full-year annual report covering financial performance, CSR activities, and regulatory disclosures for FY 2023-24.',
    href: '/pdf/Annual Report FY 2023-24.pdf',
  },
  {
    year: '2022–23',
    title: 'Annual Report FY 2022–2023',
    desc: 'Annual report with audited financial statements, director\'s report, and shareholder information for FY 2022-23.',
    href: '/pdf/Annual Report FY 2022-23.pdf',
  },
  {
    year: '2021–22',
    title: 'Annual Report FY 2021–2022',
    desc: 'Annual report covering the company\'s first full year as a listed entity on BSE and NSE.',
    href: '/pdf/Annual Report FY 2021-22.pdf',
  },
  {
    year: '2020–21',
    title: 'Annual Report FY 2020–2021',
    desc: 'Annual report for FY 2020-21 with audited standalone financial statements and governance disclosures.',
    href: '/pdf/Annual Report FY 2020-21.pdf',
  },
  {
    year: '2019–20',
    title: 'Annual Report FY 2019–2020',
    desc: 'Annual report for FY 2019-20 with audited standalone financial statements and governance disclosures.',
    href: '/pdf/Annual Report FY 2019-20.pdf',
  },
]

export default function AnnualReportsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Annual Reports"
        description="Astonea Labs Limited's complete annual reports — financial statements, governance, and corporate disclosures."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Annual Reports', href: '/annual-reports' },
        ]}
      />

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Reports Archive
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Annual reports for every financial year
            </h2>
          </Reveal>

          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {reports.map((r, i) => (
              <Reveal key={r.year} delay={i * 60}>
                <div className="flex items-start gap-6 p-6 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center" style={{ background: 'var(--color-primary-xlight)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>FY</span>
                    <span className="font-display font-bold text-sm leading-tight text-center" style={{ color: 'var(--color-primary)' }}>{r.year}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{r.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{r.desc}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50"
                      style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                    >
                      PDF
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                Annual Reports are filed with BSE and NSE in accordance with SEBI LODR Regulations.
                CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India.
                For the most current filings, refer to the exchange portals or contact{' '}
                <a href="mailto:cs@astonea.org" style={{ color: 'var(--color-primary)' }}>cs@astonea.org</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
