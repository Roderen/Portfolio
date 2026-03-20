import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

// Upserts the single SiteSettings row (id = 1)
async function getOrCreateSettings() {
  return db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1 },
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

  const body = await req.json() as {
    photoUrl?: string | null;
    heroName?: string | null;
    heroRole?: string | null;
    heroSubtitle?: string | null;
    aboutBio?: string | null;
    aboutSkills?: string | null;
  };

  const settings = await db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...body },
    update: body,
  });

  return NextResponse.json(settings);
}
