/**
 * Builds the notification email for a contact-form message, as HTML plus a
 * plain-text fallback. Email clients (Gmail, Outlook) only reliably support
 * table layout and inline styles, so that's all this uses — no <style> block,
 * no web fonts, no external images. Every visitor-supplied value is escaped.
 *
 * Visually it mirrors the site's dark theme: warm off-black, one orange
 * accent, double-bezel cards, serif-italic accents and mono labels.
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
  shell: "#121210",
  card: "#181715",
  raised: "#1f1e1b",
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

const label = (text: string) =>
  `<div style="font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.faint};">${text}</div>`;

function metaCell(title: string, valueHtml: string, colspan = 1) {
  return `
    <td valign="top" colspan="${colspan}" style="padding:16px 18px;background:${C.raised};border:1px solid ${C.line};border-radius:14px;">
      ${label(title)}
      <div style="padding-top:6px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.ink};word-break:break-word;">${valueHtml}</div>
    </td>`;
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

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:44px 14px 56px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- Top bar -->
          <tr>
            <td style="padding:0 6px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${MONO};font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:${C.ink};">
                    Arandia<span style="color:${C.accent};">.</span>dev
                  </td>
                  <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">
                    <span style="color:${C.accent};">&#9679;</span>&nbsp; New inquiry
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Double-bezel card: outer tray + inner core -->
          <tr>
            <td bgcolor="${C.shell}" style="background:${C.shell};border:1px solid ${C.line};border-radius:28px;padding:6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-top:2px solid ${C.accent};border-radius:22px;padding:34px 30px 32px;">

                    <!-- Eyebrow pill -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border:1px solid ${C.line};border-radius:999px;padding:5px 12px;font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">
                          <span style="color:${C.accent};">01</span>&nbsp;&nbsp;/&nbsp;&nbsp;Contact form
                        </td>
                      </tr>
                    </table>

                    <!-- Headline: sans subject + serif-italic accent, like the site's section titles -->
                    <div style="padding-top:22px;font-family:${FONT};font-size:32px;line-height:36px;font-weight:600;letter-spacing:-1px;color:${C.ink};">${safeSubject}</div>
                    <div style="padding-top:6px;font-family:${SERIF};font-style:italic;font-size:24px;line-height:30px;color:${C.accent};">from ${safeName}</div>

                    <!-- Message as an editorial quote -->
                    <div style="padding-top:30px;">${label("Message")}</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td valign="top" width="34" style="width:34px;font-family:${SERIF};font-size:56px;line-height:44px;color:${C.accent};">&ldquo;</td>
                        <td valign="top" style="font-family:${SERIF};font-size:19px;line-height:30px;color:${C.ink};word-break:break-word;">${safeMessage}</td>
                      </tr>
                    </table>

                    <!-- Meta tiles -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;border-collapse:separate;">
                      <tr>
                        ${metaCell("From", safeName)}
                        <td width="8" style="width:8px;font-size:0;line-height:0;">&nbsp;</td>
                        ${metaCell("Received", `${escapeHtml(when)} <span style="color:${C.muted};">PHT</span>`)}
                      </tr>
                      <tr><td colspan="3" height="8" style="height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>
                      <tr>
                        ${metaCell("Reply to", `<a href="mailto:${safeEmail}" style="font-family:${MONO};color:${C.ink};text-decoration:none;">${safeEmail}</a>`, 3)}
                      </tr>
                    </table>

                    <!-- CTA: pill with the arrow in its own island, like the site's buttons -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;">
                      <tr>
                        <td bgcolor="${C.accent}" style="background:${C.accent};border-radius:999px;">
                          <a href="${replyHref}" style="display:block;text-decoration:none;padding:6px 6px 6px 24px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="font-family:${FONT};font-size:14px;font-weight:600;color:${C.accentInk};padding-right:14px;white-space:nowrap;">Reply to ${firstName}</td>
                                <td width="36" height="36" align="center" valign="middle" style="width:36px;height:36px;border-radius:999px;background:#d55a2d;font-family:${FONT};font-size:15px;font-weight:600;color:${C.accentInk};">&#8599;</td>
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

          <!-- Footer -->
          <tr>
            <td style="padding:24px 6px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};">
                <tr>
                  <td style="padding-top:16px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.faint};">
                    Sent from the contact form on your portfolio. Replying goes straight to ${safeName}.
                    <div style="padding-top:10px;font-family:${MONO};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.faint};">
                      Arandia<span style="color:${C.accent};">.</span>dev &nbsp;/&nbsp; Dasmari&ntilde;as, PH
                    </div>
                  </td>
                </tr>
              </table>
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
