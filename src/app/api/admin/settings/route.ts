import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

// Upserts the single SiteSettings row (id = 1)
async function getOrCreateSettings() {
  return db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, photoUrl: null },
    update: {},
  });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await getOrCreateSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { photoUrl } = await req.json() as { photoUrl: string | null };

  const settings = await db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, photoUrl },
    update: { photoUrl },
  });

  return NextResponse.json(settings);
}
