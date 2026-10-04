import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Bookmark, Ticket, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigate, role } = useApp();

  if (role !== 'participant') return null;

  const items = [
    { label: 'Home', view: 'landing' as const, icon: Home },
    { label: 'Events', view: 'discover' as const, icon: Compass },
    { label: 'Saved', view: 'favorites' as const, icon: Bookmark },
    { label: 'My Events', view: 'my-events' as const, icon: Ticket },
    { label: 'Profile', view: 'participant-dashboard' as const, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1 px-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.view)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
