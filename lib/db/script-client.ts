/**
 * Drizzle client for Node-side scripts that need to read or write the local
 * D1 database file. Cannot use `lib/db/index.ts` here — that builds a client
 * via `getCloudflareContext()`, which only resolves inside a Worker request.
 *
 * Local D1 sits at `.wrangler/state/v3/d1/<binding>/db.sqlite`. We open it
 * via better-sqlite3 and wrap it with `drizzle-orm/better-sqlite3` so the
 * same schema types and query builder work unmodified.
 *
 * For one-shot operations against the *remote* (deployed) D1, prefer:
 *   wrangler d1 execute DB --remote --command="..."
 * or the migration script in `scripts/migrate-neon-to-d1.ts`.
 *
 * Run with: `npx tsx --env-file=.env.local scripts/<your-script>.ts`
 */
import path from 'node:path'
import fs from 'node:fs'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const LOCAL_D1_DIR = path.join('.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject')

function findLocalD1File(): string {
  const override = process.env.LOCAL_D1_PATH
  if (override) return override
  if (!fs.existsSync(LOCAL_D1_DIR)) {
    throw new Error(
      `Local D1 file not found. Run \`npm run db:migrate:local\` first to create it under ${LOCAL_D1_DIR}/.`,
    )
  }
  const files = fs.readdirSync(LOCAL_D1_DIR).filter((f) => f.endsWith('.sqlite'))
  if (files.length === 0) {
    throw new Error(
      `No .sqlite file in ${LOCAL_D1_DIR}. Run \`npm run db:migrate:local\` to materialise the local D1 database.`,
    )
  }
  return path.join(LOCAL_D1_DIR, files[0])
}

export function openLocalDb() {
  const file = findLocalD1File()
  const sqlite = new Database(file)
  sqlite.pragma('journal_mode = WAL')
  return drizzle(sqlite, { schema })
}

export { schema }
