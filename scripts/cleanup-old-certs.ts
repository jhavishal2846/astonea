import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../lib/db'
import { documents } from '../lib/db/schema'

async function main() {
  // Old certs were inserted with no subcategory; new ones have subcategory set.
  const deleted = await db
    .delete(documents)
    .where(and(eq(documents.category, 'certification'), isNull(documents.subcategory)))
    .returning({ id: documents.id, title: documents.title })
  console.log(`Deleted ${deleted.length} old-format certifications`)
  deleted.forEach((d) => console.log(`  - ${d.title}`))
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
