import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Critical for GH Pages
  images: {
    unoptimized: true, // GH Pages doesn't support the Next.js Image Optimization API
  },
  
  /* config options here */
};

export default nextConfig;
