"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalStore } from "@/components/portal-store";

export default function AdminLoginPage() {
  const { signIn, authStatus, authError, signOut } = usePortalStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  return (
    <main className="mx-auto w-[min(780px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.95),rgba(8,16,12,0.9))] p-6 shadow-glow backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.18em] text-lss-gold">Admin Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to continue</h1>
        <p className="mt-3 text-white/70">Authorized staff only.</p>

        <div className="mt-6 grid gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Admin email" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              const result = await signIn(email, password);
              if (result.ok) {
                router.replace("/admin");
              } else {
                setNote(result.error);
              }
            }}
            className="rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-5 py-4 font-bold text-[#041007]"
          >
            Sign in
          </button>
          <button type="button" onClick={() => void signOut()} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white">
            Clear session
          </button>
          <Link href="/" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white">
            Return home
          </Link>
        </div>

        <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          Session status: <strong className="text-white">{authStatus}</strong>
          {authError ? <p className="mt-2 text-red-200">{authError}</p> : null}
          {note ? <p className="mt-2 text-lss-gold">{note}</p> : null}
        </div>
      </section>
    </main>
  );
}
