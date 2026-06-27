-- Hand-written follow-on migration: case-insensitive functional index on
-- the CAS number that lives inside `products.attributes` (JSON). Drizzle-kit
-- cannot emit this from schema.ts because its `.on(sql\`…\`)` tokenizer
-- splits the SQL template at top-level commas, which mangles
-- `json_extract(col, '$.path')`'s comma-separated arg list.
--
-- Speeds up the admin "search by CAS" path (lib/products/public-queries.ts
-- and the admin products list page) at the cost of a tiny write-time index
-- update on each product mutation. Safe to drop later if writes get hot.

CREATE INDEX IF NOT EXISTS products_cas_idx
  ON products (lower(json_extract(attributes, '$.casNumber')));
