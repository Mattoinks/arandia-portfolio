import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Newsreader } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Backdrop } from "@/components/backdrop";
import { OffscreenIdle } from "@/components/offscreen-idle";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ClickSpark } from "@/components/reactbits/click-spark";
import { ThemeColorSync } from "@/components/theme-color-sync";
import { CommandMenuProvider } from "@/components/command-menu";
import { ChatWidget } from "@/components/assistant/chat-widget-lazy";
import { ScrollProgress } from "@/components/scroll-progress";
import { profile, socials } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial text serif for long-form statements (About bio). Variable, with the
// optical-size axis so letterforms tighten and gain contrast at display sizes.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  // Only used below the fold (About bio, project overviews) — don't compete with hero assets.
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Tabs truncate after ~25 characters, so the name leads.
const TITLE = "Matthew Arandia — Full-Stack Developer";
const DESCRIPTION =
  "Portfolio of Matthew C. Arandia, a full-stack developer building mobile, web, and full-stack products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Matthew Arandia",
  },
  description: DESCRIPTION,
  keywords: [
    "Matthew Arandia",
    "Full-Stack Developer",
    "Mobile Developer",
    "Web Development",
    "Mobile Development",
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
  // Google Search Console ownership check — paste the code into this env var on Vercel.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Paint under the notch/home indicator; fixed chrome pads back with env(safe-area-inset-*).
  viewportFit: "cover",
  // Android: the keyboard shrinks the layout viewport, matching iOS.
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
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
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${newsreader.variable} h-full antialiased`}
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
            <Backdrop />
            <OffscreenIdle />
            <SmoothScroll />
            <ClickSpark />
            <ThemeColorSync />
            <ScrollProgress />
            <Analytics />
            <CommandMenuProvider>
              <div className="relative z-10 flex min-h-full flex-col">{children}</div>
              <ChatWidget />
            </CommandMenuProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
