'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { IconSearch } from '@/app/admin/_icons'

export default function SearchInput({ initial }: { initial: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(initial)
  const [, startTransition] = useTransition()

  // Debounced sync to URL — 250ms after last keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = new URLSearchParams(params?.toString() ?? '')
      if (value) next.set('q', value)
      else next.delete('q')
      startTransition(() => {
        router.replace(`/admin/documents?${next.toString()}`, { scroll: false })
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
        placeholder="Search by title, period, or filename…"
        className="w-full sm:w-80 pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
      />
    </div>
  )
}
