'use client'

import Image from 'next/image'
import Link from '@/components/LocaleLink'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Magnetic from './Magnetic'
import { useCmsEditMode, useCmsMarkers, usePageText } from './PageTextProvider'

const E = [0.16, 1, 0.3, 1] as const

const HERO_TAG_DEFAULTS = ['EST. 2017', 'BSE-SME LISTED', 'WHO-GMP', 'ISO 9001:2015']

function SplitWord({ word, index, total }: { word: string; index: number; total: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative inline-block overflow-hidden align-bottom pr-[0.22em] last:pr-0">
      <motion.span
        className="inline-block"
        initial={{ y: reduce ? 0 : '108%', opacity: reduce ? 1 : 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          duration: 0.85,
          delay: reduce ? 0 : 0.3 + (index / Math.max(1, total - 1)) * 0.42,
          ease: E,
        }}
      >
        {word}
      </motion.span>
    </span>
  )
}

function SplitHeadline({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <h2
      className="font-display font-bold leading-[1.04] tracking-tight text-white text-balance"
      style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.85rem)' }}
    >
      {words.map((w, i) => (
        <SplitWord key={`${w}-${i}`} word={w} index={i} total={words.length} />
      ))}
    </h2>
  )
}

function HeroCTA({
  href,
  children,
  variant,
}: {
  href: string
  children: React.ReactNode
  variant: 'primary' | 'ghost'
}) {
  const className =
    variant === 'primary'
      ? 'group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold text-white'
      : 'inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.12]'

  const style: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'linear-gradient(120deg, var(--color-primary) 0%, #1A8FE0 100%)',
          boxShadow: '0 22px 48px -22px rgba(98,209,255,0.85)',
        }
      : {
          borderColor: 'rgba(255,255,255,0.28)',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }

  return (
    <Magnetic>
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    </Magnetic>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Resolve a `t()` lookup to a plain string. In edit mode `t()` returns a
// ReactNode-wrapped span, but the headline is split word-by-word for animation
// so we need the raw string.
function textOf(t: (key: string, fallback: string) => React.ReactNode, key: string, fallback: string): string {
  const v = t(key, fallback)
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && 'props' in v) {
    const node = v as { props: { children?: unknown } }
    if (typeof node.props.children === 'string') return node.props.children
  }
  return fallback
}

