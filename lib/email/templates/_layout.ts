/**
 * Shared transactional-email shell. Inline styles only (no CSS classes —
 * inboxes strip <style>) and a single sans-serif stack for portability. The
 * design intentionally avoids the dark-grey "look at our brand" gradients
 * that get stuck in promo tabs and lean toward terse, server-notice style
 * which lands in primary inboxes.
 */
export function emailShell({
  preheader,
  body,
}: {
  /** Hidden preview text shown by inbox clients next to the subject. */
  preheader: string
  /** Inner HTML — already escaped by the caller. */
  body: string
}): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Astonea</title>
</head>
<body style="margin:0;padding:0;background:#f7f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f8fa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #e2e8f0;">
              <span style="font-weight:700;letter-spacing:.06em;color:#0f172a;font-size:14px;">ASTONEA LABS</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-size:14px;line-height:1.55;color:#0f172a;">${body}</td>
          </tr>
          <tr>
            <td style="padding:18px 28px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:12px;">
              You're receiving this because someone submitted an enquiry to Astonea Labs using this address.
              <br>If that wasn't you, you can safely ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
