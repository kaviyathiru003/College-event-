import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Radio, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ArrowRight, 
  User, 
  Wifi, 
  Zap, 
  QrCode,
  Share2
} from 'lucide-react';

export const LiveEventPage: React.FC = () => {
  const { events, registrations, setActiveQrPassReg, navigate } = useApp();

  const liveEvent = events.find(e => e.status === 'live') || events[4] || events[0];
  const userReg = registrations.find(r => r.eventId === liveEvent.id);

  const currentSession = {
    title: 'Live Lab: Implementing Vector Embeddings & Hybrid Search',
    time: '11:45 AM - 01:30 PM (In Progress)',
    location: 'Advanced Computing Lab 304, Turing Hall',
    speaker: 'CS Lab Instructors & Teaching Assistants',
    description: 'Hands-on coding session configuring vector dimensions and running cosine similarity queries. Instructors are walking the aisles for debugging assistance.',
  };

  const nextSession = {
    title: 'Capstone Deployment & Benchmarking',
    time: '02:30 PM - 04:00 PM',
    location: 'Advanced Computing Lab 304',
    speaker: 'Dr. Sophia Patel',
  };

  const liveAnnouncements = [
    {
      id: 'l-1',
      title: 'Lab Wi-Fi & Compute Sandbox Credentials',
      message: 'Network SSID: "Campus-LabNet-5G" | Passphrase on chalkboard. GPU compute nodes are live on cluster 10.0.4.0/24.',
      time: '12 mins ago',
      urgent: true,
    },
    {
      id: 'l-2',
      title: 'Catered Lunch Break at 1:30 PM',
      message: 'Boxed lunch and refreshments will be served at the 2nd Floor Turing Hall terrace foyer immediately following this session.',
      time: '35 mins ago',
      urgent: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with prominent LIVE status */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>LIVE NOW ON CAMPUS</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {liveEvent.department}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {liveEvent.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {liveEvent.venue} · {liveEvent.room}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-indigo-400" />
                {liveEvent.startTime} - {liveEvent.endTime}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {userReg ? (
              <Button
                variant="primary"
                onClick={() => setActiveQrPassReg(userReg)}
                leftIcon={<QrCode className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                My Active Pass ({userReg.id})
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('event-details', liveEvent.id)}
              >
                Event Details
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Current Session + Next Session */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT ACTIVE SESSION */}
        <div className="md:col-span-2 bg-white rounded-2xl border-2 border-indigo-600 p-6 shadow-md relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Current Session
            </span>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              {currentSession.time}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {currentSession.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              {currentSession.location}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-slate-400" />
              {currentSession.speaker}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {currentSession.description}
          </p>
        </div>

        {/* UPCOMING NEXT SESSION */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Next Up
            </span>
            <span className="text-xs font-mono font-semibold text-slate-700 block">
              {nextSession.time}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {nextSession.title}
            </h3>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {nextSession.location}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {nextSession.speaker}
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 text-xs text-slate-400">
            Followed by Open Q&A & Certificate Distribution
          </div>
        </div>
      </div>

      {/* LIVE UPDATES & ANNOUNCEMENTS (Visually Prominent) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">Live Stage & Room Updates</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Syncing real-time</span>
        </div>

        <div className="space-y-3">
          {liveAnnouncements.map(ann => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border shadow-xs ${
                ann.urgent
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${ann.urgent ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-sm font-bold">{ann.title}</h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{ann.message}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono opacity-60 whitespace-nowrap">{ann.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
