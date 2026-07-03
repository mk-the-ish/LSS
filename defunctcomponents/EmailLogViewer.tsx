import { useState } from 'react';
import { Mail, Clock, X, Check } from 'lucide-react';
import { EmailLog } from '../types';

interface EmailLogViewerProps {
  logs: EmailLog[];
  onClear: () => void;
}

export default function EmailLogViewer({ logs, onClear }: EmailLogViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
      <button
        id="btn-email-logs-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-none shadow-lg hover:bg-green-950 transition duration-200 text-xs font-mono border border-black uppercase tracking-widest font-bold cursor-pointer"
      >
        <Mail className="h-4 w-4 text-green-400" />
        <span>Emails ({logs.length})</span>
        {logs.length > 0 && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-none h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </button>

      {/* Slide-out Panel */}
      {isOpen && (
        <div
          id="panel-email-logs"
          className="absolute bottom-14 right-0 w-96 max-h-[480px] bg-white border border-black/15 rounded-none shadow-2xl overflow-hidden flex flex-col font-sans transition-all"
        >
          {/* Header */}
          <div className="bg-[#FCFBF7] border-b border-black/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-800" />
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
                Email Dispatch Terminal
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {logs.length > 0 && (
                <button
                  id="btn-clear-email-logs"
                  onClick={onClear}
                  className="text-[9px] font-mono font-bold uppercase tracking-widest hover:text-red-600 text-black/40 transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                id="btn-close-email-logs"
                onClick={() => setIsOpen(false)}
                className="text-black/40 hover:text-black cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FCFBF7]/50 max-h-[350px]">
            {logs.length === 0 ? (
              <div className="text-center py-10 text-black/40">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-30 text-black" />
                <p className="text-xs font-mono font-bold uppercase tracking-wider">No emails dispatched yet.</p>
                <p className="text-[11px] text-black/55 max-w-xs mx-auto mt-1 font-sans">
                  Registration, proof of payment uploads, and admin confirmations will trigger live email previews here.
                </p>
              </div>
            ) : (
              [...logs].reverse().map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-black/10 rounded-none p-4 shadow-sm hover:border-black transition duration-150"
                >
                  <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-2">
                    <span className="text-[9px] font-mono text-black/40 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-green-800" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-[9px] bg-green-50 text-green-800 font-mono px-2 py-0.5 border border-green-800/15 uppercase tracking-widest flex items-center gap-1 font-bold">
                      <Check className="h-2.5 w-2.5" /> Sent
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] text-black/55 font-mono">
                      <strong className="text-[#1A1A1A] font-bold">To:</strong> {log.to}
                    </div>
                    <div className="text-[11px] text-[#1A1A1A] font-bold leading-tight font-sans">
                      <strong className="text-black/40 font-mono font-bold uppercase tracking-wider text-[10px] mr-1">Subject:</strong> {log.subject}
                    </div>
                    <div className="text-[11px] text-black/70 bg-[#FCFBF7] p-2 rounded-none border border-black/5 whitespace-pre-line mt-1.5 font-mono leading-relaxed max-h-24 overflow-y-auto">
                      {log.body}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-stone-900 text-[9px] font-mono text-stone-400 px-4 py-2.5 text-center border-t border-black uppercase tracking-wider">
            Simulated Edge-Function Resend Hooks
          </div>
        </div>
      )}
    </div>
  );
}
