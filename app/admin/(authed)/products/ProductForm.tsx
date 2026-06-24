'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import Link from '@/app/_nav/AppLink'
import {
  CATEGORY_SCHEMAS,
  type CategorySchema,
  type CategorySlug,
} from '@/lib/products/category-schemas'
import type { ProductStatus } from '@/lib/db/schema'
import { Field, inputClass, selectClass, textareaClass } from '@/app/admin/_components/Field'
import { useToast } from '@/app/admin/_components/Toast'
import DynamicField from './DynamicField'
import type { ActionState } from './_actions'

const initial: ActionState = {}

const STATUS_OPTIONS: Array<{ value: ProductStatus; label: string }> = [
  { value: 'draft',      label: 'Draft' },
  { value: 'in_review',  label: 'In review' },
  { value: 'approved',   label: 'Approved' },
  { value: 'scheduled',  label: 'Scheduled' },
  { value: 'published',  label: 'Published' },
  { value: 'archived',   label: 'Archived' },
]

export type FormLanguage = {
  code: string
  name: string
  nativeName: string
  isDefault: boolean
}

export type LocaleTranslation = {
  name: string
  description: string | null
  attributes: Record<string, unknown>
}

export type ProductDraft = {
  id?: string
  categorySlug?: string
  subCategory?: string | null
  name?: string
  slug?: string
  description?: string | null
  attributes?: Record<string, unknown>
  /** Merged from product_translations.attributes for the default locale. */
  translatedAttributes?: Record<string, unknown>
  /** Per-locale translation rows. Keyed by language code. */
  translations?: Record<string, LocaleTranslation>
  synonyms?: string[]
  status?: ProductStatus
  publishedAt?: string | null
  displayOrder?: number
}

