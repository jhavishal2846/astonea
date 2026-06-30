/**
 * Static list for the country-code dropdown on the public ticket form. Kept
 * deliberately small (~60 entries) — the goal is "every place we'd realistically
 * accept a support enquiry from", not an exhaustive ISO 3166 dump. Add rows on
 * demand; this is browser-shipped so each row costs real bytes.
 *
 * `dial` is the country calling code without the leading "+"; `iso2` is the
 * ISO 3166-1 alpha-2 country code that `libphonenumber-js` expects.
 *
 * No flag emoji: Windows ships without flag-emoji glyphs and Chrome falls
 * back to rendering the regional-indicator letter pair as text (so 🇮🇳 shows
 * up as the literal text "IN"). Keeping it ASCII avoids that surprise and
 * keeps the option text narrow enough that the native <select> dropdown
 * doesn't blow out on small screens.
 */
export type Country = {
  iso2: string
  name: string
  dial: string
}

export const COUNTRIES: Country[] = [
  { iso2: 'IN', name: 'India', dial: '91' },
  { iso2: 'US', name: 'United States', dial: '1' },
  { iso2: 'GB', name: 'United Kingdom', dial: '44' },
  { iso2: 'AE', name: 'United Arab Emirates', dial: '971' },
  { iso2: 'SG', name: 'Singapore', dial: '65' },
  { iso2: 'AU', name: 'Australia', dial: '61' },
  { iso2: 'CA', name: 'Canada', dial: '1' },
  { iso2: 'DE', name: 'Germany', dial: '49' },
  { iso2: 'FR', name: 'France', dial: '33' },
  { iso2: 'NL', name: 'Netherlands', dial: '31' },
  { iso2: 'CH', name: 'Switzerland', dial: '41' },
  { iso2: 'JP', name: 'Japan', dial: '81' },
  { iso2: 'KR', name: 'South Korea', dial: '82' },
  { iso2: 'CN', name: 'China', dial: '86' },
  { iso2: 'HK', name: 'Hong Kong', dial: '852' },
  { iso2: 'TW', name: 'Taiwan', dial: '886' },
  { iso2: 'MY', name: 'Malaysia', dial: '60' },
  { iso2: 'TH', name: 'Thailand', dial: '66' },
  { iso2: 'PH', name: 'Philippines', dial: '63' },
  { iso2: 'ID', name: 'Indonesia', dial: '62' },
  { iso2: 'VN', name: 'Vietnam', dial: '84' },
  { iso2: 'PK', name: 'Pakistan', dial: '92' },
  { iso2: 'BD', name: 'Bangladesh', dial: '880' },
  { iso2: 'LK', name: 'Sri Lanka', dial: '94' },
  { iso2: 'NP', name: 'Nepal', dial: '977' },
  { iso2: 'SA', name: 'Saudi Arabia', dial: '966' },
  { iso2: 'QA', name: 'Qatar', dial: '974' },
  { iso2: 'KW', name: 'Kuwait', dial: '965' },
  { iso2: 'BH', name: 'Bahrain', dial: '973' },
  { iso2: 'OM', name: 'Oman', dial: '968' },
  { iso2: 'JO', name: 'Jordan', dial: '962' },
  { iso2: 'EG', name: 'Egypt', dial: '20' },
  { iso2: 'ZA', name: 'South Africa', dial: '27' },
  { iso2: 'NG', name: 'Nigeria', dial: '234' },
  { iso2: 'KE', name: 'Kenya', dial: '254' },
  { iso2: 'TR', name: 'Turkey', dial: '90' },
  { iso2: 'IL', name: 'Israel', dial: '972' },
  { iso2: 'IT', name: 'Italy', dial: '39' },
  { iso2: 'ES', name: 'Spain', dial: '34' },
  { iso2: 'PT', name: 'Portugal', dial: '351' },
  { iso2: 'BE', name: 'Belgium', dial: '32' },
  { iso2: 'IE', name: 'Ireland', dial: '353' },
  { iso2: 'SE', name: 'Sweden', dial: '46' },
  { iso2: 'NO', name: 'Norway', dial: '47' },
  { iso2: 'DK', name: 'Denmark', dial: '45' },
  { iso2: 'FI', name: 'Finland', dial: '358' },
  { iso2: 'PL', name: 'Poland', dial: '48' },
  { iso2: 'CZ', name: 'Czechia', dial: '420' },
  { iso2: 'AT', name: 'Austria', dial: '43' },
  { iso2: 'GR', name: 'Greece', dial: '30' },
  { iso2: 'RU', name: 'Russia', dial: '7' },
  { iso2: 'BR', name: 'Brazil', dial: '55' },
  { iso2: 'MX', name: 'Mexico', dial: '52' },
  { iso2: 'AR', name: 'Argentina', dial: '54' },
  { iso2: 'CL', name: 'Chile', dial: '56' },
  { iso2: 'CO', name: 'Colombia', dial: '57' },
  { iso2: 'NZ', name: 'New Zealand', dial: '64' },
]

export const DEFAULT_COUNTRY_ISO2 = 'IN'

export function findCountryByIso2(iso2: string): Country | null {
  const up = iso2.toUpperCase()
  return COUNTRIES.find((c) => c.iso2 === up) ?? null
}
