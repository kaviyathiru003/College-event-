import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessRestrictedPage: React.FC = () => {
  const { role, loginAs, navigate } = useApp();

  const handleGoDashboard = () => {
    if (role === 'organizer') navigate('organizer-dashboard');
    else if (role === 'admin') navigate('admin-dashboard');
    else navigate('participant-dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Access Restricted</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            You don't have permission to access this page. This administrative or organizer section requires elevated credentials.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button variant="primary" onClick={handleGoDashboard}>
            Go to Dashboard
          </Button>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Want to test this role? Quick switch:</span>
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => loginAs('organizer')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Organizer Demo
              </button>
              <span>·</span>
              <button
                onClick={() => loginAs('admin')}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
