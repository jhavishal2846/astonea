-- FTS5 trigger redesign: 0005 keeps one tickets_fts row per source row (one
-- per tickets insert, one per ticket_messages insert) and uses `new.rowid` as
-- the FTS5 rowid. That works in isolation, but tickets and ticket_messages
-- are independent rowid sequences in SQLite — the first ticket gets rowid 1,
-- the first message gets rowid 1, and both triggers try to INSERT into
-- tickets_fts at rowid 1, hitting SQLITE_CONSTRAINT. Reproduces 100% on a
-- fresh database the moment you create the first ticket with a body.
--
-- Replacement: one row per ticket in tickets_fts. Body is the concatenation
-- of all messages for that ticket, refreshed via UPDATE on every message
-- INSERT/UPDATE/DELETE. FTS5 auto-assigns rowid (we never reference it).
-- Simpler maintenance, zero rowid contention, same MATCH semantics for the
-- caller (subject + body + handles all searchable in one virtual table).

DROP TRIGGER IF EXISTS tickets_ai;--> statement-breakpoint
DROP TRIGGER IF EXISTS tickets_ad;--> statement-breakpoint
DROP TRIGGER IF EXISTS tickets_au;--> statement-breakpoint
DROP TRIGGER IF EXISTS ticket_messages_ai;--> statement-breakpoint
DROP TRIGGER IF EXISTS ticket_messages_ad;--> statement-breakpoint
DROP TRIGGER IF EXISTS ticket_messages_au;--> statement-breakpoint

DROP TABLE IF EXISTS tickets_fts;--> statement-breakpoint

CREATE VIRTUAL TABLE tickets_fts USING fts5(
  ticket_id UNINDEXED,
  subject,
  body,
  submitter_name,
  submitter_email,
  short_code,
  tokenize="unicode61 remove_diacritics 2",
  prefix='2 3'
);--> statement-breakpoint

-- Re-populate from current state. Existing tickets keep their searchability;
-- bodies are reassembled from whatever ticket_messages rows already exist
-- (empty string when none).
INSERT INTO tickets_fts(ticket_id, subject, body, submitter_name, submitter_email, short_code)
SELECT
  t.id,
  t.subject,
  IFNULL((SELECT group_concat(body, ' ') FROM ticket_messages WHERE ticket_id = t.id), ''),
  t.submitter_name,
  IFNULL(t.submitter_email, ''),
  t.short_code
FROM tickets t;--> statement-breakpoint

-- Ticket header sync — INSERT spawns the row, UPDATE refreshes header fields,
-- DELETE cascades away the row (and every message's contribution to body).

CREATE TRIGGER tickets_ai AFTER INSERT ON tickets BEGIN
  INSERT INTO tickets_fts(ticket_id, subject, body, submitter_name, submitter_email, short_code)
  VALUES (
    new.id,
    new.subject,
    '',
    new.submitter_name,
    IFNULL(new.submitter_email, ''),
    new.short_code
  );
END;--> statement-breakpoint

CREATE TRIGGER tickets_ad AFTER DELETE ON tickets BEGIN
  DELETE FROM tickets_fts WHERE ticket_id = old.id;
END;--> statement-breakpoint

CREATE TRIGGER tickets_au AFTER UPDATE ON tickets BEGIN
  UPDATE tickets_fts
  SET subject = new.subject,
      submitter_name = new.submitter_name,
      submitter_email = IFNULL(new.submitter_email, ''),
      short_code = new.short_code
  WHERE ticket_id = new.id;
END;--> statement-breakpoint

-- Message sync — UPDATE the existing ticket row's body to reflect the current
-- concatenation. The subquery runs against ticket_messages WHERE ticket_id=...
-- which after the modifying statement sees the new state (SQLite triggers
-- run inside the same statement, so new/old rows are already visible).

CREATE TRIGGER ticket_messages_ai AFTER INSERT ON ticket_messages BEGIN
  UPDATE tickets_fts
  SET body = IFNULL((SELECT group_concat(body, ' ') FROM ticket_messages WHERE ticket_id = new.ticket_id), '')
  WHERE ticket_id = new.ticket_id;
END;--> statement-breakpoint

CREATE TRIGGER ticket_messages_ad AFTER DELETE ON ticket_messages BEGIN
  UPDATE tickets_fts
  SET body = IFNULL((SELECT group_concat(body, ' ') FROM ticket_messages WHERE ticket_id = old.ticket_id), '')
  WHERE ticket_id = old.ticket_id;
END;--> statement-breakpoint

CREATE TRIGGER ticket_messages_au AFTER UPDATE ON ticket_messages BEGIN
  UPDATE tickets_fts
  SET body = IFNULL((SELECT group_concat(body, ' ') FROM ticket_messages WHERE ticket_id = new.ticket_id), '')
  WHERE ticket_id = new.ticket_id;
END;
