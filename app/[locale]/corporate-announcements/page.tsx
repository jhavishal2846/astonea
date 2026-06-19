import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/corporate-announcements', {
    title: 'Corporate Announcements',
    description:
      'Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange.',
  })

export default async function CorporateAnnouncementsPage() {
  const items = await listByCategoryByDate('corporate_announcement')
  const t = await getPageText('/corporate-announcements')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Corporate Announcements') as string}
        description={t('header.description', 'Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Corporate Announcements', href: '/corporate-announcements' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No corporate announcements have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
