import { z } from 'zod'
import { Reveal } from '@/components/StaggerReveal'
import { sanitizeRichText } from '@/lib/cms/sanitize-html'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  body: z.string().default(''),
  background: z.enum(['default', 'surface', 'dark']).default('default'),
})

type Props = z.infer<typeof schema>

const BG_STYLES: Record<Props['background'], { bg: string; ink: string; muted: string; primary: string }> = {
  default: { bg: 'var(--color-bg)',        ink: 'var(--color-ink)', muted: 'var(--color-ink-muted)', primary: 'var(--color-primary)' },
  surface: { bg: 'var(--color-surface)',   ink: 'var(--color-ink)', muted: 'var(--color-ink-muted)', primary: 'var(--color-primary)' },
  dark:    { bg: 'var(--color-slate-950)', ink: '#fff',             muted: 'rgba(255,255,255,0.78)', primary: 'var(--color-primary-light)' },
}

function TextSectionBlock({ props }: { props: Props }) {
  const s = BG_STYLES[props.background]
  const safeBody = sanitizeRichText(props.body)

  return (
    <section className="py-14 lg:py-16" style={{ background: s.bg, color: s.ink }}>
      <div className="container-wide">
        <div className="max-w-3xl">
          {props.eyebrow && (
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: s.primary }}>
                {props.eyebrow}
              </p>
            </Reveal>
          )}
          {props.heading && (
            <Reveal delay={40}>
              <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-6 text-balance">
                {props.heading}
              </h2>
            </Reveal>
          )}
          {safeBody && (
            <Reveal delay={80}>
              <div
                className="rich-text-body"
                style={{ color: s.muted }}
                dangerouslySetInnerHTML={{ __html: safeBody }}
              />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

export const textSectionBlock: BlockDescriptor<Props> = {
  type: 'textSection',
  adminLabel: 'Text section',
  description: 'Headed prose section with eyebrow, heading and a rich-text body — bold, italic, lists, colour, font-size, links.',
  iconPath: 'M4 6h16M4 10h16M4 14h10M4 18h12',
  defaults: {
    eyebrow: '',
    heading: 'Section heading',
    body: '<p>Write a short paragraph here. Use the toolbar to add <strong>bold</strong>, <em>italic</em>, colour, font size, links or lists.</p>',
    background: 'default',
  },
  schema,
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', widget: 'text',     help: 'Small uppercase tag above the heading.' },
    { name: 'heading', label: 'Heading', widget: 'text',     required: true },
    { name: 'body',    label: 'Body',    widget: 'richtext' },
    {
      name: 'background',
      label: 'Background',
      widget: 'select',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface (lighter)' },
        { value: 'dark',    label: 'Dark' },
      ],
    },
  ],
  translatableFields: ['eyebrow', 'heading', 'body'],
  component: TextSectionBlock,
}
