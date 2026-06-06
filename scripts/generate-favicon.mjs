import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = resolve(__dirname, '../public/icon.svg')
const icoPath = resolve(__dirname, '../public/favicon.ico')

const svg = readFileSync(svgPath)
const sizes = [16, 32, 48]

const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 384 }).resize(size, size).png().toBuffer(),
  ),
)

// Build ICO file with PNG-embedded entries (supported by all modern browsers)
const headerSize = 6
const entrySize = 16
const totalHeaderSize = headerSize + entrySize * pngs.length

const header = Buffer.alloc(headerSize)
header.writeUInt16LE(0, 0)          // reserved
header.writeUInt16LE(1, 2)          // type = icon
header.writeUInt16LE(pngs.length, 4) // count

let offset = totalHeaderSize
const entries = pngs.map((png, i) => {
  const size = sizes[i]
  const entry = Buffer.alloc(entrySize)
  entry.writeUInt8(size === 256 ? 0 : size, 0) // width
  entry.writeUInt8(size === 256 ? 0 : size, 1) // height
  entry.writeUInt8(0, 2)        // color palette
  entry.writeUInt8(0, 3)        // reserved
  entry.writeUInt16LE(1, 4)     // color planes
  entry.writeUInt16LE(32, 6)    // bits per pixel
  entry.writeUInt32LE(png.length, 8)  // image size
  entry.writeUInt32LE(offset, 12)     // image offset
  offset += png.length
  return entry
})

const ico = Buffer.concat([header, ...entries, ...pngs])
writeFileSync(icoPath, ico)
console.log(`Wrote ${icoPath} (${ico.length} bytes) with sizes: ${sizes.join(', ')}`)
