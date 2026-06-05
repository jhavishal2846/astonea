'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import type { GroupCompany } from '@/lib/db/schema'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import { updateCompany, type CompanyState } from './_actions'
import { IconEdit, IconTrash } from '@/app/admin/_icons'
import { useToast } from '@/app/admin/_components/Toast'

const initial: CompanyState = {}

const TYPES = [
  { value: 'parent',      label: 'Parent (listed)' },
  { value: 'subsidiary',  label: 'Subsidiary' },
  { value: 'associate',   label: 'Associate' },
  { value: 'nonprofit',   label: 'Non-profit' },
]

const TYPE_COLORS: Record<string, string> = {
  parent:     'bg-blue-50 text-blue-700 border-blue-200',
  subsidiary: 'bg-slate-100 text-slate-700 border-slate-200',
  associate:  'bg-violet-50 text-violet-700 border-violet-200',
  nonprofit:  'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function CompanyRow({
  row,
  deleteAction,
}: {
  row: GroupCompany
  deleteAction: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [pending, start] = useTransition()
  const boundUpdate = updateCompany.bind(null, row.id)
  const [state, formAction, formPending] = useActionState(boundUpdate, initial)
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      toast.success('Entity updated', row.name)
      setEditing(false)
    } else if (state.error) {
      toast.error('Could not save changes', state.error)
    }
  }, [state])

  const handleDelete = () => {
    start(async () => {
      try {
        await deleteAction()
        toast.success('Entity deleted', row.name)
      } catch (e) {
        toast.error('Delete failed', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  if (!editing) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${TYPE_COLORS[row.entityType] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {row.entityType}
            </span>
            <span className="font-medium text-sm text-slate-900 truncate">{row.name}</span>
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-mono">{row.slug}</span>
            {row.cin && <> · CIN {row.cin}</>}
            <> · order {row.displayOrder}</>
          </div>
          {row.description && (
            <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">{row.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            className="p-2 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          {confirming ? (
            <div className="flex items-center gap-1 px-2 border-l border-slate-200 ml-1">
              <span className="text-xs text-rose-700">Delete?</span>
              <button
                disabled={pending}
                onClick={handleDelete}
                className="text-xs font-semibold text-rose-700 hover:underline disabled:opacity-50"
              >Yes</button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-slate-500 hover:underline"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              title="Delete"
              className="p-2 rounded-md text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className="bg-white border-2 border-primary/30 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-sm">
      <Field label="Name" required>
        <input name="name" required defaultValue={row.name} className={inputClass} />
      </Field>
      <Field label="Slug" required>
        <input name="slug" required defaultValue={row.slug} className={inputClass} />
      </Field>
      <Field label="Entity type">
        <select name="entityType" defaultValue={row.entityType} className={selectClass}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>
      <Field label="CIN">
        <input name="cin" defaultValue={row.cin ?? ''} className={inputClass} />
      </Field>
      <Field label="Display order">
        <input name="displayOrder" type="number" min={0} defaultValue={row.displayOrder} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea name="description" defaultValue={row.description ?? ''} rows={2} className={textareaClass} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex gap-2 pt-1">
        <button
          type="submit"
          disabled={formPending}
          className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {formPending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
