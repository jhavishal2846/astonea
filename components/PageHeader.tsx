'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePageText } from '@/components/PageTextProvider'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  breadcrumb: { label: string; href: string }[]
  /** Optional explicit override. If not given, an image is picked from PAGE_IMAGE_MAP using the last breadcrumb href. */
  image?: string
}

const DEFAULT_IMAGE = '/hero/lab-research.jpg'

// All entries are landscape-oriented photos. To retarget any page, just change the value here.
const PAGE_IMAGE_MAP: Record<string, string> = {
  // People / culture — diverse team meeting around a laptop
  '/leadership-panel': '/hero/team-meeting.jpg',
  '/board-of-directors': '/hero/team-meeting.jpg',
  '/career': '/hero/team-meeting.jpg',
  '/csr': '/hero/team-meeting.jpg',

  // Company / about / manufacturing — pharmacy professionals + manufacturing line
  '/about-us': '/hero/lab-research.jpg',
  '/what-we-do': '/hero/lab-research.jpg',
  '/manufacturing-facility': '/hero/manufacturing-1.jpg',
  '/group-companies': '/hero/corporate-building.jpg',
  '/subsidiaries': '/hero/corporate-building.jpg',
  '/contact-us': '/hero/corporate-building.jpg',

  // Vision / innovation / milestones — microscope (research focus) + team meeting (people)
  '/vision-and-mission': '/hero/biotech-microscope.jpg',
  '/key-milestone': '/hero/team-meeting.jpg',

  // Products — variety across categories using pill/capsule photos
  '/products': '/hero/pharma-pills.jpg',
  '/products/apis': '/hero/medicine-capsules.jpg',
  '/products/intermediates': '/hero/manufacturing-2.jpg',
  '/products/pellets': '/hero/manufacturing-1.jpg',
  '/products/nutraceuticals': '/hero/medicine-capsules.jpg',
  '/products/excipients': '/hero/pharma-pills.jpg',
  '/products/herbal-extracts': '/hero/medicine-capsules.jpg',
  '/products/food-chemicals': '/hero/pharma-pills.jpg',
  '/products/dyes-and-intermediates': '/hero/manufacturing-2.jpg',
  '/products/impurities': '/hero/biotech-microscope.jpg',
  '/products/industrial-chemicals': '/hero/manufacturing-2.jpg',
  '/products/organic-inorganic': '/hero/manufacturing-1.jpg',
  '/certifications': '/hero/lab-research.jpg',

  // Finance / investor relations / SEBI — modern glass office building
  '/annual-reports': '/hero/corporate-building.jpg',
  '/financial-results': '/hero/corporate-building.jpg',
  '/public-offering': '/hero/corporate-building.jpg',
  '/shareholding-pattern': '/hero/corporate-building.jpg',
  '/registrar-share-transfer-agent': '/hero/corporate-building.jpg',
  '/investor-grievances': '/hero/corporate-building.jpg',
  '/investor-insights': '/hero/corporate-building.jpg',
  '/integrated-finance': '/hero/corporate-building.jpg',
  '/related-party-transactions': '/hero/corporate-building.jpg',
  '/trading-window-closure': '/hero/corporate-building.jpg',

  // Governance / policies / disclosures — corporate building
  '/corporate-documents': '/hero/corporate-building.jpg',
  '/corporate-governance': '/hero/corporate-building.jpg',
  '/frameworks': '/hero/corporate-building.jpg',
  '/codes': '/hero/corporate-building.jpg',
  '/policies': '/hero/corporate-building.jpg',
  '/governance-policies-codes-and-frameworks': '/hero/corporate-building.jpg',
  '/integrated-governance': '/hero/corporate-building.jpg',
  '/integrated-filings': '/hero/corporate-building.jpg',
  '/newspaper-publications': '/hero/corporate-building.jpg',
  '/corporate-announcements': '/hero/corporate-building.jpg',
  '/sebi-lodr-regulation-30-disclosures': '/hero/corporate-building.jpg',
  '/sebi-lodr-regulation-46-disclosures': '/hero/corporate-building.jpg',

  // Meetings — empty boardroom conference table
  '/board-meetings': '/hero/leadership-boardroom.jpg',
  '/egm': '/hero/leadership-boardroom.jpg',
  '/agm': '/hero/leadership-boardroom.jpg',
  '/meetings': '/hero/leadership-boardroom.jpg',
}

function resolveImage(image: string | undefined, breadcrumb: { href: string }[]): string {
  if (image) return image
  const last = breadcrumb[breadcrumb.length - 1]?.href
  if (last && PAGE_IMAGE_MAP[last]) return PAGE_IMAGE_MAP[last]
  return DEFAULT_IMAGE
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  image,
}: PageHeaderProps) {
  const resolved = resolveImage(image, breadcrumb)
  // Admin-set overrides take precedence; the props passed in by the page
  // are treated as fallbacks when no override is stored.
  const t = usePageText()
  const eyebrowText = t('header.eyebrow', eyebrow)
  const titleText = t('header.title', title)
  const descriptionText = t('header.description', description)

  return (
    <div
      className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20 border-b md:min-h-120 lg:min-h-140 xl:min-h-150 2xl:min-h-160"
      style={{
        background: '#05060f',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {/* Background photo — fully visible, no blur */}
      <Image
        src={resolved}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />

      {/* Asymmetric dark overlay — heavier on the left where the text sits, mostly transparent on the right so the photo reads */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,6,15,0.88) 0%, rgba(5,6,15,0.72) 35%, rgba(5,6,15,0.42) 65%, rgba(5,6,15,0.15) 100%)',
        }}
      />

      {/* Top + bottom soft fades for navbar legibility and clean section bleed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,6,15,0.78) 0%, rgba(5,6,15,0) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{
          background:
            'linear-gradient(to top, rgba(5,6,15,0.55) 0%, rgba(5,6,15,0) 100%)',
        }}
      />

      {/* Subtle drifting cyan glow — gives the static photo a touch of life */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-130 w-130 rounded-full blur-3xl opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(98,209,255,0.30) 0%, rgba(98,209,255,0) 65%)',
        }}
        animate={{ x: [0, 28, -10, 0], y: [0, -18, 8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Noise grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="container-wide relative z-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <span>/</span>
              {i === breadcrumb.length - 1 ? (
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{
            color: 'var(--color-primary-light)',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}
        >
          {eyebrowText}
        </p>
        <h1
          className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl text-balance"
          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
        >
          {titleText}
        </h1>
        <p
          className="mt-5 text-lg max-w-xl leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.78)',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}
        >
          {descriptionText}
        </p>
      </div>
    </div>
  )
}
