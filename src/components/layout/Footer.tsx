import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Download, 
  Search, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    navigate, 
    loginAs, 
    setCalendarExportModalOpen, 
    setDownloadCenterOpen, 
    setQuickAccessOpen 
  } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      {/* Top Banner with Quick Academic Actions */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="font-semibold text-white">EventFlow Collegiate Portal</span>
            <span className="text-slate-600">·</span>
            <span>Centralized Campus Event &amp; Symposium Infrastructure</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickAccessOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Access (⌘K)</span>
            </button>

            <button
              onClick={() => setCalendarExportModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync Calendar</span>
            </button>

            <button
              onClick={() => setDownloadCenterOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Download Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Website Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-lg font-bold text-white tracking-tight">EventFlow</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The official university event coordination and student participation platform. Powered by the Student Affairs Council and College Information Services.
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Main Campus Center, Hall 101</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>events@campus.edu</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore Website
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('discover')} className="hover:text-white transition-colors">Event Directory</button></li>
              <li><button onClick={() => navigate('participant-dashboard')} className="hover:text-white transition-colors">Student Hub</button></li>
              <li><button onClick={() => navigate('my-events')} className="hover:text-white transition-colors">Active Passes</button></li>
              <li><button onClick={() => navigate('certificates')} className="hover:text-white transition-colors">Verified Certificates</button></li>
              <li><button onClick={() => navigate('live-event')} className="hover:text-rose-400 transition-colors">Live Event Feed</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Organizers &amp; Staff
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => loginAs('organizer')} className="hover:text-white transition-colors">Faculty Portal</button></li>
              <li><button onClick={() => { loginAs('organizer'); navigate('organizer-create'); }} className="hover:text-white transition-colors">Create College Event</button></li>
              <li><button onClick={() => { loginAs('organizer'); navigate('organizer-registrations'); }} className="hover:text-white transition-colors">Turnstile Check-In</button></li>
              <li><button onClick={() => { loginAs('organizer'); navigate('organizer-analytics'); }} className="hover:text-white transition-colors">Attendance Metrics</button></li>
              <li><button onClick={() => loginAs('admin')} className="hover:text-white transition-colors">Dean Platform Admin</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Academic Governance
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span>Student Senate Affiliation</span></li>
              <li><span>Campus Code of Conduct</span></li>
              <li><span>Venue Capacity Standards</span></li>
              <li><span>Fire Marshal Compliance</span></li>
              <li className="pt-1 font-mono text-[11px] text-slate-500">
                Academic Year 2026-2027
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 EventFlow. The Official Collegiate Event Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Standard</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Server Status: 99.98%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
