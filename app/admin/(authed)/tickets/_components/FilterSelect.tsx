'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

/**
 * Native <select> that pushes the URL on change. Compact filter chip styling
 * so it visually matches the surrounding status tabs and priority pills.
 *
 * Empty option value = "clear this filter" (deletes the query param entirely).
 */
export default function FilterSelect({
  name,
  value,
  options,
  placeholder,
}: {
  name: string
  value: string
  options: Array<{ value: string; label: string }>
  placeholder: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(v: string) {
    const sp = new URLSearchParams(searchParams.toString())
    if (v) sp.set(name, v)
    else sp.delete(name)
    sp.delete('page')
    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const active = !!value

  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => update(e.target.value)}
        className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/15 ${
          active
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        }`}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white text-slate-900">
            {o.label}
          </option>
        ))}
      </select>
      <span
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs ${
          active ? 'text-white/70' : 'text-slate-400'
        }`}
        aria-hidden
      >
        ▾
      </span>
    </div>
  )
}
