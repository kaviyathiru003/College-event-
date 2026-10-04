import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { downloadCertificateDocument } from '../../utils/downloads';
import { Award, Download, Eye, ShieldCheck, Calendar } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { certificates, setActiveCertificate, navigate, showToast } = useApp();

  const handleDownload = (cert: any) => {
    downloadCertificateDocument(cert);
    showToast({
      type: 'success',
      title: 'Certificate Downloaded',
      message: `${cert.id} saved as printable official document.`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Academic & Event Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified participation and merit credentials issued by the college event committee.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate('my-events')}>
          View My Event Passes
        </Button>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      Certificate of {cert.certificateType}
                    </span>
                  </div>
                  <Badge variant="success" size="sm" withDot>
                    Verified
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{cert.eventTitle}</h3>

                {cert.rank && (
                  <p className="text-xs font-bold text-amber-700 mt-1.5">
                    Honor Distinction: {cert.rank}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Credential ID</span>
                    <span className="font-semibold text-slate-800">{cert.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Issue Date</span>
                    <span className="font-semibold text-slate-800">{cert.issueDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveCertificate(cert)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  View Certificate
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(cert)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Document
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No certificates issued yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Certificates are issued automatically after you check into completed events.
          </p>
        </div>
      )}
    </div>
  );
};
