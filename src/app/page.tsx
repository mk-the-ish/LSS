"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function TopNav() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const ids = ["home", "schedule", "about", "committee"];
    const onScroll = () => {
      const positions = ids.map((id) => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      // find the section nearest to top (but not too far below)
      const nearest = positions.reduce((a, b) => (Math.abs(a.top) < Math.abs(b.top) ? a : b));
      setActive(nearest.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector("nav");
    const navH = nav ? nav.getBoundingClientRect().height : 64;
    const top = window.scrollY + el.getBoundingClientRect().top - navH - 8;
    window.scrollTo({ top, behavior: "smooth" });
    setOpen(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkClass = (id: string) =>
    `text-sm font-medium ${active === id ? "text-lss-gold" : "text-gray-700"}`;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto w-[min(1600px,calc(100vw-2rem))] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Image src="/assets/favicon.png" alt="Lowveld Show logo" width={48} height={28} className="h-10 w-auto" />
          <div className="text-base font-semibold text-gray-900">Lowveld Show Society</div>
        </div>

        <div className="hidden md:flex gap-6">
          <a className={linkClass("home")} href="#home" onClick={(e) => scrollToId(e, "home")}>
            Home
          </a>
          <a className={linkClass("schedule")} href="#schedule" onClick={(e) => scrollToId(e, "schedule")}>
            Schedule
          </a>
          <a className={linkClass("about")} href="#about" onClick={(e) => scrollToId(e, "about")}>
            About
          </a>
          <a className={linkClass("committee")} href="#committee" onClick={(e) => scrollToId(e, "committee")}>
            Committee
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2"
          onClick={() => setOpen((s) => !s)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17H20" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col px-4 py-3">
            <a onClick={(e) => scrollToId(e as any, "home")} className={linkClass("home") + " py-2"} href="#home">
              Home
            </a>
            <a onClick={(e) => scrollToId(e as any, "schedule")} className={linkClass("schedule") + " py-2"} href="#schedule">
              Schedule
            </a>
            <a onClick={(e) => scrollToId(e as any, "about")} className={linkClass("about") + " py-2"} href="#about">
              About
            </a>
            <a onClick={(e) => scrollToId(e as any, "committee")} className={linkClass("committee") + " py-2"} href="#committee">
              Committee
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function Page() {
  return (
    <main className="w-full pt-16">
      <TopNav />
      {/* Hero Section with Image and Overlay Text */}
      <section id="home" className="relative h-screen w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/assets/tractor.jpg')" }}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.5))]" />
        
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            {/* logo moved to nav */}
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white md:text-6xl xl:text-7xl">
              LSS Agricultural Show & Trade Fair 2026
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">
              A premium exhibitor experience for networking, and committee-led coordination.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-5 py-4 font-bold text-[#041007]" href="/register">
                Register & Secure Space
              </Link>
              <Link className="rounded-2xl border border-white/30 bg-white/10 px-5 py-4 font-bold text-white backdrop-blur-sm" href="/login">
                Exhibitor Login
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Stat value="6 - 8 Aug" label="Show dates" />
              <Stat value="Chiredzi" label="Zimbabwe" />
              <Stat value="USD 60" label="Dinner ticket" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections with White Background */}
      <div className="bg-white">
        <div className="mx-auto w-[min(1200px,calc(100vw-2rem))] py-16">
      <section id="schedule">
        <div className="section-header">
          <p className="eyebrow">Schedule</p>
          <h2>Event timeline & highlights</h2>
        </div>

        <div className="mt-8 grid lg:grid-cols-12 gap-4">
          {/* Highlights & Packages Column */}
          <div className="lg:col-span-3 space-y-4 border-b lg:border-b-0 lg:border-r border-gray-300 pb-6 lg:pb-0 lg:pr-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold mb-4 flex justify-between items-center text-gray-900">
                  Highlights <span className="text-lss-gold">→</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="font-serif italic text-gray-400 text-lg leading-none">06</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Corporate Networking</p>
                      <p className="text-[11px] text-gray-600">Stand Judging & Pro Sessions</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-serif italic text-gray-400 text-lg leading-none">07</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Business Conference</p>
                      <p className="text-[11px] text-gray-600">Dinner & Official Opening</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-serif italic text-gray-400 text-lg leading-none">08</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Grand Finale</p>
                      <p className="text-[11px] text-gray-600">Skydivers & Fireworks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-4 text-gray-900">Exhibitor Packages</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Premium secure space including electricity, perimeter security, and digital directory listing.
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="text-gray-600">Corporate Space</span>
                  <span className="font-bold text-lss-gold">$1,000</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="text-gray-600">Government & Farmers</span>
                  <span className="font-bold text-lss-gold">$850</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span className="text-gray-600">SME & Schools</span>
                  <span className="font-bold text-lss-gold">$750</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Column */}
          <div className="lg:col-span-9 grid gap-4 md:grid-cols-3">
            <TimelineCard day="Thursday 6 August" title="Opening and trade focus" points={["Gates open at 06:00", "Stand judging 10:00 - 15:00", "Corporate networking and exhibitor engagement"]} />
            <TimelineCard day="Friday 7 August" title="Parade, performances, and conference" points={["Grand procession at 08:00", "Music and performances at 09:00", "Official opening at 12:30", "Business conference and dinner at 18:30"]} />
            <TimelineCard day="Saturday 8 August" title="Grand finale" points={["Motorbike stuntmen", "Skydivers", "Fireworks and closing celebrations"]} />
          </div>
        </div>
      </section>

      <section id="about" className="mt-8 border-t border-gray-300 pt-8">
        <div className="section-header">
          <p className="eyebrow">About</p>
          <h2>What the show is about</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard title="Trade and exhibition" text="A focused space for businesses, institutions, and partners to showcase products and services." />
          <InfoCard title="Committee leadership" text="Meet the officials guiding registrations, approvals, and event coordination." />
          <InfoCard title="Agricultural identity" text="The design system is grounded in the land, the crop imagery, and the tractor visual." />
        </div>
      </section>

      <section id="committee" className="mt-8 border-t border-gray-300 pt-8">
        <div className="section-header">
          <p className="eyebrow">Committee</p>
          <h2>Show leadership</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {committeeCards.map((item) => (
            <article key={item.name} className="overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
              <div className="relative h-36 md:h-40 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }} />
              <div className="p-3">
                <span className="inline-flex rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-900">{item.role}</span>
                <h3 className="mt-2 text-base font-semibold text-gray-900">{item.name}</h3>
                <p className="mt-1 text-xs text-gray-600">{item.phone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12 flex items-center justify-center gap-2 border-t border-gray-300 pt-8">
        <p className="text-xs text-gray-500">Developed and designed by</p>
        <Image src="/assets/nueetech.jpg" alt="Nueetech logo" width={60} height={20} className="h-5 w-auto opacity-60" />
        <p className="text-xs text-gray-500">2026</p>
      </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/30 bg-white/10 p-4 backdrop-blur-md">
      <strong className="block text-2xl font-bold text-lss-gold">{value}</strong>
      <span className="text-sm text-white/90">{label}</span>
    </div>
  );
}

const committeeCards = [
  { name: "Vennancio Kurauone", role: "Chairman", phone: "+263772269110", image: "/assets/committee-chair.jpg" },
  { name: "Sharon Darikwa", role: "Vice Chairman", phone: "+263772968879", image: "/assets/committee-vc.jpg" },
  { name: "Tawanda P. Chitete", role: "Secretary General", phone: "+263772732398", image: "/assets/committee-secretary.jpg" },
  { name: "Fidelis Harry", role: "Treasurer", phone: "+263772426985", image: "/assets/committee-treasurer.jpg" },
];

function TimelineCard({
  day,
  title,
  points,
}: {
  day: string;
  title: string;
  points: string[];
}) {
  return (
    <article className="rounded-[1.6rem] border border-gray-300 bg-gray-50 p-5">
      <span className="inline-flex rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs text-gray-900">{day}</span>
      <h3 className="mt-3 text-xl font-semibold text-gray-900">{title}</h3>
      <ul className="mt-4 space-y-2 text-gray-700">
        {points.map((point) => (
          <li key={point} className="border-b border-gray-300 pb-2 last:border-none">
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.6rem] border border-gray-300 bg-gray-50 p-5">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-700">{text}</p>
    </article>
  );
}
