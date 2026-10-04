import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { 
  downloadCertificateDocument, 
  downloadQRPass, 
  downloadCalendarICS, 
  downloadRosterCSV, 
  downloadOperationsReport 
} from '../../utils/downloads';
import { 
  Download, 
  Award, 
  QrCode, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

interface DownloadCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadCenterModal: React.FC<DownloadCenterModalProps> = ({ isOpen, onClose }) => {
  const { certificates, registrations, events, showToast } = useApp();

  const primaryCert = certificates[0] || {
    id: 'CERT-2026-89104',
    eventId: 'evt-cyber-ctf',
    eventTitle: 'Campus Cyber Defense CTF Tournament',
    participantId: 'user-part-01',
    participantName: 'Alex Chen',
    issueDate: 'September 20, 2026',
    certificateType: 'Merit' as const,
    rank: '2nd Place Overall',
    verifyHash: 'a7f92b49c011e49d88203f19e44319c8',
  };

  const primaryReg = registrations[0] || {
    id: 'EVF-2026-00128',
    eventId: 'evt-techfest-2026',
    eventTitle: 'TechFest 2026: Quantum Horizons',
    eventDate: 'Oct 14 - 16, 2026',
    eventVenue: 'Campus Main Auditorium & Tech Quad',
    eventTime: '09:00 AM - 06:00 PM',
    participantId: 'user-part-01',
    participantName: 'Alex Chen',
    participantEmail: 'alex.chen@campus.edu',
    participantPhone: '+1 (555) 382-9014',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Junior)',
    registrationType: 'team' as const,
    status: 'confirmed' as const,
    checkInStatus: 'not_checked_in' as const,
    qrCodeHash: 'EVF-QR-99482-TECHFEST-ALEX',
    createdAt: '2026-09-28',
  };

  const primaryEvent = events[0];

  const handleDownloadCert = () => {
    downloadCertificateDocument(primaryCert);
    showToast({
      type: 'success',
      title: 'Certificate Downloaded',
      message: `${primaryCert.id} downloaded successfully.`,
    });
  };

  const handleDownloadPass = () => {
    downloadQRPass(primaryReg);
    showToast({
      type: 'success',
      title: 'Pass Downloaded',
      message: `${primaryReg.id} SVG pass card downloaded.`,
    });
  };

  const handleDownloadICS = () => {
    if (primaryEvent) {
      downloadCalendarICS(primaryEvent);
      showToast({
        type: 'success',
        title: 'Calendar ICS Downloaded',
        message: `${primaryEvent.title} (.ics) saved.`,
      });
    }
  };

  const handleDownloadCSV = () => {
    downloadRosterCSV(registrations);
    showToast({
      type: 'success',
      title: 'Attendee CSV Downloaded',
      message: `${registrations.length} attendee records exported.`,
    });
  };

  const handleDownloadReport = () => {
    downloadOperationsReport(events, registrations);
    showToast({
      type: 'success',
      title: 'Operations Report Downloaded',
      message: 'EventFlow Executive Report (.md) saved.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EventFlow Campus File Downloads"
      description="Download official digital passes, certificates, calendar sync files, and attendee reports."
      maxWidth="lg"
    >
      <div className="space-y-3 pt-1">
        {/* Item 1: Verified Certificate */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Verified Academic Certificate</h4>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                  HTML / PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official credential with digital seal &amp; verification hash ({primaryCert.eventTitle})
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadCert}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>

        {/* Item 2: Digital QR Pass */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Digital Event Admission Pass</h4>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                  SVG Card
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                High-res turnstile admission badge with QR matrix (#{primaryReg.id})
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPass}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>

        {/* Item 3: Calendar ICS */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Event Calendar Schedule</h4>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">
                  .ICS File
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard iCalendar format for Google Calendar, Apple Calendar &amp; Outlook
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadICS}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>

        {/* Item 4: Attendee Roster CSV */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Attendee Roster Dataset</h4>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-semibold">
                  .CSV
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete student registrations, check-in timestamps, and team allocations
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>

        {/* Item 5: Operations Report */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Operations &amp; Attendance Report</h4>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-semibold">
                  .MD Summary
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Executive breakdown of campus venue utilization and attendance rates
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadReport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
        </div>

        <div className="pt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
