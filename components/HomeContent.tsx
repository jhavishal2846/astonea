'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, animate } from 'framer-motion'

const E = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ─── Animated number ──────────────────────────────────────────────────────── */

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const val = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(val, to, { duration: 1.9, ease: [0.16, 1, 0.3, 1] })
    const unsub = val.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix
    })
    return () => { ctrl.stop(); unsub() }
  }, [inView, to, suffix, val])

  return <span ref={ref}>0{suffix}</span>
}

/* ─── Infinite marquee ─────────────────────────────────────────────────────── */

const BADGES = [
  'WHO-GMP', 'ISO 9001:2015', 'AYUSH Approved', 'FSSAI Licensed',
  'cGMP Compliant', 'EU-GMP Ready', 'COPP Holder', 'GMP Certified',
]

function Marquee() {
  const items = [...BADGES, ...BADGES]
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <motion.div
        className="flex items-center gap-12"
        style={{ width: 'max-content' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
      >
        {items.map((b, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span
              className="text-[11px] font-extrabold uppercase tracking-[0.22em]"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {b}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: 8 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SECTION 1 — WHO WE ARE                                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

const stats = [
  { to: 2000, suffix: '+', label: 'Client Brands',       sub: 'Pharma & cosmetics'   },
  { to: 1500, suffix: '+', label: 'Product Approvals',    sub: 'Formulations cleared' },
  { to: 7,    suffix: '+', label: 'Years of Excellence',  sub: 'Since 2017'           },
]

function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-28 lg:py-44" style={{ background: 'var(--color-bg)' }}>
      <div className="container-wide">

        {/* ── Headline grid ── */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-end">

          <motion.div
            initial={{ opacity: 0, y: 52 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, ease: E }}
          >
            <span
              className="block text-[11px] font-extrabold uppercase tracking-[0.28em] mb-9"
              style={{ color: 'var(--color-primary)' }}
            >
              Who We Are
            </span>
            <h2
              className="font-display font-bold leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 5.2vw, 5.5rem)', color: 'var(--color-ink)' }}
            >
              India&apos;s most trusted<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>
                third-party
              </em><br />
              manufacturer.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 52 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, delay: 0.18, ease: E }}
            className="flex flex-col justify-end pb-1"
          >
            <p
              className="text-lg leading-[1.85] mb-10"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              Astonea Labs Limited (CIN: L24304CH2017PLC041482) is a SEBI-listed,
              GMP-compliant pharma and cosmetics contract manufacturer headquartered
              in Chandigarh. Since 2017 we have served 2,000+ brands — from emerging
              startups to established exporters — delivering formulation precision,
              regulatory confidence, and supply-chain reliability.
            </p>
            <div className="flex flex-wrap gap-8">
              {[
                { label: 'Our Story',       href: '/about-us'        },
                { label: 'Certifications',  href: '/certifications'  },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group inline-flex items-center gap-2.5 text-sm font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {l.label}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Ruled divider ── */}
        <div className="overflow-hidden my-20">
          <motion.div
            className="h-px w-full"
            style={{ background: 'var(--color-border)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: E }}
          />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.42 + i * 0.11, ease: E }}
            >
              <div
                className="font-display font-bold tracking-tight leading-none mb-3"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 4.25rem)', color: 'var(--color-ink)' }}
              >
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-ink)' }}>{s.label}</p>
              <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>{s.sub}</p>
            </motion.div>
          ))}

          {/* Pan-India — static */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.75, ease: E }}
          >
            <div
              className="font-display font-bold tracking-tight leading-none mb-3"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.85rem)', color: 'var(--color-ink)' }}
            >
              Pan-India
            </div>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-ink)' }}>Exporter</p>
            <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>&amp; international reach</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SECTION 2 — CAPABILITIES                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

const capabilities = [
  { tag: 'Solid Dosage',   title: 'Pharma Tablets & Capsules', desc: 'Conventional, coated, enteric, and extended-release. All pharmacopoeia compliant.' },
  { tag: 'Liquids',        title: 'Liquid Formulations',        desc: 'Syrups, suspensions, drops, and oral solutions manufactured under aseptic conditions.' },
  { tag: 'Topical',        title: 'Creams & Ointments',         desc: 'Topical and dermal formulations with controlled texture, stability, and shelf life.' },
  { tag: 'Cosmetics',      title: 'Cosmetics Manufacturing',     desc: 'Serums, face wash, lotions, hair care, and personal-care white-label production.' },
  { tag: 'Nutraceuticals', title: 'Nutraceuticals & Ayush',     desc: 'AYUSH-approved herbal and wellness formulations for modern health brands.' },
  { tag: 'Regulatory',     title: 'Regulatory Affairs',          desc: 'End-to-end dossier preparation, labeling compliance, and export documentation.' },
]

