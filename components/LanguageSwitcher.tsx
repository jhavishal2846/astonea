'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export type LocaleOption = {
  code: string
  name: string
  nativeName: string
  isDefault: boolean
}

const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur'])

/**
 * Detect the locale prefix in the current pathname. Returns '' if no prefix
 * (which means the default locale is active).
 */
function detectPrefix(pathname: string, locales: LocaleOption[]): { prefix: string; rest: string } {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0] ?? ''
  if (locales.some((l) => l.code === first && !l.isDefault)) {
    return { prefix: first, rest: '/' + segments.slice(1).join('/') }
  }
  return { prefix: '', rest: pathname }
}

function buildHref(rest: string, code: string, isDefault: boolean): string {
  const cleanRest = rest === '' ? '/' : rest
  if (isDefault) return cleanRest
  return `/${code}${cleanRest === '/' ? '' : cleanRest}`
}

export default function LanguageSwitcher({
  languages,
  currentLocale,
  transparent,
}: {
  languages: LocaleOption[]
  currentLocale: string
  transparent?: boolean
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname() ?? '/'

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (languages.length <= 1) return null

  const { rest } = detectPrefix(pathname, languages)
  const current = languages.find((l) => l.code === currentLocale) ?? languages[0]

  const triggerColor = transparent
    ? 'text-white/85 hover:text-white border-white/30 hover:border-white/50'
    : 'text-ink/80 hover:text-ink border-border hover:border-ink/30'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${triggerColor}`}
      >
        <span className="font-mono uppercase">{current.code}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 opacity-70">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[12rem] rounded-xl border border-border bg-surface shadow-xl py-1.5 z-50"
        >
          {languages.map((l) => {
            const href = buildHref(rest, l.code, l.isDefault)
            const active = l.code === currentLocale
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    router.push(href)
                  }}
                  dir={RTL_LOCALES.has(l.code) ? 'rtl' : 'ltr'}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-primary-xlight text-primary font-semibold'
                      : 'text-ink hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs uppercase opacity-70 w-7 flex-shrink-0">{l.code}</span>
                    <span className="truncate">{l.nativeName}</span>
                  </span>
                  {active && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
