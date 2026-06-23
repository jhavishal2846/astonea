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
  uniqueIndex,
  primaryKey,
  jsonb,
  customType,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Postgres tsvector — Drizzle has no built-in type for it.
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

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
  'product',
  'product_category',
])

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'in_review',
  'approved',
  'scheduled',
  'published',
  'archived',
])

export const productEntityRoleEnum = pgEnum('product_entity_role', [
  'manufacturer',
  'distributor',
  'licensor',
  'marketer',
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

/* ─── Products ─────────────────────────────────────────────────────────────── */

/**
 * Catalog buckets (APIs, Pellets, Excipients, …). Admin-editable: add a new
 * category here = new public listing page at /products/<slug>, no deploy.
 * Per-category attribute *shape* still lives in code (`lib/products/category-schemas.ts`)
 * so admin forms stay typed and validated.
 */
export const productCategories = pgTable(
  'product_categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    label: text('label').notNull(),
    description: text('description'),
    heroImage: text('hero_image'),
    icon: text('icon'),
    displayOrder: integer('display_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('product_categories_active_order_idx')
      .on(t.displayOrder)
      .where(sql`${t.isActive} = true AND ${t.deletedAt} IS NULL`),
  ],
)

export const productCategoryTranslations = pgTable(
  'product_category_translations',
  {
    categoryId: uuid('category_id')
      .notNull()
      .references(() => productCategories.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    description: text('description'),
    /** Optional per-locale slug override — null = use canonical productCategories.slug */
    slug: text('slug'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.categoryId, t.locale] }),
    index('product_category_translations_locale_idx').on(t.locale),
    uniqueIndex('product_category_translations_locale_slug_unique')
      .on(t.locale, t.slug)
      .where(sql`${t.slug} IS NOT NULL`),
  ],
)

/**
 * Canonical product row. Hybrid: typed core columns for universals (name, slug,
 * status, …) and a JSONB `attributes` for category-specific fields (CAS,
 * grade, eNumber, colourIndex, parentApiId, etc). Shape of `attributes` is
 * declared per-category in code, not stored in the DB.
 */
export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /** Globally unique canonical slug. Per-locale overrides live in productTranslations.slug. */
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    /** Language-neutral category-specific fields (CAS, grade, eNumber, …). */
    attributes: jsonb('attributes')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    /** Universal alternate names — Paracetamol ↔ Acetaminophen, INN ↔ USAN. Feeds searchVector. */
    synonyms: text('synonyms').array().notNull().default([]),
    status: productStatusEnum('status').notNull().default('draft'),
    /** When the product becomes (or became) public. status='scheduled' + future date = release worker flips to 'published'. */
    publishedAt: timestamp('published_at', { withTimezone: true }),
    displayOrder: integer('display_order').notNull().default(0),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    /** Generated tsvector — language-neutral. Per-locale text search lives on productTranslations.searchVector. */
    searchVector: tsvector('search_vector').generatedAlwaysAs(
      // The explicit `::regconfig` cast is load-bearing: without it the
      // unknown-typed 'simple' literal binds to the STABLE `to_tsvector(text)`
      // overload, which Postgres rejects as a generated-column expression.
      sql`to_tsvector('simple'::regconfig,
            coalesce(name,'') || ' ' ||  2472.20
            coalesce(attributes->>'casNumber','') || ' ' ||
            array_join_space(synonyms))`,
    ), 
  },
  (t) => [
    // Hot path: public listings filtered to live products
    index('products_published_order_idx')
      .on(t.displayOrder, t.name)
      .where(sql`${t.status} = 'published' AND ${t.deletedAt} IS NULL`),
    // Admin "recently updated"
    index('products_updated_at_idx').on(sql`${t.updatedAt} DESC`),
    // Full-text search
    index('products_search_idx').using('gin', t.searchVector),
    // Fuzzy/prefix autocomplete on name (requires pg_trgm extension)
    index('products_name_trgm_idx').using('gin', sql`lower(${t.name}) gin_trgm_ops`),
    // CAS lookup (case-insensitive). Pulled out of JSONB for index efficiency.
    index('products_cas_idx').on(sql`lower(${t.attributes}->>'casNumber')`),
    // Worker query: which scheduled products are ready to publish
    index('products_scheduled_idx')
      .on(t.publishedAt)
      .where(sql`${t.status} = 'scheduled'`),
  ],
)

export const productTranslations = pgTable(
  'product_translations',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    /** Translatable subset of products.attributes — same key namespace, only translatable keys present. */
    attributes: jsonb('attributes')
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    /** Locale-specific aliases (Ayurvedic / regional trade names). */
    synonyms: text('synonyms').array().notNull().default([]),
    /** Optional per-locale slug. When set, the public URL prefers this over products.slug. */
    slug: text('slug'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    /**
     * Locale-aware FTS. Uses 'simple' config (no stemming) because Postgres ships
     * stemmers for ~16 languages and we may have locales (hi, gu) outside that set.
     * Trades English stemming for uniform behaviour and an IMMUTABLE generated col.
     *
     * The `'simple'::regconfig` cast is load-bearing — see the products table.
     */
    searchVector: tsvector('search_vector').generatedAlwaysAs(
      sql`to_tsvector('simple'::regconfig,
            coalesce(name,'') || ' ' ||
            coalesce(description,'') || ' ' ||
            array_join_space(synonyms))`,
    ),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.locale] }),
    index('product_translations_locale_idx').on(t.locale),
    uniqueIndex('product_translations_locale_slug_unique')
      .on(t.locale, t.slug)
      .where(sql`${t.slug} IS NOT NULL`),
    index('product_translations_search_idx').using('gin', t.searchVector),
    index('product_translations_name_trgm_idx')
      .using('gin', sql`lower(${t.name}) gin_trgm_ops`),
  ],
)

