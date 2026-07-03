import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminUser) redirect("/admin/login?reason=forbidden");

  // Check if there are any pending verification clients
  const { data: pendingCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("verification_status", "pending_verification");

  // If there are pending clients, show the next one to review
  // Otherwise, show the list of verified clients
  if (pendingCount && pendingCount.length > 0) {
    redirect("/admin/review/pending");
  } else {
    redirect("/admin/review/verified");
  }
}
