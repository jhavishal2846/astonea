import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { SUBCATEGORY_LABELS } from '@/lib/cms/categories'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/financial-results', {
    title: 'Financial Results',
    description:
      'Astonea Labs Limited financial results — quarterly and annual financial statements.',
  })

const SECTION_META: Record<string, { eyebrow: string; heading: string; badge: { label: string; bg: string; text: string } }> = {
  annual: {
    eyebrow: 'Annual Financial Statements',
    heading: 'Annual',
    badge: { label: 'Annual', bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  },
  half_yearly: {
    eyebrow: 'Half-Yearly Results',
    heading: 'Half Yearly',
    badge: { label: 'Half-Yearly', bg: 'rgba(232,169,0,0.12)', text: '#8A6000' },
  },
  restated: {
    eyebrow: 'Restated Statements',
    heading: 'Restated Financial Statements',
    badge: { label: 'Restated', bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
  },
  mgt7: {
    eyebrow: 'Annual Return (MGT-7)',
    heading: 'Annual Return',
    badge: { label: 'MGT-7', bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
  },
  board_notice: {
    eyebrow: 'Board Meeting Notices',
    heading: 'Notices',
    badge: { label: 'Notice', bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  },
  deviation: {
    eyebrow: 'Deviation Statements',
    heading: 'Deviations',
    badge: { label: 'Deviation', bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
  },
}

const SECTION_ORDER = ['annual', 'half_yearly', 'restated', 'mgt7', 'board_notice', 'deviation']

export default async function FinancialResultsPage() {
  const rows = await listPublishedByCategory('financial_result')
  const grouped = groupBySubcategory(rows)
  const t = await getPageText('/financial-results')

  const sections = SECTION_ORDER
    .map((key) => ({ key, items: grouped[key] ?? [] }))
    .filter((s) => s.items.length > 0)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Financial Results') as string}
        description={t('header.description', "Astonea Labs Limited's audited annual financial statements, half-yearly results and restated financial statements.") as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Financial Results', href: '/financial-results' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {sections.length === 0 && (
              <Reveal>
                <div className="p-6 rounded-xl border text-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                  {t('doc.empty', 'No financial results have been published yet.')}
                </div>
              </Reveal>
            )}

            {sections.map((section, si) => {
              const meta = SECTION_META[section.key] ?? {
                eyebrow: SUBCATEGORY_LABELS[section.key] ?? 'Other',
                heading: SUBCATEGORY_LABELS[section.key] ?? 'Other',
                badge: { label: 'Other', bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' },
              }
              return (
                <div key={section.key}>
                  <Reveal delay={si * 40}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                      {meta.eyebrow}
                    </p>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-6" style={{ color: 'var(--color-ink)' }}>
                      {meta.heading}
                    </h2>
                  </Reveal>
                  <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    {section.items.map((item, ii) => (
                      <Reveal key={item.id} delay={si * 40 + ii * 30}>
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
                            <span className="hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: meta.badge.bg, color: meta.badge.text }}>
                              {meta.badge.label}
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
              )
            })}

            <Reveal>
              <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                  {t('doc.disclaimer', 'The financial results listed above are submitted to BSE as per SEBI LODR Regulations. For the latest filings, please also refer to the BSE India portal using CIN L24304CH2017PLC041482.')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
