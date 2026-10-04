import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { CollegeEvent } from '../../types';
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Eye, 
  Users, 
  Megaphone, 
  BarChart2, 
  Edit3,
  Calendar,
  MapPin
} from 'lucide-react';

export const OrganizerEventsPage: React.FC = () => {
  const { events, navigate, setSelectedEventId, updateEvent } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEvents = events.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const handleManage = (id: string) => {
    setSelectedEventId(id);
    navigate('organizer-event-overview');
  };

  return (
    <OrganizerLayout activeNav="events">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Campus Events</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Oversee departmental event schedules, quotas, waitlists, and attendee check-ins.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('organizer-create')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Event
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search events by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'published', 'live', 'completed', 'draft'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Event Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Date & Venue</th>
                  <th className="py-3 px-4">Registrations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map(evt => {
                  const percent = Math.round((evt.registeredCount / evt.capacity) * 100);

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.posterUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span
                              onClick={() => handleManage(evt.id)}
                              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block text-sm"
                            >
                              {evt.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {evt.category} · {evt.department}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.startDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{evt.venue}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-900 tabular-nums">
                            {evt.registeredCount} / {evt.capacity}
                          </span>
                          <span className="text-[10px] text-slate-400">({percent}%)</span>
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            evt.status === 'live'
                              ? 'live'
                              : evt.status === 'published'
                              ? 'success'
                              : evt.status === 'completed'
                              ? 'neutral'
                              : 'warning'
                          }
                          size="sm"
                          withDot={evt.status === 'live'}
                        >
                          {evt.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManage(evt.id)}
                          >
                            Manage
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedEventId(evt.id);
                              navigate('organizer-registrations');
                            }}
                            title="Attendee Registrations"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};
