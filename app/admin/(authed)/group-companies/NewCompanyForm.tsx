'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import type { CompanyState } from './_actions'
import { useToast } from '@/app/admin/_components/Toast'

const initial: CompanyState = {}

const TYPES = [
  { value: 'parent',      label: 'Parent (listed)' },
  { value: 'subsidiary',  label: 'Subsidiary' },
  { value: 'associate',   label: 'Associate / related' },
  { value: 'nonprofit',   label: 'Non-profit' },
]

export default function NewCompanyForm({
  action,
  onSuccess,
}: {
  action: (prev: CompanyState, formData: FormData) => Promise<CompanyState>
  onSuccess?: () => void
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const formRef = useRef<HTMLFormElement>(null)
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      toast.success('Entity added')
      onSuccess?.()
    } else if (state.error) {
      toast.error('Could not add entity', state.error)
    }
  }, [state, onSuccess, toast])

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Name" required htmlFor="new-name">
        <input id="new-name" name="name" placeholder="e.g. Astonea Labs Limited" required className={inputClass} />
      </Field>
      <Field label="Slug" required htmlFor="new-slug" help="URL-friendly identifier, lowercase.">
        <input id="new-slug" name="slug" placeholder="e.g. astonea-labs" required className={inputClass} />
      </Field>
      <Field label="Entity type" required htmlFor="new-type">
        <select id="new-type" name="entityType" required defaultValue="subsidiary" className={selectClass}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>
      <Field label="CIN" htmlFor="new-cin" help="Corporate Identification Number (optional).">
        <input id="new-cin" name="cin" className={inputClass} />
      </Field>
      <Field label="Website URL" htmlFor="new-website" help="Optional. Shown as a 'Visit website' button on the public card.">
        <input id="new-website" name="websiteUrl" type="url" placeholder="https://example.com" className={inputClass} />
      </Field>
      <Field label="Display order" htmlFor="new-order">
        <input id="new-order" name="displayOrder" type="number" min={0} defaultValue={0} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description" htmlFor="new-desc">
          <textarea id="new-desc" name="description" rows={2} className={textareaClass} />
        </Field>
      </div>
      <div className="sm:col-span-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60"
        >
          {pending ? 'Adding…' : 'Add entity'}
        </button>
      </div>
    </form>
  )
}
