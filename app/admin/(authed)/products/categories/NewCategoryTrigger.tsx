'use client'

import { useState } from 'react'
import Modal from '@/app/admin/_components/Modal'
import { IconPlus } from '@/app/admin/_icons'
import CategoryForm from './CategoryForm'
import { createCategory } from './_actions'

export default function NewCategoryTrigger() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
      >
        <IconPlus className="w-4 h-4" /> New category
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New product category"
        description="Adds a new bucket like /products/<slug>. The attribute schema for the category is still defined in code."
        size="lg"
      >
        <CategoryForm
          action={createCategory}
          initialValue={{ isActive: true, displayOrder: 0 }}
          submitLabel="Create category"
          successMessage="Category created"
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  )
}
