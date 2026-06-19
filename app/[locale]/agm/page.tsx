import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/agm', {
    title: 'Annual General Meetings (AGM)',
    description:
      'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited.',
  })

export default async function AGMPage() {
  const items = await listByCategoryByDate('agm')
  const t = await getPageText('/agm')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Meetings') as string}
        title={t('header.title', 'Annual General Meetings (AGM)') as string}
        description={t('header.description', 'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'AGM', href: '/agm' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No AGM documents have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
