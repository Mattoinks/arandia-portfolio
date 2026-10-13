import { afterEach, describe, expect, it, vi } from "vitest";
// after() needs a real request scope; run the callback once the test drains the stream.
const afterQueue: Array<() => unknown> = [];
vi.mock("next/server", () => ({ after: (fn: () => unknown) => void afterQueue.push(fn) }));

import { POST } from "./route";

const flushAfter = async () => {
  while (afterQueue.length) await afterQueue.shift()!();
};

const req = (body: unknown, ip = "1.1.1.1") =>
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/chat", () => {
  it("returns 503 when no API key is configured, so the widget can fall back", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    const res = await POST(req({ messages: [{ role: "user", content: "hi" }] }));
    expect(res.status).toBe(503);
  });

  it("rejects malformed and oversized input", async () => {
    vi.stubEnv("GROQ_API_KEY", "test");
    expect((await POST(req("not json", "2.2.2.2"))).status).toBe(400);
    expect((await POST(req({ messages: [] }, "2.2.2.3"))).status).toBe(400);
    expect((await POST(req({ messages: [{ role: "system", content: "x" }] }, "2.2.2.4"))).status).toBe(400);
    expect((await POST(req({ messages: [{ role: "user", content: "x".repeat(501) }] }, "2.2.2.5"))).status).toBe(400);
  });

  it("rate-limits a single client", async () => {
    vi.stubEnv("GROQ_API_KEY", "test");
    const statuses: number[] = [];
    for (let i = 0; i < 17; i++) statuses.push((await POST(req({ messages: [] }, "9.9.9.9"))).status);
    expect(statuses.slice(0, 15).every((s) => s === 400)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });

  it("streams only the answer text from the upstream SSE", async () => {
    vi.stubEnv("GROQ_API_KEY", "test");
    const sse =
      'data: {"choices":[{"delta":{"reasoning":"thinking..."}}]}\n\n' +
      'data: {"choices":[{"delta":{"content":"He knows "}}]}\n\n' +
      'data: {"choices":[{"delta":{"content":"PostgreSQL."}}]}\n\n' +
      "data: [DONE]\n\n";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(sse, { status: 200 }));
    const res = await POST(req({ messages: [{ role: "user", content: "Does he know SQL?" }] }, "3.3.3.3"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("He knows PostgreSQL.");
  });

  it("emails Matthew when Matte hands a question off", async () => {
    vi.stubEnv("GROQ_API_KEY", "test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const sse = 'data: {"choices":[{"delta":{"content":"Best asked directly. [[HANDOFF]]"}}]}\n\ndata: [DONE]\n\n';
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(sse, { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));
    const res = await POST(req({ messages: [{ role: "user", content: "What is his salary?" }] }, "4.4.4.4"));
    await res.text();
    await flushAfter();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(String((init as RequestInit).body)).subject).toContain("What is his salary?");
  });
});
