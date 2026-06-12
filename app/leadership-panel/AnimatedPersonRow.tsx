'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

export type Person = {
  name: string
  title: string
  bio: string
  img?: string
}

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number]

function PortraitFrame({ img, name }: { img?: string; name: string }) {
  const initial = name.split(' ').slice(-1)[0][0]
  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-shadow duration-500 hover:shadow-xl">
      {img ? (
        <Image
          src={img}
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 1024px) 220px, 60vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display text-6xl font-bold"
          style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}
          aria-label={`Portrait placeholder for ${name}`}
        >
          {initial}
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(180deg, transparent 60%, rgba(10,10,20,0.18) 100%)',
        }}
      />
    </div>
  )
}

export function AnimatedPersonRow({ person, reverse }: { person: Person; reverse: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const imageOffset = reverse ? 80 : -80
  const textOffset = reverse ? -60 : 60

  return (
    <motion.article
      ref={ref}
      className={`flex flex-col items-center gap-6 lg:items-start lg:gap-10 ${
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      <motion.div
        className="w-full max-w-55 shrink-0"
        initial={{ opacity: 0, x: imageOffset, scale: 0.92, filter: 'blur(6px)' }}
        animate={
          inView
            ? { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, x: imageOffset, scale: 0.92, filter: 'blur(6px)' }
        }
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <PortraitFrame img={person.img} name={person.name} />
      </motion.div>

      <motion.div
        className={`flex flex-1 flex-col ${reverse ? 'lg:text-right' : 'lg:text-left'}`}
        initial={{ opacity: 0, x: textOffset, filter: 'blur(4px)' }}
        animate={
          inView
            ? { opacity: 1, x: 0, filter: 'blur(0px)' }
            : { opacity: 0, x: textOffset, filter: 'blur(4px)' }
        }
        transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
      >
        <motion.h3
          className="font-display text-lg font-semibold leading-snug"
          style={{ color: 'var(--color-ink)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT }}
        >
          {person.name}
        </motion.h3>
        <motion.p
          className="mt-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-primary)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
        >
          {person.title}
        </motion.p>
        <motion.p
          className="mt-4 text-sm leading-relaxed"
          style={{ color: 'var(--color-ink-muted)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE_OUT }}
        >
          {person.bio}
        </motion.p>
      </motion.div>
    </motion.article>
  )
}
