import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Board-approved governance policies of Astonea Labs Limited.',
}

type Item = { title: string; fileUrl?: string }

const ITEMS: Item[] = [
  { title: 'Policy on POSH',                                              fileUrl: '/pdf/policies/Posh Policy.pdf' },
  { title: 'Nomination and Remuneration Policy',                          fileUrl: '/pdf/policies/Nomination and Remuneration Policy.pdf' },
  { title: 'Policy on Identification of Group Companies, Material Creditors', fileUrl: '/pdf/policies/Policy on Identificaton of Group Companies, Material Creditors.pdf' },
  { title: 'Policy for Determining Material Subsidiaries',                fileUrl: '/pdf/policies/21. Material Subsidiary.pdf' },
  { title: 'Policy on Dealing with RPT',                                  fileUrl: '/pdf/policies/Policy on dealing with RPT.pdf' },
  { title: 'Archival Policy / Policy for Preservation of Documents',      fileUrl: '/pdf/policies/15. Archival Policy.pdf' },
  { title: 'Vigil Mechanism Policy / Whistle Blower Policy',              fileUrl: '/pdf/policies/Vigil Mechanism Policy.pdf' },
  { title: 'Policy for Determination of Material Events',                 fileUrl: '/pdf/policies/Policy for determination of material events.pdf' },
  { title: 'Succession Planning Policy',                                  fileUrl: '/pdf/policies/Succession Planning Policy.pdf' },
  { title: 'Policy on Board Diversity',                                   fileUrl: '/pdf/policies/Policy on Board Diversity.pdf' },
  { title: 'Policy for Determination of Legitimate Purpose',              fileUrl: '/pdf/policies/Policy for legitimate purpose1.pdf' },
]

export default function PoliciesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Governance"
        title="Policies"
        description="Board-approved governance policies of Astonea Labs Limited."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'Governance Policies', href: '/governance-policies-codes-and-frameworks' },
          { label: 'Policies', href: '/policies' },
        ]}
      />

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
              {ITEMS.map((item, i) => (
                <Reveal key={item.title} delay={i * 25}>
                  <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                    </div>
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                        PDF
                      </a>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                        Soon
                      </span>
                    )}
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
