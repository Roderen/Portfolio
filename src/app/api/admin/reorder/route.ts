import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

// Accepts { ids: number[] } — ordered array of project IDs
// Updates the `order` field of each project based on its position
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { ids } = await req.json() as { ids: number[] };
    if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    await Promise.all(
      ids.map((id, index) =>
        db.project.update({ where: { id }, data: { order: index } })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/admin/reorder error:", err);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
