'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export type StatusValue =
  | 'all'
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived'
  | 'trash'

const OPTIONS: Array<{ value: StatusValue; label: string }> = [
  { value: 'all',        label: 'All live' },
  { value: 'draft',      label: 'Draft' },
  { value: 'in_review',  label: 'In review' },
  { value: 'approved',   label: 'Approved' },
  { value: 'scheduled',  label: 'Scheduled' },
  { value: 'published',  label: 'Published' },
  { value: 'archived',   label: 'Archived' },
  { value: 'trash',      label: 'Trash' },
]

export default function StatusFilter({ value }: { value: StatusValue }) {
  const router = useRouter()
  const params = useSearchParams()
  const [, start] = useTransition()

  const onChange = (next: string) => {
    const p = new URLSearchParams(params?.toString() ?? '')
    if (next === 'all') p.delete('status')
    else p.set('status', next)
    p.delete('page')
    const qs = p.toString()
    start(() => {
      router.replace(qs ? `/admin/products?${qs}` : '/admin/products', { scroll: false })
    })
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
