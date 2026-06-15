import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/codes', {
    title: 'Codes',
    description:
      'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.',
  })

export default async function CodesPage() {
  const rows = await listPublishedByCategory('policy_code_framework')
  const grouped = groupBySubcategory(rows)
  const items = grouped['code'] ?? []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Codes"
        description="Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
          { label: 'Codes', href: '/codes' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList
              items={items}
              showDate={false}
              emptyMessage="No codes have been published yet."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
