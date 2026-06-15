import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/related-party-transactions', {
    title: 'Related Party Transactions',
    description:
      'Disclosures of related party transactions of Astonea Labs Limited filed under Regulation 23 of SEBI LODR.',
  })

export default async function RelatedPartyTransactionsPage() {
  const items = await listByCategoryByDate('related_party')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Related Party Transactions"
        description="Half-yearly and yearly disclosures of related party transactions of Astonea Labs Limited filed under Regulation 23 of SEBI LODR."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Related Party Transactions', href: '/related-party-transactions' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No related party transaction disclosures have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
