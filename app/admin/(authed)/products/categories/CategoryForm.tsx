'use client'

import { useActionState, useEffect } from 'react'
import { Field, inputClass, textareaClass } from '@/app/admin/_components/Field'
import { useToast } from '@/app/admin/_components/Toast'
import type { CategoryState } from './_actions'

const initial: CategoryState = {}

export type CategoryDraft = {
  id?: string
  slug?: string
  label?: string
  description?: string | null
  heroImage?: string | null
  icon?: string | null
  displayOrder?: number
  isActive?: boolean
}

export default function CategoryForm({
  action,
  initialValue,
  submitLabel,
  onSuccess,
  successMessage,
}: {
  action: (prev: CategoryState, formData: FormData) => Promise<CategoryState>
  initialValue?: CategoryDraft
  submitLabel: string
  onSuccess?: () => void
  successMessage?: string
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      toast.success(successMessage ?? 'Category saved')
      onSuccess?.()
    } else if (state.error) {
      toast.error('Could not save category', state.error)
    }
  }, [state, onSuccess, successMessage, toast])

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Label" required help="Shown in admin and on the public site." htmlFor="label">
          <input
            id="label"
            name="label"
            required
            defaultValue={initialValue?.label ?? ''}
            placeholder="e.g. Active Pharmaceutical Ingredients"
            className={inputClass}
          />
        </Field>
        <Field label="URL slug" help="Auto-derived from the label if blank. Used in /products/<slug>." htmlFor="slug">
          <input
            id="slug"
            name="slug"
            defaultValue={initialValue?.slug ?? ''}
            placeholder="apis"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialValue?.description ?? ''}
          className={textareaClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hero image URL" help="Optional. Shown atop the category page." htmlFor="heroImage">
          <input
            id="heroImage"
            name="heroImage"
            defaultValue={initialValue?.heroImage ?? ''}
            placeholder="/images/categories/apis.jpg or https://…"
            className={inputClass}
          />
        </Field>
        <Field label="Icon" help="Optional icon name/identifier." htmlFor="icon">
          <input
            id="icon"
            name="icon"
            defaultValue={initialValue?.icon ?? ''}
            placeholder="pills"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Display order" help="Lower numbers appear first." htmlFor="displayOrder">
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min={0}
            defaultValue={initialValue?.displayOrder ?? 0}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initialValue?.isActive ?? true}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-900">Active — show on public site</span>
          </label>
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
