import 'server-only'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tickets } from '@/lib/db/schema'

/**
 * Sequential human-friendly id ("AST-1042"). We compute "next number = max(short_code numeric suffix) + 1"
 * in SQL on the fly — there's no separate counter table. D1 reads cost nothing
 * here and we'd rather avoid an extra schema object that needs migrating.
 *
 * Race: two ticket creates within the same millisecond could collide on this
 * MAX query. We mitigate with `tickets.short_code UNIQUE` and a one-shot retry
 * inside `service.createTicket` — collisions are negligible at our volume.
 */
const PREFIX = 'AST-'
const SEED = 1000

export async function nextShortCode(): Promise<string> {
  const row = (
    await db
      .select({
        max: sql<number>`COALESCE(MAX(CAST(SUBSTR(${tickets.shortCode}, ${PREFIX.length + 1}) AS INTEGER)), 0)`,
      })
      .from(tickets)
  )[0]
  const next = Math.max(SEED, (row?.max ?? 0) + 1)
  return `${PREFIX}${next}`
}
