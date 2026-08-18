'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  RotateCcw, 
  UserX,
  Shield,
  UserPlus
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  hospital?: {
    id: string;
    name: string;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch user accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole =
      selectedRole === 'ALL' ||
      u.role === selectedRole ||
      (selectedRole === 'ADMIN' && (u.role === 'SUPER_ADMIN' || u.role === 'OWNER_ADMIN'));

    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const patientCount = users.filter((u) => u.role === 'PATIENT').length;
  const hospitalAdminCount = users.filter((u) => u.role === 'HOSPITAL_ADMIN').length;
  const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN' || u.role === 'OWNER_ADMIN').length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'OWNER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldCheck className="w-3 h-3 text-rose-600" /> System Admin
          </span>
        );
      case 'HOSPITAL_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-200">
            <Building2 className="w-3 h-3 text-sky-600" /> Hospital Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
            <UserCheck className="w-3 h-3 text-sky-600" /> Patient User
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-sky-600" /> Registered User Accounts
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
            View and manage registered patients, hospital administrators, and system users on CD Doctors.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Total Users</span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-nuvicaNavy-900">{totalUsers}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Patients</span>
            <UserCheck className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-nuvicaNavy-900">{patientCount}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Hospital Admins</span>
            <Building2 className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-nuvicaNavy-900">{hospitalAdminCount}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">System Admins</span>
            <ShieldCheck className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-nuvicaNavy-900">{superAdminCount}</p>
        </div>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Quick Role Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Users', value: 'ALL' },
              { label: 'Patients', value: 'PATIENT' },
              { label: 'Hospital Admins', value: 'HOSPITAL_ADMIN' },
              { label: 'System Admins', value: 'ADMIN' },
            ].map((roleFilter) => (
              <button
                key={roleFilter.value}
                onClick={() => setSelectedRole(roleFilter.value)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                  selectedRole === roleFilter.value
                    ? 'bg-nuvicaNavy-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {roleFilter.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* USER ACCOUNTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Role Badge</th>
                <th className="px-6 py-4">Associated Hospital</th>
                <th className="px-6 py-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading registered user accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No user accounts match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-nuvicaNavy-900 text-sm">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {user.hospital ? (
                        <div className="flex items-center gap-1 font-bold text-nuvicaNavy-900">
                          <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{user.hospital.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">General Platform User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
