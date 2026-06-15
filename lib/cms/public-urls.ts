import type { DocumentCategory } from '@/lib/db/schema'

/**
 * Maps each document category to the public page that surfaces it.
 * Used by the admin UI to render a "view on site" link from each row.
 */
const CATEGORY_TO_PUBLIC_URL: Record<DocumentCategory, string> = {
  annual_report:          '/annual-reports',
  financial_result:       '/financial-results',
  policy_code_framework:  '/governance-policies-codes-and-frameworks',
  reg30:                  '/sebi-lodr-regulation-30-disclosures',
  reg46:                  '/sebi-lodr-regulation-46-disclosures',
  subsidiary_financial:   '/group-companies',
  certification:          '/certifications',
  agm:                    '/agm',
  egm:                    '/egm',
  shareholding_pattern:   '/shareholding-pattern',
  trading_window:         '/trading-window-closure',
  related_party:          '/related-party-transactions',
  corporate_announcement: '/corporate-announcements',
  newspaper_publication:  '/newspaper-publications',
  integrated_filing:      '/integrated-filings',
  corporate_document:     '/corporate-documents',
}

export function publicUrlForCategory(category: DocumentCategory): string {
  return CATEGORY_TO_PUBLIC_URL[category]
}
