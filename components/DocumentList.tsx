import { Reveal } from '@/components/StaggerReveal'
import type { DocumentRow } from '@/lib/db/schema'

function formatDate(d: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export function DocumentList({
  items,
  emptyMessage = 'No documents have been published yet.',
  showIndex = true,
  showDate = true,
  showPeriod = false,
}: {
  items: DocumentRow[]
  emptyMessage?: string
  showIndex?: boolean
  showDate?: boolean
  showPeriod?: boolean
}) {
  if (items.length === 0) {
    return (
      <Reveal>
        <div
          className="p-6 rounded-xl border text-sm"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-ink-muted)',
          }}
        >
          {emptyMessage}
        </div>
      </Reveal>
    )
  }

  return (
    <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
      {items.map((item, i) => {
        const dateLabel = showDate ? formatDate(item.eventDate) : ''
        return (
          <Reveal key={item.id} delay={i * 25}>
            <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
              {showIndex && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold"
                  style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
                    {item.title}
                  </p>
                  {dateLabel && (
                    <span
                      className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-full"
                      style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}
                    >
                      {dateLabel}
                    </span>
                  )}
                </div>
                {showPeriod && item.period && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>
                    {item.period}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    {item.description}
                  </p>
                )}
              </div>
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
              ) : item.externalLink ? (
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  Link
                </a>
              ) : (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}
                >
                  Soon
                </span>
              )}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
