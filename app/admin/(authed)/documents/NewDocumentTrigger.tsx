'use client'

import { useState } from 'react'
import DocumentForm from './DocumentForm'
import Modal from '@/app/admin/_components/Modal'
import { createDocument } from './_actions'
import type { DocumentCategory, GroupCompany } from '@/lib/db/schema'
import { IconPlus } from '@/app/admin/_icons'

export default function NewDocumentTrigger({
  groupCompanies,
  presetCategory,
  existingSubcategoriesByCategory,
}: {
  groupCompanies: Pick<GroupCompany, 'id' | 'name'>[]
  presetCategory?: DocumentCategory
  existingSubcategoriesByCategory?: Partial<Record<DocumentCategory, string[]>>
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
      >
        <IconPlus className="w-4 h-4" /> New document
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New document"
        description="Upload a PDF or link to an existing file."
        size="xl"
      >
        <DocumentForm
          action={createDocument}
          initialValue={{ category: presetCategory, isPublished: true, displayOrder: 0 }}
          groupCompanies={groupCompanies}
          existingSubcategoriesByCategory={existingSubcategoriesByCategory}
          submitLabel="Create document"
          successMessage="Document created"
          hideCancel
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  )
}
