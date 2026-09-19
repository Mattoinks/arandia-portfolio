import { describe, expect, it } from "vitest";
import { certifications, education, profile, projects } from "./data";

describe("projects", () => {
  it("has a unique slug per project", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every project a non-empty name and at least one tag", () => {
    for (const project of projects) {
      expect(project.name.trim().length).toBeGreaterThan(0);
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("only links to https GitHub repos where a codeUrl is set", () => {
    for (const project of projects) {
      if (project.codeUrl) {
        expect(project.codeUrl).toMatch(/^https:\/\/github\.com\//);
      }
    }
  });
});

describe("certifications", () => {
  it("never lets score exceed maxScore", () => {
    for (const cert of certifications) {
      expect(cert.score).toBeLessThanOrEqual(cert.maxScore);
      expect(cert.score).toBeGreaterThan(0);
    }
  });

  it("points every certificate at a PDF under the certifications folder", () => {
    for (const cert of certifications) {
      expect(cert.pdfUrl).toMatch(/^\/assets\/images\/certifications\/.+\.pdf$/);
    }
  });
});

describe("profile.stats", () => {
  it("keeps the Projects stat in sync with the number of listed projects", () => {
    const projectsStat = profile.stats.find((s) => s.label === "Projects");
    expect(projectsStat?.value).toBe(String(projects.length));
  });

  it("keeps the Certificates stat in sync with the number of listed certifications", () => {
    const certsStat = profile.stats.find((s) => s.label === "Certificates");
    expect(certsStat?.value).toBe(String(certifications.length));
  });
});

describe("education", () => {
  it("has at least one entry with an institution and degree", () => {
    expect(education.length).toBeGreaterThan(0);
    for (const entry of education) {
      expect(entry.institution.trim().length).toBeGreaterThan(0);
      expect(entry.degree.trim().length).toBeGreaterThan(0);
    }
  });
});
