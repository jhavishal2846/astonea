import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/shareholding-pattern', {
    title: 'Shareholding Pattern',
    description:
      'Quarterly shareholding pattern of Astonea Labs Limited filed under Regulation 31 of SEBI LODR.',
  })

export default async function ShareholdingPatternPage() {
  const items = await listByCategoryByDate('shareholding_pattern')
  const t = await getPageText('/shareholding-pattern')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Shareholding Pattern') as string}
        description={t('header.description', 'Half-yearly shareholding pattern filings submitted by Astonea Labs Limited under Regulation 31 of SEBI LODR.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Shareholding Pattern', href: '/shareholding-pattern' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No shareholding pattern filings have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
