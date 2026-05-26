import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Key Milestones',
  description: 'Astonea Labs\' journey from incorporation in 2017 to its 2025 BSE SME listing as a pan-India manufacturer.',
}

const milestones = [
  {
    year: '2017',
    title: 'Incorporation',
    events: [
      'Company incorporated under CIN: L24304CH2017PLC041482',
      'Registered office established at SCO 321-322, Sector 35B, Chandigarh',
      'Founded by Mr. Ashish Gulati with a vision to build a global pharma and cosmetics brand',
    ],
  },
  {
    year: '2019',
    title: 'Identity & Scale',
    events: [
      'Company renamed from AHU Laboratories Private Limited to Astonea Labs Private Limited (14 February 2019)',
      'WHO-GMP certification achieved at the manufacturing facility',
      'Manufacturing facility at Haripur, Panchkula established and operationalised',
    ],
  },
  {
    year: '2021',
    title: 'Portfolio Expansion',
    events: [
      'Expanded product portfolio into the cosmetics manufacturing segment',
      '500+ product approvals reached across pharmaceutical categories',
    ],
  },
  {
    year: '2022',
    title: 'Diversification',
    events: [
      'ISO certification achieved, strengthening quality management systems',
      'Export operations initiated to international markets including Iraq and Yemen',
      'Nutraceuticals and AYUSH product lines added to the portfolio',
    ],
  },
  {
    year: '2023',
    title: 'Brand Building',
    events: [
      'Own consumer brand "Glow Up" launched on Amazon and Tata 1MG',
      '"Regero" brand portfolio established',
      'USFDA audit completed for OTC (Over-the-Counter) products',
      'Mr. Pardeep Singh joined the Board as Executive Director (9 October 2023)',
    ],
  },
  {
    year: '2024',
    title: 'Pre-IPO Consolidation',
    events: [
      'Converted from a private limited company to a public limited company — renamed Astonea Labs Limited (2 January 2024)',
      'Mrs. Pooja Singh joined the Board as Director — Drug Regulatory Affairs (14 March 2024)',
      'Astonea LLC incorporated as a Wholly Owned Subsidiary in the USA',
      'Draft Red Herring Prospectus (DRHP) filed with SEBI (16 August 2024)',
    ],
  },
  {
    year: '2025',
    title: 'Capital Markets',
    events: [
      'Initial Public Offering opened 27 May 2025 and closed 29 May 2025',
      'Equity shares listed on BSE SME platform (3 June 2025)',
      '2,000+ active client brands and 1,500+ product approvals across pharma and cosmetics',
      'Pan-India distribution and export-ready operations',
    ],
  },
]

const stats = [
  { value: '2017', label: 'Year Founded' },
  { value: '2,000+', label: 'Client Brands' },
  { value: '1,500+', label: 'Product Approvals' },
  { value: 'BSE SME', label: 'Listed On (Jun 2025)' },
]

export default function KeyMilestonePage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Our Journey"
        title="Key Milestones"
        description="From a Chandigarh startup in 2017 to a BSE SME–listed, pan-India manufacturer in 2025."
        breadcrumb={[{ label: 'Key Milestones', href: '/key-milestone' }]}
      />

      {/* Stats strip */}
      <div style={{ background: 'var(--color-primary)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={[
                  'py-8 px-6 text-center',
                  i < stats.length - 1 ? 'border-r border-white/20' : '',
                ].join(' ')}
              >
                <p className="font-display text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.72)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[72px] lg:left-1/2 top-0 bottom-0 w-px hidden sm:block" style={{ background: 'var(--color-border)' }} />

            <div className="space-y-16">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 80}>
                  <div className={`relative flex flex-col sm:flex-row gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Year badge */}
                    <div className="sm:w-36 lg:w-1/2 flex sm:justify-end lg:justify-end items-start pt-1 flex-shrink-0">
                      <div className={`flex flex-col items-center sm:items-end ${i % 2 !== 0 ? 'lg:items-start' : 'lg:items-end'} sm:pr-10 lg:pr-10 ${i % 2 !== 0 ? 'lg:pl-10 lg:pr-0' : ''}`}>
                        <span className="font-mono text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{m.year}</span>
                        <span className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'var(--color-ink-subtle)' }}>{m.title}</span>
                      </div>
                    </div>

                    {/* Dot on timeline */}
                    <div className="absolute left-[66px] lg:left-1/2 top-1 w-3 h-3 rounded-full border-2 border-white hidden sm:block -translate-x-1.5 lg:-translate-x-1.5" style={{ background: 'var(--color-primary)' }} />

                    {/* Events */}
                    <div className={`lg:w-1/2 sm:pl-10 lg:pl-10 ${i % 2 !== 0 ? 'lg:pl-0 lg:pr-10' : ''}`}>
                      <div className="space-y-px" style={{ background: 'var(--color-border)' }}>
                        {m.events.map((e) => (
                          <div key={e} className="flex items-start gap-4 p-5" style={{ background: 'var(--color-surface)' }}>
                            <div className="pl-3 border-l-2" style={{ borderColor: 'var(--color-primary-light)' }}>
                              <span className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{e}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
