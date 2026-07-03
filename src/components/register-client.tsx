"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";
import { usePortalStore } from "@/components/portal-store";
import { sponsorships } from "@/lib/lss-data";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  category: "corporate" | "farmers_association" | "parastatal" | "school" | "government" | "sme";
  addVehiclePasses: number;
  addMultiTickets: number;
  addSingleTickets: number;
  dinnerTickets: number;
  wantsAdvertising: boolean;
  selectedSponsorships: string[];
}

const PRICING_RULES = {
  packages: {
    corporate: 1000,
    parastatal: 1000,
    government: 850,
    farmers_association: 850,
    school: 750,
    sme: 750,
  },
  vehiclePass: 200,
  multiTicket: 50,
  singleTicket: 10,
  dinnerTicket: 60,
  advertisingSlot: 400,
};

const SPONSORSHIP_PRICES: Record<string, number> = {
  vip_grand_stand: 2000,
  main_podium: 1000,
  vip_lounge: 2000,
  main_gate: 2000,
  fireworks: 2000,
  paratroopers: 2000,
};

export default function RegisterClient() {
  const router = useRouter();
  const { signUp, updateRegistration } = usePortalStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    category: "corporate",
    addVehiclePasses: 0,
    addMultiTickets: 0,
    addSingleTickets: 0,
    dinnerTickets: 0,
    wantsAdvertising: false,
    selectedSponsorships: [],
  });

  const [pricing, setPricing] = useState({
    basePrice: 1000,
    vehiclePrice: 0,
    multiTicketsPrice: 0,
    singleTicketsPrice: 0,
    dinnerPrice: 0,
    advertisingPrice: 0,
    sponsorshipsPrice: 0,
    subtotal: 0,
    earlyBirdDiscount: 0,
    totalUsd: 0,
  });

  // Calculate pricing whenever relevant fields change
  useEffect(() => {
    const base = PRICING_RULES.packages[formState.category] || 750;
    const vehicle = formState.addVehiclePasses * PRICING_RULES.vehiclePass;
    const multi = formState.addMultiTickets * PRICING_RULES.multiTicket;
    const single = formState.addSingleTickets * PRICING_RULES.singleTicket;
    const dinner = formState.dinnerTickets * PRICING_RULES.dinnerTicket;
    const adv = formState.wantsAdvertising ? PRICING_RULES.advertisingSlot : 0;

    const sponsorSum = formState.selectedSponsorships.reduce((sum, key) => {
      return sum + (SPONSORSHIP_PRICES[key] || 0);
    }, 0);

    const subtotal = base + vehicle + multi + single + dinner + adv + sponsorSum;
    const isEarlyBird = new Date() < new Date("2026-06-30T23:59:59");
    const discount = isEarlyBird ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const total = subtotal - discount;

    setPricing({
      basePrice: base,
      vehiclePrice: vehicle,
      multiTicketsPrice: multi,
      singleTicketsPrice: single,
      dinnerPrice: dinner,
      advertisingPrice: adv,
      sponsorshipsPrice: sponsorSum,
      subtotal,
      earlyBirdDiscount: discount,
      totalUsd: total,
    });
  }, [formState.category, formState.addVehiclePasses, formState.addMultiTickets, formState.addSingleTickets, formState.dinnerTickets, formState.wantsAdvertising, formState.selectedSponsorships]);

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      if (!formState.fullName.trim() || !formState.email.trim() || !formState.password.trim() || !formState.phone.trim() || !formState.companyName.trim()) {
        setError("Please fill out all personal and business fields before proceeding.");
        return;
      }
      if (formState.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSponsorshipToggle = (key: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedSponsorships: prev.selectedSponsorships.includes(key) ? prev.selectedSponsorships.filter((s) => s !== key) : [...prev.selectedSponsorships, key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formState.fullName.trim() || !formState.email.trim() || !formState.password.trim() || !formState.phone.trim() || !formState.companyName.trim()) {
      setError("Required profile information is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(formState.email, formState.password, formState.fullName);
      if (!result.ok) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Update registration state with form data and sync to database
      await updateRegistration({
        fullName: formState.fullName,
        email: formState.email,
        password: formState.password,
        phone: formState.phone,
        companyName: formState.companyName,
        category: formState.category,
        vehiclePasses: formState.addVehiclePasses,
        multiTickets: formState.addMultiTickets,
        singleTickets: formState.addSingleTickets,
        dinnerTickets: formState.dinnerTickets,
        wantsAdvertising: formState.wantsAdvertising,
        sponsorships: formState.selectedSponsorships,
      });

      router.push("/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration.");
      setIsLoading(false);
    }
  };

  const categoriesList = [
    { value: "corporate" as const, label: "Corporate Stands", desc: "Premium exhibition space for large entities ($1,000)" },
    { value: "parastatal" as const, label: "Parastatals", desc: "State owned corporations and commissions ($1,000)" },
    { value: "government" as const, label: "Government Ministries", desc: "National and regional regulatory spaces ($850)" },
    { value: "farmers_association" as const, label: "Farmers Associations", desc: "Agricultural cooperatives and crop groups ($850)" },
    { value: "school" as const, label: "Schools & Colleges", desc: "Educational research and student showcases ($750)" },
    { value: "sme" as const, label: "SMEs & Local Traders", desc: "Small enterprise pavilions and local booths ($750)" },
  ];

  return (
    <main className="mx-auto w-[min(920px,calc(100vw-2rem))] pb-16 pt-10">
      <section className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-glow backdrop-blur-xl">
        <div className="section-header">
          <p className="eyebrow">Registration {step}/3</p>
          <h1>{step === 1 ? "Account & Company Profile" : step === 2 ? "Packages & Add-ons" : "Review Order & Total Due"}</h1>
        </div>

        {error && <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Step 1: Personal & Company Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/90">Full Name</label>
                  <input
                    type="text"
                    value={formState.fullName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    placeholder="Your full name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/90">Business Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    placeholder="email@company.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/90">Password</label>
                  <input
                    type="password"
                    value={formState.password}
                    onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/90">Phone / Mobile</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                    placeholder="+263 77..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-sm text-white/90">Company Name</label>
                <input
                  type="text"
                  value={formState.companyName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                  placeholder="Your company or organization"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm text-white/90">Classification</label>
                <div className="space-y-2">
                  {categoriesList.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formState.category === cat.value}
                        onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value as FormState["category"] }))}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{cat.label}</div>
                        <div className="text-xs text-white/60">{cat.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add-ons & Sponsorships */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-lss-green/30 bg-lss-green/5 p-4 text-sm text-white/80 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-lss-green shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lss-green">Package Inclusions</strong>
                  <p className="text-xs mt-1">Your {formState.category} stand includes booth space, company listing in trade directory, and digital promotional materials.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Additional Vehicle Passes", key: "addVehiclePasses", price: 200, desc: "Per pass" },
                  { label: "Multi-day Tickets (3-day)", key: "addMultiTickets", price: 50, desc: "Per ticket" },
                  { label: "Single Day Tickets", key: "addSingleTickets", price: 10, desc: "Per ticket" },
                  { label: "Dinner Gala Tickets", key: "dinnerTickets", price: 60, desc: "Per ticket" },
                ].map((addon) => (
                  <div key={addon.key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                    <div>
                      <div className="text-sm font-medium text-white">{addon.label}</div>
                      <div className="text-xs text-white/60">${addon.price} {addon.desc}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormState((prev) => ({ ...prev, [addon.key]: Math.max(0, prev[addon.key as keyof FormState] as number - 1) }))}
                        className="h-8 w-8 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm text-white">{formState[addon.key as keyof FormState]}</span>
                      <button
                        type="button"
                        onClick={() => setFormState((prev) => ({ ...prev, [addon.key]: (prev[addon.key as keyof FormState] as number) + 1 }))}
                        className="h-8 w-8 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <input
                  type="checkbox"
                  id="advertising"
                  checked={formState.wantsAdvertising}
                  onChange={(e) => setFormState((prev) => ({ ...prev, wantsAdvertising: e.target.checked }))}
                  className="h-4 w-4"
                />
                <label htmlFor="advertising" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-white">Arena Advertising Slot</div>
                  <div className="text-xs text-white/60">$400 for prominent audio-visual display</div>
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-white/90">Arena Sponsorships</label>
                <div className="space-y-2">
                  {sponsorships.map((sp) => (
                    <label key={sp.key} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10">
                      <input
                        type="checkbox"
                        checked={formState.selectedSponsorships.includes(sp.key)}
                        onChange={() => handleSponsorshipToggle(sp.key)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{sp.label}</div>
                      </div>
                      <div className="text-sm font-semibold text-lss-gold">${sp.price}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="text-sm text-white/60">
                  <div className="font-medium text-white mb-2">Registration Summary</div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <strong>{formState.fullName}</strong> from <strong>{formState.companyName}</strong>
                    </div>
                    <div>{formState.email}</div>
                    <div>{formState.phone}</div>
                    <div className="pt-1">Category: <strong>{categoriesList.find((c) => c.value === formState.category)?.label}</strong></div>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-white/80">
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-3">{categoriesList.find((c) => c.value === formState.category)?.label} Stand</td>
                      <td className="p-3 text-right">${pricing.basePrice}</td>
                    </tr>
                    {pricing.vehiclePrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Vehicle Passes ({formState.addVehiclePasses})</td>
                        <td className="p-3 text-right">${pricing.vehiclePrice}</td>
                      </tr>
                    )}
                    {pricing.multiTicketsPrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Multi-day Tickets ({formState.addMultiTickets})</td>
                        <td className="p-3 text-right">${pricing.multiTicketsPrice}</td>
                      </tr>
                    )}
                    {pricing.singleTicketsPrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Single Day Tickets ({formState.addSingleTickets})</td>
                        <td className="p-3 text-right">${pricing.singleTicketsPrice}</td>
                      </tr>
                    )}
                    {pricing.dinnerPrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Dinner Gala Tickets ({formState.dinnerTickets})</td>
                        <td className="p-3 text-right">${pricing.dinnerPrice}</td>
                      </tr>
                    )}
                    {pricing.advertisingPrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Arena Advertising Slot</td>
                        <td className="p-3 text-right">${pricing.advertisingPrice}</td>
                      </tr>
                    )}
                    {pricing.sponsorshipsPrice > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3">Arena Sponsorships ({formState.selectedSponsorships.length})</td>
                        <td className="p-3 text-right">${pricing.sponsorshipsPrice}</td>
                      </tr>
                    )}
                    <tr className="border-b border-white/10 bg-white/5">
                      <td className="p-3 font-medium">Subtotal</td>
                      <td className="p-3 text-right font-medium">${pricing.subtotal}</td>
                    </tr>
                    {pricing.earlyBirdDiscount > 0 && (
                      <tr className="border-b border-white/10">
                        <td className="p-3 text-lss-green font-medium">Early Bird Discount (10%)</td>
                        <td className="p-3 text-right text-lss-green font-medium">-${pricing.earlyBirdDiscount}</td>
                      </tr>
                    )}
                    <tr className="bg-lss-green/10">
                      <td className="p-3 font-bold text-white">Total Due (USD)</td>
                      <td className="p-3 text-right font-bold text-lss-gold text-lg">${pricing.totalUsd}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-lss-green/30 bg-lss-green/5 p-3 text-xs text-white/80 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-lss-green shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lss-green">Your registration is secure</strong>
                  <p>All information is encrypted and your payment reference will be generated upon successful account creation.</p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-gradient-to-r from-lss-green to-lss-gold px-6 py-3 rounded-2xl hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer font-bold text-xs uppercase tracking-widest text-[#041007]"
            >
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-lss-green to-lss-gold px-8 py-3 rounded-2xl hover:opacity-90 transition flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-widest text-[#041007] disabled:opacity-50"
            >
              <span>{isLoading ? "Creating Account..." : "Create Account & Proceed"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
