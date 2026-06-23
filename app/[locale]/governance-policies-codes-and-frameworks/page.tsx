import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'
import { getPageText } from '@/lib/cms/page-text'

export const generateMetadata = () =>
  pageMeta('/governance-policies-codes-and-frameworks', {
    title: 'Governance Policies, Codes & Frameworks',
    description: 'Astonea Labs Limited governance policies, codes of conduct, and regulatory frameworks.',
  })

const CATEGORY_HREFS = ['/policies', '/codes', '/frameworks'] as const

const CATEGORY_DEFAULTS: ReadonlyArray<{ title: string; desc: string }> = [
  {
    title: 'Policies',
    desc: 'Board-approved governance policies covering POSH, RPT, succession, board diversity and more.',
  },
  {
    title: 'Codes',
    desc: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.',
  },
  {
    title: 'Frameworks',
    desc: 'Frameworks governing compliance, evaluation and board processes.',
  },
]

export default async function GovernancePoliciesPage() {
  const t = await getPageText('/governance-policies-codes-and-frameworks')
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Governance') as string}
        title={t('header.title', 'Governance Policies, Codes & Frameworks') as string}
        description={t('header.description', "The formal policies, codes, and regulatory frameworks that govern Astonea Labs Limited's operations and ethics.") as string}
        breadcrumb={[
          { label: t('gpcf.crumb.investors', 'Investors') as string, href: '/investor-insights' },
          { label: t('gpcf.crumb.self', 'Governance Policies') as string, href: '/governance-policies-codes-and-frameworks' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('gpcf.section.label', 'Categories')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('gpcf.section.heading', 'Browse governance documents')}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY_DEFAULTS.map((c, i) => (
              <Reveal key={CATEGORY_HREFS[i]} delay={i * 50}>
                <Link href={CATEGORY_HREFS[i]} className="group flex flex-col p-6 rounded-2xl border h-full transition-all hover:border-blue-200 hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="font-mono text-xs font-bold tracking-widest mb-5 block" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>
                    {t(`gpcf.cat_${i}.title`, c.title)}
                  </h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>
                    {t(`gpcf.cat_${i}.desc`, c.desc)}
                  </p>
                  <div className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {t('gpcf.card.view', 'View →')}
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
