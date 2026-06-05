'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  strength?: number
  className?: string
}

export default function Magnetic({ children, strength = 0.22, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.35 })
  const sy = useSpring(my, { stiffness: 180, damping: 18, mass: 0.35 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      className={`inline-block ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}
