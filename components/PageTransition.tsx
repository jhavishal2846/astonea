'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const variants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0]  as [number, number, number, number] } },
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  // Admin has its own UX; skip the public-site fade transition.
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="flex flex-col flex-1 min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
