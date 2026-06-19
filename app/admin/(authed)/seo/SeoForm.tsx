'use client'

import { useActionState, useState } from 'react'
import { Field, inputClass, textareaClass } from '@/app/admin/_components/Field'
import { upsertPageMetadata, type SeoActionState } from './_actions'

type Props = {
  pagePath: string
  defaults: { title: string; description: string; keywords: string }
  initial?: {
    title?: string | null
    description?: string | null
    keywords?: string | null
    canonical?: string | null
    noIndex?: boolean
    ogImage?: string | null
  } | null
}

export default function SeoForm({ pagePath, defaults, initial }: Props) {
  const [state, formAction, pending] = useActionState<SeoActionState, FormData>(
    upsertPageMetadata,
    {},
  )

  const [ogImageUrl, setOgImageUrl] = useState(initial?.ogImage ?? '')

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="pagePath" value={pagePath} />

      <Field label="Title" required htmlFor="seo-title" help="Shown as browser tab title and Google search-result headline (50–60 chars recommended).">
        <input
          id="seo-title"
          name="title"
          type="text"
          required
          defaultValue={initial?.title ?? defaults.title}
          placeholder={defaults.title}
          className={inputClass}
        />
      </Field>

      <Field label="Description" htmlFor="seo-desc" help="Shown under the title in search results (150–160 chars recommended).">
        <textarea
          id="seo-desc"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? defaults.description}
          placeholder={defaults.description}
          className={textareaClass}
        />
      </Field>

      <Field label="Keywords" htmlFor="seo-kw" help="Comma-separated. Leave blank to inherit the suggested defaults shown below.">
        <textarea
          id="seo-kw"
          name="keywords"
          rows={3}
          defaultValue={initial?.keywords ?? defaults.keywords}
          placeholder={defaults.keywords}
          className={textareaClass}
        />
      </Field>

      <Field label="Canonical URL" htmlFor="seo-canon" help="Leave blank to use the page's own URL. Set this only when the page is the alternative form of another canonical URL.">
        <input
          id="seo-canon"
          name="canonical"
          type="url"
          defaultValue={initial?.canonical ?? ''}
          placeholder="https://astonealabs.com/about-us"
          className={inputClass}
        />
      </Field>

      <Field label="Open Graph image" help="Shown when this page is shared on social media. Recommended: 1200×630 px, under 8 MB.">
        <div className="space-y-3">
          {ogImageUrl && (
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogImageUrl} alt="" className="w-24 h-12 object-cover rounded border border-slate-200" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{ogImageUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setOgImageUrl('')}
                className="text-xs text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
          <input type="hidden" name="ogImageUrl" value={ogImageUrl} />
          <input
            type="file"
            name="ogImageFile"
            accept="image/*"
            className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-medium hover:file:bg-slate-800"
          />
        </div>
      </Field>

      <Field label="Robots" htmlFor="seo-noindex">
        <label className="flex items-center gap-2 text-sm">
          <input
            id="seo-noindex"
            name="noIndex"
            type="checkbox"
            defaultChecked={initial?.noIndex ?? false}
            className="w-4 h-4"
          />
          <span>Discourage search engines from indexing this page (noindex, nofollow)</span>
        </label>
      </Field>

      {state.error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save SEO'}
        </button>
        <a
          href={pagePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Preview page ↗
        </a>
      </div>
    </form>
  )
}
