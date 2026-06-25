/**
 * One-shot: copy every object referenced by `documents.file_url` or
 * `page_metadata.og_image` from Vercel Blob to the `astonea-uploads` R2
 * bucket, then rewrite the DB row to point at the new URL.
 *
 * Public Vercel Blob URLs are readable by plain HTTP fetch — no
 * Authorization header needed. `VERCEL_BLOB_READ_WRITE_TOKEN` is only
 * required if you wanted to list/delete via the SDK; this script does
 * neither, so the token is intentionally omitted.
 *
 * Idempotent — rows already pointing at the R2 CDN are skipped. Failures
 * are logged to migration-failures.csv; mappings to migration-mapping.csv.
 *
 * Env required:
 *   DATABASE_URL
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_PUBLIC_BASE
 *
 * Usage:
 *   npm run migrate:blob-to-r2 -- [--dry-run] [--limit N]
 */
import { writeFile, appendFile } from 'node:fs/promises'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { neon } from '@neondatabase/serverless'

const DRY = process.argv.includes('--dry-run')
const limitArgIdx = process.argv.indexOf('--limit')
const LIMIT =
  limitArgIdx >= 0 && process.argv[limitArgIdx + 1]
    ? Number(process.argv[limitArgIdx + 1])
    : Infinity

const REQUIRED_ENV = [
  'DATABASE_URL',
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_PUBLIC_BASE',
]
for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    console.error(`missing env: ${k}`)
    process.exit(1)
  }
}

const R2_BUCKET = 'astonea-uploads'
const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE!.replace(/\/$/, '')
const VERCEL_BLOB_HOST_RE = /blob\.vercel-storage\.com/

const FAILURES = 'migration-failures.csv'
const MAPPINGS = 'migration-mapping.csv'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const sql = neon(process.env.DATABASE_URL!)

type Row = { table: 'documents' | 'page_metadata'; id: string; column: string; url: string }

/**
 * Vercel Blob public URLs look like `https://<store-id>.public.blob.vercel-storage.com/<path>`.
 * We derive the R2 key from the URL path. For uploads done via the admin UI
 * the path is already shaped like `documents/...` or `og/...`, which we
 * keep verbatim so the new URL is `<R2_PUBLIC_BASE>/documents/<file>`.
 */
function deriveKey(url: string): string {
  const u = new URL(url)
  return u.pathname.replace(/^\/+/, '')
}

async function fetchBytes(url: string): Promise<{ body: ArrayBuffer; contentType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  const body = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
  return { body, contentType }
}

async function copyOne(row: Row): Promise<string> {
  const key = deriveKey(row.url)
  const newUrl = `${R2_PUBLIC_BASE}/${key}`
  if (DRY) {
    console.log(`[dry-run] ${row.table}#${row.id}: ${row.url} -> ${newUrl}`)
    return newUrl
  }
  const { body, contentType } = await fetchBytes(row.url)
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
    }),
  )
  if (row.table === 'documents') {
    await sql`UPDATE documents SET file_url = ${newUrl}, updated_at = NOW() WHERE id = ${row.id}`
  } else {
    await sql`UPDATE page_metadata SET og_image = ${newUrl}, updated_at = NOW() WHERE page_path = ${row.id}`
  }
  return newUrl
}

async function main() {
  console.log(`mode: ${DRY ? 'DRY RUN' : 'LIVE'} | limit: ${LIMIT === Infinity ? 'none' : LIMIT}`)

  if (!DRY) {
    await writeFile(MAPPINGS, 'table,id,old_url,new_url\n')
    await writeFile(FAILURES, 'table,id,old_url,error\n')
  }

  const docs = (await sql`
    SELECT id, file_url FROM documents
    WHERE file_url LIKE '%blob.vercel-storage.com%'
  `) as { id: string; file_url: string }[]

  const og = (await sql`
    SELECT page_path, og_image FROM page_metadata
    WHERE og_image LIKE '%blob.vercel-storage.com%'
  `) as { page_path: string; og_image: string }[]

  const rows: Row[] = [
    ...docs.map((d) => ({ table: 'documents' as const, id: d.id, column: 'file_url', url: d.file_url })),
    ...og.map((p) => ({ table: 'page_metadata' as const, id: p.page_path, column: 'og_image', url: p.og_image })),
  ]
    .filter((r) => VERCEL_BLOB_HOST_RE.test(r.url))
    .slice(0, LIMIT)

  console.log(`planning ${rows.length} row(s): ${docs.length} documents, ${og.length} page_metadata`)

  let ok = 0
  let failed = 0
  for (const row of rows) {
    try {
      const newUrl = await copyOne(row)
      ok++
      if (!DRY) {
        await appendFile(MAPPINGS, `${row.table},${row.id},${row.url},${newUrl}\n`)
      }
    } catch (e) {
      failed++
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`FAIL ${row.table}#${row.id}: ${msg}`)
      if (!DRY) {
        await appendFile(FAILURES, `${row.table},${row.id},${row.url},${msg.replace(/[\r\n]+/g, ' ')}\n`)
      }
    }
  }

  console.log(`\nsummary: ok=${ok}, failed=${failed}, total=${rows.length}`)
  if (failed > 0) {
    console.error('see migration-failures.csv')
    process.exit(2)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
