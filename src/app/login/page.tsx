"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalStore } from "@/components/portal-store";

export default function UserLoginPage() {
  const { signIn, authStatus, authError, registration } = usePortalStore();
  const [email, setEmail] = useState(registration.email || "");
  const [password, setPassword] = useState(registration.password || "");
  const [note, setNote] = useState("");
  const router = useRouter();

  return (
    <main className="mx-auto w-[min(760px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">User Login</p>
          <h1>Check status and continue</h1>
        </div>
        <p className="mt-3 text-white/70">Use your exhibitor account to check verification status or continue where you left off.</p>

        <div className="mt-6 grid gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              const result = await signIn(email, password);
              if (result.ok) {
                setNote("Signed in.");
                router.replace("/portal");
              } else {
                setNote(result.error);
              }
            }}
            className="rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-5 py-4 font-bold text-[#041007]"
          >
            Sign in
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
