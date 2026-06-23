'use client'

import { useState, useTransition } from 'react'
import Modal from '@/app/admin/_components/Modal'
import { useToast } from '@/app/admin/_components/Toast'
import CategoryForm, { type CategoryDraft } from './CategoryForm'
import {
  deleteCategory,
  toggleCategoryActive,
  updateCategory,
  type CategoryState,
} from './_actions'
import { IconEdit, IconTrash } from '@/app/admin/_icons'

export default function CategoryRow({
  row,
  productCount,
}: {
  row: CategoryDraft & { id: string }
  productCount: number
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [pending, start] = useTransition()
  const toast = useToast()

  const boundUpdate = async (prev: CategoryState, formData: FormData) => updateCategory(row.id, prev, formData)

  const onToggle = (next: boolean) => {
    start(async () => {
      try {
        await toggleCategoryActive(row.id, next)
        toast.push({ kind: next ? 'success' : 'info', title: next ? 'Category activated' : 'Category deactivated' })
      } catch (e) {
        toast.error('Could not change status', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const onDelete = () => {
    start(async () => {
      try {
        const res = await deleteCategory(row.id)
        if (res?.error) toast.error('Could not delete', res.error)
        else toast.success('Category deleted')
      } catch (e) {
        toast.error('Could not delete', e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setConfirming(false)
      }
    })
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{row.label}</h3>
            <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
              /products/{row.slug}
            </span>
            {!row.isActive && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                Inactive
              </span>
            )}
          </div>
          {row.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{row.description}</p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            {productCount} product{productCount === 1 ? '' : 's'} · order {row.displayOrder ?? 0}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            disabled={pending}
            onClick={() => onToggle(!row.isActive)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors disabled:opacity-50 ${
              row.isActive
                ? 'text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                : 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Edit"
            className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
          >
            <IconEdit className="w-3.5 h-3.5" />
          </button>
          {confirming ? (
            <div className="flex items-center gap-1 pl-2 ml-1 border-l border-slate-200">
              <span className="text-[11px] text-rose-700">Delete?</span>
              <button
                type="button"
                disabled={pending}
                onClick={onDelete}
                className="text-[11px] font-semibold text-rose-700 hover:underline disabled:opacity-50"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[11px] text-slate-500 hover:underline"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={productCount > 0}
              title={productCount > 0 ? 'Remove all products from this category first' : 'Delete category'}
              className="p-1.5 rounded-md text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title={`Edit category — ${row.label}`}
        size="lg"
      >
        <CategoryForm
          action={boundUpdate}
          initialValue={row}
          submitLabel="Save changes"
          successMessage="Category updated"
          onSuccess={() => setEditing(false)}
        />
      </Modal>
    </>
  )
}
