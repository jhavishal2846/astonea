import type { z } from 'zod'

export type FieldDescriptor = {
  name: string
  label: string
  /** Maps to a form widget in the admin editor. */
  widget:
    | 'text'
    | 'textarea'
    | 'richtext'
    | 'number'
    | 'select'
    | 'image'
    | 'array'
    | 'switch'
    | 'documents'
  help?: string
  required?: boolean
  options?: { value: string; label: string }[]
  /** When widget === 'array', the schema for each row's fields. */
  rowFields?: FieldDescriptor[]
  /** When widget === 'array', the field on each row to translate. */
  rowTranslatableFields?: string[]
  /** Show this field only when another field has a specific value. */
  showWhen?: { field: string; equals: string }
}

export type BlockDescriptor<Props = Record<string, unknown>> = {
  type: string
  adminLabel: string
  description: string
  /** Inline SVG path data (24x24) shown in the admin block picker. */
  iconPath: string
  /** Default props for a brand-new block of this type. */
  defaults: Props
  /** Zod schema validating the props payload. */
  schema: z.ZodType<Props>
  /** Admin form field descriptors. Order = display order. */
  fields: FieldDescriptor[]
  /**
   * Dotted paths in `props` that should be translated. Use
   * `field.0.name` for the first row of array `field`. We support a leaf
   * wildcard `field.*.name` for arrays.
   */
  translatableFields: string[]
  /** Public React component. Server component. */
  component: React.ComponentType<{ props: Props }>
}

/**
 * Helper: read a dotted path from a nested object. Returns undefined if any
 * link in the chain is missing or not an object.
 */
export function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.')
  let cur: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {}
    cur = cur[p] as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value
}

/**
 * Expand wildcard paths (`field.*.name`) into concrete paths against the given
 * props (e.g. `field.0.name`, `field.1.name`). Useful for translation walks.
 */
export function expandTranslatablePaths(
  props: unknown,
  paths: string[],
): string[] {
  const out: string[] = []
  for (const p of paths) {
    const idx = p.indexOf('.*.')
    if (idx === -1) {
      out.push(p)
      continue
    }
    const head = p.slice(0, idx)
    const tail = p.slice(idx + 3)
    const arr = getByPath(props, head)
    if (!Array.isArray(arr)) continue
    for (let i = 0; i < arr.length; i++) out.push(`${head}.${i}.${tail}`)
  }
  return out
}
