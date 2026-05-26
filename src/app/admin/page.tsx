import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";
import AdminDashboard from "@/app/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Newsroom" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/admin");
  if (user.role !== "admin") redirect("/portal");

  return <AdminDashboard userName={user.displayName} />;
}
