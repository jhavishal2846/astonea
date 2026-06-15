import 'server-only'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pageMetadata } from '@/lib/db/schema'
import { PAGE_REGISTRY_BY_PATH } from '@/lib/seo/pages-registry'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import SeoForm from '../SeoForm'

export const dynamic = 'force-dynamic'

export default async function SeoEditPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>
}) {
  const sp = await searchParams
  const path = sp.path ?? ''
  const entry = PAGE_REGISTRY_BY_PATH[path]
  if (!entry) notFound()

  const [row] = await db
    .select()
    .from(pageMetadata)
    .where(eq(pageMetadata.pagePath, path))
    .limit(1)

  return (
    <>
      <AdminPageHeader
        title={`SEO — ${entry.label}`}
        description={`Editing metadata for ${entry.path}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'SEO', href: '/admin/seo' },
          { label: entry.label },
        ]}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 max-w-3xl">
        <SeoForm
          pagePath={path}
          defaults={{
            title: entry.defaultTitle,
            description: entry.defaultDescription,
            keywords: entry.defaultKeywords,
          }}
          initial={row ?? null}
        />
      </div>

      {row?.updatedAt && (
        <p className="mt-4 text-xs text-slate-500 max-w-3xl">
          Last updated {new Date(row.updatedAt).toLocaleString()}
          {row.updatedBy ? ' by an admin' : ''}
        </p>
      )}
    </>
  )
}
