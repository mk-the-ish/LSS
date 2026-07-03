import { CommitteeMember, AgendaItem, Profile, ExhibitorCategory } from './types';

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    name: "Vennancio Kurauone",
    role: "Chairman",
    phone: "+263 77 226 9110",
    email: "lowveldshowsociety4@gmail.com",
    avatarLetter: "V"
  },
  {
    name: "Sharon Darikwa",
    role: "Vice Chairman",
    phone: "+263 77 296 8879",
    avatarLetter: "S"
  },
  {
    name: "Tawanda P. Chitete",
    role: "Secretary General",
    phone: "+263 77 273 2398",
    avatarLetter: "T"
  },
  {
    name: "Fidelis Harry",
    role: "Treasurer",
    phone: "+263 77 242 6985",
    avatarLetter: "F"
  }
];

export const EXECUTIVE_COMMITTEE: string[] = [
  "Calvin Chauke",
  "Alexio Koti",
  "Shepherd Mawire",
  "Memory Marumbini",
  "Patrick Mangwiro",
  "P. Machingambi"
];

export const PRICING_RULES = {
  packages: {
    corporate: 1000,
    parastatal: 1000,
    government: 850,
    farmers_association: 850,
    school: 750,
    sme: 750
  },
  vehiclePass: 200,
  multiTicket: 50,
  singleTicket: 10,
  dinnerTicket: 60,
  advertisingSlot: 400,
  sponsorships: {
    "VIP Grand Stand": 2000,
    "Main Podium": 1000,
    "VIP Lounge & Bar": 2000,
    "Main Gate": 2000,
    "Fireworks/Musical": 2000,
    "Paratroopers/Road Show": 2000
  } as Record<string, number>
};

export const AGENDA_ITEMS: AgendaItem[] = [
  // Thursday
  {
    id: "thurs-1",
    day: "Thursday",
    date: "6th August 2026",
    time: "06:00",
    title: "Gates Open & Exhibitor Setup",
    description: "Welcome to Lowveld Agricultural Show 2026. Gates open for trade stands, cattle check-ins, and industrial exhibitions setup. High-profile visitor registration opens."
  },
  {
    id: "thurs-2",
    day: "Thursday",
    date: "6th August 2026",
    time: "10:00 - 15:00",
    title: "Official Stand Judging & Evaluation",
    description: "LSS Judging Committee reviews and rates corporate, government, SME, and school stands. Focused purely on corporate networking and professional showcase."
  },
  // Friday
  {
    id: "fri-1",
    day: "Friday",
    date: "7th August 2026",
    time: "08:00",
    title: "The Grand Procession",
    description: "A spectacular morning street march featuring the brass band, local companies, and community floats starting from Chiredzi center to the Showgrounds Arena."
  },
  {
    id: "fri-2",
    day: "Friday",
    date: "7th August 2026",
    time: "09:00",
    title: "Cultural Exhibits & Live Music",
    description: "Traditional dances, local musical acts, and agricultural poetry readings in the main arena highlighting Lowveld heritage and innovative farming."
  },
  {
    id: "fri-3",
    day: "Friday",
    date: "7th August 2026",
    time: "12:30",
    title: "Official Opening & Speeches",
    description: "Keynote address by the Guest of Honor, Ministry delegates, and the LSS Chairman. Highlights are on 'Harnessing the Lowveld's Agricultural Potential for Sustainable Growth and Value Addition'."
  },
  {
    id: "fri-4",
    day: "Friday",
    date: "7th August 2026",
    time: "18:30 - Late",
    title: "Agricultural Business Conference & Dinner Gala",
    description: "The premier high-level networking event at the VIP Lounge. Engage with key policy-makers, sugar industry leaders, and financial partners.",
    isPremium: true,
    ticketInfo: "Requires Dinner Ticket (USD $60)"
  },
  // Saturday
  {
    id: "sat-1",
    day: "Saturday",
    date: "8th August 2026",
    time: "09:00",
    title: "Cattle & Crop Show Championship Finals",
    description: "Announcement of the grand champion bull, finest sugar-cane yields, and top innovative organic farmers. Award ceremonies in the main pavilion."
  },
  {
    id: "sat-2",
    day: "Saturday",
    date: "8th August 2026",
    time: "13:00",
    title: "The Arena Grand Finale Spectacle",
    description: "Unforgettable high-octane family entertainment featuring extreme Motorbike Stuntmen, expert Paratroopers/Skydivers descending into the center, and live band performances."
  },
  {
    id: "sat-3",
    day: "Saturday",
    date: "8th August 2026",
    time: "19:30",
    title: "Spectacular Fireworks & Closing Display",
    description: "The traditional midnight-sky pyrotechnic show to mark the official successful close of the LSS 2026 Trade Fair."
  }
];