export default function ScrollHero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const t = usePageText()
  const editMode = useCmsEditMode()
  const markers = useCmsMarkers()
  const HEADLINE_DEFAULT = 'Trusted Pharmaceutical Manufacturing for Brands Ready to Scale.'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const yPrimary = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80])
  const ySecondary = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -140])
  const yAccent = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -40])
  const headlineY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 60])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.35])

  const headline = textOf(t, 'home.hero.headline', HEADLINE_DEFAULT)

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 78% 18%, rgba(98,209,255,0.18) 0%, rgba(98,209,255,0) 42%), radial-gradient(circle at 8% 92%, rgba(232,169,0,0.10) 0%, rgba(232,169,0,0) 38%), linear-gradient(180deg, #05060f 0%, #06091a 60%, #05060f 100%)',
        minHeight: 'clamp(620px, 92svh, 900px)',
      }}
      aria-label="Astonea Labs home hero"
    >
      <h1 className="sr-only">
        {t('home.hero.sr_h1', 'Astonea Labs — BSE-SME pharma and cosmetics manufacturer for 2,000+ brands.')}
      </h1>

      {/* Faint grid overlay (matches the dark Capabilities section downstream) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(98,209,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(98,209,255,0.55) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse at 55% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Noise grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
        aria-hidden="true"
      />

      {/* Top fade for navbar legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,6,15,0.78) 0%, rgba(5,6,15,0) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-20 grid h-full min-h-[inherit] grid-cols-1 items-center gap-10 py-24 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-28">
        {/* ── LEFT: editorial copy block ─────────────────────────────── */}
        <motion.div
          className="relative flex flex-col"
          style={{ y: headlineY, opacity: headlineOpacity }}
        >
          {/* kicker chip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E }}
          >
            <p className="inline-flex items-center gap-3 rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.28em] text-cyan-100/[0.88] backdrop-blur-md sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(98,209,255,0.95)]" />
              {t('home.hero.kicker', 'Inside Astonea Labs · Chandigarh')}
            </p>
          </motion.div>

          {/* chapter marker */}
          <motion.p
            className="mt-7 flex items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.32em] text-cyan-200/70"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: E }}
          >
            <span className="h-px w-10 bg-cyan-300/70" />
            {t('home.hero.chapter', '01 / Manufacturing')}
          </motion.p>

          {/* split-text headline */}
          <div
            className={`mt-4 max-w-[640px]${editMode ? ' cms-editable' : ''}`}
            {...markers('home.hero.headline', HEADLINE_DEFAULT)}
          >
            <SplitHeadline text={headline} />
          </div>

          {/* supporting paragraph */}
          <motion.p
            className="mt-6 max-w-[540px] text-[15px] leading-[1.8] sm:text-base"
            style={{ color: 'rgba(255,255,255,0.62)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.78, ease: E }}
          >
           {t(
             'home.hero.supporting',
             'WHO-GMP certified manufacturer of tablets, capsules, syrups, topical formulations, and cosmetics. Helping healthcare, nutraceutical, and personal care brands launch faster with consistent quality.',
           )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-7 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.92, ease: E }}
          >
            <HeroCTA href="/what-we-do" variant="primary">
              {t('home.hero.cta_primary', 'Explore Capabilities')}
              <ArrowIcon />
            </HeroCTA>
            <HeroCTA href="/contact-us" variant="ghost">
              {t('home.hero.cta_secondary', 'Enquire Now')}
            </HeroCTA>
          </motion.div>

          {/* divider + tag strip */}
          <motion.div
            className="mt-9 flex items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.05, ease: E }}
          >
            <span className="h-px w-12 bg-white/[0.18]" aria-hidden="true" />
            <ul
              className="flex flex-wrap items-center gap-x-3 gap-y-2"
              aria-label="Astonea certifications and listings"
            >
              {HERO_TAG_DEFAULTS.map((tag, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.26em]"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {t(`home.hero.tag_${i}`, tag)}
                  </span>
                  {i < HERO_TAG_DEFAULTS.length - 1 && (
                    <span className="h-1 w-1 rounded-full bg-white/[0.18]" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: layered image stack with parallax ────────────────── */}
        <div
          className="relative mx-auto h-[400px] w-full max-w-[520px] sm:h-[460px] lg:h-[540px] lg:max-w-none"
          aria-hidden="true"
        >
          {/* Decorative numeral */}
          <motion.div
            className="absolute -top-4 -left-2 z-0 font-display text-[8rem] font-bold leading-none tracking-tighter sm:-top-6 sm:-left-4 sm:text-[11rem] lg:-top-8 lg:-left-6 lg:text-[14rem]"
            style={{ color: 'rgba(255,255,255,0.045)', y: yAccent }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: E }}
          >
            01
          </motion.div>

          {/* Primary image card (deeper parallax) */}
          <motion.div
            className="absolute left-0 top-8 z-10 h-[78%] w-[78%] overflow-hidden rounded-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            style={{ y: yPrimary }}
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: E }}
          >
            <Image
              src="/hero/lab-scientist-microscope.jpg"
              alt="Scientist at a microscope inside the Astonea Labs analytical bench"
              fill
              priority
              sizes="(min-width: 1024px) 36vw, 80vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,6,15,0) 50%, rgba(5,6,15,0.6) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
              <span className="h-px w-8 bg-cyan-300" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100/[0.88]">
                {t('home.hero.caption_primary', 'Analytical Bench / QC Release')}
              </p>
            </div>
          </motion.div>

          {/* Secondary image card (lighter parallax + idle float) */}
          <motion.div
            className="absolute bottom-0 right-0 z-20 h-[55%] w-[58%] overflow-hidden rounded-md border border-white/[0.08] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            style={{ y: ySecondary }}
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={
              reduce
                ? { opacity: 1, scale: 1, x: 0 }
                : { opacity: 1, scale: 1, x: 0 }
            }
            transition={{ duration: 1.1, delay: 0.5, ease: E }}
          >
            <motion.div
              className="absolute inset-0"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Image
                src="/hero/lab-capsules-bottles.jpg"
                alt="Apothecary jars of capsules and tablets on a lab surface"
                fill
                sizes="(min-width: 1024px) 24vw, 55vw"
                className="object-cover"
              />
            </motion.div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,6,15,0) 55%, rgba(5,6,15,0.55) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
              <span className="h-px w-6 bg-amber-300/80" />
              <p
                className="font-mono text-[9px] font-bold uppercase tracking-[0.26em]"
                style={{ color: 'rgba(255,200,120,0.92)' }}
              >
                {t('home.hero.caption_secondary', 'Finished Dosage')}
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: E }}
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={
            reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-white/50">
            {t('home.hero.scroll_cue', 'Scroll')}
          </span>
          <span className="block h-9 w-px bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
