import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="min-h-screen pt-8 pr-8 pb-8 pl-24">{children}</main>
    </div>
  );
}
