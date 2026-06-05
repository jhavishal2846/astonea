import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Leadership Panel',
  description: 'Meet the executive team and senior management behind Astonea Labs Limited.',
}

type Person = {
  name: string
  title: string
  bio: string
  img?: string
}

const founder: Person = {
  name: 'Mr. Ashish Gulati',
  title: 'Founder & Managing Director',
  bio: 'A visionary leader driving the company\'s evolution into a global hub for pharmaceutical and cosmetic manufacturing. Combines exceptional entrepreneurial insight with strong organizational acumen to spearhead strategic growth and innovation.',
  img: '/leadership/ashish-gulati.webp',
}

const boardMembers: Person[] = [
  {
    name: 'Dr. Vikrant Narwal',
    title: 'Director — R&D & Nutraceuticals',
    bio: 'Over 15 years in R&D and 9 years in direct sales and marketing. Has developed over 350 commercial products, blending scientific precision with market-driven product innovation in formulation science and functional nutrition.',
    img: '/leadership/vikrant-narwal.webp',
  },
  {
    name: 'Mrs. Pooja Singh',
    title: 'Director — Drug Regulatory Affairs',
    bio: 'Over 8 years in Quality Assurance and Drug Regulatory Affairs. Joined the Astonea Labs Board on 14 March 2024 and now leads the Drug Regulatory Affairs department, ensuring rigorous compliance with regulatory standards.',
    img: '/leadership/pooja-singh.avif',
  },
  {
    name: 'Mr. Pradeep Dalal',
    title: 'Non-Executive Director',
    bio: 'Brings extensive professional experience in finance with strong analytical skills, sound financial understanding, and a commitment to operational excellence.',
    img: '/leadership/pradeep-dalal.avif',
  },
  {
    name: 'Mr. Arun Kumar Tripathi',
    title: 'Director — Manufacturing & Operations',
    bio: 'Over two decades in the pharmaceutical industry with expertise spanning manufacturing, quality assurance, regulatory compliance, and operations management.',
    img: '/leadership/arun-kumar-tripathi.avif',
  },
  {
    name: 'Ms. Salina Chalana',
    title: 'Independent Director',
    bio: 'A decade of experience as a practicing lawyer specializing in legal advocacy and advisory services. Contributes to the company\'s governance framework, fostering transparency and integrity.',
    img: '/leadership/salina-chalana.avif',
  },
  {
    name: 'Mr. Karan Vir Bindra',
    title: 'Independent Director',
    bio: 'Over 12 years in corporate governance and compliance. Brings deep expertise in company law, SEBI regulations, and corporate secretarial practice.',
    img: '/leadership/karan-vir-bindra.avif',
  },
  {
    name: 'Mr. Akash Arora',
    title: 'Independent Director',
    bio: 'Extensive banking and financial sector experience, including senior manager roles at HDFC Bank and Hero FinCorp. Brings deep financial acumen to the board.',
    img: '/leadership/akash-arora.avif',
  },
]

const kmp: Person[] = [
  {
    name: 'Mr. Sumit Kumar',
    title: 'Chief Financial Officer',
    bio: 'Over 15 years in finance. Oversees financial strategy and ensures sustainable growth and robust financial health of the organisation.',
    img: '/leadership/sumit-kumar.avif',
  },
  {
    name: 'Mr. Ankit Kapoor',
    title: 'Company Secretary & Compliance Officer',
    bio: 'Expertise in Corporate Laws, SEBI Regulations, Accounting, and Finance. Ensures full regulatory compliance across listing obligations and corporate secretarial functions.',
    img: '/leadership/ankit-kapoor.avif',
  },
]

