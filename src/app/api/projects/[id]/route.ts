import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data = updateSchema.parse(body);

  const updated = await db.project.update({
    where: { id: Number(id) },
    data: {
      ...data,
      skills: data.skills ? JSON.stringify(data.skills) : undefined,
    },
  });

  return NextResponse.json({ ...updated, skills: JSON.parse(updated.skills) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.project.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
