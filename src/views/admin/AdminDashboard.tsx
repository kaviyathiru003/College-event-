import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Ticket, 
  AlertCircle, 
  Activity, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { events, registrations, auditLogs, navigate } = useApp();

  return (
    <AdminLayout activeNav="dashboard">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Security Overview</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Platform administration, role delegations, and campus event integrity control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Nominal</span>
            </span>
          </div>
        </div>

        {/* 4 Admin KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Total Users
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              3,412
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Verified university SSO logins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Total Events
            </span>
            <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">
              {events.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Under college governance</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Registrations
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {registrations.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Active passes & waitlists</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Active Organizers
            </span>
            <span className="text-3xl font-bold font-mono text-purple-600 tabular-nums">
              28
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Approved departmental clubs</p>
          </div>
        </div>

        {/* Audit Activity Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Platform Operations</h3>
            </div>
            <button
              onClick={() => navigate('admin-audit')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Full Audit Trail
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.status === 'success'
                        ? 'bg-emerald-500'
                        : log.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-500 ml-2">{log.target}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                  <span>{log.user}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
