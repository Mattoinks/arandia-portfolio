import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, validateContact } from "./contact";

const valid = { name: "Ana Reyes", email: "ana@studio.ph", subject: "Freelance project", message: "Hi — I'd love to talk about a project." };

describe("validateContact", () => {
  it("accepts a complete, well-formed message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("requires a name of at least two characters", () => {
    expect(validateContact({ ...valid, name: "A" }).name).toBeDefined();
  });

  it("rejects malformed email addresses", () => {
    for (const email of ["", "ana", "ana@", "ana@studio", "ana studio@x.ph"]) {
      expect(validateContact({ ...valid, email }).email).toBeDefined();
    }
  });

  it("requires a short subject and caps its length", () => {
    expect(validateContact({ ...valid, subject: "Hi" }).subject).toBeDefined();
    expect(validateContact({ ...valid, subject: "x".repeat(CONTACT_LIMITS.subject + 1) }).subject).toBeDefined();
  });

  it("asks for a message of reasonable length", () => {
    expect(validateContact({ ...valid, message: "hey" }).message).toBeDefined();
    expect(validateContact({ ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) }).message).toBeDefined();
  });
});
