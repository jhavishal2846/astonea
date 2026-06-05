import Link from 'next/link'

type Props = {
  total: number
  perPage: number
  current: number
  basePath: string
  searchParams?: Record<string, string | undefined>
  itemLabel?: string
}

function buildHref(basePath: string, page: number, extra: Record<string, string | undefined>) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(extra)) {
    if (v) params.set(k, v)
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export default function AdminPagination({
  total,
  perPage,
  current,
  basePath,
  searchParams = {},
  itemLabel = 'items',
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  if (totalPages <= 1) {
    if (total === 0) return null
    return (
      <p className="mt-5 text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{total}</span> {itemLabel}.
      </p>
    )
  }

  const from = (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  const pages: (number | 'gap')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('gap')
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i)
    if (current < totalPages - 2) pages.push('gap')
    pages.push(totalPages)
  }

  const prevHref = buildHref(basePath, Math.max(1, current - 1), searchParams)
  const nextHref = buildHref(basePath, Math.min(totalPages, current + 1), searchParams)
  const prevDisabled = current <= 1
  const nextDisabled = current >= totalPages

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> {itemLabel}
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <PageLink href={prevHref} disabled={prevDisabled} ariaLabel="Previous page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </PageLink>

        {pages.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs select-none">
              …
            </span>
          ) : (
            <PageLink
              key={p}
              href={buildHref(basePath, p, searchParams)}
              active={p === current}
              ariaLabel={`Page ${p}`}
            >
              {p}
            </PageLink>
          ),
        )}

        <PageLink href={nextHref} disabled={nextDisabled} ariaLabel="Next page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </PageLink>
      </nav>
    </div>
  )
}

function PageLink({
  href,
  children,
  active,
  disabled,
  ariaLabel,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  ariaLabel?: string
}) {
  const base =
    'inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg text-xs font-semibold transition-colors'
  if (disabled) {
    return (
      <span aria-disabled className={`${base} border border-slate-200 text-slate-300 cursor-not-allowed`}>
        {children}
      </span>
    )
  }
  if (active) {
    return (
      <span aria-current="page" className={`${base} bg-slate-900 text-white`}>
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${base} border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50`}
    >
      {children}
    </Link>
  )
}
