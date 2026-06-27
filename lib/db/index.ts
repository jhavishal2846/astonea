import { drizzle } from 'drizzle-orm/d1'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

/**
 * D1 binding is exposed via `getCloudflareContext().env.DB` at request time
 * (and via `wrangler.jsonc` for `next dev` once `initOpenNextCloudflareForDev`
 * has been called). Build the Drizzle client lazily so the binding lookup
 * happens once we're inside an active fetch context — not at module load.
 *
 * Read-replica routing: we wrap the binding in `withSession('first-unconstrained')`
 * so the first read of the request can hit the nearest replica (lowest latency),
 * and every subsequent operation in the same isolate honours the resulting
 * bookmark — so read-your-writes still works within a Server Action that
 * writes then reads. Writes always execute on primary regardless of session
 * constraint; D1 just ensures the session bookmark carries those writes
 * forward to later reads on the same db handle.
 *
 * On runtimes where `withSession` is not yet wired (e.g. older miniflare),
 * we silently fall back to the raw binding — replication is disabled, but
 * everything else works.
 */
let _db: Db | null = null

function buildDb(): Db {
  const { env } = getCloudflareContext()
  if (!env.DB) {
    throw new Error('D1 binding `DB` is missing — check wrangler.jsonc and that initOpenNextCloudflareForDev() ran in next.config.ts')
  }
  const binding =
    typeof env.DB.withSession === 'function'
      ? env.DB.withSession('first-unconstrained')
      : env.DB
  return drizzle(binding as Parameters<typeof drizzle>[0], { schema })
}

export const db: Db = new Proxy({} as Db, {
  get(_, prop) {
    if (!_db) _db = buildDb()
    return Reflect.get(_db, prop)
  },
})

export { schema }
