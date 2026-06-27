import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import { sql, desc } from 'drizzle-orm'

/**
 * SQLite-dialect schema, targeting Cloudflare D1. The Postgres schema this
 * replaced used `pgEnum`, `tsvector`, `jsonb`, `uuid`, and partial GIN indexes
 * — see the migration plan for the mapping. Key conventions kept by D1 port:
 *
 *   • Timestamps: stored as INTEGER epoch ms (`mode: 'timestamp_ms'`). Drizzle
 *     round-trips them to JS `Date`. Stays sortable and BETWEEN-friendly.
 *   • Enums: TEXT with a `enum: [...] as const` tuple. TypeScript narrows the
 *     column's value to the union; runtime is plain TEXT.
 *   • JSON columns: TEXT with `mode: 'json'`. Drizzle auto-(de)serializes.
 *   • text[] arrays: serialized as JSON arrays (SQLite has no native arrays).
 *   • UUIDs: TEXT primary keys defaulted via `crypto.randomUUID()`.
 *
 * Full-text search lives in `products_fts` / `product_translations_fts` FTS5
 * virtual tables (declared in `drizzle/0001_fts5.sql`), kept in sync by AFTER
 * triggers — not modelled here.
 */

const ENTITY_TYPES = ['parent', 'subsidiary', 'associate', 'nonprofit'] as const

const DOCUMENT_CATEGORIES = [
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
] as const

const TRANSLATION_JOB_STATUSES = ['queued', 'running', 'completed', 'failed'] as const

const ACTIVITY_ACTIONS = ['create', 'update', 'delete', 'publish', 'unpublish', 'duplicate'] as const

const ACTIVITY_ENTITIES = [
  'document',
  'group_company',
  'user',
  'product',
  'product_category',
] as const

const PRODUCT_STATUSES = [
  'draft',
  'in_review',
  'approved',
  'scheduled',
  'published',
  'archived',
] as const

const PRODUCT_ENTITY_ROLES = ['manufacturer', 'distributor', 'licensor', 'marketer'] as const

const uuidPk = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID())

export const users = sqliteTable('users', {
  id: uuidPk(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
})

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [index('sessions_user_id_idx').on(t.userId)],
)

export const groupCompanies = sqliteTable('group_companies', {
  id: uuidPk(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  entityType: text('entity_type', { enum: ENTITY_TYPES }).notNull(),
  cin: text('cin'),
  websiteUrl: text('website_url'),
  displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
})

export const documents = sqliteTable(
  'documents',
  {
    id: uuidPk(),
    category: text('category', { enum: DOCUMENT_CATEGORIES }).notNull(),
    subcategory: text('subcategory'),
    title: text('title').notNull(),
    description: text('description'),
    fileUrl: text('file_url'),
    // SQLite INTEGER is 64-bit — fits any sane file size.
    fileSizeBytes: integer('file_size_bytes', { mode: 'number' }),
    period: text('period'),
    // ISO `YYYY-MM-DD` text, preserves date semantics without timezone drift.
    eventDate: text('event_date'),
    entityId: text('entity_id').references(() => groupCompanies.id, {
      onDelete: 'set null',
    }),
    externalLink: text('external_link'),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
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

export const languages = sqliteTable('languages', {
  code: text('code').primaryKey(),                 // 'en', 'hi', 'gu'
  name: text('name').notNull(),                    // 'English'
  nativeName: text('native_name').notNull(),       // 'हिन्दी'
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
})

export const documentTranslations = sqliteTable(
  'document_translations',
  {
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.documentId, t.locale] }),
    index('document_translations_locale_idx').on(t.locale),
  ],
)

export const pageMetadataTranslations = sqliteTable(
  'page_metadata_translations',
  {
    pagePath: text('page_path').notNull(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    keywords: text('keywords'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.pagePath, t.locale] }),
    index('page_meta_translations_locale_idx').on(t.locale),
  ],
)

export const uiStrings = sqliteTable(
  'ui_strings',
  {
    key: text('key').notNull(),                    // 'nav.about', 'cta.read_more'
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.key, t.locale] }),
    index('ui_strings_locale_idx').on(t.locale),
  ],
)

