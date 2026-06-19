import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/newspaper-publications', {
    title: 'Newspaper Publications',
    description:
      'Statutory financial results and notices of Astonea Labs Limited published in approved newspapers.',
  })

export default async function NewspaperPublicationsPage() {
  const items = await listByCategoryByDate('newspaper_publication')
  const t = await getPageText('/newspaper-publications')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Newspaper Publications') as string}
        description={t('header.description', 'Statutory financial results and notices of Astonea Labs Limited published in approved newspapers.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Newspaper Publications', href: '/newspaper-publications' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No newspaper publications have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
