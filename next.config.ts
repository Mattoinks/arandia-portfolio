import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // 75 is the default; 95 keeps the small UI text in project screenshots crisp.
    qualities: [75, 95],
  },
};

export default nextConfig;
