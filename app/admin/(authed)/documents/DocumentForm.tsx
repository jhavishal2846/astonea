'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { CATEGORY_LABELS, SUBCATEGORY_OPTIONS, ALL_CATEGORIES } from '@/lib/cms/categories'
import type { DocumentCategory, GroupCompany } from '@/lib/db/schema'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import FileDropzone from './FileDropzone'
import type { ActionState } from './_actions'
import { useToast } from '@/app/admin/_components/Toast'

const initial: ActionState = {}

export type DocumentDraft = {
  id?: string
  category?: DocumentCategory
  subcategory?: string | null
  title?: string
  description?: string | null
  fileUrl?: string | null
  period?: string | null
  eventDate?: string | null
  entityId?: string | null
  externalLink?: string | null
  displayOrder?: number
  isPublished?: boolean
}

export default function DocumentForm({
  action,
  initialValue,
  groupCompanies,
  submitLabel,
  onSuccess,
  successMessage = 'Document saved',
  hideCancel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  initialValue?: DocumentDraft
  groupCompanies: Pick<GroupCompany, 'id' | 'name'>[]
  submitLabel: string
  onSuccess?: () => void
  successMessage?: string
  hideCancel?: boolean
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const [category, setCategory] = useState<DocumentCategory>(initialValue?.category ?? 'annual_report')
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      toast.success(successMessage)
      onSuccess?.()
    } else if (state.error) {
      toast.error('Could not save document', state.error)
    }
  }, [state, onSuccess, successMessage, toast])

  const subcatOptions = SUBCATEGORY_OPTIONS[category]
  const showEventDate = category === 'reg30'
  const showEntity = category === 'subsidiary_financial'

  return (
    <form action={formAction} className="space-y-8" encType="multipart/form-data">
      {/* Section: Classification */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Category" required htmlFor="category">
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className={selectClass}
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </Field>

          {subcatOptions.length > 0 && (
            <Field label="Subcategory" htmlFor="subcategory">
              <select
                id="subcategory"
                name="subcategory"
                defaultValue={initialValue?.subcategory ?? ''}
                className={selectClass}
              >
                <option value="">— None —</option>
                {subcatOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          )}

          {showEntity && (
            <Field label="Group company" required htmlFor="entityId">
              <select
                id="entityId"
                name="entityId"
                defaultValue={initialValue?.entityId ?? ''}
                className={selectClass}
                required
              >
                <option value="">— Select company —</option>
                {groupCompanies.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </Field>
          )}
        </div>
      </section>

      {/* Section: Content */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Content</h3>
        <div className="space-y-4">
          <Field label="Title" required htmlFor="title">
            <input
              id="title"
              name="title"
              required
              defaultValue={initialValue?.title ?? ''}
              className={inputClass}
              placeholder="e.g. Annual Report FY 2024–2025"
            />
          </Field>

          <Field label="Description" help="Optional. Shown beneath the title on the public page." htmlFor="description">
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialValue?.description ?? ''}
              className={textareaClass}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Period / Year" help="e.g. FY 2024–2025, H1 2025, 27 Feb 2026" htmlFor="period">
              <input
                id="period"
                name="period"
                defaultValue={initialValue?.period ?? ''}
                className={inputClass}
              />
            </Field>

            {showEventDate && (
              <Field label="Event date" help="Used for sorting Reg 30 events." htmlFor="eventDate">
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  defaultValue={initialValue?.eventDate ?? ''}
                  className={inputClass}
                />
              </Field>
            )}
          </div>
        </div>
      </section>

      {/* Section: File */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Document file</h3>

        {initialValue?.fileUrl && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
            <span className="text-slate-500">Current file:</span>
            <a href={initialValue.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1">
              {initialValue.fileUrl}
            </a>
          </div>
        )}

        <div className="space-y-4">
          <FileDropzone existingUrl={initialValue?.fileUrl ?? null} />

          <Field label="Or enter file URL manually" help="Use for files already in /public (e.g. /pdf/My File.pdf) or external links." htmlFor="fileUrl">
            <input
              id="fileUrl"
              name="fileUrl"
              defaultValue={initialValue?.fileUrl ?? ''}
              placeholder="/pdf/example.pdf or https://…"
              className={inputClass}
            />
          </Field>

          <Field
            label="External link (non-PDF)"
            help="Use when the row should link to an internal route instead of a PDF, e.g. /financial-results."
            htmlFor="externalLink"
          >
            <input
              id="externalLink"
              name="externalLink"
              defaultValue={initialValue?.externalLink ?? ''}
              placeholder="/financial-results"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Section: Display */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Display</h3>
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
                name="isPublished"
                defaultChecked={initialValue?.isPublished ?? true}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-900">Published — show on public site</span>
            </label>
          </Field>
        </div>
      </section>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Saving…' : submitLabel}
        </button>
        {!hideCancel && (
          <Link
            href="/admin/documents"
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
