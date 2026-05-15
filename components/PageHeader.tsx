import Link from 'next/link'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  breadcrumb: { label: string; href: string }[]
}

export function PageHeader({ eyebrow, title, description, breadcrumb }: PageHeaderProps) {
  return (
    <div
      className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b"
      style={{ background: 'var(--color-slate-950)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="container-wide">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <span>/</span>
              {i === breadcrumb.length - 1 ? (
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl text-balance">
          {title}
        </h1>
        <p className="mt-5 text-lg max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
