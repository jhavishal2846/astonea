import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/board-meetings', {
    title: 'Board Meetings',
    description:
      'Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited.',
  })

const SECTION_META: Record<string, { eyebrow: string; heading: string; badge: { label: string; bg: string; text: string } }> = {
  intimation: {
    eyebrow: 'Prior Intimations',
    heading: 'Intimation',
    badge: { label: 'Intimation', bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  },
  board_meeting: {
    eyebrow: 'Board Meeting Outcomes',
    heading: 'Outcome',
    badge: { label: 'Outcome', bg: 'rgba(232,169,0,0.12)', text: '#8A6000' },
  },
}

const SECTION_ORDER = ['intimation', 'board_meeting']

function formatDate(d: string | null): string {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export default async function BoardMeetingsPage() {
  // Board-meeting documents live under reg30 with subcategory 'intimation' or 'board_meeting'.
  const rows = await listPublishedByCategory('reg30')
  const grouped = groupBySubcategory(rows)
  const t = await getPageText('/board-meetings')

  const sections = SECTION_ORDER
    .map((key) => ({ key, items: (grouped[key] ?? []).slice() }))
    .filter((s) => s.items.length > 0)

  // Sort each section by event_date desc when present
  sections.forEach((s) => {
    s.items.sort((a, b) => {
      const da = a.eventDate ? new Date(a.eventDate).getTime() : 0
      const db = b.eventDate ? new Date(b.eventDate).getTime() : 0
      return db - da
    })
  })

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Meetings') as string}
        title={t('header.title', 'Board Meetings') as string}
        description={t('header.description', 'Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'Board Meetings', href: '/board-meetings' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {sections.length === 0 && (
              <Reveal>
                <div className="p-6 rounded-xl border text-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                  {t('doc.empty', 'No board meeting documents have been published yet.')}
                </div>
              </Reveal>
            )}

            {sections.map((section, si) => {
              const meta = SECTION_META[section.key]
              if (!meta) return null
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
                    {section.items.map((item, ii) => {
                      const dateLabel = formatDate(item.eventDate)
                      return (
                        <Reveal key={item.id} delay={si * 40 + ii * 30}>
                          <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                              {String(ii + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                                {dateLabel && (
                                  <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                                    {dateLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-1 rounded-full shrink-0 self-start" style={{ background: meta.badge.bg, color: meta.badge.text }}>
                              {meta.badge.label}
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
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
