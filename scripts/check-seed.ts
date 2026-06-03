import { sql } from 'drizzle-orm'
import { db } from '../lib/db'
import { documents } from '../lib/db/schema'

async function main() {
  const counts = await db
    .select({ category: documents.category, count: sql<number>`count(*)::int` })
    .from(documents)
    .groupBy(documents.category)
  console.table(counts)
  const total = counts.reduce((a, b) => a + b.count, 0)
  console.log(`TOTAL: ${total}`)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
