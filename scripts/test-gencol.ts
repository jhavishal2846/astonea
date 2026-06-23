import { sql } from 'drizzle-orm'
import { db } from '../lib/db'

const tests = [
  { name: 'coalesce text only', expr: `coalesce(name, '')::text` },
  { name: 'array_to_string text[]', expr: `array_to_string(synonyms, ' ')::text` },
  {
    name: 'tsvector: simple + coalesce',
    expr: `(to_tsvector('simple'::regconfig, coalesce(name, '')))::tsvector`,
  },
  {
    name: 'tsvector: simple + concat',
    expr: `(to_tsvector('simple'::regconfig, coalesce(name, '') || ' ' || coalesce(description, '')))::tsvector`,
  },
  {
    name: 'tsvector: simple + array_to_string only',
    expr: `(to_tsvector('simple'::regconfig, array_to_string(synonyms, ' ')))::tsvector`,
  },
  {
    name: 'tsvector: full product_translations recipe',
    expr: `(to_tsvector('simple'::regconfig, coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || array_to_string(synonyms, ' ')))::tsvector`,
  },
]

async function main() {
  for (const [i, t] of tests.entries()) {
    const tbl = `_gencol_test_${i}`
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS ${tbl}`))
      const isTsvector = t.expr.endsWith('::tsvector')
      const colType = isTsvector ? 'tsvector' : 'text'
      const ddl = `CREATE TABLE ${tbl} (name text, description text, synonyms text[] DEFAULT '{}', gen ${colType} GENERATED ALWAYS AS (${t.expr}) STORED)`
      await db.execute(sql.raw(ddl))
      console.log('OK    :', t.name)
      await db.execute(sql.raw(`DROP TABLE ${tbl}`))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log('FAIL  :', t.name, '->', msg)
    }
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
