import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const OrganizerSettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Organizer department settings and notification webhooks updated.',
    });
  };

  return (
    <OrganizerLayout activeNav="settings">
      <div className="max-w-2xl space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organizer Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department profile, verification gateways, and check-in scanner defaults.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <Input
            label="Department / Faculty Body"
            defaultValue={currentUser?.department || 'School of Computing & Innovation'}
          />

          <Input
            label="Lead Advisor Name"
            defaultValue={currentUser?.name || 'Prof. Marcus Vance'}
          />

          <Input
            label="Official Contact Email"
            defaultValue={currentUser?.email || 'marcus.vance@campus.edu'}
          />

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Default Check-in Policies</span>
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Automatically issue participation certificates upon QR verification</span>
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Require student ID card check alongside digital QR scan</span>
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </OrganizerLayout>
  );
};
