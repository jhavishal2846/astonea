'use client'

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { IconFile } from '@/app/admin/_icons'

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export default function FileDropzone({
  name = 'file',
  existingUrl,
}: {
  name?: string
  existingUrl?: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [over, setOver] = useState(false)

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setOver(false)
    const f = e.dataTransfer.files?.[0]
    if (!f || !inputRef.current) return
    const dt = new DataTransfer()
    dt.items.add(f)
    inputRef.current.files = dt.files
    setFile(f)
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`
          relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors
          ${over ? 'border-primary bg-primary-xlight/40' : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="application/pdf,application/*,image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
          <IconFile className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          {file ? (
            <>
              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatBytes(file.size)} · ready to upload</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-900">Drop a PDF here, or click to choose</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {existingUrl ? 'Uploading replaces the current file.' : 'Files up to 25 MB. Stored in Vercel Blob.'}
              </p>
            </>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              if (inputRef.current) inputRef.current.value = ''
              setFile(null)
            }}
            className="px-2 py-1 text-xs text-slate-500 hover:text-rose-600"
          >
            Clear
          </button>
        )}
      </label>
    </div>
  )
}
