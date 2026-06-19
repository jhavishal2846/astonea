import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory, groupBySubcategory } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/integrated-finance', {
    title: 'Integrated Finance',
    description:
      'Half-yearly and yearly integrated financial filings of Astonea Labs Limited submitted to the stock exchange.',
  })

export default async function IntegratedFinancePage() {
  const rows = await listPublishedByCategory('integrated_filing')
  const grouped = groupBySubcategory(rows)
  // Treat 'annual' or undefined subcategory as finance filings (rather than governance).
  const items = (grouped['annual'] ?? []).concat(grouped['__none__'] ?? [])
  items.sort((a, b) => {
    const da = a.eventDate ? new Date(a.eventDate).getTime() : 0
    const db = b.eventDate ? new Date(b.eventDate).getTime() : 0
    return db - da
  })

  const t = await getPageText('/integrated-finance')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Integrated Filings') as string}
        title={t('header.title', 'Integrated Finance') as string}
        description={t('header.description', 'Half-yearly and yearly integrated financial filings of Astonea Labs Limited submitted to the stock exchange.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Integrated Filings', href: '/integrated-filings' },
          { label: 'Integrated Finance', href: '/integrated-finance' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No integrated finance filings have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
