'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface FrameSequenceProps {
  /** e.g. "/frames/home-hero/frame_{0000}.webp" — omit for procedural mode */
  framePath?: string
  frameCount?: number
  /** Extra scroll distance for the pinned section, e.g. "200vh" */
  scrollHeight?: string
  width?: number 
  height?: number
  /** First-frame fallback shown during SSR and preload */  
  poster?: string
  label?: string
  /** Unique id — used to scope the GSAP trigger */
  sequenceId?: string
  /** Content to overlay on the canvas (titles, CTAs, etc.) */
  children?: React.ReactNode
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function parseFramePath(template: string, index: number): string {
  return template.replace(/\{(\d+)\}/, (_, digits) =>
    String(index + 1).padStart(digits.length, '0')
  )
}

function drawProcedural(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameIndex: number,
  frameCount: number
): void {
  const progress = frameCount > 1 ? frameIndex / (frameCount - 1) : 0
  const hue   = 200 + progress * 80
  const hue2  = 210 + progress * 80
 
  /* Background gradient */
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0,   `hsl(${hue},70%,12%)`)
  bg.addColorStop(0.5, `hsl(${hue + 12},60%,18%)`)
  bg.addColorStop(1,   `hsl(${hue + 30},50%,10%)`)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  /* Orbiting radial glow */
  const angle = progress * Math.PI * 2
  const gx = w * 0.5 + Math.cos(angle) * w * 0.28
  const gy = h * 0.5 + Math.sin(angle) * h * 0.22
  const radial = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.38)
  radial.addColorStop(0, `hsla(${hue2},85%,65%,0.26)`)
  radial.addColorStop(1, 'hsla(0,0%,0%,0)')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, w, h)

  /* Vignette */
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85)
  vig.addColorStop(0, 'hsla(0,0%,0%,0)')
  vig.addColorStop(1, 'hsla(0,0%,0%,0.42)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, w, h)

  /* Wordmark */
  ctx.save()
  ctx.globalAlpha = 0.06
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${Math.round(w * 0.09)}px "Playfair Display", Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '0.12em'
  ctx.fillText('ASTONEA', w / 2, h / 2)
  ctx.restore()

  /* Frame counter */
  ctx.save()
  ctx.globalAlpha = 0.4
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `${Math.round(w * 0.011)}px "Courier New", monospace`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.fillText(
    `FRAME ${String(frameIndex + 1).padStart(3, '0')} / ${frameCount}`,
    Math.round(w * 0.02),
    h - Math.round(h * 0.03)
  )
  ctx.restore()
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function FrameSequence({
  framePath,
  frameCount = 240,
  scrollHeight = '200vh',
  width  = 1920,
  height = 1080,
  poster,
  label = 'Animated sequence',
  sequenceId = 'frame-seq',
  children,
}: FrameSequenceProps) {
  const sectionRef   = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const frameRef     = useRef(0)
  const abortRef     = useRef<AbortController | null>(null)

  const [loading,    setLoading]    = useState(!!framePath)
  const [loadPct,    setLoadPct]    = useState(0)
  const [fileMode,   setFileMode]   = useState(!!framePath)
  const [reducedMotion, setReducedMotion] = useState(false)

  /* ── DPR-aware canvas resize ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = container.clientHeight
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    render(frameRef.current)
  }, []) // eslint-disable-line

  /* ── Draw a single frame ── */
  const render = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.clientWidth  || canvas.width
    const h = canvas.clientHeight || canvas.height

    if (fileMode && imagesRef.current.length > 0) {
      const img = imagesRef.current[Math.min(idx, imagesRef.current.length - 1)]
      if (img?.complete) ctx.drawImage(img, 0, 0, w, h)
    } else {
      drawProcedural(ctx, w, h, idx, frameCount)
    }
  }, [fileMode, frameCount])

  /* ── Preload all frames (Mode B) ── */
  useEffect(() => {
    if (!framePath) return
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const resolvedPath = framePath

    let loaded = 0
    const images: HTMLImageElement[] = new Array(frameCount)
    imagesRef.current = images

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        if (ctrl.signal.aborted) { resolve(); return }
        const img = new Image()
        img.onload = () => {
          images[i] = img
          loaded++
          setLoadPct(Math.round((loaded / frameCount) * 100))
          if (loaded === frameCount) {
            setLoading(false)
            render(frameRef.current)
          }
          resolve()
        }
        img.onerror = () => {
          /* Fall back to procedural mode on first 404 */
          setFileMode(false)
          setLoading(false)
          ctrl.abort()
          resolve()
        }
        img.src = parseFramePath(resolvedPath, i)
      })

    /* Stagger initial load: poster first, then rest */
    loadOne(0).then(() => {
      render(0)
      for (let i = 1; i < frameCount; i++) loadOne(i)
    })

    return () => ctrl.abort()
  }, [framePath, frameCount, render])

  /* ── GSAP ScrollTrigger ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    if (prefersReduced) return

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
        value: frameCount - 1,
        ease: 'none',
        scrollTrigger: {
          id: sequenceId,
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate() {
          const idx = Math.round(frameObj.value)
          frameRef.current = idx
          render(idx)
        },
      })

      cleanup = () => {
        tween.kill()
        ScrollTrigger.getById(sequenceId)?.kill()
      }
    })()

    return () => cleanup()
  }, [frameCount, sequenceId, render])

  /* ── Resize observer ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(container)
    resizeCanvas()
    return () => ro.disconnect()
  }, [resizeCanvas])

  /* ── Initial procedural frame ── */
  useEffect(() => {
    if (!framePath) render(0)
  }, [framePath, render])

  return (
    <section
      ref={sectionRef}
      style={{ height: scrollHeight }}
      aria-label={label}
      className="relative w-full"
    >
      {/* Sticky viewport-height canvas holder */}
      <div
        ref={containerRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Poster image for SSR / no-JS / pre-load */}
        {poster && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Reduced motion fallback */}
        {reducedMotion && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(200,70%,12%), hsl(240,55%,10%))' }}
          />
        )}

        {/* The canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        />

        {/* Loading indicator */}
        {loading && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="h-px w-48 bg-white/20 overflow-hidden rounded-full">
              <div
                className="h-full bg-white/60 transition-all duration-300"
                style={{ width: `${loadPct}%` }}
              />
            </div>
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
              Loading {loadPct}%
            </span>
          </div>
        )}

        {/* Content overlay */}
        {children && (
          <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
            <div className="pointer-events-auto">{children}</div>
          </div>
        )}
      </div>
    </section>
  )
}
