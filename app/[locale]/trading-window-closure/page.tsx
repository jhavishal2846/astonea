import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/trading-window-closure', {
    title: 'Trading Window Closure',
    description:
      'Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015.',
  })

export default async function TradingWindowClosurePage() {
  const items = await listByCategoryByDate('trading_window')
  const t = await getPageText('/trading-window-closure')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Trading Window Closure') as string}
        description={t('header.description', 'Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Trading Window Closure', href: '/trading-window-closure' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage={t('doc.empty', 'No trading window closure intimations have been published yet.') as string} />
          </div>
        </div>
      </section>
    </div>
  )
}
