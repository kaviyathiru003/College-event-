import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  PlusCircle, 
  Users, 
  Megaphone, 
  BarChart3, 
  Image, 
  Settings, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface OrganizerLayoutProps {
  children: React.ReactNode;
  activeNav: string;
}

export const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children, activeNav }) => {
  const { navigate, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', view: 'organizer-dashboard' as AppView, icon: LayoutDashboard },
    { id: 'events', label: 'My Events', view: 'organizer-events' as AppView, icon: CalendarDays },
    { id: 'create', label: 'Create Event', view: 'organizer-create' as AppView, icon: PlusCircle },
    { id: 'registrations', label: 'Registrations', view: 'organizer-registrations' as AppView, icon: Users },
    { id: 'announcements', label: 'Announcements', view: 'organizer-announcements' as AppView, icon: Megaphone },
    { id: 'analytics', label: 'Analytics', view: 'organizer-analytics' as AppView, icon: BarChart3 },
    { id: 'media', label: 'Media Gallery', view: 'organizer-media' as AppView, icon: Image },
    { id: 'settings', label: 'Settings', view: 'organizer-settings' as AppView, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Left Sidebar (240px - 280px) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Organizer Suite
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 truncate">
            {currentUser?.department || 'Engineering Council'}
          </h2>
          <p className="text-[11px] text-slate-500 truncate">{currentUser?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'create' && !isActive && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                    +New
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom student view shortcut */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => navigate('discover')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Student Portal View</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile / Tablet Horizontal Navigation Ribbon */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {navItems.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.view)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
