/**
 * Linearize PDFs in `public/pdf/` (enables "Fast Web View" — browser PDF
 * viewers fetch page 1 in ~200 KB instead of downloading the full file)
 * and re-upload to R2 with a long, immutable Cache-Control header. R2 keys
 * are unchanged, so existing `documents.file_url` rows keep working.
 *
 * Requires `qpdf` on PATH:
 *   Windows: choco install qpdf
 *   macOS:   brew install qpdf
 *   Linux:   sudo apt install qpdf
 *
 * Optional `--shrink` re-encodes images via Ghostscript /ebook preset
 * (typical 47 MB → 5–10 MB; minor visible image-quality loss):
 *   Windows: choco install ghostscript
 *   macOS:   brew install ghostscript
 *   Linux:   sudo apt install ghostscript
 *
 * Env required:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_BASE
 *
 * Usage:
 *   npm run pdfs:optimize                  # linearize + re-upload
 *   npm run pdfs:optimize -- --dry-run     # show what would happen
 *   npm run pdfs:optimize -- --shrink      # also gs-shrink before linearize
 *
 * After running: purge Cloudflare cache for the affected URLs so users
 * stop being served the old non-linearized bytes from the edge — printed
 * at the end of the run.
 */
import { readFile, stat, mkdir, rm } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import os from 'node:os'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const exec = promisify(execFile)
const DRY = process.argv.includes('--dry-run')
const SHRINK = process.argv.includes('--shrink')

const REQUIRED_ENV = [
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
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

// Canonical source → R2 key mapping. Mirrors upload-static-to-r2.ts but
// drops the byte-identical duplicate of the 2024-25 report.
const FILES: { source: string; key: string }[] = [
  { source: 'pdf/Annual Report for the FY 2024-25.pdf', key: 'static/annual-report-fy-2024-25.pdf' },
  { source: 'pdf/Annual Report FY 2023-24.pdf',         key: 'static/annual-report-fy-2023-24.pdf' },
  { source: 'pdf/Annual Report FY 2022-23.pdf',         key: 'static/annual-report-fy-2022-23.pdf' },
  { source: 'pdf/Annual Report FY 2021-22.pdf',         key: 'static/annual-report-fy-2021-22.pdf' },
  { source: 'pdf/Annual Report FY 2020-21.pdf',         key: 'static/annual-report-fy-2020-21.pdf' },
]

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

async function ensureTool(cmd: string, hint: string) {
  try {
    await exec(cmd, ['--version'])
  } catch {
    console.error(`'${cmd}' not found on PATH. ${hint}`)
    process.exit(1)
  }
}

// Ghostscript on Windows installs as `gswin64c.exe` (or `gswin32c.exe`),
// not `gs`. Pick the first one that exists on PATH and return its name.
async function resolveGhostscript(): Promise<string> {
  const candidates = process.platform === 'win32'
    ? ['gswin64c', 'gswin32c', 'gs']
    : ['gs']
  for (const c of candidates) {
    try {
      await exec(c, ['--version'])
      return c
    } catch {
      // try next
    }
  }
  console.error(
    `Ghostscript not found on PATH (looked for: ${candidates.join(', ')}). ` +
    `Install: winget install --id ArtifexSoftware.GhostScript | choco install ghostscript | brew install ghostscript | apt install ghostscript`,
  )
  process.exit(1)
}

function fmtMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function processOne(source: string, key: string, tmpDir: string, gsBin: string | null) {
  const abs = path.join(PUBLIC_DIR, source)
  let originalSize: number
  try {
    originalSize = (await stat(abs)).size
  } catch {
    console.log(`skip (source missing): ${source}`)
    return null
  }

  const baseName = path.posix.basename(key)
  const shrunk = path.join(tmpDir, `shrunk-${baseName}`)
  const linearized = path.join(tmpDir, baseName)

  if (DRY) {
    console.log(`[dry-run] ${source} (${fmtMB(originalSize)})`)
    if (SHRINK) console.log(`[dry-run]   gs shrink -> ${shrunk}`)
    console.log(`[dry-run]   qpdf --linearize -> ${linearized}`)
    console.log(`[dry-run]   PUT s3://${R2_BUCKET}/${key} (CacheControl: ${CACHE_CONTROL})`)
    return `${R2_PUBLIC_BASE}/${key}`
  }

  let inputPath = abs
  if (SHRINK && gsBin) {
    process.stdout.write(`shrink   ${source} … `)
    await exec(gsBin, [
      '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/ebook',
      '-dCompatibilityLevel=1.5',
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${shrunk}`,
      abs,
    ])
    const s = (await stat(shrunk)).size
    console.log(`${fmtMB(originalSize)} -> ${fmtMB(s)}`)
    inputPath = shrunk
  }

  process.stdout.write(`linearize ${baseName} … `)
  await exec('qpdf', ['--linearize', inputPath, linearized])
  const finalSize = (await stat(linearized)).size
  console.log(`${fmtMB(finalSize)}`)

  process.stdout.write(`upload   ${key} … `)
  const body = await readFile(linearized)
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: 'application/pdf',
      CacheControl: CACHE_CONTROL,
    }),
  )
  console.log('ok')

  return `${R2_PUBLIC_BASE}/${key}`
}

async function main() {
  console.log(`mode: ${DRY ? 'DRY RUN' : 'LIVE'}${SHRINK ? ' + SHRINK' : ''}\n`)

  let gsBin: string | null = null
  if (!DRY) {
    await ensureTool('qpdf', 'Install: choco install qpdf | brew install qpdf | apt install qpdf')
    if (SHRINK) {
      gsBin = await resolveGhostscript()
    }
  }

  const tmpDir = path.join(os.tmpdir(), `astonea-pdfs-${Date.now()}`)
  await mkdir(tmpDir, { recursive: true })

  const purgeUrls: string[] = []
  try {
    for (const f of FILES) {
      const url = await processOne(f.source, f.key, tmpDir, gsBin)
      if (url) purgeUrls.push(url)
      console.log('')
    }
  } finally {
    if (!DRY) await rm(tmpDir, { recursive: true, force: true })
  }

  console.log('done.\n')

  if (purgeUrls.length > 0) {
    console.log('⚠ Cloudflare edge still serves the old bytes until purged or TTL expires.')
    console.log('  Purge these URLs in dashboard → Caching → Configuration → Custom Purge:')
    for (const u of purgeUrls) console.log(`    ${u}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
