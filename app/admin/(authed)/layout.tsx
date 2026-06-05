import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser, deleteCurrentSession } from '@/lib/auth/session'
import Sidebar from './Sidebar'
import { ToastProvider, ToastFromQuery } from '@/app/admin/_components/Toast'

export const dynamic = 'force-dynamic'

async function logout() {
  'use server'
  await deleteCurrentSession()
  redirect('/admin/login')
}

export default async function AdminAuthedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar user={user} logoutAction={logout} />
        <div className="lg:pl-64 min-h-screen flex flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8 pb-12">
            {children}
          </main>
        </div>
      </div>
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>
    </ToastProvider>
  )
}
