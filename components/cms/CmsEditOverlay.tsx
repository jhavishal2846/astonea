'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { savePageTextOne } from '@/app/admin/(authed)/pages/_text-actions'

type EditTarget = {
  el: HTMLElement
  key: string
  path: string
  locale: string
  defaultValue: string
  currentValue: string
  rect: DOMRect
}

/**
 * In-place editor overlay for the public site in `?edit=1` mode.
 *
 *  - Every `.cms-editable` element gets a persistent dashed outline so the
 *    admin can see what's editable at a glance.
 *  - Click an editable → small popover anchored to it; type + Save.
 *  - All other clicks (links, buttons, form submits) are blocked so the
 *    iframe can never accidentally navigate away from the page being edited.
 */
export default function CmsEditOverlay() {
  const [target, setTarget] = useState<EditTarget | null>(null)
  const [draft, setDraft] = useState('')
  const [pending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  // 1. Inject CSS — persistent outline on editable, suppress link styling.
  useEffect(() => {
    const css = `
      .cms-editable {
        outline: 1px dashed rgba(0, 114, 206, 0.45);
        outline-offset: 3px;
        border-radius: 2px;
        transition: outline-color 120ms ease-out, background-color 120ms ease-out, box-shadow 120ms ease-out;
        cursor: text !important;
        position: relative;
      }
      .cms-editable:hover {
        outline-color: rgba(0, 114, 206, 0.9);
        outline-style: solid;
        background-color: rgba(0, 114, 206, 0.06);
      }
      .cms-editable.cms-editing {
        outline: 2px solid rgba(0, 114, 206, 1);
        background-color: rgba(0, 114, 206, 0.12);
        box-shadow: 0 0 0 4px rgba(0, 114, 206, 0.12);
      }
      .cms-editable a { pointer-events: none; }
      /* In edit mode dim the page slightly so editable areas stand out */
      body.cms-edit-mode { padding-top: 44px; }
    `
    const style = document.createElement('style')
    style.dataset.cmsEditOverlay = '1'
    style.textContent = css
    document.head.appendChild(style)
    document.body.classList.add('cms-edit-mode')
    return () => {
      style.remove()
      document.body.classList.remove('cms-edit-mode')
    }
  }, [])

  // 2. Block ALL navigation while in edit mode. Capture-phase so we beat
  //    framework / router handlers. Allow only:
  //      - clicks inside our popover
  //      - clicks on .cms-editable (which we handle explicitly below)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (popoverRef.current?.contains(t)) return
      const editable = t.closest('.cms-editable') as HTMLElement | null

      if (editable) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        const key = editable.dataset.cmsKey
        const path = editable.dataset.cmsPath
        const locale = editable.dataset.cmsLocale
        const defaultValue = editable.dataset.cmsDefault ?? ''
        if (!key || !path || !locale) return
        const currentValue = editable.innerText
        const rect = editable.getBoundingClientRect()
        setTarget((prev) => {
          prev?.el.classList.remove('cms-editing')
          return { el: editable, key, path, locale, defaultValue, currentValue, rect }
        })
        setDraft(currentValue)
        setSavedAt(null)
        editable.classList.add('cms-editing')
        return
      }

      // Click on something that isn't editable. If it's a navigation element,
      // hard-block the action so the iframe stays put.
      const nav = t.closest('a, button, [role="button"], [role="link"], input[type="submit"]')
      if (nav) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        showToast("This section isn't editable yet — only outlined text can be edited.")
        return
      }

      // Background click: close any open popover.
      if (target) {
        target.el.classList.remove('cms-editing')
        setTarget(null)
      }
    }
    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault()
      e.stopPropagation()
      showToast('Form submission is disabled in edit mode.')
    }
    const onKey = (e: KeyboardEvent) => {
      // Block Enter on links to stop keyboard activation.
      if (e.key === 'Enter') {
        const t = e.target as HTMLElement
        if (t.closest('a, button, [role="button"]')) {
          if (!t.closest('.cms-editable') && !popoverRef.current?.contains(t)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [target])

  // 3. Esc / Cmd+Enter shortcuts for the open popover.
  useEffect(() => {
    if (!target) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        target.el.classList.remove('cms-editing')
        setTarget(null)
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        save()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  // 4. Track popover position with scroll/resize.
  useEffect(() => {
    if (!target) return
    const update = () => {
      const rect = target.el.getBoundingClientRect()
      setTarget((t) => (t ? { ...t, rect } : null))
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [target])

  const save = () => {
    if (!target) return
    const value = draft.trim()
    startTransition(async () => {
      try {
        await savePageTextOne(target.path, target.locale, target.key, value)
        target.el.innerText = value === '' ? target.defaultValue : value
        setSavedAt(Date.now())
        setTimeout(() => {
          target.el.classList.remove('cms-editing')
          setTarget(null)
        }, 600)
      } catch (e) {
        console.error('[cms-edit] save failed', e)
        showToast(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  const reset = () => {
    if (!target) return
    setDraft('')
  }

  // Persistent top banner: shows visitors are in edit mode.
  const banner = (
    <div
      className="fixed top-0 left-0 right-0 z-[2147483645] bg-slate-900 text-white px-4 py-2 flex items-center justify-between pointer-events-none"
      style={{ height: 44 }}
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Edit mode
        </span>
        <span className="opacity-80">
          Click any <strong className="font-semibold">outlined text</strong> to edit. Other clicks are disabled while you edit.
        </span>
      </div>
      <div className="text-[10px] opacity-60 hidden md:block">
        Esc cancel · Ctrl+Enter save
      </div>
    </div>
  )

  const toastEl = toast ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2147483647] px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg pointer-events-none animate-[pulse_1.4s_ease-in-out]">
      {toast}
    </div>
  ) : null

  if (!target) {
    return (
      <>
        {banner}
        {toastEl}
      </>
    )
  }

  // Popover position
  const isMultiline = target.defaultValue.length > 80 || target.currentValue.length > 80
  const PANEL_W = 360
  const top = Math.min(target.rect.bottom + 8, window.innerHeight - 220)
  const left = Math.max(
    8,
    Math.min(target.rect.left, window.innerWidth - PANEL_W - 8),
  )

  return (
    <>
      {banner}
      {toastEl}
      <div
        ref={popoverRef}
        className="fixed z-[2147483647] rounded-lg border border-slate-200 bg-white shadow-2xl"
        style={{ top, left, width: PANEL_W }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-3">
          <p className="text-[10px] font-mono text-slate-500 truncate">{target.key}</p>
          <button
            type="button"
            onClick={() => {
              target.el.classList.remove('cms-editing')
              setTarget(null)
            }}
            className="text-slate-400 hover:text-slate-700 text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-3 py-3">
          {isMultiline ? (
            <textarea
              autoFocus
              rows={5}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={target.defaultValue}
              className="w-full px-2.5 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-y"
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={target.defaultValue}
              className="w-full px-2.5 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          )}
          <p className="mt-1.5 text-[10px] text-slate-400">
            Blank to reset to the default. <kbd className="px-1 py-0.5 rounded bg-slate-100">Ctrl+Enter</kbd> to save.
          </p>
        </div>
        <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={reset}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:underline"
          >
            Reset to default
          </button>
          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-[11px] font-medium text-emerald-700">✓ Saved</span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {pending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
