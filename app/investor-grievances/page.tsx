import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/investor-grievances', {
    title: 'Investor Grievances',
    description: 'Investor and shareholder grievance redressal contact at Astonea Labs Limited.',
  })

export default function InvestorGrievancesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Investor Grievances"
        description="Investors and shareholders may direct any grievance to the Compliance Officer at the contact below."
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
                Grievance Redressal
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-10" style={{ color: 'var(--color-ink)' }}>
                Investors / Shareholders / Grievances Redressal
              </h2>
            </Reveal>

            <Reveal delay={60}>
              <div className="p-8 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
                  Mr. Ankit Kapoor
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                  Company Secretary &amp; Compliance Officer
                </p>

                <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-subtle)' }}>
                    Email
                  </p>
                  <a
                    href="mailto:investorgrievance@astonea.org"
                    className="text-base font-medium hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    investorgrievance@astonea.org
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
