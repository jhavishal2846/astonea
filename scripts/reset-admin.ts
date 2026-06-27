/**
 * One-shot: upsert the admin login credentials.
 *
 * Run against local D1:
 *   npx tsx scripts/reset-admin.ts
 *
 * Run against remote D1 (requires `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
 * in env):
 *   npx tsx scripts/reset-admin.ts --remote
 *
 * Re-runs are safe — the same email gets its password rehashed and updated.
 */
import { spawnSync } from 'node:child_process'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { openLocalDb } from '../lib/db/script-client'
import { users } from '../lib/db/schema'

const EMAIL = 'admin@astonea.com'
const PASSWORD = 'admin#astonea.com'
const NAME = 'Admin'

async function main() {
  const remote = process.argv.includes('--remote')
  const hash = await bcrypt.hash(PASSWORD, 11)

  if (remote) {
    const sql = [
      `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)`,
      `VALUES ('${crypto.randomUUID()}', '${EMAIL.toLowerCase()}', '${hash}', '${NAME}', ${Date.now()}, ${Date.now()})`,
      `ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, name = excluded.name, updated_at = excluded.updated_at;`,
    ].join(' ')
    const res = spawnSync(
      'npx',
      ['wrangler', 'd1', 'execute', 'DB', '--remote', '--command', sql],
      { stdio: 'inherit', shell: process.platform === 'win32' },
    )
    if (res.status !== 0) {
      throw new Error(`wrangler exited with code ${res.status}`)
    }
  } else {
    const db = openLocalDb()
    const existing = db.select().from(users).where(eq(users.email, EMAIL.toLowerCase())).all()[0]
    if (existing) {
      db.update(users)
        .set({ passwordHash: hash, name: NAME, updatedAt: new Date() })
        .where(eq(users.id, existing.id))
        .run()
    } else {
      db.insert(users)
        .values({ email: EMAIL.toLowerCase(), passwordHash: hash, name: NAME })
        .run()
    }
  }

  console.log('Admin upserted.')
  console.log(`Email:    ${EMAIL}`)
  console.log(`Password: ${PASSWORD}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
