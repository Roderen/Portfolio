import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: "/uploads/**" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "pg", "bcryptjs"],
};

export default nextConfig;
