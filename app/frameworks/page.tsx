import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/frameworks', {
    title: 'Frameworks',
    description:
      'Frameworks governing compliance, evaluation and board processes at Astonea Labs Limited.',
  })

export default async function FrameworksPage() {
  const rows = await listPublishedByCategory('policy_code_framework')
  const grouped = groupBySubcategory(rows)
  const items = grouped['framework'] ?? []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Frameworks"
        description="Frameworks governing compliance, evaluation and board processes at Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
          { label: 'Frameworks', href: '/frameworks' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList
              items={items}
              showDate={false}
              emptyMessage="No frameworks have been published yet."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
