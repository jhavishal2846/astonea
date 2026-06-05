'use client'

import { useState } from 'react'
import NewCompanyForm from './NewCompanyForm'
import Modal from '@/app/admin/_components/Modal'
import type { CompanyState } from './_actions'
import { IconPlus } from '@/app/admin/_icons'

export default function NewCompanyTrigger({
  action,
}: {
  action: (prev: CompanyState, formData: FormData) => Promise<CompanyState>
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
      >
        <IconPlus className="w-4 h-4" /> New entity
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a new entity"
        description="Create a group company, subsidiary, associate, or non-profit."
        size="lg"
      >
        <NewCompanyForm action={action} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}
