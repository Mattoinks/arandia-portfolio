"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Logo() {
  const { resolvedTheme } = useTheme();
  // Site defaults to dark theme (see ThemeProvider), so assume dark before
  // mount to avoid a flash of the wrong logo while resolvedTheme resolves.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(resolvedTheme !== "light");
  }, [resolvedTheme]);

  const src = isDark ? "/assets/images/og/WHITEM.jpg" : "/assets/images/og/BLACKM.jpg";

  return (
    <a href="#top" aria-label="Home" className="relative block h-7 w-7 shrink-0 cursor-pointer">
      <Image src={src} alt="" fill sizes="28px" className="rounded-md object-contain" priority />
    </a>
  );
}
