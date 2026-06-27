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
  }
}

export {}
