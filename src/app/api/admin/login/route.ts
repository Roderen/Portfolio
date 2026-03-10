import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signAdminToken, setAdminCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken(user.email);
  await setAdminCookie(token);

  return NextResponse.json({ ok: true });
}
