'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { after } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  languages,
  translationJobs,
  type TranslationJobStatus,
} from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'
import { LOCALES_TAG, DEFAULT_LOCALE } from '@/lib/i18n/locales'
import { uiStringsTag } from '@/lib/i18n/ui-strings'
import { pageTag, pageLocaleTag } from '@/lib/cms/pages'
import {
  buildSourceCorpus,
  fetchExistingTranslationKeys,
  persistTranslations,
  type TranslatedBatch,
} from '@/lib/i18n/corpus'
import {
  translateOne,
  TranslationError,
} from '@/lib/i18n/translate'

export type LangActionState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

// ─── Language CRUD ───────────────────────────────────────────────────────

const LOCALE_CODE_RE = /^[a-z]{2,3}(-[A-Z]{2})?$/

export async function addLanguage(
  _prev: LangActionState,
  formData: FormData,
): Promise<LangActionState> {
  const user = await requireAdmin()
  const code = String(formData.get('code') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const nativeName = String(formData.get('nativeName') ?? '').trim() || name

  if (!LOCALE_CODE_RE.test(code))
    return { error: 'Locale code must be 2-3 lowercase letters, optionally followed by -XX (e.g. en, hi, en-GB).' }
  if (!name) return { error: 'Language name is required.' }
  if (code === DEFAULT_LOCALE)
    return { error: 'The default locale "en" already exists and cannot be re-added.' }

  try {
    await db
      .insert(languages)
      .values({
        code,
        name,
        nativeName,
        isActive: true,
        isDefault: false,
        displayOrder: 100,
      })
      .onConflictDoNothing()
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to add language' }
  }

  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)

  after(() =>
    recordActivity({
      action: 'create',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${name} (${code})`,
      detail: 'Added a new site language',
      user,
    }),
  )

  return { ok: true }
}

export async function setLanguageActive(code: string, active: boolean) {
  const user = await requireAdmin()
  if (code === DEFAULT_LOCALE && !active)
    throw new Error('Cannot deactivate the default locale')

  await db.update(languages).set({ isActive: active }).where(eq(languages.code, code))
  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)

  after(() =>
    recordActivity({
      action: active ? 'publish' : 'unpublish',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${code}`,
      detail: active ? 'Activated' : 'Deactivated',
      user,
    }),
  )
}

/**
 * Force-fail any running translation job for this locale. Use this to
 * recover from a stuck row — for example when the dev server was killed
 * mid-run and the row is still marked `running`, blocking re-clicks of
 * "Generate translations".
 */
export async function cancelTranslationJob(locale: string) {
  const user = await requireAdmin()
  if (locale === DEFAULT_LOCALE) throw new Error('No translation jobs run on the default locale')

  const updated = await db
    .update(translationJobs)
    .set({
      status: 'failed',
      errorMessage: 'Cancelled by admin',
      finishedAt: new Date(),
    })
    .where(
      and(
        eq(translationJobs.locale, locale),
        inArray(translationJobs.status, ['queued', 'running']),
      ),
    )
    .returning({ id: translationJobs.id })

  revalidatePath('/admin/languages')

  after(() =>
    recordActivity({
      action: 'update',
      entityType: 'document',
      entityId: null,
      entityTitle: `Translations: ${locale}`,
      detail: `Cancelled ${updated.length} in-flight translation job${updated.length === 1 ? '' : 's'}.`,
      user,
    }),
  )

  return { cancelled: updated.length }
}

export async function deleteLanguage(code: string) {
  const user = await requireAdmin()
  if (code === DEFAULT_LOCALE) throw new Error('Cannot delete the default locale')

  await db.delete(languages).where(eq(languages.code, code))
  revalidatePath('/admin/languages')
  updateTag(LOCALES_TAG)
  updateTag(uiStringsTag(code))

  after(() =>
    recordActivity({
      action: 'delete',
      entityType: 'document',
      entityId: null,
      entityTitle: `Language: ${code}`,
      detail: 'Removed site language and all its translations',
      user,
    }),
  )
}

// ─── Translation generation (long-running) ───────────────────────────────
// Corpus + persistence helpers live in lib/i18n/corpus.ts so the CLI scripts
// in scripts/translations-*.ts can reuse them.

async function setJobStatus(
  id: string,
  patch: Partial<{
    status: TranslationJobStatus
    completedItems: number
    errorMessage: string | null
    startedAt: Date
    finishedAt: Date
  }>,
) {
  await db
    .update(translationJobs)
    .set(patch)
    .where(eq(translationJobs.id, id))
}

