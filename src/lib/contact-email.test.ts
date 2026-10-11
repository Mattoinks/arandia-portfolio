import { describe, expect, it } from "vitest";
import { escapeHtml, renderContactEmail } from "./contact-email";

const base = {
  name: "Ana Reyes",
  email: "ana@studio.ph",
  subject: "Freelance project",
  message: "Hi!\nLine two.",
  sentAt: new Date("2026-10-12T04:30:00Z"),
};

describe("renderContactEmail", () => {
  it("escapes visitor input so it can't inject markup into the inbox", () => {
    const { html } = renderContactEmail({
      ...base,
      name: '<img src=x onerror="alert(1)">',
      message: "<script>steal()</script>",
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("keeps line breaks in the message and builds a reply link", () => {
    const { html } = renderContactEmail(base);
    expect(html).toContain("Hi!<br>Line two.");
    expect(html).toContain("mailto:ana%40studio.ph?subject=Re%3A%20Freelance%20project");
  });

  it("includes a plain-text fallback with the essentials", () => {
    const { text } = renderContactEmail(base);
    expect(text).toContain("Ana Reyes");
    expect(text).toContain("ana@studio.ph");
    expect(text).toContain("Hi!\nLine two.");
  });

  it("escapes all HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});
