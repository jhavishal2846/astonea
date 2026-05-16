import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

export const metadata: Metadata = {
  title: 'SEBI LODR Regulation 30 Disclosures',
  description: 'Event-based disclosures by Astonea Labs Limited under SEBI LODR Regulation 30.',
}

const eventCategories = [
  {
    heading: 'Board Meeting Outcomes',
    items: [
      { title: 'Outcome of Board Meeting — 27th February 2026', date: '27 Feb 2026', desc: 'Board approved variation in the objects of the IPO for deployment towards acquisition of equity stake in Damaira Pharmaceuticals.', href: '/pdf/outcome 27th Feb 2026.pdf' },
      { title: 'Outcome of Board Meeting — 6th February 2026', date: '06 Feb 2026', desc: 'Board approved acquisition/purchase of immovable property (land) at Village Haripur, Panchkula for expansion of manufacturing facility.', href: '/pdf/Board Meeting -Outcome 6feb2026.pdf' },
      { title: 'Outcome of Board Meeting — 3rd December 2025', date: '03 Dec 2025', desc: 'Board approved appointment of Mr. Ankit Kapoor as Company Secretary and Compliance Officer.', href: '/pdf/Appointment of Company Secretary- Dec 25.pdf' },
      { title: 'Outcome of Board Meeting — 10th November 2025', date: '10 Nov 2025', desc: 'Board approved appointment of Additional Director and other matters.', href: '/pdf/Change in Management- Nov 25.pdf' },
      { title: 'Outcome of Board Meeting — 20th September 2025', date: '20 Sep 2025', desc: 'Board approved resignation of Company Secretary and re-appointment of Cost Auditors for FY 2025-26.', href: '/pdf/20th Sep, 2025.pdf' },
      { title: 'Outcome of Board Meeting — 1st September 2025', date: '01 Sep 2025', desc: 'Board approved appointment of new Company Secretary.', href: '/pdf/Appointment of Company Secretary- Sep 25.pdf' },
      { title: 'Outcome of Board Meeting — 11th July 2025', date: '11 Jul 2025', desc: 'Board meeting outcome including RTA change and other matters.', href: '/pdf/11th July, 2025.pdf' },
    ],
  },
  {
    heading: 'AGM & EGM',
    items: [
      { title: 'Proceedings of EGM — 27th March 2026', date: '27 Mar 2026', desc: 'Shareholders approved variation in IPO objects and adoption of new Articles of Association at the Extraordinary General Meeting.', href: '/pdf/EGM Proceedings-27.03.2026.pdf' },
      { title: 'Proceedings of 8th AGM — 27th December 2025', date: '27 Dec 2025', desc: '8th Annual General Meeting proceedings including regularisation of directors and approval of equity acquisition in Damaira Pharmaceuticals.', href: '/pdf/Proceedings of AGM 27 Dec 2025.pdf' },
      { title: 'AGM Extension — Approval by ROC', date: '11 Sep 2025', desc: 'ROC, Punjab & Chandigarh granted 3-month extension to hold the 8th Annual General Meeting.', href: '/pdf/AGM Extension (Approved).pdf' },
      { title: 'AGM Extension — Intimation to Apply', date: '26 Aug 2025', desc: 'Intimation to BSE regarding application for extension of AGM due date under Section 96 of the Companies Act, 2013.', href: '/pdf/AGM Extension.pdf' },
    ],
  },
  {
    heading: 'Director & KMP Changes',
    items: [
      { title: 'Regularisation of Directors (AGM)', date: '27 Dec 2025', desc: 'Regularisation of directors at the 8th Annual General Meeting.', href: '/pdf/Change in Management- Dec 25.pdf' },
      { title: 'Appointment of CS — Mr. Ankit Kapoor', date: '03 Dec 2025', desc: 'Appointment of Mr. Ankit Kapoor as Company Secretary and Compliance Officer w.e.f. 03.12.2025.', href: '/pdf/Appointment of Company Secretary- Dec 25.pdf' },
      { title: 'Appointment of Additional Director', date: '10 Nov 2025', desc: 'Appointment of Additional Director on the Board of the Company.', href: '/pdf/Change in Management- Nov 25.pdf' },
      { title: 'Resignation of CS — Mr. Vijay Kumar', date: '20 Sep 2025', desc: 'Resignation of Mr. Vijay Kumar as Company Secretary, KMP and Compliance Officer w.e.f. 20.09.2025.', href: '/pdf/Resignation of Company Secretary- Sep 25.pdf' },
      { title: 'Appointment of CS — September 2025', date: '01 Sep 2025', desc: 'Appointment of new Company Secretary at Board meeting held on 1st September 2025.', href: '/pdf/Appointment of Company Secretary- Sep 25.pdf' },
      { title: 'Resignation of CS — Ms. Avneet Kaur', date: '10 Jun 2025', desc: 'Resignation of Ms. Avneet Kaur as Company Secretary, KMP and Compliance Officer.', href: '/pdf/Resignation of Company Secretary- June 25.pdf' },
    ],
  },
  {
    heading: 'Structural Changes',
    items: [
      { title: 'Adoption of New Articles of Association', date: '27 Mar 2026', desc: 'Shareholders approved adoption of a new set of Articles of Association at the EGM held on 27th March 2026.', href: '/pdf/AOA Adoption approved.pdf' },
      { title: 'Incorporation of WOS — Astonea LLC (USA)', date: '26 Jan 2026', desc: 'Astonea Labs Limited incorporated a wholly-owned foreign subsidiary, Astonea LLC, in Sheridan, Wyoming, USA.', href: '/pdf/Incorporation of WOS- USA.pdf' },
    ],
  },
  {  
    heading: 'IPO & Acquisitions',
    items: [
      { title: 'Acquisition of Equity Stake — Damaira Pharmaceuticals', date: '31 Mar 2026', desc: 'Astonea Labs acquired approximately 25.74% equity stake in Damaira Pharmaceuticals Private Limited for INR 6.25 Crores.', href: '/pdf/Acquisition.pdf' },
      { title: 'Approval of Variation in IPO Objects', date: '27 Mar 2026', desc: 'Members approved variation in the objects of the IPO at the EGM, enabling revised utilisation of unutilised IPO proceeds.', href: '/pdf/Variation Approval.pdf' },
    ],
  },
  {
    heading: 'Property & Operations',
    items: [
      { title: 'Fire Incident — Haripur Manufacturing Facility', date: '27 Apr 2026', desc: 'Intimation under Reg 30 regarding inadvertent fire incident at the manufacturing facility at Village Haripur, Panchkula. No human injury reported; production temporarily suspended.', href: '/pdf/Intimation under Reg 30- Fire Incident.pdf' },
      { title: 'Acquisition of Immovable Property — Land', date: '13 Feb 2026', desc: 'Execution and registration of Sale Deed for acquisition of land at Village Haripur, Tehsil Raipur Rani, Panchkula for expansion of manufacturing facility.', href: '/pdf/Reg 30- Intimation- Acquisition of Land.pdf' },
    ],
  },
]

export default function Regulation30Page() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="SEBI Disclosures"
        title="SEBI LODR Regulation 30 Disclosures"
        description="Event-based material disclosures filed with BSE and NSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015."
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
        ]}
      />

      {/* Context */}
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

      {/* Disclosures */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-14">
            {eventCategories.map((cat, ci) => (
              <div key={cat.heading}>
                <Reveal>
                  <h2 className="font-display text-xl font-bold mb-6 pb-3 border-b" style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                    {cat.heading}
                  </h2>
                </Reveal>
                <div className="space-y-3">
                  {cat.items.map((item, ii) => (
                    <Reveal key={item.title} delay={(ci + ii) * 40}>
                      <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.title}</p>
                            <span className="text-xs font-mono flex-shrink-0 px-2.5 py-1 rounded-full" style={{ background: 'var(--color-slate-100)', color: 'var(--color-slate-600)' }}>
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{item.desc}</p>
                        </div>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 border self-start transition-colors hover:bg-blue-50"
                          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                        >
                          PDF
                        </a>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
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
