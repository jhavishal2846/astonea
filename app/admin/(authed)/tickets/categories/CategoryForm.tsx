'use client'

import { useActionState } from 'react'
import type { AdminTicketState } from '../_actions'

export default function CategoryForm({
  action,
}: {
  action: (state: AdminTicketState, formData: FormData) => Promise<AdminTicketState>
}) {
  const [state, formAction, pending] = useActionState<AdminTicketState, FormData>(action, {})
  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10'

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Slug *</label>
          <input name="slug" required placeholder="general-enquiry" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Name (English) *</label>
          <input name="name" required placeholder="General Enquiry" className={inputCls} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">SLA hours</label>
          <input name="slaHours" type="number" min="0" placeholder="48" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sort order</label>
          <input name="sortOrder" type="number" defaultValue="0" className={inputCls} />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700 mb-2">
            <input type="checkbox" name="isActive" defaultChecked className="accent-primary" />
            Active
          </label>
        </div>
      </div>
      {state.error && (
        <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">{state.error}</div>
      )}
      {state.ok && (
        <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">Saved.</div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save category'}
      </button>
    </form>
  )
}