export default function ProductForm({
  action,
  initialValue,
  languages,
  submitLabel,
  onSuccess,
  successMessage = 'Product saved',
  hideCancel,
  cancelHref = '/admin/products',
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  initialValue?: ProductDraft
  languages: FormLanguage[]
  submitLabel: string
  onSuccess?: () => void
  successMessage?: string
  hideCancel?: boolean
  cancelHref?: string
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const [categorySlug, setCategorySlug] = useState<CategorySlug>(
    (initialValue?.categorySlug as CategorySlug) ??
      (Object.keys(CATEGORY_SCHEMAS)[0] as CategorySlug),
  )
  const toast = useToast()
  const schema: CategorySchema = CATEGORY_SCHEMAS[categorySlug]

  const defaultLang = useMemo(
    () => languages.find((l) => l.isDefault) ?? languages[0],
    [languages],
  )
  const [activeLocale, setActiveLocale] = useState<string>(defaultLang?.code ?? 'en')
  const showTabs = languages.length > 1

  useEffect(() => {
    if (state.ok) {
      toast.success(successMessage)
      onSuccess?.()
    } else if (state.error) {
      toast.error('Could not save product', state.error)
    }
  }, [state, onSuccess, successMessage, toast])

  // Merge canonical + default-locale-translated attributes for initial render
  // so every field on the default tab gets the right starting value.
  const mergedAttrs: Record<string, unknown> = {
    ...(initialValue?.attributes ?? {}),
    ...(initialValue?.translatedAttributes ?? {}),
  }

  const translatableFields = schema.attributes.filter((f) => f.translatable)

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="categorySlug" value={categorySlug} />

      {/* ─── Language tabs ────────────────────────────────────────────── */}
      {showTabs && defaultLang && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 -mx-2 px-2 pb-px">
          {languages.map((lang) => {
            const active = activeLocale === lang.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveLocale(lang.code)}
                className={`px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-colors ${
                  active
                    ? 'text-primary border-primary'
                    : 'text-slate-500 border-transparent hover:text-slate-900'
                }`}
              >
                <span className="font-mono uppercase mr-1.5 text-[10px] text-slate-400">{lang.code}</span>
                {lang.nativeName}
                {lang.isDefault && (
                  <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    default
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ─── Default-locale tab — full form ───────────────────────────── */}
      <div className={!showTabs || activeLocale === defaultLang?.code ? '' : 'hidden'}>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Classification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" required htmlFor="categorySlug-picker">
              <select
                id="categorySlug-picker"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value as CategorySlug)}
                className={selectClass}
              >
                {Object.values(CATEGORY_SCHEMAS).map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Sub-category" help="Drives filter chips on the public listing." htmlFor="subCategory">
              <select
                id="subCategory"
                name="subCategory"
                defaultValue={initialValue?.subCategory ?? schema.defaultSubCategory ?? ''}
                key={categorySlug}
                className={selectClass}
              >
                <option value="">— None —</option>
                {schema.subCategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Core content
          </h3>
          <div className="space-y-4">
            <Field label="Name" required htmlFor="name">
              <input
                id="name"
                name="name"
                required
                defaultValue={initialValue?.name ?? ''}
                className={inputClass}
                placeholder="e.g. Aspirin"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
              <Field label="URL slug" help="Leave blank to derive from the name. Lowercase, hyphens." htmlFor="slug">
                <input
                  id="slug"
                  name="slug"
                  defaultValue={initialValue?.slug ?? ''}
                  className={inputClass}
                  placeholder="auto-generated from name"
                />
              </Field>
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
            </div>

            <Field label="Description" help="Long-form copy shown on the public detail page." htmlFor="description">
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={initialValue?.description ?? ''}
                className={textareaClass}
              />
            </Field>

            <Field
              label="Synonyms / alternate names"
              help="Comma-separated. Helps search find this product under industry-standard aliases (e.g. Paracetamol, Acetaminophen)."
              htmlFor="synonyms"
            >
              <input
                id="synonyms"
                name="synonyms"
                defaultValue={(initialValue?.synonyms ?? []).join(', ')}
                placeholder="Paracetamol, Acetaminophen, …"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="mt-8" key={`attrs-default-${categorySlug}`}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            {schema.label} attributes
          </h3>
          <div className="space-y-4">
            {schema.attributes.map((def) => (
              <DynamicField key={def.key} def={def} initial={mergedAttrs[def.key]} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status" htmlFor="status">
              <select
                id="status"
                name="status"
                defaultValue={initialValue?.status ?? 'draft'}
                className={selectClass}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Publish / release at"
              help="UTC. For scheduled status, the worker publishes once this passes."
              htmlFor="publishedAt"
            >
              <input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                defaultValue={
                  initialValue?.publishedAt
                    ? new Date(initialValue.publishedAt).toISOString().slice(0, 16)
                    : ''
                }
                className={inputClass}
              />
            </Field>
          </div>
        </section>
      </div>

      {/* ─── Per-locale (non-default) tabs ────────────────────────────── */}
      {languages
        .filter((l) => !l.isDefault)
        .map((lang) => {
          const visible = activeLocale === lang.code
          const tr = initialValue?.translations?.[lang.code]
          return (
            <div key={`locale-${lang.code}`} className={visible ? '' : 'hidden'}>
              <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
                <span className="font-mono uppercase font-bold text-slate-700">{lang.code}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-700">{lang.name} ({lang.nativeName})</span>
                <span className="ml-auto text-[10px] text-slate-500 italic">
                  Leave the name blank to skip saving this locale.
                </span>
              </div>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Translated content
                </h3>
                <div className="space-y-4">
                  <Field
                    label={`Name (${lang.nativeName})`}
                    htmlFor={`tr-${lang.code}-name`}
                    help="Empty = use the default-locale name as fallback."
                  >
                    <input
                      id={`tr-${lang.code}-name`}
                      name={`tr:${lang.code}:name`}
                      defaultValue={tr?.name ?? ''}
                      className={inputClass}
                    />
                  </Field>

                  <Field label={`Description (${lang.nativeName})`} htmlFor={`tr-${lang.code}-desc`}>
                    <textarea
                      id={`tr-${lang.code}-desc`}
                      name={`tr:${lang.code}:description`}
                      rows={5}
                      defaultValue={tr?.description ?? ''}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </section>

              {translatableFields.length > 0 && (
                <section className="mt-8" key={`attrs-${lang.code}-${categorySlug}`}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                    Translated attributes
                  </h3>
                  <div className="space-y-4">
                    {translatableFields.map((def) => (
                      <DynamicField
                        key={def.key}
                        def={def}
                        initial={tr?.attributes?.[def.key]}
                        keyPrefix={`tr:${lang.code}:attr`}
                        inputIdSuffix={lang.code}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )
        })}

      {/* ─── Submit ───────────────────────────────────────────────────── */}
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
            href={cancelHref}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  )
}
