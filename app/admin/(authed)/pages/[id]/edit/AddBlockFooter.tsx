'use client'

import { usePageBuilder } from './PageBuilderContext'

export default function AddBlockFooter({ insertAt }: { insertAt: number }) {
  const { openTypePicker } = usePageBuilder()
  return (
    <div className="px-6 py-6 border-t border-dashed border-slate-200 flex items-center justify-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openTypePicker(insertAt)
        }}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
      >
        + Add block
      </button>
    </div>
  )
}
