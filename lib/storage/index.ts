import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Single seam for blob storage. Pure Cloudflare R2 — Vercel Blob path was
 * removed at cutover.
 *
 * Returns the public URL (`<R2_PUBLIC_BASE>/<key>`) that gets persisted into
 * `documents.file_url` and `page_metadata.og_image`. `R2_PUBLIC_BASE` is
 * declared as a `[vars]` entry in `wrangler.jsonc`, not derived from the R2
 * binding — accidental omission there yields `undefined` at runtime even when
 * the bucket binding works fine.
 */
export async function putObject(
  key: string,
  file: Blob | ArrayBuffer | Uint8Array,
  contentType: string,
): Promise<{ url: string }> {
  const { env } = await getCloudflareContext({ async: true })
  const body = file instanceof Blob ? await file.arrayBuffer() : file
  await env.R2_UPLOADS.put(key, body, { httpMetadata: { contentType } })
  return { url: `${env.R2_PUBLIC_BASE}/${key}` }
}
