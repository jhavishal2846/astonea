import 'server-only'
import Link from '@/app/_nav/AppLink'
import { db } from '@/lib/db'
import { pages, pageBlocks } from '@/lib/db/schema'
import { and, asc, ilike, or, sql, type SQL } from 'drizzle-orm'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'
import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'
import { manageDocumentsHrefForPagePath } from '@/lib/cms/public-urls'
// New-page creation is temporarily hidden so editors focus on the existing
// site pages first. Re-enable by passing <NewPageTrigger /> back into the
// `actions` prop on the AdminPageHeader below.
// import NewPageTrigger from './NewPageTrigger'

export const dynamic = 'force-dynamic'

const PER_PAGE = 20

/**
 * Make sure every page that exists statically in the site (per PAGE_REGISTRY)
 * also has a row in the `pages` table, so editors can open it in the block
 * editor and start composing. New rows start with zero blocks — the static
 * design stays in place until an editor adds blocks (then it overrides).
 *
 * Idempotent: re-runs on every page-list load with `onConflictDoNothing()`.
 */
async function ensureRegistryPagesSeeded() {
  if (PAGE_REGISTRY.length === 0) return
  await db
    .insert(pages)
    .values(
      PAGE_REGISTRY.map((entry) => ({
        path: entry.path,
        label: entry.label,
        isPublished: true,
        showInNav: false,
      })),
    )
    .onConflictDoNothing({ target: pages.path })
}

export default async function PagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  await ensureRegistryPagesSeeded()

  const { q, page: pageRaw } = await searchParams
  const search = (q ?? '').trim()
  const requested = Number(pageRaw) || 1

  const conditions: SQL[] = []
  if (search) {
    const like = `%${search}%`
    conditions.push(or(ilike(pages.label, like), ilike(pages.path, like))!)
  }
  const where = conditions.length ? and(...conditions) : undefined

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pages)
    .where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select({
      id: pages.id,
      path: pages.path,
      label: pages.label,
      isPublished: pages.isPublished,
      showInNav: pages.showInNav,
      updatedAt: pages.updatedAt,
      blockCount: sql<number>`(SELECT COUNT(*) FROM ${pageBlocks} WHERE ${pageBlocks.pageId} = ${pages.id})`,
    })
    .from(pages)
    .where(where)
    .orderBy(asc(pages.path))
    .limit(PER_PAGE)
    .offset(offset)

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Edit any existing page. Click a row to compose its content from blocks — your blocks replace the original layout on the public site. A row with zero blocks keeps the original design unchanged."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pages' }]}
      />

      <div className="mb-4">
        <AdminSearchInput
          basePath="/admin/pages"
          initial={search}
          placeholder="Search by label or path…"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Path</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => {
              const cmsControlled = r.blockCount > 0
              const manageDocsHref = manageDocumentsHrefForPagePath(r.path)
              return (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.path}</td>
                  <td className="px-4 py-3">
                    {cmsControlled ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Block CMS · {r.blockCount} {r.blockCount === 1 ? 'block' : 'blocks'}
                      </span>
                    ) : manageDocsHref ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
                        PDF list
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        Original design
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.isPublished ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(r.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-3">
                      <a
                        href={r.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-slate-500 hover:underline"
                      >
                        View ↗
                      </a>
                      {manageDocsHref && (
                        <Link
                          href={manageDocsHref}
                          className="text-xs font-medium text-violet-700 hover:underline"
                        >
                          Manage PDFs →
                        </Link>
                      )}
                      <Link
                        href={`/admin/pages/${r.id}/edit`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit →
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                  {search ? `No pages match "${search}".` : 'No pages registered yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/pages"
        searchParams={search ? { q: search } : {}}
        itemLabel="pages"
      />
    </>
  )
}
