import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/investor-insights', {
    title: 'Investor Insights',
    description: 'Investor resources for Astonea Labs Limited — disclosures, reports, shareholding, and stakeholder communications.',
  })

const quickLinks = [
  {
    title: 'Meetings',
    desc: 'Notices, intimations and outcomes of Board, Committee and General Meetings.',
    href: '/meetings',
  },
  {
    title: 'Shareholding Pattern',
    desc: 'Quarterly shareholding pattern filings submitted under Regulation 31 of SEBI LODR.',
    href: '/shareholding-pattern',
  },
  {
    title: 'Integrated Fillings',
    desc: 'Integrated governance and financial filings submitted on a quarterly basis to BSE.',
    href: '/integrated-filings',
  },
  {
    title: 'Corporate Announcement',
    desc: 'Material events, intimations and corporate announcements filed with the exchange.',
    href: '/corporate-announcements',
  },
  {
    title: 'Newspaper Publications',
    desc: 'Statutory financial results and notices published in approved newspapers.',
    href: '/newspaper-publications',
  },
  {
    title: 'Investor Grievances',
    desc: 'SEBI SCORES-compliant grievance redressal mechanism for shareholders.',
    href: '/investor-grievances',
  },
  {
    title: 'Registrars and Shares Transfer Agent',
    desc: 'Contact details of the Registrar and Share Transfer Agent for share-related queries.',
    href: '/registrar-share-transfer-agent',
  },
  {
    title: 'Trading Window Closure',
    desc: 'Intimations of trading window closure under SEBI (Prohibition of Insider Trading) Regulations.',
    href: '/trading-window-closure',
  },
  {
    title: 'Related Party Transactions',
    desc: 'Half-yearly disclosures of related party transactions filed under Regulation 23.',
    href: '/related-party-transactions',
  },
]

const keyFacts = [
  { label: 'CIN', value: 'L24304CH2017PLC041482' },
  { label: 'Listed On', value: 'BSE-SME' },
  { label: 'Incorporation', value: '2017 · Chandigarh' },
  { label: 'Sector', value: 'Pharmaceuticals & Cosmetics' },
  { label: 'Registered Office', value: 'SCO 321-322, Basement, Sector 35B, Chandigarh — 160022' },
  { label: 'Investor Contact', value: 'cs@astonea.org' },
]

const irServices = [
  { label: 'Investor Grievances', desc: 'SEBI-compliant investor grievance mechanism' },
  { label: 'Share Transfers', desc: 'Registrar and share transfer agent contact' },
  { label: 'Corporate Announcements', desc: 'Material events and exchange filings' },
  { label: 'Newspaper Publications', desc: 'Statutory notices in approved newspapers' },
]

export default function InvestorInsightsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Investor Insights"
        description="All the information, disclosures, and resources an investor in Astonea Labs Limited needs — in one place."
        breadcrumb={[{ label: 'Investor Insights', href: '/investor-insights' }]}
      />

      {/* Key facts */}
      <section className="py-14 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyFacts.map((f) => (
              <div key={f.label} className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-subtle)' }}>{f.label}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Resources
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Investor resources & disclosures
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((l, i) => (
              <Reveal key={l.title} delay={i * 50}>
                <Link href={l.href} className="group flex flex-col p-6 rounded-2xl border h-full transition-all hover:border-blue-200 hover:shadow-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <span className="font-mono text-xs font-bold tracking-widest mb-5 block" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--color-ink)' }}>{l.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{l.desc}</p>
                  <div className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    View →
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact IR */}
      <section className="py-20" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  Investor Contact
                </p>
                <h2 className="font-display text-3xl font-bold text-white leading-snug mb-5">
                  Questions? Reach our Company Secretary.
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  For investor grievances, shareholding queries, transfer requests, or compliance-related matters —
                  please reach out to our Compliance Officer.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Company Secretary & Compliance Officer</p>
                    <p className="text-sm text-white">Mr. Ankit Kapoor</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Email</p>
                    <a href="mailto:cs@astonea.org" className="text-sm hover:underline" style={{ color: 'var(--color-primary-light)' }}>cs@astonea.org</a>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="grid grid-cols-2 gap-4">
                {irServices.map((item) => (
                  <div key={item.label} className="p-5 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
