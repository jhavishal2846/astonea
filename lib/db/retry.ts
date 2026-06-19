import 'server-only'

/**
 * Neon's serverless HTTP driver throws `fetch failed` while the free-tier
 * compute wakes from idle-suspend (~1–5 s cold start). It also occasionally
 * surfaces transient network blips. Retry those — but not real errors like
 * constraint violations, syntax errors, or auth failures.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      const msg = e instanceof Error ? e.message : String(e)
      const cause = e instanceof Error && e.cause instanceof Error ? e.cause.message : ''
      const sourceCause =
        e instanceof Error &&
        'cause' in e &&
        (e as { cause?: unknown }).cause &&
        typeof (e as { cause?: { sourceError?: unknown } }).cause === 'object' &&
        (e as { cause?: { sourceError?: unknown } }).cause?.sourceError instanceof Error
          ? ((e as { cause: { sourceError: Error } }).cause.sourceError).message
          : ''
      const transient =
        /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|Error connecting to database/i.test(
          `${msg} ${cause} ${sourceCause}`,
        )
      if (!transient || i === attempts - 1) throw e
      // Linear back-off: 300 ms, 600 ms, 900 ms…
      await new Promise((r) => setTimeout(r, 300 * (i + 1)))
    }
  }
  throw lastErr
}
