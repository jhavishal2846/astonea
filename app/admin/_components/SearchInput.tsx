'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { IconSearch } from '@/app/admin/_icons'

/**
 * Reusable debounced search input for admin tables. Syncs the typed value into
 * the page URL as `?q=…` after a short pause, then lets the server-rendered
 * list re-query. Reset to page 1 on every keystroke so the user doesn't end up
 * on an empty paginated tail of a smaller filtered result set.
 */
export default function AdminSearchInput({
  basePath,
  placeholder = 'Search…',
  paramName = 'q',
  initial = '',
  widthClass = 'sm:w-80',
}: {
  /** Where to push the URL update (e.g. "/admin/pages"). */
  basePath: string
  placeholder?: string
  /** Query-string key; defaults to "q". Useful if a page already uses `q` for something else. */
  paramName?: string
  /** Server-supplied current value. */
  initial?: string
  /** Tailwind width class applied at sm+ breakpoints. */
  widthClass?: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(initial)
  const [, startTransition] = useTransition()
  // Skip the initial mount so we don't push a redundant URL update on first paint.
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const handle = setTimeout(() => {
      const next = new URLSearchParams(params?.toString() ?? '')
      if (value) next.set(paramName, value)
      else next.delete(paramName)
      // Reset to page 1 — current page may not exist in the filtered set.
      next.delete('page')
      const qs = next.toString()
      startTransition(() => {
        router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false })
      })
    }, 250)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative">
      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${widthClass} pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all`}
      />
    </div>
  )
}
