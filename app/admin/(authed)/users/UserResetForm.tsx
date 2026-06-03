'use client'

import { useActionState, useEffect, useState } from 'react'
import { inputClass } from '@/app/admin/_components/Field'
import { resetPassword, type UserState } from './_actions'
import { useToast } from '@/app/admin/_components/Toast'

const initial: UserState = {}

export default function UserResetForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const bound = resetPassword.bind(null, userId)
  const [state, formAction, pending] = useActionState(bound, initial)
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      toast.success('Password updated')
      setOpen(false)
    } else if (state.error) {
      toast.error('Could not reset password', state.error)
    }
  }, [state])

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-semibold text-primary hover:underline">
        Reset password
      </button>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="New password"
        autoComplete="new-password"
        className={`${inputClass} h-8 py-1 text-xs w-44`}
      />
      <button
        type="submit"
        disabled={pending}
        className="px-2.5 py-1 rounded-md bg-primary text-white text-xs font-semibold disabled:opacity-60 hover:bg-primary-dark transition-colors"
      >
        {pending ? '…' : 'Save'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-slate-500 hover:text-slate-700"
      >
        Cancel
      </button>
    </form>
  )
}
