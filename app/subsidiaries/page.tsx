import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Subsidiaries',
  description: 'Astonea Labs\' subsidiaries — including the wholly owned US subsidiary Astonea LLC.',
}

export default function SubsidiariesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Corporate Structure"
        title="Subsidiaries"
        description="Astonea Labs Limited's subsidiary entities supporting the group's global expansion strategy."
        breadcrumb={[{ label: 'Subsidiaries', href: '/subsidiaries' }]}
      />

      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Subsidiaries
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Global footprint through subsidiary entities
            </h2>
          </Reveal>

          <div className="max-w-2xl">
            <Reveal>
              <div className="p-10 rounded-3xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      Wholly Owned Subsidiary
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-ink-subtle)' }}>USA</span>
                </div>

                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>Astonea LLC</h3>
                <p className="text-sm font-medium mb-5" style={{ color: 'var(--color-primary)' }}>
                  Wholly Owned Subsidiary — United States of America
                </p>

                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                  Astonea LLC is the wholly owned US subsidiary (WOS) of Astonea Labs Limited, incorporated to support
                  the company's international expansion, distribution, and market development efforts in North America.
                  The establishment of this entity is a significant step in Astonea's vision to become a global
                  pharmaceutical and cosmetic brand.
                </p>

                <div className="pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>
                    Parent Company CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India.
                    For incorporation documents, refer to{' '}
                    <Link href="/sebi-lodr-regulation-30-disclosures" className="hover:underline font-medium" style={{ color: 'var(--color-primary)' }}>
                      SEBI LODR Reg. 30 Disclosures
                    </Link>.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Context note */}
          <Reveal delay={100}>
            <div className="mt-12 p-6 rounded-2xl border max-w-2xl" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Group Company Relationships</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                In addition to Astonea LLC, the Astonea group includes several affiliated entities in India.
                For the complete corporate structure, refer to the{' '}
                <Link href="/group-companies" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Group Companies</Link>{' '}
                page and the company's annual reports and regulatory filings.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
