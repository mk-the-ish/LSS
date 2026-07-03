import { redirect } from "next/navigation";
import ReviewClient from "@/components/admin-review-client";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminPendingPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminUser) redirect("/admin/login?reason=forbidden");

  // Fetch the latest pending verification profile
  const { data: latest } = await supabase
    .from("profiles")
    .select("*")
    .eq("verification_status", "pending_verification")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return (
      <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-16 pt-10">
        <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
          <div className="section-header">
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Pending Verification</h1>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70">No pending applications to review.</p>
            <Link href="/admin/review/verified" className="mt-4 inline-block rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-6 py-3 font-bold text-[#041007] hover:opacity-90 transition">
              View Verified Exhibitors
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Link href="/admin/login" className="text-white/50 hover:text-white underline text-sm font-mono uppercase tracking-wider">
              &larr; Sign Out
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <ReviewClient profile={latest as Record<string, unknown>} adminEmail={user.email ?? null} />;
}
