import 'server-only'

/**
 * Free translation provider: MyMemory (https://mymemory.translated.net).
 *
 *   - Anonymous: 5,000 words/day from a given IP
 *   - With email: 50,000 words/day — set MYMEMORY_EMAIL in .env.local
 *   - Rate limit: 5 requests/second — we pace at 4 r/s for safety
 *   - One string per request (no batching). For ~500 site strings that's
 *     ~125 seconds; well under typical job timeouts.
 *   - No API key required.
 *
 * To preserve brand and regulatory tokens (Astonea Labs, BSE-SME, SEBI, the
 * CIN, etc.) we substitute them with opaque placeholders before sending and
 * restore them in the response. This stops MyMemory from translating "Astonea
 * Labs" into a phonetic transliteration.
 */

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

// Pace requests below MyMemory's 5/s ceiling.
const MIN_REQUEST_INTERVAL_MS = 260
let lastRequestAt = 0

// Hard cap on each MyMemory request so a stalled TCP connection or slow DNS
// can't freeze the translation loop. Normal responses come back in <500ms;
// 15 seconds gives plenty of headroom for transient slowness without making
// the job feel "stuck" on a hung request.
const FETCH_TIMEOUT_MS = 15_000

// Brand / regulatory tokens that must never be translated.
const PRESERVE_TOKENS = [
  'Astonea Labs Limited',
  'Astonea Labs',
  'Astonea LLC',
  'Astonea Foundation',
  'Astonea One',
  'Ascot Biolabs',
  'Shinto Organics',
  'Chemist India',
  'Damaira Pharmaceuticals',
  'Astonea',
  'L24304CH2017PLC041482',
  'BSE-SME',
  'BSE',
  'NSE',
  'SEBI',
  'LODR',
  'MCA',
  'ROC',
  'AYUSH',
  'FSSAI',
  'USFDA',
  'WHO-GMP',
  'cGMP',
  'GMP',
  'MGT-7',
  'MOA',
  'AOA',
  'CIN',
  'KMP',
  'CSR',
  'AGM',
  'EGM',
  'RTA',
  'RPT',
  'PIT',
  'UPSI',
  'ISO 9001:2015',
  'ISO 9001',
  'ISO',
  'cs@astonea.org',
]

function tokenize(s: string): { masked: string; map: Map<string, string> } {
  let masked = s
  const map = new Map<string, string>()
  let id = 0

  // 1. Brand / regulatory tokens.
  for (const tok of PRESERVE_TOKENS) {
    if (!masked.includes(tok)) continue
    const ph = `TKN${id.toString().padStart(3, '0')}TKN`
    map.set(ph, tok)
    masked = masked.split(tok).join(ph)
    id++
  }

  // 2. HTML tags (Tiptap output from rich-text fields). Replace each <...>
  // chunk with a unique opaque placeholder so MyMemory only translates the
  // visible text between tags.
  masked = masked.replace(/<[^>]+>/g, (tag) => {
    const ph = `TAG${id.toString().padStart(3, '0')}TAG`
    map.set(ph, tag)
    id++
    return ph
  })

  // 3. ICU message placeholders ({year}, {count, plural, …}). next-intl
  // substitutes these at render time, so they must survive the round-trip
  // verbatim — otherwise the rendered string shows literal "{year}" or worse.
  masked = masked.replace(/\{[^}]+\}/g, (icu) => {
    const ph = `ICU${id.toString().padStart(3, '0')}ICU`
    map.set(ph, icu)
    id++
    return ph
  })

  return { masked, map }
}

function detokenize(s: string, map: Map<string, string>): string {
  let out = s
  for (const [ph, tok] of map) {
    // Case-insensitive replace — MyMemory sometimes returns placeholders
    // with stray spacing or capitalisation tweaks.
    const re = new RegExp(ph, 'gi')
    out = out.replace(re, tok)
  }
  // MyMemory occasionally wraps fuzzy translation-memory matches in XLIFF
  // markers like `<g id="1">…</g>`, `<bpt>`, `<ept>`, `<ph>`. Those leak
  // into the message catalog and break next-intl's ICU rich-text parser
  // (INVALID_TAG). Strip them — the inner text is the real translation.
  out = out.replace(/<\/?\s*(?:g|bpt|ept|ph|sub|it|mrk|x|bx|ex)\b[^>]*>/gi, '')
  return out
}

async function paceRequest() {
  const now = Date.now()
  const elapsed = now - lastRequestAt
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed))
  }
  lastRequestAt = Date.now()
}

export class TranslationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
  }
}

type MyMemoryResponse = {
  responseData?: { translatedText?: string; match?: number }
  responseStatus?: number | string
  responseDetails?: string
}

let _emailLogged = false
function logEmailOnce() {
  if (_emailLogged) return
  _emailLogged = true
  const email = process.env.MYMEMORY_EMAIL?.trim()
  if (email) {
    // Mask the local part so we don't dump the whole address in logs.
    const [local, domain] = email.split('@')
    const masked = (local?.slice(0, 2) ?? '') + '***@' + (domain ?? '')
    console.log(`[mymemory] using email ${masked} for 50K/day quota`)
  } else {
    console.log('[mymemory] no MYMEMORY_EMAIL set — falling back to 5K/day anonymous quota')
  }
}

export async function translateOne(
  text: string,
  targetLocale: string,
): Promise<string> {
  if (!text.trim()) return text

  logEmailOnce()

  const { masked, map } = tokenize(text)

  const params = new URLSearchParams({
    q: masked,
    langpair: `en|${targetLocale}`,
  })
  const email = process.env.MYMEMORY_EMAIL?.trim()
  if (email) params.set('de', email)

  await paceRequest()

  let res: Response
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    res = await fetch(`${MYMEMORY_URL}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new TranslationError(`MyMemory request timed out after ${FETCH_TIMEOUT_MS}ms`)
    }
    throw new TranslationError(
      e instanceof Error ? `MyMemory network error: ${e.message}` : 'MyMemory network error',
      e,
    )
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    throw new TranslationError(`MyMemory HTTP ${res.status}: ${await res.text().catch(() => '')}`)
  }

  let body: MyMemoryResponse
  try {
    body = (await res.json()) as MyMemoryResponse
  } catch (e) {
    throw new TranslationError('MyMemory returned non-JSON response', e)
  }

  const status = typeof body.responseStatus === 'string'
    ? parseInt(body.responseStatus, 10)
    : body.responseStatus
  if (status && status >= 400) {
    // Quota exhaustion or temporary error — surface to the caller so the job
    // gets marked failed with a clear message.
    throw new TranslationError(`MyMemory: ${body.responseDetails ?? 'unknown error'}`)
  }

  const translated = body.responseData?.translatedText
  if (!translated) {
    // Fall back to source — better than dropping the string entirely.
    return text
  }
  return detokenize(translated, map)
}

export type TranslatedBatch = Record<string, string>
