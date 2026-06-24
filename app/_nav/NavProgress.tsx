'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type NavProgressCtx = {
  inc: () => void
  dec: () => void
  pending: boolean
}

const NavProgressContext = createContext<NavProgressCtx | null>(null)

export function NavProgressProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const inc = useCallback(() => setCount((c) => c + 1), [])
  const dec = useCallback(() => setCount((c) => Math.max(0, c - 1)), [])
  const value = useMemo<NavProgressCtx>(
    () => ({ inc, dec, pending: count > 0 }),
    [inc, dec, count],
  )
  return (
    <NavProgressContext.Provider value={value}>
      {children}
    </NavProgressContext.Provider>
  )
}

export function useNavProgress(): NavProgressCtx {
  const ctx = useContext(NavProgressContext)
  if (!ctx) {
    return { inc: noop, dec: noop, pending: false }
  }
  return ctx
}

export function NavProgressBar() {
  const { pending } = useNavProgress()
  return (
    <div
      role="progressbar"
      aria-busy={pending}
      aria-valuetext={pending ? 'Loading page' : 'Idle'}
      className={`nav-progress${pending ? ' is-pending' : ''}`}
    />
  )
}

function noop() {}
