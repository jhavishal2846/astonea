'use client'

import dynamic from 'next/dynamic'
import type { FieldDescriptor } from '@/lib/cms/blocks/types'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import DocumentPickerWidget from './DocumentPickerWidget'

// Tiptap pulls a few hundred KB and only ever runs in the browser. Lazy-loading
// it keeps the admin chunk lean and avoids any SSR mismatch.
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-slate-200 bg-white min-h-[160px] p-3 text-xs text-slate-400">
      Loading editor…
    </div>
  ),
})

export function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const next = structuredClone(obj)
  const parts = path.split('.')
  let cur: Record<string, unknown> = next
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (typeof cur[p] !== 'object' || cur[p] === null || Array.isArray(cur[p])) {
      cur[p] = {}
    }
    cur = cur[p] as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value
  return next
}

export function FieldWidget({
  descriptor,
  value,
  onChange,
}: {
  descriptor: FieldDescriptor
  value: unknown
  onChange: (v: unknown) => void
}) {
  if (descriptor.widget === 'richtext') {
    return (
      <RichTextEditor
        value={typeof value === 'string' ? value : ''}
        onChange={(v) => onChange(v)}
      />
    )
  }
  if (descriptor.widget === 'textarea') {
    return (
      <textarea
        rows={4}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
      />
    )
  }
  if (descriptor.widget === 'number') {
    return (
      <input
        type="number"
        value={typeof value === 'number' ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass}
      />
    )
  }
  if (descriptor.widget === 'select' && descriptor.options) {
    return (
      <select
        value={typeof value === 'string' ? value : descriptor.options[0]?.value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {descriptor.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }
  if (descriptor.widget === 'switch') {
    return (
      <input
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
    )
  }
  if (descriptor.widget === 'documents') {
    return <DocumentPickerWidget value={value} onChange={(v) => onChange(v)} />
  }
  if (descriptor.widget === 'image') {
    return (
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder="/uploads/photo.jpg or https://…"
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + ' font-mono'}
      />
    )
  }
  return (
    <input
      type="text"
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

export function ArrayWidget({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor
  value: unknown
  onChange: (v: unknown) => void
}) {
  const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : []
  const rowFields = field.rowFields ?? []

  const emptyRow = () => {
    const r: Record<string, unknown> = {}
    for (const f of rowFields) {
      r[f.name] =
        f.widget === 'number' ? 0 : f.widget === 'switch' ? false : ''
    }
    return r
  }

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600">Row {i + 1}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (i === 0) return
                  const next = rows.slice()
                  ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                  onChange(next)
                }}
                disabled={i === 0}
                className="text-xs text-slate-500 disabled:opacity-30 hover:text-slate-700"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => {
                  if (i === rows.length - 1) return
                  const next = rows.slice()
                  ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
                  onChange(next)
                }}
                disabled={i === rows.length - 1}
                className="text-xs text-slate-500 disabled:opacity-30 hover:text-slate-700"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = rows.slice()
                  next.splice(i, 1)
                  onChange(next)
                }}
                className="text-xs text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {rowFields.map((rf) => (
              <Field key={rf.name} label={rf.label} required={rf.required} help={rf.help}>
                <FieldWidget
                  descriptor={rf}
                  value={row[rf.name]}
                  onChange={(v) => {
                    const next = rows.slice()
                    next[i] = { ...next[i], [rf.name]: v }
                    onChange(next)
                  }}
                />
              </Field>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, emptyRow()])}
        className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
      >
        + Add row
      </button>
    </div>
  )
}