/**
 * N:N — a chemical can appear on multiple catalog pages (e.g. sold as both
 * Excipient AND Intermediate). Exactly one row per product has isPrimary=true,
 * which determines the canonical URL category.
 */
export const productToCategories = pgTable(
  'product_to_categories',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => productCategories.id, { onDelete: 'restrict' }),
    /** Sub-bucket inside this category (e.g. 'Antiviral' under APIs). Free text. */
    subCategory: text('sub_category'),
    isPrimary: boolean('is_primary').notNull().default(false),
    /** Listing position within this category. */
    displayOrder: integer('display_order').notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.categoryId] }),
    // Enforce: at most one primary category per product
    uniqueIndex('product_to_categories_primary_unique')
      .on(t.productId)
      .where(sql`${t.isPrimary} = true`),
    // Hot path: category listing page with sub-category filter
    index('product_to_categories_listing_idx').on(
      t.categoryId,
      t.subCategory,
      t.displayOrder,
    ),
    index('product_to_categories_product_idx').on(t.productId),
  ],
)

/** N:N — co-manufacturer, exclusive distributor, marketing-only, etc. */
export const productToEntities = pgTable(
  'product_to_entities',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    entityId: uuid('entity_id')
      .notNull()
      .references(() => groupCompanies.id, { onDelete: 'cascade' }),
    role: productEntityRoleEnum('role').notNull().default('manufacturer'),
    displayOrder: integer('display_order').notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.entityId, t.role] }),
    index('product_to_entities_product_idx').on(t.productId, t.displayOrder),
    index('product_to_entities_entity_idx').on(t.entityId),
  ],
)

/** M:N to existing `documents` table — reuses COA / MSDS / DMF / TDS infrastructure. */
export const productDocuments = pgTable(
  'product_documents',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    /** Industry-standard code (COA, MSDS, DMF, CEP/COS, TDS, COPP, FSSAI, WHO-GMP). Not translated. */
    slot: text('slot'),
    displayOrder: integer('display_order').notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.documentId] }),
    index('product_documents_product_idx').on(t.productId, t.displayOrder),
    index('product_documents_document_idx').on(t.documentId),
  ],
)

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    width: integer('width'),
    height: integer('height'),
    isPrimary: boolean('is_primary').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('product_images_product_order_idx').on(t.productId, t.displayOrder),
    uniqueIndex('product_images_primary_unique')
      .on(t.productId)
      .where(sql`${t.isPrimary} = true`),
  ],
)

export const productImageTranslations = pgTable(
  'product_image_translations',
  {
    imageId: uuid('image_id')
      .notNull()
      .references(() => productImages.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    altText: text('alt_text').notNull(),
    caption: text('caption'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.imageId, t.locale] }),
    index('product_image_translations_locale_idx').on(t.locale),
  ],
)

/**
 * Historical URL keepalive. When a product slug or primary category changes,
 * the old URL is written here and middleware 301-redirects it to the current one.
 * Avoids losing inbound links / search-engine rank after edits.
 */
export const productUrlAliases = pgTable(
  'product_url_aliases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    categorySlug: text('category_slug').notNull(),
    productSlug: text('product_slug').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('product_url_aliases_lookup_unique').on(
      t.locale,
      t.categorySlug,
      t.productSlug,
    ),
    index('product_url_aliases_product_idx').on(t.productId),
  ],
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

export type ProductStatus = (typeof productStatusEnum.enumValues)[number]
export type ProductEntityRole = (typeof productEntityRoleEnum.enumValues)[number]

export type ProductCategory = typeof productCategories.$inferSelect
export type NewProductCategory = typeof productCategories.$inferInsert
export type ProductCategoryTranslation = typeof productCategoryTranslations.$inferSelect
export type NewProductCategoryTranslation = typeof productCategoryTranslations.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type ProductTranslation = typeof productTranslations.$inferSelect
export type NewProductTranslation = typeof productTranslations.$inferInsert

export type ProductToCategory = typeof productToCategories.$inferSelect
export type NewProductToCategory = typeof productToCategories.$inferInsert
export type ProductToEntity = typeof productToEntities.$inferSelect
export type NewProductToEntity = typeof productToEntities.$inferInsert

export type ProductDocument = typeof productDocuments.$inferSelect
export type NewProductDocument = typeof productDocuments.$inferInsert

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert
export type ProductImageTranslation = typeof productImageTranslations.$inferSelect
export type NewProductImageTranslation = typeof productImageTranslations.$inferInsert

export type ProductUrlAlias = typeof productUrlAliases.$inferSelect
export type NewProductUrlAlias = typeof productUrlAliases.$inferInsert
