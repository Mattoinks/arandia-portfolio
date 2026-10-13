import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";
import { publishedNotes } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    { url: `${SITE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    ...(publishedNotes.length
      ? [
          { url: `${SITE_URL}/notes`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
          ...publishedNotes.map((n) => ({
            url: `${SITE_URL}/notes/${n.slug}`,
            lastModified: new Date(`${n.date}T00:00:00Z`),
            changeFrequency: "yearly" as const,
            priority: 0.5,
          })),
        ]
      : []),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
