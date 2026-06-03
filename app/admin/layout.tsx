// Top-level /admin layout is intentionally bare. Authenticated routes live
// under `(authed)/` and use their own chrome layout; `/admin/login` lives at
// this level so it renders without any auth-gated UI.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
