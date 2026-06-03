'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth/password'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'

export type UserState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

export async function createAdmin(_prev: UserState, formData: FormData): Promise<UserState> {
  const me = await requireAdmin()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const name = String(formData.get('name') ?? '').trim() || null

  if (!email || !password) return { error: 'Email and password are required.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const existing = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0]
  if (existing) return { error: 'A user with that email already exists.' }

  const passwordHash = await hashPassword(password)
  const [row] = await db.insert(users).values({ email, passwordHash, name }).returning({ id: users.id })
  revalidatePath('/admin/users')
  after(() => recordActivity({
    action: 'create',
    entityType: 'user',
    entityId: row.id,
    entityTitle: email,
    user: me,
  }))
  return { ok: true }
}

export async function deleteAdmin(id: string) {
  const me = await requireAdmin()
  if (me.id === id) throw new Error('You cannot delete yourself.')
  const [row] = await db.select({ email: users.email }).from(users).where(eq(users.id, id)).limit(1)
  await db.delete(users).where(eq(users.id, id))
  revalidatePath('/admin/users')
  if (row) {
    after(() => recordActivity({
      action: 'delete',
      entityType: 'user',
      entityId: id,
      entityTitle: row.email,
      user: me,
    }))
  }
}

export async function resetPassword(id: string, _prev: UserState, formData: FormData): Promise<UserState> {
  const me = await requireAdmin()
  const password = String(formData.get('password') ?? '')
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
  const passwordHash = await hashPassword(password)
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath('/admin/users')
  after(async () => {
    const [row] = await db.select({ email: users.email }).from(users).where(eq(users.id, id)).limit(1)
    if (row) {
      await recordActivity({
        action: 'update',
        entityType: 'user',
        entityId: id,
        entityTitle: row.email,
        detail: 'password reset',
        user: me,
      })
    }
  })
  return { ok: true }
}
