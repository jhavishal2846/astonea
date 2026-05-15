import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Vision & Mission',
  description: 'Our vision and mission — building sustainable brands with global reach.',
}

const values = [
  { title: 'Global Ambition', desc: 'We pursue international markets through both our own brand portfolio and as a preferred supplier to global partners.' },
  { title: 'Sustainability', desc: 'Every brand we build and every partnership we form is designed for long-term, sustainable impact.' },
  { title: 'Scientific Excellence', desc: 'Our portfolio is backed by rigorous R&D, GMP compliance, and formulation expertise spanning pharma and cosmetics.' },
  { title: 'Consumer Impact', desc: 'We connect with global consumers through products that genuinely improve wellbeing and inspire confidence.' },
  { title: 'Integrity', desc: 'Transparent governance, regulatory compliance, and ethical manufacturing are non-negotiable at Astonea.' },
  { title: 'Innovation', desc: 'We continuously invest in technology-enabled manufacturing and best-researched product portfolios.' },
]

export default function VisionAndMissionPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Our Purpose"
        title="Vision & Mission"
        description="The beliefs and ambitions that guide every decision at Astonea Labs Limited."
        breadcrumb={[{ label: 'Vision & Mission', href: '/vision-and-mission' }]}
      />

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  Our Mission
                </p>
                <blockquote className="font-display text-2xl lg:text-3xl font-semibold leading-snug text-balance" style={{ color: 'var(--color-ink)' }}>
                  "To reach our wings across the globe with our own brands and also be a preferred supplier globally."
                </blockquote>
                <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  We are building a globally recognized pharmaceutical and cosmetic enterprise — one that creates lasting
                  brand equity while remaining the partner of choice for contract manufacturing worldwide.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="p-10 rounded-3xl" style={{ background: 'var(--color-primary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Our Vision
                </p>
                <blockquote className="font-display text-xl lg:text-2xl font-semibold leading-snug text-white">
                  "To build sustainable brands that have global reach and make a lasting impact on people's life."
                </blockquote>
                <p className="mt-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  To connect with global masses with our best-researched portfolio of products — delivering both wellbeing
                  and beauty to consumers around the world.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tagline band */}
      <section className="py-20" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Our Promise
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white text-balance max-w-2xl mx-auto leading-tight">
              Inspiring trust in healthcare,{' '}
              <span style={{ color: 'var(--color-accent)' }}>elevating beauty</span> with elegance.
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Core Values
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              The principles behind our purpose
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="p-8 rounded-2xl border h-full" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
