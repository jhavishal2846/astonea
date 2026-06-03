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

export type DocumentCategory = (typeof documentCategoryEnum.enumValues)[number]
export type EntityType = (typeof entityTypeEnum.enumValues)[number]
