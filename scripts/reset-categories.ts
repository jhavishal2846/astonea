import { eq, inArray } from 'drizzle-orm'
import { db } from '../lib/db'
import { documents } from '../lib/db/schema'

async function main() {
  const cats: Array<'financial_result' | 'subsidiary_financial'> = [
    'financial_result',
    'subsidiary_financial',
  ]
  const deleted = await db
    .delete(documents)
    .where(inArray(documents.category, cats))
    .returning({ id: documents.id })
  console.log(`Deleted ${deleted.length} rows from ${cats.join(', ')}`)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })

// Quiet unused import warning when we drop `eq` later.
void eq
