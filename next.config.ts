import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    // Use modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
    // Enable image optimization
    minimumCacheTTL: 60,
  },
  serverExternalPackages: ["@prisma/client", "pg", "bcryptjs"],
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', '@dnd-kit/core', '@dnd-kit/sortable'],
  },
};

export default nextConfig;