const seniorManagement: Person[] = [
  {
    name: 'Mr. Gaurav Kumar',
    title: 'Vice President — Marketing',
    bio: 'Manages marketing and sales strategy for the company\'s domestic brand portfolio, driving consumer reach and commercial growth.',
    img: '/leadership/gaurav-kumar.avif',
  },
  {
    name: 'Mr. Mushtaque Ahmed',
    title: 'Plant Head',
    bio: 'Ensures efficient, compliant, and high-quality production operations across all manufacturing lines at the Panchkula facility.',
    img: '/leadership/mushtaque-ahmed.avif',
  },
]

function PortraitFrame({ img, name }: { img?: string; name: string }) {
  const initial = name.split(' ').slice(-1)[0][0]
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
      {img ? (
        <Image
          src={img}
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display text-7xl font-bold"
          style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}
          aria-label={`Portrait placeholder for ${name}`}
        >
          {initial}
        </div>
      )}
    </div>
  )
}

function PersonCard({ person }: { person: Person }) {
  return (
    <article className="leadership-card flex h-full flex-col overflow-hidden rounded-2xl border bg-surface">
      <PortraitFrame img={person.img} name={person.name} />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="leadership-card__name font-display text-lg font-semibold leading-snug" style={{ color: 'var(--color-ink)' }}>
          {person.name}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
          {person.title}
        </p>
        <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          {person.bio}
        </p>
      </div>
    </article>
  )
}

function FounderCard({ person }: { person: Person }) {
  return (
    <article
      className="group relative grid overflow-hidden rounded-3xl border bg-surface lg:grid-cols-[5fr_7fr]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Decorative accent stripe */}
      <span
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%)' }}
        aria-hidden="true"
      />
      <span
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-primary-xlight) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-full">
        {person.img && (
          <Image
            src={person.img}
            alt={`Portrait of ${person.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-center"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,20,0) 55%, rgba(10,10,20,0.55) 100%)',
          }}
        />
      </div>

      <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-14">
        <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: 'var(--color-primary)' }}>
          <span className="h-px w-10" style={{ background: 'var(--color-primary)' }} />
          Founder &amp; Managing Director
        </p>
        <h3
          className="mt-5 font-display font-bold leading-[1.05] tracking-tight text-balance"
          style={{ color: 'var(--color-ink)', fontSize: 'clamp(2rem, 3.4vw, 3.5rem)' }}
        >
          {person.name}
        </h3>
        <p className="mt-6 max-w-[52ch] text-base leading-[1.85]" style={{ color: 'var(--color-ink-muted)' }}>
          {person.bio}
        </p>
        <div className="mt-8 flex items-center gap-6 border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: 'var(--color-ink-subtle)' }}>
            Astonea Labs Limited
          </p>
          <span className="h-1 w-1 rounded-full" style={{ background: 'var(--color-ink-subtle)' }} aria-hidden="true" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: 'var(--color-ink-subtle)' }}>
            Chandigarh, India
          </p>
        </div>
      </div>
    </article>
  )
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
        {kicker}
      </p>
      <h2
        className="font-display text-3xl font-bold leading-snug text-balance lg:text-4xl"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}
      </h2>
    </Reveal>
  )
}

export default function LeadershipPanelPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="People"
        title="Leadership Panel"
        description="The experienced team of directors, executives, and managers driving Astonea Labs forward."
        breadcrumb={[{ label: 'Leadership Panel', href: '/leadership-panel' }]}
      />

      {/* Founder feature */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-12 lg:mb-14">
            <SectionHeader kicker="Founder" title="The vision behind Astonea" />
          </div>
          <Reveal>
            <FounderCard person={founder} />
          </Reveal>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="mb-12 lg:mb-14">
            <SectionHeader kicker="Board of Directors" title="Guiding the company with expertise and integrity" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boardMembers.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* KMP */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-12 lg:mb-14">
            <SectionHeader kicker="Key Managerial Personnel" title="Finance &amp; compliance" />
          </div>
          <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
            {kmp.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Management */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="mb-12 lg:mb-14">
            <SectionHeader kicker="Senior Management" title="Execution &amp; growth" />
          </div>
          <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
            {seniorManagement.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