export const MOCK_VERIFIED_EXHIBITORS: Profile[] = [
  {
    id: "ex-1",
    email: "info@tongat-hulett.co.zw",
    full_name: "Tendai Mashonga",
    company_name: "Tongaat Hulett Zimbabwe",
    category: "corporate",
    phone: "+263 77 111 2222",
    additional_vehicle_passes: 2,
    additional_multi_tickets: 10,
    additional_single_tickets: 20,
    dinner_tickets_qty: 5,
    wants_advertising: true,
    selected_sponsorships: ["VIP Grand Stand"],
    calculated_total_usd: 3900.00,
    is_early_bird: true,
    registration_date: "2026-06-15T10:00:00Z",
    verification_status: "verified",
    pop_url: "simulated_pop_tongat.pdf",
    pop_uploaded_at: "2026-06-16T11:00:00Z",
    created_at: "2026-06-15T10:00:00Z",
    updated_at: "2026-06-16T11:00:00Z"
  },
  {
    id: "ex-2",
    email: "contact@croco-motors.co.zw",
    full_name: "Farai Croco",
    company_name: "Croco Motors Chiredzi",
    category: "corporate",
    phone: "+263 77 333 4444",
    additional_vehicle_passes: 1,
    additional_multi_tickets: 5,
    additional_single_tickets: 10,
    dinner_tickets_qty: 2,
    wants_advertising: false,
    selected_sponsorships: ["Main Podium"],
    calculated_total_usd: 2570.00,
    is_early_bird: true,
    registration_date: "2026-06-20T08:30:00Z",
    verification_status: "verified",
    pop_url: "simulated_pop_croco.jpg",
    pop_uploaded_at: "2026-06-21T09:15:00Z",
    created_at: "2026-06-20T08:30:00Z",
    updated_at: "2026-06-21T09:15:00Z"
  },
  {
    id: "ex-3",
    email: "lowveld_farmers@association.org",
    full_name: "Chipo Marandure",
    company_name: "Lowveld Sugarcane Growers Association",
    category: "farmers_association",
    phone: "+263 77 444 5555",
    additional_vehicle_passes: 0,
    additional_multi_tickets: 2,
    additional_single_tickets: 15,
    dinner_tickets_qty: 2,
    wants_advertising: true,
    selected_sponsorships: [],
    calculated_total_usd: 1520.00,
    is_early_bird: false,
    registration_date: "2026-07-01T14:20:00Z",
    verification_status: "verified",
    pop_url: "simulated_pop_lsga.png",
    pop_uploaded_at: "2026-07-01T15:00:00Z",
    created_at: "2026-07-01T14:20:00Z",
    updated_at: "2026-07-01T15:00:00Z"
  },
  {
    id: "ex-4",
    email: "head@chiredzihigh.sch.zw",
    full_name: "Mavis Gumbo",
    company_name: "Chiredzi High School",
    category: "school",
    phone: "+263 77 555 6666",
    additional_vehicle_passes: 0,
    additional_multi_tickets: 0,
    additional_single_tickets: 50,
    dinner_tickets_qty: 0,
    wants_advertising: false,
    selected_sponsorships: [],
    calculated_total_usd: 1250.00,
    is_early_bird: true,
    registration_date: "2026-06-25T09:00:00Z",
    verification_status: "verified",
    pop_url: "simulated_pop_chs.pdf",
    pop_uploaded_at: "2026-06-25T11:45:00Z",
    created_at: "2026-06-25T09:00:00Z",
    updated_at: "2026-06-25T11:45:00Z"
  },
  {
    id: "ex-5",
    email: "sales@lowveld-fertilizers.zw",
    full_name: "Patrick Gava",
    company_name: "Lowveld Fertilizers & Seeds",
    category: "sme",
    phone: "+263 77 666 7777",
    additional_vehicle_passes: 1,
    additional_multi_tickets: 2,
    additional_single_tickets: 10,
    dinner_tickets_qty: 1,
    wants_advertising: true,
    selected_sponsorships: [],
    calculated_total_usd: 1510.00,
    is_early_bird: false,
    registration_date: "2026-07-02T10:00:00Z",
    verification_status: "verified",
    pop_url: "pop_fertilizer.jpg",
    pop_uploaded_at: "2026-07-02T11:00:00Z",
    created_at: "2026-07-02T10:00:00Z",
    updated_at: "2026-07-02T11:00:00Z"
  }
];

export const BANK_DETAILS = {
  bankName: "CBZ Chiredzi Branch",
  zwgAccountNumber: "02822820570017",
  nostroUsdAccountNumber: "02822820570027",
  usdToZwgRate: 25.5, // Simulated official bank rate ZWG per USD
  contactEmail: "lowveldshowsociety4@gmail.com"
};
