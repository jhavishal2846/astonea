'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useMessages } from 'next-intl'

type PageTextMap = Record<string, string>

function lookupMessage(messages: unknown, key: string): string | null {
  const parts = key.split('.')
  let cur: unknown = messages
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return null
    }
  }
  return typeof cur === 'string' && cur.length > 0 ? cur : null
}

type Ctx = {
  overrides: PageTextMap
  path: string
  locale: string
  editMode: boolean
}

const PageTextContext = createContext<Ctx>({
  overrides: {},
  path: '',
  locale: '',
  editMode: false,
})

/**
 * Server populates this with:
 *   - the merged override map for the current path
 *   - the canonical path (locale-stripped) — so the in-place editor knows
 *     which row to write to
 *   - the active locale
 *   - whether edit-mode is on (admin opened with `?edit=1`)
 */
export default function PageTextProvider({
  overrides,
  path,
  locale,
  editMode,
  children,
}: {
  overrides: PageTextMap
  path: string
  locale: string
  editMode: boolean
  children: ReactNode
}) {
  const value = useMemo(
    () => ({ overrides: overrides ?? {}, path, locale, editMode }),
    [overrides, path, locale, editMode],
  )
  return <PageTextContext.Provider value={value}>{children}</PageTextContext.Provider>
}

/**
 * Returns a `(key, fallback) => ReactNode` lookup that resolves in this order:
 *   1. per-path editorial override from `page_text_overrides` (admin-curated)
 *   2. next-intl message catalog entry (auto-translated from `ui_strings`)
 *   3. the English `fallback` passed by the caller
 *
 * Edit mode wraps the result in a `<span data-cms-key=…>` so the in-place
 * editor can attach click-to-edit handlers.
 */
export function usePageText() {
  const ctx = useContext(PageTextContext)
  const messages = useMessages()
  return (key: string, fallback: string): ReactNode => {
    const override = ctx.overrides[key]
    const value =
      typeof override === 'string' && override.length > 0
        ? override
        : lookupMessage(messages, key) ?? fallback
    if (!ctx.editMode || !ctx.path) return value
    return (
      <span
        data-cms-key={key}
        data-cms-path={ctx.path}
        data-cms-locale={ctx.locale}
        data-cms-default={fallback}
        className="cms-editable"
      >
        {value}
      </span>
    )
  }
}
