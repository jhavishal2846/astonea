import { z } from 'zod'
import { PageHeader } from '@/components/PageHeader'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  eyebrow: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  image: z.string().nullable().optional(),
  breadcrumb: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
})

type Props = z.infer<typeof schema>

function HeroBlock({ props }: { props: Props }) {
  return (
    <PageHeader
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      breadcrumb={props.breadcrumb}
      image={props.image ?? undefined}
    />
  )
}

export const heroBlock: BlockDescriptor<Props> = {
  type: 'hero',
  adminLabel: 'Hero',
  description: 'Top-of-page header with eyebrow, title, description and breadcrumbs over a hero photo.',
  iconPath: 'M3 5h18v6H3zM3 13h18v6H3z',
  defaults: {
    eyebrow: 'Eyebrow',
    title: 'Page title',
    description: 'One-sentence description of what this page is about.',
    image: null,
    breadcrumb: [],
  },
  schema,
  fields: [
    { name: 'eyebrow',     label: 'Eyebrow',     widget: 'text',     help: 'Small uppercase line above the title (e.g. "Investor Relations").' },
    { name: 'title',       label: 'Title',       widget: 'text',     required: true },
    { name: 'description', label: 'Description', widget: 'textarea', help: 'One short paragraph shown under the title.' },
    { name: 'image',       label: 'Background image URL', widget: 'image', help: 'Optional. Leave blank to auto-pick from breadcrumb path.' },
    {
      name: 'breadcrumb',
      label: 'Breadcrumb',
      widget: 'array',
      help: 'Trail of parent pages shown at the top of the hero.',
      rowFields: [
        { name: 'label', label: 'Label', widget: 'text', required: true },
        { name: 'href',  label: 'Href',  widget: 'text', required: true },
      ],
      rowTranslatableFields: ['label'],
    },
  ],
  translatableFields: ['eyebrow', 'title', 'description', 'breadcrumb.*.label'],
  component: HeroBlock,
}
