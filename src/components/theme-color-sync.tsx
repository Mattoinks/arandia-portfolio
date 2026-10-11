"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const COLORS = { light: "#f6f5f1", dark: "#0c0c0b" } as const;

/**
 * The theme-color metas follow the OS scheme, but the site has its own toggle.
 * Keep the browser chrome / status bar matched to the theme actually shown.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", COLORS[resolvedTheme]));
  }, [resolvedTheme]);

  return null;
}
