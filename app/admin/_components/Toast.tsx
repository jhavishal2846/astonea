'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type ToastKind = 'success' | 'error' | 'info'

type ToastInput = {
  kind?: ToastKind
  title: string
  description?: string
  duration?: number
}

type ToastItem = Required<Omit<ToastInput, 'description'>> & {
  id: number
  description?: string
}

type ToastApi = {
  push: (t: ToastInput) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastCtx = createContext<ToastApi | null>(null)

let counter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
    const t = timers.current.get(id)
    if (t) {
      clearTimeout(t)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (t: ToastInput) => {
      const id = ++counter
      const item: ToastItem = {
        id,
        kind: t.kind ?? 'success',
        title: t.title,
        description: t.description,
        duration: t.duration ?? 4200,
      }
      setItems((prev) => [...prev, item])
      const handle = setTimeout(() => dismiss(id), item.duration)
      timers.current.set(id, handle)
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((h) => clearTimeout(h))
      map.clear()
    }
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      push,
      success: (title, description) => push({ kind: 'success', title, description }),
      error: (title, description) => push({ kind: 'error', title, description, duration: 6000 }),
      info: (title, description) => push({ kind: 'info', title, description }),
    }),
    [push],
  )

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2.5 sm:top-6 sm:right-6"
      >
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const KIND_STYLES: Record<ToastKind, { bar: string; iconWrap: string; icon: React.ReactNode }> = {
  success: {
    bar: 'bg-emerald-500',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bar: 'bg-rose-500',
    iconWrap: 'bg-rose-50 text-rose-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  info: {
    bar: 'bg-sky-500',
    iconWrap: 'bg-sky-50 text-sky-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [enter, setEnter] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const r = requestAnimationFrame(() => setEnter(true))
    return () => cancelAnimationFrame(r)
  }, [])

  const close = () => {
    setLeaving(true)
    setTimeout(onDismiss, 180)
  }

  const s = KIND_STYLES[item.kind]
  const visible = enter && !leaving

  return (
    <div
      role={item.kind === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-200 ease-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
      }`}
    >
      <span className={`w-1 flex-shrink-0 ${s.bar}`} aria-hidden />
      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${s.iconWrap}`}>
          {s.icon}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-slate-900 leading-tight">{item.title}</p>
          {item.description && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{item.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const QUERY_MESSAGES: Record<string, ToastInput> = {
  created:    { kind: 'success', title: 'Document created' },
  updated:    { kind: 'success', title: 'Changes saved' },
  deleted:    { kind: 'success', title: 'Document deleted' },
  duplicated: { kind: 'info',    title: 'Document duplicated', description: 'Fill in the new fields and save.' },
  published:  { kind: 'success', title: 'Document published' },
  unpublished:{ kind: 'info',    title: 'Document unpublished' },
}

export function ToastFromQuery() {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { push } = useToast()
  const ok = sp.get('ok')
  const err = sp.get('err')
  const handled = useRef<string | null>(null)

  useEffect(() => {
    const key = `${ok ?? ''}|${err ?? ''}`
    if (!ok && !err) {
      handled.current = null
      return
    }
    if (handled.current === key) return
    handled.current = key

    if (ok) {
      const msg = QUERY_MESSAGES[ok]
      if (msg) push(msg)
    }
    if (err) push({ kind: 'error', title: decodeURIComponent(err) })

    const next = new URLSearchParams(sp.toString())
    next.delete('ok')
    next.delete('err')
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [ok, err, push, router, pathname, sp])

  return null
}
