import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listPublishedByCategory } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/corporate-documents', {
    title: 'Corporate Documents',
    description:
      'Memorandum and Articles of Association and other corporate documents of Astonea Labs Limited.',
  })

export default async function CorporateDocumentsPage() {
  const items = await listPublishedByCategory('corporate_document')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Corporate Documents"
        description="Memorandum and Articles of Association and other corporate documents of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Corporate Governance', href: '/corporate-governance' },
          { label: 'Corporate Documents', href: '/corporate-documents' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList
              items={items}
              showDate={false}
              emptyMessage="No corporate documents have been published yet."
            />
          </div>
        </div>
      </section>
    </div>
  )
}
