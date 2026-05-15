/**
 * Generates 240 placeholder WebP frames for the home-hero scroll sequence.
 * Each frame is an HSL gradient rotating hue 200→280 with the frame number
 * burned in — sufficient to exercise the full file-loading pipeline before
 * real video frames arrive.
 *
 * Run: npm run dummy-frames
 */

import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

const FRAME_COUNT = 240
const WIDTH = 1920
const HEIGHT = 1080
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'frames', 'home-hero')
const BATCH_SIZE = 20

function buildSvg(index: number): string {
  const progress = index / (FRAME_COUNT - 1)
  const hue = Math.round(200 + progress * 80)
  const hue2 = Math.round(210 + progress * 80)
  const hue3 = Math.round(225 + progress * 80)

  const glowCx = (50 + Math.sin(progress * Math.PI * 2) * 30).toFixed(1)
  const glowCy = (50 + Math.cos(progress * Math.PI * 2) * 22).toFixed(1)

  const lum1 = Math.round(12 + progress * 8)
  const lum2 = Math.round(18 + progress * 6)
  const lum3 = Math.round(10 + progress * 6)

  const frameLabel = `FRAME ${String(index + 1).padStart(3, '0')} / ${FRAME_COUNT}`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="hsl(${hue},70%,${lum1}%)"/>
      <stop offset="50%"  stop-color="hsl(${hue2},60%,${lum2}%)"/>
      <stop offset="100%" stop-color="hsl(${hue3},55%,${lum3}%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glowCx}%" cy="${glowCy}%" r="38%">
      <stop offset="0%"   stop-color="hsl(${hue + 10},85%,65%)" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="hsl(${hue},70%,40%)" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="50%"  stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#vignette)"/>
  <text
    x="50%" y="50%"
    font-family="Georgia, serif"
    font-size="160"
    font-weight="bold"
    fill="white"
    fill-opacity="0.06"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="24"
  >ASTONEA</text>
  <text
    x="40" y="${HEIGHT - 36}"
    font-family="'Courier New', monospace"
    font-size="22"
    fill="white"
    fill-opacity="0.45"
  >${frameLabel}</text>
</svg>`
}

async function generateFrame(index: number): Promise<void> {
  const filename = `frame_${String(index + 1).padStart(4, '0')}.webp`
  const outputPath = path.join(OUTPUT_DIR, filename)

  await sharp(Buffer.from(buildSvg(index)))
    .resize(WIDTH, HEIGHT)
    .webp({ quality: 78, effort: 4 })
    .toFile(outputPath)
}

async function main(): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  console.log(`\n🎬 Generating ${FRAME_COUNT} placeholder frames → ${OUTPUT_DIR}\n`)
  const start = Date.now()

  for (let i = 0; i < FRAME_COUNT; i += BATCH_SIZE) {
    const end = Math.min(i + BATCH_SIZE, FRAME_COUNT)
    await Promise.all(
      Array.from({ length: end - i }, (_, j) => generateFrame(i + j))
    )
    const pct = Math.round((end / FRAME_COUNT) * 100)
    process.stdout.write(`\r  [${pct.toString().padStart(3)}%] ${end}/${FRAME_COUNT} frames`)
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n\n✅  Done in ${elapsed}s. Frames at /public/frames/home-hero/\n`)
}

main().catch((err) => {
  console.error('\n❌ Frame generation failed:', err)
  process.exit(1)
})
