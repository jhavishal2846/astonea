import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Astonea Labs\' quality certifications and regulatory approvals — WHO-GMP, ISO, AYUSH, FSSAI and more.',
}

const certifications = [
  {
    label: 'WHO-GMP',
    fullName: 'World Health Organization — Good Manufacturing Practices',
    desc: 'Our core manufacturing certification ensuring products meet international quality benchmarks set by the World Health Organization for pharmaceutical production.',
    scope: 'All pharmaceutical manufacturing lines',
  },
  {
    label: 'ISO 9001:2015',
    fullName: 'International Organization for Standardization — Quality Management',
    desc: 'ISO-certified quality management systems covering planning, production, quality control, and continuous improvement across all operations.',
    scope: 'Organisation-wide quality management',
  },
  {
    label: 'cGMP',
    fullName: 'Current Good Manufacturing Practice',
    desc: 'Compliance with current GMP regulations as prescribed by Indian regulatory authorities, ensuring all manufacturing processes meet updated national standards.',
    scope: 'All pharmaceutical formulations',
  },
  {
    label: 'AYUSH Approved',
    fullName: 'Ministry of AYUSH — Manufacturing Approval',
    desc: 'Licensed to manufacture Ayurvedic, Unani, Siddha, and Homeopathic (AYUSH) formulations under the Ministry of AYUSH regulations.',
    scope: 'Herbal & nutraceutical lines',
  },
  {
    label: 'FSSAI',
    fullName: 'Food Safety and Standards Authority of India',
    desc: 'FSSAI licensing for food supplement and nutraceutical product manufacturing, ensuring compliance with Indian food safety standards.',
    scope: 'Food supplements & nutraceuticals',
  },
  {
    label: 'USFDA OTC',
    fullName: 'US Food and Drug Administration — OTC Audit',
    desc: 'USFDA audit completed for Over-the-Counter (OTC) product manufacturing, supporting export readiness for the North American market.',
    scope: 'OTC product lines',
  },
]

const qualityPractices = [
  'In-process quality checks at every manufacturing stage',
  'Finished-goods testing before batch release',
  'Stability studies under ICH-guidelines',
  'NABL-accredited third-party laboratory audits',
  'Dedicated QC and QA departments with sophisticated analytical instruments',
  'Comprehensive validation protocols for equipment and processes',
  'Controlled environment monitoring (temperature, humidity, particulates)',
  'Robust documentation and batch traceability systems',
]

export default function CertificationsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Quality"
        title="Certifications"
        description="Our quality credentials and regulatory approvals — validating our commitment to manufacturing excellence."
        breadcrumb={[{ label: 'Certifications', href: '/certifications' }]}
      />

      {/* Certifications grid */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Credentials
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Internationally validated, locally committed
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="flex flex-col p-8 rounded-2xl border h-full" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div className="mb-5">
                    <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      {c.label}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{c.fullName}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-ink-muted)' }}>{c.desc}</p>
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-ink-subtle)' }}>Scope: {c.scope}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QMS practices */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  Quality Management System
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-6 text-balance">
                  Multi-tier QMS — zero compromise
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Our quality management system spans the entire production lifecycle — from raw material qualification
                  to finished-goods testing and post-market surveillance — ensuring every batch meets its specifications
                  before release.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                {qualityPractices.map((p) => (
                  <div key={p} className="px-6 py-4" style={{ background: 'var(--color-slate-950)' }}>
                    <div className="pl-4 border-l-2" style={{ borderColor: 'var(--color-primary-light)' }}>
                      <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{p}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                Need compliance documentation?
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                Contact our team for GMP certificates, audit reports, and regulatory documents.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-3">
              <a href="/pdf/UPDATED CERTIFICATES PDF.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                Download Certificates
              </a>
              <Link href="/contact-us" className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm font-bold transition-colors hover:opacity-90" style={{ background: 'var(--color-primary)' }}>
                Contact Our QA Team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
