import { describe, expect, it } from "vitest";
import { ageOn, buildSystemPrompt, HANDOFF, parseReply, SUGGESTED } from "./knowledge";
import { education, profile, projects } from "@/lib/data";

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt();

  it("grounds the assistant in the portfolio's real data", () => {
    expect(prompt).toContain(profile.name);
    expect(prompt).toContain(profile.email);
    expect(prompt).toContain(education[0].institution);
    for (const p of projects) expect(prompt).toContain(p.name);
    expect(prompt).toContain("PostgreSQL");
    expect(prompt).toMatch(/remote work/i);
  });

  it("tells the model how to hand off", () => {
    expect(prompt).toContain(HANDOFF);
    expect(prompt).toMatch(/never invent/i);
  });

  it("doesn't leak placeholder copy as facts", () => {
    expect(prompt).not.toMatch(/full description coming soon/i);
  });
});

describe("parseReply", () => {
  it("strips the handoff marker and flags it", () => {
    expect(parseReply(`Best asked directly. ${HANDOFF}`)).toEqual({ text: "Best asked directly.", handoff: true });
    expect(parseReply("He knows Python.")).toEqual({ text: "He knows Python.", handoff: false });
  });
});

describe("SUGGESTED", () => {
  it("answers every starter locally with non-empty text", () => {
    expect(SUGGESTED.length).toBeGreaterThan(0);
    for (const s of SUGGESTED) expect(s.answer.trim().length).toBeGreaterThan(10);
  });
});

describe("ageOn", () => {
  it("counts whole years and flips on the birthday (Manila time)", () => {
    expect(ageOn("2005-04-07", new Date("2026-10-12T04:00:00Z"))).toBe(21);
    expect(ageOn("2005-04-07", new Date("2027-04-06T12:00:00Z"))).toBe(21); // Apr 6, 8pm in Manila
    expect(ageOn("2005-04-07", new Date("2027-04-06T16:30:00Z"))).toBe(22); // already Apr 7 in Manila
  });
});
