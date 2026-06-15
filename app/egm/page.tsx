import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/egm', {
    title: 'Extra-Ordinary General Meetings (EGM)',
    description:
      'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited.',
  })

export default async function EGMPage() {
  const items = await listByCategoryByDate('egm')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Meetings"
        title="Extra-Ordinary General Meetings (EGM)"
        description="Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
          { label: 'EGM', href: '/egm' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No EGM documents have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
