export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-40 rounded bg-slate-200 mb-2" />
        <div className="h-4 w-64 rounded bg-slate-200/70" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="h-10 bg-slate-100 border-b border-slate-200" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-slate-100 flex items-center gap-4 px-4 last:border-b-0"
          >
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-4 w-1/5 rounded bg-slate-200/70" />
            <div className="ml-auto h-6 w-16 rounded-full bg-slate-200/70" />
          </div>
        ))}
      </div>
    </div>
  )
}
