'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Magnetic from './Magnetic'
import TiltCard from './TiltCard'
import { usePageText } from './PageTextProvider'

const E = [0.16, 1, 0.3, 1] as [number, number, number, number]

const IMAGES = {
  digitalChip: '/hero/hero-capsule-chip.png',
  digitalPlatform: '/hero/hero-capsules-bg.png',
  capsuleTray: '/hero/manufacturing-1.jpg',
  redCapsules: '/hero/manufacturing-2.jpg',
  scientist: '/hero/lab-scientist.jpg',
  vaccinePack: '/hero/vaccine-packaging.jpg',
  // New editorial pexels imagery
  capsulesBottles: '/hero/lab-capsules-bottles.jpg',
  blueCrystals: '/hero/lab-blue-crystals.jpg',
  redAmpoules: '/hero/lab-red-ampoules.jpg',
  syringeTeal: '/hero/lab-syringe-teal.jpg',
  vialsBrown: '/hero/lab-vials-brown.jpg',
  scientistMicroscope: '/hero/lab-scientist-microscope.jpg',
  ampoulesTray: '/hero/lab-ampoules-tray.jpg',
}

const proofStats = [
  { value: 2000, suffix: '+', label: 'Client Brands', detail: 'Across pharma, wellness, and personal care.' },
  { value: 1500, suffix: '+', label: 'Product Approvals', detail: 'Formulations cleared for commercial launch.' },
  { value: 7, suffix: '+', label: 'Years of Excellence', detail: 'Manufacturing since 2017 in Chandigarh.' },
  { value: 'Pan-India', label: 'Market Reach', detail: 'Distributor and export-ready operations.' },
]

const capabilityCards = [
  {
    title: 'Pharma tablets and capsules',
    kicker: 'Solid dosage',
    desc: 'Conventional, coated, enteric, and extended-release dosage formats for dependable batch output.',
    image: IMAGES.capsulesBottles,
    href: '/what-we-do',
  },
  {
    title: 'Liquid and topical lines',
    kicker: 'Formulation breadth',
    desc: 'Syrups, suspensions, drops, creams, ointments, and gels with controlled stability and texture.',
    image: IMAGES.blueCrystals,
    href: '/manufacturing-facility',
  },
  {
    title: 'Cosmetics and personal care',
    kicker: 'Brand-ready SKUs',
    desc: 'Serums, face wash, lotions, hair care, and white-label launches built around your market position.',
    image: IMAGES.scientistMicroscope,
    href: '/what-we-do',
  },
  {
    title: 'Compliance and documentation',
    kicker: 'Regulatory support',
    desc: 'Dossiers, labels, export documentation, certificates, and release discipline handled end to end.',
    image: IMAGES.ampoulesTray,
    href: '/certifications',
  },
]

const industries = [
  {
    name: 'Pharmaceuticals',
    desc: 'Tablets, capsules, syrups, dry syrups, and topicals across acute and chronic categories.',
    image: IMAGES.capsulesBottles,
    accent: '#62D1FF',
  },
  {
    name: 'Nutraceuticals',
    desc: 'Vitamins, minerals, protein, and functional supplements built for retail and DTC launches.',
    image: IMAGES.blueCrystals,
    accent: '#7BE0B5',
  },
  {
    name: 'Cosmetics',
    desc: 'Serums, lotions, creams, face wash, and hair care formulated for sensorial brand experience.',
    image: IMAGES.ampoulesTray,
    accent: '#FFB36B',
  },
  {
    name: 'Ayurveda & Herbal',
    desc: 'AYUSH-licensed botanicals, classical formulations, and modern phyto-pharma launches.',
    image: IMAGES.redAmpoules,
    accent: '#E07A7A',
  },
  {
    name: 'Veterinary',
    desc: 'Animal health tablets, oral suspensions, and feed-grade premixes manufactured to GMP norms.',
    image: IMAGES.vialsBrown,
    accent: '#C09064',
  },
  {
    name: 'OTC & Wellness',
    desc: 'Pain relief, digestives, immunity boosters, and lifestyle SKUs ready for distribution at scale.',
    image: IMAGES.syringeTeal,
    accent: '#62D1FF',
  },
]

