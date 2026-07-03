import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-16 pt-2">
      <section className="grid min-h-[78vh] overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 shadow-glow backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-5 p-6 md:p-10 lg:p-12">
          <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-lss-gold">
            Lowveld Show Society
          </span>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white md:text-6xl xl:text-7xl">
            LSS Agricultural Show & Trade Fair 2026
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/85">
            A premium exhibitor experience for registration, payment verification, verified networking, and committee-led coordination.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-2xl bg-gradient-to-r from-lss-green to-lss-gold px-5 py-4 font-bold text-[#041007]" href="/register">
              Register & Secure Space
            </Link>
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white" href="/login">
              Exhibitor Login
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat value="6 - 8 Aug" label="Show dates" />
            <Stat value="Chiredzi" label="Zimbabwe" />
            <Stat value="USD 60" label="Dinner ticket" />
          </div>
        </div>
        <div className="relative min-h-[360px] bg-[linear-gradient(180deg,rgba(4,9,6,0.08),rgba(4,9,6,0.8)),url('/assets/tractor.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,13,10,0.18),rgba(7,13,10,0.74))]" />
          <div className="absolute bottom-5 left-5 right-5 z-10 rounded-[1.4rem] border border-white/10 bg-[#0a120de0] p-4">
            <div className="flex items-center gap-3">
              <Image src="/assets/logo.jpg" alt="Lowveld Show Society logo" width={52} height={52} className="h-12 w-12 rounded-xl border border-white/10 object-cover bg-white" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-lss-gold">Official 2026 branding</p>
                <p className="text-sm leading-7 text-white/80">
                  Inspired by the supplied logo, the tractor image, and the agricultural character of the Lowveld.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">Committee</p>
          <h2>Show leadership</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {committeeCards.map((item) => (
            <article key={item.name} className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5">
              <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }} />
              <div className="p-4">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">{item.role}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-white/70">{item.phone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">Schedule</p>
          <h2>Event timeline</h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <TimelineCard day="Thursday 6 August" title="Opening and trade focus" points={["Gates open at 06:00", "Stand judging 10:00 - 15:00", "Corporate networking and exhibitor engagement"]} />
          <TimelineCard day="Friday 7 August" title="Parade, performances, and conference" points={["Grand procession at 08:00", "Music and performances at 09:00", "Official opening at 12:30", "Business conference and dinner at 18:30"]} />
          <TimelineCard day="Saturday 8 August" title="Grand finale" points={["Motorbike stuntmen", "Skydivers", "Fireworks and closing celebrations"]} />
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
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
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <strong className="block text-2xl font-bold text-lss-gold">{value}</strong>
      <span className="text-sm text-white/70">{label}</span>
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
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">{day}</span>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2 text-white/75">
        {points.map((point) => (
          <li key={point} className="border-b border-white/10 pb-2 last:border-none">
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-white/70">{text}</p>
    </article>
  );
}
