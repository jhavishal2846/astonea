import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 30 Disclosures',
  description: 'Event-based disclosures by Astonea Labs Limited under SEBI LODR Regulation 30.',
}

type Reg30Event = {
  title: string
  date?: string
  fileUrl?: string
  description?: string
}

const EVENTS: Reg30Event[] = [
  { title: 'Re-appointment of Secretarial Auditor', date: '30 May 2026', fileUrl: '/pdf/Reappointment of Secretarial Auditor.pdf' },
  { title: 'Re-appointment of Cost Auditor',        date: '30 May 2026', fileUrl: '/pdf/Reappointment of Cost Auditor.pdf' },
  { title: 'Re-appointment of Tax Auditor',         date: '30 May 2026', fileUrl: '/pdf/Reappointment of Tax Auditor.pdf' },
  { title: 'Board Meeting Outcome',                 date: '30 May 2026', fileUrl: '/pdf/BM Outcome 30.05.2026.pdf' },
  { title: 'Intimation Under Reg 30 — Fire Incident',            date: '27 Apr 2026', fileUrl: '/pdf/Intimation under Reg 30- Fire Incident.pdf' },
  { title: 'Acquisition',                                        date: '31 Mar 2026', fileUrl: '/pdf/Acquisition.pdf' },
  { title: 'New Set of AOA',                                     date: '27 Mar 2026', fileUrl: '/pdf/AOA Adoption approved.pdf' },
  { title: 'Approval of Variation in the Objects of Initial Public Offer (IPO)', date: '27 Mar 2026', fileUrl: '/pdf/Variation Approval.pdf' },
  { title: 'Proceedings of EGM',                                 date: '27 Mar 2026', fileUrl: '/pdf/EGM Proceedings-27.03.2026.pdf' },
  { title: 'Board Meeting Outcome',                              date: '27 Feb 2026', fileUrl: '/pdf/outcome 27th Feb 2026.pdf' },
  { title: 'Acquisition of Immovable Property (Land)',           date: '13 Feb 2026', fileUrl: '/pdf/Reg 30- Intimation- Acquisition of Land.pdf' },
  { title: 'Board Meeting Outcome',                              date: '06 Feb 2026', fileUrl: '/pdf/Board Meeting -Outcome 6feb2026.pdf' },
  { title: 'Incorporation of WOS — USA',                         date: '26 Jan 2026', fileUrl: '/pdf/Incorporation of WOS- USA.pdf' },
  { title: 'Change in Management',                               date: '27 Dec 2025', fileUrl: '/pdf/Change in Management- Dec 25.pdf' },
  { title: 'Proceedings of AGM',                                 date: '27 Dec 2025', fileUrl: '/pdf/Proceedings of AGM 27 Dec 2025.pdf' },
  { title: 'Appointment of CS',                                  date: '03 Dec 2025', fileUrl: '/pdf/Appointment of Company Secretary- Dec 25.pdf' },
  { title: 'Board Meeting Outcome',                              date: '03 Dec 2025', fileUrl: '/pdf/03rd Dec, 2025.pdf' },
  { title: 'Change in Management',                               date: '10 Nov 2025', fileUrl: '/pdf/Change in Management- Nov 25.pdf' },
  { title: 'Board Meeting Outcome',                              date: '10 Nov 2025', fileUrl: '/pdf/10th Nov, 2025.pdf' },
  { title: 'Resignation of CS',                                  date: '20 Sep 2025', fileUrl: '/pdf/Resignation of Company Secretary- Sep 25.pdf' },
  { title: 'Board Meeting Outcome',                              date: '20 Sep 2025', fileUrl: '/pdf/20th Sep, 2025.pdf' },
  { title: 'AGM Extension (Approved)',                           date: '11 Sep 2025', fileUrl: '/pdf/AGM Extension (Approved).pdf' },
  { title: 'Appointment of CS',                                  date: '01 Sep 2025', fileUrl: '/pdf/Appointment of Company Secretary- Sep 25.pdf' },
  { title: 'AGM Extension',                                      date: '26 Aug 2025', fileUrl: '/pdf/AGM Extension.pdf' },
  { title: 'Board Meeting Outcome',                              date: '11 Jul 2025', fileUrl: '/pdf/11th July, 2025.pdf' },
  { title: 'Resignation of CS',                                  date: '10 Jun 2025', fileUrl: '/pdf/Resignation of Company Secretary- June 25.pdf' },
]

export default function Regulation30Page() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="SEBI Disclosures"
        title="SEBI LODR Regulation 30 Disclosures"
        description="Event-based material disclosures filed with BSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
        ]}
      />

      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              <strong>Regulation 30 — SEBI LODR, 2015:</strong> All listed companies must promptly disclose material
              events and information to the stock exchanges. The following disclosures have been filed with BSE
              by Astonea Labs Limited (CIN: L24304CH2017PLC041482).
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
              {EVENTS.map((event, i) => (
                <Reveal key={`${event.title}-${event.date ?? i}`} delay={i * 25}>
                  <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{event.title}</p>
                        {event.date && (
                          <span className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                            {event.date}
                          </span>
                        )}
                      </div>
                      {event.description && <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--color-ink-muted)' }}>{event.description}</p>}
                    </div>
                    {event.fileUrl ? (
                      <a
                        href={event.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50"
                        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                      >
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

          <Reveal delay={300}>
            <div className="mt-12 max-w-3xl">
              <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                All Regulation 30 disclosures are filed with BSE and are available on the exchange portal.
                Search using CIN: L24304CH2017PLC041482.
                Website disclosures under Regulation 46 are available{' '}
                <Link href="/sebi-lodr-regulation-46-disclosures" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  here
                </Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
