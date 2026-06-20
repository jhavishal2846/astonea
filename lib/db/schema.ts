import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  bigint,
  date,
  pgEnum,
  index,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core'

export const entityTypeEnum = pgEnum('entity_type', [
  'parent',
  'subsidiary',
  'associate',
  'nonprofit',
])

export const documentCategoryEnum = pgEnum('document_category', [
  'annual_report',
  'financial_result',
  'policy_code_framework',
  'reg30',
  'reg46',
  'subsidiary_financial',
  'certification',
  'agm',
  'egm',
  'shareholding_pattern',
  'trading_window',
  'related_party',
  'corporate_announcement',
  'newspaper_publication',
  'integrated_filing',
  'corporate_document',
])

export const translationJobStatusEnum = pgEnum('translation_job_status', [
  'queued',
  'running',
  'completed',
  'failed',
])

export const activityActionEnum = pgEnum('activity_action', [
  'create',
  'update',
  'delete',
  'publish',
  'unpublish',
  'duplicate',
])

export const activityEntityEnum = pgEnum('activity_entity', [
  'document',
  'group_company',
  'user',
])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [index('sessions_user_id_idx').on(t.userId)],
)

export const groupCompanies = pgTable('group_companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  entityType: entityTypeEnum('entity_type').notNull(),
  cin: text('cin'),
  websiteUrl: text('website_url'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    category: documentCategoryEnum('category').notNull(),
    subcategory: text('subcategory'),
    title: text('title').notNull(),
    description: text('description'),
    fileUrl: text('file_url'),
    fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),
    period: text('period'),
    eventDate: date('event_date'),
    entityId: uuid('entity_id').references(() => groupCompanies.id, {
      onDelete: 'set null',
    }),
    externalLink: text('external_link'),
    displayOrder: integer('display_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('documents_category_idx').on(t.category),
    index('documents_category_published_order_idx').on(
      t.category,
      t.isPublished,
      t.displayOrder,
    ),
    index('documents_entity_id_idx').on(t.entityId),
  ],
)

export const languages = pgTable('languages', {
  code: text('code').primaryKey(),                 // 'en', 'hi', 'gu'
  name: text('name').notNull(),                    // 'English'
  nativeName: text('native_name').notNull(),       // 'हिन्दी'
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const documentTranslations = pgTable(
  'document_translations',
  {
    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.documentId, t.locale] }),
    index('document_translations_locale_idx').on(t.locale),
  ],
)

export const pageMetadataTranslations = pgTable(
  'page_metadata_translations',
  {
    pagePath: text('page_path').notNull(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    keywords: text('keywords'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.pagePath, t.locale] }),
    index('page_meta_translations_locale_idx').on(t.locale),
  ],
)

export const uiStrings = pgTable(
  'ui_strings',
  {
    key: text('key').notNull(),                    // 'nav.about', 'cta.read_more'
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.key, t.locale] }),
    index('ui_strings_locale_idx').on(t.locale),
  ],
)

export const translationJobs = pgTable(
  'translation_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    status: translationJobStatusEnum('status').notNull().default('queued'),
    totalItems: integer('total_items').notNull().default(0),
    completedItems: integer('completed_items').notNull().default(0),
    errorMessage: text('error_message'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [index('translation_jobs_locale_status_idx').on(t.locale, t.status)],
)

export const pages = pgTable(
  'pages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    path: text('path').notNull().unique(),
    label: text('label').notNull(),
    isPublished: boolean('is_published').notNull().default(true),
    showInNav: boolean('show_in_nav').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('pages_path_idx').on(t.path)],
)

export const pageBlocks = pgTable(
  'page_blocks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageId: uuid('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    blockType: text('block_type').notNull(),
    displayOrder: integer('display_order').notNull().default(0),
    isLocked: boolean('is_locked').notNull().default(false),
    props: jsonb('props').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('page_blocks_page_order_idx').on(t.pageId, t.displayOrder)],
)

