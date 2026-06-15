import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/registrar-share-transfer-agent', {
    title: 'Registrar & Share Transfer Agent',
    description: 'Contact details of the Registrar and Share Transfer Agent for Astonea Labs Limited shareholders.',
  })

export default function RegistrarShareTransferAgentPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Registrar & Share Transfer Agent"
        description="All share transfer, dematerialisation and shareholder service queries are handled by the Registrar and Share Transfer Agent listed below."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Registrar & STA', href: '/registrar-share-transfer-agent' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                Registrar & Share Transfer Agent
              </p>
            </Reveal>

            <Reveal delay={60}>
              <div className="p-8 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-6" style={{ color: 'var(--color-ink)' }}>
                  KFin Technologies Limited
                </h2>

                <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-ink-subtle)' }}>
                    Address
                  </p>
                  <address className="not-italic text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                    Selenium Building, Tower-B,<br />
                    Plot No 31 &amp; 32, Financial District,<br />
                    Nanakramguda, Serilingampally,<br />
                    Hyderabad, Rangareddi,<br />
                    Telangana, India — 500 032
                  </address>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
