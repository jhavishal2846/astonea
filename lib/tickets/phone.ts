import 'server-only'
import { parsePhoneNumberWithError, type CountryCode } from 'libphonenumber-js/max'
import { findCountryByIso2 } from './countries'

export type ParsedPhone = {
  /** E.164 normalised, e.g. "+919812345678". Safe to store and feed to Twilio. */
  e164: string
  /** ISO 3166-1 alpha-2 — derived from the supplied country, not the parsed number, because callers always tag the country explicitly. */
  iso2: string
  /** ITU calling code without the leading "+". */
  dialCode: string
}

export type PhoneParseError =
  | { ok: false; reason: 'unsupported_country' }
  | { ok: false; reason: 'invalid_number' }

export type PhoneParseResult = { ok: true; phone: ParsedPhone } | PhoneParseError

/**
 * Parse `(iso2, nationalNumber)` → E.164. Refuses unknown country codes and
 * numbers that `libphonenumber-js` flags as invalid (wrong length, bogus
 * prefix, etc). We do this _before_ asking Twilio so we don't spend an SMS on
 * malformed input. National number may contain spaces, dashes, parens —
 * libphonenumber strips them; we just guard against an empty rest.
 */
export function parsePhone(iso2: string, nationalNumber: string): PhoneParseResult {
  const country = findCountryByIso2(iso2)
  if (!country) return { ok: false, reason: 'unsupported_country' }

  const cleaned = nationalNumber.replace(/[^\d+]/g, '')
  if (!cleaned) return { ok: false, reason: 'invalid_number' }

  try {
    const parsed = parsePhoneNumberWithError(cleaned, country.iso2 as CountryCode)
    if (!parsed.isValid()) return { ok: false, reason: 'invalid_number' }
    return {
      ok: true,
      phone: {
        e164: parsed.number,
        iso2: country.iso2,
        dialCode: country.dial,
      },
    }
  } catch {
    return { ok: false, reason: 'invalid_number' }
  }
}
