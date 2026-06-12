import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'What We Do',
  description: 'Our pharmaceutical and cosmetic manufacturing capabilities — from formulation to global distribution.',
}

const metrics = [
  { value: '9+', label: 'Therapeutic categories' },
  { value: '6', label: 'Dosage form formats' },
  { value: '3', label: 'Own consumer brands' },
  { value: 'USFDA', label: 'OTC audit completed' },
]

const services = [
  { num: '01', title: 'Contract Manufacturing', desc: 'End-to-end third-party manufacturing for pharma and cosmetic brands — domestic and international clients.' },
  { num: '02', title: 'Formulation Development', desc: 'In-house R&D support for new formulations from concept through regulatory clearance.' },
  { num: '03', title: 'Packaging Material Procurement', desc: 'Sourcing and supply of primary and secondary packaging materials to complement production.' },
  { num: '04', title: 'Product Export', desc: 'Active exporter to markets including Iraq, Yemen, and beyond. USFDA OTC audit completed.' },
  { num: '05', title: 'Quality Assurance', desc: 'Multi-tier QMS with in-process checks, stability studies, and NABL-accredited third-party audits.' },
  { num: '06', title: 'Regulatory Affairs', desc: 'Complete dossier preparation, labelling compliance, and export documentation support.' },
]

const pharmaCategories = [
  { label: 'Antibiotics', desc: 'Broad & narrow-spectrum antibacterial formulations in tablet, capsule, and liquid form.' },
  { label: 'Anti-Cold Preparations', desc: 'Decongestants, expectorants, and combination cold-relief formulations.' },
  { label: 'Antihistamines', desc: 'First and second-generation antihistamine products for allergy management.' },
  { label: 'Antidiabetic', desc: 'Oral hypoglycaemic agents across multiple drug classes and dosage strengths.' },
  { label: 'Cardiovascular', desc: 'Antihypertensives, statins, and cardiac-support formulations.' },
  { label: 'Gynecological', desc: 'Hormonal and supportive therapies for women\'s health and reproductive medicine.' },
  { label: 'Analgesics', desc: 'Pain-management formulations: NSAIDs, combination analgesics, and topical agents.' },
  { label: 'Antifungal Agents', desc: 'Systemic and topical antifungal preparations for dermatological and systemic use.' },
  { label: 'Multivitamins', desc: 'Nutraceutical blends, vitamin-mineral combinations, and wellness supplements.' },
]

const cosmeticFormats = [
  'Gels', 'Ointments', 'Creams', 'Lotions', 'Oils', 'Serums',
]

const cosmeticCategories = [
  { label: 'Skin Care', desc: 'Moisturisers, serums, face washes, sunscreens, and anti-ageing formulations.' },
  { label: 'Hair Care', desc: 'Shampoos, conditioners, hair oils, and scalp-treatment products.' },
  { label: 'Oral Care', desc: 'Toothpastes, mouthwashes, and gum-care preparations.' },
  { label: 'Personal Care', desc: 'Body lotions, hand creams, deodorants, and hygiene products.' },
]

const brands = [
  { name: 'Glow Up', desc: 'Available on Amazon and Tata 1MG. A skincare and wellness brand with consumer-grade formulations.', status: 'Live' },
  { name: 'Regero', desc: 'A brand within the Astonea portfolio targeting health-conscious consumers.', status: 'Live' },
  { name: 'Avicel', desc: 'A new skincare line currently in final development stages — launching soon.', status: 'Upcoming' },
]

export default function WhatWeDoPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Capabilities"
        title="What We Do"
        description="A diversified, innovation-driven enterprise specialising in the manufacturing, marketing, and global distribution of pharmaceutical and cosmetic products."
        breadcrumb={[{ label: 'What We Do', href: '/what-we-do' }]}
      />

      {/* Metrics strip */}
      <div style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={[
                  'py-8 px-6 text-center',
                  i < metrics.length - 1 ? 'border-r border-white/20' : '',
                ].join(' ')}
              >
                <p className="font-display text-3xl font-bold text-white mb-1">{m.value}</p>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.72)' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services overview */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Services</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              End-to-end manufacturing — tailored to your brand
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--color-border)' }}>
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 50}>
                <div className="flex flex-col gap-3 p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                  <span className="font-display text-4xl font-bold tracking-tighter leading-none select-none" style={{ color: 'var(--color-primary-light)' }}>
                    {s.num}
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pharma */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary-light)' }}>Pharmaceutical</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-4 text-white text-balance">
              Therapeutic formulations across every major category
            </h2>
            <p className="text-base mb-14" style={{ color: 'rgba(255,255,255,0.72)' }}>
              All products comply with rigorous precision, ensuring compliance with stringent quality protocols,
              regulatory standards, and Good Manufacturing Practices (GMP).
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pharmaCategories.map((c, i) => (
              <Reveal key={c.label} delay={i * 50}>
                <div className="p-6 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <h3 className="font-semibold text-white mb-2">{c.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cosmetics */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Cosmetics & Personal Care</p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Beauty and personal care with safety at the core
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-ink-muted)' }}>
                  Our cosmetic and personal care line encompasses skin care, oral care, and hair care solutions
                  available across multiple delivery formats — manufactured to the same GMP standards as our
                  pharmaceutical products.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {cosmeticFormats.map((f) => (
                    <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <StaggerReveal className="space-y-4">
              {cosmeticCategories.map((c) => (
                <div key={c.label} className="p-6 rounded-xl border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{c.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{c.desc}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Own Brands */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Brand Portfolio</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Our own consumer brands
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {brands.map((b, i) => (
              <Reveal key={b.name} delay={i * 80}>
                <div className="p-8 rounded-2xl border h-full flex flex-col" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{b.name}</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{
                      background: b.status === 'Live' ? 'var(--color-primary-xlight)' : 'rgba(232,169,0,0.1)',
                      color: b.status === 'Live' ? 'var(--color-primary)' : '#A16800',
                    }}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <StaggerReveal className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Have a formulation in mind?</h2>
              <p className="mt-3 text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.78)' }}>Our team is ready to discuss your requirements and bring your product to market.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact-us" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-sm font-bold transition-colors hover:bg-slate-100" style={{ color: 'var(--color-primary)' }}>
                Start a Conversation
              </Link>
              <Link href="/manufacturing-facility" className="inline-flex items-center px-6 py-3 rounded-full border text-sm font-medium transition-colors hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.88)' }}>
                View Facility
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>
    </div>
  )
}
