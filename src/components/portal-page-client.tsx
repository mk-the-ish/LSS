"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prettyCategory, statusLabel, verifiedDirectory } from "@/lib/lss-data";
import { usePortalStore } from "@/components/portal-store";

export default function PortalPageClient({
  initialProfile,
  userEmail,
}: {
  initialProfile: Record<string, unknown> | null;
  userEmail: string | null;
}) {
  const { registration, view, setView, setAdminTab, authStatus, authReady, setFromProfile, clearState } = usePortalStore();
  const pathname = usePathname();
  const router = useRouter();
  const verified = registration.verificationStatus === "verified";
  const locked = registration.verificationStatus !== "verified";

  useEffect(() => {
    if (initialProfile) setFromProfile(initialProfile);
  }, [initialProfile, setFromProfile]);

  useEffect(() => {
    if (authReady && authStatus === "anonymous") {
      clearState().then(() => router.replace(`/register?from=${encodeURIComponent(pathname.slice(1) || "portal")}&reason=session-expired`));
    }
  }, [authReady, authStatus, clearState, router, pathname]);

  return (
    <>
      <Header title="Exhibitor Portal" />
      <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-16 pt-2">
        <section className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.88),rgba(8,16,12,0.84))] p-6 shadow-glow backdrop-blur-xl">
          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold text-white">Portal access</h2>
              <p className="mt-3 text-white/70">
                Signed in as <strong className="text-white">{userEmail || "unknown user"}</strong>
              </p>
              <p className="mt-3 text-white/70">
                Status: <strong className="text-white">{statusLabel(registration.verificationStatus)}</strong>
              </p>
              <p className="mt-2 text-white/70">Company: <strong className="text-white">{registration.companyName || "No company saved"}</strong></p>
              <p className="mt-2 text-white/70">Category: <strong className="text-white">{prettyCategory(registration.category)}</strong></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" onClick={() => setView("locked")}>
                  Verification gate
                </button>
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white" onClick={() => setView("verified")}>
                  Verified view
                </button>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold text-white">{verified ? "Verified exhibitor portal" : "Verification gate"}</h2>
              {locked ? (
                <p className="mt-3 text-white/70">
                  Your payment details are undergoing audit by the LSS Secretariat. For direct queries, contact <strong>lowveldshowsociety4@gmail.com</strong>.
                </p>
              ) : (
                <p className="mt-3 text-white/70">You now have access to the directory, agenda bookmarks, and digital badge.</p>
              )}
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Session status: <strong className="text-white">{authStatus}</strong>
              </div>
            </article>
          </div>

          {verified ? (
            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-semibold text-white">Verified exhibitor directory</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {verifiedDirectory.map((item) => (
                  <div key={item.company} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">{item.category}</span>
                    <h4 className="mt-3 font-semibold text-white">{item.company}</h4>
                    <p className="mt-2 text-sm text-white/60">{item.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <h3 className="text-xl font-semibold text-white">Digital badge</h3>
            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(241,200,76,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(61,200,95,0.18),transparent_34%),rgba(255,255,255,0.04)] p-5">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">Verified Exhibitor</span>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-lss-gold">Name</p>
              <strong className="block text-xl text-white">{registration.fullName || "Applicant Name"}</strong>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-lss-gold">Company</p>
              <strong className="block text-xl text-white">{registration.companyName || "Company Name"}</strong>
              <p className="mt-3 text-white/60">View state: {view}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
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
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,28,21,0.88),rgba(8,16,12,0.84))] px-5 py-4 text-white/80 shadow-glow backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <strong className="text-white">LSS Agricultural Show & Trade Fair 2026</strong>
          <p>Chiredzi, Zimbabwe | 6 - 8 August 2026</p>
        </div>
        <Link className="text-white/90 underline" href="/">
          Return to home
        </Link>
      </div>
    </footer>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
      {children}
    </Link>
  );
}
