import { sponsorships } from "./lss-data";
import type { RegistrationCategory } from "./lss-data";

export type RegistrationState = {
  category: RegistrationCategory;
  vehiclePasses: number;
  multiTickets: number;
  singleTickets: number;
  dinnerTickets: number;
  wantsAdvertising: boolean;
  sponsorships: string[];
};

export function calculatePricing(reg: RegistrationState) {
  const basePrices: Record<RegistrationCategory, number> = {
    corporate: 1000,
    parastatal: 1000,
    government: 850,
    farmers_association: 850,
    school: 750,
    sme: 750,
  };

  const base = basePrices[reg.category] ?? 750;
  const vehiclePasses = Number(reg.vehiclePasses || 0) * 200;
  const multiTickets = Number(reg.multiTickets || 0) * 50;
  const singleTickets = Number(reg.singleTickets || 0) * 10;
  const dinnerTickets = Number(reg.dinnerTickets || 0) * 60;
  const advertising = reg.wantsAdvertising ? 400 : 0;
  const sponsorshipTotal = reg.sponsorships.reduce((sum, key) => {
    const item = sponsorships.find((entry) => entry.key === key);
    return sum + (item ? item.price : 0);
  }, 0);
  const subtotal = base + vehiclePasses + multiTickets + singleTickets + dinnerTickets + advertising + sponsorshipTotal;
  const earlyBird = new Date() < new Date("2026-06-30T23:59:59");
  const discount = earlyBird ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return { base, vehiclePasses, multiTickets, singleTickets, dinnerTickets, advertising, sponsorshipTotal, subtotal, discount, total, earlyBird };
}
