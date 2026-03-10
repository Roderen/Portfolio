import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: "/uploads/**" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "@libsql/client", "bcryptjs"],
};

export default nextConfig;
