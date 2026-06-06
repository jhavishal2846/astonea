import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Board Meetings',
  description: 'Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited.',
}

type Item = { title: string; date?: string; fileUrl?: string }

type Section = {
  eyebrow: string
  heading: string
  badge: { label: string; bg: string; text: string }
  items: Item[]
}

const SECTIONS: Section[] = [
  {
    eyebrow: 'Prior Intimations',
    heading: 'Intimation',
    badge: { label: 'Intimation', bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
    items: [
      { title: 'Intimation — 4th July 2025',   date: '04 Jul 2025', fileUrl: '/pdf/intimation/04th July, 2025.pdf' },
      { title: 'Intimation — 6th Nov 2025',    date: '06 Nov 2025', fileUrl: '/pdf/intimation/06th Nov, 2025.pdf' },
      { title: 'Intimation — 28th Nov 2025',   date: '28 Nov 2025', fileUrl: '/pdf/intimation/28th Nov, 2025.pdf' },
      { title: 'Intimation — 24th Feb 2026',   date: '24 Feb 2026', fileUrl: '/pdf/intimation/24th Feb 2026.pdf' },
      { title: 'Intimation — 25th May 2026',   date: '25 May 2026', fileUrl: '/pdf/intimation/BM-Prior Intimation.pdf' },
    ],
  },
  {
    eyebrow: 'Board Meeting Outcomes',
    heading: 'Outcome',
    badge: { label: 'Outcome', bg: 'rgba(232,169,0,0.12)', text: '#8A6000' },
    items: [
      { title: 'Outcome — 11th Jul 2025',  date: '11 Jul 2025', fileUrl: '/pdf/outcome/11th July, 2025.pdf' },
      { title: 'Outcome — 20th Sep 2025',  date: '20 Sep 2025', fileUrl: '/pdf/outcome/20th Sep, 2025.pdf' },
      { title: 'Outcome — 10th Nov 2025',  date: '10 Nov 2025', fileUrl: '/pdf/outcome/10th Nov, 2025.pdf' },
      { title: 'Outcome — 3rd Dec 2025',   date: '03 Dec 2025', fileUrl: '/pdf/outcome/03rd Dec, 2025.pdf' },
      { title: 'Outcome — 6th Feb 2026',   date: '06 Feb 2026', fileUrl: '/pdf/outcome/Board Meeting -Outcome 6feb2026.pdf' },
      { title: 'Outcome — 27th Feb 2026',  date: '27 Feb 2026', fileUrl: '/pdf/outcome/outcome 27th Feb 2026.pdf' },
      { title: 'Outcome — 30th May 2026',  date: '30 May 2026', fileUrl: '/pdf/outcome/BM Outcome 30.05.2026.pdf' },
    ],
  },
]

export default function BoardMeetingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Meetings"
        title="Board Meetings"
        description="Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'Board Meetings', href: '/board-meetings' },
        ]}
      />

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
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
                      <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                          {String(ii + 1).padStart(2, '0')}
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
                        <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full shrink-0 self-start" style={{ background: section.badge.bg, color: section.badge.text }}>
                          {section.badge.label}
                        </span>
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                          >
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
