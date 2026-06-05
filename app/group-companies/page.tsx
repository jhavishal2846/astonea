import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listGroupCompaniesWithFinancials } from '@/lib/cms/queries'
import type { DocumentRow, GroupCompany } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Group Companies',
  description: 'The corporate family of Astonea Labs Limited — group entities and affiliated organisations.',
}

export const dynamic = 'force-dynamic'

const ENTITY_TYPE_TAG: Record<GroupCompany['entityType'], string> = {
  parent:     'Listed',
  subsidiary: 'Private',
  associate:  'Private',
  nonprofit:  'Non-Profit',
}

const ENTITY_TYPE_LABEL: Record<GroupCompany['entityType'], string> = {
  parent:     'Parent Company',
  subsidiary: 'Group Entity',
  associate:  'Related Entity',
  nonprofit:  'Non-Profit Entity',
}

const tagStyles: Record<string, { bg: string; text: string }> = {
  Listed:       { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  Private:      { bg: 'var(--color-slate-100)',       text: 'var(--color-slate-600)' },
  'Non-Profit': { bg: 'rgba(16,185,129,0.1)',         text: '#059669' },
}

function DocRow({ doc }: { doc: DocumentRow }) {
  // Extract "Annual Financial Statements" from title that was seeded as "Annual Financial Statements — FY YYYY-YY"
  const label = doc.title.includes(' — ') ? doc.title.split(' — ')[0] : doc.title
  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-bg)' }}>
      <div className="flex items-center gap-3">
        <div className="px-2 py-1 rounded-lg flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-primary)' }}>FY</span>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{label}</p>
          {doc.period && <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{doc.period}</p>}
        </div>
      </div>
      {doc.fileUrl ? (
        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
          PDF
        </a>
      ) : (
        <span className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Soon
        </span>
      )}
    </div>
  )
}

export default async function GroupCompaniesPage() {
  const companies = await listGroupCompaniesWithFinancials()
  // Parent gets the company-grid hero card; its docs are surfaced on /annual-reports + /financial-results.
  const parent = companies.find((c) => c.entityType === 'parent') ?? null
  const others = companies.filter((c) => c.entityType !== 'parent')
  const allForGrid = parent ? [parent, ...others] : others

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Corporate Structure"
        title="Group Companies"
        description="Astonea Labs Limited operates alongside several affiliated entities forming a diversified pharmaceutical and cosmetic group."
        breadcrumb={[{ label: 'Group Companies', href: '/group-companies' }]}
      />

      {/* Companies grid */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Corporate Family
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Entities within the Astonea group
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allForGrid.map((c, i) => {
              const tagName = ENTITY_TYPE_TAG[c.entityType]
              const tag = tagStyles[tagName]
              const isListed = tagName === 'Listed'
              return (
                <Reveal key={c.id} delay={i * 60}>
                  <div className="flex flex-col p-8 rounded-2xl border h-full" style={{
                    background: isListed ? 'var(--color-slate-950)' : 'var(--color-surface)',
                    borderColor: isListed ? 'rgba(255,255,255,0.08)' : 'var(--color-border)',
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tag.bg, color: tag.text }}>
                        {tagName}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: isListed ? 'white' : 'var(--color-ink)' }}>
                      {c.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: isListed ? 'var(--color-primary-light)' : 'var(--color-primary)' }}>
                      {ENTITY_TYPE_LABEL[c.entityType]}
                    </p>
                    {c.cin && (
                      <p className="text-xs font-mono mb-3" style={{ color: isListed ? 'rgba(255,255,255,0.55)' : 'var(--color-ink-subtle)' }}>
                        CIN: {c.cin}
                      </p>
                    )}
                    {c.description && (
                      <p className="text-sm leading-relaxed flex-1" style={{ color: isListed ? 'rgba(255,255,255,0.78)' : 'var(--color-ink-muted)' }}>
                        {c.description}
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Group financials */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Financial Documents
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-4 text-balance" style={{ color: 'var(--color-ink)' }}>
              Group company financials
            </h2>
            <p className="text-base mb-14 max-w-2xl" style={{ color: 'var(--color-ink-muted)' }}>
              Annual financial statements for each entity within the Astonea group. For Astonea Labs Limited financials, refer to the{' '}
              <Link href="/financial-results" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Financial Results
              </Link>{' '}
              and{' '}
              <Link href="/annual-reports" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                Annual Reports
              </Link>{' '}
              pages.
            </p>
          </Reveal>

          <div className="space-y-12 max-w-3xl">
            {others
              .filter((c) => c.docs.length > 0)
              .map((group, gi) => (
                <Reveal key={group.id} delay={gi * 60}>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-3 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                      {group.name}
                    </h3>
                    <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                      {group.docs.map((doc) => (
                        <DocRow key={doc.id} doc={doc} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