export async function generateTranslationsForLocale(
  locale: string,
): Promise<{ jobId: string }> {
  const user = await requireAdmin()
  if (locale === DEFAULT_LOCALE) throw new Error('Cannot translate into the default locale')

  const [lang] = await db.select().from(languages).where(eq(languages.code, locale)).limit(1)
  if (!lang) throw new Error(`Language ${locale} is not registered`)

  // Avoid stacking jobs.
  const existing = await db
    .select({ id: translationJobs.id })
    .from(translationJobs)
    .where(and(eq(translationJobs.locale, locale), eq(translationJobs.status, 'running')))
    .limit(1)
  if (existing.length > 0) {
    throw new Error('A translation job is already running for this locale')
  }

  const { items: allItems } = await buildSourceCorpus(db)
  const alreadyTranslated = await fetchExistingTranslationKeys(db, locale)

  // Resumable: skip anything we already have a translation for.
  const items: Record<string, string> = {}
  for (const [k, v] of Object.entries(allItems)) {
    if (!alreadyTranslated.has(k)) items[k] = v
  }
  const total = Object.keys(items).length
  const skipped = Object.keys(allItems).length - total

  if (total === 0) {
    throw new Error(
      `Everything is already translated for ${locale}. To re-translate, delete the existing rows from document_translations / page_metadata_translations / ui_strings first.`,
    )
  }

  const [job] = await db
    .insert(translationJobs)
    .values({
      locale,
      status: 'queued',
      totalItems: total,
      completedItems: 0,
      createdBy: user.id,
    })
    .returning({ id: translationJobs.id })

  revalidatePath('/admin/languages')

  // Run in the background after the response returns.
  after(async () => {
    try {
      await setJobStatus(job.id, { status: 'running', startedAt: new Date() })

      const keys = Object.keys(items)
      const accumulator: TranslatedBatch = {}
      const affectedPagePaths = new Set<string>()
      let done = 0
      // Flush partial results every N items. Kept small so the progress bar
      // moves visibly (every ~1.3s at MyMemory's 260ms pace) rather than
      // jumping in 4-second steps.
      const PERSIST_EVERY = 5
      let lastFlushAt = 0
      let quotaHit = false
      let quotaMessage = ''

      for (const k of keys) {
        try {
          accumulator[k] = await translateOne(items[k], locale)
        } catch (e) {
          const msg = e instanceof Error ? e.message : ''
          if (/quota|429|too many requests|all available free|limit/i.test(msg)) {
            quotaHit = true
            quotaMessage = msg
            break
          }
          // Non-quota error on this string → fall back to source and continue.
          accumulator[k] = items[k]
        }
        done++

        if (done - lastFlushAt >= PERSIST_EVERY) {
          const result = await persistTranslations(db, locale, accumulator)
          for (const p of result.affectedPagePaths) affectedPagePaths.add(p)
          await setJobStatus(job.id, { completedItems: done })
          lastFlushAt = done
        }
      }

      // Always flush whatever we accumulated.
      if (Object.keys(accumulator).length > lastFlushAt) {
        const { affectedPagePaths: paths } = await persistTranslations(db, locale, accumulator)
        for (const p of paths) affectedPagePaths.add(p)
      }

      updateTag(uiStringsTag(locale))
      updateTag('ui-strings:all')
      updateTag(LOCALES_TAG)
      for (const path of affectedPagePaths) {
        updateTag(pageTag(path))
        updateTag(pageLocaleTag(path, locale))
      }

      if (quotaHit) {
        const friendly = `MyMemory daily quota exhausted after ${done}/${total} strings. ${
          skipped > 0 ? `(${skipped} already-translated items were skipped before this run.) ` : ''
        }Re-run "Generate translations" once the quota resets — it will resume where it stopped. Set MYMEMORY_EMAIL in .env.local and restart dev to raise the daily limit from 5K to 50K words.`
        await setJobStatus(job.id, {
          status: 'failed',
          completedItems: done,
          errorMessage: friendly + ` Original error: ${quotaMessage}`,
          finishedAt: new Date(),
        })
        await recordActivity({
          action: 'update',
          entityType: 'document',
          entityId: null,
          entityTitle: `Translations: ${lang.name} (${locale})`,
          detail: `Partial: ${done}/${total} translated before MyMemory quota hit.`,
          user,
        })
        return
      }

      await setJobStatus(job.id, {
        status: 'completed',
        completedItems: total,
        finishedAt: new Date(),
        errorMessage: null,
      })

      await recordActivity({
        action: 'update',
        entityType: 'document',
        entityId: null,
        entityTitle: `Translations: ${lang.name} (${locale})`,
        detail: `Auto-translated ${total} new strings (${skipped} already-translated items skipped) via MyMemory.`,
        user,
      })
    } catch (e) {
      const msg =
        e instanceof TranslationError
          ? e.message
          : e instanceof Error
          ? e.message
          : 'Unknown error'
      await setJobStatus(job.id, {
        status: 'failed',
        errorMessage: msg,
        finishedAt: new Date(),
      })
    }
  })

  return { jobId: job.id }
}
