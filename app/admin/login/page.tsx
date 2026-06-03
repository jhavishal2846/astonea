import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const safeNext = next && next.startsWith('/admin') ? next : '/admin'

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-bg">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Admin</p>
          <h1 className="font-display text-3xl font-bold text-ink">Astonea Labs CMS</h1>
          <p className="mt-2 text-sm text-ink-muted">Sign in to manage documents.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <LoginForm next={safeNext} />
        </div>
      </div>
    </main>
  )
}
