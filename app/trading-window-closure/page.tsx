import { PageHeader } from '@/components/PageHeader'
import { DocumentList } from '@/components/DocumentList'
import { listByCategoryByDate } from '@/lib/cms/queries'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/trading-window-closure', {
    title: 'Trading Window Closure',
    description:
      'Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015.',
  })

export default async function TradingWindowClosurePage() {
  const items = await listByCategoryByDate('trading_window')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Trading Window Closure"
        description="Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Trading Window Closure', href: '/trading-window-closure' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <DocumentList items={items} emptyMessage="No trading window closure intimations have been published yet." />
          </div>
        </div>
      </section>
    </div>
  )
}
