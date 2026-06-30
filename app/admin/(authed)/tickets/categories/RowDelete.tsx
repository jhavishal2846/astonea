'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function RowDelete({
  id,
  label,
  action,
}: {
  id: string
  label: string
  action: (id: string) => Promise<void>
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return
    startTransition(async () => {
      await action(id)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-rose-600 hover:text-rose-700 disabled:opacity-50"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
