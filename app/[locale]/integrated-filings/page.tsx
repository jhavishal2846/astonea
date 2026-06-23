import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/integrated-filings', {
    title: 'Integrated Filings',
    description: 'Integrated quarterly governance and financial filings of Astonea Labs Limited submitted to BSE.',
  })

const categories = [
  {
    title: 'Integrated Governance',
    desc: 'Quarterly integrated governance filings submitted under SEBI integrated filing framework.',
    href: '/integrated-governance',
  },
  {
    title: 'Integrated Finance',
    desc: 'Half-yearly and yearly integrated financial filings submitted to the stock exchange.',
    href: '/integrated-finance',
  },
]

export default async function IntegratedFilingsPage() {
  const t = await getPageText('/integrated-filings')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Integrated Filings') as string}
        description={t('header.description', 'Integrated governance and financial filings of Astonea Labs Limited submitted to BSE under the SEBI integrated filing framework.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Integrated Filings', href: '/integrated-filings' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('intfilings.label', 'Categories')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('intfilings.heading', 'Browse integrated filings')}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((c, i) => (
              <Reveal key={i} delay={i * 50}>
                <Link href={c.href} className="group flex flex-col p-6 rounded-2xl border h-full transition-all hover:border-blue-200 hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="font-mono text-xs font-bold tracking-widest mb-5 block" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>{t(`intfilings.cat_${i}.title`, c.title)}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{t(`intfilings.cat_${i}.desc`, c.desc)}</p>
                  <div className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {t('intfilings.view', 'View →')}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
