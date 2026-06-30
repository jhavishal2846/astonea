/**
 * One-shot: upload public/* files that exceed Cloudflare Workers' 25 MiB
 * static-asset limit into the `astonea-uploads` R2 bucket under a `static/`
 * key prefix, then rewrite any `documents.file_url` rows that currently
 * point at the legacy `/pdf/...` paths.
 *
 * Idempotent. Skips files already present in R2 (HeadObject 200).
 *
 * Env required:
 *   DATABASE_URL                — Neon connection string
 *   R2_ACCOUNT_ID               — Cloudflare account id (R2 dashboard)
 *   R2_ACCESS_KEY_ID            — R2 S3-compatible access key
 *   R2_SECRET_ACCESS_KEY        — R2 S3-compatible secret
 *   R2_PUBLIC_BASE              — e.g. https://cdn.astonea.org
 *
 * Usage:
 *   npm run migrate:static-to-r2 -- [--dry-run]
 */
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { neon } from '@neondatabase/serverless'

const DRY = process.argv.includes('--dry-run')

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
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE!.replace(/\/$/, '')

/**
 * The 6 unique oversized files (one of them appears twice as a byte-identical
 * duplicate so we list both source paths but upload once under the canonical
 * `static/<name>` key — the duplicate gets the same destination URL).
 */
const FILES: { source: string; key: string; contentType: string }[] = [
  { source: 'pdf/Annual Report for the FY 2024-25.pdf',     key: 'static/annual-report-fy-2024-25.pdf', contentType: 'application/pdf' },
  { source: 'pdf/Annual Report for the FY 2024-25 (1).pdf', key: 'static/annual-report-fy-2024-25.pdf', contentType: 'application/pdf' },
  { source: 'pdf/Annual Report FY 2023-24.pdf',             key: 'static/annual-report-fy-2023-24.pdf', contentType: 'application/pdf' },
  { source: 'pdf/Annual Report FY 2022-23.pdf',             key: 'static/annual-report-fy-2022-23.pdf', contentType: 'application/pdf' },
  { source: 'pdf/Annual Report FY 2021-22.pdf',             key: 'static/annual-report-fy-2021-22.pdf', contentType: 'application/pdf' },
  { source: 'pdf/Annual Report FY 2020-21.pdf',             key: 'static/annual-report-fy-2020-21.pdf', contentType: 'application/pdf' },
  { source: 'astoneaone vid.mp4',                           key: 'static/astoneaone-vid.mp4',            contentType: 'video/mp4'      },
]

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

async function existsInR2(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

async function uploadOne(source: string, key: string, contentType: string) {
  const abs = path.join(PUBLIC_DIR, source)
  let size: number
  try {
    size = (await stat(abs)).size
  } catch {
    console.log(`skip (source missing): ${source}`)
    return null
  }
  if (await existsInR2(key)) {
    console.log(`skip (already in R2): ${key} (${size.toLocaleString()} B)`)
    return `${R2_PUBLIC_BASE}/${key}`
  }
  if (DRY) {
    console.log(`[dry-run] would upload ${source} -> ${key} (${size.toLocaleString()} B)`)
    return `${R2_PUBLIC_BASE}/${key}`
  }
  const body = await readFile(abs)
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  console.log(`uploaded ${source} -> ${key} (${size.toLocaleString()} B)`)
  return `${R2_PUBLIC_BASE}/${key}`
}

async function rewriteDbRows(legacyToNew: Map<string, string>) {
  if (legacyToNew.size === 0) return
  const sql = neon(process.env.DATABASE_URL!)
  for (const [legacy, next] of legacyToNew) {
    if (DRY) {
      const rows = (await sql`SELECT id FROM documents WHERE file_url = ${legacy}`) as { id: string }[]
      console.log(`[dry-run] would rewrite ${rows.length} document row(s): ${legacy} -> ${next}`)
      continue
    }
    const result = (await sql`UPDATE documents SET file_url = ${next}, updated_at = NOW() WHERE file_url = ${legacy} RETURNING id`) as { id: string }[]
    if (result.length > 0) {
      console.log(`rewrote ${result.length} document row(s): ${legacy} -> ${next}`)
    }
  }
}

async function main() {
  console.log(`mode: ${DRY ? 'DRY RUN' : 'LIVE'}`)
  const legacyToNew = new Map<string, string>()
  for (const f of FILES) {
    const newUrl = await uploadOne(f.source, f.key, f.contentType)
    if (newUrl) legacyToNew.set(`/${f.source}`, newUrl)
  }
  await rewriteDbRows(legacyToNew)
  console.log('done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
