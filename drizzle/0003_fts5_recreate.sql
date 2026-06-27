-- Fix migration: 0001_fts5.sql created the FTS5 tables in external-content
-- mode (`content='products'`), but our `cas_number` column is derived from
-- JSON (`json_extract(attributes, '$.casNumber')`) — it's not a real column
-- on `products`. SQLite blows up at SELECT time looking for it. Same story
-- for `synonyms` (JSON array) and `description` on product_translations.
--
-- Drop and recreate as self-contained FTS5 tables, then rebuild from the
-- current row data. Triggers in 0001 also get replaced so AFTER INSERT /
-- UPDATE / DELETE keep the FTS index in sync.

DROP TRIGGER IF EXISTS products_ai;
DROP TRIGGER IF EXISTS products_ad;
DROP TRIGGER IF EXISTS products_au;
DROP TRIGGER IF EXISTS product_translations_ai;
DROP TRIGGER IF EXISTS product_translations_ad;
DROP TRIGGER IF EXISTS product_translations_au;

DROP TABLE IF EXISTS products_fts;
DROP TABLE IF EXISTS product_translations_fts;

CREATE VIRTUAL TABLE products_fts USING fts5(
  name,
  cas_number,
  synonyms,
  tokenize="unicode61 remove_diacritics 2",
  prefix='2 3'
);

CREATE VIRTUAL TABLE product_translations_fts USING fts5(
  name,
  description,
  synonyms,
  tokenize="unicode61 remove_diacritics 2",
  prefix='2 3'
);

CREATE TRIGGER products_ai AFTER INSERT ON products BEGIN
  INSERT INTO products_fts(rowid, name, cas_number, synonyms)
  VALUES (
    new.rowid,
    new.name,
    json_extract(new.attributes, '$.casNumber'),
    (SELECT IFNULL(group_concat(value, ' '), '') FROM json_each(new.synonyms))
  );
END;

CREATE TRIGGER products_ad AFTER DELETE ON products BEGIN
  DELETE FROM products_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER products_au AFTER UPDATE ON products BEGIN
  DELETE FROM products_fts WHERE rowid = old.rowid;
  INSERT INTO products_fts(rowid, name, cas_number, synonyms)
  VALUES (
    new.rowid,
    new.name,
    json_extract(new.attributes, '$.casNumber'),
    (SELECT IFNULL(group_concat(value, ' '), '') FROM json_each(new.synonyms))
  );
END;

CREATE TRIGGER product_translations_ai AFTER INSERT ON product_translations BEGIN
  INSERT INTO product_translations_fts(rowid, name, description, synonyms)
  VALUES (
    new.rowid,
    new.name,
    IFNULL(new.description, ''),
    (SELECT IFNULL(group_concat(value, ' '), '') FROM json_each(new.synonyms))
  );
END;

CREATE TRIGGER product_translations_ad AFTER DELETE ON product_translations BEGIN
  DELETE FROM product_translations_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER product_translations_au AFTER UPDATE ON product_translations BEGIN
  DELETE FROM product_translations_fts WHERE rowid = old.rowid;
  INSERT INTO product_translations_fts(rowid, name, description, synonyms)
  VALUES (
    new.rowid,
    new.name,
    IFNULL(new.description, ''),
    (SELECT IFNULL(group_concat(value, ' '), '') FROM json_each(new.synonyms))
  );
END;

-- Backfill from existing data.
INSERT INTO products_fts(rowid, name, cas_number, synonyms)
SELECT
  rowid,
  name,
  json_extract(attributes, '$.casNumber'),
  IFNULL((SELECT group_concat(value, ' ') FROM json_each(synonyms)), '')
FROM products;

INSERT INTO product_translations_fts(rowid, name, description, synonyms)
SELECT
  rowid,
  name,
  IFNULL(description, ''),
  IFNULL((SELECT group_concat(value, ' ') FROM json_each(synonyms)), '')
FROM product_translations;
