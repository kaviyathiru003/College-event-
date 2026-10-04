import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { downloadQRPass } from '../../utils/downloads';
import { CheckCircle2, Clock, MapPin, Calendar, QrCode, Download, Share2, Check } from 'lucide-react';

export const QRPassModal: React.FC = () => {
  const { activeQrPassReg, setActiveQrPassReg, toggleCheckIn, events, showToast } = useApp();

  if (!activeQrPassReg) return null;

  const event = events.find(e => e.id === activeQrPassReg.eventId);
  const isCheckedIn = activeQrPassReg.checkInStatus === 'checked_in';

  const handleDownload = () => {
    downloadQRPass(activeQrPassReg);
    showToast({
      type: 'success',
      title: 'Digital Pass Downloaded',
      message: `Pass #${activeQrPassReg.id} SVG saved to your downloads folder.`,
    });
  };

  return (
    <Modal
      isOpen={!!activeQrPassReg}
      onClose={() => setActiveQrPassReg(null)}
      maxWidth="md"
      title="Digital Campus Event Pass"
    >
      <div className="flex flex-col items-center">
        {/* Pass Card Container */}
        <div className="w-full bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
          {/* Header Strip with Event details */}
          <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-800/60 to-transparent">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono tracking-wider text-indigo-400 font-semibold uppercase">
                {activeQrPassReg.id}
              </span>
              <Badge variant={isCheckedIn ? 'success' : 'warning'} size="sm" withDot>
                {isCheckedIn ? 'Checked In ✓' : 'Not Checked In'}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {activeQrPassReg.eventTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>{activeQrPassReg.department}</span>
              <span>·</span>
              <span>{activeQrPassReg.year}</span>
            </p>
          </div>

          {/* QR Code Presentation */}
          <div className="p-6 bg-white flex flex-col items-center justify-center text-slate-900">
            <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl relative group">
              {/* Scalable SVG QR Representation */}
              <svg className="w-48 h-48" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3 corner finder patterns */}
                <rect x="10" y="10" width="35" height="35" rx="4" fill="#0F172A" />
                <rect x="16" y="16" width="23" height="23" rx="2" fill="white" />
                <rect x="22" y="22" width="11" height="11" rx="1" fill="#4F46E5" />

                <rect x="95" y="10" width="35" height="35" rx="4" fill="#0F172A" />
                <rect x="101" y="16" width="23" height="23" rx="2" fill="white" />
                <rect x="107" y="22" width="11" height="11" rx="1" fill="#4F46E5" />

                <rect x="10" y="95" width="35" height="35" rx="4" fill="#0F172A" />
                <rect x="16" y="101" width="23" height="23" rx="2" fill="white" />
                <rect x="22" y="107" width="11" height="11" rx="1" fill="#4F46E5" />

                {/* Timing lines & Data modules */}
                <rect x="52" y="14" width="6" height="6" fill="#0F172A" />
                <rect x="64" y="14" width="6" height="6" fill="#0F172A" />
                <rect x="76" y="14" width="6" height="6" fill="#0F172A" />

                <rect x="14" y="52" width="6" height="6" fill="#0F172A" />
                <rect x="14" y="64" width="6" height="6" fill="#0F172A" />
                <rect x="14" y="76" width="6" height="6" fill="#0F172A" />

                {/* Center data pattern */}
                <rect x="52" y="40" width="6" height="6" fill="#4F46E5" />
                <rect x="64" y="40" width="12" height="6" fill="#0F172A" />
                <rect x="82" y="40" width="6" height="12" fill="#0F172A" />
                <rect x="52" y="52" width="18" height="6" fill="#0F172A" />
                <rect x="76" y="52" width="6" height="6" fill="#4F46E5" />
                <rect x="60" y="64" width="20" height="6" fill="#0F172A" />
                <rect x="52" y="76" width="6" height="12" fill="#4F46E5" />
                <rect x="64" y="76" width="12" height="6" fill="#0F172A" />
                <rect x="82" y="76" width="18" height="6" fill="#0F172A" />

                {/* Bottom right clusters */}
                <rect x="52" y="95" width="12" height="12" fill="#0F172A" />
                <rect x="70" y="95" width="6" height="6" fill="#4F46E5" />
                <rect x="82" y="95" width="12" height="6" fill="#0F172A" />
                <rect x="100" y="95" width="6" height="18" fill="#0F172A" />
                <rect x="112" y="95" width="12" height="6" fill="#0F172A" />
                <rect x="70" y="107" width="18" height="6" fill="#0F172A" />
                <rect x="94" y="119" width="18" height="6" fill="#4F46E5" />
                <rect x="118" y="113" width="6" height="12" fill="#0F172A" />
              </svg>
            </div>

            <p className="text-xs text-slate-500 mt-2 font-mono">
              Scan at Venue Turnstile or Registration Desk
            </p>
          </div>

          {/* Details Footer */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Date & Time</span>
                <span className="font-medium text-white">{activeQrPassReg.eventDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Venue Location</span>
                <span className="font-medium text-white">{activeQrPassReg.eventVenue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full mt-5 flex flex-col gap-2">
          <Button
            variant={isCheckedIn ? 'outline' : 'primary'}
            className="w-full"
            onClick={() => toggleCheckIn(activeQrPassReg.id)}
            leftIcon={isCheckedIn ? <Check className="w-4 h-4 text-emerald-600" /> : <QrCode className="w-4 h-4" />}
          >
            {isCheckedIn ? 'Undo Check-in (Organizer Simulation)' : 'Simulate Venue Check-in'}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
            >
              Download Pass (SVG)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                alert('Pass verification link copied to clipboard!');
              }}
            >
              Share Pass Link
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
