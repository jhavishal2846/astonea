import { sql } from 'drizzle-orm'
import { db } from '../lib/db'

async function main() {
  // 1. Raw counts
  console.log('--- raw row counts ---')
  const rows = await db.execute(
    sql`SELECT 'products' AS t, count(*)::int AS n FROM products
        UNION ALL
        SELECT 'product_to_categories', count(*)::int FROM product_to_categories
        UNION ALL
        SELECT 'product_categories', count(*)::int FROM product_categories
        UNION ALL
        SELECT 'product_translations', count(*)::int FROM product_translations`,
  )
  console.log(rows.rows ?? rows)

  // 2. Status distribution
  console.log('--- products by status ---')
  const byStatus = await db.execute(
    sql`SELECT status, count(*)::int AS n FROM products GROUP BY status ORDER BY n DESC`,
  )
  console.log(byStatus.rows ?? byStatus)

  // 3. Per-category productCount using the EXACT subquery from public-queries.ts
  console.log('--- product count per active category (subquery used by landing page) ---')
  const counts = await db.execute(
    sql`SELECT pc.slug, pc.label, (
          SELECT count(*)::int
          FROM product_to_categories ptc
          JOIN products p ON p.id = ptc.product_id
          WHERE ptc.category_id = pc.id
            AND p.status = 'published' AND p.deleted_at IS NULL
        ) AS product_count
        FROM product_categories pc
        WHERE pc.is_active = true AND pc.deleted_at IS NULL
        ORDER BY pc.display_order, pc.label`,
  )
  console.log(counts.rows ?? counts)

  // 4. Sanity: a few sample pivot rows + their product status
  console.log('--- sample pivot rows ---')
  const sample = await db.execute(
    sql`SELECT ptc.product_id, ptc.category_id, ptc.is_primary, p.status, p.slug, p.name
        FROM product_to_categories ptc
        JOIN products p ON p.id = ptc.product_id
        LIMIT 5`,
  )
  console.log(sample.rows ?? sample)
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
