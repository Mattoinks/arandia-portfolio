import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // 75 is the default; 95 keeps the small UI text in project screenshots crisp.
    qualities: [75, 95],
  },
  // The resume was renamed — keep previously shared links working.
  async redirects() {
    return [
      {
        source: "/assets/resume/RESUME_ARANDIA.pdf",
        destination: "/assets/resume/Matthew_Arandia_Resume.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
