import { getPageDefaults } from '@/lib/cms/page-defaults'

export type ContentField = {
  key: string
  label: string
  help?: string
  widget: 'text' | 'textarea' | 'richtext'
  defaultValue: string
  group?: string
}

export type PageContentSchema = {
  path: string
  label: string
  fields: ContentField[]
}

import { PAGE_REGISTRY } from '@/lib/seo/pages-registry'

/**
 * Build a content schema for a page from the central defaults registry.
 * Returns null if the page isn't editable yet (no entry in page-defaults.ts).
 */
export function getContentSchema(path: string): PageContentSchema | null {
  const defaults = getPageDefaults(path)
  if (!defaults) return null
  const entry = PAGE_REGISTRY.find((e) => e.path === path)
  return {
    path,
    label: entry?.label ?? path,
    fields: defaults.slots.map((s) => ({
      key: s.key,
      label: s.label,
      help: s.help,
      widget: s.widget,
      defaultValue: s.defaultValue,
      group: s.group,
    })),
  }
}
