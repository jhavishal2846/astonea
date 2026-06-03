'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  IconDashboard,
  IconDocs,
  IconBuilding,
  IconUsers,
  IconActivity,
  IconLogout,
} from '@/app/admin/_icons'

type NavLink = {
  href: string
  label: string
  icon: (p: { className?: string }) => React.ReactElement
}

const LINKS: NavLink[] = [
  { href: '/admin',                 label: 'Dashboard',      icon: IconDashboard },
  { href: '/admin/documents',       label: 'Documents',      icon: IconDocs       },
  { href: '/admin/group-companies', label: 'Group Companies',icon: IconBuilding   },
  { href: '/admin/users',           label: 'Admins',         icon: IconUsers      },
  { href: '/admin/activity',        label: 'Activity log',   icon: IconActivity   },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Sidebar({
  user,
  logoutAction,
}: {
  user: { email: string; name: string | null }
  logoutAction: () => Promise<void>
}) {
  const pathname = usePathname() ?? ''
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-3 left-3 z-30 w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-md"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/60"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-200
          flex flex-col transition-transform duration-200 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">A</div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-white text-sm">Astonea CMS</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {LINKS.map((link) => {
            const Icon = link.icon
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors mb-2"
          >
            ↗ View public site
          </Link>

          <div className="px-3 py-2.5 rounded-lg bg-white/5 flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 text-primary-light flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(user.name ?? user.email).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{user.name ?? user.email}</div>
              {user.name && <div className="text-[10px] text-slate-400 truncate">{user.email}</div>}
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-colors"
            >
              <IconLogout className="w-3.5 h-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Close button (mobile only) */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="lg:hidden fixed top-4 left-[16rem] z-50 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  )
}
