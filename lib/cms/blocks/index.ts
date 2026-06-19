import type { BlockDescriptor } from './types'
import { heroBlock } from './impl/hero'
import { textSectionBlock } from './impl/text-section'
import { pdfListBlock } from './impl/pdf-list'
import { statsCountUpBlock } from './impl/stats-count-up'
import { contactCtaBlock } from './impl/contact-cta'
import { imageWithTextBlock } from './impl/image-with-text'

const REGISTRY = {
  hero: heroBlock,
  textSection: textSectionBlock,
  pdfList: pdfListBlock,
  statsCountUp: statsCountUpBlock,
  contactCta: contactCtaBlock,
  imageWithText: imageWithTextBlock,
}

export type BlockType = keyof typeof REGISTRY

// Loose untyped lookup — block props vary per type and we don't try to
// preserve the type-level mapping across DB round-trips.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBlockDescriptor(type: string): BlockDescriptor<any> | null {
  return (REGISTRY as Record<string, BlockDescriptor<unknown>>)[type] ?? null
}

export function listBlockTypes(): Array<{
  type: string
  adminLabel: string
  description: string
  iconPath: string
}> {
  return Object.entries(REGISTRY).map(([type, b]) => ({
    type,
    adminLabel: b.adminLabel,
    description: b.description,
    iconPath: b.iconPath,
  }))
}

export type { BlockDescriptor, FieldDescriptor } from './types'
export { expandTranslatablePaths, getByPath, setByPath } from './types'
