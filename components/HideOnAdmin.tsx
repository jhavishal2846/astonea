'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides public-site chrome (Navbar, Footer) on /admin/* routes.
 * Renders `children` everywhere else. Server components passed as children
 * are rendered in their normal RSC tree before this wrapper hides them.
 */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}
