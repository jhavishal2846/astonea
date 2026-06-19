'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { usePageBuilder } from './PageBuilderContext'
import { deleteBlock, duplicateBlock, moveBlock } from '../../_actions'

export default function SelectableBlock({
  blockId,
  index,
  totalBlocks,
  blockTypeLabel,
  children,
}: {
  blockId: string
  index: number
  totalBlocks: number
  blockTypeLabel: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const { selectedId, hoveredId, setSelected, setHovered, isTranslationMode } =
    usePageBuilder()
  const isSelected = selectedId === blockId
  const isHovered = hoveredId === blockId

  const [pending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const outline =
    isSelected
      ? 'outline outline-2 outline-primary outline-offset-[-2px]'
      : isHovered
      ? 'outline outline-1 outline-primary/60 outline-offset-[-1px]'
      : ''

  return (
    <div
      className={`relative group ${outline} transition-[outline] cursor-pointer`}
      onMouseEnter={() => setHovered(blockId)}
      onMouseLeave={() => setHovered(null)}
      onClick={(e) => {
        // Don't treat clicks on the floating toolbar buttons as selection.
        if ((e.target as HTMLElement).closest('[data-block-toolbar]')) return
        e.stopPropagation()
        setSelected(blockId)
      }}
    >
      {/* Block-type badge in top-left corner — only visible when selected or hovered */}
      {(isSelected || isHovered) && (
        <div
          className="absolute top-0 left-0 z-30 px-2 py-1 rounded-br-md text-[10px] font-semibold uppercase tracking-wider bg-primary text-white pointer-events-none"
          aria-hidden="true"
        >
          {blockTypeLabel}
        </div>
      )}

      {/* Floating toolbar — only when selected AND we're in base mode. In
          translation mode structural changes are blocked. */}
      {isSelected && !isTranslationMode && (
        <div
          data-block-toolbar
          className="absolute top-0 right-0 z-30 flex items-center gap-1 px-1.5 py-1 rounded-bl-md bg-primary text-white shadow-md"
        >
          <button
            type="button"
            disabled={pending || index === 0}
            onClick={(e) => {
              e.stopPropagation()
              startTransition(async () => {
                await moveBlock(blockId, 'up')
                router.refresh()
              })
            }}
            title="Move up"
            className="w-6 h-6 rounded hover:bg-white/15 disabled:opacity-40 text-xs"
          >
            ▲
          </button>
          <button
            type="button"
            disabled={pending || index === totalBlocks - 1}
            onClick={(e) => {
              e.stopPropagation()
              startTransition(async () => {
                await moveBlock(blockId, 'down')
                router.refresh()
              })
            }}
            title="Move down"
            className="w-6 h-6 rounded hover:bg-white/15 disabled:opacity-40 text-xs"
          >
            ▼
          </button>
          <span className="w-px h-4 bg-white/30 mx-0.5" />
          <button
            type="button"
            disabled={pending}
            onClick={(e) => {
              e.stopPropagation()
              startTransition(async () => {
                await duplicateBlock(blockId)
                router.refresh()
              })
            }}
            title="Duplicate"
            className="w-6 h-6 rounded hover:bg-white/15 text-xs flex items-center justify-center"
          >
            ⧉
          </button>
          {confirmDelete ? (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={(e) => {
                  e.stopPropagation()
                  startTransition(async () => {
                    await deleteBlock(blockId)
                    setConfirmDelete(false)
                    router.refresh()
                  })
                }}
                title="Confirm delete"
                className="px-2 h-6 rounded text-[11px] font-semibold bg-white text-rose-600 hover:bg-rose-50"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmDelete(false)
                }}
                title="Cancel"
                className="px-2 h-6 rounded text-[11px] hover:bg-white/15"
              >
                ✕
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setConfirmDelete(true)
              }}
              title="Delete"
              className="w-6 h-6 rounded hover:bg-white/15 text-xs flex items-center justify-center"
            >
              🗑
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
