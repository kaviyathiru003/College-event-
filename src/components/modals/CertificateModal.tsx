import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { downloadCertificateDocument } from '../../utils/downloads';
import { Download, Award, ShieldCheck, Printer } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { activeCertificate, setActiveCertificate, showToast } = useApp();

  if (!activeCertificate) return null;

  const handleDownload = () => {
    downloadCertificateDocument(activeCertificate);
    showToast({
      type: 'success',
      title: 'Certificate Downloaded',
      message: `${activeCertificate.id} printable document saved to your device.`,
    });
  };

  return (
    <Modal
      isOpen={!!activeCertificate}
      onClose={() => setActiveCertificate(null)}
      title="Verified Campus Certificate"
      maxWidth="2xl"
    >
      <div className="flex flex-col items-center">
        {/* Printable Collegiate Certificate Frame */}
        <div className="w-full bg-amber-50/40 border-8 border-double border-slate-800 p-8 rounded-lg relative shadow-inner text-slate-900 select-none">
          {/* Corner flourish ornaments */}
          <div className="absolute top-2 left-2 text-xs font-mono text-slate-400">❖</div>
          <div className="absolute top-2 right-2 text-xs font-mono text-slate-400">❖</div>
          <div className="absolute bottom-2 left-2 text-xs font-mono text-slate-400">❖</div>
          <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-400">❖</div>

          {/* College Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-amber-300 mb-2 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-600">
              Department of Student Affairs & Engineering Council
            </h2>
            <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mt-1">
              Certificate of {activeCertificate.certificateType}
            </h1>
          </div>

          {/* Recipient Details */}
          <div className="text-center my-6 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">This credential is presented to</p>
            <h3 className="text-2xl font-bold text-indigo-900 tracking-tight underline decoration-indigo-300 underline-offset-8">
              {activeCertificate.participantName}
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto pt-2 leading-relaxed">
              for commendable participation and outstanding demonstration of skill in
              <span className="font-semibold text-slate-900 block text-sm mt-1">
                {activeCertificate.eventTitle}
              </span>
              {activeCertificate.rank && (
                <span className="inline-block mt-1 font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded text-xs">
                  Awarded: {activeCertificate.rank}
                </span>
              )}
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-8 pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <div className="text-left">
              <div className="font-serif italic font-medium text-slate-800 text-sm">Marcus Vance</div>
              <div className="h-0.5 w-28 bg-slate-400 my-0.5"></div>
              <p className="text-[10px] text-slate-500">Event Faculty Advisor</p>
            </div>

            {/* Official Digital Seal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-amber-600/60 bg-amber-50 flex items-center justify-center text-amber-700 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-[9px] uppercase font-mono tracking-tighter text-slate-400 mt-1">
                VERIFIED SEAL
              </span>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-medium text-slate-800 text-sm">Dr. Evelyn Reed</div>
              <div className="h-0.5 w-28 bg-slate-400 my-0.5 ml-auto"></div>
              <p className="text-[10px] text-slate-500">Dean of Student Affairs</p>
            </div>
          </div>

          {/* Cryptographic hash footer */}
          <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ID: {activeCertificate.id}</span>
            <span>Issued: {activeCertificate.issueDate}</span>
            <span className="truncate max-w-[120px]">Hash: {activeCertificate.verifyHash}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full mt-5 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download Official Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