function CapabilityCard({ cap, i }: { cap: (typeof capabilities)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.07, ease: E }}
      className="group relative flex flex-col p-8 lg:p-10 cursor-default"
      style={{ background: 'var(--color-slate-950)' }}
    >
      {/* Blue hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'rgba(0,114,206,0.07)', boxShadow: 'inset 1px 0 0 rgba(0,114,206,0.25)' }}
      />

      <span
        className="block text-[10px] font-extrabold uppercase tracking-[0.24em] mb-6"
        style={{ color: 'var(--color-primary-light)' }}
      >
        {cap.tag}
      </span>
      <h3
        className="font-display text-xl font-semibold text-white leading-snug mb-4 flex-1"
      >
        {cap.title}
      </h3>
      <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.36)' }}>
        {cap.desc}
      </p>
      <div
        className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
        style={{ color: 'var(--color-primary-light)' }}
      >
        Learn more →
      </div>
    </motion.div>
  )
}

function CapabilitiesSection() {
  const headRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headRef, { once: true, margin: '-80px' })

  return (
    <section style={{ background: 'var(--color-slate-950)' }} className="py-28 lg:py-44">
      <div className="container-wide">

        {/* ── Header ── */}
        <div
          ref={headRef}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: E }}
          >
            <span
              className="block text-[11px] font-extrabold uppercase tracking-[0.28em] mb-7"
              style={{ color: 'var(--color-primary-light)' }}
            >
              Capabilities
            </span>
            <h2
              className="font-display font-bold leading-[1.04] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.2vw, 4.25rem)' }}
            >
              End-to-end manufacturing —<br />
              <em className="italic" style={{ color: 'var(--color-primary-light)' }}>
                tailored to your brand.
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <Link
              href="/what-we-do"
              className="group inline-flex items-center gap-2.5 text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              All Services
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </motion.div>
        </div>

        {/* ── Marquee ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="py-5 border-y mb-2"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Marquee />
        </motion.div>

        {/* ── Grid — gap-px with parent bg creates hair-line separators ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SECTION 3 — INVESTOR RELATIONS                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

function IRSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 lg:py-36"
      style={{ background: 'var(--color-primary)' }}
    >
      {/* Decorative watermark */}
      <div
        className="absolute select-none pointer-events-none font-display font-bold leading-none text-white"
        style={{
          fontSize: 'clamp(7rem, 22vw, 20rem)',
          opacity: 0.055,
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        NSE
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-14 lg:gap-20 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: E }}
          >
            <span
              className="block text-[11px] font-extrabold uppercase tracking-[0.28em] mb-7"
              style={{ color: 'rgba(255,255,255,0.42)' }}
            >
              Investor Relations
            </span>
            <h2
              className="font-display font-bold leading-[1.04] text-white mb-7"
              style={{ fontSize: 'clamp(2.2rem, 4.2vw, 4.5rem)' }}
            >
              SEBI-listed on<br />
              BSE &amp; NSE.<br />
              <span style={{ opacity: 0.7 }}>Transparent by design.</span>
            </h2>
            <p
              className="text-sm leading-relaxed mb-10 max-w-md"
              style={{ color: 'rgba(255,255,255,0.48)' }}
            >
              CIN: L24304CH2017PLC041482. Access financial results, annual reports,
              SEBI disclosures, and corporate governance frameworks in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/financial-results"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-sm font-bold transition-colors hover:bg-slate-50"
                style={{ color: 'var(--color-primary)' }}
              >
                Financial Results
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/annual-reports"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/25 text-white/70 text-sm font-medium transition-colors hover:border-white/55 hover:text-white"
              >
                Annual Reports
              </Link>
            </div>
          </motion.div>

          {/* Key fact tiles */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: E }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { label: 'Listed Since', value: '2021' },
              { label: 'Exchanges',    value: 'BSE · NSE' },
              { label: 'Sector',       value: 'Pharma & Cosmetics' },
              { label: 'Incorporated', value: 'Chandigarh, IN' },
            ].map((f) => (
              <div
                key={f.label}
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.11)' }}
              >
                <p
                  className="text-[9px] font-extrabold uppercase tracking-[0.22em] mb-2"
                  style={{ color: 'rgba(255,255,255,0.38)' }}
                >
                  {f.label}
                </p>
                <p className="text-sm font-bold text-white leading-snug">{f.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SECTION 4 — MILESTONES                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

const milestones = [
  { year: '2017', title: 'Incorporation',   detail: 'Founded in Chandigarh under CIN L24304CH2017PLC041482 — a focused pharma & cosmetics manufacturer.' },
  { year: '2019', title: 'GMP Certified',   detail: 'Achieved WHO-GMP certification and surpassed 500 product approvals, cementing formulation credibility.' },
  { year: '2021', title: 'Exchange Listed', detail: 'Dual-listed on BSE & NSE; expanded the portfolio into the high-growth cosmetics segment.' },
  { year: '2024', title: 'Pan-India Scale', detail: 'Crossed 2,000 active client brands and achieved Pan-India exporter status with international reach.' },
]

function MilestoneRow({ m, i }: { m: (typeof milestones)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: i * 0.1, ease: E }}
      className="group grid grid-cols-[96px_1fr] lg:grid-cols-[160px_auto_1fr] gap-x-6 lg:gap-x-12 items-start py-9 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Year */}
      <span
        className="font-mono text-3xl lg:text-4xl font-bold tabular-nums pt-0.5 transition-colors duration-500"
        style={{ color: 'var(--color-ink-subtle)' }}
      >
        {m.year}
      </span>

      {/* Title — hidden on mobile, visible lg */}
      <span
        className="hidden lg:block text-xs font-extrabold uppercase tracking-[0.2em] pt-2.5 whitespace-nowrap"
        style={{ color: 'var(--color-ink-subtle)', minWidth: '9rem' }}
      >
        {m.title}
      </span>

      {/* Detail */}
      <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
        <span className="lg:hidden font-bold mr-2" style={{ color: 'var(--color-ink)' }}>{m.title} —</span>
        {m.detail}
      </p>
    </motion.div>
  )
}

