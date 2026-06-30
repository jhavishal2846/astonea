import Link from '@/app/_nav/AppLink'
import { and, desc, eq, inArray, isNull, sql, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  tickets,
  users,
  ticketCategories,
  ticketCategoryTranslations,
  ticketTags,
  ticketToTags,
  TICKET_STATUS_VALUES,
  TICKET_PRIORITY_VALUES,
} from '@/lib/db/schema'
import {
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
} from '@/lib/tickets/types'
import { getCurrentUser } from '@/lib/auth/session'
import AdminPageHeader from '@/app/admin/_components/PageHeader'
import AdminPagination from '@/app/admin/_components/Pagination'
import AdminSearchInput from '@/app/admin/_components/SearchInput'
import { StatusBadge } from './_components/StatusBadge'
import { PriorityBadge } from './_components/PriorityBadge'
import FilterSelect from './_components/FilterSelect'
import type { TicketStatus } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

const PER_PAGE = 20

type SP = {
  q?: string
  status?: string
  priority?: string
  assignee?: string
  category?: string
  tag?: string
  page?: string
}

function splitCsv(s: string | undefined): string[] {
  return (s ?? '').split(',').map((x) => x.trim()).filter(Boolean)
}

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<SP>
}) {
  const sp = await searchParams
  const me = await getCurrentUser()

  const search = (sp.q ?? '').trim()
  const statusFilters = splitCsv(sp.status).filter((s): s is (typeof TICKET_STATUS_VALUES)[number] =>
    (TICKET_STATUS_VALUES as readonly string[]).includes(s),
  )
  const priorityFilters = splitCsv(sp.priority).filter((p): p is (typeof TICKET_PRIORITY_VALUES)[number] =>
    (TICKET_PRIORITY_VALUES as readonly string[]).includes(p),
  )
  const categorySlug = (sp.category ?? '').trim()
  const tagSlug = (sp.tag ?? '').trim()
  const assigneeRaw = (sp.assignee ?? '').trim()

  // Two condition buckets: `baseConditions` is everything except the status
  // filter, which we'll use both as the visible-list WHERE *and* the scope of
  // the per-status counts shown on the tabs. The status filter itself layers
  // on top via `statusCondition` for the visible-list query only.
  const baseConditions: SQL[] = []
  const statusCondition: SQL | null = statusFilters.length ? inArray(tickets.status, statusFilters) : null
  if (priorityFilters.length) baseConditions.push(inArray(tickets.priority, priorityFilters))

  if (categorySlug) {
    const cat = (
      await db
        .select({ id: ticketCategories.id })
        .from(ticketCategories)
        .where(eq(ticketCategories.slug, categorySlug))
        .limit(1)
    )[0]
    baseConditions.push(cat ? eq(tickets.categoryId, cat.id) : sql`1 = 0`)
  }

  if (tagSlug) {
    const tag = (
      await db.select({ id: ticketTags.id }).from(ticketTags).where(eq(ticketTags.slug, tagSlug)).limit(1)
    )[0]
    if (!tag) {
      baseConditions.push(sql`1 = 0`)
    } else {
      baseConditions.push(
        sql`EXISTS (SELECT 1 FROM ${ticketToTags} WHERE ${ticketToTags.ticketId} = ${tickets.id} AND ${ticketToTags.tagId} = ${tag.id})`,
      )
    }
  }

  if (assigneeRaw === 'me') {
    baseConditions.push(me ? eq(tickets.assignedToUserId, me.id) : sql`1 = 0`)
  } else if (assigneeRaw === 'unassigned') {
    baseConditions.push(isNull(tickets.assignedToUserId))
  } else if (assigneeRaw) {
    baseConditions.push(eq(tickets.assignedToUserId, assigneeRaw))
  }

  if (search) {
    // FTS5 MATCH gives us search across subject + body + submitter handles + short_code.
    // Wildcard prefix on the last token mimics autocomplete behaviour.
    const tokens = search
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replaceAll(/["()]/g, ''))
    if (tokens.length) {
      const last = tokens.pop()!
      const query = [...tokens.map((t) => `"${t}"`), `"${last}"*`].join(' ')
      baseConditions.push(
        sql`${tickets.id} IN (SELECT DISTINCT ticket_id FROM tickets_fts WHERE tickets_fts MATCH ${query})`,
      )
    }
  }

  const allConditions = statusCondition ? [...baseConditions, statusCondition] : baseConditions
  const where = allConditions.length ? and(...allConditions) : undefined
  const nonStatusWhere = baseConditions.length ? and(...baseConditions) : undefined
  // Server component — one render per request; this is safe and intentional.
  // eslint-disable-next-line react-hooks/purity
  const renderedAt = Date.now()

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(tickets).where(where)
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  // Status counts (per-status totals at the *current* filter scope minus the
  // status filter) so the tab numbers tell you "how many tickets would land
  // here if you picked this status, given the other filters you already have
  // set". Single GROUP-BY query, served from the same primary as the list.
  const statusCountRows = await db
    .select({ status: tickets.status, count: sql<number>`count(*)` })
    .from(tickets)
    .where(nonStatusWhere)
    .groupBy(tickets.status)
  const statusCounts = new Map<TicketStatus, number>(
    statusCountRows.map((r) => [r.status, Number(r.count)]),
  )
  const totalAcrossStatuses = Array.from(statusCounts.values()).reduce((a, b) => a + b, 0)
  const requested = Number(sp.page) || 1
  const page = Math.min(Math.max(1, requested), totalPages)
  const offset = (page - 1) * PER_PAGE

  const rows = await db
    .select({
      id: tickets.id,
      shortCode: tickets.shortCode,
      subject: tickets.subject,
      status: tickets.status,
      priority: tickets.priority,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      dueBy: tickets.dueBy,
      submitterName: tickets.submitterName,
      categorySlug: ticketCategories.slug,
      assigneeId: tickets.assignedToUserId,
      assigneeName: users.name,
      assigneeEmail: users.email,
    })
    .from(tickets)
    .leftJoin(users, eq(users.id, tickets.assignedToUserId))
    .leftJoin(ticketCategories, eq(ticketCategories.id, tickets.categoryId))
    .where(where)
    .orderBy(desc(tickets.updatedAt))
    .limit(PER_PAGE)
    .offset(offset)

  // Categories with English label (for filter chips) — falls back to slug when
  // a category has no translation row yet (only happens immediately after
  // create, before the translations seed has run).
  const catRows = await db
    .select({
      id: ticketCategories.id,
      slug: ticketCategories.slug,
      label: ticketCategoryTranslations.name,
      translationLocale: ticketCategoryTranslations.locale,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .where(eq(ticketCategories.isActive, true))
  const allCats: Array<{ slug: string; label: string }> = []
  const seenCats = new Set<string>()
  for (const r of catRows) {
    if (r.translationLocale === 'en' && r.label) {
      const i = allCats.findIndex((c) => c.slug === r.slug)
      if (i >= 0) allCats[i].label = r.label
      else allCats.push({ slug: r.slug, label: r.label })
      seenCats.add(r.slug)
    } else if (!seenCats.has(r.slug)) {
      allCats.push({ slug: r.slug, label: r.label ?? r.slug })
      seenCats.add(r.slug)
    }
  }
  const allTags = await db.select({ slug: ticketTags.slug, label: ticketTags.label }).from(ticketTags)

  const searchParamsString = (overrides: Partial<SP>): string => {
    const next = new URLSearchParams()
    const merged: SP = { ...sp, ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v) next.set(k, v as string)
    }
    next.delete('page')
    return next.toString()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        title="Tickets"
        description="Customer enquiries from the public contact + career forms."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Tickets' }]}
        actions={
          <>
            <Link
              href="/admin/tickets/categories"
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Categories
            </Link>
            <Link
              href="/admin/tickets/tags"
              className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Tags
            </Link>
          </>
        }
      />

      {/* Status tabs — multi-select via toggle. Counts react to the other filters. */}
      <div className="border-b border-slate-200 mb-5 -mx-1 px-1 overflow-x-auto">
        <div className="flex items-end gap-1 min-w-max">
          <StatusTab
            label="All"
            count={totalAcrossStatuses}
            active={statusFilters.length === 0}
            href={`/admin/tickets?${searchParamsString({ status: undefined })}`}
          />
          {(TICKET_STATUS_VALUES as readonly TicketStatus[]).map((s) => {
            const active = statusFilters.includes(s)
            const next = active
              ? statusFilters.filter((x) => x !== s).join(',')
              : [...statusFilters, s].join(',')
            return (
              <StatusTab
                key={s}
                label={TICKET_STATUS_LABELS[s]}
                count={statusCounts.get(s) ?? 0}
                active={active}
                accentColor={STATUS_ACCENT[s]}
                href={`/admin/tickets?${searchParamsString({ status: next || undefined })}`}
              />
            )
          })}
        </div>
      </div>

      {/* Secondary filters — single row, compact controls. */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-50 max-w-md">
          <AdminSearchInput basePath="/admin/tickets" initial={search} placeholder="Search subject, name, or code…" />
        </div>
        <FilterSelect
          name="priority"
          value={priorityFilters[0] ?? ''}
          placeholder="Priority"
          options={(TICKET_PRIORITY_VALUES as readonly (typeof TICKET_PRIORITY_VALUES)[number][]).map((p) => ({
            value: p,
            label: TICKET_PRIORITY_LABELS[p],
          }))}
        />
        <FilterSelect
          name="assignee"
          value={assigneeRaw}
          placeholder="Assignee"
          options={[
            ...(me ? [{ value: 'me', label: 'Assigned to me' }] : []),
            { value: 'unassigned', label: 'Unassigned' },
          ]}
        />
        {allCats.length > 0 && (
          <FilterSelect
            name="category"
            value={categorySlug}
            placeholder="Category"
            options={allCats.map((c) => ({ value: c.slug, label: c.label }))}
          />
        )}
        {allTags.length > 0 && (
          <FilterSelect
            name="tag"
            value={tagSlug}
            placeholder="Tag"
            options={allTags.map((t) => ({ value: t.slug, label: t.label }))}
          />
        )}
        {(statusFilters.length || priorityFilters.length || categorySlug || tagSlug || assigneeRaw || search) ? (
          <Link
            href="/admin/tickets"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 underline-offset-2 hover:underline px-1.5"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-16 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3">
            🎫
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {search || statusFilters.length || priorityFilters.length || categorySlug || tagSlug || assigneeRaw
              ? 'No tickets match these filters.'
              : 'No tickets yet.'}
          </p>
          {!(search || statusFilters.length || priorityFilters.length || categorySlug || tagSlug || assigneeRaw) && (
            <p className="text-xs text-slate-400 mt-1">
              Submissions from the contact, career, and support forms will appear here.
            </p>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const overdue =
              r.dueBy &&
              r.dueBy.getTime() < renderedAt &&
              (r.status === 'open' || r.status === 'in_progress' || r.status === 'waiting')
            const assigneeLabel = r.assigneeName ?? r.assigneeEmail ?? null
            const catLabel =
              r.categorySlug ? allCats.find((c) => c.slug === r.categorySlug)?.label ?? r.categorySlug : null
            const accent = STATUS_ACCENT[r.status]
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/tickets/${r.id}`}
                  className={`group block bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all border-l-4 ${accent.border}`}
                >
                  <div className="px-4 sm:px-5 py-3.5 flex items-start gap-3 sm:gap-4">
                    <span className="font-mono text-[11px] tabular-nums text-slate-400 pt-0.5 w-16 shrink-0 hidden sm:inline-block">
                      {r.shortCode}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {r.subject}
                        </span>
                        <StatusBadge status={r.status} />
                        <PriorityBadge priority={r.priority} />
                        {overdue && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                        <span className="font-mono text-[11px] tabular-nums text-slate-400 sm:hidden">
                          {r.shortCode}
                        </span>
                        <span className="text-slate-300 sm:hidden">·</span>
                        <span className="truncate max-w-56">{r.submitterName}</span>
                        {catLabel && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {catLabel}
                            </span>
                          </>
                        )}
                        <span className="text-slate-300">·</span>
                        <time
                          dateTime={new Date(r.updatedAt).toISOString()}
                          title={new Date(r.updatedAt).toLocaleString()}
                        >
                          {timeAgo(r.updatedAt, renderedAt)}
                        </time>
                      </div>
                    </div>
                    <div className="shrink-0 text-xs">
                      {assigneeLabel ? (
                        <span
                          className="inline-flex items-center gap-1.5"
                          title={`Assigned to ${assigneeLabel}`}
                        >
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-[11px]">
                            {assigneeLabel.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="text-slate-600 truncate max-w-32 hidden md:inline">
                            {assigneeLabel}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-slate-300 text-slate-400 text-[11px]"
                          title="Unassigned"
                          aria-label="Unassigned"
                        >
                          ?
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <AdminPagination
        total={total}
        perPage={PER_PAGE}
        current={page}
        basePath="/admin/tickets"
        searchParams={Object.fromEntries(
          Object.entries(sp).filter(([k, v]) => k !== 'page' && Boolean(v)),
        ) as Record<string, string>}
        itemLabel="tickets"
      />
    </div>
  )
}

/**
 * Status tab — GitHub/Linear style underlined tab. Active state lights up the
 * label + bottom border using the per-status accent color, so the page's
 * dominant color signals which status the user is currently viewing.
 */
function StatusTab({
  label,
  count,
  active,
  href,
  accentColor,
}: {
  label: string
  count: number
  active: boolean
  href: string
  accentColor?: { text: string; underline: string }
}) {
  const activeText = accentColor?.text ?? 'text-slate-900'
  const activeUnderline = accentColor?.underline ?? 'border-b-slate-900'
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 px-3 py-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
        active ? `${activeText} ${activeUnderline}` : 'text-slate-500 border-transparent hover:text-slate-800'
      }`}
    >
      <span>{label}</span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums min-w-5 text-center transition-colors ${
          active ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
        }`}
      >
        {count}
      </span>
    </Link>
  )
}

/**
 * Per-status accents used on the list-row left border and the status-tab
 * underline. `border` and `underline` are kept as separate literal class names
 * so Tailwind's static scanner picks both up — building them at runtime via
 * `.replace()` makes the classes invisible to the build.
 */
const STATUS_ACCENT: Record<TicketStatus, { border: string; underline: string; text: string }> = {
  open: { border: 'border-l-rose-400', underline: 'border-b-rose-500', text: 'text-rose-700' },
  in_progress: { border: 'border-l-amber-400', underline: 'border-b-amber-500', text: 'text-amber-700' },
  waiting: { border: 'border-l-sky-400', underline: 'border-b-sky-500', text: 'text-sky-700' },
  resolved: { border: 'border-l-emerald-400', underline: 'border-b-emerald-500', text: 'text-emerald-700' },
  closed: { border: 'border-l-slate-300', underline: 'border-b-slate-400', text: 'text-slate-600' },
}

/**
 * Compact "3m ago" / "2h ago" / "Mar 14" formatter for the row's updated-at
 * column. Server-rendered, so `now` is passed in from the page to keep all
 * rows internally consistent (avoids drift from repeated Date.now() calls).
 */
function timeAgo(date: Date, now: number): string {
  const diff = now - date.getTime()
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
