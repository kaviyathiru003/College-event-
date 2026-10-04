import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizerLayout } from '../../components/layout/OrganizerLayout';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Drawer } from '../../components/common/Modal';
import { Registration } from '../../types';
import { 
  Search, 
  Download, 
  Check, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Trash2,
  UserCheck
} from 'lucide-react';

export const OrganizerRegistrationsPage: React.FC = () => {
  const { 
    registrations, 
    events, 
    toggleCheckIn, 
    cancelRegistration, 
    promoteWaitlist,
    showToast 
  } = useApp();

  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'waitlist' | 'checked_in'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected participant drawer state
  const [selectedParticipant, setSelectedParticipant] = useState<Registration | null>(null);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      if (selectedEventFilter !== 'all' && r.eventId !== selectedEventFilter) {
        return false;
      }

      if (statusFilter === 'confirmed' && r.status !== 'confirmed') return false;
      if (statusFilter === 'waitlist' && r.status !== 'waitlist') return false;
      if (statusFilter === 'checked_in' && r.checkInStatus !== 'checked_in') return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = r.participantName.toLowerCase().includes(q);
        const matchEmail = r.participantEmail.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        const matchDept = r.department.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchId && !matchDept) return false;
      }

      return true;
    });
  }, [registrations, selectedEventFilter, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Participant Name', 'Email', 'Phone', 'Department', 'Event', 'Status', 'Checked In'];
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.participantName,
      r.participantEmail,
      r.participantPhone,
      r.department,
      r.eventTitle,
      r.status,
      r.checkInStatus === 'checked_in' ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventflow-attendees-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'CSV Exported',
      message: `Downloaded ${filteredRegistrations.length} attendee records.`,
    });
  };

  return (
    <OrganizerLayout activeNav="registrations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Attendee & Registration Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify turnstile passes, monitor capacity queues, and inspect participant details.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by participant name, email, or pass ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="w-48">
              <Select
                value={selectedEventFilter}
                onChange={e => setSelectedEventFilter(e.target.value)}
                options={[
                  { label: 'All Campus Events', value: 'all' },
                  ...events.map(ev => ({ label: ev.title, value: ev.id })),
                ]}
              />
            </div>

            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'waitlist', label: 'Waitlist' },
                { id: 'checked_in', label: 'Checked In' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Attendee Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Pass ID</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Check-in</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {reg.id}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedParticipant(reg)}
                        className="font-bold text-slate-900 hover:text-indigo-600 text-left"
                      >
                        {reg.participantName}
                      </button>
                      <p className="text-[11px] text-slate-400">{reg.participantEmail}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <p>{reg.department}</p>
                      <p className="text-[10px] text-slate-400">{reg.year}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate">
                      {reg.eventTitle}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          reg.status === 'confirmed'
                            ? 'success'
                            : reg.status === 'waitlist'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      >
                        {reg.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCheckIn(reg.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          reg.checkInStatus === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{reg.checkInStatus === 'checked_in' ? 'Checked In' : 'Scan'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedParticipant(reg)}
                        >
                          View
                        </Button>
                        {reg.status === 'waitlist' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => promoteWaitlist(reg.id)}
                            className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                          >
                            Promote
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right-Side Participant Drawer */}
        <Drawer
          isOpen={!!selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          title="Participant Dossier"
          subtitle={selectedParticipant?.id}
        >
          {selectedParticipant && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg">
                  {selectedParticipant.participantName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedParticipant.participantName}
                  </h3>
                  <p className="text-slate-500">{selectedParticipant.department}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedParticipant.year}</p>
                </div>
              </div>

              {/* Status Block */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Registration State
                  </span>
                  <Badge variant={selectedParticipant.status === 'confirmed' ? 'success' : 'warning'} size="md">
                    {selectedParticipant.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Venue Check-In
                  </span>
                  <Badge variant={selectedParticipant.checkInStatus === 'checked_in' ? 'success' : 'neutral'} size="md">
                    {selectedParticipant.checkInStatus === 'checked_in' ? 'CHECKED IN ✓' : 'NOT CHECKED IN'}
                  </Badge>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Event</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedParticipant.eventTitle}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">College Email</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedParticipant.participantEmail}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedParticipant.participantPhone}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registration Type</span>
                  <p className="font-medium text-slate-800 mt-0.5 capitalize">
                    {selectedParticipant.registrationType}
                    {selectedParticipant.teamName ? ` · Team: ${selectedParticipant.teamName}` : ''}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered On</span>
                  <p className="font-mono text-slate-600 mt-0.5">{selectedParticipant.createdAt}</p>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full"
                  variant={selectedParticipant.checkInStatus === 'checked_in' ? 'outline' : 'primary'}
                  onClick={() => {
                    toggleCheckIn(selectedParticipant.id);
                    setSelectedParticipant({
                      ...selectedParticipant,
                      checkInStatus: selectedParticipant.checkInStatus === 'checked_in' ? 'not_checked_in' : 'checked_in',
                    });
                  }}
                >
                  {selectedParticipant.checkInStatus === 'checked_in' ? 'Undo Check-in' : 'Validate Check-in'}
                </Button>

                {selectedParticipant.status === 'waitlist' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      promoteWaitlist(selectedParticipant.id);
                      setSelectedParticipant({
                        ...selectedParticipant,
                        status: 'confirmed',
                      });
                    }}
                  >
                    Promote to Confirmed Attendee
                  </Button>
                )}

                <Button
                  className="w-full text-rose-600 hover:bg-rose-50 border-rose-200"
                  variant="outline"
                  onClick={() => {
                    if (confirm(`Revoke registration for ${selectedParticipant.participantName}?`)) {
                      cancelRegistration(selectedParticipant.id);
                      setSelectedParticipant(null);
                    }
                  }}
                >
                  Revoke Registration
                </Button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </OrganizerLayout>
  );
};
