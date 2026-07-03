import { Mail, Phone, LogOut, Clock } from 'lucide-react';
import { Profile } from '../types';
import { COMMITTEE_MEMBERS, BANK_DETAILS } from '../data';

interface VerificationGateProps {
  currentProfile: Profile;
  onLogout: () => void;
}

export default function VerificationGate({ currentProfile, onLogout }: VerificationGateProps) {
  const chairman = COMMITTEE_MEMBERS.find((m) => m.role === 'Chairman');

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen py-16 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-black/10 rounded-none p-8 space-y-8 relative overflow-hidden text-center">
        {/* Decorative Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-800" />

        <div className="space-y-4">
          <div className="h-14 w-14 bg-[#FCFBF7] rounded-none border border-black/10 flex items-center justify-center mx-auto text-green-800">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-serif font-bold text-[#1A1A1A]">
              Audit in Progress
            </h1>
            <p className="text-[10px] text-black/40 font-mono uppercase tracking-widest font-bold">
              Verification Code: Pending Verification
            </p>
          </div>
        </div>

        {/* Audit context text */}
        <div className="bg-[#FCFBF7] border border-black/10 p-5 rounded-none text-left space-y-3.5 text-xs">
          <p className="text-black/70 leading-relaxed font-sans">
            Thank you, <strong className="text-[#1A1A1A]">{currentProfile.full_name}</strong>. We have received your submitted proof of payment for <strong className="text-[#1A1A1A]">{currentProfile.company_name}</strong>.
          </p>
          <p className="text-black/70 leading-relaxed font-sans">
            The LSS Secretariat is currently auditing bank transfer records against our CBZ statement logs. This process typically takes between <strong className="text-[#1A1A1A]">1 to 4 hours</strong> during regular working periods.
          </p>
          <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] font-mono font-bold">
            <span className="text-black/40">Invoice Sum:</span>
            <span className="text-green-800">${currentProfile.calculated_total_usd} USD</span>
          </div>
        </div>

        {/* Official contact channels */}
        <div className="space-y-3 pt-2">
          <div className="text-[9px] font-mono tracking-widest text-black/40 uppercase font-bold text-left">
            Assistance & Urgent Clearance
          </div>
          <div className="space-y-2 text-xs text-stone-700 text-left">
            <a
              href={`mailto:${BANK_DETAILS.contactEmail}`}
              className="flex items-center gap-2 bg-[#FCFBF7] hover:bg-stone-50 p-2.5 rounded-none border border-black/10 transition"
            >
              <Mail className="h-4 w-4 text-green-800" />
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-black/40 block uppercase font-bold leading-none mb-0.5">LSS Secretariat Email</span>
                <span className="font-bold truncate text-[#1A1A1A] block">{BANK_DETAILS.contactEmail}</span>
              </div>
            </a>
            
            {chairman && (
              <a
                href={`tel:${chairman.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 bg-[#FCFBF7] hover:bg-stone-50 p-2.5 rounded-none border border-black/10 transition"
              >
                <Phone className="h-4 w-4 text-green-800" />
                <div>
                  <span className="text-[9px] font-mono text-black/40 block uppercase font-bold leading-none mb-0.5">Chairman Kurauone</span>
                  <span className="font-bold text-[#1A1A1A] block">{chairman.phone}</span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-black/10 flex flex-col gap-2">
          <button
            id="btn-verification-logout"
            onClick={onLogout}
            className="w-full bg-black text-white font-bold text-xs uppercase tracking-widest py-3 rounded-none hover:bg-green-950 transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out &amp; Return Later</span>
          </button>
          
          <p className="text-[9px] text-black/40 italic font-mono pt-2">
            * This tab will automatically unlock once the administrator reviews and verifies your CBZ transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
