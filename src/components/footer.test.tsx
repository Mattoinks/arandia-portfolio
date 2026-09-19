import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";
import { profile } from "@/lib/data";

describe("Footer", () => {
  it("renders the current year and the owner's name", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(profile.name))).toBeInTheDocument();
  });
});
