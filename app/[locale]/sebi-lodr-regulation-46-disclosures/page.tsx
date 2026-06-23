import type { ReactNode } from 'react'
import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { getPageText } from '@/lib/cms/page-text'
import { pageMeta } from '@/lib/seo/generate-metadata'

type TFn = (key: string, fallback: string) => ReactNode

export const generateMetadata = () =>
  pageMeta('/sebi-lodr-regulation-46-disclosures', {
    title: 'SEBI LODR Regulation 46 Disclosures',
    description: 'Statutory disclosures by Astonea Labs Limited under SEBI LODR Regulation 46.',
  })

type SectionItem = {
  title: string
  description?: string
  fileUrl?: string
  externalLink?: string
}

type Kmp = { name: string; role: string; email: string }

type Section = {
  sub: string
  heading: string
  na?: boolean
  text?: string
  items?: SectionItem[]
  kmps?: Kmp[]
}

const SECTIONS: Section[] = [
  {
    sub: 'corporate_overview',
    heading: 'Corporate Overview',
    items: [
      { title: 'Details of Business', description: 'Overview of the Company\'s business operations, product categories, and service segments.', externalLink: '/what-we-do' },
      { title: 'Memorandum of Association (MOA)', description: 'Memorandum of Association of the Company as filed with the Registrar of Companies.', fileUrl: '/pdf/MOA ALL.pdf' },
      { title: 'Articles of Association (AOA)', description: 'Articles of Association of the Company, including the new set adopted at the EGM held on 27th March 2026.', fileUrl: '/pdf/AOA FNL.pdf' },
    ],
  },
  {
    sub: 'board_of_directors',
    heading: 'Board of Directors',
    items: [
      { title: 'Profile of Board of Directors', description: 'Biographical and qualification details of all Directors and Key Managerial Personnel.', externalLink: '/board-of-directors' },
      { title: 'Terms & Conditions of Appointment of Independent Directors', description: 'Formal terms and conditions governing the appointment of Independent Directors of the Company.', fileUrl: '/pdf/T&C- Appointment of Independent Directors.pdf' },
    ],
  },
  {
    sub: 'board_committees',
    heading: 'Board Committees',
    items: [
      { title: 'Composition of Various Committees of BOD', description: 'Constituted committees of the Board — Audit, Nomination & Remuneration, Stakeholders\' Relationship, CSR, and Risk Management.', fileUrl: '/pdf/14. Composition of Committees.pdf' },
    ],
  },
  {
    sub: 'governance_policies',
    heading: 'Corporate Governance Policies and Ethical Frameworks',
    items: [
      { title: 'Code of Conduct for Board and Senior Management', fileUrl: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
      { title: 'Familiarisation Programme for Independent Directors', fileUrl: '/pdf/22. Familiarisation Program.pdf' },
      { title: 'Policy on Identification of Group Companies, Material Creditors', fileUrl: '/pdf/Policy on Identificaton of Group Companies, Material Creditors.pdf' },
      { title: 'Policy for Determining Material Subsidiaries', fileUrl: '/pdf/21. Material Subsidiary.pdf' },
      { title: 'Policy on Dealing with Related Party Transactions', fileUrl: '/pdf/Policy on dealing with RPT.pdf' },
      { title: 'Archival Policy / Policy for Preservation of Documents', fileUrl: '/pdf/15. Archival Policy.pdf' },
      { title: 'Vigil Mechanism Policy / Whistle Blower Policy', fileUrl: '/pdf/Vigil Mechanism Policy.pdf' },
      { title: 'Annual Performance Evaluation Framework', fileUrl: '/pdf/Annual Performance Evaluation Framework.pdf' },
      { title: 'Criteria of Payment to Non-Executive Directors', fileUrl: '/pdf/18. Criteria for making payment to Non Exe Dir.pdf' },
    ],
  },
  {
    sub: 'investor_relations',
    heading: 'Investor Relations',
    items: [
      { title: 'Investor Grievances', description: 'For investor grievances and queries, contact the Compliance Officer at cs@astonea.org.', externalLink: '/investor-insights' },
      { title: 'Shareholding Pattern', description: 'Quarterly shareholding pattern filed with the stock exchanges.', fileUrl: '/pdf/Shareholding Pattern (1).pdf' },
    ],
  },
  {
    sub: 'financial_information',
    heading: 'Financial Information',
    items: [
      { title: 'Board Meeting Notices for Financial Results', description: 'Notices of Board meetings convened for approval of financial results.', externalLink: '/financial-results' },
      { title: 'Financial Results', description: 'Quarterly, half-yearly and annual financial results filed with the stock exchanges.', externalLink: '/financial-results' },
      { title: 'Annual Reports', description: 'Audited annual reports including Director\'s Report and Corporate Governance Report.', externalLink: '/annual-reports' },
      { title: 'Statement of Deviation', description: 'Non-applicability of Statement of Deviation or Variation in use of IPO proceeds.', fileUrl: '/pdf/Non- Applicability of Statement of Variation or Deviation.pdf' },
      { title: 'Annual Return (Form MGT-7)', description: 'Annual returns filed with the Registrar of Companies.', externalLink: '/financial-results' },
    ],
  },
  {
    sub: 'name_history',
    heading: 'New Name and Old Name of the Company',
    text: 'Astonea Labs Limited was constituted pursuant to the conversion of Astonea Labs Private Limited into a public company, in accordance with the applicable provisions of the Companies Act and as approved vide the order of the Ministry of Corporate Affairs dated 11 January 2024.',
  },
  {
    sub: 'authorised_kmps',
    heading: 'Authorised KMPs for Determining Materiality of Events',
    text: 'The following Key Managerial Personnel have been authorised by the Board for determining the materiality of events or information for the purpose of disclosure to the Stock Exchanges under Regulation 30 of the SEBI (LODR) Regulations, 2015:',
    kmps: [
      { name: 'Mr. Sumit Kumar', role: 'Chief Financial Officer', email: 'financeastonea@gmail.com' },
    ],
  },
  {
    sub: 'analyst_schedule',
    heading: 'Schedule of Analyst or Institutional Investor Meets',
    text: 'No Analyst or Institutional Investor Meeting was held in the Current Financial Year. Any future meetings or presentations made to analysts or institutional investors will be promptly disclosed on the website and to the Stock Exchanges in accordance with SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.',
  },
  { sub: 'media_agreements',            heading: 'Details of Agreement entered into with the Media Company or their Associates', na: true },
  { sub: 'dividend_policy',             heading: 'Dividend Distribution Policy', na: true },
  { sub: 'subsidiary_financials_audit', heading: 'Audited Financial Statement of Subsidiaries', na: true },
  { sub: 'secretarial_compliance',      heading: 'Secretarial Compliance Report', na: true },
]

export default async function Regulation46Page() {
  const t = await getPageText('/sebi-lodr-regulation-46-disclosures')
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'SEBI Disclosures') as string}
        title={t('header.title', 'SEBI LODR Regulation 46 Disclosures') as string}
        description={t('header.description', 'Statutory disclosures maintained on the company website as required under Regulation 46 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015.') as string}
        breadcrumb={[
          { label: 'Investors', href: '/investor-insights' },
          { label: 'SEBI Reg. 46', href: '/sebi-lodr-regulation-46-disclosures' },
        ]}
      />

      <section className="py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="p-5 rounded-xl border max-w-3xl" style={{ background: 'var(--color-primary-xlight)', borderColor: 'rgba(0,114,206,0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-primary-dark)' }}>
              {t(
                'reg46.intro',
                'Regulation 46 — SEBI LODR, 2015: Listed companies are required to maintain and disseminate certain information on their websites for public access. The following disclosures are maintained in accordance with these requirements. CIN: L24304CH2017PLC041482.',
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="max-w-3xl space-y-12">
            {SECTIONS.map((section, ci) => (
              <SectionBlock key={ci} section={section} index={ci} t={t} />
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-12 max-w-3xl">
              <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                {t('reg46.footnote_prefix', 'For event-based disclosures and material information filed with BSE, refer to ')}
                <Link href="/sebi-lodr-regulation-30-disclosures" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {t('reg46.footnote_link', 'SEBI LODR Regulation 30 Disclosures')}
                </Link>
                {t('reg46.footnote_middle', '. For queries, contact ')}
                <a href="mailto:cs@astonea.org" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>{t('reg46.footnote_email', 'cs@astonea.org')}</a>
                {t('reg46.footnote_suffix', '.')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function SectionBlock({ section, index, t }: { section: Section; index: number; t: TFn }) {
  const { sub, heading, na, text, items, kmps } = section
  const keyBase = `reg46.${sub}`
  return (
    <div id={sub} className="scroll-mt-24">
      <Reveal delay={index * 30}>
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-display text-lg lg:text-xl font-bold flex-1" style={{ color: 'var(--color-ink)' }}>
            <span className="font-mono text-sm mr-3" style={{ color: 'var(--color-ink-subtle)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            {t(`${keyBase}.heading`, heading)}
          </h2>
          {na && (
            <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 mt-1" style={{ background: 'var(--color-ink)', color: 'var(--color-surface)' }}>
              {t('reg46.na_label', 'NA')}
            </span>
          )}
        </div>
      </Reveal>

      {na ? (
        <p className="text-sm italic" style={{ color: 'var(--color-ink-subtle)' }}>
          {t(`${keyBase}.na_text`, 'Not applicable to the Company.')}
        </p>
      ) : (
        <div className="space-y-4">
          {text && (
            <Reveal delay={index * 30 + 30}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {t(`${keyBase}.text`, text)}
              </p>
            </Reveal>
          )}

          {kmps && kmps.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {kmps.map((k, ki) => (
                <Reveal key={ki} delay={index * 30 + 60 + ki * 40}>
                  <div className="p-4 rounded-lg border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{t(`${keyBase}.kmp_${ki}.name`, k.name)}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-ink-muted)' }}>{t(`${keyBase}.kmp_${ki}.role`, k.role)}</p>
                    <a href={`mailto:${k.email}`} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                      {t(`${keyBase}.kmp_${ki}.email`, k.email)}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {items && items.length > 0 && (
            <div className="space-y-px rounded-lg overflow-hidden" style={{ background: 'var(--color-border)' }}>
              {items.map((item, ii) => {
                const link = item.fileUrl ?? item.externalLink
                return (
                  <Reveal key={ii} delay={index * 30 + 40 + ii * 30}>
                    <div className="flex items-start gap-4 p-5 transition-colors hover:bg-blue-50/30" style={{ background: 'var(--color-surface)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold" style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}>
                        {String(ii + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-ink)' }}>{t(`${keyBase}.item_${ii}.title`, item.title)}</p>
                        {item.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{t(`${keyBase}.item_${ii}.description`, item.description)}</p>}
                      </div>
                      {link ? (
                        item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                            {t('reg46.pdf_label', 'PDF')}
                          </a>
                        ) : (
                          <Link href={item.externalLink!} className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border self-start transition-colors hover:bg-blue-50" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                            {t('reg46.view_label', 'View')}
                          </Link>
                        )
                      ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-subtle)' }}>
                          {t('reg46.soon_label', 'Soon')}
                        </span>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
