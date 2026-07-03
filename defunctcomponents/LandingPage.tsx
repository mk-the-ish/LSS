import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Phone, Mail, Award, Bookmark, BookmarkCheck } from 'lucide-react';
import { COMMITTEE_MEMBERS, EXECUTIVE_COMMITTEE, AGENDA_ITEMS } from '../data';

interface LandingPageProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export default function LandingPage({
  onRegisterClick,
  onLoginClick,
  bookmarkedIds,
  onToggleBookmark,
}: LandingPageProps) {
  const [activeDay, setActiveDay] = useState<'All' | 'Thursday' | 'Friday' | 'Saturday'>('All');

  const filteredAgenda = activeDay === 'All' 
    ? AGENDA_ITEMS 
    : AGENDA_ITEMS.filter(item => item.day === activeDay);

  return (
    <div className="bg-[#FCFBF7] text-[#1A1A1A] font-sans min-h-screen selection:bg-black selection:text-white flex flex-col md:flex-row overflow-x-hidden">
      
      {/* Navigation Sidebar (Geometric theme signature) */}
      <nav className="w-20 border-r border-black/10 flex flex-col items-center py-8 justify-between bg-white shrink-0 hidden lg:flex">
        <div className="font-serif text-2xl font-bold tracking-tighter text-[#1A1A1A]">LSS</div>
        <div className="flex flex-col gap-16">
          <div className="-rotate-90 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 whitespace-nowrap">Official Fair</div>
          <div className="-rotate-90 text-[10px] uppercase tracking-[0.3em] font-bold text-green-800 whitespace-nowrap">Schedule</div>
          <div className="-rotate-90 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 whitespace-nowrap">Committee</div>
        </div>
        <div className="text-[10px] font-mono font-bold">2026</div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Header */}
        <header className="h-20 border-b border-black/10 sticky top-0 bg-white/95 backdrop-blur-md z-40 transition-all">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 bg-black text-white flex items-center justify-center font-serif text-lg font-bold">
                LSS
              </span>
              <div>
                <span className="block font-serif text-sm font-semibold tracking-tight text-[#1A1A1A]">
                  Lowveld Show Society
                </span>
                <span className="block text-[9px] font-mono tracking-widest uppercase text-black/40">
                  Established 1968
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                id="btn-nav-signin"
                onClick={onLoginClick}
                className="text-[11px] uppercase tracking-widest font-bold text-black hover:text-green-800 transition"
              >
                Sign In
              </button>
              <button
                id="btn-nav-register"
                onClick={onRegisterClick}
                className="bg-black text-white text-[11px] uppercase tracking-widest font-bold px-6 py-2.5 hover:bg-green-900 transition rounded-none cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>
        </header>

        {/* Hero & Package Info Split Section (Geometric Grid) */}
        <section className="grid lg:grid-cols-12 gap-0 border-b border-black/10">
          <div className="lg:col-span-8 p-6 sm:p-12 lg:p-16 lg:border-r lg:border-black/10 flex flex-col justify-center bg-[#FCFBF7]">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-green-800 bg-green-50 border border-green-800/10 px-3 py-1">
                  <Award className="h-3.5 w-3.5" /> Official Trade Fair 2026
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif leading-[0.95] tracking-tight text-[#1A1A1A]">
                  Agricultural Show <br />
                  & <span className="italic font-light text-black/60">Trade Fair</span>
                </h1>
              </div>

              <div className="p-6 border-l-2 border-green-800 bg-white space-y-2">
                <span className="text-[9px] font-mono tracking-widest uppercase text-green-800 font-bold block">
                  Theme 2026
                </span>
                <p className="text-base sm:text-lg font-serif text-black/80 leading-relaxed font-semibold">
                  &ldquo;Harnessing the Lowveld&rsquo;s Agricultural Potential for Sustainable Growth and Value Addition&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap gap-y-4 gap-x-8 text-xs font-mono text-black/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-800" />
                  <span>Thursday 6th &ndash; Saturday 8th August 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-800" />
                  <span>LSS Showgrounds, Chiredzi</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  id="btn-hero-register"
                  onClick={onRegisterClick}
                  className="bg-black text-white text-[11px] uppercase tracking-widest font-bold px-8 py-4 hover:bg-green-950 transition rounded-none flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Register &amp; Secure Space</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  id="btn-hero-signin"
                  onClick={onLoginClick}
                  className="bg-white border border-black/20 text-[#1A1A1A] text-[11px] uppercase tracking-widest font-bold px-8 py-4 hover:bg-stone-50 transition rounded-none flex items-center justify-center cursor-pointer"
                >
                  <span>Already Registered? Sign In</span>
                </button>
              </div>
            </div>
          </div>

          {/* Highlights & Packages Side Column */}
          <div className="lg:col-span-4 bg-white flex flex-col divide-y divide-black/10">
            <div className="p-8 sm:p-10">
              <h3 className="text-[11px] uppercase tracking-widest font-bold mb-6 flex justify-between items-center text-[#1A1A1A]">
                Schedule Highlights <span className="text-green-800">→</span>
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="font-serif italic text-black/30 text-xl leading-none">06</span>
                  <div>
                    <p className="text-[12px] font-bold">Corporate Networking</p>
                    <p className="text-[11px] text-black/50">Stand Judging & Pro Sessions</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-serif italic text-black/30 text-xl leading-none">07</span>
                  <div>
                    <p className="text-[12px] font-bold">Business Conference</p>
                    <p className="text-[11px] text-black/50">Dinner & Official Opening</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-serif italic text-black/30 text-xl leading-none">08</span>
                  <div>
                    <p className="text-[12px] font-bold">Grand Finale</p>
                    <p className="text-[11px] text-black/50">Skydivers & Fireworks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] uppercase tracking-widest font-bold mb-6 text-[#1A1A1A]">Exhibitor Packages</h3>
                <p className="text-xs text-black/60 leading-relaxed mb-6">
                  Premium secure space including standard electricity, perimeter security, and inclusion in the digital business directory.
                </p>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-black/50">Corporate Space</span>
                  <span className="font-bold">$1,000</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-black/50">Government & Farmers</span>
                  <span className="font-bold">$850</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span className="text-black/50">SME & Schools</span>
                  <span className="font-bold">$750</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Schedule Timeline */}
        <section className="py-16 px-6 lg:px-12 bg-[#FCFBF7]">
          <div className="space-y-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-green-800 font-bold block">
                  Official Itinerary
                </span>
                <h2 className="text-3xl font-serif text-[#1A1A1A] tracking-tight">
                  Interactive Event Schedule
                </h2>
              </div>

              {/* Day Filter Controls */}
              <div className="flex flex-wrap gap-px bg-black/10 border border-black/10 text-[10px] uppercase font-bold tracking-wider">
                {(['All', 'Thursday', 'Friday', 'Saturday'] as const).map((day) => (
                  <button
                    key={day}
                    id={`btn-day-filter-${day}`}
                    onClick={() => setActiveDay(day)}
                    className={`px-5 py-3 transition duration-150 font-semibold cursor-pointer ${
                      activeDay === day
                        ? 'bg-black text-white'
                        : 'bg-white text-black/60 hover:text-black hover:bg-stone-50'
                    }`}
                  >
                    {day === 'All' ? 'All Days' : day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
              {filteredAgenda.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white p-8 flex flex-col justify-between relative hover:bg-[#FCFBF7] transition duration-200 ${
                      item.isPremium ? 'after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[3px] after:bg-green-800' : ''
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-widest uppercase text-green-800 bg-green-50 px-2.5 py-1 border border-green-800/10 font-bold">
                          {item.day} &bull; {item.time}
                        </span>
                        <button
                          id={`btn-bookmark-${item.id}`}
                          onClick={() => onToggleBookmark(item.id)}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Event"}
                          className="text-black/30 hover:text-black transition p-1 cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-4.5 w-4.5 text-green-800" />
                          ) : (
                            <Bookmark className="h-4.5 w-4.5" />
                          )}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-serif font-bold text-[#1A1A1A] leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-black/60 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {item.isPremium && (
                      <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-green-800 font-bold uppercase tracking-wider">
                          {item.ticketInfo}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About & LSS Committee Section */}
        <section className="py-16 px-6 lg:px-12 bg-white border-t border-black/10">
          <div className="space-y-16 max-w-7xl mx-auto">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-green-800 font-bold block">
                Leadership & Committee
              </span>
              <h2 className="text-3xl font-serif text-[#1A1A1A] tracking-tight">
                The Lowveld Show Society Secretariat
              </h2>
              <p className="text-sm text-black/60 leading-relaxed">
                We are dedicated to fostering agribusiness growth, investment, and high-quality networking portals in Zimbabwe&rsquo;s lowveld region. For registration questions, space bookings, or payment inquiries, reach out directly to our designated committee leads.
              </p>
            </div>

            {/* Committee Cards */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
                {COMMITTEE_MEMBERS.map((member) => (
                  <div
                    key={member.name}
                    className="bg-[#FCFBF7] p-8 transition duration-150 flex flex-col justify-between h-56"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-black text-white rounded-none font-serif font-bold text-sm flex items-center justify-center border border-black">
                          {member.avatarLetter}
                        </div>
                        <div>
                          <h4 className="text-[9px] font-mono tracking-widest uppercase text-green-800 font-bold">
                            {member.role}
                          </h4>
                          <h3 className="text-sm font-bold text-[#1A1A1A]">
                            {member.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/10 flex flex-col gap-2 text-xs text-black/70 font-mono">
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2 hover:text-green-800 transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-black/30" />
                        <span>{member.phone}</span>
                      </a>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 hover:text-green-800 transition truncate"
                        >
                          <Mail className="h-3.5 w-3.5 text-black/30" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Executive Committee list */}
              <div className="bg-[#FCFBF7] border border-black/10 p-8">
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 space-y-1">
                    <h4 className="text-[10px] font-mono tracking-widest uppercase text-green-800 font-bold">
                      Additional Support
                    </h4>
                    <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
                      Executive Committee Members
                    </h3>
                  </div>
                  <div className="md:col-span-8 flex flex-wrap gap-2">
                    {EXECUTIVE_COMMITTEE.map((name) => (
                      <span
                        key={name}
                        className="bg-white border border-black/10 px-4 py-2 text-xs text-black/80 font-serif hover:border-green-800/30 transition duration-150 cursor-default"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-300 py-12 px-6 lg:px-12 border-t border-black/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 bg-black border border-white/10 text-white flex items-center justify-center font-serif text-base font-bold">
                LSS
              </span>
              <span>&copy; 2026 Lowveld Show Society. All rights reserved.</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 text-stone-400">
              <span>Chiredzi Showgrounds</span>
              <span className="text-white">lowveldshowsociety4@gmail.com</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
