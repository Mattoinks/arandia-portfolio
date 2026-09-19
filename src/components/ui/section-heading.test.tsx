import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renders the eyebrow, title, and description", () => {
    render(
      <SectionHeading
        eyebrow="My Capabilities"
        title="What I Can Do"
        description="A short description."
      />,
    );

    expect(screen.getByText("My Capabilities")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What I Can Do" })).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
  });

  it("omits the description paragraph when none is given", () => {
    render(<SectionHeading eyebrow="Eyebrow" title="Title" />);
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
  });
});
