"use server";

import { headers } from "next/headers";
import { profile } from "@/lib/data";
import { suggestEmail, validateContact, type ContactState } from "@/lib/contact";
import { domainAcceptsMail } from "@/lib/email-domain";
import { renderContactEmail } from "@/lib/contact-email";

/*
  Delivers contact-form messages through Resend's HTTP API.
  Configure in .env.local (see .env.example):
    RESEND_API_KEY      required — without it the form reports that sending is unavailable
    CONTACT_TO_EMAIL    optional — defaults to the profile email
    CONTACT_FROM_EMAIL  optional — defaults to Resend's test sender, which only
                        delivers to your own Resend account email until you verify a domain
*/

// Best-effort, per-instance throttle: a few messages per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    // Collapse whitespace/newlines so a subject can't inject extra header lines.
    subject: String(formData.get("subject") ?? "").replace(/\s+/g, " ").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real people never see this field. Pretend success so bots move on.
  if (String(formData.get("company") ?? "")) return { status: "success" };

  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "A couple of fields need another look.", fieldErrors, values };
  }

  if (!(await domainAcceptsMail(values.email))) {
    const suggestion = suggestEmail(values.email);
    return {
      status: "error",
      message: "Please check your email address.",
      fieldErrors: {
        email: suggestion
          ? `That email domain doesn't accept mail — did you mean ${suggestion}?`
          : "That email domain doesn't seem to exist — check for a typo.",
      },
      values,
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many messages in a short time — please try again in a few minutes.", values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message: `Sending isn't set up yet — email me directly at ${profile.email}.`,
      values,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Display name is quoted because "." is a special character in an email address header.
        from: process.env.CONTACT_FROM_EMAIL || '"ARANDIA.DEV" <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || profile.email],
        reply_to: values.email,
        subject: `${values.subject} — from ${values.name}`,
        ...renderContactEmail(values),
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  } catch (err) {
    console.error("Contact form delivery failed:", err);
    return {
      status: "error",
      message: `Couldn't send right now — please try again, or email ${profile.email}.`,
      values,
    };
  }

  return { status: "success" };
}
