import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [projects, messages, settings] = await Promise.all([
    db.project.findMany({ orderBy: { order: "asc" } }).then((ps) =>
      ps.map((p) => ({ ...p, skills: JSON.parse(p.skills) as string[] }))
    ),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <AdminDashboard
      initialProjects={projects}
      initialMessages={messages}
      initialPhotoUrl={settings?.photoUrl ?? null}
    />
  );
}
