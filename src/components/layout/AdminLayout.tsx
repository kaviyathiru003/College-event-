import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  History, 
  Sliders, 
  ArrowLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNav }) => {
  const { navigate, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'System Overview', view: 'admin-dashboard' as AppView, icon: ShieldAlert },
    { id: 'users', label: 'Users & Roles', view: 'admin-users' as AppView, icon: Users },
    { id: 'events', label: 'All Platform Events', view: 'admin-events' as AppView, icon: Calendar },
    { id: 'audit', label: 'Audit Activity', view: 'admin-audit' as AppView, icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 text-white border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Platform Admin
            </span>
          </div>
          <h2 className="text-sm font-bold text-white truncate">Campus Governance</h2>
          <p className="text-[11px] text-slate-400 truncate">{currentUser?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.view)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => navigate('discover')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit to Campus Portal</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile / Tablet Nav Strip */}
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {navItems.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.view)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'
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
