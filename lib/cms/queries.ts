import 'server-only'
import { unstable_cache } from 'next/cache'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import {
  documents,
  documentTranslations,
  groupCompanies,
  type DocumentCategory,
  type DocumentRow,
  type GroupCompany,
} from '@/lib/db/schema'
import { DOCUMENTS_ALL_TAG, documentsTag } from '@/lib/cms/cache-tags'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'

/**
 * Read the current request locale. Safe to call even outside a request scope
 * (e.g. during the build's static-prerender pass) — falls back to the default.
 */
async function currentLocale(): Promise<string> {
  try {
    return await getLocale()
  } catch {
    return DEFAULT_LOCALE
  }
}

/**
 * Overlay translated title/description onto base rows for non-default locales.
 * Missing translations naturally fall back to the English source.
 *
 * Single round-trip via `inArray` lookup; no N+1.
 */
async function overlayTranslations(
  rows: DocumentRow[],
  locale: string,
): Promise<DocumentRow[]> {
  if (locale === DEFAULT_LOCALE || rows.length === 0) return rows
  const ids = rows.map((r) => r.id)
  const translations = await db
    .select({
      documentId: documentTranslations.documentId,
      title: documentTranslations.title,
      description: documentTranslations.description,
    })
    .from(documentTranslations)
    .where(
      and(
        eq(documentTranslations.locale, locale),
        inArray(documentTranslations.documentId, ids),
      ),
    )
  if (translations.length === 0) return rows
  const byId = new Map(translations.map((t) => [t.documentId, t]))
  return rows.map((r) => {
    const t = byId.get(r.id)
    if (!t) return r
    return {
      ...r,
      title: t.title,
      description: t.description ?? r.description,
    }
  })
}

async function fetchPublishedByCategory(category: DocumentCategory): Promise<DocumentRow[]> {
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.category, category), eq(documents.isPublished, true)))
    .orderBy(asc(documents.displayOrder), asc(documents.title))
}

/**
 * Cached + locale-aware: fetch published documents in a category, ordered by
 * displayOrder then title. Translates titles/descriptions to the current
 * request locale when a non-default locale is active.
 */
export async function listPublishedByCategory(category: DocumentCategory): Promise<DocumentRow[]> {
  const locale = await currentLocale()
  const cached = unstable_cache(
    async () => {
      const rows = await fetchPublishedByCategory(category)
      return overlayTranslations(rows, locale)
    },
    ['documents-by-category', category, locale],
    {
      tags: [documentsTag(category), DOCUMENTS_ALL_TAG, `documents:${category}:${locale}`],
      revalidate: 3600,
    },
  )
  return cached()
}

async function fetchReg30Events(): Promise<DocumentRow[]> {
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.category, 'reg30'), eq(documents.isPublished, true)))
    .orderBy(desc(documents.eventDate), asc(documents.displayOrder))
}

/**
 * Cached + locale-aware: reg30 events sorted by event_date desc when present.
 */
export async function listReg30Events(): Promise<DocumentRow[]> {
  const locale = await currentLocale()
  const cached = unstable_cache(
    async () => {
      const rows = await fetchReg30Events()
      return overlayTranslations(rows, locale)
    },
    ['reg30-events', locale],
    {
      tags: [documentsTag('reg30'), DOCUMENTS_ALL_TAG, `documents:reg30:${locale}`],
      revalidate: 3600,
    },
  )
  return cached()
}

/**
 * Cached + locale-aware: documents in a category sorted by event_date desc.
 */
export async function listByCategoryByDate(category: DocumentCategory): Promise<DocumentRow[]> {
  const locale = await currentLocale()
  const cached = unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(documents)
        .where(and(eq(documents.category, category), eq(documents.isPublished, true)))
        .orderBy(desc(documents.eventDate), asc(documents.displayOrder))
      return overlayTranslations(rows, locale)
    },
    ['documents-by-category-by-date', category, locale],
    {
      tags: [documentsTag(category), DOCUMENTS_ALL_TAG, `documents:${category}:${locale}`],
      revalidate: 3600,
    },
  )
  return cached()
}

/**
 * Cached + locale-aware: fetch a specific list of documents by ID, returning
 * them in the order the IDs were provided. Skips missing or unpublished docs.
 */
export async function listPublishedByIds(ids: string[]): Promise<DocumentRow[]> {
  if (ids.length === 0) return []
  const locale = await currentLocale()
  // Order isn't preserved by `inArray`, so cache key is a sorted hash of the IDs
  // plus locale; we re-order in-memory after fetch.
  const sortedKey = ids.slice().sort().join(',')
  const cached = unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(documents)
        .where(and(inArray(documents.id, ids), eq(documents.isPublished, true)))
      return overlayTranslations(rows, locale)
    },
    ['documents-by-ids', sortedKey, locale],
    {
      tags: [DOCUMENTS_ALL_TAG, ...ids.map((id) => `document:${id}`)],
      revalidate: 3600,
    },
  )
  const rows = await cached()
  const byId = new Map(rows.map((r) => [r.id, r]))
  return ids.map((id) => byId.get(id)).filter((r): r is DocumentRow => Boolean(r))
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
  return db.select().from(groupCompanies).orderBy(asc(groupCompanies.displayOrder), asc(groupCompanies.name))
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
 * Fetch all group companies along with their published subsidiary financial
 * documents (locale-aware translations applied to docs).
 */
export async function listGroupCompaniesWithFinancials(): Promise<CompanyWithDocs[]> {
  const locale = await currentLocale()
  const cached = unstable_cache(
    async () => {
      const companies = await fetchGroupCompanies()
      const subDocs = await db
        .select()
        .from(documents)
        .where(and(eq(documents.category, 'subsidiary_financial'), eq(documents.isPublished, true)))
        .orderBy(asc(documents.displayOrder))
      const translated = await overlayTranslations(subDocs, locale)
      const byEntity = new Map<string, DocumentRow[]>()
      for (const d of translated) {
        if (!d.entityId) continue
        if (!byEntity.has(d.entityId)) byEntity.set(d.entityId, [])
        byEntity.get(d.entityId)!.push(d)
      }
      return companies.map((c) => ({ ...c, docs: byEntity.get(c.id) ?? [] }))
    },
    ['group-companies-with-financials', locale],
    {
      tags: ['group-companies', documentsTag('subsidiary_financial'), `documents:subsidiary_financial:${locale}`],
      revalidate: 3600,
    },
  )
  return cached()
}
