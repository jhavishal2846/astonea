import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/egm', {
    title: 'Extra-Ordinary General Meetings (EGM)',
    description:
      'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited.',
  })

export default async function EGMPage() {
  const items = await listByCategoryByDate('egm')
  const t = await getPageText('/egm')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Meetings') as string}
        title={t('header.title', 'Extra-Ordinary General Meetings (EGM)') as string}
        description={t('header.description', 'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'EGM', href: '/egm' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No EGM documents have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
