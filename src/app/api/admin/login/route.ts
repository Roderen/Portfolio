import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signAdminToken, setAdminCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting: 5 login attempts per hour per IP
  const identifier = getClientIdentifier(req);
  const rateLimitResult = rateLimit(identifier, RATE_LIMITS.adminLogin);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        }
      }
    );
  }

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
