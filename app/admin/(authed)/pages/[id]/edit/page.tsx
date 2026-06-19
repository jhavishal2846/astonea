import 'server-only'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pages } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import { getActiveLocales, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { getContentSchema } from '@/lib/cms/content-schema'
import LocaleTabs from './LocaleTabs'

export const dynamic = 'force-dynamic'

export default async function PageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ locale?: string }>
}) {
  const { id } = await params
  const { locale: requestedLocale } = await searchParams

  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1)
  if (!page) notFound()

  const activeLanguages = await getActiveLocales()
  const validCode = (c: string | undefined) =>
    c && activeLanguages.some((l) => l.code === c) ? c : DEFAULT_LOCALE
  const activeLocale = validCode(requestedLocale)

  const schema = getContentSchema(page.path)
  const isEditable = !!schema

  const previewUrl =
    (activeLocale === DEFAULT_LOCALE
      ? page.path
      : `/${activeLocale}${page.path === '/' ? '' : page.path}`) + '?edit=1'

  const localeOptions = activeLanguages.map((l) => ({
    code: l.code,
    name: l.name,
    nativeName: l.nativeName,
    isDefault: l.isDefault,
  }))

  return (
    <>
      <AdminPageHeader
        title={page.label}
        description={`Click any text on the page to edit it in place. Save publishes immediately.`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Pages', href: '/admin/pages' },
          { label: page.label },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <LocaleTabs languages={localeOptions} active={activeLocale} />
            <a
              href={
                activeLocale === DEFAULT_LOCALE
                  ? page.path
                  : `/${activeLocale}${page.path === '/' ? '' : page.path}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100"
            >
              Open live ↗
            </a>
          </div>
        }
      />

      {!isEditable ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 max-w-2xl">
          <p className="font-semibold mb-1">This page can&apos;t be edited yet.</p>
          <p className="text-xs">
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">{page.path}</code> isn&apos;t
            in the editable-pages registry. Add an entry to{' '}
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">lib/cms/page-defaults.ts</code>{' '}
            to expose its text fields.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Edit mode
              </span>
              <span className="font-mono text-[11px] text-slate-500">{page.path}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Click any text to edit · changes auto-save
            </span>
          </div>
          <iframe
            src={previewUrl}
            title="Edit page in place"
            className="w-full block bg-white"
            style={{ height: 'calc(100vh - 220px)', minHeight: '600px', border: 0 }}
          />
        </div>
      )}
    </>
  )
}
