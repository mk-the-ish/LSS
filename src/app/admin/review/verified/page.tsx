import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function AdminVerifiedPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminUser) redirect("/admin/login?reason=forbidden");

  // Fetch verified profiles
  const { data: verifiedProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("verification_status", "verified")
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Verified Exhibitors</h1>
        </div>

        <p className="mt-2 text-white/70">Signed in as {user.email}.</p>

        {!verifiedProfiles || verifiedProfiles.length === 0 ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70">No verified exhibitors yet.</p>
            <Link href="/admin/review/new" className="mt-4 inline-block rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-6 py-3 font-bold text-[#041007] hover:opacity-90 transition">
              Check Pending Applications
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm text-white/85">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-semibold">Company</th>
                  <th className="px-4 py-3 text-left font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Total USD</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {verifiedProfiles.map((profile: Record<string, unknown>) => (
                  <tr key={profile.id as string} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-medium">{profile.company_name as string}</td>
                    <td className="px-4 py-3 text-white/70">{profile.full_name as string}</td>
                    <td className="px-4 py-3 capitalize text-white/70">{String(profile.category).replace("_", " ")}</td>
                    <td className="px-4 py-3 text-lss-gold font-semibold">${profile.calculated_total_usd}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-lss-green/20 px-3 py-1 text-xs font-semibold text-lss-green">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <Link href="/admin/login" className="text-white/50 hover:text-white underline text-sm font-mono uppercase tracking-wider">
            &larr; Sign Out
          </Link>
        </div>
      </section>
    </main>
  );
}
