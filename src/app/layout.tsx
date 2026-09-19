import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { GridOverlay } from "@/components/grid-overlay";
import { ScrollProgress } from "@/components/scroll-progress";
import { profile, socials } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const TITLE = "Matthew C. Arandia — Full-Stack Developer & IT Professional";
const DESCRIPTION =
  "Portfolio of Matthew C. Arandia, a full-stack developer building mobile, web, and full-stack products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Matthew C. Arandia",
  },
  description: DESCRIPTION,
  keywords: [
    "Matthew Arandia",
    "Full-Stack Developer",
    "IT Professional",
    "Web Development",
    "Software Testing",
    "Portfolio",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.bio,
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  sameAs: socials.filter((s) => s.icon !== "mail").map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <MotionConfig reducedMotion="user">
            <GridOverlay />
            <CustomCursor />
            <ScrollProgress />
            <div className="relative z-10 flex min-h-full flex-col">{children}</div>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
