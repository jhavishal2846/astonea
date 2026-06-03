import 'server-only'
import { db } from '@/lib/db'
import { activityLog, type ActivityAction, type ActivityEntity } from '@/lib/db/schema'
import { getCurrentUser, type SessionUser } from '@/lib/auth/session'

type RecordInput = {
  action: ActivityAction
  entityType: ActivityEntity
  entityId?: string | null
  entityTitle: string
  detail?: string | null
  user?: SessionUser | null
}

/**
 * Append a row to activity_log. Best-effort: never throws — if logging fails,
 * the mutation has already happened and we don't want to mask the real result.
 * Pass `user` to skip the session lookup (saves a round-trip when the caller already has it).
 */
export async function recordActivity(input: RecordInput): Promise<void> {
  try {
    const user = input.user ?? (await getCurrentUser())
    if (!user) return
    await db.insert(activityLog).values({
      userId: user.id,
      userEmail: user.email,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      entityTitle: input.entityTitle,
      detail: input.detail ?? null,
    })
  } catch (err) {
    console.error('[audit] failed to record activity', err)
  }
}
