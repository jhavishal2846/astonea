import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/investor-grievances', {
    title: 'Investor Grievances',
    description: 'Investor and shareholder grievance redressal contact at Astonea Labs Limited.',
  })

export default async function InvestorGrievancesPage() {
  const t = await getPageText('/investor-grievances')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Investor Grievances') as string}
        description={t('header.description', 'Investors and shareholders may direct any grievance to the Compliance Officer at the contact below.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Investor Grievances', href: '/investor-grievances' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                {t('grievances.label', 'Grievance Redressal')}
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-10" style={{ color: 'var(--color-ink)' }}>
                {t('grievances.heading', 'Investors / Shareholders / Grievances Redressal')}
              </h2>
            </Reveal>

            <Reveal delay={60}>
              <div className="p-8 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
                  {t('grievances.officer_name', 'Mr. Ankit Kapoor')}
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                  {t('grievances.officer_role', 'Company Secretary & Compliance Officer')}
                </p>

                <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-subtle)' }}>
                    {t('grievances.email_label', 'Email')}
                  </p>
                  <a
                    href="mailto:investorgrievance@astonea.org"
                    className="text-base font-medium hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {t('grievances.email', 'investorgrievance@astonea.org')}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
