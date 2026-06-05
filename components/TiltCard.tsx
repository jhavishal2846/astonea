'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  maxTilt?: number
}

export default function TiltCard({ children, className, maxTilt = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20, mass: 0.4 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20, mass: 0.4 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 2 * maxTilt)
    rx.set(-(py - 0.5) * 2 * maxTilt)
  }
  function reset() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={{ perspective: '1200px' }}
      className={className}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
