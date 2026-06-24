'use client'

import { useTransition, useState } from 'react'
import Link from '@/app/_nav/AppLink'
import NextLink from 'next/link'
import { deleteDocument, duplicateDocument, togglePublish } from './_actions'
import { IconCopy, IconEdit, IconExternalLink, IconTrash } from '@/app/admin/_icons'
import { useToast } from '@/app/admin/_components/Toast'

export function ToggleButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [pending, start] = useTransition()
  const toast = useToast()
  const onToggle = () => {
    start(async () => {
      try {
        await togglePublish(id, !isPublished)
        toast.push({
          kind: isPublished ? 'info' : 'success',
          title: isPublished ? 'Document unpublished' : 'Document published',
        })
      } catch (e) {
        toast.error('Could not change status', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onToggle}
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors
        ${isPublished
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
        }
        disabled:opacity-50
      `}
      aria-label={isPublished ? 'Unpublish' : 'Publish'}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {isPublished ? 'Published' : 'Draft'}
    </button>
  )
}

export function RowActions({
  id,
  publicUrl,
  fileUrl,
}: {
  id: string
  publicUrl: string
  fileUrl: string | null
}) {
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const toast = useToast()

  const onDuplicate = () => {
    start(() => duplicateDocument(id))
  }

  const onDelete = () => {
    start(async () => {
      try {
        await deleteDocument(id)
        toast.success('Document deleted')
      } catch (e) {
        toast.error('Could not delete', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open file"
          className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
        >
          <IconExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
      <NextLink
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View on public site"
        className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </NextLink>
      <Link
        href={`/admin/documents/${id}/edit`}
        title="Edit"
        className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
      >
        <IconEdit className="w-3.5 h-3.5" />
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={onDuplicate}
        title="Duplicate"
        className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors disabled:opacity-50"
      >
        <IconCopy className="w-3.5 h-3.5" />
      </button>
      {confirming ? (
        <div className="flex items-center gap-1 pl-2 ml-1 border-l border-slate-200">
          <span className="text-[11px] text-rose-700">Delete?</span>
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="text-[11px] font-semibold text-rose-700 hover:underline disabled:opacity-50"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-[11px] text-slate-500 hover:underline"
          >
            No
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          title="Delete"
          className="p-1.5 rounded-md text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <IconTrash className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