export const pageBlockTranslations = pgTable(
  'page_block_translations',
  {
    blockId: uuid('block_id')
      .notNull()
      .references(() => pageBlocks.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    props: jsonb('props').notNull().default({}),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.blockId, t.locale] }),
    index('page_block_translations_locale_idx').on(t.locale),
  ],
)

export const pageVersions = pgTable(
  'page_versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageId: uuid('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    /** Snapshot: { blocks: Array<{ blockType, displayOrder, isLocked, props }> } */
    snapshot: jsonb('snapshot').notNull(),
    /** Auto-generated label like "Before adding Hero block" or "Auto-snapshot". */
    label: text('label'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [index('page_versions_page_created_idx').on(t.pageId, t.createdAt)],
)

/**
 * Per-(path, key, locale) text overrides. Lets admins tweak headlines /
 * paragraphs / labels on existing static pages without a redeploy. The page
 * itself stays as React code; it calls `getPageText(path, key, fallback)` to
 * resolve the override or fall back to the default string.
 */
export const pageTextOverrides = pgTable(
  'page_text_overrides',
  {
    pagePath: text('page_path').notNull(),
    key: text('key').notNull(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [
    primaryKey({ columns: [t.pagePath, t.key, t.locale] }),
    index('page_text_overrides_path_locale_idx').on(t.pagePath, t.locale),
  ],
)

export const pageMetadata = pgTable('page_metadata', {
  pagePath: text('page_path').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  ogImage: text('og_image'),
  keywords: text('keywords'),
  canonical: text('canonical'),
  noIndex: boolean('no_index').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
})

export const activityLog = pgTable(
  'activity_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    userEmail: text('user_email').notNull(),
    action: activityActionEnum('action').notNull(),
    entityType: activityEntityEnum('entity_type').notNull(), 
    entityId: uuid('entity_id'),
    entityTitle: text('entity_title').notNull(),
    detail: text('detail'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('activity_log_created_at_idx').on(t.createdAt)],
)

export type ActivityRow = typeof activityLog.$inferSelect
export type ActivityAction = (typeof activityActionEnum.enumValues)[number]
export type ActivityEntity = (typeof activityEntityEnum.enumValues)[number]

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type GroupCompany = typeof groupCompanies.$inferSelect
export type NewGroupCompany = typeof groupCompanies.$inferInsert
export type DocumentRow = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
export type PageMetadataRow = typeof pageMetadata.$inferSelect
export type NewPageMetadata = typeof pageMetadata.$inferInsert

export type Language = typeof languages.$inferSelect
export type NewLanguage = typeof languages.$inferInsert
export type DocumentTranslation = typeof documentTranslations.$inferSelect
export type NewDocumentTranslation = typeof documentTranslations.$inferInsert
export type PageMetadataTranslation = typeof pageMetadataTranslations.$inferSelect
export type NewPageMetadataTranslation = typeof pageMetadataTranslations.$inferInsert
export type UiString = typeof uiStrings.$inferSelect
export type NewUiString = typeof uiStrings.$inferInsert
export type TranslationJob = typeof translationJobs.$inferSelect
export type NewTranslationJob = typeof translationJobs.$inferInsert
export type TranslationJobStatus = (typeof translationJobStatusEnum.enumValues)[number]

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert
export type PageBlock = typeof pageBlocks.$inferSelect
export type NewPageBlock = typeof pageBlocks.$inferInsert
export type PageBlockTranslation = typeof pageBlockTranslations.$inferSelect
export type NewPageBlockTranslation = typeof pageBlockTranslations.$inferInsert
export type PageVersion = typeof pageVersions.$inferSelect
export type NewPageVersion = typeof pageVersions.$inferInsert
export type PageTextOverride = typeof pageTextOverrides.$inferSelect
export type NewPageTextOverride = typeof pageTextOverrides.$inferInsert

export type DocumentCategory = (typeof documentCategoryEnum.enumValues)[number]
export type EntityType = (typeof entityTypeEnum.enumValues)[number]
