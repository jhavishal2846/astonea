import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import './_nav/nav-progress.css'
import { NavProgressBar, NavProgressProvider } from './_nav/NavProgress'
import RichTextLinkInterceptor from './_nav/RichTextLinkInterceptor'
import SiteAnalytics from './_components/SiteAnalytics'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

/* ─── Fonts ──────────────────────────────────────────────────────────────── */

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

/* ─── Site Metadata ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    template: '%s | Astonea Labs Limited',
    default:  'Astonea Labs Limited — Pharma & Cosmetics Third-Party Manufacturer',
  },
  description:
    'Astonea Labs Limited (CIN: L24304CH2017PLC041482) — India\'s trusted third-party manufacturer of pharma and cosmetics. 2000+ clients, 1500+ product approvals. Chandigarh, India.',
  keywords: [
    'third party manufacturing',
    'pharma manufacturer India',
    'cosmetics contract manufacturer',
    'GMP pharma Chandigarh',
    'Astonea Labs',
    'white label pharma',
    'SEBI listed pharma',
  ],
  metadataBase: new URL('https://astonea.org'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    type:        'website',
    siteName:    'Astonea Labs Limited',
    locale:      'en_IN',
    url:         'https://astonea.org',
    title:       'Astonea Labs Limited — Pharma & Cosmetics Third-Party Manufacturer',
    description: 'Excellence and reliability in every batch. 2000+ clients across pharma and cosmetics.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Astonea Labs Limited' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:  true,
      follow: true,
    },
  },
}

/* ─── Root Layout ─────────────────────────────────────────────────────────── */

// RTL languages — extend as needed.
const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur'])

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Middleware sets x-locale on every public request. Admin/API routes don't
  // run through middleware → fall back to default.
  const h = await headers()
  const locale = h.get('x-locale') ?? DEFAULT_LOCALE
  const dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-bg text-ink font-sans">
        <NavProgressProvider>
          <NavProgressBar />
          <RichTextLinkInterceptor />
          {children}
        </NavProgressProvider>
        <SiteAnalytics />
      </body>
    </html>
  )
}
