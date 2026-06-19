'use client'

import { useState, useActionState } from 'react'
import Modal from '@/app/admin/_components/Modal'
import { Field, inputClass } from '@/app/admin/_components/Field'
import { IconPlus } from '@/app/admin/_icons'
import { createPage, type ActionState } from './_actions'

export default function NewPageTrigger() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createPage,
    {},
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <IconPlus className="w-3.5 h-3.5" />
        New page
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a new page">
        <form action={formAction} className="space-y-4">
          <Field
            label="Label"
            required
            help="Internal name shown in the admin (e.g. 'About us 2026 refresh')."
          >
            <input name="label" type="text" required placeholder="My new page" className={inputClass} />
          </Field>
          <Field
            label="URL path"
            required
            help="Public URL path. Lowercase, letters/digits/hyphens only. Example: /partnerships or /press/2026-march."
          >
            <input
              name="path"
              type="text"
              required
              placeholder="/new-page"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              className={inputClass + ' font-mono'}
            />
          </Field>

          {state.error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {state.error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {pending ? 'Creating…' : 'Create page'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
