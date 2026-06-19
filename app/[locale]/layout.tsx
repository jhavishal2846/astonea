import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import { BlockRenderer } from '@/components/cms/BlockRenderer'
import PageTextProvider from '@/components/PageTextProvider'
import CmsEditOverlay from '@/components/cms/CmsEditOverlay'
import { getActiveLocaleCodes, getActiveLocales, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { getResolvedPage } from '@/lib/cms/pages'
import { db } from '@/lib/db'
import { pageTextOverrides } from '@/lib/db/schema'
import { and, eq, inArray } from 'drizzle-orm'

export async function generateStaticParams() {
  const codes = await getActiveLocaleCodes()
  return codes.map((locale) => ({ locale }))
}

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

  const [messages, activeRows, headerStore] = await Promise.all([
    getMessages(),
    getActiveLocales(),
    headers(),
  ])

  const languages = activeRows.map((r) => ({
    code: r.code,
    name: r.name,
    nativeName: r.nativeName,
    isDefault: r.isDefault,
  }))

  // x-pathname is the URL the user typed (e.g. /hi/about-us). Pages in the
  // CMS are stored locale-agnostic (e.g. /about-us), so strip the leading
  // /<locale> segment before the lookup.
  const rawPathname = headerStore.get('x-pathname') ?? ''
  const localePrefix = `/${locale}`
  const cmsPath =
    rawPathname === localePrefix
      ? '/'
      : rawPathname.startsWith(`${localePrefix}/`)
      ? rawPathname.slice(localePrefix.length)
      : rawPathname

  // Block-override: if an editor has built block content for this path,
  // serve those blocks instead of `children`.
  let content: React.ReactNode = children
  if (cmsPath) {
    const resolved = await getResolvedPage(cmsPath, locale)
    if (resolved && resolved.page.isPublished && resolved.blocks.length > 0) {
      content = (
        <div className="flex-1 flex flex-col">
          <BlockRenderer blocks={resolved.blocks} />
        </div>
      )
    }
  }

  // Per-path text overrides (eyebrow/title/description/etc.). Merged across
  // the active locale + base-locale fallback. The provider pushes them down
  // to client components like PageHeader.
  let textOverrides: Record<string, string> = {}
  if (cmsPath) {
    const localeList =
      locale === DEFAULT_LOCALE ? [DEFAULT_LOCALE] : [locale, DEFAULT_LOCALE]
    const rows = await db
      .select({
        key: pageTextOverrides.key,
        locale: pageTextOverrides.locale,
        value: pageTextOverrides.value,
      })
      .from(pageTextOverrides)
      .where(
        and(
          eq(pageTextOverrides.pagePath, cmsPath),
          inArray(pageTextOverrides.locale, localeList),
        ),
      )
    // Base first so the active locale wins for shared keys.
    const merged: Record<string, string> = {}
    for (const r of rows) {
      if (r.locale === DEFAULT_LOCALE) merged[r.key] = r.value
    }
    if (locale !== DEFAULT_LOCALE) {
      for (const r of rows) {
        if (r.locale === locale) merged[r.key] = r.value
      }
    }
    textOverrides = merged
  }

  const editMode = headerStore.get('x-cms-edit') === '1'

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PageTextProvider
        overrides={textOverrides}
        path={cmsPath || '/'}
        locale={locale}
        editMode={editMode}
      >
        <Navbar languages={languages} currentLocale={locale} />
        <PageTransition>
          <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
            {content}
          </main>
        </PageTransition>
        <Footer />
        {editMode && <CmsEditOverlay />}
      </PageTextProvider>
    </NextIntlClientProvider>
  )
}
