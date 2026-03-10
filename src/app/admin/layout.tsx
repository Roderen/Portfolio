import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page doesn't need auth check
  return <>{children}</>;
}
