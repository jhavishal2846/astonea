'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import AstoneaLogo from '@/components/AstoneaLogo'
import LanguageSwitcher, { type LocaleOption } from '@/components/LanguageSwitcher'

/* ─── Nav data ────────────────────────────────────────────────────────────── */

type NavLink = { label: string; href: string; desc?: string }
type NavSection = { heading: string; links: NavLink[] }
type NavItem =
  | { label: string; href: string; mega?: false }
  | { label: string; href?: string; mega: true; sections: NavSection[] }

const navItems: NavItem[] = [
  {
    label: 'Our Company',
    mega: true,
    sections: [
      {
        heading: 'Company',
        links: [
          { label: 'About us',          href: '/about-us' },
          { label: 'Vision and Mission', href: '/vision-and-mission' },
          { label: 'Leadership Panel',   href: '/leadership-panel' },
          { label: 'Key Milestone',     href: '/key-milestone' },
          { label: 'Associate',   href: '/' },
        ],
      },
      {
        heading: 'Capabilities',
        links: [
          { label: 'What We do',             href: '/what-we-do' },
          { label: 'Products',               href: '/products' },
          { label: 'Manufacturing Facility', href: '/manufacturing-facility' },
          { label: 'Certifications',         href: '/certifications' },
        ],
      },
    ],
  },
  {
    label: 'Investor Relations',
    mega: true,
    sections: [
      {
        heading: 'Disclosures',
        links: [
          { label: 'SEBI LODR - Regulation 46 Disclosures', href: '/sebi-lodr-regulation-46-disclosures' },
          { label: 'SEBI LODR - Regulation 30 Disclosures', href: '/sebi-lodr-regulation-30-disclosures' },
        ],
      },
      {
        heading: 'Reports',
        links: [
          { label: 'Financial Insights', href: '/financial-results' },
          { label: 'Investor Insights',  href: '/investor-insights' },
          { label: 'Annual Reports',     href: '/annual-reports' },
        ],
      },
      {
        heading: 'Governance',
        links: [
          { label: 'Board of Directors', href: '/board-of-directors' },
          { label: 'Corporate Governance',href: '/corporate-governance' },
          { label: 'Governance Policies, Codes & Frameworks', href: '/governance-policies-codes-and-frameworks' },
        ],
      },
      {
        heading: 'Structure',
        links: [
          { label: 'Group Companies', href: '/group-companies' },
          { label: 'Subsidiaries',    href: '/subsidiaries' },
          { label: 'Public Offering', href: '/public-offering' },
        ],
      },
    ],
  },
  { label: 'CSR',    href: '/csr' },
  { label: 'Career', href: '/career' },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function NavLinkItem({ href, label, active, transparent }: { href: string; label: string; active: boolean; transparent?: boolean }) {
  return (
    <Link href={href} className="relative group px-1 py-0.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm">
      <span
        className={`transition-colors duration-150 ${
          active
            ? 'text-primary'
            : transparent
            ? 'text-white/85 group-hover:text-white'
            : 'text-ink/80 group-hover:text-ink'
        }`}
      >
        {label}
      </span>
      {/* Animated underline */}
      <motion.span
        className={`absolute -bottom-px left-0 right-0 h-px origin-left ${transparent ? 'bg-white' : 'bg-primary'}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className={`absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${transparent ? 'bg-white/60' : 'bg-primary/40'}`} />
    </Link>
  )
}

function MegaMenu({
  sections,
  open,
}: {
  sections: NavSection[]
  open: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          exit={{    opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14, ease: [0.7, 0, 0.84, 0] } }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max min-w-[520px] max-w-[920px] rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-xl p-6 z-50"
        >
          <div
            className={`grid gap-8 ${
              sections.length === 1
                ? 'grid-cols-1'
                : sections.length === 2
                ? 'grid-cols-2'
                : sections.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-4'
            }`}
          >
            {sections.map((section) => (
              <div key={section.heading}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                  {section.heading}
                </p>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center px-2 py-2 rounded-lg hover:bg-primary-xlight transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span className="text-sm font-medium text-ink group-hover:text-primary transition-colors duration-150">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Mobile drawer ──────────────────────────────────────────────────────── */

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!open) setExpanded(null)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{    x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-surface shadow-2xl overflow-y-auto lg:hidden flex flex-col"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <Link href="/" onClick={onClose} className="flex items-center">
                <AstoneaLogo className="h-9 w-auto" />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 py-4 px-4">
              {navItems.map((item) =>
                item.mega ? (
                  <div key={item.label}>
                    <button
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-ink"
                    >
                      {item.label}
                      <motion.svg
                        className="w-4 h-4 text-ink-subtle"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        animate={{ rotate: expanded === item.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                    <AnimatePresence>
                      {expanded === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{    height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          {item.sections.map((section) => (
                            <div key={section.heading} className="pl-4 pb-2">
                              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                                {section.heading}
                              </p>
                              {section.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={onClose}
                                  className="block px-3 py-2 rounded-lg text-sm text-ink/80 hover:text-primary hover:bg-primary-xlight transition-colors"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={onClose}
                    className="block px-3 py-3 rounded-lg text-sm font-medium text-ink hover:text-primary hover:bg-primary-xlight transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* CTA */}
            <div className="p-6 border-t border-border">
              <Link
                href="/contact-us"
                onClick={onClose}
                className="flex items-center justify-center w-full px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Main Navbar ─────────────────────────────────────────────────────────── */

export default function Navbar({
  languages = [],
  currentLocale = 'en',
}: {
  languages?: LocaleOption[]
  currentLocale?: string
} = {}) {
  const pathname    = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [hidden,     setHidden]     = useState(false)
  const lastScrollY = useRef(0)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Go solid past a small scroll offset, and hide when scrolling down /
     show when scrolling up. Always shown near the top, when any menu
     is open, or while the user is interacting with the bar. */
  useEffect(() => {
    const SOLID_THRESHOLD = pathname !== '/' ? 64 : 80
    const HIDE_THRESHOLD = 120
    const DELTA = 6

    const check = () => {
      const y = window.scrollY
      setScrolled(y > SOLID_THRESHOLD)

      const diff = y - lastScrollY.current
      if (Math.abs(diff) > DELTA) {
        if (y < HIDE_THRESHOLD) {
          setHidden(false)
        } else if (diff > 0) {
          setHidden(true)
        } else {
          setHidden(false)
        }
        lastScrollY.current = y
      }
    }
    lastScrollY.current = window.scrollY
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])

  /* Force-show the bar whenever a menu is open so it can never auto-hide
     out from under the user mid-interaction. */
  const isMenuOpen = open !== null || mobileOpen
  const effectiveHidden = hidden && !isMenuOpen

  /* Transparent over the hero on every page (interior heroes also use a dark
     photo background). Goes solid the moment the user scrolls or opens a menu. */
  const transparent = !scrolled && !isMenuOpen

  /* Close mega-menu on route change */
  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [pathname])

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setOpen(label)
  }
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setOpen(null), 120)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        initial={{ y: -8, opacity: 0 }}
        animate={{
          y: effectiveHidden ? '-110%' : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{
            backgroundColor: transparent
              ? 'rgba(255,255,255,0)'
              : scrolled
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.88)',
            backdropFilter: transparent ? 'blur(0px)' : 'blur(16px)',
            borderBottomColor: transparent
              ? 'rgba(255,255,255,0)'
              : scrolled
              ? 'rgba(226,232,240,0.8)'
              : 'rgba(226,232,240,0.4)',
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="border-b"
        >
          <div className="container-wide">
            <div className="flex items-center justify-between h-16 lg:h-[72px]">

              {/* Logo */}
              <Link
                href="/"
                aria-label="Astonea Labs — home"
                className="flex-shrink-0 flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm"
              >
                <AstoneaLogo
                  className="h-10 lg:h-12 w-auto"
                  priority
                />
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
                {navItems.map((item) =>
                  item.mega ? (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        aria-expanded={open === item.label}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm transition-colors duration-150 ${
                          transparent ? 'text-white/85 hover:text-white' : 'text-ink/80 hover:text-ink'
                        }`}
                      >
                        {item.label}
                        <motion.svg
                          className="w-3.5 h-3.5 opacity-60"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                          animate={{ rotate: open === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </button>
                      <MegaMenu sections={item.sections} open={open === item.label} />
                    </div>
                  ) : (
                    <NavLinkItem
                      key={item.href}
                      href={item.href!}
                      label={item.label}
                      active={pathname === item.href}
                      transparent={transparent}
                    />
                  )
                )}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-3">
                <LanguageSwitcher
                  languages={languages}
                  currentLocale={currentLocale}
                  transparent={transparent}
                />
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Get in Touch
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                className={`lg:hidden p-2.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  transparent ? 'hover:bg-white/10' : 'hover:bg-black/5'
                }`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileOpen}
              >
                <svg
                  className={`w-5 h-5 ${transparent ? 'text-white' : 'text-ink'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
