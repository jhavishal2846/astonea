'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion'

const E = [0.16, 1, 0.3, 1] as const

export default function CountUp({
  to,
  suffix = '',
  className,
  style,
}: {
  to: number
  suffix?: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)

  useEffect(() => {
    if (reduce || !inView) return
    const controls = animate(mv, to, { duration: 1.4, ease: E })
    const unsub = mv.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, reduce, to, suffix, mv])

  return (
    <span ref={ref} className={className} style={style}>
      {reduce ? `${to}${suffix}` : `0${suffix}`}
    </span>
  )
}
