import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Calendar, MapPin, QrCode, ArrowUpRight, MessageSquare, AlertCircle } from 'lucide-react';

export const MyEventsPage: React.FC = () => {
  const { 
    registrations, 
    events, 
    setActiveQrPassReg, 
    setActiveFeedbackEvent, 
    cancelRegistration, 
    navigate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const upcomingRegistrations = registrations.filter(r => r.status === 'confirmed' && r.checkInStatus === 'not_checked_in');
  const pastRegistrations = registrations.filter(r => r.status === 'confirmed' && r.checkInStatus === 'checked_in');
  const cancelledRegistrations = registrations.filter(r => r.status === 'cancelled');

  const currentList = 
    activeTab === 'upcoming' 
      ? upcomingRegistrations 
      : activeTab === 'past' 
      ? pastRegistrations 
      : cancelledRegistrations;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Event Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your QR admissions, check-in history, and provide post-event ratings.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate('discover')}>
          Find More Events
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === 'upcoming'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Upcoming Passes ({upcomingRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === 'past'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Attended & Past ({pastRegistrations.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === 'cancelled'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Cancelled ({cancelledRegistrations.length})
        </button>
      </div>

      {/* List of Registrations */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map(reg => {
            const event = events.find(e => e.id === reg.eventId);

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-600">{reg.id}</span>
                    <Badge
                      variant={
                        reg.status === 'cancelled'
                          ? 'error'
                          : reg.checkInStatus === 'checked_in'
                          ? 'success'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {reg.status === 'cancelled'
                        ? 'Cancelled'
                        : reg.checkInStatus === 'checked_in'
                        ? 'Checked In ✓'
                        : 'Entry Pass Active'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{reg.eventTitle}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{reg.eventVenue}</span>
                    </div>
                  </div>

                  {reg.checkInTimestamp && (
                    <p className="mt-2 text-[11px] font-mono text-emerald-600">
                      Scanned at turnstile: {reg.checkInTimestamp}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {reg.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveQrPassReg(reg)}
                        leftIcon={<QrCode className="w-3.5 h-3.5" />}
                      >
                        Digital Pass
                      </Button>
                    )}

                    {event && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('event-details', event.id)}
                        rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      >
                        Event
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab === 'past' && event && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveFeedbackEvent(event)}
                        leftIcon={<MessageSquare className="w-3.5 h-3.5 text-indigo-600" />}
                      >
                        Rate Experience
                      </Button>
                    )}

                    {activeTab === 'upcoming' && (
                      <button
                        onClick={() => {
                          if (confirm(`Cancel your registration for ${reg.eventTitle}?`)) {
                            cancelRegistration(reg.id);
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 p-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-800">No event passes in this category</p>
          <p className="text-xs text-slate-500 mt-1">
            Check the upcoming tab or register for new college events on campus.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('discover')}>
            Explore Events
          </Button>
        </div>
      )}
    </div>
  );
};
