'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { groupCompanies, type EntityType } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'
import { recordActivity } from '@/lib/cms/audit'

const ENTITY_TYPES: EntityType[] = ['parent', 'subsidiary', 'associate', 'nonprofit']

export type CompanyState = { error?: string; ok?: boolean }

async function requireAdmin(): Promise<SessionUser> {
  const u = await getCurrentUser()
  if (!u) throw new Error('Unauthorized')
  return u
}

function readForm(formData: FormData) {
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const entityType = String(formData.get('entityType') ?? '') as EntityType
  const cinRaw = String(formData.get('cin') ?? '').trim()
  const descRaw = String(formData.get('description') ?? '').trim()
  const websiteRaw = String(formData.get('websiteUrl') ?? '').trim()
  const orderRaw = String(formData.get('displayOrder') ?? '0')

  if (!slug) throw new Error('Slug is required')
  if (!name) throw new Error('Name is required')
  if (!ENTITY_TYPES.includes(entityType)) throw new Error('Invalid entity type')

  let websiteUrl: string | null = null
  if (websiteRaw !== '') {
    const normalized = /^https?:\/\//i.test(websiteRaw) ? websiteRaw : `https://${websiteRaw}`
    try {
      const u = new URL(normalized)
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol')
      websiteUrl = u.toString()
    } catch {
      throw new Error('Website URL is invalid')
    }
  }

  return {
    slug,
    name,
    entityType,
    cin: cinRaw === '' ? null : cinRaw,
    description: descRaw === '' ? null : descRaw,
    websiteUrl,
    displayOrder: Number(orderRaw) || 0,
  }
}

export async function createCompany(_prev: CompanyState, formData: FormData): Promise<CompanyState> {
  const user = await requireAdmin()
  let created: { id: string; name: string } | null = null
  try {
    const values = readForm(formData)
    const [row] = await db.insert(groupCompanies).values(values).returning({ id: groupCompanies.id, name: groupCompanies.name })
    created = row
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create' }
  }
  revalidatePath('/admin/group-companies')
  if (created) {
    const row = created
    after(() => recordActivity({
      action: 'create',
      entityType: 'group_company',
      entityId: row.id,
      entityTitle: row.name,
      user,
    }))
  }
  return { ok: true }
}

export async function updateCompany(id: string, _prev: CompanyState, formData: FormData): Promise<CompanyState> {
  const user = await requireAdmin()
  let name = ''
  try {
    const values = readForm(formData)
    name = values.name
    await db.update(groupCompanies).set({ ...values, updatedAt: new Date() }).where(eq(groupCompanies.id, id))
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update' }
  }
  revalidatePath('/admin/group-companies')
  after(() => recordActivity({
    action: 'update',
    entityType: 'group_company',
    entityId: id,
    entityTitle: name,
    user,
  }))
  return { ok: true }
}

export async function deleteCompany(id: string) {
  const user = await requireAdmin()
  const [row] = await db.select({ name: groupCompanies.name }).from(groupCompanies).where(eq(groupCompanies.id, id)).limit(1)
  await db.delete(groupCompanies).where(eq(groupCompanies.id, id))
  revalidatePath('/admin/group-companies')
  if (row) {
    after(() => recordActivity({
      action: 'delete',
      entityType: 'group_company',
      entityId: id,
      entityTitle: row.name,
      user,
    }))
  }
}
