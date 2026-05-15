import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Board of Directors',
  description: 'Meet the Board of Directors of Astonea Labs Limited — governance, expertise, and oversight.',
}

const directors = [
  {
    name: 'Mr. Ashish Gulati',
    designation: 'Founder & Managing Director',
    category: 'Executive',
    qualifications: 'Hansraj Public School; Motorsport Engineering, Oxford Brookes University, UK',
    bio: 'A visionary leader driving the company\'s evolution into a global hub for pharmaceutical and cosmetic manufacturing. Combines exceptional entrepreneurial insight with strong organizational acumen to spearhead strategic growth and innovation.',
  },
  {
    name: 'Mr. Pradeep Dalal',
    designation: 'Non-Executive Director',
    category: 'Non-Executive',
    qualifications: 'Bachelor of Arts',
    bio: 'Extensive professional experience in finance with strong analytical skills, sound financial understanding, and a commitment to operational excellence across the organization.',
  },
  {
    name: 'Mrs. Pooja Singh',
    designation: 'Director',
    category: 'Executive',
    qualifications: 'B. Pharma, Rajeev Gandhi College of Pharmacy',
    bio: 'Over 8 years of experience in Quality Assurance and Drug Regulatory Affairs. Joined Astonea Labs in 2021 and currently leads the Drug Regulatory Affairs department, ensuring rigorous compliance with all regulatory standards.',
  },
  {
    name: 'Dr. Vikrant Narwal',
    designation: 'Director',
    category: 'Executive',
    qualifications: 'Ph.D., ICAR–NDRI',
    bio: 'Over 15 years in R&D and 9 years in direct sales and marketing. Has developed over 350 commercial products. Expertise in formulation science, functional nutrition, and market-driven product innovation.',
  },
  {
    name: 'Mr. Arun Kumar Tripathi',
    designation: 'Director',
    category: 'Executive',
    qualifications: 'B. Pharma (2002)',
    bio: 'Over two decades of experience in the pharmaceutical industry with expertise spanning manufacturing, quality assurance, regulatory compliance, and operations management.',
  },
  {
    name: 'Ms. Salina Chalana',
    designation: 'Independent Director',
    category: 'Independent',
    qualifications: 'BA LLB',
    bio: 'A decade of experience as a practicing lawyer specializing in legal advocacy and advisory services. Contributes to the company\'s governance framework, fostering transparency and integrity.',
  },
  {
    name: 'Mr. Karan Vir Bindra',
    designation: 'Independent Director',
    category: 'Independent',
    qualifications: 'BCom LLB; Practicing Company Secretary',
    bio: 'Over 12 years in corporate governance and compliance. Brings deep expertise in company law, SEBI regulations, and corporate secretarial practice to the board.',
  },
  {
    name: 'Mr. Akash Arora',
    designation: 'Independent Director',
    category: 'Independent',
    qualifications: 'Chartered Accountant (2013); BCom, S.D. College Muzaffarnagar (2010)',
    bio: 'Extensive banking and financial sector experience including senior manager roles at HDFC Bank (2016–2019) and Hero FinCorp. Brings deep financial acumen and risk management expertise.',
  },
]

const categoryColors: Record<string, { bg: string; text: string }> = {
  Executive:    { bg: 'var(--color-primary-xlight)', text: 'var(--color-primary)' },
  'Non-Executive': { bg: 'rgba(232,169,0,0.1)', text: 'var(--color-accent-dark)' },
  Independent:  { bg: 'rgba(16,185,129,0.1)', text: '#059669' },
}

export default function BoardOfDirectorsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Board of Directors"
        description="The Board of Astonea Labs Limited brings together executive leadership, non-executive oversight, and independent expertise."
        breadcrumb={[{ label: 'Investors', href: '/board-of-directors' }, { label: 'Board of Directors', href: '/board-of-directors' }]}
      />

      {/* Board composition summary */}
      <section className="py-16" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl">
            {[
              { label: 'Executive Directors', count: '5', color: 'var(--color-primary)' },
              { label: 'Non-Executive Director', count: '1', color: 'var(--color-accent-dark)' },
              { label: 'Independent Directors', count: '3', color: '#059669' },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-display text-4xl font-bold" style={{ color: item.color }}>{item.count}</span>
                <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-ink-muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Director cards */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directors.map((d, i) => {
              const colors = categoryColors[d.category]
              return (
                <Reveal key={d.name} delay={i * 60}>
                  <div className="flex flex-col p-8 rounded-2xl border h-full" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                        {d.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>
                        {d.category}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{d.name}</h3>
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-primary)' }}>{d.designation}</p>
                    <p className="text-xs font-mono mb-4 leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>{d.qualifications}</p>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{d.bio}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={200}>
            <div className="mt-12 p-6 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>CIN: </span>
                L24304CH2017PLC041482 — For DIN numbers and complete regulatory disclosures, refer to the{' '}
                <Link href="/corporate-governance" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  Corporate Governance
                </Link>{' '}
                section or the company's filings on the BSE/NSE platforms.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
