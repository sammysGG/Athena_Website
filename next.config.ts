import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Serve local images as-is; no on-the-fly optimisation (no sharp in image).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
