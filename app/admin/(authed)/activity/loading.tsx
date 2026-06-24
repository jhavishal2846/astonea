export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-44 rounded bg-slate-200 mb-2" />
        <div className="h-4 w-80 rounded bg-slate-200/70" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-slate-100 p-4 last:border-b-0 flex items-start gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="h-3 w-1/3 rounded bg-slate-200/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
