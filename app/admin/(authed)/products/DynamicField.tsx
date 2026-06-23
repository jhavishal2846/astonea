'use client'

import { useState } from 'react'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import type { FieldDef } from '@/lib/products/category-schemas'

type Value = unknown

/**
 * Renders one schema-defined product attribute as a form input.
 *
 * The `keyPrefix` arg lets translation tabs reuse this for per-locale fields:
 *   - canonical fields use prefix "attr" → submits as "attr:<key>"
 *   - locale "hi" uses prefix "tr:hi:attr" → submits as "tr:hi:attr:<key>"
 *
 * Pair it with a stable `inputId` (e.g. "hi-applications") so labels match
 * the right input when multiple tabs render the same field.
 */
export default function DynamicField({
  def,
  initial,
  keyPrefix = 'attr',
  inputIdSuffix,
}: {
  def: FieldDef
  initial?: Value
  keyPrefix?: string
  inputIdSuffix?: string
}) {
  const name = `${keyPrefix}:${def.key}`
  const id = inputIdSuffix ? `${name}-${inputIdSuffix}` : name

  switch (def.type) {
    case 'text':
      return (
        <Field label={def.label} required={def.required} help={def.helpText} htmlFor={id}>
          <input
            id={id}
            name={name}
            defaultValue={typeof initial === 'string' ? initial : ''}
            placeholder={def.placeholder}
            required={def.required}
            className={inputClass}
          />
        </Field>
      )
    case 'textarea':
      return (
        <Field label={def.label} required={def.required} help={def.helpText} htmlFor={id}>
          <textarea
            id={id}
            name={name}
            defaultValue={typeof initial === 'string' ? initial : ''}
            placeholder={def.placeholder}
            required={def.required}
            rows={3}
            className={textareaClass}
          />
        </Field>
      )
    case 'select':
      return (
        <Field label={def.label} required={def.required} help={def.helpText} htmlFor={id}>
          <select
            id={id}
            name={name}
            defaultValue={typeof initial === 'string' ? initial : ''}
            required={def.required}
            className={selectClass}
          >
            {!def.required && <option value="">— None —</option>}
            {def.options?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      )
    case 'string-list':
      return (
        <StringListInput
          def={def}
          name={name}
          initial={Array.isArray(initial) ? (initial as string[]) : []}
        />
      )
    case 'kv-list':
      return (
        <KvListInput
          def={def}
          name={name}
          initial={Array.isArray(initial) ? (initial as Array<{ size: string; type: string }>) : []}
        />
      )
  }
}

function StringListInput({ def, name, initial }: { def: FieldDef; name: string; initial: string[] }) {
  const [items, setItems] = useState<string[]>(initial.length ? initial : [''])

  const update = (i: number, v: string) => setItems((prev) => prev.map((x, j) => (j === i ? v : x)))
  const remove = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i))
  const add = () => setItems((prev) => [...prev, ''])

  return (
    <Field label={def.label} required={def.required} help={def.helpText}>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              name={`${name}[]`}
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={def.placeholder ?? `Item ${i + 1}`}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="px-2.5 py-2 rounded-lg text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium text-primary hover:underline"
        >
          + Add item
        </button>
      </div>
    </Field>
  )
}

function KvListInput({
  def,
  name,
  initial,
}: {
  def: FieldDef
  name: string
  initial: Array<{ size: string; type: string }>
}) {
  const [items, setItems] = useState(initial.length ? initial : [{ size: '', type: '' }])
  const [sizeLabel, typeLabel] = def.kvLabels ?? ['Size', 'Type']

  const update = (i: number, key: 'size' | 'type', v: string) =>
    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, [key]: v } : x)))
  const remove = (i: number) => setItems((prev) => prev.filter((_, j) => j !== i))
  const add = () => setItems((prev) => [...prev, { size: '', type: '' }])

  return (
    <Field label={def.label} required={def.required} help={def.helpText}>
      <div className="space-y-2">
        {items.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
            <input
              type="text"
              name={`${name}[size]`}
              value={row.size}
              onChange={(e) => update(i, 'size', e.target.value)}
              placeholder={sizeLabel}
              className={inputClass}
            />
            <input
              type="text"
              name={`${name}[type]`}
              value={row.type}
              onChange={(e) => update(i, 'type', e.target.value)}
              placeholder={typeLabel}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="px-2.5 py-2 rounded-lg text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium text-primary hover:underline"
        >
          + Add row
        </button>
      </div>
    </Field>
  )
}
