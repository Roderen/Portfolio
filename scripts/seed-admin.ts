import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

async function seedAdmin() {
  const dbPath = path.resolve(process.cwd(), "dev.db");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` } as any);
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

seedAdmin().catch(console.error);
