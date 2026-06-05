import type { ActivityRow } from '@/lib/db/schema'
import { timeAgo } from '@/lib/cms/time'

const ACTION_VERB: Record<string, string> = {
  create:    'created',
  update:    'updated',
  delete:    'deleted',
  publish:   'published',
  unpublish: 'unpublished',
  duplicate: 'duplicated',
}

const ACTION_COLOR: Record<string, string> = {
  create:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  update:    'bg-blue-50 text-blue-700 border-blue-200',
  delete:    'bg-rose-50 text-rose-700 border-rose-200',
  publish:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  unpublish: 'bg-amber-50 text-amber-700 border-amber-200',
  duplicate: 'bg-violet-50 text-violet-700 border-violet-200',
}

const ENTITY_LABEL: Record<string, string> = {
  document:      'document',
  group_company: 'group company',
  user:          'admin',
}

export default function ActivityList({ rows, dense }: { rows: ActivityRow[]; dense?: boolean }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500 italic px-1 py-6">No activity recorded yet.</p>
  }

  return (
    <ul className={`divide-y divide-slate-100 ${dense ? '' : 'text-sm'}`}>
      {rows.map((r) => (
        <li key={r.id} className="py-3 flex items-start gap-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${ACTION_COLOR[r.action] ?? 'bg-slate-100 text-slate-700 border-slate-200'} flex-shrink-0`}>
            {ACTION_VERB[r.action] ?? r.action}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900 leading-snug">
              <span className="font-medium">{r.entityTitle}</span>
              <span className="text-slate-500"> · {ENTITY_LABEL[r.entityType] ?? r.entityType}</span>
              {r.detail && <span className="text-slate-500"> · {r.detail}</span>}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {r.userEmail} · {timeAgo(r.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
