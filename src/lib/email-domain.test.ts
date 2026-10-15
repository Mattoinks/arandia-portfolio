import { beforeEach, describe, expect, it, vi } from "vitest";

const dns = vi.hoisted(() => ({ resolveMx: vi.fn(), resolve4: vi.fn() }));
vi.mock("node:dns/promises", () => ({ ...dns, default: dns }));

const missing = (code: string) => Object.assign(new Error(code), { code });

describe("domainAcceptsMail", () => {
  beforeEach(() => {
    vi.resetModules(); // fresh cache per test
    dns.resolveMx.mockReset();
    dns.resolve4.mockReset();
  });

  it("accepts a domain with mail servers", async () => {
    dns.resolveMx.mockResolvedValue([{ exchange: "mx.example.com", priority: 10 }]);
    const { domainAcceptsMail } = await import("./email-domain");
    expect(await domainAcceptsMail("a@example.com")).toBe(true);
  });

  it("rejects a domain that doesn't exist", async () => {
    dns.resolveMx.mockRejectedValue(missing("ENOTFOUND"));
    dns.resolve4.mockRejectedValue(missing("ENOTFOUND"));
    const { domainAcceptsMail } = await import("./email-domain");
    expect(await domainAcceptsMail("a@asdfgh-not-real.com")).toBe(false);
  });

  it("lets the message through when DNS itself fails", async () => {
    dns.resolveMx.mockRejectedValue(missing("ESERVFAIL"));
    const { domainAcceptsMail } = await import("./email-domain");
    expect(await domainAcceptsMail("a@example.com")).toBe(true);
  });
});
