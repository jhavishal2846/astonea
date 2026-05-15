import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Manufacturing Facility',
  description: 'GMP-compliant manufacturing facility in Panchkula, Haryana — state-of-the-art pharma and cosmetics production.',
}

const capabilities = [
  { label: 'Tablets & Capsules', detail: 'Conventional, film-coated, enteric-coated, and extended-release solid dosage forms.' },
  { label: 'Syrups & Suspensions', detail: 'Liquid oral formulations manufactured under controlled aseptic conditions.' },
  { label: 'Ointments & Creams', detail: 'Semi-solid topical preparations with precision texture and stability profiles.' },
  { label: 'External Preparations', detail: 'Gels, lotions, and dermatological formulations across pharmaceutical and cosmetic lines.' },
  { label: 'Cosmetic Preparations', detail: 'Serums, face wash, hair care, and personal-care white-label production.' },
  { label: 'Nutraceuticals', detail: 'AYUSH-approved herbal, nutraceutical, and wellness formulations.' },
]

const standards = [
  { label: 'WHO-GMP', desc: 'World Health Organization Good Manufacturing Practices — our core production standard.' },
  { label: 'ISO Standards', desc: 'ISO-certified quality management systems across manufacturing and support functions.' },
  { label: 'cGMP', desc: 'Current Good Manufacturing Practice guidelines governing all production processes.' },
  { label: 'AYUSH Approved', desc: 'Certified manufacturing lines for Ayurvedic, Unani, Siddha, and Homeopathic products.' },
  { label: 'USFDA OTC', desc: 'USFDA audit completed for OTC (Over-the-Counter) product manufacturing.' },
]

const infrastructure = [
  { title: 'Modern Machinery', desc: 'Advanced process-control systems and precision manufacturing equipment for batch-to-batch consistency.' },
  { title: 'Dedicated Manufacturing Zones', desc: 'Segregated production areas for different dosage forms, preventing cross-contamination.' },
  { title: 'Quality Control Lab', desc: 'Sophisticated analytical instruments for raw material, in-process, and finished-goods testing.' },
  { title: 'Quality Assurance Department', desc: 'Independent QA team conducting in-process audits, stability studies, and compliance reviews.' },
  { title: 'Controlled Environments', desc: 'HVAC-regulated, ISO-classified cleanrooms ensuring sterility and particulate control.' },
  { title: 'Logistics Access', desc: 'Proximity to North Indian commercial and regulatory centres with strong transport connectivity.' },
]

export default function ManufacturingFacilityPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Infrastructure"
        title="Manufacturing Facility"
        description="State-of-the-art GMP-compliant facility in Panchkula, Haryana — delivering precision pharma and cosmetics manufacturing."
        breadcrumb={[{ label: 'Manufacturing Facility', href: '/manufacturing-facility' }]}
      />

      {/* Location */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>Location</p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Strategically located in Panchkula, Haryana
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                  Our manufacturing facility is situated in <strong>Village Haripur, Tehsil Raipur Rani, District Panchkula, Haryana — 134204</strong>.
                  The facility benefits from a well-connected industrial belt with strong logistics access and proximity
                  to North Indian commercial and regulatory centres.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  The site operates under the highest benchmarks of Good Manufacturing Practices (GMP), ISO standards,
                  and global quality norms, with comprehensive validation processes and controlled manufacturing
                  environments ensuring regulatory compliance at every step.
                </p>
              </div>
            </Reveal>

            <StaggerReveal className="space-y-4">
              <div className="p-6 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-subtle)' }}>Manufacturing Address</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  Vill. Haripur, Tehsil Raipur Rani<br />
                  Dist. Panchkula, Haryana — 134204
                </p>
              </div>
              <div className="p-6 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-subtle)' }}>Registered Office</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  SCO 321-322, Basement, Sector 35B<br />
                  Chandigarh — 160022
                </p>
              </div>
              <div className="p-6 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-subtle)' }}>Corporate Office</p>
                <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  Plot No. 63, Industrial Area Phase-II<br />
                  Panchkula, Haryana — 134113
                </p>
              </div>
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>Infrastructure</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-white text-balance">
              Built for precision and compliance
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infrastructure.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="p-8 rounded-2xl border h-full" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <h3 className="font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Production capabilities */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Production</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Diverse dosage forms under one roof
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="flex flex-col gap-2 p-6 rounded-xl border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{c.label}</span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{c.detail}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality standards */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Quality & Compliance</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
              Every batch. Every standard. Every time.
            </h2>
            <p className="text-base mb-14 max-w-2xl" style={{ color: 'var(--color-ink-muted)' }}>
              Our multi-tier QMS spans in-process checks, finished-goods testing, stability studies, and NABL-accredited
              third-party audits — ensuring zero-compromise on every batch we release.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((s, i) => (
              <Reveal key={s.label} delay={i * 60}>
                <div className="flex items-start gap-4 p-6 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{s.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-10">
              <Link href="/certifications" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: 'var(--color-primary)' }}>
                View All Certifications →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
