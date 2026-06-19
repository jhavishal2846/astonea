'use client'

import { createContext, useContext } from 'react'
import type { FieldDescriptor } from '@/lib/cms/blocks/types'

export type BlockTypeMeta = {
  type: string
  adminLabel: string
  description: string
  iconPath: string
  fields: FieldDescriptor[]
  defaults: Record<string, unknown>
  /** Dotted paths (with `.*.` wildcards) of fields that translate per-locale. */
  translatableFields: string[]
}

export type ClientBlock = {
  id: string
  pageId: string
  blockType: string
  displayOrder: number
  isLocked: boolean
  props: Record<string, unknown>
}

type Ctx = {
  pageId: string
  blocks: ClientBlock[]
  blockTypes: BlockTypeMeta[]
  currentLocale: string
  isTranslationMode: boolean
  selectedId: string | null
  hoveredId: string | null
  setSelected: (id: string | null) => void
  setHovered: (id: string | null) => void
  openTypePicker: (insertAt: number | null) => void
  saveProps: (blockId: string, props: Record<string, unknown>) => Promise<void>
  /** Locally overwrite props for live preview between debounced server saves. */
  patchLocalProps: (blockId: string, props: Record<string, unknown>) => void
}

export const PageBuilderContext = createContext<Ctx | null>(null)

export function usePageBuilder(): Ctx {
  const v = useContext(PageBuilderContext)
  if (!v) throw new Error('usePageBuilder must be inside <PageBuilder>')
  return v
}
