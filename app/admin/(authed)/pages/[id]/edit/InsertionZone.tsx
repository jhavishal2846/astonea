'use client'

import { usePageBuilder } from './PageBuilderContext'

export default function InsertionZone({ insertAt }: { insertAt: number }) {
  const { openTypePicker } = usePageBuilder()
  return (
    <div className="group relative h-6 -my-3 z-20 flex items-center justify-center">
      {/* Thin guide line — faint always, full opacity on hover */}
      <div className="absolute inset-x-12 top-1/2 h-px bg-primary/15 group-hover:bg-primary/60 transition-colors" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openTypePicker(insertAt)
        }}
        className="relative opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-primary text-white text-xs font-medium px-3 py-1 shadow hover:scale-105"
      >
        + Add block
      </button>
    </div>
  )
}
