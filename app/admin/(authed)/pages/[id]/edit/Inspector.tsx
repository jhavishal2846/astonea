'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Field } from '@/app/admin/_components/Field'
import {
  ArrayWidget,
  FieldWidget,
  getByPath,
  setByPath,
} from '@/components/admin/page-builder/BlockFields'
import { usePageBuilder } from './PageBuilderContext'
import PageSettings from './PageSettings'
import type { FieldDescriptor } from '@/lib/cms/blocks/types'

const SAVE_DEBOUNCE_MS = 600

/**
 * In translation mode, only fields whose name appears in the block's
 * translatableFields list are editable. Wildcard paths like `breadcrumb.*.label`
 * mean the array itself (`breadcrumb`) is editable but only its translatable
 * row fields can be changed — handled by the ArrayWidget downstream.
 */
function isFieldTranslatable(field: FieldDescriptor, translatableFields: string[]): boolean {
  for (const tf of translatableFields) {
    if (tf === field.name) return true
    if (tf.startsWith(`${field.name}.`)) return true
  }
  return false
}

export default function Inspector({
  pageSettings,
}: {
  pageSettings: {
    pageId: string
    initialLabel: string
    initialPublished: boolean
    initialShowInNav: boolean
    path: string
  }
}) {
  const {
    blocks,
    blockTypes,
    selectedId,
    setSelected,
    saveProps,
    patchLocalProps,
    isTranslationMode,
    currentLocale,
  } = usePageBuilder()
  const selected = selectedId ? blocks.find((b) => b.id === selectedId) : null
  const typeMeta = selected ? blockTypes.find((t) => t.type === selected.blockType) : null

  // Local working copy of the selected block's props. Resets whenever we
  // switch to a different block, but stays sticky while the same block is
  // selected (so debounced saves work).
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  useEffect(() => {
    if (selected) setDraft(selected.props)
  }, [selectedId, selected])

  const visibleFields = useMemo(() => {
    if (!typeMeta) return []
    if (!isTranslationMode) return typeMeta.fields
    // Translation mode: only show fields with translatable content.
    return typeMeta.fields.filter((f) => isFieldTranslatable(f, typeMeta.translatableFields))
  }, [typeMeta, isTranslationMode])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queueSave = (next: Record<string, unknown>) => {
    if (!selected) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      void saveProps(selected.id, next)
    }, SAVE_DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
        saveTimer.current = null
      }
    }
  }, [])

  const apply = (path: string, value: unknown) => {
    if (!selected) return
    const next = setByPath(draft, path, value)
    setDraft(next)
    patchLocalProps(selected.id, next)
    queueSave(next)
  }

  if (!selected || !typeMeta) {
    if (isTranslationMode) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <p className="font-semibold mb-1">Translation mode · {currentLocale.toUpperCase()}</p>
            <p>
              Click a block in the canvas to translate its text. Only translatable fields
              are editable here — structural changes happen in the base locale.
            </p>
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <PageSettings {...pageSettings} />
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
          <p className="mb-1">Click any block in the canvas to edit it inline.</p>
          <p>Hover between blocks to insert a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            {isTranslationMode
              ? `Translating · ${currentLocale.toUpperCase()}`
              : 'Editing block'}
          </p>
          <p className="text-sm font-semibold text-slate-900 truncate">{typeMeta.adminLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-xs text-slate-500 hover:text-slate-700"
          title="Deselect"
        >
          Done
        </button>
      </div>

      <div className="px-4 py-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
        {isTranslationMode && visibleFields.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
            This block has no translatable fields — nothing to translate here.
          </div>
        )}

        {visibleFields.map((f) => {
          // Conditional visibility (showWhen) still applies in both modes.
          if (f.showWhen) {
            const other = getByPath(draft, f.showWhen.field)
            if (other !== f.showWhen.equals) return null
          }

          // Arrays in translation mode get a filtered descriptor — only the
          // row fields listed in rowTranslatableFields stay editable.
          if (isTranslationMode && f.widget === 'array' && f.rowFields) {
            const allowedRowFieldNames = new Set(f.rowTranslatableFields ?? [])
            const filteredRowFields = f.rowFields.filter((rf) => allowedRowFieldNames.has(rf.name))
            if (filteredRowFields.length === 0) return null
            const fForTrans: FieldDescriptor = { ...f, rowFields: filteredRowFields }
            return (
              <Field key={f.name} label={f.label} help={f.help}>
                <ArrayWidget
                  field={fForTrans}
                  value={getByPath(draft, f.name)}
                  onChange={(v) => apply(f.name, v)}
                />
              </Field>
            )
          }

          return (
            <Field key={f.name} label={f.label} required={f.required && !isTranslationMode} help={f.help}>
              {f.widget === 'array' ? (
                <ArrayWidget
                  field={f}
                  value={getByPath(draft, f.name)}
                  onChange={(v) => apply(f.name, v)}
                />
              ) : (
                <FieldWidget
                  descriptor={f}
                  value={getByPath(draft, f.name)}
                  onChange={(v) => apply(f.name, v)}
                />
              )}
            </Field>
          )
        })}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500">
        {isTranslationMode
          ? `Translation auto-saves to the ${currentLocale.toUpperCase()} version. Switch to the base tab to change structure.`
          : 'Changes save automatically.'}
      </div>
    </div>
  )
}
