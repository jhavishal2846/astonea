/**
 * Apply hand-translated strings to the REMOTE production D1 database.
 *
 * Usage: `npx tsx --env-file=.env scripts/translations-apply-remote.ts <locale>`
 *
 * Reads `translations/<locale>.translated.json`, mirrors the dispatch logic
 * of persistTranslations() in lib/i18n/corpus.ts, but emits SQL with
 * ON CONFLICT DO UPDATE clauses instead of running Drizzle inserts — then
 * pipes the SQL file through `wrangler d1 execute astonea-prod --remote --file`.
 *
 * Why a separate script: wrangler.jsonc sets `"remote": true` on the DB binding,
 * so the dev server (and prod Worker) hit the remote D1. The local-DB script
 * (translations-apply.ts) only touches the .wrangler/state sqlite file and its
 * writes never reach the running site.
 */
import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { setByPath } from '../lib/cms/blocks/types'

const DEFAULT_LOCALE = 'en'

function sqlString(s: string | null | undefined): string {
  if (s == null) return 'NULL'
  return "'" + String(s).replace(/'/g, "''") + "'"
}

type UiRow = { key: string; value: string }
type PageRow = { pagePath: string; title: string; description: string | null; keywords: string | null }
type DocRow = { documentId: string; title: string; description: string | null }
type PageTextRow = { pagePath: string; key: string; value: string }
type ProdCatRow = { categoryId: string; label: string; description: string | null }
type ProdRow = { productId: string; name: string; description: string | null }
type TcatRow = { categoryId: string; name: string }

function main(): number {
  const locale = process.argv[2]?.trim()
  if (!locale) {
    console.error('usage: tsx scripts/translations-apply-remote.ts <locale>')
    return 1
  }
  if (locale === DEFAULT_LOCALE) {
    console.error('Refusing to push translations for the default locale (en).')
    return 1
  }

  const inFile = path.join(process.cwd(), 'translations', `${locale}.translated.json`)
  if (!fs.existsSync(inFile)) {
    console.error(`File not found: ${path.relative(process.cwd(), inFile)}`)
    return 1
  }

  const raw = fs.readFileSync(inFile, 'utf8')
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    console.error(`Invalid JSON in ${inFile}:`, e)
    return 1
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.error('Translation file must be a JSON object of { key: string }.')
    return 1
  }

  // ─── Bucket translations by table (mirrors persistTranslations) ──────────
  const ui: UiRow[] = []
  const pageUpserts = new Map<string, PageRow>()
  const docs = new Map<string, DocRow>()
  const blockPatches = new Map<string, Record<string, unknown>>()
  const pageTextUpserts: PageTextRow[] = []
  const prodCatUpserts = new Map<string, ProdCatRow>()
  const prodUpserts = new Map<string, ProdRow>()
  const tcatUpserts = new Map<string, TcatRow>()

  let skippedEmpty = 0
  let skippedUnknown = 0

  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof v !== 'string' || v.length === 0) {
      skippedEmpty++
      continue
    }
    if (k.startsWith('ui::')) {
      ui.push({ key: k.slice(4), value: v })
      continue
    }
    if (k.startsWith('page::')) {
      const rest = k.slice(6)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const pagePath = rest.slice(0, sep)
      const field = rest.slice(sep + 2) as 'title' | 'description' | 'keywords'
      const cur = pageUpserts.get(pagePath) ?? { pagePath, title: '', description: null, keywords: null }
      if (field === 'title') cur.title = v
      else if (field === 'description') cur.description = v
      else if (field === 'keywords') cur.keywords = v
      else { skippedUnknown++; continue }
      pageUpserts.set(pagePath, cur)
      continue
    }
    if (k.startsWith('doc::')) {
      const rest = k.slice(5)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const id = rest.slice(0, sep)
      const field = rest.slice(sep + 2) as 'title' | 'description'
      const cur = docs.get(id) ?? { documentId: id, title: '', description: null }
      if (field === 'title') cur.title = v
      else if (field === 'description') cur.description = v
      else { skippedUnknown++; continue }
      docs.set(id, cur)
      continue
    }
    if (k.startsWith('block::')) {
      const rest = k.slice(7)
      const sep = rest.indexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const blockId = rest.slice(0, sep)
      const fieldPath = rest.slice(sep + 2)
      const patch = blockPatches.get(blockId) ?? {}
      setByPath(patch, fieldPath, v)
      blockPatches.set(blockId, patch)
      continue
    }
    if (k.startsWith('pagetext::')) {
      const rest = k.slice(10)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      pageTextUpserts.push({ pagePath: rest.slice(0, sep), key: rest.slice(sep + 2), value: v })
      continue
    }
    if (k.startsWith('prodcat::')) {
      const rest = k.slice(9)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const id = rest.slice(0, sep)
      const field = rest.slice(sep + 2) as 'label' | 'description'
      const cur = prodCatUpserts.get(id) ?? { categoryId: id, label: '', description: null }
      if (field === 'label') cur.label = v
      else if (field === 'description') cur.description = v
      else { skippedUnknown++; continue }
      prodCatUpserts.set(id, cur)
      continue
    }
    if (k.startsWith('prod::')) {
      const rest = k.slice(6)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const id = rest.slice(0, sep)
      const field = rest.slice(sep + 2) as 'name' | 'description'
      const cur = prodUpserts.get(id) ?? { productId: id, name: '', description: null }
      if (field === 'name') cur.name = v
      else if (field === 'description') cur.description = v
      else { skippedUnknown++; continue }
      prodUpserts.set(id, cur)
      continue
    }
    if (k.startsWith('tcat::')) {
      const rest = k.slice(6)
      const sep = rest.lastIndexOf('::')
      if (sep === -1) { skippedUnknown++; continue }
      const id = rest.slice(0, sep)
      const field = rest.slice(sep + 2)
      if (field !== 'name') { skippedUnknown++; continue }
      tcatUpserts.set(id, { categoryId: id, name: v })
      continue
    }
    skippedUnknown++
  }

  // ─── Emit SQL ────────────────────────────────────────────────────────────
  const now = Date.now()
  const locSql = sqlString(locale)
  const stmts: string[] = []

  for (const u of ui) {
    stmts.push(
      `INSERT INTO ui_strings (key, locale, value, updated_at) VALUES (` +
      `${sqlString(u.key)}, ${locSql}, ${sqlString(u.value)}, ${now}) ` +
      `ON CONFLICT (key, locale) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`,
    )
  }

  for (const p of pageUpserts.values()) {
    if (!p.title) continue
    stmts.push(
      `INSERT INTO page_metadata_translations (page_path, locale, title, description, keywords, updated_at) VALUES (` +
      `${sqlString(p.pagePath)}, ${locSql}, ${sqlString(p.title)}, ${sqlString(p.description)}, ${sqlString(p.keywords)}, ${now}) ` +
      `ON CONFLICT (page_path, locale) DO UPDATE SET title=excluded.title, description=excluded.description, keywords=excluded.keywords, updated_at=excluded.updated_at`,
    )
  }

  for (const d of docs.values()) {
    if (!d.title) continue
    stmts.push(
      `INSERT INTO document_translations (document_id, locale, title, description, updated_at) VALUES (` +
      `${sqlString(d.documentId)}, ${locSql}, ${sqlString(d.title)}, ${sqlString(d.description)}, ${now}) ` +
      `ON CONFLICT (document_id, locale) DO UPDATE SET title=excluded.title, description=excluded.description, updated_at=excluded.updated_at`,
    )
  }

  for (const [blockId, patch] of blockPatches) {
    const propsJson = JSON.stringify(patch)
    stmts.push(
      `INSERT INTO page_block_translations (block_id, locale, props, updated_at) VALUES (` +
      `${sqlString(blockId)}, ${locSql}, ${sqlString(propsJson)}, ${now}) ` +
      `ON CONFLICT (block_id, locale) DO UPDATE SET props=excluded.props, updated_at=excluded.updated_at`,
    )
  }

  for (const h of pageTextUpserts) {
    stmts.push(
      `INSERT INTO page_text_overrides (page_path, key, locale, value, updated_at) VALUES (` +
      `${sqlString(h.pagePath)}, ${sqlString(h.key)}, ${locSql}, ${sqlString(h.value)}, ${now}) ` +
      `ON CONFLICT (page_path, key, locale) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`,
    )
  }

  for (const c of prodCatUpserts.values()) {
    if (!c.label) continue
    stmts.push(
      `INSERT INTO product_category_translations (category_id, locale, label, description, updated_at) VALUES (` +
      `${sqlString(c.categoryId)}, ${locSql}, ${sqlString(c.label)}, ${sqlString(c.description)}, ${now}) ` +
      `ON CONFLICT (category_id, locale) DO UPDATE SET label=excluded.label, description=excluded.description, updated_at=excluded.updated_at`,
    )
  }

  for (const p of prodUpserts.values()) {
    if (!p.name) continue
    // attributes + synonyms are NOT NULL JSON columns with $defaultFn in Drizzle
    // (no SQL default). Raw INSERT must supply them.
    stmts.push(
      `INSERT INTO product_translations (product_id, locale, name, description, attributes, synonyms, updated_at) VALUES (` +
      `${sqlString(p.productId)}, ${locSql}, ${sqlString(p.name)}, ${sqlString(p.description)}, '{}', '[]', ${now}) ` +
      `ON CONFLICT (product_id, locale) DO UPDATE SET name=excluded.name, description=excluded.description, updated_at=excluded.updated_at`,
    )
  }

  for (const c of tcatUpserts.values()) {
    if (!c.name) continue
    stmts.push(
      `INSERT INTO ticket_category_translations (category_id, locale, name, updated_at) VALUES (` +
      `${sqlString(c.categoryId)}, ${locSql}, ${sqlString(c.name)}, ${now}) ` +
      `ON CONFLICT (category_id, locale) DO UPDATE SET name=excluded.name, updated_at=excluded.updated_at`,
    )
  }

  if (stmts.length === 0) {
    console.error('Nothing to apply.')
    return 1
  }

  // ─── Write + execute via wrangler ────────────────────────────────────────
  const sqlFile = path.join(process.cwd(), 'translations', `${locale}.apply.remote.sql`)
  fs.writeFileSync(sqlFile, stmts.join(';\n') + ';\n', 'utf8')

  console.log(`[apply-remote] locale=${locale}`)
  console.log(`[apply-remote] statements    : ${stmts.length}`)
  console.log(`[apply-remote] skipped empty : ${skippedEmpty}`)
  if (skippedUnknown > 0) console.log(`[apply-remote] skipped unknown: ${skippedUnknown}`)
  console.log(`[apply-remote] sql file      : ${path.relative(process.cwd(), sqlFile)}`)
  console.log(`[apply-remote] running wrangler d1 execute --remote ...`)
  console.log('')

  const result = spawnSync(
    'npx',
    ['wrangler', 'd1', 'execute', 'astonea-prod', '--remote', '--file', sqlFile],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  )

  if (result.status !== 0) {
    console.error(`\nwrangler exited with status ${result.status}. SQL file left at ${sqlFile} for inspection.`)
    return result.status ?? 1
  }

  fs.unlinkSync(sqlFile)
  console.log('')
  console.log('Done. Remote D1 now has the translations. The dev server / deployed Worker will pick them up on the next request.')
  console.log('(unstable_cache may serve stale English copies for up to 1h — restart `npm run dev` to clear it.)')
  return 0
}

process.exit(main())
