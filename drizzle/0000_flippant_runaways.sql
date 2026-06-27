CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`user_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`entity_title` text NOT NULL,
	`detail` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `activity_log_created_at_idx` ON `activity_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `document_translations` (
	`document_id` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`document_id`, `locale`),
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `document_translations_locale_idx` ON `document_translations` (`locale`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`subcategory` text,
	`title` text NOT NULL,
	`description` text,
	`file_url` text,
	`file_size_bytes` integer,
	`period` text,
	`event_date` text,
	`entity_id` text,
	`external_link` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `group_companies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `documents_category_idx` ON `documents` (`category`);--> statement-breakpoint
CREATE INDEX `documents_category_published_order_idx` ON `documents` (`category`,`is_published`,`display_order`);--> statement-breakpoint
CREATE INDEX `documents_entity_id_idx` ON `documents` (`entity_id`);--> statement-breakpoint
CREATE TABLE `group_companies` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`entity_type` text NOT NULL,
	`cin` text,
	`website_url` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_companies_slug_unique` ON `group_companies` (`slug`);--> statement-breakpoint
CREATE TABLE `languages` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`native_name` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_block_translations` (
	`block_id` text NOT NULL,
	`locale` text NOT NULL,
	`props` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`block_id`, `locale`),
	FOREIGN KEY (`block_id`) REFERENCES `page_blocks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_block_translations_locale_idx` ON `page_block_translations` (`locale`);--> statement-breakpoint
CREATE TABLE `page_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`block_type` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`props` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_blocks_page_order_idx` ON `page_blocks` (`page_id`,`display_order`);--> statement-breakpoint
CREATE TABLE `page_metadata` (
	`page_path` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`og_image` text,
	`keywords` text,
	`canonical` text,
	`no_index` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `page_metadata_translations` (
	`page_path` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`keywords` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`page_path`, `locale`),
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_meta_translations_locale_idx` ON `page_metadata_translations` (`locale`);--> statement-breakpoint
CREATE TABLE `page_text_overrides` (
	`page_path` text NOT NULL,
	`key` text NOT NULL,
	`locale` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	PRIMARY KEY(`page_path`, `key`, `locale`),
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `page_text_overrides_path_locale_idx` ON `page_text_overrides` (`page_path`,`locale`);--> statement-breakpoint
CREATE TABLE `page_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`label` text,
	`created_at` integer NOT NULL,
	`created_by` text,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `page_versions_page_created_idx` ON `page_versions` (`page_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`label` text NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`show_in_nav` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_path_unique` ON `pages` (`path`);--> statement-breakpoint
CREATE INDEX `pages_path_idx` ON `pages` (`path`);--> statement-breakpoint
CREATE TABLE `product_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`hero_image` text,
	`icon` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_categories_slug_unique` ON `product_categories` (`slug`);--> statement-breakpoint
CREATE INDEX `product_categories_active_order_idx` ON `product_categories` (`display_order`) WHERE "product_categories"."is_active" = 1 AND "product_categories"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `product_category_translations` (
	`category_id` text NOT NULL,
	`locale` text NOT NULL,
	`label` text NOT NULL,
	`description` text,
	`slug` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`category_id`, `locale`),
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_category_translations_locale_idx` ON `product_category_translations` (`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_category_translations_locale_slug_unique` ON `product_category_translations` (`locale`,`slug`) WHERE "product_category_translations"."slug" IS NOT NULL;--> statement-breakpoint
CREATE TABLE `product_documents` (
	`product_id` text NOT NULL,
	`document_id` text NOT NULL,
	`slot` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `document_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_documents_product_idx` ON `product_documents` (`product_id`,`display_order`);--> statement-breakpoint
CREATE INDEX `product_documents_document_idx` ON `product_documents` (`document_id`);--> statement-breakpoint
CREATE TABLE `product_image_translations` (
	`image_id` text NOT NULL,
	`locale` text NOT NULL,
	`alt_text` text NOT NULL,
	`caption` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`image_id`, `locale`),
	FOREIGN KEY (`image_id`) REFERENCES `product_images`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_image_translations_locale_idx` ON `product_image_translations` (`locale`);--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`url` text NOT NULL,
	`width` integer,
	`height` integer,
	`is_primary` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_images_product_order_idx` ON `product_images` (`product_id`,`display_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_images_primary_unique` ON `product_images` (`product_id`) WHERE "product_images"."is_primary" = 1;--> statement-breakpoint
CREATE TABLE `product_to_categories` (
	`product_id` text NOT NULL,
	`category_id` text NOT NULL,
	`sub_category` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `category_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_to_categories_primary_unique` ON `product_to_categories` (`product_id`) WHERE "product_to_categories"."is_primary" = 1;--> statement-breakpoint
CREATE INDEX `product_to_categories_listing_idx` ON `product_to_categories` (`category_id`,`sub_category`,`display_order`);--> statement-breakpoint
CREATE INDEX `product_to_categories_product_idx` ON `product_to_categories` (`product_id`);--> statement-breakpoint
CREATE TABLE `product_to_entities` (
	`product_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`role` text DEFAULT 'manufacturer' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `entity_id`, `role`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`entity_id`) REFERENCES `group_companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_to_entities_product_idx` ON `product_to_entities` (`product_id`,`display_order`);--> statement-breakpoint
CREATE INDEX `product_to_entities_entity_idx` ON `product_to_entities` (`entity_id`);--> statement-breakpoint
CREATE TABLE `product_translations` (
	`product_id` text NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`attributes` text NOT NULL,
	`synonyms` text NOT NULL,
	`slug` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`product_id`, `locale`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_translations_locale_idx` ON `product_translations` (`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_translations_locale_slug_unique` ON `product_translations` (`locale`,`slug`) WHERE "product_translations"."slug" IS NOT NULL;--> statement-breakpoint
CREATE TABLE `product_url_aliases` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`locale` text NOT NULL,
	`category_slug` text NOT NULL,
	`product_slug` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_url_aliases_lookup_unique` ON `product_url_aliases` (`locale`,`category_slug`,`product_slug`);--> statement-breakpoint
CREATE INDEX `product_url_aliases_product_idx` ON `product_url_aliases` (`product_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`attributes` text NOT NULL,
	`synonyms` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text,
	`updated_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_published_order_idx` ON `products` (`display_order`,`name`) WHERE "products"."status" = 'published' AND "products"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX `products_updated_at_idx` ON `products` ("updated_at" desc);--> statement-breakpoint
CREATE INDEX `products_scheduled_idx` ON `products` (`published_at`) WHERE "products"."status" = 'scheduled';--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `translation_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`locale` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`total_items` integer DEFAULT 0 NOT NULL,
	`completed_items` integer DEFAULT 0 NOT NULL,
	`error_message` text,
	`started_at` integer,
	`finished_at` integer,
	`created_at` integer NOT NULL,
	`created_by` text,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `translation_jobs_locale_status_idx` ON `translation_jobs` (`locale`,`status`);--> statement-breakpoint
CREATE TABLE `ui_strings` (
	`key` text NOT NULL,
	`locale` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`key`, `locale`),
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ui_strings_locale_idx` ON `ui_strings` (`locale`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);