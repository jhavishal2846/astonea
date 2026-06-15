import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/policies', {
    title: 'Policies',
    description: 'Board-approved governance policies of Astonea Labs Limited.',
  })

export default async function PoliciesPage() {
  const rows = await listPublishedByCategory('policy_code_framework')
  const grouped = groupBySubcategory(rows)
  const items = grouped['policy'] ?? []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Policies"
        description="Board-approved governance policies of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
          { label: 'Policies', href: '/policies' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            {items.length === 0 ? (
              <Reveal>
                <div className="p-6 rounded-xl border text-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                  No policies have been published yet.
                </div>
              </Reveal>
            ) : (
              <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
                {items.map((item, i) => (
                  <Reveal key={item.id} delay={i * 25}>
                    <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                        {item.description && (
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.description}</p>
                        )}
                      </div>
                      {item.fileUrl ? (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                          PDF
                        </a>
                      ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                          Soon
                        </span>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
