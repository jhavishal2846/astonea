'use client'

import { useActionState } from 'react'
import type { AdminTicketState } from '../_actions'

export default function TagForm({
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
          <input name="slug" required placeholder="vip" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Label *</label>
          <input name="label" required placeholder="VIP" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color (hex)</label>
          <input name="color" placeholder="#ef4444" pattern="^#[0-9a-fA-F]{6}$" className={inputCls} />
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
        {pending ? 'Saving…' : 'Save tag'}
      </button>
    </form>
  )
}
