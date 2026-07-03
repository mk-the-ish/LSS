import { notFound, redirect } from "next/navigation";
import ReviewClient from "@/components/admin-review-client";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminReviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminUser) redirect("/admin/login?reason=forbidden");

  if (id === "new") {
    const { data: latest } = await supabase
      .from("profiles")
      .select("*")
      .eq("verification_status", "pending_verification")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latest) notFound();
    return <ReviewClient profile={latest as Record<string, unknown>} adminEmail={user.email ?? null} />;
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!profile) notFound();

  return <ReviewClient profile={profile as Record<string, unknown>} adminEmail={user.email ?? null} />;
}
