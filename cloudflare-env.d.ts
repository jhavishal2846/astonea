/**
 * Declares the runtime bindings exposed to the Worker via `wrangler.jsonc`.
 * Keep this in sync with the [d1_databases], [r2_buckets], [kv_namespaces],
 * [vars], and [assets] entries there. OpenNext's `getCloudflareContext().env`
 * is typed as `CloudflareEnv` — we augment that interface here so call sites
 * get type checking on binding names.
 *
 * Minimal shapes (no @cloudflare/workers-types dep). Add fields as you
 * start using them; runtime API surface is the standard Cloudflare one.
 */
type MinimalR2Bucket = {
  put(
    key: string,
    body: ArrayBuffer | Uint8Array | Blob | string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>
  get(key: string): Promise<unknown>
  delete(key: string): Promise<void>
  head(key: string): Promise<unknown>
}

type MinimalKVNamespace = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
}

/**
 * Minimal D1 binding surface used by drizzle-orm/d1 plus the Sessions API
 * helper we wrap reads in (`withSession('first-unconstrained' | 'first-primary' | string)`).
 */
type MinimalD1PreparedStatement = {
  bind(...values: unknown[]): MinimalD1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run<T = unknown>(): Promise<{ success: boolean; meta: Record<string, unknown>; results?: T[] }>
  all<T = unknown>(): Promise<{ success: boolean; meta: Record<string, unknown>; results: T[] }>
  raw<T = unknown>(): Promise<T[]>
}

type MinimalD1Database = {
  prepare(query: string): MinimalD1PreparedStatement
  batch<T = unknown>(statements: MinimalD1PreparedStatement[]): Promise<Array<{ success: boolean; meta: Record<string, unknown>; results?: T[] }>>
  exec(query: string): Promise<{ count: number; duration: number }>
  withSession?(constraint?: string): MinimalD1Database
}

declare global {
  interface CloudflareEnv {
    // Primary database — Cloudflare D1 (SQLite). Drizzle adapter lives at lib/db/index.ts.
    DB: MinimalD1Database
    // Per-session cache lookups (admin auth). See lib/auth/session.ts.
    SESSION_CACHE: MinimalKVNamespace
    // Bucket of user uploads + oversized static media. Public via cdn.youngfuel.com (today) / cdn.astonea.org (later).
    R2_UPLOADS: MinimalR2Bucket
    // Base URL of the bucket's public custom domain. Lives in wrangler.jsonc [vars].
    R2_PUBLIC_BASE: string
    // OpenNext's incremental-cache R2 bucket (binding name is fixed by @opennextjs/cloudflare).
    NEXT_INC_CACHE_R2_BUCKET: MinimalR2Bucket
    // OpenNext's tag-cache KV namespace.
    NEXT_TAG_CACHE_KV: MinimalKVNamespace
    // Static-asset binding produced by OpenNext.
    ASSETS: { fetch(request: Request): Promise<Response> }

    // Outbound transactional email. Provisioned via the `send_email` binding
    // in wrangler.jsonc. The runtime expects an `EmailMessage` from the
    // `cloudflare:email` module — see lib/email/index.ts.
    EMAIL?: { send(message: unknown): Promise<unknown> }

    // ─── Ticketing system secrets (set via `wrangler secret put`) ────────
    // HMAC key for tickets.public_token signing (>= 32 chars).
    TICKET_TOKEN_SECRET?: string
    // Default From: address + display name for outbound mail.
    EMAIL_FROM_ADDRESS?: string
    EMAIL_FROM_NAME?: string
    // Where new-ticket notifications are sent to (defaults to support@astonea.org).
    TICKET_NOTIFY_ADDRESS?: string

    // ─── Twilio Programmable SMS (primary OTP channel) ───────────────────
    TWILIO_ACCOUNT_SID?: string
    TWILIO_AUTH_TOKEN?: string
    // Use either TWILIO_FROM_NUMBER (single sender) or TWILIO_MESSAGING_SERVICE_SID
    // (sender pool / sticky sender). The SMS channel prefers the messaging service
    // when both are set.
    TWILIO_FROM_NUMBER?: string
    TWILIO_MESSAGING_SERVICE_SID?: string

    // ─── OTP guardrails (optional but recommended for production) ────────
    // Comma-separated ISO-2 list (e.g. "IN,US,GB,AE,SG"). Refuses SMS/WA to
    // anything outside this list — the cheapest defence against toll fraud.
    OTP_ALLOWED_COUNTRY_CODES?: string
    // Per-country hourly issue cap (default 200). Tune down for stricter
    // toll-fraud protection on origins that don't host real submitters.
    OTP_COUNTRY_HOURLY_CAP?: string

    // ─── Turnstile (bot gate on the public form) ─────────────────────────
    TURNSTILE_SECRET_KEY?: string
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string
  }
}

export {}
