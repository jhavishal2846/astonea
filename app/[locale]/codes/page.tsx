import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
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
  const t = await getPageText('/codes')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Governance') as string}
        title={t('header.title', 'Codes') as string}
        description={t('header.description', 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.') as string}
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
              emptyMessage={t('doc.empty', 'No codes have been published yet.') as string}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
