import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

/**
 * Cloudflare Workers populate `process.env` with secret bindings on the
 * first request, not at module load. Reading `DATABASE_URL` at top-level
 * therefore returns `undefined` during the Worker's cold-start phase and
 * crashes the module. Build the Drizzle client lazily so the env lookup
 * happens once we're inside an active fetch context.
 */
let _db: Db | null = null

function buildDb(): Db {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local, .dev.vars, or as a Worker secret.')
  }
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}

export const db: Db = new Proxy({} as Db, {
  get(_, prop) {
    if (!_db) _db = buildDb()
    return Reflect.get(_db, prop)
  },
})

export { schema }
