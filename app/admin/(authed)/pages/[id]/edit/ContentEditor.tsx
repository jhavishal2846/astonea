'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Field, inputClass, textareaClass } from '@/app/admin/_components/Field'
import { savePageText } from '../../_text-actions'

export type EditableField = {
  key: string
  label: string
  help?: string
  widget: 'text' | 'textarea' | 'richtext'
  defaultValue: string
  /** Optional group/section heading shown above the field. */
  group?: string
  /** Whatever's currently stored — null if no override yet. */
  current: string | null
}

export default function ContentEditor({
  pagePath,
  locale,
  isTranslationMode,
  pagePreviewUrl,
  fields,
}: {
  pagePath: string
  locale: string
  isTranslationMode: boolean
  pagePreviewUrl: string
  fields: EditableField[]
}) {
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Form state: pre-filled with the override if present, else default.
  const initial: Record<string, string> = {}
  for (const f of fields) initial[f.key] = f.current ?? f.defaultValue
  const [draft, setDraft] = useState<Record<string, string>>(initial)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const dirty = fields.some((f) => draft[f.key] !== (f.current ?? f.defaultValue))

  const save = () => {
    setError(null)
    startTransition(async () => {
      const res = await savePageText(pagePath, locale, draft)
      if (res.error) {
        setError(res.error)
        return
      }
      setSavedAt(res.savedAt ?? Date.now())
      router.refresh()
      // Force the preview iframe to pull the just-saved content.
      if (iframeRef.current) {
        iframeRef.current.src = pagePreviewUrl + (pagePreviewUrl.includes('?') ? '&' : '?') + '_t=' + Date.now()
      }
    })
  }

  const discard = () => {
    setDraft(initial)
    setError(null)
  }

  const reset = (key: string) => {
    setDraft((d) => ({ ...d, [key]: '' }))
  }

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">
      {/* Preview — left */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm sticky top-6">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-700">Live preview</span>
            <span className="font-mono text-[11px] text-slate-500">{pagePath}</span>
          </div>
          <a
            href={pagePreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Open in new tab ↗
          </a>
        </div>
        <iframe
          ref={iframeRef}
          src={pagePreviewUrl}
          className="w-full block"
          style={{ height: 'calc(100vh - 220px)', minHeight: '600px', border: 0 }}
          title="Page preview"
        />
      </div>

      {/* Form — right */}
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
              {isTranslationMode ? `Translating · ${locale.toUpperCase()}` : 'Page content'}
            </p>
            <p className="text-sm font-semibold text-slate-900">Edit the text on this page</p>
            <p className="text-xs text-slate-500 mt-1">
              Changes are <strong>not</strong> live until you click <strong>Save</strong>. Leave a
              field blank to reset it to the original.
            </p>
          </div>

          <div className="px-4 py-4 space-y-5 max-h-[calc(100vh-380px)] overflow-y-auto">
            {fields.map((f, i) => {
              const prevGroup = i > 0 ? fields[i - 1].group : undefined
              const groupChanged = f.group && f.group !== prevGroup
              return (
                <div key={f.key}>
                  {groupChanged && (
                    <div className="-mx-4 px-4 pt-3 pb-2 mb-2 border-t border-slate-100 first:border-t-0 first:pt-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        {f.group}
                      </p>
                    </div>
                  )}
                  <Field label={f.label} help={f.help}>
                    <div className="space-y-1.5">
                      {f.widget === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={draft[f.key]}
                          onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                          placeholder={f.defaultValue}
                          className={textareaClass}
                        />
                      ) : (
                        <input
                          type="text"
                          value={draft[f.key]}
                          onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                          placeholder={f.defaultValue}
                          className={inputClass}
                        />
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{f.key}</span>
                        {draft[f.key] !== '' && draft[f.key] !== f.defaultValue && (
                          <button
                            type="button"
                            onClick={() => reset(f.key)}
                            className="text-slate-500 hover:text-slate-700 hover:underline"
                          >
                            Reset to default
                          </button>
                        )}
                      </div>
                    </div>
                  </Field>
                </div>
              )
            })}
          </div>

          {error && (
            <div className="mx-4 mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              {savedAt ? (
                <span className="text-emerald-700">✓ Saved {new Date(savedAt).toLocaleTimeString()}</span>
              ) : dirty ? (
                <span className="text-amber-700">● Unsaved changes</span>
              ) : (
                <span>No changes</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={discard}
                disabled={pending || !dirty}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending || !dirty}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pending ? 'Saving…' : 'Save & publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
