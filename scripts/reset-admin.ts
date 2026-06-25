/**
 * One-shot: upsert the admin login credentials. Email match is
 * case-insensitive against the `users.email` column. Re-runs are safe —
 * the same email gets its password rehashed and updated.
 *
 * Run: npx tsx --env-file=.env scripts/reset-admin.ts
 */
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const EMAIL = 'admin@astonea.com'
const PASSWORD = 'admin#astonea.com'
const NAME = 'Admin'

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not set in environment')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const hash = await bcrypt.hash(PASSWORD, 11)

  const result = (await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${EMAIL.toLowerCase()}, ${hash}, ${NAME})
    ON CONFLICT (email)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING id, email, name
  `) as { id: string; email: string; name: string | null }[]

  console.log('Admin upserted:', result[0])
  console.log(`\nLogin at https://astonea.astonea-cf.workers.dev/admin/login`)
  console.log(`Email:    ${EMAIL}`)
  console.log(`Password: ${PASSWORD}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
