import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Leadership Panel',
  description: 'Meet the executive team and senior management behind Astonea Labs Limited.',
}

const boardMembers = [
  {
    name: 'Mr. Ashish Gulati',
    title: 'Founder & Managing Director',
    quals: 'Hansraj Public School · Oxford Brookes University (Motorsport Engineering)',
    bio: 'A visionary leader driving the company\'s evolution into a global hub for pharmaceutical and cosmetic manufacturing. Combines exceptional entrepreneurial insight with strong organizational acumen to spearhead strategic growth and innovation.',
  },
  {
    name: 'Mr. Pradeep Dalal',
    title: 'Non-Executive Director',
    quals: 'Bachelor of Arts',
    bio: 'Brings extensive professional experience in finance with strong analytical skills, sound financial understanding, and a commitment to operational excellence.',
  },
  {
    name: 'Mrs. Pooja Singh',
    title: 'Director — Drug Regulatory Affairs',
    quals: 'B. Pharma · Rajeev Gandhi College of Pharmacy',
    bio: 'Over 8 years in Quality Assurance and Drug Regulatory Affairs. Joined the Astonea Labs Board on 14 March 2024 and now leads the Drug Regulatory Affairs department, ensuring rigorous compliance with regulatory standards.',
  },
  {
    name: 'Dr. Vikrant Narwal',
    title: 'Director — R&D & Nutraceuticals',
    quals: 'Ph.D. · ICAR–NDRI',
    bio: 'Over 15 years in R&D and 9 years in direct sales and marketing. Has developed over 350 commercial products, blending scientific precision with market-driven product innovation in formulation science and functional nutrition.',
  },
  {
    name: 'Ms. Salina Chalana',
    title: 'Independent Director',
    quals: 'BA LLB',
    bio: 'A decade of experience as a practicing lawyer specializing in legal advocacy and advisory services. Contributes to the company\'s governance framework, fostering transparency and integrity.',
  },
  {
    name: 'Mr. Karan Vir Bindra',
    title: 'Independent Director',
    quals: 'BCom LLB · Practicing Company Secretary',
    bio: 'Over 12 years in corporate governance and compliance. Brings deep expertise in company law, SEBI regulations, and corporate secretarial practice.',
  },
  {
    name: 'Mr. Akash Arora',
    title: 'Independent Director',
    quals: 'Chartered Accountant (2013) · BCom, S.D. College Muzaffarnagar',
    bio: 'Extensive banking and financial sector experience, including senior manager roles at HDFC Bank and Hero FinCorp. Brings deep financial acumen to the board.',
  },
  {
    name: 'Mr. Arun Kumar Tripathi',
    title: 'Director — Manufacturing & Operations',
    quals: 'B. Pharma (2002)',
    bio: 'Over two decades in the pharmaceutical industry with expertise spanning manufacturing, quality assurance, regulatory compliance, and operations management.',
  },
]

const kmp = [
  {
    name: 'Mr. Sumit Kumar',
    title: 'Chief Financial Officer',
    quals: 'M.Com · MBA · MA Economics',
    bio: 'Over 15 years in finance. Oversees financial strategy and ensures sustainable growth and robust financial health of the organisation.',
  },
  {
    name: 'Mr. Ankit Kapoor',
    title: 'Company Secretary & Compliance Officer',
    quals: 'Associate Member ICSI · BCom (Hons.) · Semi-qualified CA',
    bio: 'Expertise in Corporate Laws, SEBI Regulations, Accounting, and Finance. Ensures full regulatory compliance across listing obligations and corporate secretarial functions.',
  },
]

const seniorManagement = [
  {
    name: 'Mr. Gaurav Kumar',
    title: 'Vice President — Marketing',
    quals: 'Software Engineering · MBA Marketing, BITM Pune',
    bio: 'Manages marketing and sales strategy for the company\'s domestic brand portfolio, driving consumer reach and commercial growth.',
  },
  {
    name: 'Mr. Mushtaque Ahmed',
    title: 'Plant Head',
    quals: 'B. Pharma · 20 years manufacturing experience',
    bio: 'Ensures efficient, compliant, and high-quality production operations across all manufacturing lines at the Panchkula facility.',
  },
]

function PersonCard({ name, title, quals, bio }: { name: string; title: string; quals: string; bio: string }) {
  return (
    <div className="flex flex-col p-8 rounded-2xl border h-full" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-display font-bold text-lg" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
        {name.split(' ').slice(-1)[0][0]}
      </div>
      <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{name}</h3>
      <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>{title}</p>
      <p className="text-xs mb-4 font-mono" style={{ color: 'var(--color-ink-subtle)' }}>{quals}</p>
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{bio}</p>
    </div>
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

      {/* Board */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Board of Directors</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Guiding the company with expertise and integrity
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boardMembers.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <PersonCard {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* KMP */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Key Managerial Personnel</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Operational leadership
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            {kmp.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Management */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Senior Management</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Execution & growth
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            {seniorManagement.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PersonCard {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
