"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fmt } from "@/lib/format";

type ProfileRecord = Record<string, unknown>;

export default function ReviewClient({ profile, adminEmail }: { profile: ProfileRecord; adminEmail: string | null }) {
  const router = useRouter();
  const [reason, setReason] = useState(String(profile.rejection_reason ?? ""));
  const [status, setStatus] = useState<string>("");

  const name = String(profile.full_name ?? "");
  const company = String(profile.company_name ?? "");
  const email = String(profile.email ?? "No email");
  const phone = String(profile.phone ?? profile.phone_number ?? "Not provided");
  const category = String(profile.category ?? "Not provided");
  const total = Number(profile.calculated_total_usd ?? 0);
  const verificationStatus = String(profile.verification_status ?? "pending_verification");
  const profileId = String(profile.id ?? "");
  const popName = String(profile.pop_file_name ?? "Not uploaded");
  const paymentReference = String(profile.payment_reference ?? "Not generated");
  const notes = String(profile.notes ?? profile.additional_notes ?? "No extra notes");

  const popPreview = useMemo(() => String(profile.pop_url ?? ""), [profile.pop_url]);

  async function submit(action: "approve" | "reject") {
    setStatus("");
    const response = await fetch("/api/admin/approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId,
        action,
        rejectionReason: reason,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setStatus(payload.error || "Action failed.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-16 pt-2">
      <Header title="Review Profile" />
      <section className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.88),rgba(8,16,12,0.84))] p-6 shadow-glow backdrop-blur-xl">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Admin: {adminEmail || "unknown"}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{company || "Unnamed company"}</h2>
            <p className="mt-2 text-white/70">Applicant: <strong className="text-white">{name || "Unknown"}</strong></p>
            <p className="mt-2 text-white/70">Email: <strong className="text-white">{email}</strong></p>
            <p className="mt-2 text-white/70">Phone: <strong className="text-white">{phone}</strong></p>
            <p className="mt-2 text-white/70">Category: <strong className="text-white">{category}</strong></p>
            <p className="mt-2 text-white/70">Status: <strong className="text-white">{verificationStatus}</strong></p>
            <p className="mt-2 text-white/70">Total due: <strong className="text-white">{fmt(total)}</strong></p>
            <p className="mt-2 text-white/70">Reference: <strong className="text-white">{paymentReference}</strong></p>
            <p className="mt-2 text-white/70">POP file: <strong className="text-white">{popName}</strong></p>
            <p className="mt-2 text-white/70">Notes: <strong className="text-white">{notes}</strong></p>
            {popPreview ? (
              <a href={popPreview} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                Open POP
              </a>
            ) : null}
          </article>

          <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-xl font-semibold text-white">Decision</h3>
            <label className="mt-4 block text-sm text-white/90">Rejection reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" placeholder="Explain why the POP was rejected" />

            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => void submit("approve")} className="rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-5 py-4 font-bold text-[#041007]">
                Approve
              </button>
              <button type="button" onClick={() => void submit("reject")} className="rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 font-bold text-white">
                Reject
              </button>
              <Link href="/admin" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white">
                Back to list
              </Link>
            </div>

            {status ? <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">{status}</p> : null}
          </article>
        </div>
      </section>
    </main>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="relative z-10 m-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.88),rgba(8,16,12,0.84))] px-5 py-4 shadow-glow backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-lss-gold">Lowveld Show Society</p>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/admin">Admin list</NavLink>
          <NavLink href="/portal">Portal</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
      {children}
    </Link>
  );
}
