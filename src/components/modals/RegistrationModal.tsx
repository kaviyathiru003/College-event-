import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { CollegeEvent, Registration } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, User, Users, Calendar, MapPin, QrCode, ArrowRight, ArrowLeft } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CollegeEvent;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const { currentUser, registerForEvent, setActiveQrPassReg } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(currentUser?.name || 'Alex Chen');
  const [email, setEmail] = useState(currentUser?.email || 'alex.chen@campus.edu');
  const [phone, setPhone] = useState('+1 (555) 382-9014');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [year, setYear] = useState(currentUser?.year || '3rd Year (Junior)');
  
  const [regType, setRegType] = useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  const [confirmedReg, setConfirmedReg] = useState<Registration | null>(null);
  const [isWaitlistResult, setIsWaitlistResult] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFull = event.registeredCount >= event.capacity;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid college email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!department.trim()) errs.department = 'Department is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (regType === 'team' && !teamName.trim()) {
      errs.teamName = 'Team name is required for group entries';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        const membersList = regType === 'team' && teamMembers 
          ? teamMembers.split(',').map(m => m.trim()).filter(Boolean) 
          : undefined;

        const result = registerForEvent({
          eventId: event.id,
          participantName: name,
          participantEmail: email,
          participantPhone: phone,
          department,
          year,
          registrationType: regType,
          teamName: regType === 'team' ? teamName : undefined,
          teamMembers: membersList,
        });

        if (result.success && result.registration) {
          setConfirmedReg(result.registration);
          setIsWaitlistResult(!!result.isWaitlist);
          setStep(3);
        }
      }
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setConfirmedReg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      maxWidth="lg"
      title={step === 3 ? undefined : `Register: ${event.title}`}
    >
      <div>
        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
              <span className={`text-xs font-semibold ${step === 1 ? 'text-indigo-600' : 'text-slate-500'}`}>
                Personal Info
              </span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span className={`text-xs font-semibold ${step === 2 ? 'text-indigo-600' : 'text-slate-500'}`}>
                Registration Type
              </span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center bg-slate-200 text-slate-600">
                3
              </span>
              <span className="text-xs font-semibold text-slate-400">Confirmation</span>
            </div>
          </div>
        )}

        {/* Capacity banner */}
        {step < 3 && (
          <div className={`p-3 rounded-lg mb-4 text-xs flex items-center justify-between ${
            isFull ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-slate-50 border border-slate-200 text-slate-700'
          }`}>
            <span>
              <strong>Registration Status:</strong> {event.registeredCount} / {event.capacity} seats taken
            </span>
            {isFull ? (
              <span className="font-semibold text-amber-700">Event Full · Waitlist Enabled</span>
            ) : (
              <span className="font-semibold text-emerald-700">Open for Registrations</span>
            )}
          </div>
        )}

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                error={errors.name}
                required
              />
              <Input
                label="College Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Mobile Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                error={errors.phone}
                required
              />
              <Input
                label="Department"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                error={errors.department}
                required
              />
              <Select
                label="Academic Year"
                value={year}
                onChange={e => setYear(e.target.value)}
                options={[
                  { label: '1st Year (Freshman)', value: '1st Year (Freshman)' },
                  { label: '2nd Year (Sophomore)', value: '2nd Year (Sophomore)' },
                  { label: '3rd Year (Junior)', value: '3rd Year (Junior)' },
                  { label: '4th Year (Senior)', value: '4th Year (Senior)' },
                  { label: 'Postgraduate / Master', value: 'Postgraduate / Master' },
                  { label: 'Faculty / Staff', value: 'Faculty / Staff' },
                ]}
              />
            </div>

            <div className="pt-3 flex justify-end">
              <Button onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Registration Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Participation Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegType('individual')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    regType === 'individual'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <User className={`w-5 h-5 mt-0.5 ${regType === 'individual' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Individual Participant</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Solo attendee check-in pass</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegType('team')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    regType === 'team'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Users className={`w-5 h-5 mt-0.5 ${regType === 'team' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Team / Project Group</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Register cohort or hackathon squad</p>
                  </div>
                </button>
              </div>
            </div>

            {regType === 'team' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                <Input
                  label="Team / Project Name"
                  placeholder="e.g. Quantum Pioneers"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  error={errors.teamName}
                  required
                />
                <Input
                  label="Additional Teammates (Optional)"
                  placeholder="Comma separated full names (e.g. Kevin Zhang, Sarah Connor)"
                  value={teamMembers}
                  onChange={e => setTeamMembers(e.target.value)}
                  helperText="Primary pass will be issued to team lead."
                />
              </div>
            )}

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant={isFull ? 'secondary' : 'primary'}
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isFull ? 'Join Waitlist' : 'Confirm & Register'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Visually Strong Confirmation Screen */}
        {step === 3 && confirmedReg && (
          <div className="text-center py-2 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                {isWaitlistResult ? '✓ Waitlist Queue Confirmed' : '✓ Registration Confirmed'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{confirmedReg.eventTitle}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Registration ID: <span className="font-bold text-indigo-700">{confirmedReg.id}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Time</span>
                <span className="font-medium text-slate-900">{confirmedReg.eventDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Venue</span>
                <span className="font-medium text-slate-900">{confirmedReg.eventVenue}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Participant</span>
                <span className="font-medium text-slate-900">{confirmedReg.participantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Type</span>
                <span className="font-medium text-slate-900 capitalize">
                  {confirmedReg.registrationType} {confirmedReg.teamName ? `(${confirmedReg.teamName})` : ''}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  handleResetAndClose();
                  setActiveQrPassReg(confirmedReg);
                }}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                View Digital QR Pass
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  alert('Event added to campus Google Calendar / ICS file.');
                }}
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Add to Calendar
              </Button>
              <Button variant="ghost" onClick={handleResetAndClose}>
                Back to Events
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
