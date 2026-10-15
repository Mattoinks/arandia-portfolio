/**
 * Builds the notification email for a contact-form message, as HTML plus a
 * plain-text fallback. Email clients (Gmail, Outlook) only reliably support
 * table layout and inline styles, so that's all this uses — no <style> block,
 * no web fonts, no external images. Every visitor-supplied value is escaped.
 *
 * Visually it mirrors the site's dark theme: one 600px warm off-black card
 * with an orange accent line, mono labels and serif-italic accents. Only the
 * card is dark, so it sits cleanly in a wide inbox instead of filling it.
 */

export interface ContactEmailInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt?: Date;
}

// Mirrors the site's dark theme tokens (globals.css .dark).
const C = {
  page: "#0c0c0b",
  card: "#181715",
  ink: "#f2f1ec",
  muted: "#9c9b93",
  faint: "#76756e",
  line: "#2a2925",
  accent: "#f26b3a",
  accentInk: "#0c0c0b",
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
// Instrument Serif / Newsreader can't load in mail clients; Georgia italic is the closest universal match.
const SERIF = "'Instrument Serif','Newsreader',Georgia,'Times New Roman',serif";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatManila(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}



/** Compact version for the email's top line, e.g. "Oct 15 · 7:48 PM". */
function formatManilaShort(date: Date) {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", month: "short", day: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" }).format(date);
  return `${day} &middot; ${time}`;
}

export function renderContactEmail({ name, email, subject, message, sentAt = new Date() }: ContactEmailInput) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const firstName = escapeHtml(name.split(/\s+/)[0] || name);
  const when = formatManila(sentAt);
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const preheader = escapeHtml(`${name}: ${message.replace(/\s+/g, " ").slice(0, 110)}`);

  const initial = escapeHtml((name.trim()[0] || "?").toUpperCase());

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <!-- Only the 600px card is dark; the mail client's own background shows around it. -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:24px 8px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td bgcolor="${C.page}" style="background:${C.page};border:1px solid ${C.line};border-top:3px solid ${C.accent};border-radius:24px;">

              <!-- Header -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:22px 32px;border-bottom:1px solid ${C.line};font-family:${MONO};font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:${C.ink};">
                    Arandia<span style="color:${C.accent};">.</span>dev
                  </td>
                  <td align="right" style="padding:22px 32px;border-bottom:1px solid ${C.line};">
                    <span style="display:inline-block;border:1px solid ${C.line};border-radius:999px;padding:5px 11px;font-family:${MONO};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};white-space:nowrap;">
                      <span style="color:${C.accent};">&#9679;</span>&nbsp; New inquiry
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 32px 34px;">
                    <div style="font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.faint};">
                      Contact form &nbsp;&middot;&nbsp; ${formatManilaShort(sentAt)} PHT
                    </div>
                    <div style="padding-top:14px;font-family:${FONT};font-size:30px;line-height:36px;font-weight:600;letter-spacing:-0.8px;color:${C.ink};word-break:break-word;">${safeSubject}</div>

                    <!-- Sender -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
                      <tr>
                        <td width="44" height="44" align="center" valign="middle" bgcolor="${C.accent}" style="width:44px;height:44px;border-radius:999px;background:${C.accent};font-family:${FONT};font-size:18px;font-weight:700;color:${C.accentInk};">${initial}</td>
                        <td style="padding-left:14px;">
                          <div style="font-family:${SERIF};font-style:italic;font-size:20px;line-height:24px;color:${C.ink};">${safeName}</div>
                          <a href="mailto:${safeEmail}" style="font-family:${MONO};font-size:12px;line-height:20px;color:${C.muted};text-decoration:none;">${safeEmail}</a>
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;">
                      <tr>
                        <td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:22px 24px;">
                          <div style="font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.faint};">Message</div>
                          <div style="padding-top:12px;font-family:${SERIF};font-size:18px;line-height:29px;color:${C.ink};word-break:break-word;">${safeMessage}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Reply -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;">
                      <tr>
                        <td bgcolor="${C.accent}" style="background:${C.accent};border-radius:999px;">
                          <a href="${replyHref}" style="display:block;text-decoration:none;padding:6px 6px 6px 22px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="font-family:${FONT};font-size:14px;font-weight:600;color:${C.accentInk};padding-right:12px;white-space:nowrap;">Reply to ${firstName}</td>
                                <td width="34" height="34" align="center" valign="middle" style="width:34px;height:34px;border-radius:999px;background:#d55a2d;font-family:${FONT};font-size:15px;font-weight:600;color:${C.accentInk};">&#8599;</td>
                              </tr>
                            </table>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer, outside the card -->
          <tr>
            <td align="center" style="padding:18px 16px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">
              Sent from the contact form on your portfolio &middot; replying goes straight to ${safeName}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New message — ${subject}`,
    "",
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Received: ${when} PHT`,
    "",
    message,
    "",
    "—",
    `Reply to this email to answer ${name} directly.`,
  ].join("\n");

  return { html, text };
}
