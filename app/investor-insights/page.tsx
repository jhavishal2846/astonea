import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Investor Insights',
  description: 'Investor resources for Astonea Labs Limited — disclosures, reports, shareholding, and stakeholder communications.',
}

const quickLinks = [
  {
    title: 'Financial Results',
    desc: 'Quarterly and annual audited financial statements from FY 2020-21 onwards.',
    href: '/financial-results',
    icon: '📊',
  },
  {
    title: 'Annual Reports',
    desc: 'Full-year consolidated annual reports with board reports and governance disclosures.',
    href: '/annual-reports',
    icon: '📋',
  },
  {
    title: 'SEBI LODR Reg. 46',
    desc: 'Statutory disclosures under Regulation 46 of the SEBI Listing Obligations regulations.',
    href: '/sebi-lodr-regulation-46-disclosures',
    icon: '📁',
  },
  {
    title: 'SEBI LODR Reg. 30',
    desc: 'Event-based disclosures and material information filings under Regulation 30.',
    href: '/sebi-lodr-regulation-30-disclosures',
    icon: '📌',
  },
  {
    title: 'Corporate Governance',
    desc: 'Board composition, committees, meeting schedules, and governance framework.',
    href: '/corporate-governance',
    icon: '⚖',
  },
  {
    title: 'Governance Policies',
    desc: "Codes of conduct, policies, and frameworks governing the company's operations.",
    href: '/governance-policies-codes-and-frameworks',
    icon: '📜',
  },
  {
    title: 'Board of Directors',
    desc: 'Profiles and details of the Board of Directors overseeing corporate governance.',
    href: '/board-of-directors',
    icon: '👥',
  },
  {
    title: 'Public Offering',
    desc: 'Information relating to IPO, rights issues, and public capital market activities.',
    href: '/public-offering',
    icon: '🏦',
  },
]

const keyFacts = [
  { label: 'CIN', value: 'L24304CH2017PLC041482' },
  { label: 'Listed On', value: 'BSE & NSE' },
  { label: 'Incorporation', value: '2017 · Chandigarh' },
  { label: 'Sector', value: 'Pharmaceuticals & Cosmetics' },
  { label: 'Registered Office', value: 'SCO 321-322, Sector 35B, Chandigarh 160022' },
  { label: 'Investor Contact', value: 'cs@astonea.org' },
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
      <section className="py-16" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
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
                  <span className="text-2xl mb-4">{l.icon}</span>
                  <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors" style={{ color: 'var(--color-ink)' }}>{l.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-ink-muted)' }}>{l.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    View <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
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
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  For investor grievances, shareholding queries, transfer requests, or compliance-related matters —
                  please reach out to our Compliance Officer.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Company Secretary & Compliance Officer</p>
                    <p className="text-sm text-white">Mr. Ankit Kapoor</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</p>
                    <a href="mailto:cs@astonea.org" className="text-sm hover:underline" style={{ color: 'var(--color-primary-light)' }}>cs@astonea.org</a>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Investor Grievances', desc: 'SEBI-compliant investor grievance mechanism' },
                  { label: 'Share Transfers', desc: 'Registrar and share transfer agent contact' },
                  { label: 'Corporate Announcements', desc: 'Material events and exchange filings' },
                  { label: 'Newspaper Publications', desc: 'Statutory notices in approved newspapers' },
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
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
