import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function seedAdmin() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill in the values.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg({ connectionString } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new PrismaClient({ adapter } as any);

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hashed = await bcrypt.hash(password, 12);

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    await db.adminUser.update({
      where: { email },
      data: { password: hashed },
    });
    console.log(`✅ Admin user updated: ${email}`);
  } else {
    await db.adminUser.create({
      data: { email, password: hashed },
    });
    console.log(`✅ Admin user created: ${email}`);
  }

  await db.$disconnect();
}

seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
