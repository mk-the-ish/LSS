import { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, UserMinus, Plus } from 'lucide-react';
import { ActiveSession, Profile } from '../types';

interface SessionSimulatorProps {
  currentProfile: Profile | null;
  sessions: ActiveSession[];
  onAddSimulatedSession: (deviceInfo: string) => void;
  onRemoveSession: (sessionId: string) => void;
  currentSessionId: string;
}

export default function SessionSimulator({
  currentProfile,
  sessions,
  onAddSimulatedSession,
  onRemoveSession,
  currentSessionId,
}: SessionSimulatorProps) {
  const [deviceType, setDeviceType] = useState<'Mobile' | 'Desktop'>('Mobile');

  if (!currentProfile) return null;

  return (
    <div className="bg-white border border-black/10 rounded-none p-5 shadow-sm space-y-4 font-sans max-w-md w-full">
      <div className="flex items-center gap-2 border-b border-black/10 pb-3">
        <ShieldCheck className="h-5 w-5 text-green-800" />
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
            Security Control Panel
          </h4>
          <p className="text-[11px] text-black/40">Anti-Password Sharing System (Max 2 devices)</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-black/60 leading-relaxed font-sans">
          The LSS Security System monitors active connections for <strong className="text-[#1A1A1A]">{currentProfile.company_name}</strong>. If a third device authenticates, the oldest session is instantly invalidated.
        </div>

        {/* Current Active Sessions list */}
        <div className="space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold">
            Active Sessions ({sessions.length}/2)
          </div>
          <div className="space-y-1.5">
            {sessions.map((session) => {
              const isCurrent = session.session_id === currentSessionId;
              const isMobile = session.device_info.toLowerCase().includes('phone') || session.device_info.toLowerCase().includes('mobile');
              return (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2.5 rounded-none border text-xs transition-colors ${
                    isCurrent
                      ? 'border-green-800/20 bg-green-50/20 text-stone-900'
                      : 'border-black/5 bg-[#FCFBF7] text-[#1A1A1A]/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isMobile ? (
                      <Smartphone className="h-4 w-4 text-green-800" />
                    ) : (
                      <Monitor className="h-4 w-4 text-green-800" />
                    )}
                    <div className="truncate">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="truncate">{session.device_info}</span>
                        {isCurrent && (
                          <span className="text-[8px] font-mono uppercase tracking-widest bg-green-800 text-white px-1.5 py-0.25 rounded-none font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-black/40 font-mono">
                        Active: {new Date(session.last_active).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      id={`btn-terminate-session-${session.id}`}
                      onClick={() => onRemoveSession(session.session_id)}
                      title="Terminate Session"
                      className="p-1.5 hover:bg-stone-200 rounded-none text-black/40 hover:text-red-600 transition cursor-pointer"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trigger Login on 3rd Device */}
        <div className="pt-2 border-t border-black/10">
          <div className="text-[9px] font-mono uppercase tracking-widest text-black/40 font-bold mb-2">
            Simulate New Device Sign-in
          </div>
          <div className="flex gap-2">
            <select
              id="select-device-type"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as 'Mobile' | 'Desktop')}
              className="bg-[#FCFBF7] border border-black/10 rounded-none px-2 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black font-mono font-bold"
            >
              <option value="Mobile">iPhone 17 (Mobile)</option>
              <option value="Desktop">MacBook Pro (Safari)</option>
            </select>
            <button
              id="btn-simulate-login-device"
              onClick={() => onAddSimulatedSession(deviceType === 'Mobile' ? 'iPhone 17 (Mobile)' : 'MacBook Pro (Safari)')}
              className="flex-1 bg-black text-white font-bold uppercase tracking-widest hover:bg-green-950 rounded-none px-3 py-1.5 text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Sign in 3rd Device</span>
            </button>
          </div>
          <p className="text-[9px] text-black/40 mt-2 italic font-mono">
            * This forces the oldest active session to be automatically deleted. If the deleted session is this current tab, you will be instantly logged out.
          </p>
        </div>
      </div>
    </div>
  );
}
