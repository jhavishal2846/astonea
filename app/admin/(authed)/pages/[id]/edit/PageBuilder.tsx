'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/app/admin/_components/Modal'
import {
  PageBuilderContext,
  type BlockTypeMeta,
  type ClientBlock,
} from './PageBuilderContext'
import { addBlock, updateBlockProps, updateBlockTranslation } from '../../_actions'
import Inspector from './Inspector'

type PageSettingsProps = {
  pageId: string
  initialLabel: string
  initialPublished: boolean
  initialShowInNav: boolean
  path: string
}

export default function PageBuilder({
  pageId,
  currentLocale,
  isTranslationMode,
  blocks: initialBlocks,
  blockTypes,
  pageSettings,
  children,
}: {
  pageId: string
  currentLocale: string
  isTranslationMode: boolean
  blocks: ClientBlock[]
  blockTypes: BlockTypeMeta[]
  pageSettings: PageSettingsProps
  children: React.ReactNode
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [blocks, setBlocks] = useState<ClientBlock[]>(initialBlocks)
  // Keep blocks in sync if the parent re-renders (e.g. after router.refresh()).
  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerInsertAt, setPickerInsertAt] = useState<number | null>(null)

  // Deselect on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const saveProps = useCallback(
    async (blockId: string, props: Record<string, unknown>) => {
      try {
        if (isTranslationMode) {
          await updateBlockTranslation(blockId, currentLocale, props)
        } else {
          await updateBlockProps(blockId, props)
        }
        // Pull the server's authoritative render so the canvas matches.
        router.refresh()
      } catch (e) {
        console.error('[page-builder] save failed', e)
      }
    },
    [router, currentLocale, isTranslationMode],
  )

  // For inspector-driven updates: nothing to do on the canvas right now —
  // the server re-render handles the live preview after `saveProps`. Kept
  // as a hook so future per-block local previews can plug in here.
  const patchLocalProps = useCallback(
    (blockId: string, props: Record<string, unknown>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, props } : b)),
      )
    },
    [],
  )

  const openTypePicker = useCallback(
    (insertAt: number | null) => {
      // Block adding new blocks while editing a translation — structure must
      // change in the base locale so every language stays in sync.
      if (isTranslationMode) return
      setPickerInsertAt(insertAt)
      setPickerOpen(true)
    },
    [isTranslationMode],
  )

  const ctxValue = useMemo(
    () => ({
      pageId,
      blocks,
      blockTypes,
      currentLocale,
      isTranslationMode,
      selectedId,
      hoveredId,
      setSelected: setSelectedId,
      setHovered: setHoveredId,
      openTypePicker,
      saveProps,
      patchLocalProps,
    }),
    [
      pageId,
      blocks,
      blockTypes,
      currentLocale,
      isTranslationMode,
      selectedId,
      hoveredId,
      openTypePicker,
      saveProps,
      patchLocalProps,
    ],
  )

  return (
    <PageBuilderContext.Provider value={ctxValue}>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Canvas */}
        <div
          className="rounded-2xl border border-slate-200 bg-white overflow-hidden relative shadow-sm"
          onClick={(e) => {
            // Click on the canvas background (not a block) → deselect.
            if (e.target === e.currentTarget) setSelectedId(null)
          }}
          // Prevent any link inside the rendered blocks from navigating.
          onClickCapture={(e) => {
            const t = e.target as HTMLElement
            const anchor = t.closest('a')
            if (anchor) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          {/* Canvas inner padding-free zone so blocks bleed edge-to-edge */}
          <div className="page-builder-canvas">
            {blocks.length === 0 ? (
              isTranslationMode ? (
                <div className="p-16 text-center">
                  <p className="text-sm text-slate-500 mb-2">
                    There&apos;s nothing to translate yet — this page has no blocks.
                  </p>
                  <p className="text-xs text-slate-400">
                    Switch to the <strong className="text-slate-700">base</strong> tab and add blocks first.
                  </p>
                </div>
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium uppercase tracking-wider mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Original design active
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                    This page is using its built-in design
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                    The public site is serving the original hand-coded version of{' '}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {pageSettings.path}
                    </code>
                    . Add your first block to <strong>override it</strong> — your composition
                    will replace the original layout. Delete all blocks any time to bring the
                    original back.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <a
                      href={pageSettings.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
                    >
                      Preview original ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => openTypePicker(0)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                    >
                      + Add first block
                    </button>
                  </div>
                </div>
              )
            ) : (
              children
            )}
          </div>
        </div>

        {/* Inspector */}
        <div className="lg:sticky lg:top-6">
          <Inspector pageSettings={pageSettings} />
        </div>
      </div>

      {/* Block type picker */}
      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Pick a block type"
        size="lg"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          {blockTypes.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => {
                setPickerOpen(false)
                startTransition(async () => {
                  const newId = await addBlock(
                    pageId,
                    t.type,
                    pickerInsertAt ?? undefined,
                  )
                  // Optimistically select the new block so the inspector
                  // shows its fields as soon as the canvas refreshes.
                  setSelectedId(newId)
                  router.refresh()
                })
              }}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-primary"
                >
                  <path d={t.iconPath} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{t.adminLabel}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <style>{`
        /* Disable scroll-triggered animations and transitions while editing —
           framer-motion's intersection-observer reveals replay on every save
           which is distracting. Pointer events on inner links are killed too. */
        .page-builder-canvas a { cursor: pointer; }
      `}</style>
    </PageBuilderContext.Provider>
  )
}
