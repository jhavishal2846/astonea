import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/governance-policies-codes-and-frameworks', {
    title: 'Governance Policies, Codes & Frameworks',
    description: 'Astonea Labs Limited governance policies, codes of conduct, and regulatory frameworks.',
  })

const categories = [
  {
    title: 'Policies',
    desc: 'Board-approved governance policies covering POSH, RPT, succession, board diversity and more.',
    href: '/policies',
  },
  {
    title: 'Codes',
    desc: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.',
    href: '/codes',
  },
  {
    title: 'Frameworks',
    desc: 'Frameworks governing compliance, evaluation and board processes.',
    href: '/frameworks',
  },
]

export default function GovernancePoliciesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Governance Policies, Codes & Frameworks"
        description="The formal policies, codes, and regulatory frameworks that govern Astonea Labs Limited's operations and ethics."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Categories
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Browse governance documents
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.title} delay={i * 50}>
                <Link href={c.href} className="group flex flex-col p-6 rounded-2xl border h-full transition-all hover:border-blue-200 hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="font-mono text-xs font-bold tracking-widest mb-5 block" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>{c.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{c.desc}</p>
                  <div className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    View →
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
