import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Bell, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Megaphone,
  Check
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { announcements, markAnnouncementAsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const notifications = [
    {
      id: 'n-1',
      group: 'Today',
      type: 'venue_change',
      title: 'Venue Room Relocation: AI Lab 304',
      event: 'AI & Cloud Infrastructure Deep-Dive Workshop',
      message: 'Hands-on lab transferred from Lab 201 to Advanced Computing Lab 304 (2nd floor, Turing Hall) due to high server rack power requirements.',
      timestamp: '15 mins ago',
      priority: 'urgent',
      read: false,
    },
    {
      id: 'n-2',
      group: 'Today',
      type: 'registration',
      title: 'Pass Confirmed: #EVF-2026-00128',
      event: 'TechFest 2026: Quantum Horizons',
      message: 'Your team "Neural Surge" registration has been validated. Download or save your digital QR pass before Oct 14.',
      timestamp: '2 hours ago',
      priority: 'normal',
      read: false,
    },
    {
      id: 'n-3',
      group: 'Yesterday',
      type: 'schedule_change',
      title: 'Keynote Speaker Time Updated',
      event: 'TechFest 2026: Quantum Horizons',
      message: 'Inaugural Keynote by Dr. Aris Thorne is scheduled promptly at 09:00 AM. Please arrive 15 minutes early for badge distribution.',
      timestamp: 'Yesterday at 4:15 PM',
      priority: 'normal',
      read: true,
    },
    {
      id: 'n-4',
      group: 'Earlier',
      type: 'announcement',
      title: 'Free Campus Shuttle Route Announced',
      event: 'Spring Symphony: Annual Cultural Evening',
      message: 'Express shuttle will loop continuously between North Dorms and Amphitheatre between 4:30 PM and 11:30 PM.',
      timestamp: '3 days ago',
      priority: 'normal',
      read: true,
    },
    {
      id: 'n-5',
      group: 'Earlier',
      type: 'reminder',
      title: 'Event Reminder: Hackathon Registration Deadline',
      event: 'CodePulse: 36-Hour Campus Hackathon',
      message: 'Team submission cutoff in 48 hours. Ensure all teammates have entered their student IDs.',
      timestamp: '5 days ago',
      priority: 'normal',
      read: true,
    },
  ];

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'urgent') return n.priority === 'urgent';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Campus Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time schedule changes, room moves, reminders, and broadcast announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'unread', 'urgent'].map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterType === ft
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications grouped by Today, Yesterday, Earlier */}
      {['Today', 'Yesterday', 'Earlier'].map(group => {
        const groupItems = filtered.filter(n => n.group === group);
        if (groupItems.length === 0) return null;

        return (
          <div key={group} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {group}
            </h3>

            <div className="space-y-2.5">
              {groupItems.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.priority === 'urgent'
                      ? 'bg-rose-50/70 border-rose-200'
                      : item.read
                      ? 'bg-white border-slate-200'
                      : 'bg-indigo-50/40 border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          item.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-600'
                            : item.type === 'venue_change'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {item.type === 'venue_change' ? (
                          <MapPin className="w-4 h-4" />
                        ) : item.priority === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-semibold text-indigo-700 font-mono">
                            {item.event}
                          </span>
                          {item.priority === 'urgent' && (
                            <Badge variant="error" size="sm">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
