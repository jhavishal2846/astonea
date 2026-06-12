import Link from 'next/link'

const irLinks = [
  { label: 'SEBI LODR Reg. 46', href: '/sebi-lodr-regulation-46-disclosures' },
  { label: 'SEBI LODR Reg. 30', href: '/sebi-lodr-regulation-30-disclosures' },
  { label: 'Financial Results',  href: '/financial-results' },
  { label: 'Annual Reports',     href: '/annual-reports' },
  { label: 'Corporate Governance', href: '/corporate-governance' },
  { label: 'Governance Policies',  href: '/governance-policies-codes-and-frameworks' },
  { label: 'Public Offering',      href: '/public-offering' },
]

const aboutLinks = [
  { label: 'About Us',             href: '/about-us' },
  { label: 'Vision & Mission',     href: '/vision-and-mission' },
  { label: 'Leadership Panel',     href: '/leadership-panel' },
  { label: 'Board of Directors',   href: '/board-of-directors' },
  { label: 'Key Milestones',       href: '/key-milestone' },
  { label: 'Group Companies',      href: '/group-companies' },
  { label: 'Subsidiaries',         href: '/subsidiaries' },
]

const businessLinks = [
  { label: 'What We Do',             href: '/what-we-do' },
  { label: 'Manufacturing Facility', href: '/manufacturing-facility' },
  { label: 'Certifications',         href: '/certifications' },
  { label: 'CSR',                    href: '/csr' },
  { label: 'Career',                 href: '/career' },
  { label: 'Contact Us',             href: '/contact-us' },
]

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-white/70">
      {/* Top CTA band */}
      <div className="border-b border-white/10">
        <div className="container-wide py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display text-2xl font-semibold text-white text-balance leading-snug">
              Ready to manufacture with confidence?
            </p>
            <p className="mt-2 text-sm text-white/50 max-w-sm">
              Speak with our team about formulation, third-party manufacturing, or investor enquiries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact-us"
              className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-slate-950 text-sm font-bold hover:bg-accent-dark transition-colors whitespace-nowrap"
            >
              Get in Touch
            </Link>
            <Link
              href="/what-we-do"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 hover:text-white transition-colors whitespace-nowrap"
            >
              Our Capabilities
            </Link>
          </div>
        </div>
      </div>

      {/* Main link grid */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-5">
              <span className="font-display font-bold text-xl text-white tracking-tight">ASTONEA</span>
              <span className="block text-[11px] tracking-[0.2em] uppercase text-white/40 mt-0.5">LABS LIMITED</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 mb-5 max-w-xs">
              Partnering with you for quality manufacturing and development. Innovative pharma and cosmetics solutions — excellence and reliability in every batch.
            </p>
            <address className="text-xs text-white/40 not-italic leading-relaxed">
              SCO 321-322, Basement, Sector 35B<br />
              Chandigarh — 160022<br />
              India
            </address>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">About</p>
            <ul className="space-y-2.5">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">Business</p>
            <ul className="space-y-2.5">
              {businessLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investor Relations */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">Investor Relations</p>
            <ul className="space-y-2.5">
              {irLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>
            © {year} Astonea Labs Limited. All rights reserved.
          </p>
          <p className="font-mono tracking-wide">
            CIN: L24304CH2017PLC041482
          </p>
          <div className="flex items-center gap-5">
            <Link href="/governance-policies-codes-and-frameworks" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/governance-policies-codes-and-frameworks" className="hover:text-white/60 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
