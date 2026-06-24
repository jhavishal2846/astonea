import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getActiveLocaleCodes, getActiveLocales } from '@/lib/i18n/locales'
import PageBody from './_layout/PageBody'
import PublicPageSkeleton from './_layout/PublicPageSkeleton'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const activeCodes = await getActiveLocaleCodes()
  if (!hasLocale(activeCodes, locale)) notFound()

  // Enables static rendering for this locale and exposes it to server
  // components via getLocale().
  setRequestLocale(locale)

  // Shell-level data: cached and fast. The slow path-dependent work
  // (headers + CMS resolution + text overrides) is deferred into <PageBody>
  // so the layout shell can swap instantly and the skeleton appears while
  // the body resolves.
  const [messages, activeRows] = await Promise.all([
    getMessages(),
    getActiveLocales(),
  ])

  const languages = activeRows.map((r) => ({
    code: r.code,
    name: r.name,
    nativeName: r.nativeName,
    isDefault: r.isDefault,
  }))

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar languages={languages} currentLocale={locale} />
      <Suspense fallback={<PublicPageSkeleton />}>
        <PageBody locale={locale}>{children}</PageBody>
      </Suspense>
      <Footer />
    </NextIntlClientProvider>
  )
}
