import { like, sql, type SQL, type SQLWrapper } from 'drizzle-orm'

/**
 * Case-insensitive LIKE for D1/SQLite. SQLite's built-in LIKE folds ASCII case
 * only, so non-ASCII columns (hi/gu locales, accented chemical names) miss
 * matches that the previous Postgres `ilike` would have caught. Wrapping the
 * column in `lower()` and lowercasing the pattern restores Unicode case
 * insensitivity at the cost of a function call per row.
 *
 * Usage: `ilikeCi(documents.title, `%${q}%`)` — caller adds the `%` wildcards.
 */
export function ilikeCi(col: SQLWrapper, pattern: string): SQL {
  return like(sql`lower(${col})`, pattern.toLowerCase())
}

/**
 * Build an FTS5 MATCH expression from a free-text user query. Each token is
 * double-quoted (to neutralise FTS5 operators users might type by accident
 * — `AND`, `OR`, `NOT`, parens, `-`, `^`, `*`, `:`) and gets a trailing `*`
 * for prefix matching, which is how the autocomplete experience replaces
 * the trigram index Postgres used to provide.
 *
 * Empty input returns null so call sites can skip the predicate entirely.
 */
export function ftsQuery(q: string | null | undefined): string | null {
  if (!q) return null
  const tokens = q
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/"/g, ''))
    .filter((t) => t.length > 0)
  if (tokens.length === 0) return null
  return tokens.map((t) => `"${t}"*`).join(' ')
}
