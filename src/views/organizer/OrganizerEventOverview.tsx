import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  Megaphone, 
  Plus, 
  ArrowLeft,
  Share2,
  Trash2,
  QrCode
} from 'lucide-react';

export const OrganizerEventOverview: React.FC = () => {
  const { 
    selectedEvent, 
    registrations, 
    announcements, 
    navigate, 
    toggleCheckIn, 
    updateEvent,
    addAnnouncement
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'schedule' | 'announcements' | 'analytics' | 'media'>('overview');
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  if (!selectedEvent) {
    return (
      <OrganizerLayout activeNav="events">
        <div className="py-12 text-center">
          <p>Please select an event from the events roster.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('organizer-events')}>
            View Events
          </Button>
        </div>
      </OrganizerLayout>
    );
  }

  const eventRegs = registrations.filter(r => r.eventId === selectedEvent.id && r.status !== 'cancelled');
  const checkedInCount = eventRegs.filter(r => r.checkInStatus === 'checked_in').length;
  const attendancePercent = eventRegs.length > 0 ? Math.round((checkedInCount / eventRegs.length) * 100) : 0;
  const eventAnnouncements = announcements.filter(a => a.eventId === selectedEvent.id);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    addAnnouncement({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      title: annTitle,
      content: annContent,
      audience: 'all',
      priority: 'normal',
      channels: ['email', 'push'],
      authorName: selectedEvent.organizerName,
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnouncementModalOpen(false);
  };

  return (
    <OrganizerLayout activeNav="events">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <button
              onClick={() => navigate('organizer-events')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to All Events</span>
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedEvent.title}
              </h1>
              <Badge variant={selectedEvent.status === 'live' ? 'live' : 'success'} size="sm" withDot>
                {selectedEvent.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnnouncementModalOpen(true)}
              leftIcon={<Megaphone className="w-3.5 h-3.5" />}
            >
              Create Announcement
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('event-details', selectedEvent.id)}
            >
              Public Preview
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Registered
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {selectedEvent.registeredCount}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Confirmed student passes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Venue Capacity
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {selectedEvent.capacity}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">{selectedEvent.room}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Checked In
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {checkedInCount}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Scanned at door</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
              Attendance %
            </span>
            <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
              {attendancePercent}%
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Check-in conversion</p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-slate-200">
          <div className="flex items-center gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'registrations', label: `Registrations (${eventRegs.length})` },
              { id: 'schedule', label: `Schedule (${selectedEvent.schedule?.length || 0})` },
              { id: 'announcements', label: `Announcements (${eventAnnouncements.length})` },
              { id: 'analytics', label: 'Analytics' },
              { id: 'media', label: 'Media' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Event Particulars</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedEvent.description}
              </p>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Location</span>
                  <p className="font-semibold text-slate-900">{selectedEvent.venue}</p>
                  <p className="text-slate-500">{selectedEvent.building}, {selectedEvent.floor}, {selectedEvent.room}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Registration Window</span>
                  <p className="font-semibold text-slate-900">Until {selectedEvent.registrationDeadline}</p>
                  <p className="text-slate-500">Waitlist Allowed: {selectedEvent.allowWaitlist ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Coordination Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    const newStatus = selectedEvent.status === 'live' ? 'completed' : 'live';
                    updateEvent(selectedEvent.id, { status: newStatus });
                  }}
                >
                  Toggle Event Status: {selectedEvent.status === 'live' ? 'Mark Completed' : 'Set to Live'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setActiveTab('registrations')}
                >
                  Open Door Check-in Scanner
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setAnnouncementModalOpen(true)}
                >
                  Send Emergency Broadcast
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB IN OVERVIEW */}
        {activeTab === 'registrations' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Attendee Roster</span>
              <span className="text-xs font-mono text-slate-500">{eventRegs.length} Participants</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Participant</th>
                  <th className="py-2.5 px-4">Department & Year</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Door Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eventRegs.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{reg.participantName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{reg.id} · {reg.participantEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p>{reg.department}</p>
                      <p className="text-[10px] text-slate-400">{reg.year}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={reg.checkInStatus === 'checked_in' ? 'success' : 'neutral'} size="sm">
                        {reg.checkInStatus === 'checked_in' ? 'Checked In' : 'Not Checked In'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={reg.checkInStatus === 'checked_in' ? 'outline' : 'primary'}
                        onClick={() => toggleCheckIn(reg.id)}
                      >
                        {reg.checkInStatus === 'checked_in' ? 'Undo Check-in' : 'Check In ✓'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setAnnouncementModalOpen(true)}>
                + New Announcement
              </Button>
            </div>
            {eventAnnouncements.map(ann => (
              <div key={ann.id} className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">{ann.title}</span>
                  <span className="text-slate-400">{ann.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600">{ann.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcement Creation Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Broadcast Event Announcement</h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Room changed to Lab 304"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Describe update..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  rows={3}
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setAnnouncementModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Broadcast to Participants
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OrganizerLayout>
  );
};
