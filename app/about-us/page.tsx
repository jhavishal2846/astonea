import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Our story, values, and the people behind Astonea Labs Limited.',
}

const trustMetrics = [
  { value: '3,200+', label: 'Brands Served', sub: 'Pharma & cosmetics' },
  { value: '2,500+', label: 'Product Approvals', sub: 'Formulations cleared' },
  { value: '9+', label: 'Years of Excellence', sub: 'Founded 2017' },
  { value: 'Pan-India', label: 'Export Reach', sub: '& international' },
]

const certifications = [
  { code: 'GMP', label: 'Good Manufacturing Practice', desc: 'WHO-GMP compliant facility' },
  { code: 'BSE-SME', label: 'Listed Company', desc: 'CIN: L24304CH2017PLC041482' },
  { code: 'ISO', label: 'Quality Systems', desc: 'Documented quality standards' },
  { code: 'FSSAI', label: 'Food Safety', desc: 'Nutraceuticals approved' },
]

const pillars = [
  {
    num: '01',
    title: 'Innovation',
    desc: 'Advancing R&D and technology-enabled manufacturing to stay ahead of industry demands.',
  },
  {
    num: '02',
    title: 'Quality',
    desc: 'Stringent regulatory standards and robust quality systems across every batch we produce.',
  },
  {
    num: '03',
    title: 'Sustainability',
    desc: 'Eco-conscious and responsible manufacturing practices for a healthier planet.',
  },
  {
    num: '04',
    title: 'People',
    desc: 'Empowering teams through knowledge, skill development, and a culture of growth.',
  },
]

const pharmaItems = ['Tablets & Capsules', 'Syrups & Liquids', 'Nutraceuticals', 'Ointments & Topicals']
const cosmeticsItems = ['Skincare Formulations', 'Hair Care Products', 'Personal Care', 'Beauty Preparations']

const pathCards = [
  {
    role: 'Brand Owner',
    desc: 'Launch or scale your pharma or cosmetic brand with a fully compliant, GMP-certified manufacturing partner.',
    href: '/what-we-do',
    cta: 'See Manufacturing Services',
  },
  {
    role: 'Startup / New Entrant',
    desc: 'Enter the pharma or cosmetics market without building your own facility — from formulation to delivery.',
    href: '/contact-us',
    cta: 'Start a Conversation',
  },
  {
    role: 'Investor',
    desc: 'Explore our BSE-SME  disclosures, financial reports, and governance structure.',
    href: '/investor-relations',
    cta: 'Investor Relations',
  },
]

