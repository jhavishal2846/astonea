import type { DocumentCategory } from '@/lib/db/schema'

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  annual_report:         'Annual Report',
  financial_result:      'Financial Result',
  policy_code_framework: 'Policy / Code / Framework',
  reg30:                 'SEBI Reg 30 Disclosure',
  reg46:                 'SEBI Reg 46 Disclosure',
  subsidiary_financial:  'Subsidiary Financial',
  certification:         'Certification',
}

export const CATEGORY_PLURAL: Record<DocumentCategory, string> = {
  annual_report:         'Annual Reports',
  financial_result:      'Financial Results',
  policy_code_framework: 'Policies, Codes & Frameworks',
  reg30:                 'SEBI Reg 30 Disclosures',
  reg46:                 'SEBI Reg 46 Disclosures',
  subsidiary_financial:  'Subsidiary Financials',
  certification:         'Certifications',
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
  ],
  reg46: [
    { value: 'corporate_details', label: 'Corporate Details' },
    { value: 'board_governance',  label: 'Board & Governance' },
    { value: 'committees',        label: 'Committees' },
    { value: 'investor_info',     label: 'Investor Information' },
    { value: 'financial_filings', label: 'Financial Filings' },
  ],
  subsidiary_financial: [],
  certification: [],
}

export const SUBCATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(SUBCATEGORY_OPTIONS).flatMap((opts) => opts.map((o) => [o.value, o.label])),
)

export const ALL_CATEGORIES: DocumentCategory[] = Object.keys(CATEGORY_LABELS) as DocumentCategory[]

export function isValidCategory(s: string): s is DocumentCategory {
  return s in CATEGORY_LABELS
}
