import { useState, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { Profile } from '../types';
import { BANK_DETAILS, MOCK_VERIFIED_EXHIBITORS } from '../data';

interface AdminDashboardProps {
  profiles: Profile[]; // Dynamic list from App state
  onApproveProfile: (id: string) => void;
  onRejectProfile: (id: string, reason: string) => void;
  onLogout: () => void;
  onResetDatabase: () => void; // Reset to default mock lists for convenient testing
}

export default function AdminDashboard({
  profiles,
  onApproveProfile,
  onRejectProfile,
  onLogout,
  onResetDatabase,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Confirmed Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Segregate profiles
  const pendingProfiles = useMemo(() => {
    return profiles.filter((p) => p.verification_status === 'pending_verification');
  }, [profiles]);

  const confirmedProfiles = useMemo(() => {
    // Combine dynamic state verified profiles with static verified ones
    const uniqueMap = new Map<string, Profile>();
    
    // Add dynamic verified
    profiles.forEach(p => {
      if (p.verification_status === 'verified') {
        uniqueMap.set(p.id, p);
      }
    });

    // Add static verified
    MOCK_VERIFIED_EXHIBITORS.forEach(p => {
      uniqueMap.set(p.id, p);
    });

    return Array.from(uniqueMap.values());
  }, [profiles]);

  // Selected Pending Profile for Detail view
  const selectedPendingProfile = useMemo(() => {
    if (!selectedPendingId) return null;
    return pendingProfiles.find((p) => p.id === selectedPendingId) || null;
  }, [selectedPendingId, pendingProfiles]);

  // Filter Confirmed Lists
  const filteredConfirmed = useMemo(() => {
    return confirmedProfiles.filter((p) => {
      const matchesSearch =
        p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [confirmedProfiles, searchQuery, selectedCategory]);

  const handleApprove = (id: string) => {
    onApproveProfile(id);
    setSelectedPendingId(null);
  };

  const handleRejectClick = () => {
    if (!selectedPendingId) return;
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedPendingId || !rejectionReason.trim()) return;
    onRejectProfile(selectedPendingId, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedPendingId(null);
  };

  const categoryLabels: Record<string, string> = {
    corporate: 'Corporate Stand',
    farmers_association: 'Farmers Association',
    parastatal: 'Parastatals',
    school: 'School/College',
    government: 'Government Ministry',
    sme: 'SME / Local Trader',
  };

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen flex flex-col">
      {/* Admin header */}
      <header className="bg-stone-900 text-white border-b border-black sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 bg-stone-800 text-white rounded-none flex items-center justify-center font-serif text-base font-bold border border-stone-750">
              LSS
            </span>
            <div>
              <span className="block font-mono text-[9px] font-bold tracking-widest uppercase text-stone-400">
                LSS Secretariat Admin
              </span>
              <span className="block text-sm font-serif font-bold text-stone-100">
                Agricultural Trade Fair 2026 Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px] uppercase font-bold tracking-wider">
            <button
              id="btn-admin-reset"
              onClick={onResetDatabase}
              title="Reset Simulated State"
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 px-3 py-1.5 rounded-none transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset State</span>
            </button>
            <button
              id="btn-admin-logout"
              onClick={onLogout}
              className="bg-red-950 text-red-300 border border-red-900 px-3 py-1.5 rounded-none transition font-bold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Area Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Navigation Tabs and Quick Stats Side Bar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-black/10 rounded-none p-2 space-y-1">
            <button
              id="btn-admin-tab-pending"
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-black text-white'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#FCFBF7]'
              }`}
            >
              <span>Pending POP Queue</span>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold ${
                pendingProfiles.length > 0 ? 'bg-yellow-400 text-stone-900' : 'bg-stone-100 text-stone-400'
              }`}>
                {pendingProfiles.length}
              </span>
            </button>

            <button
              id="btn-admin-tab-confirmed"
              onClick={() => setActiveTab('confirmed')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'confirmed'
                  ? 'bg-black text-white'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#FCFBF7]'
              }`}
            >
              <span>Confirmed Trade Exhibitors</span>
              <span className="font-mono text-[9px] bg-[#FCFBF7] text-stone-700 border border-black/10 px-1.5 py-0.5 rounded-none font-bold">
                {confirmedProfiles.length}
              </span>
            </button>
          </div>

          {/* Quick Statistics Block */}
          <div className="bg-white border border-black/10 rounded-none p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-black/10 pb-2">
              <ShieldCheck className="h-4 w-4 text-green-800" />
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold">
                Trade Fair Financials
              </h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-black/40 text-[9px] uppercase font-bold tracking-wider">Total Confirmed Revenue</span>
                <p className="text-lg font-bold font-sans text-[#1A1A1A] mt-0.5">
                  ${confirmedProfiles.reduce((sum, p) => sum + p.calculated_total_usd, 0).toLocaleString()} USD
                </p>
              </div>

              <div className="pt-2 border-t border-black/10">
                <span className="text-black/40 text-[9px] uppercase font-bold tracking-wider">ZWG Equivalent Check</span>
                <p className="text-sm font-sans font-bold text-green-800 mt-0.5">
                  ZWG {(confirmedProfiles.reduce((sum, p) => sum + p.calculated_total_usd, 0) * BANK_DETAILS.usdToZwgRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: PENDING APPROVALS LIST & INLINE VIEWER */}
          {activeTab === 'pending' && (
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Left Column: List of Pendings */}
              <div className="md:col-span-5 bg-white border border-black/10 rounded-none p-5 space-y-4">
                <div className="border-b border-black/10 pb-3">
                  <h2 className="text-sm font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Review Queue
                  </h2>
                  <p className="text-[11px] text-black/50 mt-1 font-sans leading-normal">
                    Click on an entry below to review corporate metadata and submitted proof of payment files.
                  </p>
                </div>

                {pendingProfiles.length === 0 ? (
                  <div className="text-center py-12 text-black/40 font-mono text-xs space-y-2 bg-[#FCFBF7] border border-black/5">
                    <CheckCircle2 className="h-8 w-8 text-green-800 mx-auto opacity-70" />
                    <p className="font-bold">Queue Empty</p>
                    <p className="text-[10px] text-black/40 leading-normal max-w-xs mx-auto font-sans">
                      All submitted payments are processed! Sign up a new exhibitor to test verification workflows.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {pendingProfiles.map((p) => (
                      <button
                        key={p.id}
                        id={`btn-select-pending-${p.id}`}
                        onClick={() => setSelectedPendingId(p.id)}
                        className={`w-full text-left p-4 rounded-none border text-xs transition cursor-pointer ${
                          selectedPendingId === p.id
                            ? 'bg-black text-white border-black'
                            : 'bg-[#FCFBF7] border-black/10 hover:border-black/30 text-[#1A1A1A]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold truncate max-w-[120px] font-serif">{p.company_name}</h3>
                          <span className="font-mono text-[10px] font-bold">${p.calculated_total_usd}</span>
                        </div>
                        <div className={`text-[10px] mt-1.5 ${selectedPendingId === p.id ? 'text-stone-300' : 'text-black/50'}`}>
                          Rep: {p.full_name}
                        </div>
                        <div className="text-[9px] font-mono uppercase mt-1">
                          Ref: LSS26-{p.phone.replace(/[^0-9]/g, '').slice(-4)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Inline POP Document Viewer & Controls */}
              <div className="md:col-span-7 bg-white border border-black/10 rounded-none p-5 flex flex-col justify-between">
                {selectedPendingProfile ? (
                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-5">
                      {/* Top Header */}
                      <div className="flex justify-between items-start border-b border-black/10 pb-3">
                        <div>
                          <h3 className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold">Exhibitor Audit File</h3>
                          <h2 className="text-base font-serif font-bold text-[#1A1A1A] mt-0.5">
                            {selectedPendingProfile.company_name}
                          </h2>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-black/40 uppercase font-bold">Total Due</span>
                          <p className="text-sm font-bold text-green-800">${selectedPendingProfile.calculated_total_usd} USD</p>
                        </div>
                      </div>

                      {/* Detail Checklist metadata */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono bg-[#FCFBF7] p-3 border border-black/10 rounded-none">
                        <div>
                          <span className="text-[9px] text-black/40 block uppercase font-bold">Representative</span>
                          <span className="font-sans font-bold text-[#1A1A1A]">{selectedPendingProfile.full_name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-black/40 block uppercase font-bold">Mobile Phone</span>
                          <span className="font-sans font-semibold text-[#1A1A1A]">{selectedPendingProfile.phone}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-[9px] text-black/40 block uppercase font-bold">Classification</span>
                          <span className="font-sans font-medium text-[#1A1A1A]">{categoryLabels[selectedPendingProfile.category]}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-[9px] text-black/40 block uppercase font-bold">Registration Date</span>
                          <span className="text-[#1A1A1A]">{new Date(selectedPendingProfile.registration_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* POP Document Sandbox View (simulates rendering of PDF/JPG POP) */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-black/50 block font-bold">
                          Submitted POP Image/Doc View
                        </span>
                        
                        <div className="border border-black/10 rounded-none bg-[#FCFBF7] p-4 min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
                          {selectedPendingProfile.pop_url && selectedPendingProfile.pop_url.startsWith('data:') ? (
                            <img
                              src={selectedPendingProfile.pop_url}
                              alt="Proof of Payment Preview"
                              className="max-h-36 object-contain rounded-none border border-black/10"
                            />
                          ) : (
                            <div className="text-center space-y-2">
                              <FileText className="h-10 w-10 text-black/30 mx-auto" />
                              <span className="text-xs font-bold text-[#1A1A1A] block">
                                {selectedPendingProfile.pop_url || 'simulated_proof_statement.pdf'}
                              </span>
                              <span className="text-[10px] text-black/40 block">Uploaded on {selectedPendingProfile.pop_uploaded_at ? new Date(selectedPendingProfile.pop_uploaded_at).toLocaleDateString() : 'Today'}</span>
                            </div>
                          )}

                          {/* Overlay Indicator */}
                          <div className="absolute top-2 right-2 text-[8px] font-mono text-black/40 bg-white border border-black/10 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                            Simulated CBZ Statement Attachment
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="pt-6 border-t border-black/10 flex gap-3">
                      <button
                        id="btn-admin-reject"
                        onClick={handleRejectClick}
                        className="flex-1 bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 font-bold text-xs uppercase tracking-widest py-3 rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject POP</span>
                      </button>

                      <button
                        id="btn-admin-approve"
                        onClick={() => handleApprove(selectedPendingProfile.id)}
                        className="flex-1 bg-green-800 text-white hover:bg-green-950 font-bold text-xs uppercase tracking-widest py-3 rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Approve Payment</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-black/40 flex flex-col justify-center items-center gap-3 bg-[#FCFBF7] border border-black/5 h-full">
                    <FileText className="h-12 w-12 opacity-30 text-stone-400" />
                    <p className="text-xs font-mono uppercase tracking-widest font-bold">Select a pending exhibitor profile to review file attachments.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONFIRMED BUSINESSES LIST */}
          {activeTab === 'confirmed' && (
            <div className="bg-white border border-black/10 rounded-none p-6 space-y-6">
              <div className="border-b border-black/10 pb-3">
                <h2 className="text-base font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Confirmed Exhibitors Directory
                </h2>
                <p className="text-xs text-black/60 mt-1 font-sans leading-normal">
                  Checklist of all approved trade exhibitors with cleared payments. Use this grid to verify physical pavilion setups.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-black/30" />
                  <input
                    id="input-admin-search"
                    type="text"
                    placeholder="Search confirmed company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                  />
                </div>

                <select
                  id="select-admin-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#FCFBF7] border border-black/10 rounded-none px-3 py-2 text-xs text-black/70 focus:outline-none focus:border-black font-mono font-bold"
                >
                  <option value="all">All Classifications</option>
                  <option value="corporate">Corporates</option>
                  <option value="farmers_association">Farmers Associations</option>
                  <option value="parastatal">Parastatals</option>
                  <option value="school">Schools &amp; Colleges</option>
                  <option value="government">Government Ministries</option>
                  <option value="sme">SMEs / Traders</option>
                </select>
              </div>

              {/* Verified Checklist Table */}
              <div className="border border-black/10 rounded-none overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FCFBF7] border-b border-black/10 font-mono text-[9px] uppercase font-bold tracking-widest text-black/40">
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Manager</th>
                      <th className="p-3">Classification</th>
                      <th className="p-3">Phone Details</th>
                      <th className="p-3 text-right">Settled Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {filteredConfirmed.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-black/40 font-mono">
                          No confirmed exhibitors matching the filter settings.
                        </td>
                      </tr>
                    ) : (
                      filteredConfirmed.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FCFBF7] transition">
                          <td className="p-3 font-bold text-[#1A1A1A] font-serif">{p.company_name}</td>
                          <td className="p-3 text-black/70 font-sans">{p.full_name}</td>
                          <td className="p-3 font-mono">
                            <span className="text-[10px] bg-white border border-black/10 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider text-black/60">
                              {categoryLabels[p.category] || p.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-black/50">{p.phone}</td>
                          <td className="p-3 font-mono font-bold text-green-800 text-right">${p.calculated_total_usd}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Rejection Prompt Modal */}
      {showRejectModal && selectedPendingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-black/15 rounded-none max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                Confirm POP Rejection
              </h3>
            </div>

            <p className="text-xs text-black/60 leading-relaxed font-sans">
              Input the exact rejection feedback explaining why <strong className="text-[#1A1A1A]">{selectedPendingProfile.company_name}&rsquo;s</strong> proof of payment transaction was declined. This reverts their portal to the transfer and upload stage so they can re-submit correct details.
            </p>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase tracking-widest text-black/40 block font-bold">
                Declination Reason / Audit Feedback
              </label>
              <textarea
                id="textarea-rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Transaction amount does not match the invoice. Ref number is missing."
                className="w-full bg-[#FCFBF7] border border-black/10 rounded-none p-3 text-xs focus:outline-none focus:border-black font-medium h-24 resize-none text-[#1A1A1A]"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-black/10">
              <button
                id="btn-modal-cancel-reject"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 bg-[#FCFBF7] border border-black/10 rounded-none text-xs font-bold uppercase tracking-widest py-2.5 hover:bg-stone-50 text-[#1A1A1A] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-modal-confirm-reject"
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmReject}
                className={`flex-1 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-none transition ${
                  rejectionReason.trim()
                    ? 'bg-red-700 hover:bg-red-800 cursor-pointer'
                    : 'bg-[#FCFBF7] text-black/30 border border-black/5 cursor-not-allowed'
                }`}
              >
                Reject POP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
