import { buildSystemPrompt } from "@/lib/assistant/knowledge";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/*
  Portfolio assistant endpoint. Proxies to Groq's free tier (OpenAI-compatible
  API) so the key never reaches the browser, and streams the reply back as
  plain text. Configure in .env.local / Vercel:
    GROQ_API_KEY  required — without it this returns 503 and the widget falls back
    GROQ_MODEL    optional — defaults to openai/gpt-oss-20b
*/

export const maxDuration = 40;

const MAX_TURNS = 10;
const MAX_CHARS = 500;
const isLimited = createRateLimiter({ limit: 15, windowMs: 10 * 60 * 1000 });

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > MAX_CHARS * (role === "assistant" ? 4 : 1)) return null;
    messages.push({ role, content: text });
  }
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return Response.json({ error: "Assistant not configured" }, { status: 503 });

  if (isLimited(clientIp(request.headers))) {
    return Response.json({ error: "Too many questions — try again in a few minutes." }, { status: 429 });
  }

  let messages: ChatMessage[] | null = null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    // fall through to 400
  }
  if (!messages) return Response.json({ error: "Invalid request" }, { status: 400 });

  const callGroq = () =>
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
        temperature: 0.3,
        max_completion_tokens: 600,
        reasoning_effort: "low",
        stream: true,
      }),
      signal: request.signal,
    }).catch(() => null);

  let upstream = await callGroq();
  // Free-tier per-minute limits recover within seconds: wait it out once so a
  // burst of visitors sees Matte "typing" a little longer instead of an error.
  if (upstream?.status === 429) {
    const body = await upstream.text().catch(() => "");
    const header = Number(upstream.headers.get("retry-after"));
    const hinted = Number(body.match(/try again in ([\d.]+)s/)?.[1]);
    const waitSec = Number.isFinite(header) && header > 0 ? header : hinted;
    if (Number.isFinite(waitSec) && waitSec > 0 && waitSec <= 8) {
      await new Promise((r) => setTimeout(r, waitSec * 1000 + 250));
      upstream = await callGroq();
    } else {
      console.error("Assistant upstream 429:", body.slice(0, 300));
    }
  }

  if (!upstream?.ok || !upstream.body) {
    const status = upstream?.status === 429 ? 429 : 502;
    if (upstream) console.error("Assistant upstream error:", upstream.status, await upstream.text().catch(() => ""));
    return Response.json(
      { error: status === 429 ? "The assistant is busy — try again shortly." : "Assistant unavailable" },
      { status },
    );
  }

  // Groq streams OpenAI-style SSE; forward only the answer text (never reasoning).
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, "").trim();
          if (!data || data === "[DONE]" || !line.startsWith("data:")) continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // ignore keep-alives / partial frames
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
