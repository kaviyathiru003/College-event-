import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { 
  Bell, 
  ChevronDown, 
  UserCheck, 
  Shield, 
  GraduationCap, 
  LogOut, 
  PlusCircle, 
  QrCode, 
  Menu, 
  X,
  Compass,
  CalendarCheck,
  Award,
  Download,
  Search,
  Calendar
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    role,
    currentView,
    navigate,
    loginAs,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    announcements,
    registrations,
    setActiveQrPassReg,
    setDownloadCenterOpen,
    setQuickAccessOpen,
    setCalendarExportModalOpen,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadAnnouncements = announcements.filter(a => !a.isRead).length;
  const nextRegistration = registrations.find(r => r.status === 'confirmed');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Institutional Website Masthead Bar */}
      <div className="bg-slate-900 text-white text-[11px] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="font-semibold text-white tracking-wide uppercase text-[10px]">
              University Student Affairs & Event Operations
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Official Collegiate Website Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickAccessOpen(true)}
              className="hover:text-white text-slate-400 transition-colors flex items-center gap-1 font-mono text-[10px]"
              title="Quick Search & Commands"
            >
              <Search className="w-3 h-3 text-indigo-400" />
              <span>Quick Access</span>
              <kbd className="hidden md:inline bg-slate-800 px-1 py-0.5 rounded text-[9px] text-slate-300 border border-slate-700">⌘K</kbd>
            </button>

            <span className="text-slate-700">·</span>

            <button
              onClick={() => setCalendarExportModalOpen(true)}
              className="hover:text-white text-slate-400 transition-colors flex items-center gap-1 text-[10px]"
            >
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>Calendar Sync</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">·</span>

            <span className="font-mono text-indigo-300 text-[10px] hidden sm:inline">
              Fall 2026 Term
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            if (role === 'organizer') navigate('organizer-dashboard');
            else if (role === 'admin') navigate('admin-dashboard');
            else navigate('landing');
          }}
          className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 focus:outline-none"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
          <span>EventFlow</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {role === 'participant' ? (
            <>
              <button
                onClick={() => navigate('landing')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'landing' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => navigate('discover')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'discover' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Discover Events
              </button>
              <button
                onClick={() => navigate('participant-dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'participant-dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                My Hub
              </button>
              <button
                onClick={() => navigate('my-events')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'my-events' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                My Passes
              </button>
              <button
                onClick={() => navigate('certificates')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'certificates' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Certificates
              </button>
              <button
                onClick={() => navigate('live-event')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentView === 'live-event' ? 'text-rose-600 font-semibold' : 'text-slate-600'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Live Event</span>
              </button>
            </>
          ) : role === 'organizer' ? (
            <>
              <button
                onClick={() => navigate('organizer-dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'organizer-dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('organizer-events')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'organizer-events' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => navigate('organizer-registrations')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'organizer-registrations' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Registrations
              </button>
              <button
                onClick={() => navigate('organizer-announcements')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'organizer-announcements' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => navigate('organizer-analytics')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'organizer-analytics' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Analytics
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('admin-dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'admin-dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                System Overview
              </button>
              <button
                onClick={() => navigate('admin-users')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'admin-users' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Users & Roles
              </button>
              <button
                onClick={() => navigate('admin-events')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'admin-events' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => navigate('admin-audit')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                  currentView === 'admin-audit' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Audit Log
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Download Center Button */}
          <button
            onClick={() => setDownloadCenterOpen(true)}
            title="Download Files & Certificates"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Download Files</span>
          </button>

          {/* Quick QR Pass button for participant */}
          {role === 'participant' && nextRegistration && (
            <button
              onClick={() => setActiveQrPassReg(nextRegistration)}
              title="Quick Access Digital QR Pass"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>QR Pass</span>
            </button>
          )}

          {/* Organizer "+ Create Event" action button */}
          {role === 'organizer' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('organizer-create')}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Create Event
            </Button>
          )}

          {/* Notifications bell */}
          <button
            onClick={() => navigate('notifications')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Announcements & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAnnouncements > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600"></span>
            )}
          </button>

          {/* Persona / Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-all text-left"
            >
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {role === 'participant' ? 'S' : role === 'organizer' ? 'O' : 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentUser?.name || 'Guest'}
                </span>
                <span className="text-[10px] text-slate-500 capitalize block leading-none">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Active Role: {role}
                  </span>
                </div>

                <div className="p-1">
                  <p className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </p>
                  <button
                    onClick={() => loginAs('participant')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      role === 'participant' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Participant (Alex Chen)</span>
                  </button>
                  <button
                    onClick={() => loginAs('organizer')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      role === 'organizer' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Organizer (Prof. Vance)</span>
                  </button>
                  <button
                    onClick={() => loginAs('admin')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors ${
                      role === 'admin' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Admin (Dr. Evelyn Reed)</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setAuthModalMode('signin');
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 text-left"
                  >
                    Account Sign-in / Custom
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu for tablets & phones */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {role === 'participant' && (
            <>
              <button
                onClick={() => { navigate('landing'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Overview
              </button>
              <button
                onClick={() => { navigate('discover'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Discover Events
              </button>
              <button
                onClick={() => { navigate('participant-dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Hub
              </button>
              <button
                onClick={() => { navigate('my-events'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Passes
              </button>
              <button
                onClick={() => { navigate('certificates'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Certificates
              </button>
              <button
                onClick={() => { navigate('live-event'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg"
              >
                ● Live Event View
              </button>
            </>
          )}

          {role === 'organizer' && (
            <>
              <button
                onClick={() => { navigate('organizer-dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Dashboard
              </button>
              <button
                onClick={() => { navigate('organizer-events'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Manage Events
              </button>
              <button
                onClick={() => { navigate('organizer-create'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg"
              >
                + Create Event
              </button>
              <button
                onClick={() => { navigate('organizer-registrations'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Registrations & Check-ins
              </button>
              <button
                onClick={() => { navigate('organizer-announcements'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Announcements
              </button>
              <button
                onClick={() => { navigate('organizer-analytics'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Analytics
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                onClick={() => { navigate('admin-dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                System Dashboard
              </button>
              <button
                onClick={() => { navigate('admin-users'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Users & Roles
              </button>
              <button
                onClick={() => { navigate('admin-events'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Events Control
              </button>
              <button
                onClick={() => { navigate('admin-audit'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Audit Log
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
