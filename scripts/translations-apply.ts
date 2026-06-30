/**
 * Apply hand-translated strings to the local D1 database.
 *
 * Usage: `npx tsx --env-file=.env scripts/translations-apply.ts <locale>`
 *
 * Reads `translations/<locale>.translated.json` — a flat map of corpus keys
 * (see lib/i18n/corpus.ts for the key scheme) to target-language values — and
 * upserts them into the same translation tables that the admin "Generate
 * translations" button writes to.
 *
 * Validates each entry against the source corpus: keys not present in the
 * corpus are warned and skipped (typo? stale dump?); empty/non-string values
 * are skipped too.
 *
 * After running, you may need to restart `next dev` or wait up to one hour
 * for the unstable_cache-backed UI string / page caches to refresh.
 */
import path from 'node:path'
import fs from 'node:fs'
import { eq } from 'drizzle-orm'
import { openLocalDb } from '../lib/db/script-client'
import { languages } from '../lib/db/schema'
import { buildSourceCorpus, persistTranslations } from '../lib/i18n/corpus'

const DEFAULT_LOCALE = 'en'

async function main() {
  const locale = process.argv[2]?.trim()
  if (!locale) {
    console.error('usage: tsx scripts/translations-apply.ts <locale>')
    process.exit(1)
  }
  if (locale === DEFAULT_LOCALE) {
    console.error('Refusing to apply translations to the default locale (en).')
    process.exit(1)
  }

  const inFile = path.join(process.cwd(), 'translations', `${locale}.translated.json`)
  if (!fs.existsSync(inFile)) {
    console.error(`File not found: ${path.relative(process.cwd(), inFile)}`)
    console.error('Run translations-dump.ts first, translate the resulting .source.json,')
    console.error(`then save it as ${locale}.translated.json next to it.`)
    process.exit(1)
  }

  const raw = fs.readFileSync(inFile, 'utf8')
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    console.error(`Invalid JSON in ${inFile}:`, e)
    process.exit(1)
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.error('Translation file must be a JSON object of { key: string }.')
    process.exit(1)
  }

  const db = openLocalDb()

  // Sanity-check the locale is registered.
  const [lang] = await db
    .select()
    .from(languages)
    .where(eq(languages.code, locale))
    .limit(1)
  if (!lang) {
    console.error(`Locale "${locale}" is not registered in the languages table.`)
    console.error('Add it via the admin /admin/languages page first.')
    process.exit(1)
  }

  // Validate keys against the live corpus — catches typos and stale dumps.
  const { items: corpus } = await buildSourceCorpus(db)
  const corpusKeys = new Set(Object.keys(corpus))

  const translations: Record<string, string> = {}
  let skippedUnknown = 0
  let skippedEmpty = 0
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (!corpusKeys.has(k)) {
      console.warn(`[apply] skip unknown key: ${k}`)
      skippedUnknown++
      continue
    }
    if (typeof v !== 'string' || v.trim().length === 0) {
      console.warn(`[apply] skip empty/non-string value: ${k}`)
      skippedEmpty++
      continue
    }
    translations[k] = v
  }

  const accepted = Object.keys(translations).length
  if (accepted === 0) {
    console.error('No valid translations to apply.')
    process.exit(1)
  }

  const { affectedPagePaths } = await persistTranslations(db, locale, translations)

  console.log(`[apply] locale=${locale} (${lang.name})`)
  console.log(`[apply] accepted          : ${accepted}`)
  if (skippedUnknown > 0) console.log(`[apply] skipped (unknown) : ${skippedUnknown}`)
  if (skippedEmpty > 0) console.log(`[apply] skipped (empty)   : ${skippedEmpty}`)
  console.log(`[apply] affected pages    : ${affectedPagePaths.size}`)
  console.log('')
  console.log('Done. If the public site does not show the new strings:')
  console.log('  - Restart `npm run dev` (clears next/cache in-memory).')
  console.log('  - Or wait up to 1 hour for the unstable_cache TTL to expire.')
  console.log('  - On Cloudflare prod, the cache refreshes on next request after deploy.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
