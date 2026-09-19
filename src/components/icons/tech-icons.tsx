import type { ComponentType, CSSProperties } from "react";
import {
  SiCss,
  SiGit,
  SiHtml5,
  SiNextdotjs,
  SiPostgresql,
  SiTailwindcss,
  SiVercel,
  SiWireshark,
} from "react-icons/si";
import { Database, Network, RefreshCw, Rows3 } from "lucide-react";

export const SKILL_ICONS: Record<
  string,
  ComponentType<{ className?: string; style?: CSSProperties }>
> = {
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  html5: SiHtml5,
  css3: SiCss,
  postgresql: SiPostgresql,
  git: SiGit,
  vercel: SiVercel,
  wireshark: SiWireshark,
  database: Database,
  normalize: Rows3,
  crud: RefreshCw,
  activedirectory: Network,
};

// Official/representative brand colors; generic (non-brand) icons use "currentColor".
export const SKILL_ICON_COLORS: Record<string, string> = {
  nextjs: "currentColor",
  tailwind: "#38bdf8",
  html5: "#e34f26",
  css3: "#1572b6",
  postgresql: "#4169e1",
  git: "#f05032",
  vercel: "currentColor",
  wireshark: "#1679a7",
  database: "currentColor",
  normalize: "currentColor",
  crud: "currentColor",
  activedirectory: "currentColor",
};
