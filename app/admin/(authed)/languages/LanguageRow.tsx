'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Language, TranslationJob } from '@/lib/db/schema'
import { generateTranslationsForLocale, deleteLanguage, setLanguageActive } from './_actions'

export default function LanguageRow({
  lang,
  job,
}: {
  lang: Language
  job: TranslationJob | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState<'delete' | null>(null)

  const isDefault = lang.isDefault
  const [errorExpanded, setErrorExpanded] = useState(false)

  // While a translation job is in flight, poll the page every 2s so progress
  // updates without manual refresh. Stops automatically once the job finishes.
  const isInFlight = job?.status === 'running' || job?.status === 'queued'
  useEffect(() => {
    if (!isInFlight) return
    const interval = setInterval(() => {
      router.refresh()
    }, 2000)
    return () => clearInterval(interval)
  }, [isInFlight, router])

  const progressPct =
    job && job.totalItems > 0
      ? Math.min(100, Math.round((job.completedItems / job.totalItems) * 100))
      : 0

  const rawError = job?.errorMessage ?? 'unknown error'
  const ERROR_TRUNCATE_AT = 120
  const errorIsLong = rawError.length > ERROR_TRUNCATE_AT
  const errorShort = errorIsLong ? rawError.slice(0, ERROR_TRUNCATE_AT) + '…' : rawError

  const jobLabel = job
    ? job.status === 'running'
      ? `Running — ${job.completedItems}/${job.totalItems}`
      : job.status === 'completed'
      ? `Completed ${new Date(job.finishedAt ?? job.createdAt).toLocaleString()}`
      : job.status === 'failed'
      ? `Failed: ${errorExpanded ? rawError : errorShort}`
      : 'Queued'
    : '—'

  const jobColor = job
    ? job.status === 'running'
      ? 'bg-blue-100 text-blue-800'
      : job.status === 'completed'
      ? 'bg-emerald-100 text-emerald-800'
      : job.status === 'failed'
      ? 'bg-rose-100 text-rose-800'
      : 'bg-slate-100 text-slate-700'
    : 'bg-slate-100 text-slate-500'

  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-mono text-xs text-slate-700">{lang.code}</td>
      <td className="px-4 py-3 font-medium text-slate-900">{lang.name}</td>
      <td className="px-4 py-3 text-slate-700">{lang.nativeName}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isDefault && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-medium">
              Default
            </span>
          )}
          {lang.isActive ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              Inactive
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 max-w-md">
        <div className="flex flex-col items-start gap-1.5 min-w-0">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${jobColor} ${
              job?.status === 'failed' && errorExpanded ? 'whitespace-pre-wrap break-words max-w-md' : 'truncate max-w-md'
            }`}
            title={job?.status === 'failed' ? rawError : undefined}
          >
            {jobLabel}
          </span>
          {isInFlight && (
            <div className="w-44 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-blue-100 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">{progressPct}%</span>
            </div>
          )}
          {job?.status === 'failed' && errorIsLong && (
            <button
              type="button"
              onClick={() => setErrorExpanded((v) => !v)}
              className="text-[11px] text-slate-500 hover:text-slate-700 underline"
            >
              {errorExpanded ? 'Show less' : 'Show full error'}
            </button>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-2">
          {!isDefault && (
            <>
              <button
                type="button"
                disabled={pending || job?.status === 'running'}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await generateTranslationsForLocale(lang.code)
                      router.refresh()
                    } catch (e) {
                      alert(e instanceof Error ? e.message : 'Failed to start translation')
                    }
                  })
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {job?.status === 'running' ? 'Translating…' : 'Generate translations'}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await setLanguageActive(lang.code, !lang.isActive)
                      router.refresh()
                    } catch (e) {
                      alert(e instanceof Error ? e.message : 'Failed to update')
                    }
                  })
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {lang.isActive ? 'Deactivate' : 'Activate'}
              </button>
              {confirming === 'delete' ? (
                <>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await deleteLanguage(lang.code)
                          router.refresh()
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Failed to delete')
                        }
                      })
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirming('delete')}
                  className="text-xs font-medium px-3 py-1.5 rounded-full text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
