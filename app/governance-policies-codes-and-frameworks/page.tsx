import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Governance Policies, Codes & Frameworks',
  description: 'Astonea Labs Limited governance policies, codes of conduct, and regulatory frameworks.',
}

const policies = [
  { title: 'Code of Conduct for Board & Senior Management', desc: 'Code of conduct applicable to all Directors, Key Managerial Personnel, and Senior Management personnel of the Company.', href: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
  { title: 'Whistle Blower Policy / Vigil Mechanism', desc: 'Policy enabling directors and employees to report genuine concerns without fear of victimization, in accordance with the Companies Act, 2013.', href: '/pdf/Vigil Mechanism Policy.pdf' },
  { title: 'Nomination & Remuneration Policy', desc: 'Policy governing the criteria for appointment and remuneration of directors, key managerial personnel, and senior management.' },
  { title: 'Related Party Transaction Policy', desc: 'Policy for identification, approval, and monitoring of Related Party Transactions ensuring arm\'s length basis and appropriate disclosure.' },
  { title: 'Risk Management Policy', desc: 'Framework for identification, assessment, monitoring, and mitigation of business risks including financial, operational, and compliance risks.' },
  { title: 'CSR Policy', desc: 'Corporate Social Responsibility policy outlining focus areas, governance, and spending norms in accordance with the Companies Act, 2013.', href: '/pdf/CSR Policy.pdf' },
  { title: 'Material Subsidiary Policy', desc: 'Policy determining criteria for identifying material subsidiaries and governance obligations with respect to such entities.' },
  { title: 'Insider Trading Code (PIT)', desc: 'Code of practices and procedures for fair disclosure of unpublished price-sensitive information under SEBI (Prohibition of Insider Trading) Regulations, 2015.', href: '/pdf/Code of Conduct -PIT.pdf' },
  { title: 'Dividend Distribution Policy', desc: 'Policy governing the factors and parameters for declaration of dividend, balancing shareholder returns and company growth needs.' },
  { title: 'Archival Policy', desc: 'Policy governing the retention and archival of documents and records in compliance with applicable laws and regulations.', href: '/pdf/15. Archival Policy.pdf' },
  { title: 'Policy for Determination of Legitimate Purpose', desc: 'Framework for determining what constitutes a legitimate purpose for sharing Unpublished Price Sensitive Information (UPSI) under SEBI PIT Regulations.', href: '/pdf/Policy for legitimate purpose1.pdf' },
]

const codes = [
  { title: 'Code of Conduct for Board & Senior Management', desc: 'Board-adopted code of conduct applicable to all Directors and Senior Management of the Company.', href: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
  { title: 'Insider Trading Code (PIT)', desc: 'Code under Regulation 9(1) of SEBI (Prohibition of Insider Trading) Regulations, 2015 for prevention of insider trading.', href: '/pdf/Code of Conduct -PIT.pdf' },
  { title: 'Code of Practices & Procedures for Fair Disclosure of UPSI', desc: 'Code under Regulation 8 of SEBI (PIT) Regulations, 2015 ensuring timely, uniform, and fair disclosure of unpublished price-sensitive information.', href: '/pdf/Code of Practices and Procedures for Fair Disclosures 1.pdf' },
]

const frameworks = [
  { title: 'Annual Performance Evaluation Framework', desc: 'Framework for annual evaluation of the performance of the Board of Directors, its Committees, Independent Directors, and Key Managerial Personnel.', href: '/pdf/Annual Performance Evaluation Framework.pdf' },
  { title: 'Board Evaluation Process Document', desc: 'Detailed process document governing how the Board conducts its annual self-evaluation in line with SEBI LODR and Companies Act requirements.', href: '/pdf/Board Evaluation Process Document.pdf' },
  { title: 'Terms & Conditions — Appointment of Independent Directors', desc: 'Formal terms and conditions of appointment applicable to all Independent Directors of the Company, including role, duties, and remuneration framework.', href: '/pdf/T&C- Appointment of Independent Directors.pdf' },
  { title: 'SEBI LODR Compliance Framework', desc: 'Compliance framework under SEBI Listing Obligations and Disclosure Requirements Regulations 2015, governing continuing disclosure obligations.' },
  { title: 'Companies Act 2013 Compliance Framework', desc: 'Governance framework aligned with the Companies Act 2013 and the Rules framed thereunder, including board governance and secretarial compliance.' },
]

function DocRow({ index, title, desc, href }: { index: number; title: string; desc: string; href?: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
        {String(index).padStart(2, '0')}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{desc}</p>
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 transition-colors hover:bg-blue-50" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
          PDF
        </a>
      ) : (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}>
          Soon
        </span>
      )}
    </div>
  )
}

export default function GovernancePoliciesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Governance Policies, Codes & Frameworks"
        description="The formal policies, codes, and regulatory frameworks that govern Astonea Labs Limited's operations and ethics."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
        ]}
      />

      {/* Policies */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Policies
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Board-approved governance policies
            </h2>
          </Reveal>
          <div className="space-y-3 max-w-3xl">
            {policies.map((p, i) => (
              <Reveal key={p.title} delay={i * 40}>
                <DocRow index={i + 1} {...p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Codes */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Codes of Conduct
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Codes governing conduct & disclosure
            </h2>
          </Reveal>
          <div className="space-y-3 max-w-3xl">
            {codes.map((c, i) => (
              <Reveal key={c.title} delay={i * 40}>
                <DocRow index={i + 1} {...c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Frameworks
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Frameworks governing compliance & evaluation
            </h2>
          </Reveal>
          <div className="space-y-3 max-w-3xl">
            {frameworks.map((f, i) => (
              <Reveal key={f.title} delay={i * 40}>
                <DocRow index={i + 1} {...f} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-10 text-sm max-w-2xl" style={{ color: 'var(--color-ink-subtle)' }}>
              All policies are reviewed periodically by the Board of Directors. For the most current versions of any policy document, contact <a href="mailto:cs@astonea.org" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>cs@astonea.org</a>.
              CIN: L24304CH2017PLC041482.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
