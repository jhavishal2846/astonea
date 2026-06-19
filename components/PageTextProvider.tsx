'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

type PageTextMap = Record<string, string>

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
 * Returns a `(key, fallback) => ReactNode` lookup that:
 *   - normal mode: gives back the plain string (override > fallback)
 *   - edit mode:  gives back a `<span data-cms-key=…>` wrapper so the
 *                 in-place editor can attach click-to-edit handlers.
 */
export function usePageText() {
  const ctx = useContext(PageTextContext)
  return (key: string, fallback: string): ReactNode => {
    const v = ctx.overrides[key]
    const value = typeof v === 'string' && v.length > 0 ? v : fallback
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
