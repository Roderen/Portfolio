import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().optional().nullable(),
  liveUrl: z.string().nullable().optional(),
  skills: z.array(z.string()),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export async function GET() {
  const projects = await db.project.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      skills: JSON.parse(p.skills) as string[],
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = projectSchema.parse(body);

    const project = await db.project.create({
      data: {
        ...data,
        description: data.description ?? "",
        skills: JSON.stringify(data.skills),
        liveUrl: data.liveUrl || null,
      },
    });

    return NextResponse.json({ ...project, skills: data.skills });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: "Failed to save project" }, { status: 400 });
  }
}