const labGalleryImages = [
  { src: IMAGES.scientistMicroscope, alt: 'Scientist examining a sample at the microscope', caption: 'Analytical bench, QC release' },
  { src: IMAGES.blueCrystals,        alt: 'Hands measuring blue crystalline material',        caption: 'Raw material assay' },
  { src: IMAGES.capsulesBottles,     alt: 'Two apothecary jars filled with capsules and tablets', caption: 'Finished dosage check' },
  { src: IMAGES.ampoulesTray,        alt: 'Glass ampoules arranged beside a stainless tray',   caption: 'Sterile fill line' },
  { src: IMAGES.redAmpoules,         alt: 'Ruby red glass ampoules in studio light',           caption: 'Liquid injectables' },
  { src: IMAGES.vialsBrown,          alt: 'Amber vials and syringe on a warm backdrop',        caption: 'Stability sampling' },
]

const fadeBackdrops = [
  { src: IMAGES.scientistMicroscope, label: 'Analytical Lab',  kicker: 'Chapter 01' },
  { src: IMAGES.blueCrystals,        label: 'Raw Material QC', kicker: 'Chapter 02' },
  { src: IMAGES.ampoulesTray,        label: 'Sterile Fill',    kicker: 'Chapter 03' },
  { src: IMAGES.capsulesBottles,     label: 'Finished Goods',  kicker: 'Chapter 04' },
]

const processSteps = [
  { title: 'Brief and formulation', detail: 'We shape the product spec, claims, ingredients, packaging route, and commercial target.' },
  { title: 'Pilot and validation', detail: 'Trial batches, stability checks, quality controls, and documentation tighten the formula before scale.' },
  { title: 'GMP manufacturing', detail: 'Controlled rooms, trained operators, and batch records keep production repeatable and audit-ready.' },
  { title: 'Dispatch and support', detail: 'Finished goods move with the paperwork, batch traceability, and follow-through your team needs.' },
]

const investorFacts = [
  { label: 'CIN', value: 'L24304CH2017PLC041482' },
  { label: 'Listing', value: 'BSE' },
  { label: 'Sector', value: 'Pharma and cosmetics' },
]

