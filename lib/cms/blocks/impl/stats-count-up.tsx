import { z } from 'zod'
import CountUp from '@/components/CountUp'
import { Reveal } from '@/components/StaggerReveal'
import type { BlockDescriptor } from '../types'

const schema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  stats: z
    .array(
      z.object({
        value: z.number().default(0),
        suffix: z.string().default(''),
        label: z.string().default(''),
        sublabel: z.string().default(''),
      }),
    )
    .default([]),
})

type Props = z.infer<typeof schema>

function StatsCountUpBlock({ props }: { props: Props }) {
  if (props.stats.length === 0) return null
  return (
    <section className="py-14 lg:py-16" style={{ background: 'var(--color-surface)' }}>
      <div className="container-wide">
        {(props.eyebrow || props.heading) && (
          <div className="max-w-3xl mb-12">
            {props.eyebrow && (
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                  {props.eyebrow}
                </p>
              </Reveal>
            )}
            {props.heading && (
              <Reveal delay={40}>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug text-balance" style={{ color: 'var(--color-ink)' }}>
                  {props.heading}
                </h2>
              </Reveal>
            )}
          </div>
        )}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(props.stats.length, 4)}, minmax(0, 1fr))` }}
        >
          {props.stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="space-y-2">
                <p
                  className="font-display text-4xl lg:text-5xl font-bold tabular-nums tracking-tight"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{s.label}</p>
                {s.sublabel && <p className="text-xs" style={{ color: 'var(--color-ink-subtle)' }}>{s.sublabel}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export const statsCountUpBlock: BlockDescriptor<Props> = {
  type: 'statsCountUp',
  adminLabel: 'Stats (counters)',
  description: 'Grid of large animated counter stats — perfect for trust signals like "2000+ clients".',
  iconPath: 'M3 3v18h18M7 13l3-3 4 4 6-6',
  defaults: {
    eyebrow: '',
    heading: '',
    stats: [
      { value: 2000, suffix: '+', label: 'Brands served', sublabel: 'Pharma & cosmetics' },
      { value: 1500, suffix: '+', label: 'Product approvals', sublabel: 'Formulations cleared' },
      { value: 9,    suffix: '+', label: 'Years of excellence', sublabel: 'Founded 2017' },
    ],
  },
  schema,
  fields: [
    { name: 'eyebrow', label: 'Eyebrow', widget: 'text' },
    { name: 'heading', label: 'Heading', widget: 'text' },
    {
      name: 'stats',
      label: 'Stats',
      widget: 'array',
      rowFields: [
        { name: 'value',    label: 'Number',   widget: 'number',  required: true },
        { name: 'suffix',   label: 'Suffix',   widget: 'text',    help: 'e.g. "+", "%", "K".' },
        { name: 'label',    label: 'Label',    widget: 'text',    required: true },
        { name: 'sublabel', label: 'Sublabel', widget: 'text' },
      ],
      rowTranslatableFields: ['label', 'sublabel', 'suffix'],
    },
  ],
  translatableFields: ['eyebrow', 'heading', 'stats.*.label', 'stats.*.sublabel', 'stats.*.suffix'],
  component: StatsCountUpBlock,
}
