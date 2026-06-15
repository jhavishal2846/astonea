import 'server-only'
import Link from 'next/link'
import { db } from '@/lib/db'
import { pageMetadata } from '@/lib/db/schema'
import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'
import AdminPageHeader from '@/app/admin/_components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function SeoListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>
}) {
  const sp = await searchParams
  const q = sp.q?.trim().toLowerCase() ?? ''
  const group = sp.group ?? ''

  const existing = await db
    .select({
      pagePath: pageMetadata.pagePath,
      title: pageMetadata.title,
      updatedAt: pageMetadata.updatedAt,
    })
    .from(pageMetadata)

  const existingByPath = new Map(existing.map((r) => [r.pagePath, r]))

  const rows = PAGE_REGISTRY.filter((p) => {
    if (group && p.group !== group) return false
    if (q) {
      return (
        p.path.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.defaultTitle.toLowerCase().includes(q)
      )
    }
    return true
  })

  const groups = Array.from(new Set(PAGE_REGISTRY.map((p) => p.group)))

  return (
    <>
      <AdminPageHeader
        title="SEO"
        description="Per-page metadata: titles, descriptions, keywords, OG image, canonical, no-index."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'SEO' }]}
      />

      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <form className="flex items-center gap-2" action="/admin/seo">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search pages…"
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm w-64 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
          {group && <input type="hidden" name="group" value={group} />}
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-1 ml-auto">
          <Link
            href={q ? `/admin/seo?q=${encodeURIComponent(q)}` : '/admin/seo'}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              !group
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({PAGE_REGISTRY.length})
          </Link>
          {groups.map((g) => {
            const count = PAGE_REGISTRY.filter((p) => p.group === g).length
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            params.set('group', g)
            return (
              <Link
                key={g}
                href={`/admin/seo?${params.toString()}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  group === g
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g} ({count})
              </Link>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Page</th>
              <th className="px-4 py-3 text-left">Path</th>
              <th className="px-4 py-3 text-left">Current title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => {
              const row = existingByPath.get(p.path)
              return (
                <tr key={p.path} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.path}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-xs">
                    {row?.title ?? <span className="text-slate-400 italic">{p.defaultTitle}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {row ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        Customised
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/seo/edit?path=${encodeURIComponent(p.path)}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 text-sm">
                  No pages match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
