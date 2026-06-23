import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'
import { getPageText } from '@/lib/cms/page-text'

export const generateMetadata = () =>
  pageMeta('/subsidiaries', {
    title: 'Subsidiaries',
    description: 'Astonea Labs\' subsidiaries — including the wholly owned US subsidiary Astonea LLC.',
  })

export default async function SubsidiariesPage() {
  const t = await getPageText('/subsidiaries')
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Corporate Structure') as string}
        title={t('header.title', 'Subsidiaries') as string}
        description={t('header.description', "Astonea Labs Limited's subsidiary entities supporting the group's global expansion strategy.") as string}
        breadcrumb={[{ label: t('sub.crumb.self', 'Subsidiaries') as string, href: '/subsidiaries' }]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('sub.section.label', 'Subsidiaries')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('sub.section.heading', 'Global footprint through subsidiary entities')}
            </h2>
          </Reveal>

          <div className="max-w-2xl">
            <Reveal>
              <div className="p-10 rounded-3xl border" style={{ background: 'var(--color-slate-950)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                    {t('sub.card.badge', 'Wholly Owned Subsidiary')}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {t('sub.card.country', 'USA')}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold mb-2 text-white">{t('sub.card.name', 'Astonea LLC')}</h3>
                <p className="text-sm font-medium mb-5" style={{ color: 'var(--color-primary-light)' }}>
                  {t('sub.card.subtitle', 'Wholly Owned Subsidiary — United States of America')}
                </p>

                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
                  {t('sub.card.body', "Astonea LLC is the wholly owned US subsidiary (WOS) of Astonea Labs Limited, incorporated to support the company's international expansion, distribution, and market development efforts in North America. The establishment of this entity is a significant step in Astonea's vision to become a global pharmaceutical and cosmetic brand.")}
                </p>

                <a
                  href="/pdf/Incorporation of WOS- USA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold px-4 py-2.5 rounded-full mb-6 transition-colors"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-slate-950)' }}
                >
                  {t('sub.card.doc_cta', 'View Incorporation Document')}
                </a>

                <div className="pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {t('sub.card.footer_before_link', 'Parent Company CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India. For other regulatory filings, refer to ')}
                    <Link href="/sebi-lodr-regulation-30-disclosures" className="hover:underline font-medium" style={{ color: 'var(--color-primary-light)' }}>
                      {t('sub.card.footer_link', 'SEBI LODR Reg. 30 Disclosures')}
                    </Link>
                    {t('sub.card.footer_after_link', '.')}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Context note */}
          <Reveal delay={100}>
            <div className="mt-12 p-6 rounded-2xl border max-w-2xl" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{t('sub.note.heading', 'Group Company Relationships')}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {t('sub.note.before_link', 'In addition to Astonea LLC, the Astonea group includes several affiliated entities in India. For the complete corporate structure, refer to the ')}
                <Link href="/group-companies" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {t('sub.note.link', 'Group Companies')}
                </Link>
                {t('sub.note.after_link', " page and the company's annual reports and regulatory filings.")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
