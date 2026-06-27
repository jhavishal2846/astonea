/**
 * One-shot: dump every relevant table from the existing Neon Postgres database
 * into a SQL file of D1-compatible INSERT statements, then optionally apply
 * the dump against Cloudflare D1 via `wrangler d1 execute`.
 *
 * Transforms applied per row:
 *   - boolean → 0 / 1
 *   - timestamp(tz) → epoch ms integer
 *   - jsonb → JSON string
 *   - text[] → JSON-stringified array
 *   - generated `search_vector` columns are skipped (FTS5 takes over)
 *
 * Tables are processed in FK-safe order; `sessions` is skipped on purpose
 * (users re-login post-cutover).
 *
 * After loading, rebuilds the FTS5 indexes (the AFTER triggers fire on row
 * INSERT, so contentless `products_fts` is already populated — but rebuild
 * is cheap and catches edge cases where INSERTs predate triggers).
 *
 * Env required:
 *   DATABASE_URL                 — Neon connection string (read-only is fine)
 *
 * Flags:
 *   --dry-run        — just print SQL to stdout; do not write file or apply
 *   --apply          — run `wrangler d1 execute DB --file=dump.sql`
 *   --remote         — combined with --apply, target the remote D1 (else local)
 *   --table=<name>   — only dump this one table (repeatable)
 *   --out=<path>     — output path (default: ./dump.sql)
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/migrate-neon-to-d1.ts             # dump only
 *   npx tsx --env-file=.env scripts/migrate-neon-to-d1.ts --apply     # dump + apply local
 *   npx tsx --env-file=.env scripts/migrate-neon-to-d1.ts --apply --remote
 */
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

type ColType = 'text' | 'int' | 'bool' | 'tsms' | 'json' | 'array' | 'skip'

type TableSpec = {
  pg: string                                    // Postgres table name
  d1: string                                    // D1 (SQLite) table name (same here, but explicit)
  columns: Array<{ pg: string; d1: string; type: ColType }>
}

