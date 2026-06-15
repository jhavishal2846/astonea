import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/certifications', {
    title: 'Certifications',
    description: 'Astonea Labs\' quality certifications and regulatory approvals — WHO-GMP, ISO, AYUSH, FSSAI and more.',
  })

// Quality practices remain a static list (no per-row CMS need yet).
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

export default async function CertificationsPage() {
  const certifications = await listPublishedByCategory('certification')
  // Use the first cert with a fileUrl as the global download CTA.
  const downloadHref = certifications.find((c) => c.fileUrl)?.fileUrl ?? null

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Quality"
        title="Certifications"
        description="Our quality credentials and regulatory approvals — validating our commitment to manufacturing excellence."
        breadcrumb={[{ label: 'Certifications', href: '/certifications' }]}
      />

      {/* Certifications grid */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
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
              <Reveal key={c.id} delay={i * 60}>
                <div className="flex flex-col p-8 rounded-2xl border h-full" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  {c.subcategory && (
                    <div className="mb-5">
                      <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                        {c.subcategory}
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{c.title}</h3>
                  {c.description && <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-ink-muted)' }}>{c.description}</p>}
                  {c.period && (
                    <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--color-ink-subtle)' }}>Scope: {c.period}</span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QMS practices */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
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
              {downloadHref && (
                <a href={downloadHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  Download Certificates
                </a>
              )}
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
