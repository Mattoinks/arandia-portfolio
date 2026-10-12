/**
 * Canonical site URL — feeds metadataBase, Open Graph/Twitter URLs, sitemap.xml
 * and robots.txt. Set NEXT_PUBLIC_SITE_URL when you add a custom domain; on
 * Vercel it otherwise falls back to the project's production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://arandia-portfolio.vercel.app")
).replace(/\/$/, "");
