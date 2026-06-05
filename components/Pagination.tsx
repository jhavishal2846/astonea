'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface PaginationProps {
  total: number
  perPage: number
  current: number
  onChange: (page: number) => void
}

export default function Pagination({ total, perPage, current, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const from = (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('…')
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i)
    if (current < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-ink-subtle">
        Showing <span className="font-semibold text-ink">{from}–{to}</span> of{' '}
        <span className="font-semibold text-ink">{total}</span> products
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-ink-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-ink-subtle text-sm select-none">
              …
            </span>
          ) : (
            <motion.button
              key={p}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(p as number)}
              className={`relative w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                p === current
                  ? 'bg-primary text-white'
                  : 'border border-border text-ink-muted hover:border-primary hover:text-primary'
              }`}
              aria-current={p === current ? 'page' : undefined}
            >
              {p === current && (
                <motion.span
                  layoutId="page-pill"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{p}</span>
            </motion.button>
          )
        )}

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-ink-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </nav>
    </div>
  )
}
