'use client'

import { useState, useTransition, useRef, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { postAdminReply } from '../_actions'

const MAX_FILES = 8
const MAX_FILE_BYTES = 100 * 1024 * 1024 // mirrors lib/tickets/types.ADMIN_ATTACHMENT_MAX_BYTES

export default function ReplyComposer({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [body, setBody] = useState('')
  const [internal, setInternal] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [dragOver, setDragOver] = useState(false)

  function addFiles(incoming: FileList | File[]) {
    const next = [...files]
    for (const f of Array.from(incoming)) {
      if (f.size === 0) continue
      if (f.size > MAX_FILE_BYTES) {
        setError(`"${f.name}" is larger than 100 MB.`)
        continue
      }
      if (next.length >= MAX_FILES) {
        setError(`Up to ${MAX_FILES} files per reply.`)
        break
      }
      if (next.find((x) => x.name === f.name && x.size === f.size)) continue
      next.push(f)
    }
    setFiles(next)
  }

  function removeFile(i: number) {
    setFiles(files.filter((_, idx) => idx !== i))
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!body.trim()) {
      setError('Reply body is required.')
      return
    }
    const fd = new FormData()
    fd.set('body', body)
    fd.set('visibility', internal ? 'internal' : 'public')
    for (const f of files) fd.append('attachments', f)
    startTransition(async () => {
      const res = await postAdminReply(ticketId, fd)
      if (res.error) {
        setError(res.error)
        return
      }
      setBody('')
      setFiles([])
      router.refresh()
    })
  }

  const surface = internal
    ? 'bg-amber-50/70 border-amber-200'
    : 'bg-white border-slate-200'
  const dropZone = dragOver
    ? 'border-primary/60 bg-primary/5'
    : internal
    ? 'border-amber-200 bg-white/60'
    : 'border-slate-200 bg-slate-50/60'

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl border p-4 space-y-3 ${surface} transition-colors`}>
      {/* Toggle row: public reply ↔ internal note */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 w-fit text-xs">
        <button
          type="button"
          onClick={() => setInternal(false)}
          className={`px-3 py-1 rounded font-semibold transition-colors ${
            !internal ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Public reply
        </button>
        <button
          type="button"
          onClick={() => setInternal(true)}
          className={`px-3 py-1 rounded font-semibold transition-colors ${
            internal ? 'bg-amber-200 text-amber-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Internal note
        </button>
      </div>

      <div className="relative">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          required
          placeholder={
            internal
              ? 'Write a note for the team — the submitter will not see this.'
              : 'Write a reply to the submitter — they\'ll receive an email when you send.'
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-y min-h-24"
        />
        {body.length > 0 && (
          <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono tabular-nums select-none pointer-events-none">
            {body.length}
          </span>
        )}
      </div>

      {/* Drop zone for attachments */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg px-3 py-3 text-center text-xs cursor-pointer transition-colors ${dropZone}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
          className="sr-only"
        />
        <div className="text-slate-600">
          <span className="font-semibold text-slate-800">Click to attach</span>
          <span className="text-slate-400"> or drop files here</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Up to {MAX_FILES} files · 100 MB each
        </div>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${f.size}-${i}`}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-700"
            >
              <span className="truncate max-w-48 font-medium">{f.name}</span>
              <span className="text-slate-400 font-mono tabular-nums">{formatBytes(f.size)}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
                aria-label={`Remove ${f.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div
          className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[11px] text-slate-500">
          {internal
            ? 'Visible to admins only.'
            : 'An email notification will be sent to the submitter.'}
        </p>
        <button
          type="submit"
          disabled={pending || !body.trim()}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ${
            internal
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {pending && (
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-30" />
              <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {pending ? 'Posting…' : internal ? 'Add internal note' : 'Send reply →'}
        </button>
      </div>
    </form>
  )
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
