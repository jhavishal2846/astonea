-- FTS5 full-text search for products. Two virtual tables, one per search
-- source (canonical product row, per-locale translation row). Replaces the
-- Postgres `tsvector` generated columns + GIN indexes + pg_trgm trigram
-- indexes from the pre-D1 schema.
--
-- These are "self-contained" FTS5 tables — they store their own copy of the
-- tokenised text rather than reading it back from the source table. The
-- earlier contentless / external-content variants (`content='products'`)
-- fail at SELECT time because FTS5 expects each FTS column to map to a real
-- column on the source, but `cas_number` and `synonyms` are derived from
-- JSON, not stored as separate columns.
--
-- Storage cost for ~10k products: a few hundred KB. Worth it for FTS5 that
-- actually works.
--
-- Tokenizer: `unicode61 remove_diacritics 2` matches Postgres `'simple'` config
-- behavior (no language stemming, fold diacritics) — correct for the multi-locale
-- catalog where en/hi/gu would otherwise demand three different stemmers.
--
-- `prefix='2 3'` pre-indexes 2- and 3-char prefixes for autocomplete, replacing
-- the trigram GIN that handled fuzzy/prefix lookup on Postgres.

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

-- Sync triggers — keep the FTS index in lockstep with the source rows. Note:
-- `synonyms` and `attributes` are stored as JSON text; we flatten to a single
-- space-separated string so FTS5 tokenizes individual entries correctly.

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
