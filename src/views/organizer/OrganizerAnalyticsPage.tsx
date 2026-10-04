import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { downloadOperationsReport } from '../../utils/downloads';
import { Download, TrendingUp, Users, CheckCircle, Star, BarChart3 } from 'lucide-react';

export const OrganizerAnalyticsPage: React.FC = () => {
  const { events, registrations, showToast } = useApp();

  const totalRegs = registrations.length;
  const checkedIn = registrations.filter(r => r.checkInStatus === 'checked_in').length;
  const avgAttendance = totalRegs > 0 ? Math.round((checkedIn / totalRegs) * 100) : 86;

  const handleExport = () => {
    downloadOperationsReport(events, registrations);
    showToast({
      type: 'success',
      title: 'Report Downloaded',
      message: 'Executive operations summary (.md) downloaded to your device.',
    });
  };

  return (
    <OrganizerLayout activeNav="analytics">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Event Operations Analytics</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Attendance conversions, capacity utilization benchmarks, and student satisfaction.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Comprehensive Report
          </Button>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Total Registrations
            </span>
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {totalRegs}
            </span>
            <p className="text-[11px] text-emerald-600 mt-1">↑ +24% YoY growth</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Attendance Conversion
            </span>
            <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">
              {avgAttendance}%
            </span>
            <p className="text-[11px] text-slate-400 mt-1">QR check-in efficiency</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Capacity Utilization
            </span>
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">
              91.4%
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Optimal room density</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Avg Feedback Score
            </span>
            <span className="text-3xl font-bold font-mono text-amber-500 tabular-nums">
              4.9 / 5.0
            </span>
            <p className="text-[11px] text-slate-400 mt-1">From 482 student reviews</p>
          </div>
        </div>

        {/* Capacity Utilization vs Target Benchmarks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Event-by-Event Capacity Utilization</h3>
            <p className="text-xs text-slate-500">Seat fill rate across all campus categories</p>
          </div>

          <div className="space-y-4">
            {events.slice(0, 5).map(evt => {
              const pct = Math.round((evt.registeredCount / evt.capacity) * 100);
              return (
                <div key={evt.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{evt.title}</span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {evt.registeredCount} / {evt.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${pct >= 95 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Track Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Participant Mix
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Computer Science</span>
                <span className="font-mono font-bold">48%</span>
              </div>
              <div className="flex justify-between">
                <span>Electrical & Electronics</span>
                <span className="font-mono font-bold">22%</span>
              </div>
              <div className="flex justify-between">
                <span>Mechanical & Design</span>
                <span className="font-mono font-bold">16%</span>
              </div>
              <div className="flex justify-between">
                <span>Business & Arts</span>
                <span className="font-mono font-bold">14%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Check-in Velocity
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peak door throughput averaged <strong>42 scans/minute</strong> using digital camera turnstiles with zero entrance queue bottlenecks.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Drop-off Prevention
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              SMS automated reminders sent 24h prior reduced absentee no-shows by <strong>68%</strong> across all departmental symposiums.
            </p>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};
