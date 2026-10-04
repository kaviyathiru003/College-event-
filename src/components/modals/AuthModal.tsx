import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { UserCheck, Shield, GraduationCap } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginAs,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [selectedRole, setSelectedRole] = useState<UserRole>('participant');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authModalMode === 'forgot') {
        showToast({
          type: 'info',
          title: 'Password Reset Link Sent',
          message: `Check ${email} for instructions to reset your password.`,
        });
        setAuthModalMode('signin');
        return;
      }

      loginAs(selectedRole);
      setAuthModalOpen(false);
    }, 400);
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      maxWidth="sm"
      title={
        authModalMode === 'signin'
          ? 'Sign In to EventFlow'
          : authModalMode === 'signup'
          ? 'Create Campus Account'
          : authModalMode === 'forgot'
          ? 'Reset Your Password'
          : 'Set New Password'
      }
      description={
        authModalMode === 'signin'
          ? 'Use your university credentials or select a quick demo persona.'
          : 'Join the centralized campus event coordination network.'
      }
    >
      <div className="space-y-4">
        {/* Quick Role Switcher Buttons for seamless testing */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Demo Persona Fast-Login
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                loginAs('participant');
                setAuthModalOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">Student</span>
              <span className="text-[9px] text-slate-500">Alex Chen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('organizer');
                setAuthModalOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center"
            >
              <UserCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">Organizer</span>
              <span className="text-[9px] text-slate-500">Prof. Vance</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                setAuthModalOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center"
            >
              <Shield className="w-4 h-4 text-purple-600 mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">Admin</span>
              <span className="text-[9px] text-slate-500">Dean Reed</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink-0 mx-3 text-[11px] text-slate-400 font-medium">Or enter credentials</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authModalMode === 'signup' && (
            <>
              <Input
                label="Full Name"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <Select
                label="Role"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as UserRole)}
                options={[
                  { label: 'Participant / Student', value: 'participant' },
                  { label: 'Event Organizer / Club Lead', value: 'organizer' },
                  { label: 'Campus Administrator', value: 'admin' },
                ]}
              />
              <Input
                label="Department / School"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
              />
            </>
          )}

          <Input
            label="College Email"
            type="email"
            placeholder="you@campus.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {authModalMode !== 'forgot' && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          )}

          {authModalMode === 'signin' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setAuthModalMode('forgot')}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            {authModalMode === 'signin'
              ? 'Sign In'
              : authModalMode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          {authModalMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('signup')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('signin')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
