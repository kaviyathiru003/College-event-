import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Input, Textarea, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { EventCategory, EventScheduleSession } from '../../types';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import techfestImg from '../../assets/images/event_poster_techfest_1791099184903.jpg';

export const CreateEventWizard: React.FC = () => {
  const { createEvent, navigate, setSelectedEventId } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState(techfestImg);

  // Step 2: Date & Venue
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [venue, setVenue] = useState('Turing Hall of Science');
  const [building, setBuilding] = useState('Turing Hall Complex');
  const [floor, setFloor] = useState('2nd Floor');
  const [room, setRoom] = useState('Auditorium B-201');
  const [capacity, setCapacity] = useState(150);

  // Step 3: Visual Schedule Builder
  const [sessions, setSessions] = useState<EventScheduleSession[]>([
    {
      id: 'sess-1',
      title: 'Opening Remarks & Keynote',
      startTime: '09:30 AM',
      endTime: '11:00 AM',
      location: 'Auditorium B-201',
      speaker: 'Faculty Advisor',
      description: 'Orientation and overview of technical tracks.',
    },
    {
      id: 'sess-2',
      title: 'Hands-on Working Sprint Round 1',
      startTime: '11:15 AM',
      endTime: '01:00 PM',
      location: 'Auditorium B-201',
      description: 'Track breakout challenges and mentor sessions.',
    },
  ]);

  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionTime, setNewSessionTime] = useState('02:00 PM - 03:30 PM');
  const [newSessionLocation, setNewSessionLocation] = useState('Auditorium B-201');

  // Step 4: Registration Settings
  const [regOpenDate, setRegOpenDate] = useState('2026-10-10');
  const [regCloseDate, setRegCloseDate] = useState('2026-11-12');
  const [allowWaitlist, setAllowWaitlist] = useState(true);
  const [allowTeam, setAllowTeam] = useState(true);

  // Confirmation modal state before publishing
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const addSession = () => {
    if (!newSessionTitle) return;
    const times = newSessionTime.split('-');
    const newSess: EventScheduleSession = {
      id: 'sess-' + Date.now(),
      title: newSessionTitle,
      startTime: times[0]?.trim() || '02:00 PM',
      endTime: times[1]?.trim() || '03:30 PM',
      location: newSessionLocation,
    };
    setSessions([...sessions, newSess]);
    setNewSessionTitle('');
  };

  const removeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handlePublish = (status: 'published' | 'draft') => {
    const newId = createEvent({
      title: title || 'Campus Engineering Symposium 2026',
      category,
      description: description || 'Annual student innovation symposium featuring projects and competitive tracks.',
      posterUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      building,
      floor,
      room,
      capacity,
      schedule: sessions,
      allowWaitlist,
      registrationDeadline: regCloseDate,
      status,
    });

    setSelectedEventId(newId);
    navigate('organizer-events');
  };

  return (
    <OrganizerLayout activeNav="create">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wizard Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create College Event</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the 5-step wizard to publish an event on the campus-wide EventFlow directory.
          </p>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Date & Venue' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: 'Registration' },
            { num: 5, label: 'Preview & Publish' },
          ].map((s, idx, arr) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[11px] font-semibold mt-1 hidden sm:block ${
                  step === s.num ? 'text-indigo-600' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 1 — Basic Information</h2>

            <Input
              label="Event Name"
              placeholder="e.g. Campus Robotics Hackathon 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                options={[
                  { label: 'Technical', value: 'Technical' },
                  { label: 'Cultural', value: 'Cultural' },
                  { label: 'Sports', value: 'Sports' },
                  { label: 'Workshop', value: 'Workshop' },
                  { label: 'Academic', value: 'Academic' },
                ]}
              />

              <Input
                label="Poster Image URL or Preset"
                value={posterUrl}
                onChange={e => setPosterUrl(e.target.value)}
                helperText="Defaults to campus high-resolution festival artwork."
              />
            </div>

            <Textarea
              label="Description & Agenda Summary"
              placeholder="Provide a detailed description of the event, learning outcomes, rules, and faculty eligibility..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Venue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Venue */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Step 2 — Date & Venue</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                placeholder="09:30 AM"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
              <Input
                label="End Time"
                placeholder="05:00 PM"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Campus Building"
                value={building}
                onChange={e => setBuilding(e.target.value)}
              />
              <Input
                label="Floor"
                value={floor}
                onChange={e => setFloor(e.target.value)}
              />
              <Input
                label="Room / Hall Number"
                value={room}
                onChange={e => setRoom(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Venue Facility Name"
                value={venue}
                onChange={e => setVenue(e.target.value)}
              />
              <Input
                label="Seat Capacity"
                type="number"
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
              />
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Schedule
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Visual Schedule Builder */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 3 — Visual Schedule Builder</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize session timelines and room allocations for participants.
              </p>
            </div>

            {/* Session Timeline */}
            <div className="relative border-l-2 border-slate-200 ml-4 pl-5 space-y-4">
              {sessions.map((sess, idx) => (
                <div key={sess.id} className="relative bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white bg-indigo-600"></div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-indigo-600">
                        {sess.startTime} - {sess.endTime}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{sess.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sess.location}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSession(sess.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Session Adder Box */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
              <span className="text-xs font-bold text-indigo-900 block">Add Session to Schedule</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  placeholder="Session title (e.g. Lunch & Networking)"
                  value={newSessionTitle}
                  onChange={e => setNewSessionTitle(e.target.value)}
                />
                <Input
                  placeholder="01:00 PM - 02:00 PM"
                  value={newSessionTime}
                  onChange={e => setNewSessionTime(e.target.value)}
                />
                <Input
                  placeholder="Location (e.g. Atrium)"
                  value={newSessionLocation}
                  onChange={e => setNewSessionLocation(e.target.value)}
                />
              </div>
              <Button size="sm" variant="outline" onClick={addSession} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Session
              </Button>
            </div>

            <div className="pt-4 flex justify-between border-t border-slate-100">
              <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Registration Settings
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Registration Settings */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 4 — Registration Configuration</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define participant quotas, deadlines, and group registration permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Opening Date"
                type="date"
                value={regOpenDate}
                onChange={e => setRegOpenDate(e.target.value)}
              />
              <Input
                label="Registration Cutoff Deadline"
                type="date"
                value={regCloseDate}
                onChange={e => setRegCloseDate(e.target.value)}
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Allow Waitlist Queue</span>
                  <span className="text-[11px] text-slate-500">
                    When capacity ({capacity}) is reached, place new signups into a managed queue.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowWaitlist}
                  onChange={e => setAllowWaitlist(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </label>

              <div className="border-t border-slate-200 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Support Team / Group Entries</span>
                    <span className="text-[11px] text-slate-500">
                      Permit applicants to register as project cohorts with team names.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowTeam}
                    onChange={e => setAllowTeam(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={() => setStep(5)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Review Preview & Publish
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Preview & Publish */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Step 5 — Realistic Event Preview</h2>
                  <p className="text-xs text-slate-500">Review exactly how students will view your event listing.</p>
                </div>
                <Badge variant="warning" size="sm">
                  Ready to Publish
                </Badge>
              </div>

              {/* Realistic Mock Listing Container */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-white">
                <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950">
                  <span className="text-xs font-mono font-semibold text-indigo-400 uppercase">
                    {category} Track
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{title || 'Campus Event Preview'}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {startDate} · {startTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {venue} ({room})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      {capacity} seats capacity
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white text-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">About</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {description || 'Comprehensive collegiate symposium agenda.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Program Sessions ({sessions.length})
                    </h4>
                    <div className="space-y-2">
                      {sessions.map(s => (
                        <div key={s.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                          <span className="font-semibold text-slate-800">{s.title}</span>
                          <span className="font-mono text-slate-500">{s.startTime} - {s.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(4)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Settings
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePublish('draft')}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Publish Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog before Publishing */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Event to Campus?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  "{title || 'New Event'}" will immediately become visible to all students on the discovery page.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setShowConfirmModal(false);
                    handlePublish('published');
                  }}
                >
                  Confirm & Publish
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};
