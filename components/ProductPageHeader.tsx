'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Breadcrumb { label: string; href?: string }

interface ProductPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  variant?: 'default' | 'dark' | 'gradient'
  tag?: string
}

export default function ProductPageHeader({
  title,
  subtitle,
  breadcrumbs,
  variant = 'default',
  tag,
}: ProductPageHeaderProps) {
  const isDark = variant === 'dark' || variant === 'gradient'

  return (
    <section
      className="relative overflow-hidden pt-32 pb-20"
      style={{
        background: isDark ? 'var(--color-slate-950)' : 'var(--color-surface-raised)',
      }}
    >
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -right-24 -top-24 w-80 h-80 rounded-full border"
            style={{ borderColor: 'rgba(232,169,0,0.08)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-8 -top-8 w-48 h-48 rounded-full border"
            style={{ borderColor: 'rgba(232,169,0,0.06)' }}
            animate={{ scale: [1.05, 0.95, 1.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute -left-16 bottom-0 w-56 h-56 rounded-full border"
            style={{ borderColor: 'rgba(51,149,217,0.10)' }}
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
      )}

      <div className="container-wide relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-5 flex items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className={`transition-colors ${isDark ? 'text-white/50 hover:text-white/80' : 'text-ink-subtle hover:text-primary'}`}
            >
              Home
            </Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? 'text-white/30' : 'text-ink-subtle'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
                {bc.href
                  ? <Link href={bc.href} className={`transition-colors ${isDark ? 'text-white/50 hover:text-white/80' : 'text-ink-subtle hover:text-primary'}`}>{bc.label}</Link>
                  : <span className={isDark ? 'text-white/80' : 'text-ink-muted'}>{bc.label}</span>
                }
              </span>
            ))}
          </motion.nav>
        )}

        {tag && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-accent/10 border border-accent/20 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {tag}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 }}
          className={`font-display font-bold text-balance leading-tight ${
            isDark ? 'text-white' : 'text-ink'
          } text-4xl md:text-5xl lg:text-6xl`}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
            className={`mt-4 max-w-2xl text-lg leading-relaxed ${
              isDark ? 'text-white/70' : 'text-ink-muted'
            }`}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.35 }}
          className={`mt-8 h-1 w-16 rounded-full origin-left ${isDark ? 'bg-accent' : 'bg-primary'}`}
        />
      </div>
    </section>
  )
}
