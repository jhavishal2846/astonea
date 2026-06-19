'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/app/admin/_components/Modal'
import { listPageVersions, restorePageVersion } from '../../_actions'

type Version = {
  id: string
  label: string | null
  createdAt: Date
  blockCount: number
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min${min === 1 ? '' : 's'} ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const days = Math.round(hr / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function PageHistory({ pageId }: { pageId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<Version[] | null>(null)
  const [loading, startLoading] = useTransition()
  const [pending, startTransition] = useTransition()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    startLoading(async () => {
      const rows = await listPageVersions(pageId)
      // Server sends Dates as strings over the action boundary; re-hydrate.
      setVersions(
        rows.map((r) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        })),
      )
    })
  }, [open, pageId])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
      >
        Version history
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Version history"
        description="Auto-snapshots are saved before every edit. Restore any previous state — the current state is snapshotted first, so you can always come back."
        size="lg"
      >
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {loading && !versions && (
            <div className="px-3 py-8 text-center text-sm text-slate-500">
              Loading history…
            </div>
          )}

          {versions && versions.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-slate-500">
              No saved versions yet. They appear automatically as you edit.
            </div>
          )}

          {versions?.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {v.label ?? 'Auto-snapshot'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {relativeTime(v.createdAt)}
                  {' · '}
                  {v.createdAt.toLocaleString()}
                  {' · '}
                  {v.blockCount} block{v.blockCount === 1 ? '' : 's'}
                </p>
              </div>
              {confirmId === v.id ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await restorePageVersion(v.id)
                          setOpen(false)
                          setConfirmId(null)
                          router.refresh()
                        } catch (e) {
                          alert(
                            e instanceof Error ? e.message : 'Failed to restore',
                          )
                        }
                      })
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    Confirm restore
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(v.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Restore
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
