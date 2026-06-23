/**
 * One-shot DB prerequisites that `drizzle-kit push` cannot emit itself.
 *
 * Run with: `npx tsx --env-file=.env.local scripts/init-db.ts`
 *
 * Must run BEFORE `pnpm db:push` — the products schema declares a GIN index
 * on `lower(name) gin_trgm_ops`, which requires the `pg_trgm` extension to
 * exist at index-creation time.
 */
import { sql } from 'drizzle-orm'
import { db } from '../lib/db'

async function main() {
  console.log('[init-db] Installing pg_trgm extension (no-op if already installed)…')
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`)

  // `array_to_string(text[], text)` is STABLE, not IMMUTABLE, so Postgres
  // rejects it in a generated-column expression. This thin wrapper is
  // semantically identical (array → space-joined text) but declared IMMUTABLE,
  // which is true for this fixed `(text[], ' ')` shape.
  console.log('[init-db] Creating array_join_space() immutable helper…')
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION array_join_space(arr text[])
    RETURNS text
    LANGUAGE sql
    IMMUTABLE
    AS $$ SELECT array_to_string(arr, ' ') $$
  `)

  console.log('[init-db] Done.')
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error('[init-db] FAILED')
    console.error(err)
    process.exit(1)
  },
)
