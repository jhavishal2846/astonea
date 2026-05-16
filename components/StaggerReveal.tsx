'use client'

import React, { useRef, ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

interface StaggerRevealProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** Delay before the stagger starts (ms) */
  delay?: number
  /** Stagger interval between children (ms) */
  stagger?: number
  /** Distance children travel upward on entrance */
  y?: number
  /** One-time reveal (default) vs re-animate every time entering view */
  once?: boolean
  as?: keyof React.JSX.IntrinsicElements
}

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger / 1000,
      delayChildren:   delay  / 1000,
    },
  },
})

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number]

const itemVariants = (y: number) => ({
  hidden:  { opacity: 0, y,    filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y:       0,
    filter:  'blur(0px)',
    transition: {
      duration: 0.6,
      ease:     EASE_OUT,
    },
  },
})

export function StaggerReveal({
  children,
  className,
  style,
  delay   = 0,
  stagger = 60,
  y       = 32,
  once    = true,
  as      = 'div',
}: StaggerRevealProps) {
  const ref   = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-80px' })

  const MotionTag = motion[as as 'div'] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants(y)}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants(y)}>{children}</motion.div>}
    </MotionTag>
  )
}

/** Wrap a single element in a scroll-triggered reveal */
export function Reveal({
  children,
  className,
  delay = 0,
  y     = 24,
  once  = true,
}: Omit<StaggerRevealProps, 'stagger' | 'as'>) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={inView
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y,    filter: 'blur(4px)' }
      }
      transition={{ duration: 0.6, delay: delay / 1000, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
