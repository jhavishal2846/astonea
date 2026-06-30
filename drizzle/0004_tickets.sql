CREATE TABLE `otp_rate_limits` (
	`key` text NOT NULL,
	`window_start` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`key`, `window_start`)
);
--> statement-breakpoint
CREATE TABLE `otp_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`destination` text NOT NULL,
	`purpose` text NOT NULL,
	`code_hash` text NOT NULL,
	`attempts_remaining` integer DEFAULT 5 NOT NULL,
	`expires_at` integer NOT NULL,
	`consumed_at` integer,
	`ip_address_hash` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `otp_verifications_lookup_idx` ON `otp_verifications` (`destination`,`purpose`,`expires_at`);--> statement-breakpoint
CREATE TABLE `ticket_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`message_id` text,
	`uploaded_by_type` text NOT NULL,
	`uploaded_by_user_id` text,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`r2_key` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`message_id`) REFERENCES `ticket_messages`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ticket_attachments_r2_key_unique` ON `ticket_attachments` (`r2_key`);--> statement-breakpoint
CREATE INDEX `ticket_attachments_ticket_idx` ON `ticket_attachments` (`ticket_id`);--> statement-breakpoint
CREATE TABLE `ticket_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`default_assigned_to_user_id` text,
	`sla_hours` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`default_assigned_to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ticket_categories_slug_unique` ON `ticket_categories` (`slug`);--> statement-breakpoint
CREATE INDEX `ticket_categories_active_sort_idx` ON `ticket_categories` (`is_active`,`sort_order`);--> statement-breakpoint
CREATE TABLE `ticket_category_translations` (
	`category_id` text NOT NULL,
	`locale` text NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`category_id`, `locale`),
	FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`locale`) REFERENCES `languages`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ticket_category_translations_locale_idx` ON `ticket_category_translations` (`locale`);--> statement-breakpoint
CREATE TABLE `ticket_events` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`event_type` text NOT NULL,
	`from_value` text,
	`to_value` text,
	`actor_type` text NOT NULL,
	`actor_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ticket_events_ticket_created_idx` ON `ticket_events` (`ticket_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`author_type` text NOT NULL,
	`author_user_id` text,
	`visibility` text DEFAULT 'public' NOT NULL,
	`body` text NOT NULL,
	`email_sent_at` integer,
	`email_message_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ticket_messages_ticket_created_idx` ON `ticket_messages` (`ticket_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `ticket_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ticket_tags_slug_unique` ON `ticket_tags` (`slug`);--> statement-breakpoint
CREATE TABLE `ticket_to_tags` (
	`ticket_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`ticket_id`, `tag_id`),
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `ticket_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ticket_to_tags_tag_idx` ON `ticket_to_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`public_token` text NOT NULL,
	`short_code` text NOT NULL,
	`submitter_name` text NOT NULL,
	`submitter_email` text NOT NULL,
	`submitter_phone` text NOT NULL,
	`submitter_company` text,
	`submitter_city` text,
	`submitter_locale` text DEFAULT 'en' NOT NULL,
	`phone_verified_at` integer NOT NULL,
	`subject` text NOT NULL,
	`source` text NOT NULL,
	`category_id` text,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`assigned_to_user_id` text,
	`due_by` integer,
	`first_response_at` integer,
	`resolved_at` integer,
	`closed_at` integer,
	`ip_address_hash` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tickets_public_token_unique` ON `tickets` (`public_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `tickets_short_code_unique` ON `tickets` (`short_code`);--> statement-breakpoint
CREATE INDEX `tickets_status_created_idx` ON `tickets` (`status`,"created_at" desc);--> statement-breakpoint
CREATE INDEX `tickets_assignee_status_idx` ON `tickets` (`assigned_to_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `tickets_category_idx` ON `tickets` (`category_id`);--> statement-breakpoint
CREATE INDEX `tickets_submitter_email_idx` ON `tickets` (`submitter_email`);