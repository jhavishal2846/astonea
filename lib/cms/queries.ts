import 'server-only'
import { unstable_cache } from 'next/cache'
import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  documents,
  groupCompanies,
  type DocumentCategory,
  type DocumentRow,
  type GroupCompany,
} from '@/lib/db/schema'
import { DOCUMENTS_ALL_TAG, documentsTag } from '@/lib/cms/cache-tags'

// Neon's serverless HTTP driver throws `fetch failed` while the free-tier
// compute wakes from idle-suspend. Retry transient network errors only.
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      const msg = e instanceof Error ? e.message : String(e)
      const cause = e instanceof Error && e.cause instanceof Error ? e.cause.message : ''
      const transient = /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up/i.test(`${msg} ${cause}`)
      if (!transient || i === attempts - 1) throw e
      await new Promise((r) => setTimeout(r, 300 * (i + 1)))
    }
  }
  throw lastErr
}

async function fetchPublishedByCategory(category: DocumentCategory): Promise<DocumentRow[]> {
  return withRetry(() =>
    db
      .select()
      .from(documents)
      .where(and(eq(documents.category, category), eq(documents.isPublished, true)))
      .orderBy(asc(documents.displayOrder), asc(documents.title))
  )
}

/**
 * Cached: fetch published documents in a category, ordered by displayOrder then title.
 * Invalidated when an admin mutation calls revalidateTag(documentsTag(category)).
 */
export async function listPublishedByCategory(category: DocumentCategory): Promise<DocumentRow[]> {
  const cached = unstable_cache(
    () => fetchPublishedByCategory(category),
    ['documents-by-category', category],
    { tags: [documentsTag(category), DOCUMENTS_ALL_TAG], revalidate: 3600 },
  )
  return cached()
}

async function fetchReg30Events(): Promise<DocumentRow[]> {
  return withRetry(() =>
    db
      .select()
      .from(documents)
      .where(and(eq(documents.category, 'reg30'), eq(documents.isPublished, true)))
      .orderBy(desc(documents.eventDate), asc(documents.displayOrder))
  )
}

/**
 * Cached: reg30 events sorted by event_date desc when present, else displayOrder.
 */
export async function listReg30Events(): Promise<DocumentRow[]> {
  const cached = unstable_cache(
    () => fetchReg30Events(),
    ['reg30-events'],
    { tags: [documentsTag('reg30'), DOCUMENTS_ALL_TAG], revalidate: 3600 },
  )
  return cached()
}

/**
 * Cached: documents in a category sorted by event_date desc — for dated event lists
 * like board meetings, AGM, EGM, newspaper publications.
 */
export async function listByCategoryByDate(category: DocumentCategory): Promise<DocumentRow[]> {
  const cached = unstable_cache(
    async () =>
      withRetry(() =>
        db
          .select()
          .from(documents)
          .where(and(eq(documents.category, category), eq(documents.isPublished, true)))
          .orderBy(desc(documents.eventDate), asc(documents.displayOrder)),
      ),
    ['documents-by-category-by-date', category],
    { tags: [documentsTag(category), DOCUMENTS_ALL_TAG], revalidate: 3600 },
  )
  return cached()
}

export type GroupedDocs = Record<string, DocumentRow[]>

export function groupBySubcategory(rows: DocumentRow[]): GroupedDocs {
  const out: GroupedDocs = {}
  for (const r of rows) {
    const key = r.subcategory ?? '__none__'
    if (!out[key]) out[key] = []
    out[key].push(r)
  }
  return out
}

async function fetchGroupCompanies(): Promise<GroupCompany[]> {
  return withRetry(() =>
    db.select().from(groupCompanies).orderBy(asc(groupCompanies.displayOrder), asc(groupCompanies.name))
  )
}

export async function listGroupCompanies(): Promise<GroupCompany[]> {
  const cached = unstable_cache(
    fetchGroupCompanies,
    ['group-companies'],
    { tags: ['group-companies'], revalidate: 3600 },
  )
  return cached()
}

export type CompanyWithDocs = GroupCompany & { docs: DocumentRow[] }

/**
 * Fetch all group companies along with their published subsidiary financial documents.
 */
export async function listGroupCompaniesWithFinancials(): Promise<CompanyWithDocs[]> {
  const cached = unstable_cache(
    async () => {
      const companies = await fetchGroupCompanies()
      const subDocs = await withRetry(() =>
        db
          .select()
          .from(documents)
          .where(and(eq(documents.category, 'subsidiary_financial'), eq(documents.isPublished, true)))
          .orderBy(asc(documents.displayOrder)),
      )
      const byEntity = new Map<string, DocumentRow[]>()
      for (const d of subDocs) {
        if (!d.entityId) continue
        if (!byEntity.has(d.entityId)) byEntity.set(d.entityId, [])
        byEntity.get(d.entityId)!.push(d)
      }
      return companies.map((c) => ({ ...c, docs: byEntity.get(c.id) ?? [] }))
    },
    ['group-companies-with-financials'],
    { tags: ['group-companies', documentsTag('subsidiary_financial')], revalidate: 3600 },
  )
  return cached()
}
