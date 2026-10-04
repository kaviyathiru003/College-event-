import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { History, Search, Shield, Filter } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [filter, setFilter] = useState('');

  const filtered = auditLogs.filter(log =>
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.target.toLowerCase().includes(filter.toLowerCase()) ||
    log.user.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <AdminLayout activeNav="audit">
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Log</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable timeline of administrative overrides, event publishing, and security events.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search audit actions, operators, targets..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.user} ({log.role})
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.ip}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <Badge
                      variant={
                        log.status === 'success'
                          ? 'success'
                          : log.status === 'warning'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {log.status.toUpperCase()}
                    </Badge>
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
