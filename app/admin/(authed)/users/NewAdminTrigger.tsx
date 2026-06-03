'use client'

import { useState } from 'react'
import NewAdminForm from './NewAdminForm'
import Modal from '@/app/admin/_components/Modal'
import type { UserState } from './_actions'
import { IconPlus } from '@/app/admin/_icons'

export default function NewAdminTrigger({
  action,
}: {
  action: (prev: UserState, formData: FormData) => Promise<UserState>
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
      >
        <IconPlus className="w-4 h-4" /> New admin
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a new admin"
        description="They will be able to sign in to /admin and manage all content."
        size="md"
      >
        <NewAdminForm action={action} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}
