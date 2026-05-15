'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const FRAME_COUNT = 1070
const FRAME_TEMPLATE = '/frames/home-hero/frame_{0000}.webp?v=3'
const SCENES = 5

function parseFramePath(template: string, index: number): string {
  return template.replace(/\{(\d+)\}/, (_, digits) =>
    String(index + 1).padStart(digits.length, '0')
  )
}

/* Progress thresholds — matched to animation content in each range */
const BREAKS = [0.20, 0.38, 0.56, 0.78, 1.00]
function sceneFromProgress(p: number) {
  for (let i = 0; i < BREAKS.length; i++) if (p < BREAKS[i]) return i
  return SCENES - 1
}

function SceneIndicator({ active }: { active: number }) {
  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
      {Array.from({ length: SCENES }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: active === i ? '8px' : '5px',
            height: active === i ? '8px' : '5px',
            background: active === i ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)',
          }}
        />
      ))}
    </div>
  )
}

/* Shared transition style for scene containers */
function sceneStyle(active: number, idx: number): React.CSSProperties {
  const isActive = active === idx
  const isPast   = active > idx
  return {
    opacity:        isActive ? 1 : 0,
    transform:      isActive ? 'translateY(0)' : isPast ? 'translateY(-28px)' : 'translateY(28px)',
    transition:     'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)',
    pointerEvents:  isActive ? 'auto' : 'none',
  }
}

