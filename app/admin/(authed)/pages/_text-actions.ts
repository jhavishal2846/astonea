'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pageTextOverrides } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { pageTextTag, pageTextLocaleTag } from '@/lib/cms/page-text'
import { getContentSchema } from '@/lib/cms/content-schema'

export type SaveTextState = { error?: string; ok?: boolean; savedAt?: number }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

/**
 * Save the entire form for one (page, locale) in a single round-trip.
 *
 * `fields` keys map to the content-schema keys for the page. Empty strings
 * delete the override (so the page falls back to its default again).
 */
export async function savePageText(
  pagePath: string,
  locale: string,
  fields: Record<string, string>,
): Promise<SaveTextState> {
  const user = await requireAdmin()
  const schema = getContentSchema(pagePath)
  if (!schema) return { error: `Page ${pagePath} is not editable.` }

  const validKeys = new Set(schema.fields.map((f) => f.key))
  const upserts: { key: string; value: string }[] = []
  const deletes: string[] = []

  for (const [key, raw] of Object.entries(fields)) {
    if (!validKeys.has(key)) continue
    const value = (raw ?? '').trim()
    if (value === '') deletes.push(key)
    else upserts.push({ key, value })
  }

  try {
    for (const u of upserts) {
      await db
        .insert(pageTextOverrides)
        .values({
          pagePath,
          key: u.key,
          locale,
          value: u.value,
          updatedBy: user.id,
        })
        .onConflictDoUpdate({
          target: [pageTextOverrides.pagePath, pageTextOverrides.key, pageTextOverrides.locale],
          set: { value: sql`excluded.value`, updatedAt: new Date(), updatedBy: user.id },
        })
    }
    for (const k of deletes) {
      await db
        .delete(pageTextOverrides)
        .where(
          and(
            eq(pageTextOverrides.pagePath, pagePath),
            eq(pageTextOverrides.key, k),
            eq(pageTextOverrides.locale, locale),
          ),
        )
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Save failed' }
  }

  revalidatePath(pagePath)
  // For non-default locales also revalidate the locale-prefixed URL.
  if (locale !== DEFAULT_LOCALE) revalidatePath(`/${locale}${pagePath === '/' ? '' : pagePath}`)
  updateTag(pageTextTag(pagePath))
  updateTag(pageTextLocaleTag(pagePath, locale))

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Content: ${pagePath} (${locale})`,
      detail: `${upserts.length} field${upserts.length === 1 ? '' : 's'} updated, ${deletes.length} reset to default`,
      user,
    }),
  )

  return { ok: true, savedAt: Date.now() }
}

/**
 * Lighter-weight cousin of `savePageText` — saves a single (path, key, locale)
 * override at a time. Called from the in-place CMS edit overlay so each
 * inline edit goes through quickly.
 */
export async function savePageTextOne(
  pagePath: string,
  locale: string,
  key: string,
  rawValue: string,
): Promise<void> {
  const user = await requireAdmin()
  const schema = getContentSchema(pagePath)
  if (!schema) throw new Error(`Page ${pagePath} is not editable.`)
  if (!schema.fields.some((f) => f.key === key))
    throw new Error(`Unknown field: ${key}`)

  const value = (rawValue ?? '').trim()

  if (value === '') {
    await db
      .delete(pageTextOverrides)
      .where(
        and(
          eq(pageTextOverrides.pagePath, pagePath),
          eq(pageTextOverrides.key, key),
          eq(pageTextOverrides.locale, locale),
        ),
      )
  } else {
    await db
      .insert(pageTextOverrides)
      .values({ pagePath, key, locale, value, updatedBy: user.id })
      .onConflictDoUpdate({
        target: [
          pageTextOverrides.pagePath,
          pageTextOverrides.key,
          pageTextOverrides.locale,
        ],
        set: {
          value: sql`excluded.value`,
          updatedAt: new Date(),
          updatedBy: user.id,
        },
      })
  }

  revalidatePath(pagePath)
  if (locale !== DEFAULT_LOCALE) revalidatePath(`/${locale}${pagePath === '/' ? '' : pagePath}`)
  updateTag(pageTextTag(pagePath))
  updateTag(pageTextLocaleTag(pagePath, locale))

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Content: ${pagePath} (${locale})`,
      detail: value === '' ? `Reset ${key} to default` : `Updated ${key}`,
      user,
    }),
  )
}
