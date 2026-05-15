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
  { label: 'Listed On', value: 'BSE (Bombay Stock Exchange) & NSE (National Stock Exchange)' },
  { label: 'Year of Listing', value: '2021' },
  { label: 'Sector', value: 'Pharmaceuticals & Cosmetics Manufacturing' },
  { label: 'Registered Office', value: 'SCO 321-322, Basement, Sector 35B, Chandigarh — 160022' },
  { label: 'Compliance Officer', value: 'Mr. Ankit Kapoor, Company Secretary' },
  { label: 'Investor Contact', value: 'cs@astonea.org' },
]

const documents = [
  { title: 'Prospectus / Offer Document', desc: 'Draft Red Herring Prospectus (DRHP) and final Prospectus filed with SEBI at the time of IPO.' },
  { title: 'Share Allotment Details', desc: 'Details of shares allotted to various categories of investors during the public offering.' },
  { title: 'Basis of Allotment', desc: 'Basis of allotment of equity shares as determined by the Registrar to the Issue.' },
  { title: 'Listing Agreement', desc: 'Equity listing agreement executed with BSE and NSE at the time of listing of equity shares.' },
  { title: 'Post-Issue Capital Structure', desc: 'Details of the company\'s share capital as at the time of listing and subsequently.' },
  { title: 'Registrar & Share Transfer Agent', desc: 'Details of the Registrar and Share Transfer Agent appointed for the IPO and ongoing shareholder services.' },
]

export default function PublicOfferingPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Investor Relations"
        title="Public Offering"
        description="Astonea Labs Limited is a publicly listed company on BSE and NSE — listed in 2021 under CIN L24304CH2017PLC041482."
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
                  SEBI-listed on BSE & NSE since 2021
                </h2>
                <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                  Astonea Labs Limited became a publicly listed company in 2021, listed on both the Bombay Stock
                  Exchange (BSE) and the National Stock Exchange (NSE) of India. The listing represented a significant
                  milestone in the company's growth journey, enabling access to public capital markets and enhancing
                  governance transparency.
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  The company is committed to maintaining full compliance with SEBI Listing Obligations and Disclosure
                  Requirements (LODR) Regulations and all applicable securities laws, ensuring continued protection of
                  shareholder interests.
                </p>
              </div>
            </Reveal>

            <StaggerReveal className="space-y-3">
              {listingDetails.map((d) => (
                <div key={d.label} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
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
          <div className="space-y-3 max-w-3xl">
            {documents.map((d, i) => (
              <Reveal key={d.title} delay={i * 50}>
                <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-xlight)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{d.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{d.desc}</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                    PDF
                  </span>
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
