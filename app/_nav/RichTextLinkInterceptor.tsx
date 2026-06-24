'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNavTransition } from './AppLink'

export default function RichTextLinkInterceptor() {
  const router = useRouter()
  const [, startNavTransition] = useNavTransition()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as Element | null
      const link = target?.closest('a')
      if (!link) return

      if (!link.closest('.rich-text-body')) return

      const href = link.getAttribute('href')
      if (!href) return
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      )
        return
      if (link.getAttribute('target') === '_blank') return
      if (link.hasAttribute('download')) return

      e.preventDefault()
      startNavTransition(() => {
        router.push(href)
      })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router, startNavTransition])

  return null
}
