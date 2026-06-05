import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Public Offering',
  description: 'Astonea Labs Limited public offering information — IPO, listing, and capital markets.',
}

const listingDetails = [
  { label: 'Company Name', value: 'Astonea Labs Limited' },
  { label: 'CIN', value: 'L24304CH2017PLC041482' },
  { label: 'Listed On', value: 'BSE SME (Bombay Stock Exchange)' },
  { label: 'Date of Listing', value: '3 June 2025' },
  { label: 'Sector', value: 'Pharmaceuticals & Cosmetics Manufacturing' },
  { label: 'Registered Office', value: 'SCO 321-322, Basement, Sector 35B, Chandigarh — 160022' },
  { label: 'Compliance Officer', value: 'Mr. Ankit Kapoor, Company Secretary' },
  { label: 'Investor Contact', value: 'cs@astonea.org' },
]

const documents = [
  { title: 'Draft Red Herring Prospectus (DRHP)', desc: 'Draft Red Herring Prospectus dated August 16, 2024 filed with SEBI prior to the IPO.', href: '/pdf/Draft Red Herring Prospectus (DRHP).pdf' },
  { title: 'Red Herring Prospectus (RHP)', desc: 'Red Herring Prospectus dated May 15, 2025 filed with the Registrar of Companies.', href: '/pdf/Red Herring Prospectus(PDF).pdf' },
  { title: 'Prospectus', desc: 'Final Prospectus dated May 30, 2025 — the definitive offer document for the IPO.', href: '/pdf/Prospectus.pdf' },
  { title: 'Share Allotment Details', desc: 'Details of shares allotted to various categories of investors during the public offering.' },
  { title: 'Basis of Allotment', desc: 'Basis of allotment of equity shares as determined by the Registrar to the Issue.' },
  { title: 'Listing Agreement', desc: 'Equity listing agreement executed with BSE at the time of listing of equity shares.' },
  { title: 'Post-Issue Capital Structure', desc: 'Details of the company\'s share capital as at the time of listing and subsequently.' },
  { title: 'Registrar & Share Transfer Agent', desc: 'Details of the Registrar and Share Transfer Agent appointed for the IPO and ongoing shareholder services.' },
]

export default function PublicOfferingPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Public Offering"
        description="Astonea Labs Limited is a publicly listed company on BSE SME — listed on 3 June 2025 under CIN L24304CH2017PLC041482."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Public Offering', href: '/public-offering' },
        ]}
      />

      {/* Listing overview */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  Listing Overview
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  BSE-SME on BSE SME since June 2025
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                  Astonea Labs Limited became a publicly listed company in 2025 — the IPO opened on 27 May 2025,
                  closed on 29 May 2025, and equity shares were listed on the BSE SME platform on 3 June 2025.
                  The listing represented a significant milestone in the company's growth journey, enabling
                  access to public capital markets and enhancing governance transparency.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  The company is committed to maintaining full compliance with SEBI Listing Obligations and Disclosure
                  Requirements (LODR) Regulations and all applicable securities laws, ensuring continued protection of
                  shareholder interests.
                </p>
              </div>
            </Reveal>

            <StaggerReveal className="space-y-px" style={{ background: 'var(--color-border)' }}>
              {listingDetails.map((d) => (
                <div key={d.label} className="flex items-start gap-4 p-4" style={{ background: 'var(--color-surface)' }}>
                  <p className="text-xs font-semibold w-40 flex-shrink-0" style={{ color: 'var(--color-ink-subtle)' }}>{d.label}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{d.value}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Offering Documents
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              IPO & listing documents
            </h2>
          </Reveal>
          <div className="space-y-px max-w-3xl" style={{ background: 'var(--color-border)' }}>
            {documents.map((d, i) => (
              <Reveal key={d.title} delay={i * 50}>
                <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-bg)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{d.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{d.desc}</p>
                  </div>
                  {'href' in d && d.href ? (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                      PDF
                    </a>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
                      Soon
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10 p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-subtle)' }}>
                For IPO-related queries, contact the Company Secretary at{' '}
                <a href="mailto:cs@astonea.org" style={{ color: 'var(--color-primary)' }}>cs@astonea.org</a>.
                For ongoing disclosures, refer to{' '}
                <Link href="/sebi-lodr-regulation-46-disclosures" className="hover:underline" style={{ color: 'var(--color-primary)' }}>SEBI Reg. 46</Link> and{' '}
                <Link href="/sebi-lodr-regulation-30-disclosures" className="hover:underline" style={{ color: 'var(--color-primary)' }}>SEBI Reg. 30</Link> disclosure pages.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