export default function ScrollHero() {
  const sectionRef   = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const frameRef     = useRef(0)

  const [loading,     setLoading]     = useState(true)
  const [loadPct,     setLoadPct]     = useState(0)
  const [activeScene, setActiveScene] = useState(0)

  /* ── Draw one frame ── */
  const render = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pw = canvas.width
    const ph = canvas.height
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pw, ph)
    const img = imagesRef.current[Math.min(idx, imagesRef.current.length - 1)]
    if (img?.complete && img.naturalWidth > 0) {
      const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight)
      const dw = img.naturalWidth  * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (pw - dw) / 2, (ph - dh) / 2, dw, dh)
    }
  }, [])

  /* ── DPR-aware resize ── */
  const resizeCanvas = useCallback(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const w   = container.clientWidth
    const h   = container.clientHeight
    canvas.width        = Math.round(w * dpr)
    canvas.height       = Math.round(h * dpr)
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    render(frameRef.current)
  }, [render])

  /* ── Preload with concurrency cap ── */
  useEffect(() => {
    let loaded  = 0
    let aborted = false
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)
    imagesRef.current = images

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        if (aborted) { resolve(); return }
        const img = new Image()
        img.onload = () => {
          images[i] = img
          loaded++
          setLoadPct(Math.round((loaded / FRAME_COUNT) * 100))
          if (loaded === FRAME_COUNT) { setLoading(false); render(frameRef.current) }
          resolve()
        }
        img.onerror = () => { loaded++; if (loaded === FRAME_COUNT) setLoading(false); resolve() }
        img.src = parseFramePath(FRAME_TEMPLATE, i)
      })

    let next = 0
    const worker = async () => {
      while (next < FRAME_COUNT && !aborted) {
        const i = next++
        await loadOne(i)
        if (i === 0) render(0)
      }
    }
    Promise.all(Array.from({ length: 8 }, () => worker()))
    return () => { aborted = true }
  }, [render])

  /* ── GSAP ScrollTrigger ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = sectionRef.current
    if (!section) return
    let cleanup: () => void = () => {}

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)

      const frameObj = { value: 0 }
      const tween = gsap.to(frameObj, {
        value: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          id: 'scroll-hero',
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate(self) { setActiveScene(sceneFromProgress(self.progress)) },
        },
        onUpdate() {
          const idx = Math.round(frameObj.value)
          frameRef.current = idx
          render(idx)
        },
      })

      cleanup = () => { tween.kill(); ScrollTrigger.getById('scroll-hero')?.kill() }
    })()

    return () => cleanup()
  }, [render])

  /* ── Resize observer ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(container)
    resizeCanvas()
    return () => ro.disconnect()
  }, [resizeCanvas])

  const base = 'absolute inset-0 flex flex-col'

  return (
    <section
      ref={sectionRef}
      style={{ height: '600vh' }}
      className="relative w-full"
      aria-label="Astonea Labs — scroll-driven hero"
    >
      <div
        ref={containerRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Canvas — white background matches frames */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ background: '#fff' }}
        />

        {/* Narrow top shadow for nav legibility */}
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 100%)' }}
        />

        {/* ── Scene 0: Hero headline — jar bottom-left, text upper-right ── */}
        <div className={base + ' justify-start pt-28 lg:pt-32 items-center lg:items-end pr-0 lg:pr-16'} style={sceneStyle(activeScene, 0)}>
          <div className="max-w-xl px-6 lg:px-0 text-center lg:text-right">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-ink-subtle)' }}>
              Est. 2017 · Chandigarh, India
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
              Pioneering Pharma &amp;{' '}
              <span className="italic" style={{ color: 'var(--color-primary)' }}>Cosmetics</span>{' '}
              Manufacturing
            </h1>
            <p className="mt-5 text-base lg:text-lg leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
              Partnering with you for quality manufacturing and development — excellence and reliability in every batch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-end">
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold active:scale-95 transition-all"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                Explore Capabilities
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}
              >
                Enquire Now
              </Link>
            </div>
          </div>
          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: 'var(--color-ink-subtle)' }}>Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-slate-400/50 to-transparent" />
          </div>
        </div>

        {/* ── Scene 1: Stats — jar center-left, stats on right ── */}
        <div className={base + ' justify-center items-center lg:items-end pr-0 lg:pr-16'} style={sceneStyle(activeScene, 1)}>
          <div className="max-w-sm px-6 lg:px-0 text-center lg:text-right">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              Our Track Record
            </p>
            <div className="space-y-5">
              {[
                { value: '2,000+', label: 'Client Brands', sub: 'Pharma & cosmetics' },
                { value: '1,500+', label: 'Product Approvals', sub: 'Formulations cleared' },
                { value: '7+',     label: 'Years of Excellence', sub: 'Founded 2017' },
              ].map((s) => (
                <div key={s.label}>
                  <span className="font-display text-4xl lg:text-5xl font-bold tracking-tight block" style={{ color: 'var(--color-ink)' }}>
                    {s.value}
                  </span>
                  <span className="text-sm font-semibold block mt-0.5" style={{ color: 'var(--color-ink)' }}>{s.label}</span>
                  <span className="text-xs block" style={{ color: 'var(--color-ink-subtle)' }}>{s.sub}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs font-mono" style={{ color: 'var(--color-ink-subtle)' }}>
              SEBI-listed · BSE &amp; NSE · Since 2021
            </p>
          </div>
        </div>

        {/* ── Scene 2: Quality — capsules scattered, center is open ── */}
        <div className={base + ' justify-center items-center text-center px-6'} style={sceneStyle(activeScene, 2)}>
          <div className="max-w-lg">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              Certified Excellence
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
              Every formulation crafted to the highest standards
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['WHO-GMP', 'ISO 9001:2015', 'AYUSH', 'FSSAI', 'cGMP', 'USFDA OTC'].map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)', background: 'rgba(255,255,255,0.7)' }}
                >
                  {c}
                </span>
              ))}
            </div>
            <Link
              href="/certifications"
              className="inline-flex items-center gap-1.5 mt-7 text-sm font-semibold transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              View All Certifications
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Scene 3: Manufacturing — box rising from bottom, text top-center ── */}
        <div className={base + ' justify-start pt-28 lg:pt-32 items-center text-center px-6'} style={sceneStyle(activeScene, 3)}>
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              Full-Spectrum Manufacturing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
              From formulation to your market
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
              Pharma tablets, capsules, liquids, creams, gels, cosmetics — end-to-end from a single trusted partner.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/manufacturing-facility"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                Explore Facility →
              </Link>
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}
              >
                All Capabilities
              </Link>
            </div>
          </div>
        </div>

        {/* ── Scene 4: CTA — box center-bottom, text top-center ── */}
        <div className={base + ' justify-start pt-28 lg:pt-32 items-center text-center px-6'} style={sceneStyle(activeScene, 4)}>
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
              Let's Build Together
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-balance" style={{ color: 'var(--color-ink)' }}>
              Your brand.{' '}
              <span className="italic" style={{ color: 'var(--color-primary)' }}>Our expertise.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
              Whether you're a brand owner seeking contract manufacturing or an investor exploring a SEBI-listed pharma company — we're ready to talk.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold active:scale-95 transition-all"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                Start a Conversation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/investor-insights"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)' }}
              >
                Investor Insights
              </Link>
            </div>
          </div>
        </div>

        {/* Scene dots */}
        <SceneIndicator active={activeScene} />

        {/* Loading bar */}
        {loading && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20">
            <div className="h-px w-40 overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
              <div className="h-full transition-all duration-300" style={{ width: `${loadPct}%`, background: 'var(--color-primary)' }} />
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--color-ink-subtle)' }}>
              Loading {loadPct}%
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
