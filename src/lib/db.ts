import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // pg library doesn't understand ?pgbouncer=true — strip it before passing
  const cleanUrl = connectionString
    .replace(/[?&]pgbouncer=true/gi, "")
    .replace(/[?&]connection_limit=\d+/gi, "");

  // PrismaPg accepts a config object directly (not only a Pool instance)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg({
    connectionString: cleanUrl,
    // Supabase requires SSL in production
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
