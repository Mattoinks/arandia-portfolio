import { resolve4, resolveMx } from "node:dns/promises";

/*
  Server-side check that an address's domain can actually receive mail, so
  "someone@asdfgh.com" or "someone@gmial.com" is caught before it reaches the
  inbox. It can't prove a specific mailbox exists — providers deliberately
  don't reveal that — only that the domain is real and set up for email.

  Fails open: if DNS is slow or unavailable, the message goes through rather
  than turning away a real person.
*/

const TIMEOUT_MS = 3000;
const cache = new Map<string, boolean>();

const withTimeout = <T>(promise: Promise<T>) =>
  Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS))]);

const isMissing = (err: unknown) => {
  const code = (err as { code?: string }).code;
  return code === "ENOTFOUND" || code === "ENODATA";
};

export async function domainAcceptsMail(email: string): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (!domain) return false;
  const cached = cache.get(domain);
  if (cached !== undefined) return cached;

  let accepts: boolean;
  try {
    const mx = await withTimeout(resolveMx(domain));
    accepts = mx.length > 0;
  } catch (err) {
    if (!isMissing(err)) return true; // DNS trouble, not a verdict — let it through
    // No MX record: mail can still fall back to the domain's A record (RFC 5321).
    try {
      accepts = (await withTimeout(resolve4(domain))).length > 0;
    } catch (aErr) {
      if (!isMissing(aErr)) return true;
      accepts = false;
    }
  }
  cache.set(domain, accepts);
  return accepts;
}
