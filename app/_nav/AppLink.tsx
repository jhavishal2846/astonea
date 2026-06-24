'use client'

import NextLink, { useLinkStatus } from 'next/link'
import {
  useEffect,
  useTransition,
  type ComponentProps,
  type TransitionStartFunction,
} from 'react'
import { useNavProgress } from './NavProgress'

function ProgressReporter() {
  const { pending } = useLinkStatus()
  const { inc, dec } = useNavProgress()
  useEffect(() => {
    if (!pending) return
    inc()
    return () => dec()
  }, [pending, inc, dec])
  return null
}

export function LinkPendingDot({ className }: { className?: string } = {}) {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={`nav-link-dot${pending ? ' is-pending' : ''}${
        className ? ' ' + className : ''
      }`}
    />
  )
}

type AppLinkProps = ComponentProps<typeof NextLink>

export default function AppLink({ children, ...rest }: AppLinkProps) {
  return (
    <NextLink {...rest}>
      {children}
      <ProgressReporter />
    </NextLink>
  )
}

export function useNavTransition(): [boolean, TransitionStartFunction] {
  const [pending, startTransition] = useTransition()
  const { inc, dec } = useNavProgress()
  useEffect(() => {
    if (!pending) return
    inc()
    return () => dec()
  }, [pending, inc, dec])
  return [pending, startTransition]
}
