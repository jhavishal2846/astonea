import type { DocumentCategory } from '@/lib/db/schema'

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  annual_report:         'Annual Report',
  financial_result:      'Financial Result',
  policy_code_framework: 'Policy / Code / Framework',
  reg30:                 'SEBI Reg 30 Disclosure',
  reg46:                 'SEBI Reg 46 Disclosure',
  subsidiary_financial:  'Subsidiary Financial',
  certification:         'Certification',
  agm:                   'AGM Document',
  egm:                   'EGM Document',
  shareholding_pattern:  'Shareholding Pattern',
  trading_window:        'Trading Window Closure',
  related_party:         'Related Party Transaction',
  corporate_announcement:'Corporate Announcement',
  newspaper_publication: 'Newspaper Publication',
  integrated_filing:     'Integrated Filing',
  corporate_document:    'Corporate Document',
}

export const CATEGORY_PLURAL: Record<DocumentCategory, string> = {
  annual_report:         'Annual Reports',
  financial_result:      'Financial Results',
  policy_code_framework: 'Policies, Codes & Frameworks',
  reg30:                 'SEBI Reg 30 Disclosures',
  reg46:                 'SEBI Reg 46 Disclosures',
  subsidiary_financial:  'Subsidiary Financials',
  certification:         'Certifications',
  agm:                   'AGM Documents',
  egm:                   'EGM Documents',
  shareholding_pattern:  'Shareholding Patterns',
  trading_window:        'Trading Window Closures',
  related_party:         'Related Party Transactions',
  corporate_announcement:'Corporate Announcements',
  newspaper_publication: 'Newspaper Publications',
  integrated_filing:     'Integrated Filings',
  corporate_document:    'Corporate Documents',
}

export const SUBCATEGORY_OPTIONS: Record<DocumentCategory, { value: string; label: string }[]> = {
  annual_report: [],
  financial_result: [
    { value: 'annual',       label: 'Annual' },
    { value: 'half_yearly',  label: 'Half-yearly' },
    { value: 'restated',     label: 'Restated' },
    { value: 'mgt7',         label: 'Form MGT-7 (Annual Return)' },
    { value: 'board_notice', label: 'Board Meeting Notice' },
    { value: 'deviation',    label: 'Deviation / Variation Statement' },
  ],
  policy_code_framework: [
    { value: 'policy',    label: 'Policy' },
    { value: 'code',      label: 'Code of Conduct' },
    { value: 'framework', label: 'Framework' },
  ],
  reg30: [
    { value: 'board_meeting',    label: 'Board Meeting Outcome' },
    { value: 'agm_egm',          label: 'AGM / EGM' },
    { value: 'director_kmp',     label: 'Director & KMP Change' },
    { value: 'structural',       label: 'Structural Change' },
    { value: 'ipo_acquisition',  label: 'IPO / Acquisition' },
    { value: 'property_ops',     label: 'Property / Operations' },
    { value: 'intimation',       label: 'Board Meeting Intimation' },
  ],
  reg46: [
    { value: 'corporate_overview',         label: 'Corporate Overview' },
    { value: 'board_of_directors',         label: 'Board of Directors' },
    { value: 'board_committees',           label: 'Board Committees' },
    { value: 'governance_policies',        label: 'Corporate Governance Policies and Ethical Frameworks' },
    { value: 'investor_relations',         label: 'Investor Relations' },
    { value: 'financial_information',      label: 'Financial Information' },
    { value: 'name_history',               label: 'New Name and Old Name of the Company' },
    { value: 'authorised_kmps',            label: 'Authorised KMPs for Determining Materiality of Events' },
    { value: 'analyst_schedule',           label: 'Schedule of Analyst or Institutional Investor Meets' },
    { value: 'media_agreements',           label: 'Details of Agreement entered into with the Media Company or their Associates' },
    { value: 'dividend_policy',            label: 'Dividend Distribution Policy' },
    { value: 'subsidiary_financials_audit',label: 'Audited Financial Statement of Subsidiaries' },
    { value: 'secretarial_compliance',     label: 'Secretarial Compliance Report' },
  ],
  subsidiary_financial: [],
  certification: [],
  agm: [
    { value: 'notice',     label: 'Notice' },
    { value: 'proceedings',label: 'Proceedings' },
    { value: 'voting',     label: 'Voting Results' },
    { value: 'scrutinizer',label: 'Scrutinizer Report' },
  ],
  egm: [
    { value: 'notice',     label: 'Notice' },
    { value: 'proceedings',label: 'Proceedings' },
    { value: 'voting',     label: 'Voting Results' },
    { value: 'scrutinizer',label: 'Scrutinizer Report' },
  ],
  shareholding_pattern: [],
  trading_window: [],
  related_party: [],
  corporate_announcement: [],
  newspaper_publication: [],
  integrated_filing: [
    { value: 'quarterly',  label: 'Quarterly' },
    { value: 'annual',     label: 'Annual' },
  ],
  corporate_document: [],
}

export const SUBCATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(SUBCATEGORY_OPTIONS).flatMap((opts) => opts.map((o) => [o.value, o.label])),
)

export const ALL_CATEGORIES: DocumentCategory[] = Object.keys(CATEGORY_LABELS) as DocumentCategory[]

export function isValidCategory(s: string): s is DocumentCategory {
  return s in CATEGORY_LABELS
}
