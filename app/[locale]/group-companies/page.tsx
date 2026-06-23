import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { listGroupCompaniesWithFinancials } from '@/lib/cms/queries'
import type { DocumentRow, GroupCompany } from '@/lib/db/schema'
import { pageMeta } from '@/lib/seo/generate-metadata'
import { getPageText } from '@/lib/cms/page-text'

export const generateMetadata = () =>
  pageMeta('/group-companies', {
    title: 'Group Companies',
    description: 'The corporate family of Astonea Labs Limited — group entities and affiliated organisations.',
  })

export const dynamic = 'force-dynamic'

const ENTITY_TYPE_KEY: Record<GroupCompany['entityType'], { tag: string; fallback: string }> = {
  parent:     { tag: 'gc.tag.parent',     fallback: 'Listed' },
  subsidiary: { tag: 'gc.tag.subsidiary', fallback: 'Private' },
  associate:  { tag: 'gc.tag.associate',  fallback: 'Public' },
  nonprofit:  { tag: 'gc.tag.nonprofit',  fallback: 'Section 8 Company' },
}

const tagStyles: Record<string, { bg: string; text: string }> = {
  parent:     { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  subsidiary: { bg: 'var(--color-slate-100)',      text: 'var(--color-slate-600)' },
  associate:  { bg: 'rgba(59,130,246,0.1)',        text: '#2563eb' },
  nonprofit:  { bg: 'rgba(16,185,129,0.1)',        text: '#059669' },
}
const DEFAULT_TAG_STYLE = { bg: 'var(--color-slate-100)', text: 'var(--color-slate-600)' }

function financialsAnchorId(slug: string) {
  return `financials-${slug}`
}

function DocRow({ doc, fyBadge, pdfLabel }: { doc: DocumentRow; fyBadge: string; pdfLabel: string }) {
  const label = doc.title.includes(' — ') ? doc.title.split(' — ')[0] : doc.title
  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-bg)' }}>
      <div className="flex items-center gap-3">
        <div className="px-2 py-1 rounded-lg flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-primary)' }}>{fyBadge}</span>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>{label}</p>
          {doc.period && <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-subtle)' }}>{doc.period}</p>}
        </div>
      </div>
      {doc.fileUrl && (
        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
          {pdfLabel}
        </a>
      )}
    </div>
  )
}

