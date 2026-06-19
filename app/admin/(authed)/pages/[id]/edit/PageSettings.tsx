'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Field, inputClass } from '@/app/admin/_components/Field'
import { updatePageMeta } from '../../_actions'
import PageHistory from './PageHistory'

export default function PageSettings({
  pageId,
  initialLabel,
  initialPublished,
  initialShowInNav,
  path,
}: {
  pageId: string
  initialLabel: string
  initialPublished: boolean
  initialShowInNav: boolean
  path: string
}) {
  const [label, setLabel] = useState(initialLabel)
  const [isPublished, setIsPublished] = useState(initialPublished)
  const [showInNav, setShowInNav] = useState(initialShowInNav)
  const [pending, startTransition] = useTransition()
  const [dirty, setDirty] = useState(false)
  const router = useRouter()

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
      <h3 className="font-semibold text-sm text-slate-900">Page settings</h3>

      <Field label="Label" help="Internal name only — not shown on the public page.">
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value)
            setDirty(true)
          }}
          className={inputClass}
        />
      </Field>

      <Field label="URL path">
        <input type="text" value={path} disabled className={inputClass + ' font-mono opacity-70 cursor-not-allowed'} />
      </Field>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => {
              setIsPublished(e.target.checked)
              setDirty(true)
            }}
            className="w-4 h-4"
          />
          <span>
            Published <span className="text-slate-500">— page is live at <code className="font-mono text-xs">{path}</code></span>
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showInNav}
            onChange={(e) => {
              setShowInNav(e.target.checked)
              setDirty(true)
            }}
            className="w-4 h-4"
          />
          <span>Show in main navigation</span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <PageHistory pageId={pageId} />

        <button
          type="button"
          disabled={pending || !dirty}
          onClick={() => {
            startTransition(async () => {
              await updatePageMeta(pageId, { label, isPublished, showInNav })
              setDirty(false)
              router.refresh()
            })
          }}
          className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? 'Saving…' : dirty ? 'Save settings' : 'Saved'}
        </button>
      </div>
    </div>
  )
}
