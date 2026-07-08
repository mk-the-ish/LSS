import Link from "next/link";
import { redirect } from "next/navigation";
import { fmt } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ProfileRecord = Record<string, unknown>;

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminUser) redirect("/admin/login?reason=forbidden");

  const { data: profiles } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });
  const sortedProfiles = (profiles ?? []).sort((a, b) => {
    const aStatus = String((a as ProfileRecord).verification_status ?? "");
    const bStatus = String((b as ProfileRecord).verification_status ?? "");
    const aIsPending = aStatus === "pending_verification" || aStatus === "pending_payment";
    const bIsPending = bStatus === "pending_verification" || bStatus === "pending_payment";
    if (aIsPending !== bIsPending) return aIsPending ? -1 : 1;
    return Number(new Date(String((b as ProfileRecord).updated_at ?? 0)).getTime()) - Number(new Date(String((a as ProfileRecord).updated_at ?? 0)).getTime());
  });

  return (
    <main className="mx-auto w-[min(1280px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.95),rgba(8,16,12,0.9))] p-6 shadow-glow backdrop-blur-xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-lss-gold">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Exhibitor review</h1>
          </div>
          <p className="text-sm text-white/70">Signed in as {user.email}</p>
        </div>

        <p className="mt-4 text-sm text-white/70">Unverified clients are shown first so approvals can be handled quickly.</p>

        {!sortedProfiles.length ? (
          <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No exhibitor applications have been submitted yet.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm text-white/85">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedProfiles.map((profile) => {
                  const record = profile as ProfileRecord;
                  const id = String(record.id ?? "");
                  const name = String(record.full_name ?? "Unknown");
                  const company = String(record.company_name ?? "Unnamed company");
                  const email = String(record.email ?? "No email");
                  const status = String(record.verification_status ?? "pending_verification");
                  const total = Number(record.calculated_total_usd ?? 0);
                  const isPending = status === "pending_verification" || status === "pending_payment";
                  const badgeClass = isPending ? "bg-amber-500/20 text-amber-300" : "bg-lss-green/20 text-lss-green";
                  const statusLabel = isPending ? "Unverified" : "Verified";

                  return (
                    <tr key={id} className="border-b border-white/10 transition hover:bg-white/5">
                      <td className="px-4 py-3">
                        <Link href={`/admin/review/${id}`} className="font-semibold text-white hover:text-lss-gold">
                          {name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-white/70">{company}</td>
                      <td className="px-4 py-3 text-white/70">{email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
                      </td>
                      <td className="px-4 py-3 text-lss-gold">{fmt(total)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/review/${id}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 hover:text-white">
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
