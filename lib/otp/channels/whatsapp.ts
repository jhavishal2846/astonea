import 'server-only'

/**
 * Placeholder for Meta WhatsApp Cloud API delivery. Wiring this up requires:
 *   - a WhatsApp Business Account + Cloud API access (Meta for Developers)
 *   - a pre-approved Authentication template (no free-form OTP body)
 *   - `WHATSAPP_PHONE_NUMBER_ID` + `WHATSAPP_ACCESS_TOKEN` in Workers secrets
 *   - the template name configured on the call below
 *
 * Until then, calls fall through and the issuer downgrades to SMS / email.
 */
export type WhatsappSendResult =
  | { ok: true; id: string }
  | { ok: false; reason: 'not_configured' | 'transient' | 'final_failure' }

export async function sendOtpWhatsapp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _input: { to: string; code: string },
): Promise<WhatsappSendResult> {
  return { ok: false, reason: 'not_configured' }
}
