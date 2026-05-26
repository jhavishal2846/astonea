import type { Metadata } from 'next'
import ScrollHero from '@/components/ScrollHero'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Astonea Labs Limited — Pharma & Cosmetics Third-Party Manufacturer',
  description:
    'Partnering with you for quality manufacturing and development. 2000+ clients, 1500+ product approvals. SEBI-listed pharma and cosmetics manufacturer — Chandigarh, India.',
}

export default function HomePage() {
  return (
    <>
      <ScrollHero />

      <div
        aria-hidden="true"
        className="h-6 w-full sm:h-8"
        style={{
          background: 'linear-gradient(to bottom, #05060f 0%, var(--color-bg) 100%)',
        }}
      />

      <HomeContent />
    </>
  )
}
