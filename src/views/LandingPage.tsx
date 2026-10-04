import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { EventCard } from '../components/events/EventCard';
import { 
  Compass, 
  PlusCircle, 
  Calendar, 
  QrCode, 
  Award, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Users
} from 'lucide-react';
import heroImg from '../assets/images/event_campus_hero_1791099168090.jpg';

export const LandingPage: React.FC = () => {
  const { events, navigate, loginAs } = useApp();

  const featuredEvents = events.filter(e => e.isFeatured);
  const upcomingEvents = events.slice(0, 4);

  const categories = [
    { name: 'Technical', desc: 'Hackathons, Robotics & AI Labs', count: 18, color: 'text-indigo-600' },
    { name: 'Cultural', desc: 'Amphitheatre, Music & Arts', count: 12, color: 'text-rose-600' },
    { name: 'Sports', desc: 'Tournaments & Athletics', count: 8, color: 'text-emerald-600' },
    { name: 'Workshop', desc: 'Skill sprints & certifications', count: 15, color: 'text-amber-600' },
    { name: 'Academic', desc: 'Conferences & Venture pitches', count: 9, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-slate-800 shadow-2xl">
        {/* Ambient background glow and photo backdrop */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <img
            src={heroImg}
            alt="Campus Event Stage"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Collegiate Coordination Platform</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Campus. Your Events. One Platform.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Discover, register, and stay connected with every college symposium, hackathon, cultural fest, and guest workshop in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('discover')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Events
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => {
                  loginAs('organizer');
                  navigate('organizer-create');
                }}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Create an Event
              </Button>
            </div>

            {/* Quick metrics banner */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">48+</span>
                <p className="text-xs text-slate-400 mt-0.5">Active Campus Clubs</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400 tabular-nums">1,850+</span>
                <p className="text-xs text-slate-400 mt-0.5">Student Registrations</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">100%</span>
                <p className="text-xs text-slate-400 mt-0.5">Digital QR Check-in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Curated Highlights
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Campus Events</h2>
          </div>
          <button
            onClick={() => navigate('discover')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Taxonomy
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate('discover')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
            >
              <span className={`text-base font-bold ${cat.color} block`}>{cat.name}</span>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-600">
                <span className="font-mono tabular-nums">{cat.count} listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* HOW EVENTFLOW WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How EventFlow Streamlines Campus Life
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From discovering keynotes to entering venues in under 2 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 01</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Discover & Register</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Filter by academic department, building venue, or category. Register solo or enter team rosters with real-time seat tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 02</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Seamless Digital Check-In</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Instant digital passes generated on your device. Organizers scan door turnstiles with zero delays or paper lists.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 03</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Feedback & Certificates</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Provide post-event ratings directly to organizers and download verified college certificates with cryptographic hashes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Campus Calendar
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upcoming Events</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('discover')}
          >
            View Full Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingEvents.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>
    </div>
  );
};
