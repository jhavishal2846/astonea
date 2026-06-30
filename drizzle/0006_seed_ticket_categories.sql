-- Seed default ticket categories for the public contact / career / support
-- forms. Idempotent (INSERT OR IGNORE) — safe to re-run.
--
-- IDs are deterministic strings (not UUIDs) so the seed is reproducible across
-- local / preview / production environments and the slug→id mapping stays
-- stable for the form code that looks them up by slug.

INSERT OR IGNORE INTO ticket_categories (id, slug, sla_hours, sort_order, is_active, created_at, updated_at) VALUES
  ('cat_general-enquiry',           'general-enquiry',           48, 10, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_business-development',      'business-development',      48, 20, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_export',                    'export',                    72, 30, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_procurement',               'procurement',               48, 40, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_investor-relations',        'investor-relations',        24, 50, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_careers',                   'careers',                  168, 60, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_manufacturing-partnership', 'manufacturing-partnership', 48, 70, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('cat_complaint',                 'complaint',                 24, 80, 1, unixepoch() * 1000, unixepoch() * 1000);
--> statement-breakpoint
INSERT OR IGNORE INTO ticket_category_translations (category_id, locale, name, updated_at) VALUES
  ('cat_general-enquiry',           'en', 'General Enquiry',            unixepoch() * 1000),
  ('cat_business-development',      'en', 'Business Development',       unixepoch() * 1000),
  ('cat_export',                    'en', 'Export Enquiry',             unixepoch() * 1000),
  ('cat_procurement',               'en', 'Procurement',                unixepoch() * 1000),
  ('cat_investor-relations',        'en', 'Investor Relations',         unixepoch() * 1000),
  ('cat_careers',                   'en', 'Careers / Job Application',  unixepoch() * 1000),
  ('cat_manufacturing-partnership', 'en', 'Manufacturing Partnership',  unixepoch() * 1000),
  ('cat_complaint',                 'en', 'Complaint / Quality Issue',  unixepoch() * 1000);
