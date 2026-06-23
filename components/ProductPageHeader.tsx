'use client'

import Image from 'next/image'
import Link from '@/components/LocaleLink'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface Breadcrumb { label: string; href?: string }

interface ProductPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  variant?: 'default' | 'dark' | 'gradient'
  tag?: string
  /** Optional explicit override. If not given, an image is picked from PRODUCT_IMAGE_MAP using the current pathname. */
  image?: string
}

const DEFAULT_IMAGE = '/hero/pharma-pills.jpg'

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  '/products': '/hero/pharma-pills.jpg',
  '/products/apis': '/hero/medicine-capsules.jpg',
  '/products/intermediates': '/hero/manufacturing-2.jpg',
  '/products/pellets': '/hero/manufacturing-1.jpg',
  '/products/nutraceuticals': '/hero/medicine-capsules.jpg',
  '/products/excipients': '/hero/pharma-pills.jpg',
  '/products/herbal-extracts': '/hero/medicine-capsules.jpg',
  '/products/food-chemicals': '/hero/pharma-pills.jpg',
  '/products/dyes-and-intermediates': '/hero/manufacturing-2.jpg',
  '/products/impurities': '/hero/biotech-microscope.jpg',
  '/products/industrial-chemicals': '/hero/manufacturing-2.jpg',
  '/products/organic-inorganic': '/hero/manufacturing-1.jpg',
}

export default function ProductPageHeader({
  title,
  subtitle,
  breadcrumbs,
  variant = 'default',
  tag,
  image,
}: ProductPageHeaderProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const isDark = variant === 'dark' || variant === 'gradient'

  // Strip trailing slash from pathname for lookup
  const cleanPath = pathname?.replace(/\/$/, '') || ''
  const resolved = image ?? PRODUCT_IMAGE_MAP[cleanPath] ?? DEFAULT_IMAGE
  const showPhoto = isDark

  return (
    <section
      className="relative isolate overflow-hidden pt-32 pb-20 md:min-h-120 lg:min-h-140 xl:min-h-150 2xl:min-h-160"
      style={{
        background: isDark ? '#05060f' : 'var(--color-surface-raised)',
      }}
    >
      {showPhoto && (
        <>
          {/* Background photo */}
          <Image
            src={resolved}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />

          {/* Asymmetric glass overlay — heavier on the left where text sits */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(5,6,15,0.9) 0%, rgba(5,6,15,0.72) 40%, rgba(5,6,15,0.4) 70%, rgba(5,6,15,0.15) 100%)',
            }}
          />

          {/* Top + bottom fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,6,15,0.78) 0%, rgba(5,6,15,0) 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
            style={{
              background:
                'linear-gradient(to top, rgba(5,6,15,0.55) 0%, rgba(5,6,15,0) 100%)',
            }}
          />

          {/* Drifting amber/cyan ring accents (kept from the original) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -right-24 -top-24 w-80 h-80 rounded-full border"
              style={{ borderColor: 'rgba(232,169,0,0.10)' }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -right-8 -top-8 w-48 h-48 rounded-full border"
              style={{ borderColor: 'rgba(232,169,0,0.08)' }}
              animate={{ scale: [1.05, 0.95, 1.05] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            <motion.div
              className="absolute -left-16 bottom-0 w-56 h-56 rounded-full border"
              style={{ borderColor: 'rgba(51,149,217,0.14)' }}
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>
        </>
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
              className={`transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-ink-subtle hover:text-primary'}`}
            >
              {t('products.breadcrumb.home')}
            </Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                <svg className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-white/40' : 'text-ink-subtle'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
                {bc.href
                  ? <Link href={bc.href} className={`transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-ink-subtle hover:text-primary'}`}>{bc.label}</Link>
                  : <span className={isDark ? 'text-white/90' : 'text-ink-muted'}>{bc.label}</span>
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
          style={isDark ? { textShadow: '0 2px 18px rgba(0,0,0,0.55)' } : undefined}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.25 }}
            className={`mt-4 max-w-2xl text-lg leading-relaxed ${
              isDark ? 'text-white/80' : 'text-ink-muted'
            }`}
            style={isDark ? { textShadow: '0 1px 12px rgba(0,0,0,0.5)' } : undefined}
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
