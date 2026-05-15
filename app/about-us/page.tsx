import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Our story, values, and the people behind Astonea Labs Limited.',
}

const focusAreas = [
  {
    title: 'Innovation',
    desc: 'Advancing R&D and adopting technology-enabled manufacturing to stay ahead of industry demands.',
    icon: '◈',
  },
  {
    title: 'Quality',
    desc: 'Maintaining stringent regulatory standards and robust quality systems across every batch we produce.',
    icon: '◎',
  },
  {
    title: 'Sustainability',
    desc: 'Promoting eco-conscious and responsible manufacturing practices for a healthier planet.',
    icon: '◉',
  },
  {
    title: 'People',
    desc: 'Empowering teams through knowledge, skill development, and a culture of continuous growth.',
    icon: '◆',
  },
]

const industries = [
  {
    label: 'Pharmaceutical',
    items: ['Tablets & Capsules', 'Syrups & Liquids', 'Nutraceuticals', 'Ointments & Topicals'],
  },
  {
    label: 'Cosmetics',
    items: ['Skincare Formulations', 'Hair Care Products', 'Personal Care', 'Beauty Preparations'],
  },
]

export default function AboutUsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Our Company"
        title="Inspiring Trust in Healthcare, Elevating Beauty with Elegance"
        description="Astonea Labs Limited is a pharmaceutical and cosmetic manufacturer headquartered in Chandigarh, delivering quality, regulatory confidence, and supply-chain reliability since 2017."
        breadcrumb={[{ label: 'About Us', href: '/about-us' }]}
      />

      {/* Overview */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <StaggerReveal>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                Who We Are
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
                India's trusted name in third-party manufacturing
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                Astonea Labs Limited (CIN: L24304CH2017PLC041482) is a SEBI-listed, GMP-compliant pharma and cosmetics
                contract manufacturer headquartered in Chandigarh, India. Our manufacturing facility is located in
                Village Haripur, Tehsil Raipur Rani, District Panchkula, Haryana — within a well-connected industrial
                belt with strong logistics access.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                Since our incorporation in 2017, we have grown to serve 2,000+ brands — from emerging startups to
                established exporters — delivering formulation precision, regulatory confidence, and supply-chain
                reliability across pharmaceutical and cosmetic segments.
              </p>
            </StaggerReveal>

            <StaggerReveal className="grid grid-cols-2 gap-8">
              {[
                { value: '2,000+', label: 'Satisfied Clients', note: 'Across pharma & cosmetics' },
                { value: '1,500+', label: 'Product Approvals', note: 'Formulations cleared' },
                { value: '7+',     label: 'Years of Excellence', note: 'Founded 2017' },
                { value: 'Pan-India', label: 'Exporter', note: '& international reach' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col p-6 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--color-ink)' }}>{s.value}</span>
                  <span className="mt-1 text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{s.label}</span>
                  {s.note && <span className="mt-0.5 text-xs" style={{ color: 'var(--color-ink-subtle)' }}>{s.note}</span>}
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Founder spotlight */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                Founder & Managing Director
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-6">
                Mr. Ashish Gulati
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                A visionary leader driving the company's evolution into a global hub for pharmaceutical and cosmetic
                manufacturing. Educated at Hansraj Public School and Oxford Brookes University (Motorsport Engineering),
                Mr. Gulati combines exceptional entrepreneurial insight with strong organizational acumen to spearhead
                strategic growth and innovation.
              </p>
              <Link
                href="/leadership-panel"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: 'var(--color-primary-light)' }}
              >
                Meet the Full Team →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Our Pillars
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug tracking-tight mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              What drives everything we do
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="flex flex-col gap-4 p-8 rounded-2xl border h-full" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <span className="text-2xl" style={{ color: 'var(--color-primary)' }}>{f.icon}</span>
                  <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Industries Served
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-8 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Dual-sector expertise, one trusted partner
                </h2>
                <div className="space-y-8">
                  {industries.map((ind) => (
                    <div key={ind.label}>
                      <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                        {ind.label}
                      </h3>
                      <ul className="space-y-2">
                        {ind.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  Our Differentiators
                </p>
                {[
                  'Quality-first culture with zero-compromise manufacturing',
                  'Flexible, client-centric production solutions',
                  'In-house R&D and formulation capabilities',
                  'Dual-sector expertise in pharma and cosmetics',
                  'SEBI-listed with full governance transparency',
                  'Domestic and international export capabilities',
                ].map((d) => (
                  <div key={d} className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <StaggerReveal className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Ready to partner with us?</h2>
              <p className="mt-3 text-sm text-white/60 max-w-md">Whether you're a brand owner or an investor — we're ready to talk.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact-us" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-sm font-bold transition-colors hover:bg-slate-100" style={{ color: 'var(--color-primary)' }}>
                Get in Touch
              </Link>
              <Link href="/what-we-do" className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white/80 text-sm font-medium hover:border-white/60 hover:text-white transition-colors">
                Our Services
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>
    </div>
  )
}
