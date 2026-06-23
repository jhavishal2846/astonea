'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/app/admin/_components/Modal'
import { Field, inputClass } from '@/app/admin/_components/Field'
import { IconPlus } from '@/app/admin/_icons'
import { addLanguage, type LangActionState } from './_actions'

export default function NewLanguageTrigger() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, pending] = useActionState<LangActionState, FormData>(
    addLanguage,
    {},
  )

  // Close the modal + refresh the list after a successful submit. Has to run
  // post-commit (useEffect) — calling setOpen / router.refresh during render
  // triggers React 19's "setState while rendering a different component"
  // warning because router.refresh updates the Router context.
  useEffect(() => {
    if (state.ok && open) {
      setOpen(false)
      router.refresh()
    }
  }, [state.ok, open, router])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <IconPlus className="w-3.5 h-3.5" />
        Add language
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a new language">
        <form action={formAction} className="space-y-4">
          <Field label="Locale code" required help="Lowercase ISO 639 code (e.g. hi, gu, ar, en-GB). This becomes the URL prefix.">
            <input
              name="code"
              type="text"
              required
              placeholder="hi"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className={inputClass}
            />
          </Field>
          <Field label="English name" required help="How this language appears in admin lists.">
            <input
              name="name"
              type="text"
              required
              placeholder="Hindi"
              className={inputClass}
            />
          </Field>
          <Field label="Native name" help="How this language appears in the public language switcher (e.g. हिन्दी).">
            <input
              name="nativeName"
              type="text"
              placeholder="हिन्दी"
              className={inputClass}
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
              {pending ? 'Adding…' : 'Add language'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
