import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Ticket, 
  PlusCircle, 
  Download, 
  Clock, 
  History, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';

interface QuickAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAccessModal: React.FC<QuickAccessModalProps> = ({ isOpen, onClose }) => {
  const { 
    events, 
    registrations, 
    certificates, 
    navigate, 
    setSelectedEventId, 
    setActiveQrPassReg, 
    setActiveCertificate,
    setDownloadCenterOpen,
    setCalendarExportModalOpen,
    searchHistory,
    addSearchQuery,
    removeSearchQuery,
    clearSearchHistory,
    role
  } = useApp();

  const [query, setQuery] = useState('');

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open quick access
          // Context handles this via setQuickAccessOpen
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matchingEvents = events.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.category.toLowerCase().includes(query.toLowerCase()) ||
    e.venue.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const matchingRegs = registrations.filter(r =>
    r.eventTitle.toLowerCase().includes(query.toLowerCase()) ||
    r.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelectEvent = (id: string) => {
    if (query) addSearchQuery(query);
    setSelectedEventId(id);
    navigate('event-details', id);
    onClose();
  };

  const handleSelectHistory = (pastQuery: string) => {
    setQuery(pastQuery);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      showCloseButton={false}
    >
      <div className="space-y-4 -mt-2">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 pb-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command, event title, venue, or registration ID... (ESC to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
              ESC
            </span>
          )}
        </div>

        {/* Search History Section */}
        {!query && searchHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Search History</span>
              </span>
              <button
                onClick={clearSearchHistory}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {searchHistory.map(q => (
                <div
                  key={q}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 text-xs font-medium text-slate-700 hover:text-indigo-700 cursor-pointer transition-colors"
                >
                  <span onClick={() => handleSelectHistory(q)}>{q}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      removeSearchQuery(q);
                    }}
                    className="text-slate-400 hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Navigation Shortcuts */}
        {!query && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                navigate('discover');
                onClose();
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all"
            >
              <Calendar className="w-4 h-4 text-indigo-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">Event Directory</p>
              <p className="text-[10px] text-slate-500">Browse all tracks</p>
            </button>

            <button
              onClick={() => {
                setCalendarExportModalOpen(true);
                onClose();
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">Calendar Sync</p>
              <p className="text-[10px] text-slate-500">Google / iCal export</p>
            </button>

            <button
              onClick={() => {
                setDownloadCenterOpen(true);
                onClose();
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all"
            >
              <Award className="w-4 h-4 text-purple-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">Download Center</p>
              <p className="text-[10px] text-slate-500">Passes &amp; certificates</p>
            </button>

            <button
              onClick={() => {
                navigate('live-event');
                onClose();
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all"
            >
              <Sparkles className="w-4 h-4 text-rose-600 mb-1" />
              <p className="text-xs font-bold text-slate-900">Live Stage Feed</p>
              <p className="text-[10px] text-slate-500">In-progress sessions</p>
            </button>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="space-y-4 max-h-80 overflow-y-auto pt-1">
            {matchingEvents.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Campus Events
                </span>
                {matchingEvents.map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {evt.category.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>{evt.startDate}</span>
                          <span>·</span>
                          <span>{evt.venue}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}

            {matchingRegs.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Your Digital Passes
                </span>
                {matchingRegs.map(reg => (
                  <div
                    key={reg.id}
                    onClick={() => {
                      setActiveQrPassReg(reg);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Ticket className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{reg.eventTitle}</h4>
                        <span className="text-[11px] font-mono text-indigo-600 font-semibold">{reg.id}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Open QR Pass →</span>
                  </div>
                ))}
              </div>
            )}

            {matchingEvents.length === 0 && matchingRegs.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching events or passes found for "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
