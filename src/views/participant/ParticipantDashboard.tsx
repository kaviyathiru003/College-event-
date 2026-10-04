import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EventCard } from '../../components/events/EventCard';
import { 
  Calendar, 
  Ticket, 
  CheckCircle, 
  Bookmark, 
  QrCode, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Megaphone,
  Radio
} from 'lucide-react';

export const ParticipantDashboard: React.FC = () => {
  const { 
    currentUser, 
    registrations, 
    events, 
    favoriteEventIds, 
    announcements, 
    setActiveQrPassReg, 
    navigate 
  } = useApp();

  const userRegistrations = registrations.filter(r => r.status !== 'cancelled');
  const upcomingRegs = userRegistrations.filter(r => r.checkInStatus === 'not_checked_in');
  const attendedRegs = userRegistrations.filter(r => r.checkInStatus === 'checked_in');
  const savedEvents = events.filter(e => favoriteEventIds.includes(e.id));
  const liveEvent = events.find(e => e.status === 'live');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Good morning, {currentUser?.name?.split(' ')[0] || 'Alex'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.department} · {currentUser?.year || 'Student'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {liveEvent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('live-event')}
              className="border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100"
              leftIcon={<Radio className="w-3.5 h-3.5 animate-pulse" />}
            >
              Live Session Active
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('discover')}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
          >
            Explore Events
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Registered</span>
            <Ticket className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {userRegistrations.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed event passes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Upcoming</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {upcomingRegs.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Sessions pending check-in</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Attended</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {attendedRegs.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Verified check-ins</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Saved</span>
            <Bookmark className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {savedEvents.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Bookmarked in wishlist</p>
        </div>
      </div>

      {/* ACTIVE REGISTRATION PASSES (Immediate Check-in access) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Upcoming Event Passes</h2>
          <button
            onClick={() => navigate('my-events')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>All Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingRegs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingRegs.map(reg => (
              <div
                key={reg.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-indigo-600">
                      {reg.id}
                    </span>
                    <Badge variant={reg.checkInStatus === 'checked_in' ? 'success' : 'neutral'} size="sm">
                      {reg.checkInStatus === 'checked_in' ? 'Checked In ✓' : 'Entry Ready'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{reg.eventTitle}</h3>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.eventVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {reg.registrationType === 'team' ? `Team: ${reg.teamName}` : 'Solo Registration'}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setActiveQrPassReg(reg)}
                    leftIcon={<QrCode className="w-3.5 h-3.5" />}
                  >
                    Open QR Pass
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">No active passes for upcoming events.</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate('discover')}>
              Browse & Register Now
            </Button>
          </div>
        )}
      </div>

      {/* SPLIT SECTION: RECENT ANNOUNCEMENTS & RECOMMENDED EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended for you */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recommended For You</h2>
            <button
              onClick={() => navigate('discover')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.slice(0, 2).map(evt => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>

        {/* Recent Announcements Ticker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Campus Alerts</h2>
            <button
              onClick={() => navigate('notifications')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Alerts
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 divide-y divide-slate-100 space-y-3">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-indigo-700 truncate max-w-[160px]">
                    {ann.eventTitle}
                  </span>
                  <span className="text-slate-400 shrink-0">{ann.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
