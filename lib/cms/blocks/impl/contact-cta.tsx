import { z } from 'zod'
import Link from '@/components/LocaleLink'
import { Reveal } from '@/components/StaggerReveal'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  heading: z.string().default(''),
  subheading: z.string().default(''),
  primary: z
    .object({
      label: z.string().default(''),
      href: z.string().default(''),
    })
    .default({ label: '', href: '' }),
  secondary: z
    .object({
      label: z.string().default(''),
      href: z.string().default(''),
    })
    .default({ label: '', href: '' }),
  tone: z.enum(['light', 'dark']).default('light'),
})

type Props = z.infer<typeof schema>

function ContactCtaBlock({ props }: { props: Props }) {
  const dark = props.tone === 'dark'
  return (
    <section
      className="py-20"
      style={{
        background: dark ? 'var(--color-slate-950)' : 'var(--color-surface)',
        color: dark ? '#fff' : 'var(--color-ink)',
      }}
    >
      <div className="container-wide flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <Reveal>
          <div>
            {props.heading && (
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2 text-balance">
                {props.heading}
              </h2>
            )}
            {props.subheading && (
              <p
                className="text-sm max-w-xl"
                style={{ color: dark ? 'rgba(255,255,255,0.72)' : 'var(--color-ink-muted)' }}
              >
                {props.subheading}
              </p>
            )}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-3">
            {props.primary.label && props.primary.href && (
              <Link
                href={props.primary.href}
                className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm font-bold transition-colors hover:opacity-90"
                style={{ background: 'var(--color-primary)' }}
              >
                {props.primary.label}
              </Link>
            )}
            {props.secondary.label && props.secondary.href && (
              <Link
                href={props.secondary.href}
                className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold border transition-colors hover:bg-blue-50"
                style={{
                  borderColor: dark ? 'rgba(255,255,255,0.4)' : 'var(--color-primary)',
                  color: dark ? '#fff' : 'var(--color-primary)',
                }}
              >
                {props.secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export const contactCtaBlock: BlockDescriptor<Props> = {
  type: 'contactCta',
  adminLabel: 'CTA banner',
  description: 'Call-to-action banner with a heading and up to two buttons.',
  iconPath: 'M3 12h18M21 12l-6-6M21 12l-6 6',
  defaults: {
    heading: 'Ready to get started?',
    subheading: 'Talk to our team about partnerships, manufacturing or compliance.',
    primary:   { label: 'Contact us',         href: '/contact-us' },
    secondary: { label: 'View certifications', href: '/certifications' },
    tone: 'light',
  },
  schema,
  fields: [
    { name: 'heading',          label: 'Heading',          widget: 'text', required: true },
    { name: 'subheading',       label: 'Subheading',       widget: 'textarea' },
    { name: 'primary.label',    label: 'Primary button label', widget: 'text' },
    { name: 'primary.href',     label: 'Primary button href',  widget: 'text' },
    { name: 'secondary.label',  label: 'Secondary button label', widget: 'text' },
    { name: 'secondary.href',   label: 'Secondary button href',  widget: 'text' },
    {
      name: 'tone',
      label: 'Tone',
      widget: 'select',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark',  label: 'Dark' },
      ],
    },
  ],
  translatableFields: ['heading', 'subheading', 'primary.label', 'secondary.label'],
  component: ContactCtaBlock,
}