export default async function GroupCompaniesPage() {
  const t = await getPageText('/group-companies')
  const companies = await listGroupCompaniesWithFinancials()
  const parent = companies.find((c) => c.entityType === 'parent') ?? null
  const others = companies.filter((c) => c.entityType !== 'parent')
  const allForGrid = parent ? [parent, ...others] : others

  // Filter out docs without fileUrl ("Soon" items) — only show entities with at least one published PDF
  const groupsWithFinancials = others
    .map((c) => ({ ...c, availableDocs: c.docs.filter((d) => d.fileUrl) }))
    .filter((c) => c.availableDocs.length > 0)

  const hasFinancialsByCompanyId = new Set<string>(groupsWithFinancials.map((c) => c.id))
  const fyBadge = t('gc.financials.fy_badge', 'FY') as string
  const pdfLabel = t('gc.financials.pdf_label', 'PDF') as string

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Corporate Structure') as string}
        title={t('header.title', 'Group Companies') as string}
        description={t('header.description', 'Astonea Labs Limited operates alongside several affiliated entities forming a diversified pharmaceutical and cosmetic group.') as string}
        breadcrumb={[{ label: t('gc.crumb.self', 'Group Companies') as string, href: '/group-companies' }]}
      />

      {/* Companies grid */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('gc.grid.label', 'Corporate Family')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('gc.grid.heading', 'Entities within the Astonea group')}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allForGrid.map((c, i) => {
              const entityCfg = ENTITY_TYPE_KEY[c.entityType]
              const tag = tagStyles[c.entityType] ?? DEFAULT_TAG_STYLE
              const isListed = c.entityType === 'parent'
              const isParent = c.entityType === 'parent'
              const hasFinancials = isParent || hasFinancialsByCompanyId.has(c.id)
              const financialsHref = isParent ? '/financial-results' : `#${financialsAnchorId(c.slug)}`

              return (
                <Reveal key={c.id} delay={i * 60}>
                  <div className="flex flex-col p-8 rounded-2xl border h-full" style={{
                    background: isListed ? 'var(--color-slate-950)' : 'var(--color-surface)',
                    borderColor: isListed ? 'rgba(255,255,255,0.08)' : 'var(--color-border)',
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tag.bg, color: tag.text }}>
                        {t(entityCfg.tag, entityCfg.fallback)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: isListed ? 'white' : 'var(--color-ink)' }}>
                      {c.name}
                    </h3>
                    {c.cin && (
                      <p className="text-xs font-mono mb-3" style={{ color: isListed ? 'rgba(255,255,255,0.55)' : 'var(--color-ink-subtle)' }}>
                        {t('gc.cin_label', 'CIN:')} {c.cin}
                      </p>
                    )}
                    {c.description && (
                      <p className="text-sm leading-relaxed flex-1" style={{ color: isListed ? 'rgba(255,255,255,0.78)' : 'var(--color-ink-muted)' }}>
                        {c.description}
                      </p>
                    )}

                    <div className="mt-6 pt-5 border-t flex flex-wrap items-center gap-2" style={{ borderColor: isListed ? 'rgba(255,255,255,0.08)' : 'var(--color-border)' }}>
                      {hasFinancials ? (
                        isParent ? (
                          <Link
                            href={financialsHref}
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                            style={{ background: 'var(--color-primary-light)', color: 'var(--color-slate-950)' }}
                          >
                            {t('gc.cta.view_financials', 'View Financials')}
                            <span aria-hidden>→</span>
                          </Link>
                        ) : (
                          <a
                            href={financialsHref}
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-colors hover:bg-blue-50"
                            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                          >
                            {t('gc.cta.view_financials', 'View Financials')}
                            <span aria-hidden>↓</span>
                          </a>
                        )
                      ) : (
                        <span
                          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border cursor-not-allowed"
                          style={{
                            borderColor: isListed ? 'rgba(255,255,255,0.12)' : 'var(--color-border)',
                            color: isListed ? 'rgba(255,255,255,0.4)' : 'var(--color-ink-subtle)',
                          }}
                          title={t('gc.cta.unavailable_tooltip', 'No financials available yet') as string}
                        >
                          {t('gc.cta.unavailable', 'Financials Unavailable')}
                        </span>
                      )}
                      {c.websiteUrl && (
                        <a
                          href={c.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-colors hover:bg-blue-50"
                          style={{
                            borderColor: isListed ? 'rgba(255,255,255,0.25)' : 'var(--color-primary)',
                            color: isListed ? 'white' : 'var(--color-primary)',
                          }}
                        >
                          {t('gc.cta.visit_website', 'Visit website')}
                          <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Group financials */}
      {groupsWithFinancials.length > 0 ? (
        <section className="py-14 lg:py-12" style={{ background: 'var(--color-surface)' }}>
          <div className="container-wide">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                {t('gc.financials.label', 'Financial Documents')}
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-4 text-balance" style={{ color: 'var(--color-ink)' }}>
                {t('gc.financials.heading', 'Group company financials')}
              </h2>
              <p className="text-base mb-14 max-w-2xl" style={{ color: 'var(--color-ink-muted)' }}>
                {t('gc.financials.intro_before', 'Annual financial statements for each entity within the Astonea group. For Astonea Labs Limited financials, refer to the ')}
                <Link href="/financial-results" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {t('gc.financials.fr_link', 'Financial Results')}
                </Link>
                {t('gc.financials.intro_middle', ' and ')}
                <Link href="/annual-reports" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {t('gc.financials.ar_link', 'Annual Reports')}
                </Link>
                {t('gc.financials.intro_after', ' pages.')}
              </p>
            </Reveal>

            <div className="space-y-12 max-w-3xl">
              {groupsWithFinancials.map((group, gi) => (
                <Reveal key={group.id} delay={gi * 60}>
                  <div id={financialsAnchorId(group.slug)} className="scroll-mt-32">
                    <h3 className="font-display text-lg font-semibold mb-3 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                      {group.name}
                    </h3>
                    <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                      {group.availableDocs.map((doc) => (
                        <DocRow key={doc.id} doc={doc} fyBadge={fyBadge} pdfLabel={pdfLabel} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
