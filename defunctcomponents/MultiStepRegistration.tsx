import { useState, useEffect, FormEvent } from 'react';
import { User, Mail, Lock, Phone, Building, Plus, Minus, Check, ChevronLeft, ChevronRight, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRICING_RULES, BANK_DETAILS } from '../data';
import { Profile, ExhibitorCategory } from '../types';

interface MultiStepRegistrationProps {
  onRegisterSubmit: (profile: Partial<Profile>) => void;
  onBackToLanding: () => void;
  onAlreadyRegistered: () => void;
}

export default function MultiStepRegistration({
  onRegisterSubmit,
  onBackToLanding,
  onAlreadyRegistered,
}: MultiStepRegistrationProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<ExhibitorCategory>('corporate');

  // Quantities & Add-ons State
  const [addVehiclePasses, setAddVehiclePasses] = useState(0);
  const [addMultiTickets, setAddMultiTickets] = useState(0);
  const [addSingleTickets, setAddSingleTickets] = useState(0);
  const [dinnerTickets, setDinnerTickets] = useState(0);
  const [wantsAdvertising, setWantsAdvertising] = useState(false);
  const [selectedSponsorships, setSelectedSponsorships] = useState<string[]>([]);

  // Simulation State: June 25th (Before early bird deadline) vs Current (After deadline)
  const [simulateEarlyBirdDate, setSimulateEarlyBirdDate] = useState(true);

  // Dynamic calculations
  const [basePrice, setBasePrice] = useState(1000);
  const [vehiclePrice, setVehiclePrice] = useState(0);
  const [multiTicketsPrice, setMultiTicketsPrice] = useState(0);
  const [singleTicketsPrice, setSingleTicketsPrice] = useState(0);
  const [dinnerPrice, setDinnerPrice] = useState(0);
  const [advertisingPrice, setAdvertisingPrice] = useState(0);
  const [sponsorshipsPrice, setSponsorshipsPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(0);
  const [totalUsd, setTotalUsd] = useState(0);
  const [totalZwg, setTotalZwg] = useState(0);

  // Update prices on inputs change
  useEffect(() => {
    const base = PRICING_RULES.packages[category] || 750;
    setBasePrice(base);

    const vehicle = addVehiclePasses * PRICING_RULES.vehiclePass;
    setVehiclePrice(vehicle);

    const multi = addMultiTickets * PRICING_RULES.multiTicket;
    setMultiTicketsPrice(multi);

    const single = addSingleTickets * PRICING_RULES.singleTicket;
    setSingleTicketsPrice(single);

    const dinner = dinnerTickets * PRICING_RULES.dinnerTicket;
    setDinnerPrice(dinner);

    const adv = wantsAdvertising ? PRICING_RULES.advertisingSlot : 0;
    setAdvertisingPrice(adv);

    const sponsorSum = selectedSponsorships.reduce((sum, name) => {
      return sum + (PRICING_RULES.sponsorships[name] || 0);
    }, 0);
    setSponsorshipsPrice(sponsorSum);

    const currentSubtotal = base + vehicle + multi + single + dinner + adv + sponsorSum;
    setSubtotal(currentSubtotal);

    // Early bird is 10% on the TOTAL AMOUNT if registered before June 30th
    const discount = simulateEarlyBirdDate ? Math.round(currentSubtotal * 0.1 * 100) / 100 : 0;
    setEarlyBirdDiscount(discount);

    const finalUsd = currentSubtotal - discount;
    setTotalUsd(finalUsd);

    // ZWG rate conversion
    setTotalZwg(Math.round(finalUsd * BANK_DETAILS.usdToZwgRate * 100) / 100);
  }, [
    category,
    addVehiclePasses,
    addMultiTickets,
    addSingleTickets,
    dinnerTickets,
    wantsAdvertising,
    selectedSponsorships,
    simulateEarlyBirdDate
  ]);

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !password.trim() || !phone.trim() || !companyName.trim()) {
        setError('Please fill out all personal and business fields before proceeding.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSponsorshipToggle = (name: string) => {
    if (selectedSponsorships.includes(name)) {
      setSelectedSponsorships(selectedSponsorships.filter(s => s !== name));
    } else {
      setSelectedSponsorships([...selectedSponsorships, name]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !phone.trim() || !companyName.trim()) {
      setError('Required profile information is missing.');
      return;
    }

    // Prepare simulated registration profile
    const profileData: Partial<Profile> = {
      email,
      full_name: fullName,
      company_name: companyName,
      category,
      phone,
      additional_vehicle_passes: addVehiclePasses,
      additional_multi_tickets: addMultiTickets,
      additional_single_tickets: addSingleTickets,
      dinner_tickets_qty: dinnerTickets,
      wants_advertising: wantsAdvertising,
      selected_sponsorships: selectedSponsorships,
      calculated_total_usd: totalUsd,
      is_early_bird: simulateEarlyBirdDate,
      registration_date: simulateEarlyBirdDate ? '2026-06-25T12:00:00Z' : '2026-07-02T12:00:00Z',
    };

    onRegisterSubmit(profileData);
  };

  const categoriesList: { value: ExhibitorCategory; label: string; desc: string }[] = [
    { value: 'corporate', label: 'Corporate Stands', desc: 'Premium exhibition space for large entities ($1,000)' },
    { value: 'parastatal', label: 'Parastatals', desc: 'State owned corporations and commissions ($1,000)' },
    { value: 'government', label: 'Government Ministries', desc: 'National and regional regulatory spaces ($850)' },
    { value: 'farmers_association', label: 'Farmers Associations', desc: 'Agricultural cooperatives and crop groups ($850)' },
    { value: 'school', label: 'Schools & Colleges', desc: 'Educational research and student showcases ($750)' },
    { value: 'sme', label: 'SMEs & Local Traders', desc: 'Small enterprise pavilions and local booths ($750)' },
  ];

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen py-12 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-12 bg-white rounded-none border border-black/10 overflow-hidden">
        
        {/* Progress sidebar - Geometric signature */}
        <div className="md:col-span-4 bg-stone-900 text-stone-300 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/10">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-white">
              <span className="h-8 w-8 bg-white text-stone-900 rounded-none flex items-center justify-center font-serif font-black text-sm">
                LSS
              </span>
              <span className="font-serif font-bold text-xs uppercase tracking-wider">
                LSS Trade Fair 2026
              </span>
            </div>

            <div className="space-y-6">
              {[
                { stepNum: 1, title: "Company Profile", desc: "Credentials & classification" },
                { stepNum: 2, title: "Add-ons & Branding", desc: "Passes, tickets & sponsorships" },
                { stepNum: 3, title: "Review & Checkout", desc: "Verify totals and submit" }
              ].map((s) => (
                <div key={s.stepNum} className="flex gap-4">
                  <div className={`h-8 w-8 rounded-none border flex items-center justify-center text-xs font-mono font-bold transition ${
                    step === s.stepNum 
                      ? 'bg-white text-stone-900 border-white' 
                      : step > s.stepNum 
                        ? 'bg-green-800 text-white border-green-800' 
                        : 'text-stone-500 border-stone-800'
                  }`}>
                    {step > s.stepNum ? <Check className="h-3.5 w-3.5" /> : s.stepNum}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-none ${step === s.stepNum ? 'text-white' : 'text-stone-400'}`}>
                      {s.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 space-y-3">
            <div className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">
              Assistance Line
            </div>
            <div className="text-xs text-stone-300 font-mono">
              Chairman: +263 77 226 9110
            </div>
            <button
              id="btn-back-to-landing"
              onClick={onBackToLanding}
              className="text-stone-400 hover:text-white transition text-[11px] underline block font-mono text-left cursor-pointer"
            >
              &larr; Return to main site
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8 p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-serif font-bold tracking-tight text-[#1A1A1A]">
                {step === 1 && "Account & Company Profile"}
                {step === 2 && "Packages, Add-ons & Sponsorships"}
                {step === 3 && "Review Order & Total Due"}
              </h2>
              <button
                id="btn-already-registered"
                onClick={onAlreadyRegistered}
                className="text-[11px] uppercase tracking-wider font-bold text-black/60 hover:text-black underline cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-none p-3.5 mb-6 font-mono">
                {error}
              </div>
            )}

            {/* STEP 1: Profile & Credentials */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                      Full Representative Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-black/30" />
                      <input
                        id="input-fullname"
                        type="text"
                        placeholder="e.g. Tendai Mashonga"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-black/30" />
                      <input
                        id="input-email"
                        type="email"
                        placeholder="e.g. info@company.co.zw"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                      Secure Account Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-black/30" />
                      <input
                        id="input-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                      Contact / Mobile Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-black/30" />
                      <input
                        id="input-phone"
                        type="text"
                        placeholder="e.g. +263 77 111 2222"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                    Registered Company / Institution Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-black/30" />
                    <input
                      id="input-company"
                      type="text"
                      placeholder="e.g. Lowveld Sugar Growers Co."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                    />
                  </div>
                </div>

                {/* Classification Picker */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                    Exhibitor Category Classification
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {categoriesList.map((c) => (
                      <button
                        key={c.value}
                        id={`btn-select-category-${c.value}`}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`text-left p-3 rounded-none border transition-all cursor-pointer ${
                          category === c.value
                            ? 'bg-black border-black text-white'
                            : 'bg-[#FCFBF7] border-black/10 hover:border-black/30 text-[#1A1A1A]'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{c.label}</div>
                        <div className={`text-[9px] mt-0.5 uppercase tracking-wider ${category === c.value ? 'text-stone-300' : 'text-black/40'}`}>
                          {c.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Packages & Add-ons */}
            {step === 2 && (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                
                {/* Package Features Notice */}
                <div className="bg-[#FCFBF7] border border-black/10 rounded-none p-4 text-[11px] text-[#1A1A1A]/80 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-800 shrink-0" />
                  <div>
                    <span className="font-bold text-[#1A1A1A] block uppercase tracking-wider">Included with {categoriesList.find(c => c.value === category)?.label}:</span>
                    Your base package fee ($ {basePrice}) automatically includes <strong>2 complimentary admissions (tickets)</strong> and <strong>1 official arena vehicle pass</strong>. Configure additional needs below.
                  </div>
                </div>

                {/* Add-on Counters */}
                <div className="space-y-2.5">
                  {/* Vehicle Passes */}
                  <div className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-none border border-black/10">
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Additional Vehicle Passes</h4>
                      <p className="text-[10px] text-black/40 font-mono">USD $200 per pass</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-vehicle-minus"
                        type="button"
                        onClick={() => setAddVehiclePasses(Math.max(0, addVehiclePasses - 1))}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{addVehiclePasses}</span>
                      <button
                        id="btn-vehicle-plus"
                        type="button"
                        onClick={() => setAddVehiclePasses(addVehiclePasses + 1)}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Multi Entry Ticket */}
                  <div className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-none border border-black/10">
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Additional Tickets (Multiple Entry)</h4>
                      <p className="text-[10px] text-black/40 font-mono">USD $50 per ticket</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-multi-ticket-minus"
                        type="button"
                        onClick={() => setAddMultiTickets(Math.max(0, addMultiTickets - 1))}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{addMultiTickets}</span>
                      <button
                        id="btn-multi-ticket-plus"
                        type="button"
                        onClick={() => setAddMultiTickets(addMultiTickets + 1)}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Single Admission Ticket */}
                  <div className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-none border border-black/10">
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Additional Tickets (Single Entry)</h4>
                      <p className="text-[10px] text-black/40 font-mono">USD $10 per ticket</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-single-ticket-minus"
                        type="button"
                        onClick={() => setAddSingleTickets(Math.max(0, addSingleTickets - 1))}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{addSingleTickets}</span>
                      <button
                        id="btn-single-ticket-plus"
                        type="button"
                        onClick={() => setAddSingleTickets(addSingleTickets + 1)}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Business Dinner Ticket */}
                  <div className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-none border border-black/10">
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Business Conference & Dinner Tickets</h4>
                      <p className="text-[10px] text-black/40 font-mono">USD $60 per ticket (Friday Night Gala)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="btn-dinner-ticket-minus"
                        type="button"
                        onClick={() => setDinnerTickets(Math.max(0, dinnerTickets - 1))}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{dinnerTickets}</span>
                      <button
                        id="btn-dinner-ticket-plus"
                        type="button"
                        onClick={() => setDinnerTickets(dinnerTickets + 1)}
                        className="h-8 w-8 rounded-none bg-white border border-black/10 flex items-center justify-center hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 10-Min Live Arena Advertising */}
                  <div className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-none border border-black/10">
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">10-Minute Arena PA Advertising Slot</h4>
                      <p className="text-[10px] text-black/40 font-mono">USD $400 (Public announcement slot)</p>
                    </div>
                    <button
                      id="btn-advertising-toggle"
                      type="button"
                      onClick={() => setWantsAdvertising(!wantsAdvertising)}
                      className={`px-4 py-1.5 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
                        wantsAdvertising
                          ? 'bg-green-800 text-white border border-green-800'
                          : 'bg-white border border-black/10 text-[#1A1A1A] hover:border-black/30'
                      }`}
                    >
                      {wantsAdvertising ? 'SELECTED' : 'ADD SLOT'}
                    </button>
                  </div>
                </div>

                {/* Arena Sponsorship / Branding */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                    Branding & Arena Sponsorship Options
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(PRICING_RULES.sponsorships).map(([name, price]) => {
                      const isSelected = selectedSponsorships.includes(name);
                      return (
                        <button
                          key={name}
                          id={`btn-sponsor-${name.toLowerCase().replace(/[^a-z]/g, '')}`}
                          type="button"
                          onClick={() => handleSponsorshipToggle(name)}
                          className={`p-3 rounded-none border text-left flex justify-between items-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-green-50 border-green-800 text-green-900 font-bold'
                              : 'bg-[#FCFBF7] border-black/10 hover:border-black/30 text-[#1A1A1A]'
                          }`}
                        >
                          <div>
                            <div className="text-xs leading-tight font-bold">{name}</div>
                            <div className="text-[9px] text-black/40 uppercase tracking-wider mt-0.5">Sponsorship</div>
                          </div>
                          <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-green-800' : 'text-black/60'}`}>
                            ${price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Summary */}
            {step === 3 && (
              <div className="space-y-5">
                
                {/* Early Bird Simulator Controller */}
                <div className="p-3 bg-[#FCFBF7] border border-black/10 rounded-none flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-green-800" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Test Early Bird Discount (10%)</span>
                      <p className="text-[10px] text-black/40">Applies if registration is before June 30th, 2026</p>
                    </div>
                  </div>
                  <button
                    id="btn-toggle-earlybird"
                    type="button"
                    onClick={() => setSimulateEarlyBirdDate(!simulateEarlyBirdDate)}
                    className={`px-3 py-1.5 rounded-none text-xs font-semibold font-mono transition-all cursor-pointer ${
                      simulateEarlyBirdDate
                        ? 'bg-green-800 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {simulateEarlyBirdDate ? "ACTIVE (June 25)" : "EXPIRED (July 2)"}
                  </button>
                </div>

                {/* Line Item List */}
                <div className="border border-black/10 rounded-none overflow-hidden text-xs">
                  <div className="bg-[#FCFBF7] px-4 py-2.5 border-b border-black/10 font-mono text-[9px] uppercase tracking-widest text-black/40 font-bold">
                    Line Item Statement
                  </div>
                  <div className="divide-y divide-black/10 px-4 max-h-[160px] overflow-y-auto">
                    
                    {/* Base Fee */}
                    <div className="py-2.5 flex justify-between">
                      <div>
                        <span className="font-bold text-[#1A1A1A]">Base Pack ({categoriesList.find(c => c.value === category)?.label})</span>
                        <p className="text-[10px] text-black/40 font-mono">Includes 2 admissions, 1 vehicle pass</p>
                      </div>
                      <span className="font-mono font-bold">${basePrice}</span>
                    </div>

                    {/* Additional Vehicle Passes */}
                    {addVehiclePasses > 0 && (
                      <div className="py-2.5 flex justify-between">
                        <span>Additional Vehicle Passes ({addVehiclePasses} &times; $200)</span>
                        <span className="font-mono font-bold">${vehiclePrice}</span>
                      </div>
                    )}

                    {/* Multi Entrance */}
                    {addMultiTickets > 0 && (
                      <div className="py-2.5 flex justify-between">
                        <span>Multi Admission Tickets ({addMultiTickets} &times; $50)</span>
                        <span className="font-mono font-bold">${multiTicketsPrice}</span>
                      </div>
                    )}

                    {/* Single Entrance */}
                    {addSingleTickets > 0 && (
                      <div className="py-2.5 flex justify-between">
                        <span>Single Admission Tickets ({addSingleTickets} &times; $10)</span>
                        <span className="font-mono font-bold">${singleTicketsPrice}</span>
                      </div>
                    )}

                    {/* Dinner */}
                    {dinnerTickets > 0 && (
                      <div className="py-2.5 flex justify-between">
                        <span>Gala Dinner Admissions ({dinnerTickets} &times; $60)</span>
                        <span className="font-mono font-bold">${dinnerPrice}</span>
                      </div>
                    )}

                    {/* Advertising */}
                    {wantsAdvertising && (
                      <div className="py-2.5 flex justify-between">
                        <span>10-Min Live PA Arena Advertising</span>
                        <span className="font-mono font-bold">${advertisingPrice}</span>
                      </div>
                    )}

                    {/* Sponsorships */}
                    {selectedSponsorships.length > 0 && (
                      <div className="py-2.5 flex justify-between">
                        <div>
                          <span className="font-bold">Arena Sponsorships</span>
                          <p className="text-[10px] text-black/40">{selectedSponsorships.join(', ')}</p>
                        </div>
                        <span className="font-mono font-bold">${sponsorshipsPrice}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Total block */}
                  <div className="bg-[#FCFBF7] border-t border-black/10 px-4 py-3 space-y-2">
                    {earlyBirdDiscount > 0 && (
                      <div className="flex justify-between text-green-800 font-bold">
                        <span>Early Bird Discount (10%)</span>
                        <span className="font-mono">- ${earlyBirdDiscount}</span>
                      </div>
                    )}

                    {/* USD Display */}
                    <div className="flex justify-between text-black font-bold text-sm">
                      <span>Total Amount Due (USD)</span>
                      <span className="font-mono">${totalUsd}</span>
                    </div>

                    {/* ZWG Display at CBZ Official Rate */}
                    <div className="flex justify-between text-green-950 font-bold text-sm border-t border-black/10 pt-2">
                      <span>Total Amount Due (ZWG)</span>
                      <span className="font-mono text-green-800 font-bold">
                        ZWG {(totalZwg).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-[9px] text-black/40 font-mono text-right">
                      * Official CBZ Bank Conversion Rate: 1 USD = {BANK_DETAILS.usdToZwgRate} ZWG
                    </div>
                  </div>
                </div>

                <div className="bg-[#FCFBF7] p-3 rounded-none border border-black/10 text-[10px] text-[#1A1A1A]/70 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="h-4.5 w-4.5 text-green-800 shrink-0" />
                  <div>
                    By submitting this registration, you authorize the Lowveld Show Society to record your trade profile in our directory. Payment must be cleared manually via CBZ transfer before accessing the physical trade pavilions.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                id="btn-prev-step"
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 text-xs font-bold text-black/60 hover:text-black transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                id="btn-next-step"
                type="button"
                onClick={handleNextStep}
                className="bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-none hover:bg-green-900 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                id="btn-submit-registration"
                onClick={handleSubmit}
                className="bg-green-800 text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-none hover:bg-green-900 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Submit &amp; Upload Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
