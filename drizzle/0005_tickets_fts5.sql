-- FTS5 full-text search for tickets. Single virtual table over the joined
-- ticket-header + per-message-body text, kept in sync by AFTER triggers on
-- both `tickets` and `ticket_messages` (mirrors the products precedent in
-- drizzle/0001_fts5.sql).
--
-- Why a single index (not one-per-source): the admin search "find me the
-- ticket where someone mentioned X" is the dominant query and is most natural
-- against a flat row-per-message structure. We store a copy of the header
-- fields (subject, submitter_name, submitter_email, short_code) on every
-- message row so single-table MATCH queries surface tickets via any of those
-- handles without a JOIN.
--
-- `ticket_id UNINDEXED` is stored alongside each row so the caller can
-- group-by / dedupe matches back to their ticket without an extra JOIN.
--
-- Internal-note bodies are *included* in the index — admins search across both
-- public and internal text — but the rendering layer is responsible for not
-- leaking internal messages to the submitter status page (queries there pass
-- `visibility = 'public'` directly against `ticket_messages`, never via FTS).
--
-- Tokenizer: `unicode61 remove_diacritics 2` matches the multi-locale
-- products config — same rationale (no language stemming, fold diacritics).
-- `prefix='2 3'` pre-indexes 2- and 3-char prefixes for short-code lookups
-- like "AST-104..." and admin-side autocomplete.

CREATE VIRTUAL TABLE tickets_fts USING fts5(
  ticket_id UNINDEXED,
  subject,
  body,
  submitter_name,
  submitter_email,
  short_code,
  tokenize="unicode61 remove_diacritics 2",
  prefix='2 3'
);
--> statement-breakpoint

-- ─── tickets table: index the header row (no body yet at ticket creation; the
-- first message is inserted separately and picked up by the messages trigger).
-- We seed FTS with subject + header handles so a ticket is findable the
-- instant it's created, before any messages have landed.

CREATE TRIGGER tickets_ai AFTER INSERT ON tickets BEGIN
  INSERT INTO tickets_fts(rowid, ticket_id, subject, body, submitter_name, submitter_email, short_code)
  VALUES (
    new.rowid,
    new.id,
    new.subject,
    '',
    new.submitter_name,
    IFNULL(new.submitter_email, ''),
    new.short_code
  );
END;
--> statement-breakpoint

CREATE TRIGGER tickets_ad AFTER DELETE ON tickets BEGIN
  -- Wipe the header row plus every message row that pointed at this ticket.
  DELETE FROM tickets_fts WHERE ticket_id = old.id;
END;
--> statement-breakpoint

CREATE TRIGGER tickets_au AFTER UPDATE ON tickets BEGIN
  -- Only the header row (rowid = tickets.rowid) needs refreshing on a ticket
  -- update — the per-message rows are owned by ticket_messages and untouched.
  DELETE FROM tickets_fts WHERE rowid = old.rowid;
  INSERT INTO tickets_fts(rowid, ticket_id, subject, body, submitter_name, submitter_email, short_code)
  VALUES (
    new.rowid,
    new.id,
    new.subject,
    '',
    new.submitter_name,
    IFNULL(new.submitter_email, ''),
    new.short_code
  );
END;
--> statement-breakpoint

-- ─── ticket_messages: one FTS row per message, carrying the parent ticket's
-- header handles so MATCH queries can hit on either the header or the body.
-- We denormalise (subject / submitter_* / short_code) deliberately — FTS5
-- doesn't support JOINs at MATCH time, and stale denormalised values are
-- refreshed by the tickets_au trigger above when the header changes.

CREATE TRIGGER ticket_messages_ai AFTER INSERT ON ticket_messages BEGIN
  INSERT INTO tickets_fts(rowid, ticket_id, subject, body, submitter_name, submitter_email, short_code)
  SELECT
    new.rowid,
    new.ticket_id,
    t.subject,
    new.body,
    t.submitter_name,
    IFNULL(t.submitter_email, ''),
    t.short_code
  FROM tickets t WHERE t.id = new.ticket_id;
END;
--> statement-breakpoint

CREATE TRIGGER ticket_messages_ad AFTER DELETE ON ticket_messages BEGIN
  DELETE FROM tickets_fts WHERE rowid = old.rowid;
END;
--> statement-breakpoint

CREATE TRIGGER ticket_messages_au AFTER UPDATE ON ticket_messages BEGIN
  DELETE FROM tickets_fts WHERE rowid = old.rowid;
  INSERT INTO tickets_fts(rowid, ticket_id, subject, body, submitter_name, submitter_email, short_code)
  SELECT
    new.rowid,
    new.ticket_id,
    t.subject,
    new.body,
    t.submitter_name,
    IFNULL(t.submitter_email, ''),
    t.short_code
  FROM tickets t WHERE t.id = new.ticket_id;
END;
