import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/corporate-announcements', {
    title: 'Corporate Announcements',
    description:
      'Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange.',
  })

export default async function CorporateAnnouncementsPage() {
  const items = await listByCategoryByDate('corporate_announcement')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Corporate Announcements"
        description="Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Corporate Announcements', href: '/corporate-announcements' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No corporate announcements have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
