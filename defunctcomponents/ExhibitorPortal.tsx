import { useState, useMemo } from 'react';
import { Search, BadgeCheck, Users, Calendar, Award, Phone, Mail, LogOut, Bookmark, BookmarkCheck, IdCard, Check } from 'lucide-react';
import { Profile } from '../types';
import { AGENDA_ITEMS, MOCK_VERIFIED_EXHIBITORS } from '../data';

interface ExhibitorPortalProps {
  currentProfile: Profile;
  verifiedProfiles: Profile[]; // Dynamic list including any newly approved profiles
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onLogout: () => void;
}

export default function ExhibitorPortal({
  currentProfile,
  verifiedProfiles,
  bookmarkedIds,
  onToggleBookmark,
  onLogout,
}: ExhibitorPortalProps) {
  const [activeTab, setActiveTab] = useState<'directory' | 'agenda' | 'badge'>('directory');

  // Directory Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Print Badge State
  const [isPrinting, setIsPrinting] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);

  // Combine standard mock verified profiles and dynamic newly approved profiles
  const allVerifiedProfiles = useMemo(() => {
    // Avoid duplicate IDs
    const uniqueMap = new Map<string, Profile>();
    
    // Add custom profiles from state
    verifiedProfiles.forEach(p => {
      if (p.verification_status === 'verified') {
        uniqueMap.set(p.id, p);
      }
    });

    // Add static verified ones
    MOCK_VERIFIED_EXHIBITORS.forEach(p => {
      uniqueMap.set(p.id, p);
    });

    return Array.from(uniqueMap.values());
  }, [verifiedProfiles]);

  // Filter verified directory
  const filteredDirectory = useMemo(() => {
    return allVerifiedProfiles.filter((p) => {
      const matchesSearch =
        p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allVerifiedProfiles, searchQuery, selectedCategory]);

  const categoryLabels: Record<string, string> = {
    corporate: 'Corporate Stand',
    farmers_association: 'Farmers Association',
    parastatal: 'Parastatal',
    school: 'School/College',
    government: 'Government Ministry',
    sme: 'SME / Local Trader',
  };

  const handlePrintBadge = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setShowPrintSuccess(true);
      setTimeout(() => setShowPrintSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen flex flex-col">
      {/* Portal Header */}
      <header className="border-b border-black/10 bg-white z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 bg-black text-white rounded-none flex items-center justify-center font-serif text-lg font-bold">
              LSS
            </span>
            <div>
              <span className="block font-serif text-sm font-bold tracking-tight text-[#1A1A1A]">
                Lowveld Show Society
              </span>
              <span className="block text-[9px] font-mono tracking-widest uppercase text-green-800 font-bold">
                Exhibition Portal 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-[#1A1A1A]">{currentProfile.company_name}</span>
              <span className="block text-[9px] font-mono text-green-800 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED EXHIBITOR
              </span>
            </div>
            
            <button
              id="btn-portal-logout"
              onClick={onLogout}
              title="Sign Out"
              className="p-2.5 hover:bg-[#FCFBF7] rounded-none text-black/50 hover:text-black border border-transparent hover:border-black/10 transition cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* Navigation / Profile side column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Exhibitor Quick Badging */}
          <div className="bg-white border border-black/10 rounded-none p-5 text-center space-y-4">
            <div className="h-14 w-14 bg-[#FCFBF7] border border-black/10 text-green-800 rounded-none flex items-center justify-center mx-auto">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold">Exhibitor Space</h3>
              <h2 className="text-base font-serif font-bold text-[#1A1A1A] mt-1 leading-tight">
                {currentProfile.company_name}
              </h2>
              <span className="inline-block mt-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-green-50 border border-green-800/10 text-green-800 px-2.5 py-0.5 rounded-none">
                {categoryLabels[currentProfile.category]}
              </span>
            </div>

            <div className="pt-4 border-t border-black/10 grid grid-cols-2 gap-2 text-left font-mono text-[9px] text-black/40">
              <div>
                <span>REP:</span>
                <span className="block font-sans font-bold text-[#1A1A1A] text-xs truncate mt-0.5">{currentProfile.full_name}</span>
              </div>
              <div>
                <span>MOBILE:</span>
                <span className="block font-sans font-bold text-[#1A1A1A] text-xs truncate mt-0.5">{currentProfile.phone}</span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Menu */}
          <div className="bg-white border border-black/10 rounded-none p-2 space-y-1">
            <button
              id="btn-tab-directory"
              onClick={() => setActiveTab('directory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-black text-white'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#FCFBF7]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>B2B Directory</span>
              <span className="ml-auto bg-stone-100 text-stone-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                {allVerifiedProfiles.length}
              </span>
            </button>

            <button
              id="btn-tab-agenda"
              onClick={() => setActiveTab('agenda')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                activeTab === 'agenda'
                  ? 'bg-black text-white'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#FCFBF7]'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Show Agenda</span>
              {bookmarkedIds.length > 0 && (
                <span className="ml-auto bg-green-800 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            <button
              id="btn-tab-badge"
              onClick={() => setActiveTab('badge')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                activeTab === 'badge'
                  ? 'bg-black text-white'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#FCFBF7]'
              }`}
            >
              <IdCard className="h-4 w-4" />
              <span>Digital Pass</span>
            </button>
          </div>
        </div>

        {/* Dynamic content column */}
        <div className="lg:col-span-9 bg-white border border-black/10 rounded-none p-6 sm:p-8">
          
          {/* TAB 1: B2B DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-black/10 pb-4">
                <h1 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                  Exhibition Directory (B2B Networking)
                </h1>
                <p className="text-xs text-black/60 font-sans leading-relaxed">
                  Connect and coordinate with all verified businesses registered for the 2026 Show. Leverage synergistic agricultural, trade, and financial partnerships.
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-black/30" />
                  <input
                    id="input-directory-search"
                    type="text"
                    placeholder="Search by company or manager..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FCFBF7] border border-black/10 rounded-none py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-black font-medium text-[#1A1A1A]"
                  />
                </div>

                <select
                  id="select-directory-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#FCFBF7] border border-black/10 rounded-none px-3 py-2 text-xs text-black/70 focus:outline-none focus:border-black font-mono font-bold"
                >
                  <option value="all">All Classifications</option>
                  <option value="corporate">Corporates</option>
                  <option value="farmers_association">Farmers Associations</option>
                  <option value="parastatal">Parastatals</option>
                  <option value="school">Schools &amp; Colleges</option>
                  <option value="government">Government Departments</option>
                  <option value="sme">SMEs / Traders</option>
                </select>
              </div>

              {/* Exhibitors Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredDirectory.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-black/40 bg-[#FCFBF7] border border-black/5">
                    <Users className="h-10 w-10 mx-auto opacity-30 mb-2" />
                    <p className="text-xs font-mono">No matching confirmed exhibitors found.</p>
                  </div>
                ) : (
                  filteredDirectory.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#FCFBF7] border border-black/10 rounded-none p-4 hover:border-black transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-mono tracking-widest bg-white border border-black/10 text-black/50 px-2 py-0.5 rounded-none uppercase font-bold">
                              {categoryLabels[p.category] || p.category}
                            </span>
                            <h3 className="text-sm font-bold text-[#1A1A1A] mt-1.5 leading-tight font-serif">
                              {p.company_name}
                            </h3>
                          </div>
                          
                          <span className="text-[9px] bg-green-50 text-green-800 border border-green-800/20 rounded-none px-2 py-0.5 font-mono flex items-center gap-1 font-bold shrink-0 uppercase tracking-wider">
                            <Check className="h-2.5 w-2.5" /> Confirmed
                          </span>
                        </div>

                        <div className="text-xs text-black/60 space-y-1 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="text-black/40 font-mono text-[10px] uppercase font-bold">Representative:</span>
                            <span className="font-semibold text-[#1A1A1A]">{p.full_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-black/10 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-black/50">
                        <a href={`tel:${p.phone.replace(/\s+/g, '')}`} className="hover:text-green-800 transition flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {p.phone}
                        </a>
                        <a href={`mailto:${p.email}`} className="hover:text-green-800 transition flex items-center gap-1 truncate max-w-[150px]">
                          <Mail className="h-3 w-3" /> {p.email}
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-black/10 pb-4">
                <h1 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                  Detailed Event Schedule (3 Days)
                </h1>
                <p className="text-xs text-black/60 font-sans leading-relaxed">
                  Keep track of official processions, livestock presentations, stunts, and business gala tables.
                </p>
              </div>

              {/* Bookmarked filter toggle */}
              <div className="flex items-center justify-between bg-[#FCFBF7] p-3 border border-black/10 rounded-none">
                <span className="text-xs text-black/70">
                  Quick-Filter your saved agenda items
                </span>
                <span className="text-xs text-green-800 font-mono font-bold uppercase tracking-wider">
                  Bookmarks saved: {bookmarkedIds.length}
                </span>
              </div>

              {/* Agenda list */}
              <div className="space-y-4">
                {AGENDA_ITEMS.map((item) => {
                  const isSaved = bookmarkedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`border p-5 rounded-none flex items-start justify-between gap-4 transition ${
                        item.isPremium 
                          ? 'border-green-800/20 bg-green-50/20' 
                          : isSaved 
                            ? 'border-black bg-[#FCFBF7]' 
                            : 'border-black/10 bg-white hover:border-black/30'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <span className="text-[9px] font-mono tracking-widest uppercase text-green-800 bg-green-50 border border-green-800/10 px-2.5 py-0.5 rounded-none font-bold">
                          {item.day} &bull; {item.time}
                        </span>
                        
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug flex items-center gap-2 font-serif">
                            {item.title}
                            {item.isPremium && (
                              <span className="text-[9px] font-mono bg-yellow-50 text-amber-950 border border-amber-900/10 px-1.5 py-0.5 rounded-none uppercase font-bold tracking-wider">
                                Business Dinner Ticket Required
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-black/60 leading-relaxed max-w-2xl font-sans">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button
                        id={`btn-portal-bookmark-${item.id}`}
                        onClick={() => onToggleBookmark(item.id)}
                        className="text-black/30 hover:text-black transition p-1.5 rounded-none hover:bg-stone-100 shrink-0 cursor-pointer"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-5 w-5 text-green-800" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL BADGE */}
          {activeTab === 'badge' && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-black/10 pb-4">
                <h1 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A]">
                  Digital Entrance Pass & Badge
                </h1>
                <p className="text-xs text-black/60 font-sans leading-relaxed">
                  Your official 2026 digital badge. Present this on your mobile screen or print it for QR scanning at Chiredzi Showgrounds Main Gate for immediate VIP clearance.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-6">
                
                {/* Visual Pass Layout */}
                <div className="w-80 bg-stone-900 text-white border border-black rounded-none shadow-2xl overflow-hidden flex flex-col justify-between aspect-[3/5] relative">
                  
                  {/* Decorative Header */}
                  <div className="bg-black px-5 py-4 flex justify-between items-center border-b border-white/5">
                    <div>
                      <span className="block font-serif text-sm font-bold text-white leading-none">LSS 2026</span>
                      <span className="block text-[8px] font-mono text-green-400 tracking-widest uppercase mt-1 font-bold">TRADE SHOW PASS</span>
                    </div>
                    <BadgeCheck className="h-6 w-6 text-green-400" />
                  </div>

                  {/* Body Info */}
                  <div className="p-6 text-center space-y-6 flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-green-400 tracking-widest uppercase font-bold">
                        EXHIBITOR MANAGER
                      </span>
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                        {currentProfile.full_name}
                      </h2>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block font-bold">
                        COMPANY REPRESENTED
                      </span>
                      <p className="font-serif font-semibold text-stone-100 text-sm">
                        {currentProfile.company_name}
                      </p>
                    </div>

                    {/* Simulating QR Code */}
                    <div className="bg-white p-3 inline-block mx-auto border border-white/5 rounded-none">
                      <div className="h-28 w-28 bg-white flex items-center justify-center relative">
                        {/* Custom QR SVG/CSS */}
                        <div className="grid grid-cols-5 gap-1.5 p-1">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-4 w-4 rounded-none ${
                                (i * 3 + 7) % 5 === 0 || (i * 2) % 4 === 0 ? 'bg-stone-900' : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Center Icon placeholder */}
                        <div className="absolute inset-0 m-auto h-7 w-7 bg-stone-900 border border-white text-green-400 flex items-center justify-center font-serif text-[10px] font-bold rounded-none">
                          LSS
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Tag */}
                  <div className="bg-black px-5 py-3 border-t border-white/5 flex justify-between items-center font-mono text-[9px]">
                    <span className="text-stone-400 uppercase">Status:</span>
                    <span className="font-bold text-green-400 tracking-widest uppercase">VERIFIED EXHIBITOR</span>
                  </div>
                </div>

                {/* Badge Options */}
                <div className="max-w-xs space-y-4">
                  <div className="space-y-2 text-xs text-black/60 font-sans">
                    <h4 className="font-bold text-[#1A1A1A] uppercase tracking-wider">Badge Details:</h4>
                    <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                      <li>Provides direct gate entry for <strong>2 staff members</strong></li>
                      <li>Allows <strong>1 vehicle entry</strong> inside exhibitors' parking arena</li>
                      <li>Allows priority seats in key trade presentation workshops</li>
                    </ul>
                  </div>

                  <button
                    id="btn-print-badge"
                    onClick={handlePrintBadge}
                    disabled={isPrinting}
                    className="w-full bg-black text-white font-bold text-xs uppercase tracking-widest py-3 rounded-none hover:bg-green-900 transition duration-150 cursor-pointer"
                  >
                    {isPrinting ? 'GENERATING PRINTABLE PDF...' : 'DOWNLOAD / PRINT BADGE PASS'}
                  </button>

                  {showPrintSuccess && (
                    <div className="bg-green-50 border border-green-800/10 text-green-900 font-mono text-xs rounded-none p-3 text-center">
                      Digital Pass dispatched to <strong className="font-bold">{currentProfile.email}</strong> successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