const TABLES: TableSpec[] = [
  {
    pg: 'languages',
    d1: 'languages',
    columns: [
      { pg: 'code',          d1: 'code',          type: 'text' },
      { pg: 'name',          d1: 'name',          type: 'text' },
      { pg: 'native_name',   d1: 'native_name',   type: 'text' },
      { pg: 'is_default',    d1: 'is_default',    type: 'bool' },
      { pg: 'is_active',     d1: 'is_active',     type: 'bool' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'users',
    d1: 'users',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'email',         d1: 'email',         type: 'text' },
      { pg: 'password_hash', d1: 'password_hash', type: 'text' },
      { pg: 'name',          d1: 'name',          type: 'text' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
      { pg: 'updated_at',    d1: 'updated_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'group_companies',
    d1: 'group_companies',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'slug',          d1: 'slug',          type: 'text' },
      { pg: 'name',          d1: 'name',          type: 'text' },
      { pg: 'description',   d1: 'description',   type: 'text' },
      { pg: 'entity_type',   d1: 'entity_type',   type: 'text' },
      { pg: 'cin',           d1: 'cin',           type: 'text' },
      { pg: 'website_url',   d1: 'website_url',   type: 'text' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
      { pg: 'updated_at',    d1: 'updated_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'documents',
    d1: 'documents',
    columns: [
      { pg: 'id',                d1: 'id',                type: 'text' },
      { pg: 'category',          d1: 'category',          type: 'text' },
      { pg: 'subcategory',       d1: 'subcategory',       type: 'text' },
      { pg: 'title',             d1: 'title',             type: 'text' },
      { pg: 'description',       d1: 'description',       type: 'text' },
      { pg: 'file_url',          d1: 'file_url',          type: 'text' },
      { pg: 'file_size_bytes',   d1: 'file_size_bytes',   type: 'int' },
      { pg: 'period',            d1: 'period',            type: 'text' },
      // ISO date string preserved as-is.
      { pg: "to_char(event_date, 'YYYY-MM-DD') as event_date_str", d1: 'event_date', type: 'text' },
      { pg: 'entity_id',         d1: 'entity_id',         type: 'text' },
      { pg: 'external_link',     d1: 'external_link',     type: 'text' },
      { pg: 'display_order',     d1: 'display_order',     type: 'int' },
      { pg: 'is_published',      d1: 'is_published',      type: 'bool' },
      { pg: 'created_at',        d1: 'created_at',        type: 'tsms' },
      { pg: 'updated_at',        d1: 'updated_at',        type: 'tsms' },
    ],
  },
  {
    pg: 'document_translations',
    d1: 'document_translations',
    columns: [
      { pg: 'document_id', d1: 'document_id', type: 'text' },
      { pg: 'locale',      d1: 'locale',      type: 'text' },
      { pg: 'title',       d1: 'title',       type: 'text' },
      { pg: 'description', d1: 'description', type: 'text' },
      { pg: 'updated_at',  d1: 'updated_at',  type: 'tsms' },
    ],
  },
  {
    pg: 'page_metadata',
    d1: 'page_metadata',
    columns: [
      { pg: 'page_path',   d1: 'page_path',   type: 'text' },
      { pg: 'title',       d1: 'title',       type: 'text' },
      { pg: 'description', d1: 'description', type: 'text' },
      { pg: 'og_image',    d1: 'og_image',    type: 'text' },
      { pg: 'keywords',    d1: 'keywords',    type: 'text' },
      { pg: 'canonical',   d1: 'canonical',   type: 'text' },
      { pg: 'no_index',    d1: 'no_index',    type: 'bool' },
      { pg: 'updated_at',  d1: 'updated_at',  type: 'tsms' },
      { pg: 'updated_by',  d1: 'updated_by',  type: 'text' },
    ],
  },
  {
    pg: 'page_metadata_translations',
    d1: 'page_metadata_translations',
    columns: [
      { pg: 'page_path',   d1: 'page_path',   type: 'text' },
      { pg: 'locale',      d1: 'locale',      type: 'text' },
      { pg: 'title',       d1: 'title',       type: 'text' },
      { pg: 'description', d1: 'description', type: 'text' },
      { pg: 'keywords',    d1: 'keywords',    type: 'text' },
      { pg: 'updated_at',  d1: 'updated_at',  type: 'tsms' },
    ],
  },
  {
    pg: 'ui_strings',
    d1: 'ui_strings',
    columns: [
      { pg: 'key',        d1: 'key',        type: 'text' },
      { pg: 'locale',     d1: 'locale',     type: 'text' },
      { pg: 'value',      d1: 'value',      type: 'text' },
      { pg: 'updated_at', d1: 'updated_at', type: 'tsms' },
    ],
  },
  {
    pg: 'translation_jobs',
    d1: 'translation_jobs',
    columns: [
      { pg: 'id',              d1: 'id',              type: 'text' },
      { pg: 'locale',          d1: 'locale',          type: 'text' },
      { pg: 'status',          d1: 'status',          type: 'text' },
      { pg: 'total_items',     d1: 'total_items',     type: 'int' },
      { pg: 'completed_items', d1: 'completed_items', type: 'int' },
      { pg: 'error_message',   d1: 'error_message',   type: 'text' },
      { pg: 'started_at',      d1: 'started_at',      type: 'tsms' },
      { pg: 'finished_at',     d1: 'finished_at',     type: 'tsms' },
      { pg: 'created_at',      d1: 'created_at',      type: 'tsms' },
      { pg: 'created_by',      d1: 'created_by',      type: 'text' },
    ],
  },
  {
    pg: 'pages',
    d1: 'pages',
    columns: [
      { pg: 'id',           d1: 'id',           type: 'text' },
      { pg: 'path',         d1: 'path',         type: 'text' },
      { pg: 'label',        d1: 'label',        type: 'text' },
      { pg: 'is_published', d1: 'is_published', type: 'bool' },
      { pg: 'show_in_nav',  d1: 'show_in_nav',  type: 'bool' },
      { pg: 'created_at',   d1: 'created_at',   type: 'tsms' },
      { pg: 'updated_at',   d1: 'updated_at',   type: 'tsms' },
    ],
  },
  {
    pg: 'page_blocks',
    d1: 'page_blocks',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'page_id',       d1: 'page_id',       type: 'text' },
      { pg: 'block_type',    d1: 'block_type',    type: 'text' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'is_locked',     d1: 'is_locked',     type: 'bool' },
      { pg: 'props',         d1: 'props',         type: 'json' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
      { pg: 'updated_at',    d1: 'updated_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'page_block_translations',
    d1: 'page_block_translations',
    columns: [
      { pg: 'block_id',   d1: 'block_id',   type: 'text' },
      { pg: 'locale',     d1: 'locale',     type: 'text' },
      { pg: 'props',      d1: 'props',      type: 'json' },
      { pg: 'updated_at', d1: 'updated_at', type: 'tsms' },
    ],
  },
  {
    pg: 'page_versions',
    d1: 'page_versions',
    columns: [
      { pg: 'id',         d1: 'id',         type: 'text' },
      { pg: 'page_id',    d1: 'page_id',    type: 'text' },
      { pg: 'snapshot',   d1: 'snapshot',   type: 'json' },
      { pg: 'label',      d1: 'label',      type: 'text' },
      { pg: 'created_at', d1: 'created_at', type: 'tsms' },
      { pg: 'created_by', d1: 'created_by', type: 'text' },
    ],
  },
  {
    pg: 'page_text_overrides',
    d1: 'page_text_overrides',
    columns: [
      { pg: 'page_path',  d1: 'page_path',  type: 'text' },
      { pg: 'key',        d1: 'key',        type: 'text' },
      { pg: 'locale',     d1: 'locale',     type: 'text' },
      { pg: 'value',      d1: 'value',      type: 'text' },
      { pg: 'updated_at', d1: 'updated_at', type: 'tsms' },
      { pg: 'updated_by', d1: 'updated_by', type: 'text' },
    ],
  },
  {
    pg: 'activity_log',
    d1: 'activity_log',
    columns: [
      { pg: 'id',           d1: 'id',           type: 'text' },
      { pg: 'user_id',      d1: 'user_id',      type: 'text' },
      { pg: 'user_email',   d1: 'user_email',   type: 'text' },
      { pg: 'action',       d1: 'action',       type: 'text' },
      { pg: 'entity_type',  d1: 'entity_type',  type: 'text' },
      { pg: 'entity_id',    d1: 'entity_id',    type: 'text' },
      { pg: 'entity_title', d1: 'entity_title', type: 'text' },
      { pg: 'detail',       d1: 'detail',       type: 'text' },
      { pg: 'created_at',   d1: 'created_at',   type: 'tsms' },
    ],
  },
  {
    pg: 'product_categories',
    d1: 'product_categories',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'slug',          d1: 'slug',          type: 'text' },
      { pg: 'label',         d1: 'label',         type: 'text' },
      { pg: 'description',   d1: 'description',   type: 'text' },
      { pg: 'hero_image',    d1: 'hero_image',    type: 'text' },
      { pg: 'icon',          d1: 'icon',          type: 'text' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'is_active',     d1: 'is_active',     type: 'bool' },
      { pg: 'deleted_at',    d1: 'deleted_at',    type: 'tsms' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
      { pg: 'updated_at',    d1: 'updated_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'product_category_translations',
    d1: 'product_category_translations',
    columns: [
      { pg: 'category_id', d1: 'category_id', type: 'text' },
      { pg: 'locale',      d1: 'locale',      type: 'text' },
      { pg: 'label',       d1: 'label',       type: 'text' },
      { pg: 'description', d1: 'description', type: 'text' },
      { pg: 'slug',        d1: 'slug',        type: 'text' },
      { pg: 'updated_at',  d1: 'updated_at',  type: 'tsms' },
    ],
  },
  {
    pg: 'products',
    d1: 'products',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'slug',          d1: 'slug',          type: 'text' },
      { pg: 'name',          d1: 'name',          type: 'text' },
      { pg: 'description',   d1: 'description',   type: 'text' },
      { pg: 'attributes',    d1: 'attributes',    type: 'json' },
      { pg: 'synonyms',      d1: 'synonyms',      type: 'array' },
      { pg: 'status',        d1: 'status',        type: 'text' },
      { pg: 'published_at',  d1: 'published_at',  type: 'tsms' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'deleted_at',    d1: 'deleted_at',    type: 'tsms' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
      { pg: 'updated_at',    d1: 'updated_at',    type: 'tsms' },
      { pg: 'created_by',    d1: 'created_by',    type: 'text' },
      { pg: 'updated_by',    d1: 'updated_by',    type: 'text' },
      // search_vector is generated → never selected
    ],
  },
  {
    pg: 'product_translations',
    d1: 'product_translations',
    columns: [
      { pg: 'product_id',  d1: 'product_id',  type: 'text' },
      { pg: 'locale',      d1: 'locale',      type: 'text' },
      { pg: 'name',        d1: 'name',        type: 'text' },
      { pg: 'description', d1: 'description', type: 'text' },
      { pg: 'attributes',  d1: 'attributes',  type: 'json' },
      { pg: 'synonyms',    d1: 'synonyms',    type: 'array' },
      { pg: 'slug',        d1: 'slug',        type: 'text' },
      { pg: 'updated_at',  d1: 'updated_at',  type: 'tsms' },
    ],
  },
  {
    pg: 'product_to_categories',
    d1: 'product_to_categories',
    columns: [
      { pg: 'product_id',    d1: 'product_id',    type: 'text' },
      { pg: 'category_id',   d1: 'category_id',   type: 'text' },
      { pg: 'sub_category',  d1: 'sub_category',  type: 'text' },
      { pg: 'is_primary',    d1: 'is_primary',    type: 'bool' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
    ],
  },
  {
    pg: 'product_to_entities',
    d1: 'product_to_entities',
    columns: [
      { pg: 'product_id',    d1: 'product_id',    type: 'text' },
      { pg: 'entity_id',     d1: 'entity_id',     type: 'text' },
      { pg: 'role',          d1: 'role',          type: 'text' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
    ],
  },
  {
    pg: 'product_documents',
    d1: 'product_documents',
    columns: [
      { pg: 'product_id',    d1: 'product_id',    type: 'text' },
      { pg: 'document_id',   d1: 'document_id',   type: 'text' },
      { pg: 'slot',          d1: 'slot',          type: 'text' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
    ],
  },
  {
    pg: 'product_images',
    d1: 'product_images',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'product_id',    d1: 'product_id',    type: 'text' },
      { pg: 'url',           d1: 'url',           type: 'text' },
      { pg: 'width',         d1: 'width',         type: 'int' },
      { pg: 'height',        d1: 'height',        type: 'int' },
      { pg: 'is_primary',    d1: 'is_primary',    type: 'bool' },
      { pg: 'display_order', d1: 'display_order', type: 'int' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
    ],
  },
  {
    pg: 'product_image_translations',
    d1: 'product_image_translations',
    columns: [
      { pg: 'image_id',   d1: 'image_id',   type: 'text' },
      { pg: 'locale',     d1: 'locale',     type: 'text' },
      { pg: 'alt_text',   d1: 'alt_text',   type: 'text' },
      { pg: 'caption',    d1: 'caption',    type: 'text' },
      { pg: 'updated_at', d1: 'updated_at', type: 'tsms' },
    ],
  },
  {
    pg: 'product_url_aliases',
    d1: 'product_url_aliases',
    columns: [
      { pg: 'id',            d1: 'id',            type: 'text' },
      { pg: 'product_id',    d1: 'product_id',    type: 'text' },
      { pg: 'locale',        d1: 'locale',        type: 'text' },
      { pg: 'category_slug', d1: 'category_slug', type: 'text' },
      { pg: 'product_slug',  d1: 'product_slug',  type: 'text' },
      { pg: 'created_at',    d1: 'created_at',    type: 'tsms' },
    ],
  },
]

const BATCH_SIZE = 50

function sqlLiteral(value: unknown, type: ColType): string {
  if (value === null || value === undefined) return 'NULL'
  switch (type) {
    case 'text': {
      return `'${String(value).replace(/'/g, "''")}'`
    }
    case 'int': {
      const n = Number(value)
      if (!Number.isFinite(n)) throw new Error(`int field has non-numeric value: ${String(value)}`)
      return String(Math.trunc(n))
    }
    case 'bool': {
      return value === true || value === 't' || value === 'true' || value === 1 ? '1' : '0'
    }
    case 'tsms': {
      // Postgres node driver returns Date for timestamptz; epoch ms preserves precision.
      const d = value instanceof Date ? value : new Date(String(value))
      const ms = d.getTime()
      if (Number.isNaN(ms)) throw new Error(`bad timestamp: ${String(value)}`)
      return String(ms)
    }
    case 'json': {
      const json = typeof value === 'string' ? value : JSON.stringify(value)
      return `'${json.replace(/'/g, "''")}'`
    }
    case 'array': {
      // Postgres returns text[] as a JS array via the serverless driver.
      const arr = Array.isArray(value) ? value : []
      return `'${JSON.stringify(arr).replace(/'/g, "''")}'`
    }
    case 'skip':
      return 'NULL'
  }
}

// Neon's modern driver only accepts dynamic queries through `sql.query(...)`,
// not via the plain function call form `sql(...)`. Tagged-template form is
// preferred but doesn't work for table/column interpolation (those aren't
// parameterised). `.query()` gives us a string-in, rows-out path.
type RawSql = {
  query: (query: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>
}

async function dumpTable(
  sql: RawSql,
  table: TableSpec,
  out: string[],
): Promise<number> {
  const selectExpr = table.columns
    .map((c) => (c.pg.includes(' as ') ? c.pg : `"${c.pg}"`))
    .join(', ')
  const result = await sql.query(`SELECT ${selectExpr} FROM "${table.pg}"`)
  const rows = result.rows
  if (rows.length === 0) {
    out.push(`-- ${table.d1}: 0 rows`)
    return 0
  }
  const colNamesD1 = table.columns.map((c) => `"${c.d1}"`).join(', ')
  // Each batch: INSERT INTO t (cols) VALUES (...), (...), ...;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const valuesSql = batch
      .map((row) => {
        const tuple = table.columns
          .map((c) => {
            // For aliased SELECT (e.g. event_date_str), the result key is the alias name.
            const resultKey = c.pg.includes(' as ') ? c.pg.split(' as ').pop()!.trim() : c.pg
            return sqlLiteral(row[resultKey], c.type)
          })
          .join(', ')
        return `(${tuple})`
      })
      .join(', ')
    out.push(`INSERT INTO "${table.d1}" (${colNamesD1}) VALUES ${valuesSql};`)
  }
  out.push(`-- ${table.d1}: ${rows.length} rows`)
  return rows.length
}

function applyDump(file: string, remote: boolean) {
  const args = ['wrangler', 'd1', 'execute', 'DB', remote ? '--remote' : '--local', '--file', file]
  const res = spawnSync('npx', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (res.status !== 0) {
    throw new Error(`wrangler exited with code ${res.status}`)
  }
}

function rebuildFts(remote: boolean) {
  // Use a SQL file (not --command) so Windows shell escaping doesn't shred
  // the `(`, `;` and `'` characters in the rebuild statements.
  const tmpFile = 'fts-rebuild.tmp.sql'
  writeFileSync(
    tmpFile,
    [
      `INSERT INTO products_fts(products_fts) VALUES('rebuild');`,
      `INSERT INTO product_translations_fts(product_translations_fts) VALUES('rebuild');`,
      '',
    ].join('\n'),
    'utf8',
  )
  const args = ['wrangler', 'd1', 'execute', 'DB', remote ? '--remote' : '--local', '--file', tmpFile, '-y']
  const res = spawnSync('npx', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (res.status !== 0) {
    throw new Error(`FTS rebuild failed with code ${res.status}`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const apply = args.includes('--apply')
  const remote = args.includes('--remote')
  const tableFilter = args
    .filter((a) => a.startsWith('--table='))
    .map((a) => a.slice('--table='.length))
  const outArg = args.find((a) => a.startsWith('--out='))
  const outPath = outArg ? outArg.slice('--out='.length) : 'dump.sql'

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not set — point it at the source Neon database.')
    process.exit(1)
  }
  const sql = neon(databaseUrl, { fullResults: true }) as unknown as RawSql

  const lines: string[] = []
  lines.push('-- Neon → Cloudflare D1 dump')
  lines.push(`-- generated: ${new Date().toISOString()}`)
  // D1 forbids SQL BEGIN/COMMIT — atomicity is per-statement. The TABLES
  // array is already ordered for FK safety so deferred-FK pragmas aren't
  // needed either.

  const tables = tableFilter.length > 0 ? TABLES.filter((t) => tableFilter.includes(t.d1)) : TABLES
  if (tableFilter.length > 0 && tables.length !== tableFilter.length) {
    const unknown = tableFilter.filter((t) => !TABLES.some((spec) => spec.d1 === t))
    throw new Error(`Unknown --table values: ${unknown.join(', ')}`)
  }

  const counts: Array<{ table: string; count: number }> = []
  for (const t of tables) {
    const before = lines.length
    const n = await dumpTable(sql, t, lines)
    counts.push({ table: t.d1, count: n })
    process.stderr.write(`  ${t.d1.padEnd(34)} ${String(n).padStart(6)} rows (${lines.length - before} stmts)\n`)
  }

  const dump = lines.join('\n') + '\n'

  if (dryRun) {
    process.stdout.write(dump)
    return
  }

  writeFileSync(outPath, dump, 'utf8')
  console.error(`\nwrote ${outPath} (${(dump.length / 1024).toFixed(1)} KiB)`)
  console.table(counts)

  if (apply) {
    console.error(`\napplying to ${remote ? 'remote' : 'local'} D1…`)
    applyDump(outPath, remote)
    console.error('rebuilding FTS5 indexes…')
    rebuildFts(remote)
    console.error('done.')
  } else {
    console.error('\nnext: wrangler d1 execute DB --remote --file=' + outPath)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
