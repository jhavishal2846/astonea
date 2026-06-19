import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/registrar-share-transfer-agent', {
    title: 'Registrar & Share Transfer Agent',
    description: 'Contact details of the Registrar and Share Transfer Agent for Astonea Labs Limited shareholders.',
  })

export default async function RegistrarShareTransferAgentPage() {
  const t = await getPageText('/registrar-share-transfer-agent')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Investor Relations') as string}
        title={t('header.title', 'Registrar & Share Transfer Agent') as string}
        description={t('header.description', 'All share transfer, dematerialisation and shareholder service queries are handled by the Registrar and Share Transfer Agent listed below.') as string}
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
                {t('rta.label', 'Registrar & Share Transfer Agent')}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <div className="p-8 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <h2 className="font-display text-2xl lg:text-3xl font-bold leading-snug mb-6" style={{ color: 'var(--color-ink)' }}>
                  {t('rta.name', 'KFin Technologies Limited')}
                </h2>

                <div className="pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-ink-subtle)' }}>
                    {t('rta.address_label', 'Address')}
                  </p>
                  <address className="not-italic text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-ink)' }}>
                    {t('rta.address', 'Selenium Building, Tower-B,\nPlot No 31 & 32, Financial District,\nNanakramguda, Serilingampally,\nHyderabad, Rangareddi,\nTelangana, India — 500 032')}
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
