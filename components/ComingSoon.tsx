import Link from 'next/link'
import { Reveal } from './StaggerReveal'

interface ComingSoonProps {
  title: string
  description: string
  tier?: 1 | 2 | 3 | 4
  breadcrumb?: { label: string; href: string }[]
}

export default function ComingSoon({ title, description, tier = 2, breadcrumb }: ComingSoonProps) {
  const tierLabel =
    tier === 1 ? 'Frame-sequence hero page'
    : tier === 2 ? 'Editorial page'
    : tier === 3 ? 'Document / IR page'
    : 'Utility page'

  return (
    <div className="flex-1 flex flex-col">
      {/* Page header */}
      <div className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b" style={{ background: 'var(--color-slate-950)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container-wide">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
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
          )}
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
            {tierLabel}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl text-balance">
            {title}
          </h1>
          <p className="mt-5 text-lg max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Body placeholder */}
      <div className="flex-1 py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-lg mx-auto text-center">
              {/* Wireframe placeholder */}
              <div className="relative rounded-2xl border-2 border-dashed p-16 mb-10" style={{ borderColor: 'var(--color-border)' }}>
                <div className="space-y-3 mb-6">
                  {[100, 85, 70, 90, 55].map((w, i) => (
                    <div key={i} className="h-3 rounded-full mx-auto" style={{ width: `${w}%`, background: 'var(--color-slate-100)' }} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-20 rounded-xl" style={{ background: 'var(--color-slate-100)' }} />
                  ))}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-semibold" style={{ background: 'var(--color-surface)', color: 'var(--color-ink-subtle)', border: '1px solid var(--color-border)' }}>
                  Content coming soon
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-ink-muted)' }}>
                This page is currently being built. The full content, data tables, and interactive elements will be available shortly.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors" style={{ background: 'var(--color-primary)', color: 'white' }}>
                  ← Back to Home
                </Link>
                <Link href="/contact-us" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-colors" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