export const translationJobs = sqliteTable(
  'translation_jobs',
  {
    id: uuidPk(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    status: text('status', { enum: TRANSLATION_JOB_STATUSES }).notNull().default('queued'),
    totalItems: integer('total_items', { mode: 'number' }).notNull().default(0),
    completedItems: integer('completed_items', { mode: 'number' }).notNull().default(0),
    errorMessage: text('error_message'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }),
    finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [index('translation_jobs_locale_status_idx').on(t.locale, t.status)],
)

export const pages = sqliteTable(
  'pages',
  {
    id: uuidPk(),
    path: text('path').notNull().unique(),
    label: text('label').notNull(),
    isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(true),
    showInNav: integer('show_in_nav', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index('pages_path_idx').on(t.path)],
)

export const pageBlocks = sqliteTable(
  'page_blocks',
  {
    id: uuidPk(),
    pageId: text('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    blockType: text('block_type').notNull(),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
    isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
    props: text('props', { mode: 'json' })
      .$type<Record<string, unknown>>()
      .notNull()
      .$defaultFn(() => ({})),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [index('page_blocks_page_order_idx').on(t.pageId, t.displayOrder)],
)

export const pageBlockTranslations = sqliteTable(
  'page_block_translations',
  {
    blockId: text('block_id')
      .notNull()
      .references(() => pageBlocks.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    props: text('props', { mode: 'json' })
      .$type<Record<string, unknown>>()
      .notNull()
      .$defaultFn(() => ({})),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.blockId, t.locale] }),
    index('page_block_translations_locale_idx').on(t.locale),
  ],
)

export type PageVersionSnapshot = {
  blocks: Array<{
    blockType: string
    displayOrder: number
    isLocked: boolean
    props: Record<string, unknown>
  }>
}

export const pageVersions = sqliteTable(
  'page_versions',
  {
    id: uuidPk(),
    pageId: text('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    snapshot: text('snapshot', { mode: 'json' })
      .$type<PageVersionSnapshot>()
      .notNull(),
    label: text('label'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [index('page_versions_page_created_idx').on(t.pageId, t.createdAt)],
)

/**
 * Per-(path, key, locale) text overrides. Lets admins tweak headlines /
 * paragraphs / labels on existing static pages without a redeploy. The page
 * itself stays as React code; it calls `getPageText(path, key, fallback)` to
 * resolve the override or fall back to the default string.
 */
export const pageTextOverrides = sqliteTable(
  'page_text_overrides',
  {
    pagePath: text('page_path').notNull(),
    key: text('key').notNull(),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedBy: text('updated_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [
    primaryKey({ columns: [t.pagePath, t.key, t.locale] }),
    index('page_text_overrides_path_locale_idx').on(t.pagePath, t.locale),
  ],
)

export const pageMetadata = sqliteTable('page_metadata', {
  pagePath: text('page_path').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  ogImage: text('og_image'),
  keywords: text('keywords'),
  canonical: text('canonical'),
  noIndex: integer('no_index', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  updatedBy: text('updated_by').references(() => users.id, { onDelete: 'set null' }),
})

export const activityLog = sqliteTable(
  'activity_log',
  {
    id: uuidPk(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    userEmail: text('user_email').notNull(),
    action: text('action', { enum: ACTIVITY_ACTIONS }).notNull(),
    entityType: text('entity_type', { enum: ACTIVITY_ENTITIES }).notNull(),
    entityId: text('entity_id'),
    entityTitle: text('entity_title').notNull(),
    detail: text('detail'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
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
export const productCategories = sqliteTable(
  'product_categories',
  {
    id: uuidPk(),
    slug: text('slug').notNull().unique(),
    label: text('label').notNull(),
    description: text('description'),
    heroImage: text('hero_image'),
    icon: text('icon'),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    index('product_categories_active_order_idx')
      .on(t.displayOrder)
      .where(sql`${t.isActive} = 1 AND ${t.deletedAt} IS NULL`),
  ],
)

export const productCategoryTranslations = sqliteTable(
  'product_category_translations',
  {
    categoryId: text('category_id')
      .notNull()
      .references(() => productCategories.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    description: text('description'),
    /** Optional per-locale slug override — null = use canonical productCategories.slug */
    slug: text('slug'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
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
 * status, …) and a JSON `attributes` for category-specific fields (CAS,
 * grade, eNumber, colourIndex, parentApiId, etc). Shape of `attributes` is
 * declared per-category in code, not stored in the DB.
 *
 * Search vectors that used to live here (`searchVector` GIN/tsvector) are now
 * the FTS5 virtual table `products_fts`, kept in sync by AFTER triggers.
 */
export const products = sqliteTable(
  'products',
  {
    id: uuidPk(),
    /** Globally unique canonical slug. Per-locale overrides live in productTranslations.slug. */
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    /** Language-neutral category-specific fields (CAS, grade, eNumber, …). */
    attributes: text('attributes', { mode: 'json' })
      .$type<Record<string, unknown>>()
      .notNull()
      .$defaultFn(() => ({})),
    /** Universal alternate names — Paracetamol ↔ Acetaminophen, INN ↔ USAN. Feeds FTS5. */
    synonyms: text('synonyms', { mode: 'json' })
      .$type<string[]>()
      .notNull()
      .$defaultFn(() => []),
    status: text('status', { enum: PRODUCT_STATUSES }).notNull().default('draft'),
    /** When the product becomes (or became) public. status='scheduled' + future date = release worker flips to 'published'. */
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: text('updated_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (t) => [
    // Hot path: public listings filtered to live products
    index('products_published_order_idx')
      .on(t.displayOrder, t.name)
      .where(sql`${t.status} = 'published' AND ${t.deletedAt} IS NULL`),
    // Admin "recently updated"
    index('products_updated_at_idx').on(desc(t.updatedAt)),
    // (CAS lookup functional index lives in drizzle/0002_cas_index.sql — drizzle-kit
    //  can't emit a `json_extract`-based index because its `.on()` tokenizer
    //  splits on commas inside the SQL template, which mangles json_extract's
    //  arg list. Hand-rolled migration sidesteps the issue.)
    // Worker query: which scheduled products are ready to publish
    index('products_scheduled_idx')
      .on(t.publishedAt)
      .where(sql`${t.status} = 'scheduled'`),
  ],
)

export const productTranslations = sqliteTable(
  'product_translations',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    /** Translatable subset of products.attributes — same key namespace, only translatable keys present. */
    attributes: text('attributes', { mode: 'json' })
      .$type<Record<string, unknown>>()
      .notNull()
      .$defaultFn(() => ({})),
    /** Locale-specific aliases (Ayurvedic / regional trade names). */
    synonyms: text('synonyms', { mode: 'json' })
      .$type<string[]>()
      .notNull()
      .$defaultFn(() => []),
    /** Optional per-locale slug. When set, the public URL prefers this over products.slug. */
    slug: text('slug'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.locale] }),
    index('product_translations_locale_idx').on(t.locale),
    uniqueIndex('product_translations_locale_slug_unique')
      .on(t.locale, t.slug)
      .where(sql`${t.slug} IS NOT NULL`),
  ],
)

/**
 * N:N — a chemical can appear on multiple catalog pages (e.g. sold as both
 * Excipient AND Intermediate). Exactly one row per product has isPrimary=true,
 * which determines the canonical URL category.
 */
export const productToCategories = sqliteTable(
  'product_to_categories',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => productCategories.id, { onDelete: 'restrict' }),
    /** Sub-bucket inside this category (e.g. 'Antiviral' under APIs). Free text. */
    subCategory: text('sub_category'),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
    /** Listing position within this category. */
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.categoryId] }),
    // Enforce: at most one primary category per product
    uniqueIndex('product_to_categories_primary_unique')
      .on(t.productId)
      .where(sql`${t.isPrimary} = 1`),
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
export const productToEntities = sqliteTable(
  'product_to_entities',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    entityId: text('entity_id')
      .notNull()
      .references(() => groupCompanies.id, { onDelete: 'cascade' }),
    role: text('role', { enum: PRODUCT_ENTITY_ROLES }).notNull().default('manufacturer'),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.entityId, t.role] }),
    index('product_to_entities_product_idx').on(t.productId, t.displayOrder),
    index('product_to_entities_entity_idx').on(t.entityId),
  ],
)

/** M:N to existing `documents` table — reuses COA / MSDS / DMF / TDS infrastructure. */
export const productDocuments = sqliteTable(
  'product_documents',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    /** Industry-standard code (COA, MSDS, DMF, CEP/COS, TDS, COPP, FSSAI, WHO-GMP). Not translated. */
    slot: text('slot'),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.documentId] }),
    index('product_documents_product_idx').on(t.productId, t.displayOrder),
    index('product_documents_document_idx').on(t.documentId),
  ],
)

export const productImages = sqliteTable(
  'product_images',
  {
    id: uuidPk(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    width: integer('width', { mode: 'number' }),
    height: integer('height', { mode: 'number' }),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
    displayOrder: integer('display_order', { mode: 'number' }).notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
  },
  (t) => [
    index('product_images_product_order_idx').on(t.productId, t.displayOrder),
    uniqueIndex('product_images_primary_unique')
      .on(t.productId)
      .where(sql`${t.isPrimary} = 1`),
  ],
)

export const productImageTranslations = sqliteTable(
  'product_image_translations',
  {
    imageId: text('image_id')
      .notNull()
      .references(() => productImages.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    altText: text('alt_text').notNull(),
    caption: text('caption'),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
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
export const productUrlAliases = sqliteTable(
  'product_url_aliases',
  {
    id: uuidPk(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    locale: text('locale')
      .notNull()
      .references(() => languages.code, { onDelete: 'cascade' }),
    categorySlug: text('category_slug').notNull(),
    productSlug: text('product_slug').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()).notNull(),
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

/* ─── Inferred types ──────────────────────────────────────────────────────── */

export type ActivityRow = typeof activityLog.$inferSelect
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number]
export type ActivityEntity = (typeof ACTIVITY_ENTITIES)[number]

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
export type TranslationJobStatus = (typeof TRANSLATION_JOB_STATUSES)[number]

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

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]
export type EntityType = (typeof ENTITY_TYPES)[number]

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]
export type ProductEntityRole = (typeof PRODUCT_ENTITY_ROLES)[number]

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
