'use client'

import { useTransition, useState } from 'react'
import Link from '@/app/_nav/AppLink'
import NextLink from 'next/link'
import {
  duplicateProduct,
  restoreProduct,
  setProductStatus,
  softDeleteProduct,
} from './_actions'
import {
  IconCopy,
  IconEdit,
  IconExternalLink,
  IconTrash,
} from '@/app/admin/_icons'
import { useToast } from '@/app/admin/_components/Toast'
import type { ProductStatus } from '@/lib/db/schema'

/** Pill rendered in the Status column. */
export function StatusBadge({ status, deleted }: { status: ProductStatus; deleted: boolean }) {
  if (deleted) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Trashed
      </span>
    )
  }
  const STYLES: Record<ProductStatus, { bg: string; text: string; dot: string; border: string }> = {
    draft:      { bg: 'bg-slate-100',  text: 'text-slate-700',  dot: 'bg-slate-400',  border: 'border-slate-200' },
    in_review:  { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500',  border: 'border-amber-200' },
    approved:   { bg: 'bg-sky-50',     text: 'text-sky-700',    dot: 'bg-sky-500',    border: 'border-sky-200' },
    scheduled:  { bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500', border: 'border-violet-200' },
    published:  { bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500',border: 'border-emerald-200' },
    archived:   { bg: 'bg-zinc-100',   text: 'text-zinc-600',   dot: 'bg-zinc-400',   border: 'border-zinc-200' },
  }
  const LABEL: Record<ProductStatus, string> = {
    draft: 'Draft', in_review: 'In review', approved: 'Approved',
    scheduled: 'Scheduled', published: 'Published', archived: 'Archived',
  }
  const s = STYLES[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {LABEL[status]}
    </span>
  )
}

export function RowActions({
  id,
  slug,
  categorySlug,
  status,
  deleted,
}: {
  id: string
  slug: string
  categorySlug: string | null
  status: ProductStatus
  deleted: boolean
}) {
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const toast = useToast()

  const onPublish = () => {
    start(async () => {
      try {
        await setProductStatus(id, 'published')
        toast.success('Product published')
      } catch (e) {
        toast.error('Could not publish', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const onUnpublish = () => {
    start(async () => {
      try {
        await setProductStatus(id, 'draft')
        toast.info('Reverted to draft')
      } catch (e) {
        toast.error('Could not change status', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const onDuplicate = () => {
    start(() => duplicateProduct(id))
  }

  const onSoftDelete = () => {
    start(async () => {
      try {
        await softDeleteProduct(id)
        toast.success('Product moved to trash')
      } catch (e) {
        toast.error('Could not delete', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const onRestore = () => {
    start(async () => {
      try {
        await restoreProduct(id)
        toast.success('Product restored')
      } catch (e) {
        toast.error('Could not restore', e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const publicUrl =
    categorySlug && !deleted ? `/products/${categorySlug}/${slug}` : null

  if (deleted) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={pending}
          onClick={onRestore}
          className="px-2.5 py-1 rounded-md text-xs font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          Restore
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {publicUrl && (
        <NextLink
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View on public site"
          className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
        >
          <IconExternalLink className="w-3.5 h-3.5" />
        </NextLink>
      )}
      <Link
        href={`/admin/products/${id}/edit`}
        title="Edit"
        className="p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
      >
        <IconEdit className="w-3.5 h-3.5" />
      </Link>
      {status === 'published' ? (
        <button
          type="button"
          disabled={pending}
          onClick={onUnpublish}
          title="Revert to draft"
          className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Unpublish
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={onPublish}
          title="Publish now"
          className="px-2 py-1 rounded-md text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      )}
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
          <span className="text-[11px] text-rose-700">Trash?</span>
          <button
            type="button"
            disabled={pending}
            onClick={onSoftDelete}
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
          title="Move to trash"
          className="p-1.5 rounded-md text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <IconTrash className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
