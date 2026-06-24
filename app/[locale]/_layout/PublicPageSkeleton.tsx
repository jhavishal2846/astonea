export default function PublicPageSkeleton() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Dark hero — matches PageHeader.tsx visual shell */}
      <div
        className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20 border-b md:min-h-120 lg:min-h-140 xl:min-h-150 2xl:min-h-160"
        style={{ background: '#05060f', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,6,15,0.88) 0%, rgba(5,6,15,0.72) 35%, rgba(5,6,15,0.42) 65%, rgba(5,6,15,0.15) 100%)',
          }}
        />
        <div className="container-wide relative z-20 animate-pulse">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-white/15" />
            <div className="h-3 w-3 rounded bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/20" />
          </div>
          <div className="h-3 w-32 rounded bg-white/25 mb-4" />
          <div className="h-10 lg:h-12 w-3/4 max-w-2xl rounded bg-white/25 mb-3" />
          <div className="h-10 lg:h-12 w-1/2 max-w-2xl rounded bg-white/20 mb-6" />
          <div className="h-4 w-full max-w-xl rounded bg-white/15 mb-2" />
          <div className="h-4 w-5/6 max-w-xl rounded bg-white/15" />
        </div>
      </div>
      {/* Body */}
      <div className="container-wide py-14 lg:py-16 animate-pulse">
        <div className="max-w-3xl">
          <div className="h-3 w-24 rounded bg-slate-200 mb-3" />
          <div className="h-8 lg:h-10 w-2/3 rounded bg-slate-200 mb-6" />
          <div className="h-4 w-full rounded bg-slate-200/70 mb-2" />
          <div className="h-4 w-11/12 rounded bg-slate-200/70 mb-2" />
          <div className="h-4 w-4/5 rounded bg-slate-200/70 mb-2" />
          <div className="h-4 w-3/4 rounded bg-slate-200/70" />
        </div>
      </div>
      <div className="container-wide pb-14 lg:pb-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="h-5 w-2/3 rounded bg-slate-200 mb-3" />
              <div className="h-4 w-full rounded bg-slate-200/70 mb-1.5" />
              <div className="h-4 w-5/6 rounded bg-slate-200/70 mb-1.5" />
              <div className="h-4 w-3/4 rounded bg-slate-200/70" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
