/**
 * Baseline English UI strings. These are merged with any `ui_strings` rows in
 * the database — DB values override these. New keys added here are picked up
 * automatically; admins only need to override what they want to customise.
 *
 * Use dotted keys (namespace.name) so next-intl's `useTranslations(namespace)`
 * groups them naturally.
 */
export const DEFAULT_UI_STRINGS_EN: Record<string, string> = {
  // Navigation
  'nav.home':               'Home',
  'nav.about':              'About Us',
  'nav.products':           'Products',
  'nav.what_we_do':         'What We Do',
  'nav.vision':             'Vision & Mission',
  'nav.manufacturing':      'Manufacturing Facility',
  'nav.certifications':     'Certifications',
  'nav.investors':          'Investors',
  'nav.governance':         'Governance',
  'nav.career':             'Career',
  'nav.contact':            'Contact Us',
  'nav.leadership':         'Leadership',
  'nav.csr':                'CSR',

  // CTAs / generic buttons
  'cta.read_more':          'Read more',
  'cta.learn_more':         'Learn more',
  'cta.view_all':           'View all',
  'cta.download':           'Download',
  'cta.download_pdf':       'Download PDF',
  'cta.contact_us':         'Contact us',
  'cta.get_in_touch':       'Get in touch',
  'cta.explore':            'Explore',
  'cta.view_pdf':           'PDF',
  'cta.coming_soon':        'Soon',
  'cta.view':               'View',
  'cta.link':               'Link',

  // Common labels
  'label.search':           'Search',
  'label.email':            'Email',
  'label.phone':            'Phone',
  'label.address':          'Address',
  'label.date':             'Date',
  'label.period':           'Period',
  'label.title':            'Title',
  'label.description':      'Description',
  'label.published':        'Published',
  'label.draft':            'Draft',

  // Footer
  'footer.copyright':       '© Astonea Labs Limited. All rights reserved.',
  'footer.tagline':         'A BSE-SME listed pharmaceutical and specialty chemicals company.',
  'footer.quick_links':     'Quick links',
  'footer.investors':       'Investor relations',
  'footer.governance':      'Governance',
  'footer.contact':         'Contact',

  // Common page elements
  'common.loading':         'Loading…',
  'common.empty':           'Nothing to show yet.',
  'common.error':           'Something went wrong.',
}
