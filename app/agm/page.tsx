import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/agm', {
    title: 'Annual General Meetings (AGM)',
    description:
      'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited.',
  })

export default async function AGMPage() {
  const items = await listByCategoryByDate('agm')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Meetings"
        title="Annual General Meetings (AGM)"
        description="Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'AGM', href: '/agm' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No AGM documents have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
