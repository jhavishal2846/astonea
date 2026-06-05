import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import CountUp from '@/components/CountUp'

export const metadata: Metadata = {
  title: 'Board of Directors',
  description: 'Meet the Board of Directors of Astonea Labs Limited — governance, expertise, and oversight.',
}

const directors = [
  {
    name: 'Mr. Ashish Gulati',
    designation: 'Founder & Managing Director',
    category: 'Executive',
    image: '/leadership/ashish-gulati.webp',
    bio: 'A visionary leader driving the company\'s evolution into a global hub for pharmaceutical and cosmetic manufacturing. Combines exceptional entrepreneurial insight with strong organizational acumen to spearhead strategic growth and innovation.',
  },
  {
    name: 'Dr. Vikrant Narwal',
    designation: 'Director — R&D & Nutraceuticals',
    category: 'Executive',
    image: '/leadership/vikrant-narwal.webp',
    bio: 'Over 15 years in R&D and 9 years in direct sales and marketing. Has developed over 350 commercial products. Expertise in formulation science, functional nutrition, and market-driven product innovation.',
  },
  {
    name: 'Mrs. Pooja Singh',
    designation: 'Director — Drug Regulatory Affairs',
    category: 'Executive',
    image: '/leadership/pooja-singh.avif',
    bio: 'Over 8 years of experience in Quality Assurance and Drug Regulatory Affairs. Joined the Astonea Labs Board on 14 March 2024 and currently leads the Drug Regulatory Affairs department, ensuring rigorous compliance with all regulatory standards.',
  },
  {
    name: 'Mr. Pradeep Dalal',
    designation: 'Non-Executive Director',
    category: 'Non-Executive',
    image: '/leadership/pradeep-dalal.avif',
    bio: 'Extensive professional experience in finance with strong analytical skills, sound financial understanding, and a commitment to operational excellence across the organization.',
  },
  {
    name: 'Mr. Arun Kumar Tripathi',
    designation: 'Director — Manufacturing & Operations',
    category: 'Executive',
    image: '/leadership/arun-kumar-tripathi.avif',
    bio: 'Over two decades of experience in the pharmaceutical industry with expertise spanning manufacturing, quality assurance, regulatory compliance, and operations management.',
  },
  {
    name: 'Ms. Salina Chalana',
    designation: 'Independent Director',
    category: 'Independent',
    image: '/leadership/salina-chalana.avif',
    bio: 'A decade of experience as a practicing lawyer specializing in legal advocacy and advisory services. Contributes to the company\'s governance framework, fostering transparency and integrity.',
  },
  {
    name: 'Mr. Karan Vir Bindra',
    designation: 'Independent Director',
    category: 'Independent',
    image: '/leadership/karan-vir-bindra.avif',
    bio: 'Over 12 years in corporate governance and compliance. Brings deep expertise in company law, SEBI regulations, and corporate secretarial practice to the board.',
  },
  {
    name: 'Mr. Akash Arora',
    designation: 'Independent Director',
    category: 'Independent',
    image: '/leadership/akash-arora.avif',
    bio: 'Extensive banking and financial sector experience including senior manager roles at HDFC Bank (2016–2019) and Hero FinCorp. Brings deep financial acumen and risk management expertise.',
  },
]

const categoryColors: Record<string, string> = {
  Executive: 'var(--color-primary)',
  'Non-Executive': '#8A6000',
  Independent: '#059669',
}

const count = (cat: string) => directors.filter((d) => d.category === cat).length

const composition = [
  { label: 'Total Directors', value: directors.length, color: 'var(--color-ink)' },
  { label: 'Executive', value: count('Executive'), color: 'var(--color-primary)' },
  { label: 'Non-Executive', value: count('Non-Executive'), color: '#8A6000' },
  { label: 'Independent', value: count('Independent'), color: '#059669' },
]

const principles = [
  {
    title: 'Independent Oversight',
    desc: 'Independent directors bring objective judgement to strategy, audit, and risk — safeguarding the interests of every shareholder.',
    icon: (
      <>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </>
    ),
  },
  {
    title: 'Regulatory Compliance',
    desc: 'The Board upholds SEBI LODR obligations, timely disclosures, and the codes that govern a BSE-listed enterprise.',
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Shareholder Accountability',
    desc: 'Clear reporting lines and committee structures keep management answerable to the Board and its stakeholders.',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
]

function PrincipleIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
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

      {/* Governance overview + composition */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
                  Board Composition
                </p>
                <h2 className="font-display text-3xl font-bold leading-snug text-balance lg:text-4xl" style={{ color: 'var(--color-ink)' }}>
                  Balanced for independent oversight
                </h2>
                <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  Astonea Labs&apos; Board pairs hands-on executive leadership with non-executive and
                  independent oversight — the balance that underpins transparent, accountable governance
                  for a publicly listed company.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div
                className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border"
                style={{ background: 'var(--color-border)', borderColor: 'var(--color-border)' }}
              >
                {composition.map((c) => (
                  <div key={c.label} className="p-7" style={{ background: 'var(--color-bg)' }}>
                    <CountUp
                      to={c.value}
                      className="font-display text-4xl font-bold tabular-nums lg:text-5xl"
                      style={{ color: c.color }}
                    />
                    <p className="mt-2 text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Director cards */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <h2 className="mb-12 font-display text-2xl font-bold lg:text-3xl" style={{ color: 'var(--color-ink)' }}>
              Meet the Board
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {directors.map((d, i) => {
              const accent = categoryColors[d.category]
              return (
                <Reveal key={d.name} delay={i * 60}>
                  <article className="leadership-card flex h-full flex-col overflow-hidden rounded-2xl border bg-surface">
                    {/* Portrait */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={d.image}
                        alt={`Portrait of ${d.name}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-black/[0.06]">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
                        <span style={{ color: accent }}>{d.category}</span>
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="leadership-card__name font-display text-lg font-semibold leading-snug" style={{ color: 'var(--color-ink)' }}>
                        {d.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                        {d.designation}
                      </p>
                      <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                        {d.bio}
                      </p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Governance principles */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              How We Govern
            </p>
            <h2 className="mb-12 font-display text-3xl font-bold leading-snug text-balance lg:text-4xl" style={{ color: 'var(--color-ink)' }}>
              Principles that guide the Board
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border p-8" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <span
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}
                  >
                    <PrincipleIcon>{p.icon}</PrincipleIcon>
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Regulatory footer */}
          <Reveal delay={120}>
            <div
              className="mt-12 flex flex-col gap-5 rounded-2xl border p-7 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-ink-subtle)' }}>
                    CIN
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                    L24304CH2017PLC041482
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-ink-subtle)' }}>
                    Listing
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                    BSE SME
                  </p>
                </div>
                <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  For DIN numbers and complete regulatory disclosures, refer to the company&apos;s filings on the BSE platform.
                </p>
              </div>
              <Link
                href="/corporate-governance"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: 'var(--color-primary)' }}
              >
                Corporate Governance
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
