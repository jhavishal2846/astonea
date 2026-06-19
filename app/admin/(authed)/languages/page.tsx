import 'server-only'
import { and, asc, desc, ilike, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { languages, translationJobs } from '@/lib/db/schema'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'
import NewLanguageTrigger from './NewLanguageTrigger'
import LanguageRow from './LanguageRow'

export const dynamic = 'force-dynamic'

const PER_PAGE = 25

// The "Generate translations" action runs inside next/server's `after()` — it
// can take up to a few minutes for a full-site run (≈500 strings × 260 ms ≈
// 130 s). Bump the max duration so Vercel Pro / Enterprise honour it.
//   Hobby plan is capped to 60 s regardless and won't finish a full job in
//   one invocation — use the resumable design (re-click Generate after each
//   timeout) or upgrade to Pro.
export const maxDuration = 300

export default async function LanguagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageRaw } = await searchParams
  const search = (q ?? '').trim()
  const requested = Number(pageRaw) || 1

  const conditions: SQL[] = []
  if (search) {
    const like = `%${search}%`
    conditions.push(
      or(
        ilike(languages.code, like),
        ilike(languages.name, like),
        ilike(languages.nativeName, like),
      )!,
    )
  }
  const where = conditions.length ? and(...conditions) : undefined

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(languages)
    .where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select()
    .from(languages)
    .where(where)
    .orderBy(asc(languages.displayOrder), asc(languages.code))
    .limit(PER_PAGE)
    .offset(offset)

  // Pull the latest job per locale so the row can show progress.
  const jobs = await db
    .select()
    .from(translationJobs)
    .orderBy(desc(translationJobs.createdAt))
    .limit(50)
  const latestJobByLocale = new Map<string, (typeof jobs)[number]>()
  for (const j of jobs) {
    if (!latestJobByLocale.has(j.locale)) latestJobByLocale.set(j.locale, j)
  }

  return (
    <>
      <AdminPageHeader
        title="Languages"
        description="Languages your site supports. Add a new locale, then click 'Generate translations' to auto-translate every document title, page title, and UI string into that language."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Languages' }]}
        actions={<NewLanguageTrigger />}
      />

      <div className="mb-4">
        <AdminSearchInput
          basePath="/admin/languages"
          initial={search}
          placeholder="Search by code, name, or native name…"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Native</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Translation job</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((lang) => (
              <LanguageRow
                key={lang.code}
                lang={lang}
                job={latestJobByLocale.get(lang.code) ?? null}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-sm">
                  {search ? `No languages match "${search}".` : 'No languages yet. Add one above to get started.'}
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
        basePath="/admin/languages"
        searchParams={search ? { q: search } : {}}
        itemLabel="languages"
      />

      <div className="mt-6 rounded-xl border border-slate-200 bg-blue-50/40 px-4 py-3 text-xs text-slate-700 max-w-3xl">
        <strong className="text-slate-900">Tip:</strong> Translation generation uses the free MyMemory translation API. It runs one string at a time (paced under their rate limit), so a full site usually takes 2–4 minutes — refresh this page to watch progress. Anonymous quota is 5,000 words/day; set <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">MYMEMORY_EMAIL</code> in <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">.env.local</code> to raise it to 50,000 words/day. Brand and regulatory tokens (Astonea Labs, BSE, SEBI, CIN, etc.) are preserved verbatim.
      </div>
    </>
  )
}
