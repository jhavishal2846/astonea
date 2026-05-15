import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollHero from '@/components/ScrollHero'
import { StaggerReveal, Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Astonea Labs Limited — Pharma & Cosmetics Third-Party Manufacturer',
  description:
    'Partnering with you for quality manufacturing and development. 2000+ clients, 1500+ product approvals. SEBI-listed pharma and cosmetics manufacturer — Chandigarh, India.',
}

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-5xl lg:text-6xl font-bold text-ink tracking-tight">
        {value}
      </span>
      <span className="mt-1 text-sm font-medium text-ink/80">{label}</span>
      {note && <span className="mt-0.5 text-xs text-ink-subtle">{note}</span>}
    </div>
  )
}

function Capability({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-surface text-sm font-medium text-ink-muted hover:border-primary-light hover:text-primary transition-colors cursor-default">
      {label}
    </span>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── Scroll-driven multi-scene hero ──────────────────────────────── */}
      <ScrollHero />

      {/* ── Editorial block 1: Proof points ─────────────────────────────── */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-start">

            <StaggerReveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                Who We Are
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                India's trusted name in third-party manufacturing
              </h2>
              <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                Astonea Labs Limited (CIN: L24304CH2017PLC041482) is a SEBI-listed, GMP-compliant pharma and cosmetics contract manufacturer headquartered in Chandigarh. Since 2017 we have served 2,000+ brands — from emerging startups to established exporters — delivering formulation precision, regulatory confidence, and supply-chain reliability.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about-us" className="inline-flex items-center gap-1.5 text-sm font-semibold group transition-colors" style={{ color: 'var(--color-primary)' }}>
                  Our Story
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <Link href="/certifications" className="inline-flex items-center gap-1.5 text-sm font-semibold group transition-colors" style={{ color: 'var(--color-primary)' }}>
                  Certifications
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </StaggerReveal>

            <StaggerReveal className="grid grid-cols-2 gap-x-12 gap-y-10 lg:grid-cols-1 lg:gap-y-10">
              <Stat value="2,000+" label="Client Brands"      note="Across pharma & cosmetics" />
              <Stat value="1,500+" label="Product Approvals"  note="Formulations cleared" />
              <Stat value="7+"     label="Years of Excellence" note="Founded 2017" />
              <Stat value="Pan-India" label="Exporter"        note="& international reach" />
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* ── Editorial block 2: Capabilities grid ────────────────────────── */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-50)' }}>
        <div className="container-wide">

          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Capabilities
                </p>
                <h2 className="font-display text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                  End-to-end manufacturing — tailored to your brand
                </h2>
              </div>
              <Link href="/what-we-do" className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold group transition-colors" style={{ color: 'var(--color-primary)' }}>
                All Services
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: 'var(--color-border)' }}>
            {[
              { title: 'Pharma Tablets & Capsules', desc: 'Solid dosage forms: conventional, coated, enteric, extended-release. All pharmacopoeia compliant.', tag: 'Solid Dosage' },
              { title: 'Liquid Formulations',       desc: 'Syrups, suspensions, drops, and oral solutions manufactured under aseptic conditions.',          tag: 'Liquids' },
              { title: 'Creams & Ointments',        desc: 'Topical, dermal, and cosmetic formulations with controlled texture, stability, and shelf life.',  tag: 'Topical' },
              { title: 'Cosmetics Manufacturing',   desc: 'Serums, face wash, lotions, hair care, and personal-care white-label production.',                tag: 'Cosmetics' },
              { title: 'Nutraceuticals & Ayush',    desc: 'AYUSH-approved herbal, nutraceutical, and wellness formulations for modern health brands.',       tag: 'Nutraceuticals' },
              { title: 'Regulatory Affairs',        desc: 'End-to-end dossier preparation, labeling compliance, and export documentation support.',          tag: 'Regulatory' },
            ].map((card, i) => (
              <div key={i} className="group p-8 transition-colors duration-300" style={{ background: 'var(--color-surface)' }}>
                <span className="text-xs font-mono font-semibold tracking-widest uppercase" style={{ color: 'var(--color-primary-light)' }}>
                  {card.tag}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug" style={{ color: 'var(--color-ink)' }}>
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap gap-2">
              {['WHO-GMP', 'ISO 9001:2015', 'AYUSH Approved', 'FSSAI', 'cGMP', 'EU-GMP Ready', 'COPP Holder'].map((c) => (
                <Capability key={c} label={c} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── IR teaser band ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <StaggerReveal className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
                Investor Relations
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
                SEBI-listed on BSE &amp; NSE.<br />Transparent by design.
              </h2>
              <p className="mt-4 text-sm text-white/55 max-w-lg leading-relaxed">
                CIN: L24304CH2017PLC041482. Access financial results, annual reports, SEBI disclosures, and governance frameworks.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
              <Link href="/financial-results" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-sm font-bold hover:bg-slate-100 transition-colors" style={{ color: 'var(--color-primary)' }}>
                Financial Results
              </Link>
              <Link href="/annual-reports" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/30 text-white/80 text-sm font-medium hover:border-white/60 hover:text-white transition-colors">
                Annual Reports
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ── Milestones ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Journey</p>
                <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight tracking-tight" style={{ color: 'var(--color-ink)' }}>
                  Eight years of deliberate growth
                </h2>
              </div>
              <Link href="/key-milestone" className="flex-shrink-0 text-sm font-semibold transition-colors" style={{ color: 'var(--color-primary)' }}>
                Full Timeline →
              </Link>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-px hidden md:block" style={{ background: 'var(--color-border)' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { year: '2017', event: 'Incorporated in Chandigarh under CIN L24304CH2017PLC041482' },
                { year: '2019', event: 'WHO-GMP certification achieved; 500+ product approvals reached' },
                { year: '2021', event: 'Listed on BSE & NSE; expanded into cosmetics segment' },
                { year: '2024', event: '2,000+ active clients; Pan-India exporter status achieved' },
              ].map((m, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="relative pt-8 md:pt-0">
                    <div className="hidden md:block absolute -top-1.5 left-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: 'var(--color-primary)' }} />
                    <p className="font-mono text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{m.year}</p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{m.event}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Let's Build Together
            </p>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight text-balance max-w-3xl mx-auto">
              Your formulation.<br />
              Our{' '}
              <span style={{ color: 'var(--color-accent)' }}>expertise.</span>
            </h2>
            <p className="mt-6 text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Whether you're a brand owner looking for contract manufacturing, or an investor exploring a SEBI-listed pharma company — we're ready to talk.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold active:scale-95 transition-all"
                style={{ background: 'var(--color-accent)', color: 'var(--color-slate-950)' }}
              >
                Start a Conversation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/investor-insights"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border text-sm font-medium transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
              >
                Investor Insights
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
