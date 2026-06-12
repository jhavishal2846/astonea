import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Meetings',
  description: 'Notices, intimations and outcomes of Annual General Meetings, Extra-Ordinary General Meetings and Board Meetings of Astonea Labs Limited.',
}

const categories = [
  {
    title: 'Annual General Meetings (AGM)',
    desc: 'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings.',
    href: '/agm',
  },
  {
    title: 'Extra-Ordinary General Meetings (EGM)',
    desc: 'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings.',
    href: '/egm',
  },
  {
    title: 'Board Meetings',
    desc: 'Intimations and outcomes of meetings of the Board of Directors.',
    href: '/board-meetings',
  },
]

export default function MeetingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Meetings"
        description="Notices, intimations and outcomes of Board, Committee and General Meetings of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Meetings', href: '/meetings' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Categories
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Browse meeting disclosures
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
