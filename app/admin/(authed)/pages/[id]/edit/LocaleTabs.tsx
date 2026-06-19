'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export type LocaleTab = {
  code: string
  name: string
  nativeName: string
  isDefault: boolean
}

/**
 * Scalable locale picker. Works with 2 languages or 60. Shows the current
 * selection as a pill; opens a dropdown panel with a search input and a
 * scrollable list of every active language. Native names are shown for
 * easier scanning by translators.
 */
export default function LocaleTabs({
  languages,
  active,
}: {
  languages: LocaleTab[]
  active: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on outside-click and on Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    // Focus the search input on open.
    inputRef.current?.focus()
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (languages.length <= 1) return null

  const defaultLang = languages.find((l) => l.isDefault) ?? languages[0]
  const current = languages.find((l) => l.code === active) ?? defaultLang
  const filtered = !query.trim()
    ? languages
    : languages.filter((l) => {
        const q = query.trim().toLowerCase()
        return (
          l.code.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q)
        )
      })

  const setLocale = (code: string) => {
    const params = new URLSearchParams(sp?.toString() ?? '')
    if (code === defaultLang.code) {
      params.delete('locale')
    } else {
      params.set('locale', code)
    }
    const qs = params.toString()
    setOpen(false)
    setQuery('')
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname ?? '/')
    })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50 transition-colors min-w-[160px]"
      >
        <span className="font-mono uppercase text-xs text-slate-500 w-7 text-left shrink-0">
          {current.code}
        </span>
        <span className="flex-1 text-left text-slate-900 truncate">{current.nativeName}</span>
        {current.isDefault && (
          <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">base</span>
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-slate-400 shrink-0"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-slate-200 bg-white shadow-lg z-40 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language…"
              className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <ul role="listbox" className="max-h-[60vh] overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-slate-500">
                No language matches &ldquo;{query}&rdquo;
              </li>
            )}
            {filtered.map((lang) => {
              const isActive = lang.code === active
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => setLocale(lang.code)}
                    role="option"
                    aria-selected={isActive}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono uppercase text-xs opacity-70 w-7 shrink-0">
                      {lang.code}
                    </span>
                    <span className="flex-1 min-w-0 truncate">
                      <span>{lang.nativeName}</span>
                      {lang.name !== lang.nativeName && (
                        <span className="text-xs text-slate-400 ml-1.5">{lang.name}</span>
                      )}
                    </span>
                    {lang.isDefault && (
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">
                        base
                      </span>
                    )}
                    {isActive && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {languages.length > 6 && (
            <div className="px-3 py-1.5 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              {filtered.length} of {languages.length} languages
            </div>
          )}
        </div>
      )}
    </div>
  )
}
