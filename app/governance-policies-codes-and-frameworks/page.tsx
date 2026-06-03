import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import type { DocumentRow } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Governance Policies, Codes & Frameworks',
  description: 'Astonea Labs Limited governance policies, codes of conduct, and regulatory frameworks.',
}

export const dynamic = 'force-dynamic'

function DocRow({ row, index }: { row: DocumentRow; index: number }) {
  return (
    <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
        {String(index).padStart(2, '0')}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{row.title}</p>
        {row.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{row.description}</p>}
      </div>
      {row.fileUrl ? (
        <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 transition-colors hover:bg-blue-50" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
          PDF
        </a>
      ) : (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Soon
        </span>
      )}
    </div>
  )
}

export default async function GovernancePoliciesPage() {
  const all = await listPublishedByCategory('policy_code_framework')
  const grouped = groupBySubcategory(all)
  const policies = grouped['policy'] ?? []
  const codes = grouped['code'] ?? []
  const frameworks = grouped['framework'] ?? []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Governance Policies, Codes & Frameworks"
        description="The formal policies, codes, and regulatory frameworks that govern Astonea Labs Limited's operations and ethics."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
        ]}
      />

      {/* Policies */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Policies
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Board-approved governance policies
            </h2>
          </Reveal>
          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {policies.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <DocRow row={p} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Codes */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Codes of Conduct
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Codes governing conduct & disclosure
            </h2>
          </Reveal>
          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {codes.map((c, i) => (
              <Reveal key={c.id} delay={i * 40}>
                <DocRow row={c} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Frameworks
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Frameworks governing compliance & evaluation
            </h2>
          </Reveal>
          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {frameworks.map((f, i) => (
              <Reveal key={f.id} delay={i * 40}>
                <DocRow row={f} index={i + 1} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-10 text-sm max-w-2xl" style={{ color: 'var(--color-ink-subtle)' }}>
              All policies are reviewed periodically by the Board of Directors. For the most current versions of any policy document, contact{' '}
              <a href="mailto:cs@astonea.org" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>cs@astonea.org</a>.
              CIN: L24304CH2017PLC041482.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
