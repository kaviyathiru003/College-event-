import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Search, ShieldAlert, Check, XCircle } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { events, updateEvent, showToast } = useApp();
  const [search, setSearch] = useState('');

  const toggleEventStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'cancelled' ? 'published' : 'cancelled';
    updateEvent(id, { status: nextStatus as any });
    showToast({
      type: nextStatus === 'cancelled' ? 'error' : 'success',
      title: nextStatus === 'cancelled' ? 'Event Suspended' : 'Event Re-activated',
      message: `Status updated by platform administrator.`,
    });
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.organizerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform-Wide Events Oversight</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit compliance, enforce venue capacity rules, and freeze unverified student activities.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search all events by title, organizer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Organizer & Dept</th>
                <th className="py-3 px-4">Venue & Capacity</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{evt.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{evt.startDate}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p>{evt.organizerName}</p>
                    <p className="text-[10px] text-slate-400">{evt.department}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p>{evt.venue}</p>
                    <p className="text-[10px] text-slate-400">Cap: {evt.capacity}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {evt.registeredCount} / {evt.capacity}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={evt.status === 'cancelled' ? 'error' : 'success'} size="sm">
                      {evt.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant={evt.status === 'cancelled' ? 'outline' : 'destructive'}
                      onClick={() => toggleEventStatus(evt.id, evt.status)}
                    >
                      {evt.status === 'cancelled' ? 'Restore Event' : 'Suspend Event'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
