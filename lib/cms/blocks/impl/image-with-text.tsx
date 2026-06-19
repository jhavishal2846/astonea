import { z } from 'zod'
import Image from 'next/image'
import { Reveal } from '@/components/StaggerReveal'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  body: z.string().default(''),
  imageUrl: z.string().default(''),
  imageAlt: z.string().default(''),
  imagePosition: z.enum(['left', 'right']).default('right'),
  background: z.enum(['default', 'surface']).default('default'),
})

type Props = z.infer<typeof schema>

function ImageWithTextBlock({ props }: { props: Props }) {
  const bg = props.background === 'surface' ? 'var(--color-surface)' : 'var(--color-bg)'
  const imgFirst = props.imagePosition === 'left'

  return (
    <section className="py-14 lg:py-16" style={{ background: bg }}>
      <div className="container-wide">
        <div className={`grid gap-12 lg:gap-16 items-center ${imgFirst ? 'lg:grid-cols-[5fr_6fr]' : 'lg:grid-cols-[6fr_5fr]'}`}>
          {imgFirst && props.imageUrl && (
            <Reveal>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={props.imageUrl} alt={props.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Reveal>
          )}
          <Reveal delay={imgFirst ? 80 : 0}>
            <div className="max-w-xl">
              {props.eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  {props.eyebrow}
                </p>
              )}
              {props.heading && (
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance" style={{ color: 'var(--color-ink)' }}>
                  {props.heading}
                </h2>
              )}
              {props.body && (
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  {props.body}
                </p>
              )}
            </div>
          </Reveal>
          {!imgFirst && props.imageUrl && (
            <Reveal delay={80}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image src={props.imageUrl} alt={props.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

export const imageWithTextBlock: BlockDescriptor<Props> = {
  type: 'imageWithText',
  adminLabel: 'Image + text',
  description: 'Two-column layout with an image on one side and prose on the other.',
  iconPath: 'M3 5h8v14H3zM13 5h8v6h-8zM13 13h8v6h-8z',
  defaults: {
    eyebrow: '',
    heading: 'Section heading',
    body: 'One short paragraph that complements the image. Keep it concise — the photo carries the visual weight.',
    imageUrl: '',
    imageAlt: '',
    imagePosition: 'right',
    background: 'default',
  },
  schema,
  fields: [
    { name: 'eyebrow',  label: 'Eyebrow',  widget: 'text' },
    { name: 'heading',  label: 'Heading',  widget: 'text', required: true },
    { name: 'body',     label: 'Body',     widget: 'textarea' },
    { name: 'imageUrl', label: 'Image URL', widget: 'image', help: 'Upload via Documents or paste a /public/... or external https URL.' },
    { name: 'imageAlt', label: 'Image alt text', widget: 'text', help: 'For screen readers and search engines.' },
    {
      name: 'imagePosition',
      label: 'Image position',
      widget: 'select',
      options: [
        { value: 'left',  label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    {
      name: 'background',
      label: 'Background',
      widget: 'select',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface (lighter)' },
      ],
    },
  ],
  translatableFields: ['eyebrow', 'heading', 'body', 'imageAlt'],
  component: ImageWithTextBlock,
}
