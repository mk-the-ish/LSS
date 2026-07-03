export type RegistrationCategory =
  | "corporate"
  | "farmers_association"
  | "parastatal"
  | "school"
  | "government"
  | "sme";

export type VerificationStatus = "pending_payment" | "pending_verification" | "verified" | "rejected";
export type ViewState = "public" | "register" | "payment" | "locked" | "verified" | "admin";

export const schedule = [
  {
    day: "Thursday 6 August",
    title: "Opening and Trade Focus",
    time: "06:00 - 15:00",
    details: ["Gates open at 06:00", "Stand judging 10:00 - 15:00", "Corporate networking and exhibitor engagement"],
  },
  {
    day: "Friday 7 August",
    title: "Parade, Performances, and Conference",
    time: "08:00 - 20:00",
    details: ["Grand procession at 08:00", "Music and performances at 09:00", "Official opening at 12:30", "Business conference and dinner at 18:30"],
  },
  {
    day: "Saturday 8 August",
    title: "Grand Finale",
    time: "09:00 - Late",
    details: ["Motorbike stuntmen", "Skydivers", "Fireworks and closing celebrations"],
  },
];

export const committee = [
  ["Vennancio Kurauone", "Chairman", "+263772269110"],
  ["Sharon Darikwa", "Vice Chairman", "+263772968879"],
  ["Tawanda P. Chitete", "Secretary General", "+263772732398"],
  ["Fidelis Harry", "Treasurer", "+263772426985"],
  ["Calvin Chauke", "Executive", "Committee"],
  ["Alexio Koti", "Executive", "Committee"],
  ["Shepherd Mawire", "Executive", "Committee"],
  ["Memory Marumbini", "Executive", "Committee"],
  ["Patrick Mangwiro", "Executive", "Committee"],
  ["P. Machingambi", "Executive", "Committee"],
];

export const verifiedDirectory = [
  { company: "Green Valley Agro", category: "Corporate", contact: "T. Moyo | +263 77 200 0100" },
  { company: "Lowveld Grain Alliance", category: "Farmers Association", contact: "S. Dube | +263 77 200 0200" },
  { company: "Chiredzi Milling Co.", category: "Parastatal", contact: "R. Ncube | +263 77 200 0300" },
  { company: "Mkwasine Secondary", category: "School", contact: "A. Sithole | +263 77 200 0400" },
  { company: "AgriTech Zimbabwe", category: "SME", contact: "N. Hove | +263 77 200 0500" },
  { company: "District Agriculture Office", category: "Government", contact: "P. Gwatidzo | +263 77 200 0600" },
];

export const sponsorships = [
  { key: "vip_grand_stand", label: "VIP Grand Stand", price: 2000 },
  { key: "main_podium", label: "Main Podium", price: 1000 },
  { key: "vip_lounge", label: "VIP Lounge & Bar", price: 2000 },
  { key: "main_gate", label: "Main Gate", price: 2000 },
  { key: "fireworks", label: "Fireworks / Musical", price: 2000 },
  { key: "paratroopers", label: "Paratroopers / Road Show", price: 2000 },
];

export const initialRegistration = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  companyName: "",
  category: "corporate" as RegistrationCategory,
  vehiclePasses: 0,
  multiTickets: 0,
  singleTickets: 0,
  dinnerTickets: 0,
  wantsAdvertising: false,
  sponsorships: [] as string[],
  paymentMethod: "USD" as "USD" | "ZWG",
  verificationStatus: "pending_payment" as VerificationStatus,
  popFileName: "",
  popUploaded: false,
};

export function prettyCategory(value: string) {
  const map: Record<string, string> = {
    corporate: "Corporate",
    farmers_association: "Farmers Association",
    parastatal: "Parastatal",
    school: "School",
    government: "Government",
    sme: "SME",
  };

  return map[value] ?? "Corporate";
}

export function statusLabel(value: string) {
  const map: Record<string, string> = {
    pending_payment: "Pending payment",
    pending_verification: "Pending verification",
    verified: "Verified exhibitor",
    rejected: "Rejected",
  };

  return map[value] ?? "Pending payment";
}
