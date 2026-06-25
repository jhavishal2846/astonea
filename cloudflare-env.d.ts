/**
 * Declares the runtime bindings exposed to the Worker via `wrangler.jsonc`.
 * Keep this in sync with the [r2_buckets], [kv_namespaces], [vars], and
 * [assets] entries there. OpenNext's `getCloudflareContext().env` is typed
 * as `CloudflareEnv` — we augment that interface here so call sites get
 * type checking on binding names.
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

declare global {
  interface CloudflareEnv {
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
