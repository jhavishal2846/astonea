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

/**
 * Reverse map: public page path → all categories whose PDFs render there.
 * A few pages aggregate more than one category (e.g. /policies, /codes, /frameworks
 * all share the policy_code_framework category but filter on subcategory; /meetings
 * surfaces both AGM and EGM). Pages not listed don't render any documents.
 */
const PATH_TO_CATEGORIES: Record<string, DocumentCategory[]> = {
  '/annual-reports':                          ['annual_report'],
  '/financial-results':                       ['financial_result'],
  '/governance-policies-codes-and-frameworks':['policy_code_framework'],
  '/policies':                                ['policy_code_framework'],
  '/codes':                                   ['policy_code_framework'],
  '/frameworks':                              ['policy_code_framework'],
  '/sebi-lodr-regulation-30-disclosures':     ['reg30'],
  '/sebi-lodr-regulation-46-disclosures':     ['reg46'],
  '/certifications':                          ['certification'],
  '/agm':                                     ['agm'],
  '/egm':                                     ['egm'],
  '/meetings':                                ['agm', 'egm'],
  '/board-meetings':                          ['financial_result'],
  '/shareholding-pattern':                    ['shareholding_pattern'],
  '/trading-window-closure':                  ['trading_window'],
  '/related-party-transactions':              ['related_party'],
  '/corporate-announcements':                 ['corporate_announcement'],
  '/newspaper-publications':                  ['newspaper_publication'],
  '/integrated-filings':                      ['integrated_filing'],
  '/integrated-finance':                      ['integrated_filing'],
  '/integrated-governance':                   ['integrated_filing'],
  '/corporate-documents':                     ['corporate_document'],
  '/subsidiaries':                            ['subsidiary_financial'],
  '/group-companies':                         ['subsidiary_financial'],
}

export function publicUrlForCategory(category: DocumentCategory): string {
  return CATEGORY_TO_PUBLIC_URL[category]
}

/**
 * Returns the document categories whose PDFs are rendered on a given public
 * page path, or null if the page doesn't surface any.
 */
export function categoriesForPagePath(path: string): DocumentCategory[] | null {
  return PATH_TO_CATEGORIES[path] ?? null
}

/**
 * Convenience: builds the admin URL for managing PDFs on a given page path.
 * If the page maps to a single category, the link pre-filters by it; if it
 * maps to multiple, the link opens the documents list with all categories
 * visible (the admin can switch tabs).
 */
export function manageDocumentsHrefForPagePath(path: string): string | null {
  const cats = PATH_TO_CATEGORIES[path]
  if (!cats || cats.length === 0) return null
  if (cats.length === 1) return `/admin/documents?category=${cats[0]}`
  return `/admin/documents`
}
