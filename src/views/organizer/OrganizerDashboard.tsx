import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight, 
  AlertTriangle,
  Megaphone,
  Clock,
  MapPin
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const { events, registrations, announcements, navigate, setSelectedEventId } = useApp();

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'published' || e.status === 'live');
  const totalRegistrations = registrations.length;
  const checkedInCount = registrations.filter(r => r.checkInStatus === 'checked_in').length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 84;

  const eventsNearCapacity = events.filter(e => (e.registeredCount / e.capacity) >= 0.85);

  return (
    <OrganizerLayout activeNav="dashboard">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, Organizing Team
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is your campus event activity and attendee registration status for today.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('organizer-create')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Event
          </Button>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Total Events
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {totalEvents}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Under departmental roster</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Active & Upcoming
            </span>
            <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">
              {upcomingEvents.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Accepting registrations</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Total Registrations
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {totalRegistrations}
            </span>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +18% this week</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Attendance Rate
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">
              {attendanceRate}%
            </span>
            <p className="text-[11px] text-slate-400 mt-1">QR verification check-ins</p>
          </div>
        </div>

        {/* Main Chart Section: Registration Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registration Trend (Past 14 Days)</h2>
              <p className="text-xs text-slate-500">Daily signups across technical symposiums and fests</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 428 new entries</span>
          </div>

          {/* Clean responsive bar chart visual */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { day: 'Sep 21', count: 18, h: '35%' },
              { day: 'Sep 22', count: 24, h: '45%' },
              { day: 'Sep 23', count: 15, h: '30%' },
              { day: 'Sep 24', count: 32, h: '60%' },
              { day: 'Sep 25', count: 48, h: '85%' },
              { day: 'Sep 26', count: 52, h: '92%' },
              { day: 'Sep 27', count: 38, h: '70%' },
              { day: 'Sep 28', count: 42, h: '78%' },
              { day: 'Sep 29', count: 28, h: '50%' },
              { day: 'Sep 30', count: 36, h: '65%' },
              { day: 'Oct 01', count: 45, h: '82%' },
              { day: 'Oct 02', count: 58, h: '98%' },
              { day: 'Oct 03', count: 39, h: '72%' },
              { day: 'Today', count: 32, h: '62%' },
            ].map((bar, i) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-indigo-100 group-hover:bg-indigo-600 rounded-t transition-colors"
                  style={{ height: bar.h }}
                  title={`${bar.day}: ${bar.count} signups`}
                ></div>
                <span className="text-[9px] text-slate-400 font-mono hidden sm:block truncate max-w-[32px]">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Grid: Events Near Capacity & Recent Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Near Capacity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Events Near Capacity</h3>
              </div>
              <span className="text-xs text-slate-400">Waitlist thresholds</span>
            </div>

            <div className="space-y-3">
              {eventsNearCapacity.map(evt => {
                const percent = Math.round((evt.registeredCount / evt.capacity) * 100);
                return (
                  <div key={evt.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          navigate('organizer-event-overview');
                        }}
                        className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate max-w-[220px]"
                      >
                        {evt.title}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {evt.registeredCount} / {evt.capacity} ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${percent >= 98 ? 'bg-rose-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Recent Registrations</h3>
              <button
                onClick={() => navigate('organizer-registrations')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {registrations.slice(0, 4).map(reg => (
                <div key={reg.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{reg.participantName}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{reg.eventTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-indigo-600 font-semibold">{reg.id}</span>
                    <p className="text-[10px] text-slate-400">{reg.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};
