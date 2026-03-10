/**
 * One-time setup endpoint to create the admin user.
 * Protected by SETUP_SECRET env variable.
 *
 * Usage after deploy:
 * POST https://your-site.vercel.app/api/setup
 * Body: { "secret": "value-of-SETUP_SECRET-env-var" }
 *
 * After running once, you can remove SETUP_SECRET from Vercel env vars
 * to disable this endpoint.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const setupSecret = process.env.SETUP_SECRET;

  // If SETUP_SECRET is not configured, endpoint is disabled
  if (!setupSecret) {
    return NextResponse.json({ error: "Setup is disabled" }, { status: 403 });
  }

  const { secret } = await req.json();
  if (secret !== setupSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL and ADMIN_PASSWORD env vars must be set" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    await db.adminUser.update({ where: { email }, data: { password: hashed } });
    return NextResponse.json({ ok: true, action: "updated", email });
  }

  await db.adminUser.create({ data: { email, password: hashed } });
  return NextResponse.json({ ok: true, action: "created", email });
}