function MilestonesSection() {
  const headRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headRef, { once: true, margin: '-80px' })

  return (
    <section className="py-28 lg:py-44" style={{ background: 'var(--color-bg)' }}>
      <div className="container-wide">

        {/* ── Header ── */}
        <div ref={headRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: E }}
          >
            <span
              className="block text-[11px] font-extrabold uppercase tracking-[0.28em] mb-7"
              style={{ color: 'var(--color-primary)' }}
            >
              Our Journey
            </span>
            <h2
              className="font-display font-bold leading-[1.04] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4.25rem)', color: 'var(--color-ink)' }}
            >
              Eight years of<br />deliberate growth.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.32 }}
          >
            <Link
              href="/key-milestone"
              className="group inline-flex items-center gap-2 text-sm font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              Full Timeline
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Top rule */}
        <div className="overflow-hidden mb-0">
          <motion.div
            className="h-px w-full"
            style={{ background: 'var(--color-border)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: E }}
          />
        </div>

        {milestones.map((m, i) => (
          <MilestoneRow key={m.year} m={m} i={i} />
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SECTION 5 — FINAL CTA                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

function CTASection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-40 lg:py-56"
      style={{ background: 'var(--color-slate-950)' }}
    >
      {/* Radial glow — centred slightly low */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 68%, rgba(0,114,206,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Top rule */}
      <div className="overflow-hidden absolute top-0 inset-x-0">
        <motion.div
          className="h-px w-full"
          style={{ background: 'rgba(255,255,255,0.07)', transformOrigin: 'center' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.8, ease: E }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 52 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.95, ease: E }}
          >
            <span
              className="block text-[11px] font-extrabold uppercase tracking-[0.3em] mb-10"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Let&apos;s Build Together
            </span>

            <h2
              className="font-display font-bold leading-[1.02] tracking-tight text-white"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
            >
              Your formulation.<br />
              <em
                className="italic"
                style={{ color: 'var(--color-accent)' }}
              >
                Our expertise.
              </em>
            </h2>

            <p
              className="mt-8 text-lg leading-relaxed mx-auto"
              style={{ color: 'rgba(255,255,255,0.36)', maxWidth: '42ch' }}
            >
              Whether you&apos;re a brand owner seeking contract manufacturing
              or an investor exploring a SEBI-listed pharma company — we&apos;re ready to talk.
            </p>

            <div className="mt-14 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact-us"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-sm font-bold transition-all active:scale-95"
                style={{ background: 'var(--color-accent)', color: 'var(--color-slate-950)' }}
              >
                Start a Conversation
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
              <Link
                href="/investor-insights"
                className="inline-flex items-center justify-center px-9 py-4 rounded-full border text-sm font-medium transition-colors hover:border-white/35 hover:text-white/85"
                style={{ borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.45)' }}
              >
                Investor Insights
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Root export                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function HomeContent() {
  return (
    <>
      <AboutSection />
      <CapabilitiesSection />
      <IRSection />
      <MilestonesSection />
      <CTASection />
    </>
  )
}
