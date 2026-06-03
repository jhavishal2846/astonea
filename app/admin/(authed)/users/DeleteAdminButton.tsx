'use client'

import { useState, useTransition } from 'react'
import { deleteAdmin } from './_actions'
import { IconTrash } from '@/app/admin/_icons'
import { useToast } from '@/app/admin/_components/Toast'

export default function DeleteAdminButton({ id, email }: { id: string; email: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, start] = useTransition()
  const toast = useToast()

  const onDelete = () => {
    start(async () => {
      try {
        await deleteAdmin(id)
        toast.success('Admin removed', email)
      } catch (e) {
        toast.error('Could not remove admin', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1 px-2 border-l border-slate-200 ml-1">
        <span className="text-xs text-rose-700">Remove?</span>
        <button
          type="button"
          disabled={pending}
          onClick={onDelete}
          className="text-xs font-semibold text-rose-700 hover:underline disabled:opacity-50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-slate-500 hover:underline"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      title="Remove admin"
      className="p-2 rounded-md text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
    >
      <IconTrash className="w-4 h-4" />
    </button>
  )
}