export default function AboutUsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Our Company"
        title="Inspiring Trust in Healthcare, Elevating Beauty with Elegance"
        description="Astonea Labs Limited is a GMP-certified, BSE-SME listed pharmaceutical and cosmetic contract manufacturer headquartered in Chandigarh — delivering quality, regulatory confidence, and supply-chain reliability since 2017."
        breadcrumb={[{ label: 'About Us', href: '/about-us' }]}
      />

      {/* Trust metrics bar — "Enterprise Gateway" pattern: authority numbers front and centre */}
      <section style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {trustMetrics.map((m, i) => {
              const borderClass = [
                'border-r border-b lg:border-b-0 border-white/20',
                'border-b lg:border-b-0 lg:border-r border-white/20',
                'border-r border-white/20',
                '',
              ][i]
              return (
                <div key={m.label} className={`flex flex-col items-center py-10 px-6 text-center ${borderClass}`}>
                  <span className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">{m.value}</span>
                  <span className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-white">{m.label}</span>
                  <span className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>{m.sub}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editorial identity — large mission statement */}
      <section
        className="py-28 lg:py-40 relative overflow-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,114,206,0.06) 0%, transparent 68%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary)' }}>
                Who We Are
              </p>
              <h2 className="font-display text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                India's trusted name in third-party pharmaceutical &amp; cosmetic manufacturing
              </h2>
              <div className="mt-8 mx-auto w-12 h-0.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              <p className="mt-8 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-ink-muted)' }}>
                From a single facility in Haryana to serving over 3,200 brands across India and abroad — we have
                grown by keeping one principle constant: that quality is not a department, it is the entire operation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certifications — "Trust & Authority" style: badges prominently displayed, not buried in text */}
      <section className="py-16 border-t border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-center mb-10" style={{ color: 'var(--color-ink-subtle)' }}>
              Regulatory &amp; Compliance Credentials
            </p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((c, i) => (
              <Reveal key={c.code} delay={i * 60}>
                <div
                  className="flex flex-col items-center text-center gap-3 px-6 py-8 rounded-2xl border transition-shadow hover:shadow-md"
                  style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm tracking-wider flex-shrink-0"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {c.code}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{c.label}</p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Company identity — foundation facts */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <StaggerReveal>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                Our Foundation
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                GMP-compliant, BSE-SME , and built for scale
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                Astonea Labs Limited is incorporated in Chandigarh with our manufacturing facility in Village
                Haripur, Tehsil Raipur Rani, District Panchkula, Haryana — within a well-connected industrial
                belt with strong logistics access across North India.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                Since 2017, we have grown to serve emerging startups, established domestic brands, and
                international exporters — delivering formulation precision, regulatory confidence, and
                supply-chain reliability across pharmaceutical and cosmetic segments.
              </p>
            </StaggerReveal>

            <StaggerReveal className="space-y-4">
              {[
                { label: 'Incorporation', value: '11-04-2017 — Chandigarh, India' },
                { label: 'CIN', value: 'L24304CH2017PLC041482' },
                { label: 'Facility', value: 'Village Haripur, Panchkula, Haryana' },
                { label: 'Compliance', value: 'WHO-GMP Certified' },
                { label: 'Market Status', value: 'BSE-SME Limitied Company' },
                { label: 'Segments', value: 'Pharmaceutical & Cosmetics' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-6 py-4 border-b last:border-b-0"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest flex-shrink-0 pt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>
                    {row.label}
                  </span>
                  <span className="text-sm font-medium text-right" style={{ color: 'var(--color-ink)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Path selection — "Enterprise Gateway" pattern: I am a... */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <Reveal>
            <div className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>
                Who Are You?
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug text-balance">
                Find your path with Astonea Labs
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-5">
            {pathCards.map((card, i) => (
              <Reveal key={card.role} delay={i * 80}>
                <Link
                  href={card.href}
                  className="group flex flex-col gap-5 p-8 rounded-2xl border h-full transition-all duration-200 cursor-pointer hover:border-white/30"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary-light)' }}
                  >
                    I am a
                  </p>
                  <h3 className="font-display text-xl font-bold text-white leading-snug">{card.role}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {card.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3" style={{ color: 'var(--color-primary-light)' }}>
                    {card.cta}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder spotlight */}
      <section className="py-24 lg:py-36" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-20 items-start">
            <Reveal className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary)' }}>
                Founder &amp; Managing Director
              </p>
              <blockquote
                className="font-display text-2xl lg:text-3xl font-semibold leading-snug mb-8 text-balance"
                style={{
                  color: 'var(--color-ink)',
                  borderLeft: '3px solid var(--color-primary)',
                  paddingLeft: '1.5rem',
                }}
              >
                "Our commitment is not to manufacture products — it is to manufacture trust, batch after batch,
                for every brand that puts their name on what we make."
              </blockquote>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-base font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden="true"
                >
                  AG
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>Mr. Ashish Gulati</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>
                    Founder &amp; Managing Director, Astonea Labs Limited
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-2">
              <div
                className="space-y-5 pl-0 lg:pl-8 lg:border-l"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  A visionary entrepreneur driving the company's evolution into a global hub for pharmaceutical
                  and cosmetic manufacturing. Educated at Hansraj Public School and Oxford Brookes University
                  (Motorsport Engineering), Mr. Gulati combines exceptional business acumen with strong
                  organisational leadership.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  Under his direction, Astonea Labs became BSE-SME  and has expanded its client base across
                  India's most competitive pharmaceutical and cosmetic markets.
                </p>
                <Link
                  href="/leadership-panel"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:gap-3"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Meet the Full Leadership Team
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Our Pillars
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                  What drives everything we do
                </h2>
              </div>
              <p className="text-sm max-w-xs leading-relaxed lg:text-right" style={{ color: 'var(--color-ink-muted)' }}>
                Four non-negotiable commitments informing every decision from factory floor to client delivery.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--color-border)' }}>
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div
                  className="flex flex-col gap-6 p-8 h-full"
                  style={{ background: 'var(--color-surface)' }}
                >
                  <span
                    className="font-display text-5xl font-bold tracking-tighter leading-none select-none"
                    style={{ color: 'var(--color-primary-light)' }}
                  >
                    {p.num}
                  </span>
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries & Differentiators */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>
              Sectors We Serve
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-16 text-balance">
              Dual-sector expertise, one trusted partner
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="grid sm:grid-cols-2 gap-8">
              <Reveal>
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    Pharmaceutical
                  </span>
                  <ul className="space-y-3">
                    {pharmaItems.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-primary-light)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.18)' }}
                  >
                    Cosmetics
                  </span>
                  <ul className="space-y-3">
                    {cosmeticsItems.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div
                className="rounded-2xl p-8 lg:p-10 border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary-light)' }}>
                  Why Clients Choose Us
                </p>
                <ul className="space-y-4">
                  {[
                    'Quality-first culture with zero-compromise manufacturing',
                    'Flexible, client-centric production solutions',
                    'In-house R&D and formulation capabilities',
                    'Dual-sector expertise in pharma and cosmetics',
                    'BSE-SME  with full governance transparency',
                    'Domestic and international export capabilities',
                  ].map((d) => (
                    <li key={d} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                        style={{ color: 'var(--color-primary-light)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <StaggerReveal className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug">
                Ready to bring your product to market?
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
                Whether you're a brand owner, a startup entering pharma, or an investor — we're ready to build
                something together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-sm font-bold transition-colors hover:bg-slate-100 cursor-pointer"
                style={{ color: 'var(--color-primary)' }}
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/what-we-do"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-medium hover:border-white/60 transition-colors cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                Our Services
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>
    </div>
  )
}
