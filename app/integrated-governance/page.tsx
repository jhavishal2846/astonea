import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/integrated-governance', {
    title: 'Integrated Governance',
    description:
      'Quarterly integrated governance filings of Astonea Labs Limited submitted under the SEBI integrated filing framework.',
  })

export default async function IntegratedGovernancePage() {
  const rows = await listPublishedByCategory('integrated_filing')
  const grouped = groupBySubcategory(rows)
  const items = (grouped['quarterly'] ?? []).slice()
  items.sort((a, b) => {
    const da = a.eventDate ? new Date(a.eventDate).getTime() : 0
    const db = b.eventDate ? new Date(b.eventDate).getTime() : 0
    return db - da
  })

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Integrated Filings"
        title="Integrated Governance"
        description="Quarterly integrated governance filings of Astonea Labs Limited submitted under the SEBI integrated filing framework."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Integrated Filings', href: '/integrated-filings' },
          { label: 'Integrated Governance', href: '/integrated-governance' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No integrated governance filings have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
