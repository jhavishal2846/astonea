import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Group Companies',
  description: 'The corporate family of Astonea Labs Limited — group entities and affiliated organisations.',
}

const companies = [
  {
    name: 'Astonea Labs Limited',
    type: 'Parent Company',
    cin: 'L24304CH2017PLC041482',
    desc: 'The SEBI-listed parent entity and primary operating company — a pharmaceutical and cosmetic manufacturer headquartered in Chandigarh, India.',
    tag: 'Listed',
  },
  {
    name: 'Ascot Biolabs Private Limited',
    type: 'Group Entity',
    desc: 'Part of the Astonea group structure, operating within the pharmaceutical and biological sciences segment.',
    tag: 'Private',
  },
  {
    name: 'Shinto Organics Private Limited',
    type: 'Group Entity',
    desc: 'An operational entity within the group with activities in organics and chemical-related manufacturing.',
    tag: 'Private',
  },
  {
    name: 'Astonea One Private Limited',
    type: 'Group Entity',
    desc: 'A group company contributing to the diversified operational structure of the Astonea corporate family.',
    tag: 'Private',
  },
  {
    name: 'Astonea Limited',
    type: 'Related Entity',
    desc: 'A related company within the broader Astonea group ecosystem.',
    tag: 'Private',
  },
  {
    name: 'Chemist India Limited',
    type: 'Group Entity',
    desc: 'Part of the corporate structure, engaged in pharmaceutical and chemical sector operations.',
    tag: 'Private',
  },
  {
    name: 'Astonea Foundation',
    type: 'Non-Profit Entity',
    desc: 'The corporate social responsibility arm of the Astonea group — supporting ecological preservation, social empowerment, and community advancement.',
    tag: 'Non-Profit',
  },
]

const tagStyles: Record<string, { bg: string; text: string }> = {
  Listed:     { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  Private:    { bg: 'var(--color-slate-100)',       text: 'var(--color-slate-600)' },
  'Non-Profit': { bg: 'rgba(16,185,129,0.1)',       text: '#059669' },
}

export default function GroupCompaniesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Corporate Structure"
        title="Group Companies"
        description="Astonea Labs Limited operates alongside several affiliated entities forming a diversified pharmaceutical and cosmetic group."
        breadcrumb={[{ label: 'Group Companies', href: '/group-companies' }]}
      />

      {/* Companies grid */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Corporate Family
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Entities within the Astonea group
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c, i) => {
              const tag = tagStyles[c.tag]
              return (
                <Reveal key={c.name} delay={i * 60}>
                  <div className="flex flex-col p-8 rounded-2xl border h-full" style={{
                    background: c.tag === 'Listed' ? 'var(--color-slate-950)' : 'var(--color-surface)',
                    borderColor: c.tag === 'Listed' ? 'rgba(255,255,255,0.08)' : 'var(--color-border)',
                  }}>
                    <div className="flex items-start justify-between mb-5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: tag.bg, color: tag.text }}>
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2" style={{ color: c.tag === 'Listed' ? 'white' : 'var(--color-ink)' }}>
                      {c.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.tag === 'Listed' ? 'var(--color-primary-light)' : 'var(--color-primary)' }}>
                      {c.type}
                    </p>
                    {c.cin && (
                      <p className="text-xs font-mono mb-3" style={{ color: c.tag === 'Listed' ? 'rgba(255,255,255,0.4)' : 'var(--color-ink-subtle)' }}>
                        CIN: {c.cin}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed flex-1" style={{ color: c.tag === 'Listed' ? 'rgba(255,255,255,0.55)' : 'var(--color-ink-muted)' }}>
                      {c.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
