import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RegistrationModal } from '../components/modals/RegistrationModal';
import { downloadCalendarICS } from '../utils/downloads';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  ChevronRight, 
  Building, 
  User, 
  Navigation, 
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export const EventDetailsPage: React.FC = () => {
  const { 
    selectedEvent, 
    registrations, 
    favoriteEventIds, 
    toggleFavorite, 
    announcements, 
    setActiveQrPassReg, 
    setActiveFeedbackEvent,
    setCalendarExportModalOpen,
    setCalendarExportEvent,
    navigate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'venue' | 'speakers' | 'announcements' | 'media'>('about');
  const [regModalOpen, setRegModalOpen] = useState(false);

  if (!selectedEvent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('discover')}>
          Back to Events
        </Button>
      </div>
    );
  }

  const isFavorite = favoriteEventIds.includes(selectedEvent.id);
  const userRegistration = registrations.find(r => r.eventId === selectedEvent.id && r.status !== 'cancelled');
  const isFull = selectedEvent.registeredCount >= selectedEvent.capacity;
  const eventAnnouncements = announcements.filter(a => a.eventId === selectedEvent.id);
  const capacityPercent = Math.min(100, Math.round((selectedEvent.registeredCount / selectedEvent.capacity) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('landing')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <button onClick={() => navigate('discover')} className="hover:text-slate-900">
          Events
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{selectedEvent.title}</span>
      </nav>

      {/* TOP HERO & EVENT BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
        <div className="relative aspect-[21/9] min-h-[260px] max-h-[420px] w-full bg-slate-950">
          <img
            src={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Quick status pill / live badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-white/90 backdrop-blur-xs text-slate-900 shadow-xs">
              {selectedEvent.category}
            </span>
            {selectedEvent.status === 'live' && (
              <Badge variant="live" size="md" withDot>
                HAPPENING NOW
              </Badge>
            )}
          </div>

          {/* Share & Favorite Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedEvent.id)}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white hover:text-rose-400 transition-colors shadow-xs"
              title={isFavorite ? 'Remove from Saved' : 'Save Event'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                alert('Event link copied to clipboard!');
              }}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white hover:text-indigo-400 transition-colors shadow-xs"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Metadata Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
              <span className="font-semibold text-white">{selectedEvent.department}</span>
              <span>·</span>
              <span>Organized by {selectedEvent.organizerName}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {selectedEvent.title}
            </h1>
          </div>
        </div>

        {/* Primary Action Ribbon */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Quick Schedule & Venue Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Date</span>
                <span className="font-medium text-white">{selectedEvent.startDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Time</span>
                <span className="font-medium text-white">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Venue</span>
                <span className="font-medium text-white">{selectedEvent.venue}</span>
              </div>
            </div>
          </div>

          {/* Registration / Pass Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {userRegistration ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={() => setActiveQrPassReg(userRegistration)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  View My Digital Pass ({userRegistration.id})
                </Button>
                {selectedEvent.status === 'completed' && (
                  <Button
                    variant="outline"
                    className="border-slate-700 text-white hover:bg-slate-800"
                    onClick={() => setActiveFeedbackEvent(selectedEvent)}
                  >
                    Give Feedback
                  </Button>
                )}
              </div>
            ) : isFull ? (
              <Button
                variant="secondary"
                onClick={() => setRegModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Join Waitlist ({selectedEvent.waitlistCount} waiting)
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setRegModalOpen(true)}
              >
                Register Now
              </Button>
            )}

            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => {
                setCalendarExportEvent(selectedEvent);
                setCalendarExportModalOpen(true);
              }}
            >
              Add to Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* REGISTRATION CAPACITY PROGRESS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-600" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {selectedEvent.registeredCount} / {selectedEvent.capacity} registered
              </span>
              {isFull ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Event Full
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedEvent.capacity - selectedEvent.registeredCount} seats remaining
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registration closes {selectedEvent.registrationDeadline}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                capacityPercent >= 95 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block text-right font-mono">
            {capacityPercent}% filled
          </span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'about', label: 'About' },
            { id: 'schedule', label: `Schedule (${selectedEvent.schedule?.length || 0})` },
            { id: 'venue', label: 'Venue & Map' },
            { id: 'speakers', label: `Speakers (${selectedEvent.speakers?.length || 0})` },
            { id: 'announcements', label: `Announcements (${eventAnnouncements.length})` },
            { id: 'media', label: 'Media Gallery' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
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

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">
        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Event Overview</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.tags?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Event Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedEvent.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organizer Sidebar Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Organizing Entity
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {selectedEvent.organizerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedEvent.organizerName}</p>
                  <p className="text-xs text-slate-500">{selectedEvent.organizerDept}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1.5">
                <p><strong>Official Contact:</strong> {selectedEvent.organizerEmail}</p>
                <p><strong>Affiliation:</strong> Campus Student Affairs Board</p>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB - CLEAN VERTICAL TIMELINE */}
        {activeTab === 'schedule' && (
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Program Schedule</h3>
            {selectedEvent.schedule && selectedEvent.schedule.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
                {selectedEvent.schedule.map((session, idx) => (
                  <div key={session.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white bg-indigo-600 group-hover:scale-125 transition-transform shadow-xs"></div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-indigo-600">
                          {session.startTime} - {session.endTime}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {session.location}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{session.title}</h4>
                      {session.speaker && (
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          Speaker: {session.speaker}
                        </p>
                      )}
                      {session.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {session.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Detailed session schedule will be announced shortly.</p>
            )}
          </div>
        )}

        {/* VENUE TAB */}
        {activeTab === 'venue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Campus Venue & Location</h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Facility</span>
                  <p className="text-sm font-bold text-slate-900">{selectedEvent.venue}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Building</span>
                    <p className="font-semibold text-slate-800">{selectedEvent.building}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Floor</span>
                    <p className="font-semibold text-slate-800">{selectedEvent.floor}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Room</span>
                    <p className="font-semibold text-slate-800">{selectedEvent.room}</p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                leftIcon={<Navigation className="w-4 h-4 text-indigo-600" />}
                onClick={() => alert(`Starting campus turn-by-turn navigation to ${selectedEvent.building}...`)}
              >
                Open Campus Navigation Map
              </Button>
            </div>

            {/* Campus Map Placeholder Blueprint */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>CAMPUS BLUEPRINT LOCATOR</span>
                <span>ZONE A-3</span>
              </div>

              <div className="my-auto py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <MapPin className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-white">{selectedEvent.room}</p>
                <p className="text-xs text-slate-400">{selectedEvent.building} · {selectedEvent.floor}</p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-3 flex justify-between">
                <span>Nearest Entrance: Gate 2 (North Plaza)</span>
                <span>Accessible Elevator: Core B</span>
              </div>
            </div>
          </div>
        )}

        {/* SPEAKERS TAB */}
        {activeTab === 'speakers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Featured Keynote Speakers</h3>
            {selectedEvent.speakers && selectedEvent.speakers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedEvent.speakers.map(speaker => (
                  <div key={speaker.name} className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                      {speaker.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{speaker.name}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{speaker.role}</p>
                      <p className="text-xs text-slate-500">{speaker.organization}</p>
                      {speaker.bio && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{speaker.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Speaker lineup will be updated soon.</p>
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">Organizer Announcements</h3>
            {eventAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {eventAnnouncements.map(ann => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-xl border ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-semibold ${ann.priority === 'urgent' ? 'text-rose-700' : 'text-slate-900'}`}>
                        {ann.title}
                      </span>
                      <span className="text-slate-400">{ann.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No announcements posted for this event yet.</p>
            )}
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Event Media & Posters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={selectedEvent.posterUrl} alt="Poster" className="w-full h-full object-cover" />
              </div>
              {selectedEvent.media?.map(m => (
                <div key={m.id} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal Dialog */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};
