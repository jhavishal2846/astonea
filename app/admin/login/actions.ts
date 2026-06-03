'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, setSessionCookie } from '@/lib/auth/session'

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/admin')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const row = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0]
  if (!row) return { error: 'Invalid email or password.' }

  const ok = await verifyPassword(password, row.passwordHash)
  if (!ok) return { error: 'Invalid email or password.' }

  const session = await createSession(row.id)
  await setSessionCookie(session.id, session.expiresAt)

  const safeNext = next.startsWith('/admin') ? next : '/admin'
  redirect(safeNext)
}
