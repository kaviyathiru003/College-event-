import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { 
  downloadCalendarICS, 
  downloadFullSemesterICS, 
  getGoogleCalendarUrl, 
  getOutlookCalendarUrl 
} from '../../utils/downloads';
import { Calendar, Download, ExternalLink, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({ isOpen, onClose }) => {
  const { events, registrations, calendarExportEvent, showToast } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    calendarExportEvent?.id || events[0]?.id || ''
  );

  const currentEvent = events.find(e => e.id === selectedEventId) || calendarExportEvent || events[0];

  const handleDownloadSingleICS = () => {
    if (!currentEvent) return;
    downloadCalendarICS(currentEvent);
    showToast({
      type: 'success',
      title: 'iCalendar File Downloaded',
      message: `"${currentEvent.title}.ics" saved for Apple Calendar & Outlook.`,
    });
  };

  const handleDownloadSemesterICS = () => {
    downloadFullSemesterICS(events, 'Fall-Semester-2026');
    showToast({
      type: 'success',
      title: 'Semester Schedule Exported',
      message: `Exported ${events.length} campus events into EventFlow-Fall-Semester-2026.ics.`,
    });
  };

  const handleDownloadMyPassesICS = () => {
    const myEvents = events.filter(e => registrations.some(r => r.eventId === e.id && r.status === 'confirmed'));
    downloadFullSemesterICS(myEvents, 'My-Registered-Events');
    showToast({
      type: 'success',
      title: 'Pass Schedule Exported',
      message: `Exported ${myEvents.length} registered events into your calendar.`,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calendar Synchronization & Export"
      description="Sync college symposiums, hackathons, and deadlines with your personal schedule."
      maxWidth="md"
    >
      <div className="space-y-5 pt-1 text-xs">
        {/* Event Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Campus Event
          </label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {events.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.startDate})
              </option>
            ))}
          </select>
        </div>

        {currentEvent && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">{currentEvent.title}</span>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentEvent.startDate} ({currentEvent.startTime} - {currentEvent.endTime})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentEvent.venue} ({currentEvent.room})
              </span>
            </div>
          </div>
        )}

        {/* 1-Click Cloud Calendar Sync */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
            1-Click Cloud Calendar Sync
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {currentEvent && (
              <>
                <a
                  href={getGoogleCalendarUrl(currentEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                      G
                    </div>
                    <span className="font-semibold text-slate-800">Google Calendar</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                </a>

                <a
                  href={getOutlookCalendarUrl(currentEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
                      O
                    </div>
                    <span className="font-semibold text-slate-800">Outlook 365</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Universal .ICS File Downloads */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
            Universal iCalendar (.ICS) Downloads
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Single Event File (.ics)</span>
                <span className="text-slate-500 text-[11px]">Direct import for Apple Calendar, Thunderbird, or mobile</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleDownloadSingleICS} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Download .ICS
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">My Registered Passes (.ics)</span>
                <span className="text-slate-500 text-[11px]">All confirmed passes on your student account</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleDownloadMyPassesICS} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export My Passes
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Full Semester Campus Calendar (.ics)</span>
                <span className="text-slate-500 text-[11px]">All 48+ campus events, hackathons, and sports matches</span>
              </div>
              <Button size="sm" variant="primary" onClick={handleDownloadSemesterICS} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export Full Semester
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
