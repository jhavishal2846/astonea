import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import type { DocumentRow } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Financial Results',
  description: 'Astonea Labs Limited financial results — quarterly and annual financial statements.',
}

export const dynamic = 'force-dynamic'

const typeColors: Record<string, { bg: string; text: string }> = {
  Annual:        { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  'Half-Yearly': { bg: 'rgba(232,169,0,0.12)',        text: '#8A6000' },
  Restated:      { bg: 'var(--color-slate-100)',       text: 'var(--color-slate-600)' },
}

const SUBCATEGORY_TYPE_LABEL: Record<string, string> = {
  annual:       'Annual',
  half_yearly:  'Half-Yearly',
  restated:     'Restated',
  mgt7:         '',
  board_notice: '',
  deviation:    '',
}

function DocRow({ row }: { row: DocumentRow }) {
  const typeLabel = row.subcategory ? SUBCATEGORY_TYPE_LABEL[row.subcategory] ?? '' : ''
  const tc = typeLabel ? typeColors[typeLabel] : null

  return (
    <div className="flex items-center justify-between p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center gap-4">
        <div className="px-2.5 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-primary)' }}>DOC</span>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{row.title}</p>
          {row.period && <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{row.period}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {tc && (
          <span className="hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tc.bg, color: tc.text }}>
            {typeLabel}
          </span>
        )}
        {row.fileUrl ? (
          <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
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

function Section({ eyebrow, heading, rows }: { eyebrow: string; heading: string; rows: DocumentRow[] }) {
  if (rows.length === 0) return null
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
        {rows.map((r, i) => (
          <Reveal key={r.id} delay={i * 50}>
            <DocRow row={r} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default async function FinancialResultsPage() {
  const all = await listPublishedByCategory('financial_result')
  const grouped = groupBySubcategory(all)

  const annual = grouped['annual'] ?? []
  const interim = [...(grouped['half_yearly'] ?? []), ...(grouped['restated'] ?? [])]
  const mgt7 = grouped['mgt7'] ?? []
  const boardNotices = grouped['board_notice'] ?? []
  const deviation = grouped['deviation'] ?? []

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

            <Section eyebrow="Annual Financial Statements" heading="Audited Annual Results" rows={annual} />
            <Section eyebrow="Interim & Restated Statements" heading="Half-Yearly & Restated Results" rows={interim} />
            <Section eyebrow="Annual Returns" heading="Form MGT-7" rows={mgt7} />
            <Section eyebrow="Board Meeting Notices" heading="Notices for Financial Results" rows={boardNotices} />
            <Section eyebrow="Statement of Deviation or Variation" heading="IPO Proceeds Utilisation" rows={deviation} />

            <Reveal>
              <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                  <strong style={{ color: 'var(--color-ink-muted)' }}>Disclaimer:</strong> The financial results listed above are submitted to BSE as per SEBI LODR Regulations. For the latest filings, please also refer to the BSE India portals using CIN L24304CH2017PLC041482.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </div>
  )
}
