import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'CSR',
  description: 'Astonea Labs\' corporate social responsibility — ecological preservation, social empowerment, and community advancement.',
}

const focusAreas = [
  {
    num: '01',
    title: 'Ecological Preservation',
    desc: 'Promoting eco-conscious manufacturing practices, reducing industrial waste, and supporting environmental stewardship in the communities where we operate.',
  },
  {
    num: '02',
    title: 'Social Empowerment',
    desc: 'Initiatives that uplift individuals through education, skill development, and access to healthcare — creating lasting socioeconomic change.',
  },
  {
    num: '03',
    title: 'Community Advancement',
    desc: 'Direct investment in the welfare and development of communities surrounding our manufacturing and operational footprint in Haryana and Chandigarh.',
  },
]

const principles = [
  'CSR is integrated into every layer of our business strategy — not treated as an afterthought or compliance checkbox',
  'We are committed to sustainability, ethical governance, and societal enrichment as core operating values',
  'Our CSR activities are governed by a formal CSR Policy reviewed and approved by the Board of Directors',
  'The Astonea Foundation acts as the primary vehicle for community engagement and philanthropic activities',
  'All CSR expenditure and activities are disclosed in the Annual Report in accordance with the Companies Act, 2013',
]

export default function CSRPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Corporate Social Responsibility"
        title="CSR"
        description="Sowing responsibility today, reaping a brighter world tomorrow."
        breadcrumb={[{ label: 'CSR', href: '/csr' }]}
      />

      {/* Philosophy */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  Our Philosophy
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Beyond compliance — purpose-driven responsibility
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                  At Astonea Labs, corporate social responsibility goes beyond mandatory compliance. We integrate
                  sustainability, ethical governance, and societal enrichment into the very fabric of our operations —
                  treating every initiative as a deliberate act of foresight for generations yet to come.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  Our approach is guided by a formal CSR Policy approved by the Board of Directors, with activities
                  executed through the <strong>Astonea Foundation</strong> — our dedicated non-profit arm committed
                  to nurturing a resilient and luminous legacy.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="p-10 rounded-3xl" style={{ background: 'var(--color-slate-950)' }}>
                <p className="font-display text-2xl font-semibold italic text-white leading-snug mb-6">
                  "Sowing responsibility today, reaping a brighter world tomorrow."
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  — Astonea Labs CSR Philosophy
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Focus Areas
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Three pillars of our CSR commitment
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-px" style={{ background: 'var(--color-border)' }}>
            {focusAreas.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="flex flex-col gap-4 p-10 h-full" style={{ background: 'var(--color-bg)' }}>
                  <span className="font-display text-4xl font-bold tracking-tighter leading-none select-none" style={{ color: 'var(--color-primary-xlight)' }}>
                    {f.num}
                  </span>
                  <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                Our Commitments
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-10 text-balance" style={{ color: 'var(--color-ink)' }}>
                How we hold ourselves accountable
              </h2>
            </Reveal>
            <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
              {principles.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="flex items-start gap-5 p-6" style={{ background: 'var(--color-surface)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--color-ink-muted)' }}>{p}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="/pdf/CSR Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
                  style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                  View CSR Policy
                </a>
                <a
                  href="/annual-reports"
                  className="inline-flex items-center text-xs font-semibold px-5 py-2.5 rounded-full border transition-colors hover:bg-blue-50"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  View Annual Reports
                </a>
              </div>
              <p className="mt-5 text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                For full details on CSR spending and activities, refer to the CSR section in the company's Annual Report.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
