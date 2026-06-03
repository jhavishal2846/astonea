import { NextResponse } from 'next/server'
import { and, asc, eq, ilike, or, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { documents, groupCompanies } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { CATEGORY_LABELS, SUBCATEGORY_LABELS, isValidCategory } from '@/lib/cms/categories'

export const dynamic = 'force-dynamic'

function csvEscape(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(req: Request) {
  const me = await getCurrentUser()
  if (!me) return new NextResponse('Unauthorized', { status: 401 })

  const url = new URL(req.url)
  const categoryRaw = url.searchParams.get('category')
  const q = url.searchParams.get('q')?.trim() ?? ''
  const category = categoryRaw && isValidCategory(categoryRaw) ? categoryRaw : null

  const conditions: SQL[] = []
  if (category) conditions.push(eq(documents.category, category))
  if (q) {
    const like = `%${q}%`
    conditions.push(
      or(
        ilike(documents.title, like),
        ilike(documents.period, like),
        ilike(documents.fileUrl, like),
      )!,
    )
  }

  const rows = await db
    .select({
      title: documents.title,
      category: documents.category,
      subcategory: documents.subcategory,
      period: documents.period,
      eventDate: documents.eventDate,
      fileUrl: documents.fileUrl,
      externalLink: documents.externalLink,
      isPublished: documents.isPublished,
      displayOrder: documents.displayOrder,
      description: documents.description,
      entityName: groupCompanies.name,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .leftJoin(groupCompanies, eq(documents.entityId, groupCompanies.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(documents.category), asc(documents.displayOrder), asc(documents.title))

  const header = [
    'title',
    'category',
    'subcategory',
    'period',
    'event_date',
    'group_company',
    'file_url',
    'external_link',
    'published',
    'display_order',
    'description',
    'updated_at',
  ]

  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.title),
        csvEscape(CATEGORY_LABELS[r.category]),
        csvEscape(r.subcategory ? SUBCATEGORY_LABELS[r.subcategory] ?? r.subcategory : ''),
        csvEscape(r.period),
        csvEscape(r.eventDate),
        csvEscape(r.entityName),
        csvEscape(r.fileUrl),
        csvEscape(r.externalLink),
        csvEscape(r.isPublished ? 'yes' : 'no'),
        csvEscape(r.displayOrder),
        csvEscape(r.description),
        csvEscape(r.updatedAt.toISOString()),
      ].join(','),
    )
  }

  const csv = lines.join('\r\n')
  const filename = `documents${category ? `-${category}` : ''}-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
