'use client'

import Link from '@/components/LocaleLink'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import AstoneaLogo from '@/components/AstoneaLogo'
import LanguageSwitcher, { type LocaleOption } from '@/components/LanguageSwitcher'

/* ─── Nav data ────────────────────────────────────────────────────────────── */

type NavLink = { labelKey: string; href: string; desc?: string }
type NavSection = { headingKey: string; links: NavLink[] }
type NavItem =
  | { labelKey: string; href: string; mega?: false }
  | { labelKey: string; href?: string; mega: true; sections: NavSection[] }

const navItems: NavItem[] = [
  {
    labelKey: 'nav.our_company',
    mega: true,
    sections: [
      {
        headingKey: 'nav.section.company',
        links: [
          { labelKey: 'nav.about_us',           href: '/about-us' },
          { labelKey: 'nav.vision_and_mission', href: '/vision-and-mission' },
          { labelKey: 'nav.leadership_panel',   href: '/leadership-panel' },
          { labelKey: 'nav.key_milestone',      href: '/key-milestone' },
          { labelKey: 'nav.associate',          href: '/' },
        ],
      },
      {
        headingKey: 'nav.section.capabilities',
        links: [
          { labelKey: 'nav.what_we_do',             href: '/what-we-do' },
          { labelKey: 'nav.products',               href: '/products' },
          { labelKey: 'nav.manufacturing_facility', href: '/manufacturing-facility' },
          { labelKey: 'nav.certifications',         href: '/certifications' },
        ],
      },
    ],
  },
  {
    labelKey: 'nav.investor_relations',
    mega: true,
    sections: [
      {
        headingKey: 'nav.section.disclosures',
        links: [
          { labelKey: 'nav.sebi_lodr_46', href: '/sebi-lodr-regulation-46-disclosures' },
          { labelKey: 'nav.sebi_lodr_30', href: '/sebi-lodr-regulation-30-disclosures' },
        ],
      },
      {
        headingKey: 'nav.section.reports',
        links: [
          { labelKey: 'nav.financial_results',  href: '/financial-results' },
          { labelKey: 'nav.investor_insights',  href: '/investor-insights' },
          { labelKey: 'nav.annual_reports',     href: '/annual-reports' },
        ],
      },
      {
        headingKey: 'nav.section.governance',
        links: [
          { labelKey: 'nav.board_of_directors',   href: '/board-of-directors' },
          { labelKey: 'nav.corporate_governance', href: '/corporate-governance' },
          { labelKey: 'nav.governance_policies',  href: '/governance-policies-codes-and-frameworks' },
        ],
      },
      {
        headingKey: 'nav.section.structure',
        links: [
          { labelKey: 'nav.group_companies', href: '/group-companies' },
          { labelKey: 'nav.subsidiaries',    href: '/subsidiaries' },
          { labelKey: 'nav.public_offering', href: '/public-offering' },
        ],
      },
    ],
  },
  { labelKey: 'nav.csr',    href: '/csr' },
  { labelKey: 'nav.career', href: '/career' },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function NavLinkItem({ href, labelKey, active, transparent }: { href: string; labelKey: string; active: boolean; transparent?: boolean }) {
  const t = useTranslations()
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
        {t(labelKey)}
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
  const t = useTranslations()
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
              <div key={section.headingKey}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                  {t(section.headingKey)}
                </p>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center px-2 py-2 rounded-lg hover:bg-primary-xlight transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span className="text-sm font-medium text-ink group-hover:text-primary transition-colors duration-150">
                          {t(link.labelKey)}
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
  const t = useTranslations()
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
            aria-label={t('nav.aria.mobile')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <Link href="/" onClick={onClose} className="flex items-center">
                <AstoneaLogo className="h-9 w-auto" />
              </Link>
              <button
                onClick={onClose}
                aria-label={t('cta.close_nav')}
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
                  <div key={item.labelKey}>
                    <button
                      onClick={() => setExpanded(expanded === item.labelKey ? null : item.labelKey)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-ink"
                    >
                      {t(item.labelKey)}
                      <motion.svg
                        className="w-4 h-4 text-ink-subtle"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        animate={{ rotate: expanded === item.labelKey ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                    <AnimatePresence>
                      {expanded === item.labelKey && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{    height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          {item.sections.map((section) => (
                            <div key={section.headingKey} className="pl-4 pb-2">
                              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                                {t(section.headingKey)}
                              </p>
                              {section.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  onClick={onClose}
                                  className="block px-3 py-2 rounded-lg text-sm text-ink/80 hover:text-primary hover:bg-primary-xlight transition-colors"
                                >
                                  {t(link.labelKey)}
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
                    {t(item.labelKey)}
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
                {t('cta.get_in_touch')}
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
  const t = useTranslations()
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
      <a href="#main-content" className="skip-link">{t('cta.skip_to_main')}</a>

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
                aria-label={t('nav.aria.home')}
                className="flex-shrink-0 flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm"
              >
                <AstoneaLogo
                  className="h-10 lg:h-12 w-auto"
                  priority
                />
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-8" aria-label={t('nav.aria.main')}>
                {navItems.map((item) =>
                  item.mega ? (
                    <div
                      key={item.labelKey}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.labelKey)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        aria-expanded={open === item.labelKey}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-sm transition-colors duration-150 ${
                          transparent ? 'text-white/85 hover:text-white' : 'text-ink/80 hover:text-ink'
                        }`}
                      >
                        {t(item.labelKey)}
                        <motion.svg
                          className="w-3.5 h-3.5 opacity-60"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                          animate={{ rotate: open === item.labelKey ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </button>
                      <MegaMenu sections={item.sections} open={open === item.labelKey} />
                    </div>
                  ) : (
                    <NavLinkItem
                      key={item.href}
                      href={item.href!}
                      labelKey={item.labelKey}
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
                  {t('cta.get_in_touch')}
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                className={`lg:hidden p-2.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  transparent ? 'hover:bg-white/10' : 'hover:bg-black/5'
                }`}
                onClick={() => setMobileOpen(true)}
                aria-label={t('cta.open_nav')}
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
