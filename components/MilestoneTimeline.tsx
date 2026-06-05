'use client'

import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'

const E = [0.16, 1, 0.3, 1] as const

export type Milestone = { year: string; title: string; events: string[]; icon?: string }
export type Stat = { value: string; label: string }

/* ─── Icons (Lucide-style, stroke = currentColor) ────────────────────────── */

const ICONS: Record<string, React.ReactNode> = {
  building: (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </>
  ),
  hardhat: (
    <>
      <path d="M2 18a1 1 0 0 1-1-1v-2a9 9 0 0 1 9-9h2a9 9 0 0 1 9 9v2a1 1 0 0 1-1 1Z" />
      <path d="M10 6V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" />
      <path d="M4 15v-3a6 6 0 0 1 6-6" />
      <path d="M14 6a6 6 0 0 1 6 6v3" />
    </>
  ),
  flask: (
    <>
      <path d="M10 2v7.31M14 9.3V2M8.5 2h7M5.52 16h12.96" />
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  package: (
    <>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-5.13-1.32a.5.5 0 0 1 0-.97L8.5 10.44A2 2 0 0 0 9.94 9l1.32-5.13a.5.5 0 0 1 .97 0l1.32 5.13A2 2 0 0 0 15 10.44l5.13 1.32a.5.5 0 0 1 0 .97L15 14.06a2 2 0 0 0-1.45 1.44l-1.32 5.13a.5.5 0 0 1-.97 0Z" />
      <path d="M20 3v4M22 5h-4" />
    </>
  ),
  trending: (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3.5" />,
}

function MilestoneIcon({ name }: { name?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
    >
      {(name && ICONS[name]) || ICONS.dot}
    </svg>
  )
}

/* ─── Animated stat value (counter) ──────────────────────────────────────── */

function parseStat(value: string) {
  const m = value.match(/^(\D*?)([\d,]+)(.*)$/)
  if (!m) return null
  return {
    prefix: m[1],
    num: parseInt(m[2].replace(/,/g, ''), 10),
    suffix: m[3],
    hadComma: m[2].includes(','),
  }
}

function StatValue({ value }: { value: string }) {
  const parsed = parseStat(value)
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)

  useEffect(() => {
    if (!parsed || reduce || !inView) return
    const controls = animate(mv, parsed.num, { duration: 1.6, ease: E })
    const unsub = mv.on('change', (v) => {
      if (!ref.current) return
      const n = Math.round(v)
      const disp = parsed.hadComma ? n.toLocaleString() : String(n)
      ref.current.textContent = parsed.prefix + disp + parsed.suffix
    })
    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, reduce, parsed, mv])

  const initialText = !parsed || reduce ? value : `${parsed.prefix}0${parsed.suffix}`

  return (
    <p ref={ref} className="font-display text-3xl font-bold text-white mb-1 tabular-nums">
      {initialText}
    </p>
  )
}

export function MilestoneStats({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ background: 'var(--color-primary)' }}>
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                'py-8 px-6 text-center',
                i < stats.length - 1 ? 'lg:border-r border-white/20' : '',
                i % 2 === 0 ? 'border-r border-white/20 lg:border-r' : '',
                i < 2 ? 'border-b border-white/20 lg:border-b-0' : '',
              ].join(' ')}
            >
              <StatValue value={s.value} />
              <p
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Single milestone row (scroll reveal + icon badge light-up) ─────────── */

function MilestoneRow({
  m,
  index,
  total,
  reduce,
}: {
  m: Milestone
  index: number
  total: number
  reduce: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30% 0px -30% 0px' })
  const isLast = index === total - 1
  const accent = isLast ? 'var(--color-accent)' : 'var(--color-primary)'
  const ringColor = isLast ? 'rgba(232,169,0,0.16)' : 'rgba(0,114,206,0.14)'

  return (
    <div ref={ref} className="relative pl-[68px] sm:pl-24">
      {/* ghost year (editorial depth, static) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -top-8 hidden select-none font-display font-bold leading-none lg:block"
        style={{ fontSize: '8rem', color: accent, opacity: 0.045 }}
      >
        {m.year}
      </span>

      {/* icon badge on the rail */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[28px] top-0 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border sm:left-[34px]"
        initial={{ scale: reduce ? 1 : 0.78 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, ease: E }}
        style={{
          background: inView ? accent : 'var(--color-surface)',
          borderColor: inView ? accent : 'var(--color-border-strong)',
          color: inView ? '#fff' : 'var(--color-ink-subtle)',
          boxShadow: inView ? `0 0 0 6px ${ringColor}` : '0 1px 3px rgba(10,10,20,0.06)',
          transition:
            'background 500ms ease, border-color 500ms ease, color 500ms ease, box-shadow 500ms ease',
        }}
      >
        <MilestoneIcon name={m.icon} />
      </motion.span>

      {/* content block */}
      <motion.div
        initial={{ opacity: 0, x: reduce ? 0 : -24, filter: 'blur(4px)' }}
        animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: E }}
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span
            className="font-mono text-4xl font-bold tracking-tight lg:text-5xl tabular-nums"
            style={{ color: accent }}
          >
            {m.year}
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-ink-subtle)' }}
          >
            {m.title}
          </span>
        </div>

        <div
          className="mt-5 overflow-hidden rounded-2xl border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
        >
          {m.events.map((e, j) => (
            <div
              key={e}
              className="flex items-start gap-3.5 p-5"
              style={{ borderTop: j > 0 ? '1px solid var(--color-border)' : 'none' }}
            >
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {e}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Timeline with scroll-progress spine ────────────────────────────────── */

export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 })

  return (
    <section className="relative py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
      <div className="container-wide">
        <div ref={trackRef} className="relative">
          {/* faint rail */}
          <div
            aria-hidden="true"
            className="absolute left-[28px] top-3 bottom-3 w-px sm:left-[34px]"
            style={{ background: 'var(--color-border-strong)' }}
          />
          {/* blue progress fill */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[28px] top-3 bottom-3 w-[2px] origin-top -translate-x-px sm:left-[34px]"
            style={{
              scaleY: reduce ? 1 : smooth,
              background: 'var(--color-primary)',
              boxShadow: '0 0 12px rgba(0,114,206,0.45)',
            }}
          />

          <div className="space-y-14 lg:space-y-20">
            {milestones.map((m, i) => (
              <MilestoneRow
                key={m.year}
                m={m}
                index={i}
                total={milestones.length}
                reduce={reduce}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
