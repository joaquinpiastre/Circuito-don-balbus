import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("tu-proyecto")) {
    redirect("/admin/login");
  }
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-brand-graphite">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
