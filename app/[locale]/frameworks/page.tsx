import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
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
  const t = await getPageText('/frameworks')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Governance') as string}
        title={t('header.title', 'Frameworks') as string}
        description={t('header.description', 'Frameworks governing compliance, evaluation and board processes at Astonea Labs Limited.') as string}
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
              emptyMessage={t('doc.empty', 'No frameworks have been published yet.') as string}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
