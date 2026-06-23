'use client'

import { useState } from 'react'
import Modal from '@/app/admin/_components/Modal'
import ProductForm, { type FormLanguage } from './ProductForm'
import { createProduct } from './_actions'
import { IconPlus } from '@/app/admin/_icons'
import { CATEGORY_SCHEMAS, type CategorySlug } from '@/lib/products/category-schemas'

export default function NewProductTrigger({
  presetCategory,
  languages,
}: {
  presetCategory?: CategorySlug
  languages: FormLanguage[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all"
      >
        <IconPlus className="w-4 h-4" /> New product
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New product"
        description="Pick a category — the form below will adapt to its attribute schema."
        size="xl"
      >
        <ProductForm
          action={createProduct}
          languages={languages}
          initialValue={{
            categorySlug: presetCategory ?? (Object.keys(CATEGORY_SCHEMAS)[0] as CategorySlug),
            status: 'draft',
            displayOrder: 0,
          }}
          submitLabel="Create product"
          successMessage="Product created"
          hideCancel
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  )
}
