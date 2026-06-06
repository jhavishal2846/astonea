import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Newspaper Publications',
  description: 'Statutory financial results and notices of Astonea Labs Limited published in approved newspapers.',
}

type Item = { title: string; date?: string; fileUrl?: string }

const ITEMS: Item[] = [
  { title: 'Newspaper Publication — 3rd March 2026', date: '03 Mar 2026', fileUrl: '/pdf/newspape-publications/Newspaper Publication 03.03.2026.pdf' },
]

export default function NewspaperPublicationsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Newspaper Publications"
        description="Statutory financial results and notices of Astonea Labs Limited published in approved newspapers."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Newspaper Publications', href: '/newspaper-publications' },
        ]}
      />

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
              {ITEMS.map((item, i) => (
                <Reveal key={item.title} delay={i * 30}>
                  <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                        {item.date && (
                          <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                            {item.date}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                        Soon
                      </span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
