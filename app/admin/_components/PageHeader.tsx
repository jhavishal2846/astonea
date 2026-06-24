import Link from '@/app/_nav/AppLink'

export type Crumb = { label: string; href?: string }

export default function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">/</span>}
              {bc.href ? (
                <Link href={bc.href} className="hover:text-primary transition-colors">{bc.label}</Link>
              ) : (
                <span className="text-slate-700">{bc.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}
