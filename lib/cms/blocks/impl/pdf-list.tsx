import { z } from 'zod'
import { Reveal } from '@/components/StaggerReveal'
import { DocumentList } from '@/components/DocumentList'
import {
  listPublishedByCategory,
  listByCategoryByDate,
  listPublishedByIds,
  groupBySubcategory,
} from '@/lib/cms/queries'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '@/lib/cms/categories'
import type { DocumentCategory } from '@/lib/db/schema'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  mode: z.enum(['category', 'manual']).default('category'),
  // Category mode
  category: z.string().default('annual_report'),
  subcategory: z.string().default(''),
  sortBy: z.enum(['displayOrder', 'eventDate']).default('displayOrder'),
  // Manual mode
  documentIds: z.array(z.string()).default([]),
  // Common
  emptyMessage: z.string().default(''),
})

type Props = z.infer<typeof schema>

async function PdfListBlock({ props }: { props: Props }) {
  let items
  if (props.mode === 'manual') {
    items = await listPublishedByIds(props.documentIds)
  } else {
    const cat = props.category as DocumentCategory
    const rows = props.sortBy === 'eventDate'
      ? await listByCategoryByDate(cat)
      : await listPublishedByCategory(cat)
    items = props.subcategory
      ? groupBySubcategory(rows)[props.subcategory] ?? []
      : rows
  }

  return (
    <section className="py-14 lg:py-16" style={{ background: 'var(--color-bg)' }}>
      <div className="container-wide">
        <div className="max-w-3xl">
          {props.eyebrow && (
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                {props.eyebrow}
              </p>
            </Reveal>
          )}
          {props.heading && (
            <Reveal delay={40}>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-8 text-balance" style={{ color: 'var(--color-ink)' }}>
                {props.heading}
              </h2>
            </Reveal>
          )}
          <DocumentList
            items={items}
            emptyMessage={props.emptyMessage || 'Nothing published yet.'}
          />
        </div>
      </div>
    </section>
  )
}

export const pdfListBlock: BlockDescriptor<Props> = {
  type: 'pdfList',
  adminLabel: 'PDF list',
  description: 'A list of documents — either auto-pulled from a category, or hand-picked.',
  iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  defaults: {
    eyebrow: '',
    heading: '',
    mode: 'category',
    category: 'annual_report',
    subcategory: '',
    sortBy: 'displayOrder',
    documentIds: [],
    emptyMessage: '',
  },
  schema,
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', widget: 'text' },
    { name: 'heading', label: 'Heading', widget: 'text' },
    {
      name: 'mode',
      label: 'How to pick documents',
      widget: 'select',
      options: [
        { value: 'category', label: 'Auto: all documents in a category' },
        { value: 'manual',   label: 'Hand-pick specific documents' },
      ],
      help: 'Auto stays in sync as you add/remove documents in that category. Hand-pick locks the list to exactly what you choose.',
    },
    {
      name: 'category',
      label: 'Document category',
      widget: 'select',
      required: true,
      options: ALL_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
      showWhen: { field: 'mode', equals: 'category' },
    },
    {
      name: 'subcategory',
      label: 'Subcategory filter',
      widget: 'text',
      help: 'Leave blank to show all subcategories.',
      showWhen: { field: 'mode', equals: 'category' },
    },
    {
      name: 'sortBy',
      label: 'Sort by',
      widget: 'select',
      options: [
        { value: 'displayOrder', label: 'Display order' },
        { value: 'eventDate',    label: 'Event date (newest first)' },
      ],
      showWhen: { field: 'mode', equals: 'category' },
    },
    {
      name: 'documentIds',
      label: 'Documents',
      widget: 'documents',
      help: 'Add specific documents to show. Drag-reorder them to set the display order.',
      showWhen: { field: 'mode', equals: 'manual' },
    },
    { name: 'emptyMessage', label: 'Empty-state message', widget: 'text' },
  ],
  translatableFields: ['eyebrow', 'heading', 'emptyMessage'],
  component: PdfListBlock as unknown as React.ComponentType<{ props: Props }>,
}
