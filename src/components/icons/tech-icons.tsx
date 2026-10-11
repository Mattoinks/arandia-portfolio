/** Skill icon images live in /public/assets/icons — see SKILL_ICON_SRC for the filename per key. */
export const SKILL_ICON_SRC: Record<string, string> = {
  nextjs: "/assets/icons/nextjs.jpg",
  tailwind: "/assets/icons/tailwindcss.png",
  html5: "/assets/icons/html5.png",
  css3: "/assets/icons/css3.png",
  postgresql: "/assets/icons/postgre.png",
  git: "/assets/icons/git.png",
  vercel: "/assets/icons/vercel.png",
  database: "/assets/icons/sql.png",
  normalize: "/assets/icons/normalization.png",
  crud: "/assets/icons/crud.jpg",
  javascript: "/assets/icons/javascript.png",
  python: "/assets/icons/python.jpg",
  github: "/assets/icons/github.png",
  render: "/assets/icons/render.jpeg",
  figma: "/assets/icons/figma.png",
  notion: "/assets/icons/notion.png",
  typescript: "/assets/icons/typescript.png",
  flutter: "/assets/icons/flutter.png",
  mysql: "/assets/icons/mysql.png",
  oracle: "/assets/icons/oracle.png",
  supabase: "/assets/icons/supabase.png",
  netlify: "/assets/icons/netlify.png",
  java: "/assets/icons/java.png",
};

/** Bare transparent logos (no tile of their own) that need breathing room inside the white tile. */
export const PADDED_SKILL_ICONS = new Set(["netlify", "supabase", "java"]);
