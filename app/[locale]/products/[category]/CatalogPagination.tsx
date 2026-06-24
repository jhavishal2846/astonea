'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/Pagination'
import { useNavTransition } from '@/app/_nav/AppLink'

/**
 * URL-driven wrapper around the existing public `Pagination` component
 * (which speaks `onChange(page)`). Pushes `?page=N` so the server-rendered
 * catalog page re-fetches with the new offset.
 */
export default function CatalogPagination({
  total,
  perPage,
  current,
}: {
  total: number
  perPage: number
  current: number
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()
  const [, startNavTransition] = useNavTransition()

  return (
    <Pagination
      total={total}
      perPage={perPage}
      current={current}
      onChange={(p) => {
        const next = new URLSearchParams(sp?.toString() ?? '')
        if (p > 1) next.set('page', String(p))
        else next.delete('page')
        const qs = next.toString()
        startNavTransition(() => {
          router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true })
        })
      }}
    />
  )
}
