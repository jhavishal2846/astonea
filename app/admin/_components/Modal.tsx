'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({ open, onClose, title, description, children, size = 'lg' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [enter, setEnter] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) {
      setEnter(false)
      return
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const r1 = requestAnimationFrame(() => setEnter(true))
    const t = setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea, button:not([data-modal-close])',
      )
      focusable?.focus()
    }, 60)

    return () => {
      cancelAnimationFrame(r1)
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-90 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-colors duration-200 ${
        enter ? 'bg-slate-900/45 backdrop-blur-sm' : 'bg-slate-900/0'
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-hidden={!open}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${SIZE_CLASS[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-[0_24px_60px_rgba(15,23,42,0.18)] border border-slate-200 overflow-hidden transform transition-all duration-200 ease-out ${
          enter ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 sm:translate-y-2 opacity-0 sm:scale-[0.98]'
        }`}
      >
        <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-base font-semibold text-slate-900 leading-tight">
              {title}
            </h2>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <div className="px-6 py-5 max-h-[calc(100vh-9rem)] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
