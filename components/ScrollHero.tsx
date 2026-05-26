'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const E = [0.16, 1, 0.3, 1] as [number, number, number, number]

const heroImages = [
  {
    src: '/hero/hero-capsule-chip.png',
    alt: 'Digital capsule over a circuit board',
    className: 'top-[14%] right-[4%] w-[min(24vw,340px)] aspect-[16/10]',
    delay: 0.1,
  },
  {
    src: '/hero/hero-capsules-bg.png',
    alt: 'Multiple DNA capsules floating over a digital platform',
    className: 'top-[46%] right-[2%] w-[min(20vw,280px)] aspect-[4/3]',
    delay: 0.24,
  },
  {
    src: '/hero/lab-scientist.jpg',
    alt: 'Scientist recording lab notes beside testing equipment',
    className: 'bottom-[14%] right-[18%] w-[min(15vw,195px)] aspect-[4/5]',
    delay: 0.38,
  },
]

const heroStats = [
  { value: '2,000+', label: 'Client Brands' },
  { value: '1,500+', label: 'Approvals' },
  { value: 'WHO-GMP', label: 'Certified' },
]

export default function ScrollHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={{ minHeight: 'clamp(640px, 88svh, 820px)', background: '#05060f' }}
      aria-label="Astonea Labs home hero"
    >
      <Image
        src="/hero/hero-capsule-dna.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '60% 42%' }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,6,15,0.96) 0%, rgba(5,6,15,0.78) 39%, rgba(5,6,15,0.3) 68%, rgba(5,6,15,0.74) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 z-10 h-32"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,6,15,0.88), transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-44"
        style={{
          background: 'linear-gradient(to top, rgba(5,6,15,0.98), transparent)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0 z-10 opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage:
            'linear-gradient(rgba(98,209,255,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(98,209,255,0.32) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
        animate={reduceMotion ? undefined : { backgroundPosition: ['0px 0px', '54px 54px'] }}
        transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex min-h-[inherit] items-center pt-28 pb-32 lg:pt-32 lg:pb-36">
        <div className="container-wide w-full">
          <div className="max-w-4xl">
            <motion.p
              className="mb-5 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-200/[0.75]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: E }}
            >
              <span className="h-px w-8 bg-cyan-200/[0.7]" />
              Est. 2017 / Chandigarh, India
            </motion.p>

            <motion.h1
              className="font-display font-bold leading-[1.04] tracking-tight text-white text-balance"
              style={{ fontSize: 'clamp(2.5rem, 5.1vw, 5.25rem)' }}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: E }}
            >
              Pharma and cosmetics manufacturing for brands ready to scale.
            </motion.h1>

            <motion.p
              className="mt-7 max-w-2xl text-base leading-relaxed text-slate-200/[0.78] sm:text-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: E }}
            >
              Astonea Labs partners with healthcare, wellness, and beauty brands for
              repeatable batches, regulatory confidence, and market-ready product execution.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: E }}
            >
              <Link
                href="/what-we-do"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-bold text-white transition-transform active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(120deg, var(--color-primary) 0%, #1A8FE0 100%)',
                  boxShadow: '0 18px 42px -22px rgba(98,209,255,0.9)',
                }}
              >
                Explore Capabilities
                <ArrowIcon />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold text-slate-100 transition-colors hover:text-white"
                style={{
                  borderColor: 'rgba(255,255,255,0.24)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Enquire Now
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden="true">
        {heroImages.map((image, index) => (
          <motion.div
            key={image.src}
            className={`absolute overflow-hidden rounded-[8px] border border-white/[0.15] bg-white/[0.08] shadow-2xl shadow-cyan-950/40 backdrop-blur ${image.className}`}
            initial={{ opacity: 0, y: 42, rotate: index === 1 ? 4 : index === 2 ? -5 : 0 }}
            animate={{
              opacity: 1,
              y: reduceMotion ? 0 : [0, index === 1 ? 16 : -16, 0],
              rotate: index === 1 ? 4 : index === 2 ? -5 : 0,
            }}
            transition={{
              opacity: { duration: 0.85, delay: image.delay, ease: E },
              y: reduceMotion
                ? { duration: 0 }
                : { duration: 7 + index, repeat: Infinity, ease: 'easeInOut', delay: image.delay },
              rotate: { duration: 0.85, delay: image.delay, ease: E },
            }}
          >
            <Image src={image.src} alt={image.alt} fill sizes="32vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/[0.48] to-transparent" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-5 z-30 hidden px-6 md:block"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.46, ease: E }}
      >
        <div className="container-wide">
          <div className="grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 backdrop-blur-md">
            {heroStats.map((stat) => (
              <div key={stat.label} className="px-5 py-4" style={{ background: 'rgba(5,6,15,0.5)' }}>
                <p className="font-display text-2xl font-bold leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/[0.54]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