// Resolve a `t()` lookup to a plain string. In edit mode `t()` returns a
// ReactNode-wrapped span; for places that need the raw value (counters,
// `aria-label`, etc.) we unwrap it.
function textOf(t: (key: string, fallback: string) => React.ReactNode, key: string, fallback: string): string {
  const v = t(key, fallback)
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && 'props' in v) {
    const node = v as { props: { children?: unknown } }
    if (typeof node.props.children === 'string') return node.props.children
  }
  return fallback
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const value = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(value, to, { duration: 1.7, ease: E })
    const unsubscribe = value.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`
      }
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [inView, suffix, to, value])

  return <span ref={ref}>0{suffix}</span>
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="mb-5 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.28em]"
      style={{ color: light ? 'rgba(255,255,255,0.54)' : 'var(--color-primary)' }}
    >
      <span
        className="h-px w-8"
        style={{ background: light ? 'rgba(98,209,255,0.65)' : 'var(--color-primary)' }}
      />
      {children}
    </p>
  )
}

function ImageFrame({
  src,
  alt,
  className = '',
  objectPosition = 'center',
  sizes = '(min-width: 1024px) 45vw, 100vw',
}: {
  src: string
  alt: string
  className?: string
  objectPosition?: string
  sizes?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-[8px] bg-slate-200 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition }} />
    </div>
  )
}

function ProofSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = usePageText()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 lg:py-28"
      style={{
        background:
          'linear-gradient(180deg, var(--color-bg) 0%, #eef8ff 52%, var(--color-bg) 100%)',
      }}
    >
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <SectionLabel>{t('home.proof.label', 'Manufacturing Partner')}</SectionLabel>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-balance"
              style={{ color: 'var(--color-ink)', fontSize: 'clamp(2.45rem, 5vw, 5.4rem)' }}
            >
              {t('home.proof.heading', 'Built for brands that need science, speed, and steady supply.')}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-[1.85] sm:text-lg" style={{ color: 'var(--color-ink-muted)' }}>
              {t(
                'home.proof.description',
                'Astonea Labs Limited is a BSE-SME pharma and cosmetics manufacturer serving founders, exporters, and established labels with GMP-led production and practical launch support.',
              )}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href="/about-us"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-bold text-white"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {t('home.proof.cta_primary', 'Our Story')}
                  <ArrowIcon />
                </Link>
              </Magnetic>
              <Link
                href="/certifications"
                className="inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold"
                style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-ink-muted)', background: 'rgba(255,255,255,0.72)' }}
              >
                {t('home.proof.cta_secondary', 'Certifications')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="grid min-h-[520px] grid-cols-[0.92fr_1fr] grid-rows-[1fr_0.86fr] gap-3"
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.12, ease: E }}
            aria-label="Astonea laboratory and product imagery"
          >
            <ImageFrame
              src={IMAGES.scientist}
              alt="Scientist recording lab notes beside testing equipment"
              className="row-span-2"
              objectPosition="center"
              sizes="(min-width: 1024px) 34vw, 50vw"
            />
            <ImageFrame
              src={IMAGES.capsuleTray}
              alt="Capsule tray being prepared in a lab"
              objectPosition="center"
              sizes="(min-width: 1024px) 36vw, 50vw"
            />
            <div className="grid grid-cols-2 gap-3">
              <ImageFrame
                src={IMAGES.redCapsules}
                alt="Red capsules in blister packaging"
                sizes="(min-width: 1024px) 18vw, 25vw"
              />
              <ImageFrame
                src={IMAGES.vaccinePack}
                alt="Sterile vials being arranged for packaging"
                objectPosition="center 35%"
                sizes="(min-width: 1024px) 18vw, 25vw"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 grid overflow-hidden rounded-[8px] border md:grid-cols-4"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-border)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.22, ease: E }}
        >
          {proofStats.map((stat, i) => {
            const rawValue = textOf(t, `home.proof.stat_${i}.value`, String(stat.value))
            const suffix = textOf(t, `home.proof.stat_${i}.suffix`, stat.suffix ?? '')
            const numeric = /^-?\d+(?:\.\d+)?$/.test(rawValue.trim())
            return (
              <div key={i} className="min-h-[158px] p-6 sm:p-7" style={{ background: 'var(--color-surface)' }}>
                <p
                  className="font-display font-bold leading-none tracking-tight"
                  style={{ color: 'var(--color-ink)', fontSize: numeric ? 'clamp(2.35rem, 4vw, 4rem)' : 'clamp(2rem, 3vw, 3rem)' }}
                >
                  {numeric ? <Counter to={Number(rawValue)} suffix={suffix} /> : `${rawValue}${suffix}`}
                </p>
                <p className="mt-4 text-sm font-bold" style={{ color: 'var(--color-ink)' }}>
                  {t(`home.proof.stat_${i}.label`, stat.label)}
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  {t(`home.proof.stat_${i}.detail`, stat.detail)}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function CapabilitiesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = usePageText()

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(98,209,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(98,209,255,0.28) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <SectionLabel light>{t('home.capabilities.label', 'Capabilities')}</SectionLabel>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-white text-balance"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5.25rem)' }}
            >
              {t('home.capabilities.heading', 'One manufacturing floor. Many routes to market.')}
            </h2>
          </motion.div>
          <motion.p
            className="max-w-xl text-base leading-[1.8] lg:justify-self-end"
            style={{ color: 'rgba(255,255,255,0.58)' }}
            initial={{ opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: E }}
          >
            {t(
              'home.capabilities.subtext',
              'From formulation through packaging and paperwork, the work stays connected: facilities, lab discipline, product handling, and regulatory follow-through all move in one rhythm.',
            )}
          </motion.p>
        </div>

        <div className="grid overflow-hidden rounded-[8px] border border-white/10 md:grid-cols-2 xl:grid-cols-4">
          {capabilityCards.map((cap, index) => (
            <motion.div
              key={index}
              className="border-white/10 bg-slate-950 md:border-r xl:last:border-r-0"
              initial={{ opacity: 0, y: 34 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.16 + index * 0.08, ease: E }}
            >
              <TiltCard className="h-full" maxTilt={5}>
                <article className="group flex h-full min-h-[440px] flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={cap.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/[0.12] to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary-light)' }}>
                      {t(`home.capabilities.card_${index}.kicker`, cap.kicker)}
                    </p>
                    <h3 className="mt-5 font-display text-2xl font-semibold leading-tight text-white">
                      {t(`home.capabilities.card_${index}.title`, cap.title)}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t(`home.capabilities.card_${index}.desc`, cap.desc)}
                    </p>
                    <Link href={cap.href} className="group/link mt-7 inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-primary-light)' }}>
                      {t('home.capabilities.cta', 'Learn More')}
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IndustriesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState(0)
  const t = usePageText()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container-wide">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <SectionLabel>{t('home.industries.label', 'Industries We Serve')}</SectionLabel>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-balance"
              style={{ color: 'var(--color-ink)', fontSize: 'clamp(2.4rem, 4.8vw, 5rem)' }}
            >
              {t('home.industries.heading', 'One floor, six product worlds.')}
            </h2>
          </motion.div>
          <motion.p
            className="max-w-xl text-base leading-[1.8] lg:justify-self-end"
            style={{ color: 'var(--color-ink-muted)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: E }}
          >
            {t(
              'home.industries.subtext',
              'Pharma, nutraceutical, cosmetic, and wellness brands share the same GMP-graded production floor — separated by process, joined by the same discipline around batch records, release, and traceability.',
            )}
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          <motion.div
            className="relative overflow-hidden rounded-md border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.18, ease: E }}
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:h-full">
              {industries.map((ind, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.55, ease: E }}
                  aria-hidden={active !== i}
                >
                  <Image src={ind.image} alt={textOf(t, `home.industries.item_${i}.name`, ind.name)} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,6,15,0.05) 0%, rgba(5,6,15,0.78) 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-7 lg:p-10">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-10" style={{ background: ind.accent }} />
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.28em]" style={{ color: ind.accent }}>
                        Sector 0{i + 1}
                      </p>
                    </div>
                    <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                      {t(`home.industries.item_${i}.name`, ind.name)}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/[0.78]">
                      {t(`home.industries.item_${i}.desc`, ind.desc)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.ul
            className="grid gap-2"
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.24, ease: E }}
          >
            {industries.map((ind, i) => {
              const isActive = active === i
              return (
                <li key={i}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group relative flex w-full items-center justify-between gap-6 rounded-md border px-6 py-5 text-left transition-colors duration-300"
                    style={{
                      borderColor: isActive ? ind.accent : 'var(--color-border)',
                      background: isActive ? 'rgba(98,209,255,0.06)' : 'var(--color-surface)',
                    }}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className="font-mono text-xs font-bold transition-colors"
                        style={{ color: isActive ? ind.accent : 'var(--color-ink-subtle)' }}
                      >
                        0{i + 1}
                      </span>
                      <div>
                        <p
                          className="font-display text-xl font-semibold leading-tight transition-colors sm:text-2xl"
                          style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}
                        >
                          {t(`home.industries.item_${i}.name`, ind.name)}
                        </p>
                        <p
                          className="mt-1 max-w-md text-sm leading-relaxed transition-opacity"
                          style={{ color: 'var(--color-ink-muted)', opacity: isActive ? 1 : 0.7 }}
                        >
                          {t(`home.industries.item_${i}.desc`, ind.desc)}
                        </p>
                      </div>
                    </div>
                    <span
                      className="hidden h-px shrink-0 transition-all sm:block"
                      style={{
                        width: isActive ? 48 : 24,
                        background: isActive ? ind.accent : 'var(--color-border-strong)',
                      }}
                    />
                  </button>
                </li>
              )
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

function FadeBackdrop({
  slide,
  progress,
  index,
  total,
}: {
  slide: (typeof fadeBackdrops)[number]
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const start = index / total
  const mid = (index + 0.5) / total
  const end = (index + 1) / total
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.05), mid, Math.min(1, end + 0.05)],
    [index === 0 ? 1 : 0, 1, index === total - 1 ? 1 : 0],
  )
  const scale = useTransform(progress, [start, end], [1.08, 1])

  return (
    <motion.div className="absolute inset-0" style={{ opacity }} aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image src={slide.src} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,6,15,0.55) 0%, rgba(5,6,15,0.32) 38%, rgba(5,6,15,0.78) 100%)',
        }}
      />
    </motion.div>
  )
}

function FadeChapterText({
  slide,
  progress,
  index,
  total,
}: {
  slide: (typeof fadeBackdrops)[number]
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const start = index / total
  const mid = (index + 0.5) / total
  const end = (index + 1) / total
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.02), mid, Math.min(1, end + 0.02)],
    [0, 1, 0],
  )
  const y = useTransform(progress, [start, mid, end], [40, 0, -40])
  const t = usePageText()

  return (
    <motion.div className="absolute" style={{ opacity, y }}>
      <p className="text-[11px] font-mono font-extrabold uppercase tracking-[0.32em] text-cyan-200/80">
        {t(`home.fade.chapter_${index}.kicker`, slide.kicker)}
      </p>
      <h3
        className="mt-4 font-display font-bold leading-[1.02] tracking-tight text-white text-balance"
        style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.25rem)' }}
      >
        {t(`home.fade.chapter_${index}.label`, slide.label)}
      </h3>
    </motion.div>
  )
}

function FadeProgressBar({
  progress,
  index,
  total,
}: {
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.25, 1, 0.25])
  return <motion.span className="h-px w-12 bg-white" style={{ opacity }} />
}

function BackgroundFadeSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const total = fadeBackdrops.length

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${total * 100}svh`, background: '#05060f' }}
      aria-label="Astonea production journey"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {fadeBackdrops.map((slide, i) => (
          <FadeBackdrop key={i} slide={slide} progress={scrollYProgress} index={i} total={total} />
        ))}

        <div className="absolute inset-0 z-10 flex items-end pb-20 lg:pb-28">
          <div className="container-wide w-full">
            <div className="relative h-44 max-w-2xl sm:h-52">
              {fadeBackdrops.map((slide, i) => (
                <FadeChapterText
                  key={i}
                  slide={slide}
                  progress={scrollYProgress}
                  index={i}
                  total={total}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
              {fadeBackdrops.map((_, i) => (
                <FadeProgressBar key={i} progress={scrollYProgress} index={i} total={total} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LabGallerySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const t = usePageText()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container-wide">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <SectionLabel>{t('home.lab.label', 'Inside the Lab')}</SectionLabel>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-balance"
              style={{ color: 'var(--color-ink)', fontSize: 'clamp(2.4rem, 4.8vw, 5rem)' }}
            >
              {t('home.lab.heading', 'Where every batch earns its release.')}
            </h2>
          </motion.div>
          <motion.p
            className="max-w-xl text-base leading-[1.8] lg:justify-self-end"
            style={{ color: 'var(--color-ink-muted)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: E }}
          >
            {t(
              'home.lab.subtext',
              "Walking through the floor — from raw-material assay to sterile fill, sampling, and finished-goods checks. Quality isn't a stamp at the end, it's the discipline you can see at every station.",
            )}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
          {labGalleryImages.map((img, i) => {
            const layout = [
              'col-span-2 lg:col-span-7 aspect-[16/11]',
              'col-span-2 lg:col-span-5 aspect-[5/6]',
              'col-span-1 lg:col-span-4 aspect-[4/5]',
              'col-span-1 lg:col-span-4 aspect-[4/5]',
              'col-span-2 lg:col-span-4 aspect-[4/5]',
              'col-span-2 lg:col-span-12 aspect-[16/7]',
            ][i] ?? 'col-span-2 lg:col-span-4 aspect-[4/5]'

            return (
              <motion.figure
                key={i}
                className={`group relative overflow-hidden rounded-md ${layout}`}
                style={{ background: 'var(--color-border)' }}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: E }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                {/* base gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                {/* deepening overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* index marker */}
                <span
                  className="absolute left-4 top-4 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/60 transition-colors duration-500 group-hover:text-cyan-300/90 sm:left-5 sm:top-5"
                >
                  {String(i + 1).padStart(2, '0')} / 06
                </span>
                {/* caption row */}
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                  <div className="overflow-hidden">
                    <span className="block h-px w-8 origin-left bg-cyan-300/80 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                    <p className="mt-2 text-sm font-semibold text-white transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                      {t(`home.lab.caption_${i}`, img.caption)}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/[0.08] text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function QualitySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = usePageText()
  const badgeDefaults = ['WHO-GMP', 'ISO 9001:2015', 'AYUSH', 'FSSAI']

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-36" style={{ background: '#07101f' }}>
      <Image
        src={IMAGES.digitalPlatform}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.42]"
        style={{ objectPosition: 'center' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,16,31,0.96) 0%, rgba(7,16,31,0.84) 46%, rgba(7,16,31,0.72) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <SectionLabel light>{t('home.quality.label', 'Quality System')}</SectionLabel>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-white text-balance"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 5.1rem)' }}
            >
              {t('home.quality.heading', 'Digital ambition with GMP discipline underneath.')}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-[1.85]" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {t(
                'home.quality.subtext',
                'Clean-room proof meets forward-looking biotech systems, helping each product move from idea to validated output with control.',
              )}
            </p>
            <div className="mt-9 grid max-w-md grid-cols-2 gap-3">
              {badgeDefaults.map((badge, i) => (
                <div key={i} className="rounded-[8px] border border-white/10 px-4 py-3 text-sm font-bold text-white" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  {t(`home.quality.badge_${i}`, badge)}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="overflow-hidden rounded-[8px] border border-white/[0.12]"
            style={{ background: 'rgba(5,6,15,0.46)' }}
            initial={{ opacity: 0, x: 34 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: E }}
          >
            <div className="relative h-64 sm:h-80">
              <Image src={IMAGES.digitalChip} alt="Digital capsule over connected circuit paths" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.86] to-transparent" />
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {processSteps.map((step, index) => (
                <div key={index} className="p-6" style={{ background: 'rgba(5,6,15,0.72)' }}>
                  <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-accent)' }}>
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-white">
                    {t(`home.process.step_${index}.title`, step.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                    {t(`home.process.step_${index}.detail`, step.detail)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function InvestorSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = usePageText()

  return (
    <section ref={ref} className="py-20 lg:py-28" style={{ background: 'var(--color-primary)' }}>
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: E }}
          >
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.28em]" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {t('home.investor.label', 'Investor Relations')}
            </p>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-white text-balance"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)' }}
            >
              {t('home.investor.heading', 'Listed, documented, and easy to evaluate.')}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.8]" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {t(
                'home.investor.subtext',
                'Financial results, annual reports, SEBI disclosures, and governance documents stay accessible for shareholders and market watchers.',
              )}
            </p>
          </motion.div>

          <motion.div
            className="overflow-hidden rounded-[8px] border border-white/[0.16]"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.12, ease: E }}
          >
            <div className="grid gap-px bg-white/[0.12]">
              {investorFacts.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-5 p-5 sm:p-6"
                  style={{ background: 'rgba(0,80,145,0.35)' }}
                >
                  <p className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.24em]" style={{ color: 'rgba(255,255,255,0.54)' }}>
                    {t(`home.investor.fact_${i}.label`, fact.label)}
                  </p>
                  <p className="text-right text-sm font-bold leading-snug text-white break-all sm:text-base">
                    {t(`home.investor.fact_${i}.value`, fact.value)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 p-5">
              <Magnetic>
                <Link href="/financial-results" className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                  {t('home.investor.cta_primary', 'Financial Results')}
                  <ArrowIcon />
                </Link>
              </Magnetic>
              <Link href="/annual-reports" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.28] px-5 text-sm font-semibold text-white/[0.78] hover:text-white">
                {t('home.investor.cta_secondary', 'Annual Reports')}
              </Link>
              <Link href="/sebi-lodr-regulation-46-disclosures" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.28] px-5 text-sm font-semibold text-white/[0.78] hover:text-white">
                {t('home.investor.cta_tertiary', 'SEBI Disclosures')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const t = usePageText()

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-36" style={{ background: 'var(--color-slate-950)' }}>
      <Image
        src={IMAGES.scientistMicroscope}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-60"
        style={{ objectPosition: 'center 30%' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,6,15,0.9) 0%, rgba(5,6,15,0.7) 38%, rgba(5,6,15,0.35) 75%, rgba(5,6,15,0.55) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: E }}
        >
          <p className="mb-6 text-[11px] font-extrabold uppercase tracking-[0.28em]" style={{ color: 'var(--color-accent)' }}>
            {t('home.cta.label', 'Start With Astonea')}
          </p>
          <h2
            className="font-display font-bold leading-[1.04] tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.75rem)' }}
          >
            {t('home.cta.heading', 'Your formulation deserves a sharper manufacturing partner.')}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-[1.85] sm:text-lg" style={{ color: 'rgba(255,255,255,0.62)' }}>
            {t(
              'home.cta.subtext',
              'Share the product you want to build, the market you want to enter, and the timeline you are working toward. We will help shape the route from formulation to dispatch.',
            )}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <Link
                href="/contact-us"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-bold"
                style={{ background: 'var(--color-accent)', color: 'var(--color-slate-950)' }}
              >
                {t('home.cta.primary', 'Start a Conversation')}
                <ArrowIcon />
              </Link>
            </Magnetic>
            <Link
              href="/manufacturing-facility"
              className="inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold"
              style={{ borderColor: 'rgba(255,255,255,0.24)', color: 'rgba(255,255,255,0.78)' }}
            >
              {t('home.cta.secondary', 'View Facility')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomeContent() {
  return (
    <>
      <ProofSection />
      <CapabilitiesSection />
      <IndustriesSection />
      <BackgroundFadeSection />
      <LabGallerySection />
      <QualitySection />
      <InvestorSection />
      <CTASection />
    </>
  )
}
