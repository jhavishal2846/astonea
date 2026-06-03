'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Field, inputClass } from '@/app/admin/_components/Field'
import type { UserState } from './_actions'
import { useToast } from '@/app/admin/_components/Toast'

const initial: UserState = {}

export default function NewAdminForm({
  action,
  onSuccess,
}: {
  action: (prev: UserState, formData: FormData) => Promise<UserState>
  onSuccess?: () => void
}) {
  const [state, formAction, pending] = useActionState(action, initial)
  const formRef = useRef<HTMLFormElement>(null)
  const toast = useToast()

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      toast.success('Admin added')
      onSuccess?.()
    } else if (state.error) {
      toast.error('Could not add admin', state.error)
    }
  }, [state, onSuccess, toast])

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Field label="Name" htmlFor="new-admin-name">
        <input id="new-admin-name" name="name" autoComplete="off" className={inputClass} placeholder="Optional" />
      </Field>
      <Field label="Email" required htmlFor="new-admin-email">
        <input id="new-admin-email" name="email" type="email" required autoComplete="off" className={inputClass} placeholder="name@example.com" />
      </Field>
      <Field label="Password" required help="Min 8 characters." htmlFor="new-admin-pw">
        <input id="new-admin-pw" name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
      </Field>
      <div className="sm:col-span-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60"
        >
          {pending ? 'Adding…' : 'Add admin'}
        </button>
      </div>
    </form>
  )
}
