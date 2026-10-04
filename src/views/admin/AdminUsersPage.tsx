import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Search, Shield, UserCheck, GraduationCap } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    {
      id: 'u-1',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      role: 'Participant',
      department: 'Computer Science & Engineering',
      status: 'Active',
      registeredCount: 4,
    },
    {
      id: 'u-2',
      name: 'Prof. Marcus Vance',
      email: 'marcus.vance@campus.edu',
      role: 'Organizer',
      department: 'School of Computing & Innovation',
      status: 'Active',
      registeredCount: 3,
    },
    {
      id: 'u-3',
      name: 'Dr. Evelyn Reed',
      email: 'admin.dean@campus.edu',
      role: 'Admin',
      department: 'Office of Student Affairs',
      status: 'Active',
      registeredCount: 0,
    },
    {
      id: 'u-4',
      name: 'Coach Elena Ramos',
      email: 'athletics@campus.edu',
      role: 'Organizer',
      department: 'Department of Athletics',
      status: 'Active',
      registeredCount: 1,
    },
    {
      id: 'u-5',
      name: 'Sarah Connor',
      email: 'sarah.c@campus.edu',
      role: 'Participant',
      department: 'Electrical Engineering',
      status: 'Active',
      registeredCount: 2,
    },
  ]);

  const toggleRole = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'Participant' ? 'Organizer' : 'Participant';
        showToast({
          type: 'info',
          title: 'Role Updated',
          message: `${u.name} role changed to ${nextRole}.`,
        });
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeNav="users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform User Directory</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Assign organizer privileges, review student SSO registrations, and manage RBAC scopes.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search users by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.department}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 font-semibold ${
                      user.role === 'Admin'
                        ? 'text-purple-700'
                        : user.role === 'Organizer'
                        ? 'text-emerald-700'
                        : 'text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success" size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {user.role !== 'Admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRole(user.id)}
                      >
                        {user.role === 'Participant' ? 'Promote to Organizer' : 'Demote to Participant'}
                      </Button>
                    )}
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
