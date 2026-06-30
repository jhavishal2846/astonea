/**
 * Dump every untranslated source string for a locale to JSON.
 *
 * Usage: `npx tsx --env-file=.env scripts/translations-dump.ts <locale>`
 *
 * Reads the same corpus that the admin "Generate translations" button reads
 * (lib/i18n/corpus.ts) and filters out anything already present in the
 * locale's translation tables. The resulting JSON file can be hand-translated
 * (or pasted into a chat with an LLM for bulk translation), saved as
 * `translations/<locale>.translated.json`, and applied with
 * `scripts/translations-apply.ts`.
 */
import path from 'node:path'
import fs from 'node:fs'
import { openLocalDb } from '../lib/db/script-client'
import { buildSourceCorpus, fetchExistingTranslationKeys } from '../lib/i18n/corpus'

const DEFAULT_LOCALE = 'en'

async function main() {
  const locale = process.argv[2]?.trim()
  if (!locale) {
    console.error('usage: tsx scripts/translations-dump.ts <locale>')
    process.exit(1)
  }
  if (locale === DEFAULT_LOCALE) {
    console.error('Refusing to dump the default locale (en) — it IS the source.')
    process.exit(1)
  }

  const db = openLocalDb()
  const { items: allItems } = await buildSourceCorpus(db)
  const alreadyTranslated = await fetchExistingTranslationKeys(db, locale)

  const untranslated: Record<string, string> = {}
  for (const [k, v] of Object.entries(allItems)) {
    // Block translations are tracked at block-id granularity (one props patch
    // per row), but the corpus emits one key per translatable field path
    // (block::<id>::<dotted.path>). Resolve to the id-only key before lookup
    // so a translated block doesn't reappear in every subsequent dump.
    let lookupKey = k
    if (k.startsWith('block::')) {
      const rest = k.slice(7)
      const sep = rest.indexOf('::')
      if (sep !== -1) lookupKey = `block::${rest.slice(0, sep)}`
    }
    if (!alreadyTranslated.has(lookupKey)) untranslated[k] = v
  }

  const outDir = path.join(process.cwd(), 'translations')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const outFile = path.join(outDir, `${locale}.source.json`)
  fs.writeFileSync(outFile, JSON.stringify(untranslated, null, 2) + '\n', 'utf8')

  const totalAll = Object.keys(allItems).length
  const totalUntranslated = Object.keys(untranslated).length
  const skipped = totalAll - totalUntranslated

  console.log(`[dump] locale=${locale}`)
  console.log(`[dump] corpus total      : ${totalAll}`)
  console.log(`[dump] already translated: ${skipped}`)
  console.log(`[dump] needs translation : ${totalUntranslated}`)
  console.log(`[dump] wrote → ${path.relative(process.cwd(), outFile)}`)

  if (totalUntranslated === 0) {
    console.log('[dump] Nothing left to translate for this locale.')
  } else {
    console.log('')
    console.log('Next steps:')
    console.log(`  1. Share the file contents with a translator (LLM or human).`)
    console.log(`  2. Save the translated map as translations/${locale}.translated.json`)
    console.log(`     (same keys; values replaced with the translation).`)
    console.log(`  3. Run: npx tsx --env-file=.env scripts/translations-apply.ts ${locale}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
