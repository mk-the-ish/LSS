export type ExhibitorCategory = 'corporate' | 'farmers_association' | 'parastatal' | 'school' | 'government' | 'sme';

export type VerificationStatus = 'pending_payment' | 'pending_verification' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  category: ExhibitorCategory;
  phone: string;
  
  // Selection details
  additional_vehicle_passes: number;
  additional_multi_tickets: number;
  additional_single_tickets: number;
  dinner_tickets_qty: number;
  wants_advertising: boolean;
  selected_sponsorships: string[]; // e.g. ["VIP Grand Stand", "Main Podium"]
  calculated_total_usd: number;
  is_early_bird: boolean;
  registration_date: string; // ISO string to test early bird easily
  
  // POP and Verification Details
  verification_status: VerificationStatus;
  pop_url: string | null; // Data-URL or filename for simulated upload
  rejection_reason?: string;
  pop_uploaded_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  session_id: string;
  last_active: string;
  device_info: string;
}

export interface AgendaItem {
  id: string;
  day: 'Thursday' | 'Friday' | 'Saturday';
  date: string;
  time: string;
  title: string;
  description: string;
  isPremium?: boolean;
  ticketInfo?: string;
}

export interface CommitteeMember {
  name: string;
  role: string;
  phone: string;
  email?: string;
  avatarLetter: string;
}

export interface EmailLog {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  body: string;
}
