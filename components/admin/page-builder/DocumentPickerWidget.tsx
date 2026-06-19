'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Modal from '@/app/admin/_components/Modal'
import { inputClass, selectClass } from '@/app/admin/_components/Field'
import {
  getDocumentsByIds,
  listDocumentsForPicker,
  type PickerDocument,
} from '@/app/admin/(authed)/pages/_actions'

const ALL = '__all__'

type Props = {
  value: unknown
  onChange: (v: string[]) => void
}

export default function DocumentPickerWidget({ value, onChange }: Props) {
  const ids: string[] = Array.isArray(value)
    ? (value as unknown[]).filter((v): v is string => typeof v === 'string')
    : []

  const [selected, setSelected] = useState<PickerDocument[]>([])
  const [loadingInitial, startLoadInitial] = useTransition()
  const [pickerOpen, setPickerOpen] = useState(false)

  // Resolve the stored IDs into rich PickerDocument rows once on mount and
  // whenever the IDs change due to an outside reset.
  useEffect(() => {
    if (ids.length === 0) {
      setSelected([])
      return
    }
    startLoadInitial(async () => {
      const rows = await getDocumentsByIds(ids)
      setSelected(rows)
    })
  }, [ids.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (next: PickerDocument[]) => {
    setSelected(next)
    onChange(next.map((d) => d.id))
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {loadingInitial && ids.length > 0 && selected.length === 0 && (
          <div className="text-xs text-slate-400">Loading selected documents…</div>
        )}

        {selected.length === 0 && !loadingInitial && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-xs text-slate-500">
            No documents selected yet. Click below to add some.
          </div>
        )}

        {selected.map((doc, i) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <div className="flex flex-col gap-0.5 mr-1">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const next = selected.slice()
                  ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                  apply(next)
                }}
                className="w-5 h-4 text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-30"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={i === selected.length - 1}
                onClick={() => {
                  const next = selected.slice()
                  ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
                  apply(next)
                }}
                className="w-5 h-4 text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-30"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                <span className="truncate">{doc.title}</span>
                {!doc.fileUrl && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium uppercase tracking-wide shrink-0">
                    No file
                  </span>
                )}
                {!doc.isPublished && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium uppercase tracking-wide shrink-0">
                    Draft
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                <span className="font-mono">{doc.category}</span>
                {doc.subcategory ? ` · ${doc.subcategory}` : ''}
                {doc.period ? ` · ${doc.period}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => apply(selected.filter((_, j) => j !== i))}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
      >
        + Add document
      </button>

      <PickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedIds={new Set(selected.map((d) => d.id))}
        onPick={(doc) => {
          if (selected.some((s) => s.id === doc.id)) return
          apply([...selected, doc])
        }}
      />
    </div>
  )
}

function PickerModal({
  open,
  onClose,
  selectedIds,
  onPick,
}: {
  open: boolean
  onClose: () => void
  selectedIds: Set<string>
  onPick: (doc: PickerDocument) => void
}) {
  const [rows, setRows] = useState<PickerDocument[] | null>(null)
  const [loading, startLoading] = useTransition()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>(ALL)
  // Default ON: hide documents without an attached file (they'd render as
  // a non-clickable "Soon" entry on the public site).
  const [hideIncomplete, setHideIncomplete] = useState(true)

  useEffect(() => {
    if (!open) return
    startLoading(async () => {
      const docs = await listDocumentsForPicker({ limit: 500 })
      setRows(docs)
    })
  }, [open])

  const categories = useMemo(() => {
    if (!rows) return []
    return Array.from(new Set(rows.map((r) => r.category))).sort()
  }, [rows])

  const incompleteCount = useMemo(() => {
    if (!rows) return 0
    return rows.filter((r) => !r.fileUrl || !r.isPublished).length
  }, [rows])

  const filtered = useMemo(() => {
    if (!rows) return []
    let out = rows
    if (hideIncomplete) {
      out = out.filter((r) => Boolean(r.fileUrl) && r.isPublished)
    }
    if (category !== ALL) out = out.filter((r) => r.category === category)
    if (query) {
      const q = query.toLowerCase()
      out = out.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.period?.toLowerCase().includes(q) ?? false),
      )
    }
    return out.slice(0, 200) // visible cap so the modal stays snappy
  }, [rows, category, query, hideIncomplete])

  return (
    <Modal open={open} onClose={onClose} title="Pick documents to include" size="xl">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search title or period…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className={inputClass + ' max-w-sm'}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass + ' max-w-xs'}
        >
          <option value={ALL}>All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-600 select-none cursor-pointer">
          <input
            type="checkbox"
            checked={hideIncomplete}
            onChange={(e) => setHideIncomplete(e.target.checked)}
            className="w-3.5 h-3.5"
          />
          <span>
            Only show documents with a file
            {incompleteCount > 0 && (
              <span className="ml-1 text-slate-400">({incompleteCount} hidden)</span>
            )}
          </span>
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
          {loading && !rows && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading documents…</div>
          )}
          {rows && filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No documents match. Try clearing the filters.
            </div>
          )}
          {filtered.map((doc) => {
            const already = selectedIds.has(doc.id)
            const incomplete = !doc.fileUrl || !doc.isPublished
            return (
              <button
                key={doc.id}
                type="button"
                disabled={already}
                onClick={() => {
                  onPick(doc)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${
                  already
                    ? 'opacity-50 cursor-not-allowed bg-slate-50'
                    : 'hover:bg-primary/5'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                    <span className="truncate">{doc.title}</span>
                    {!doc.fileUrl && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium uppercase tracking-wide shrink-0">
                        No file
                      </span>
                    )}
                    {!doc.isPublished && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium uppercase tracking-wide shrink-0">
                        Draft
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    <span className="font-mono">{doc.category}</span>
                    {doc.subcategory ? ` · ${doc.subcategory}` : ''}
                    {doc.period ? ` · ${doc.period}` : ''}
                    {incomplete && ' · would render as "Soon" on the public site'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">
                  {already ? 'Added' : '+ Add'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </Modal>
  )
}
