'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock, User, PhoneCall } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [hospitalFilter, setHospitalFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, hospRes] = await Promise.all([
        fetch('/api/admin/appointments'),
        fetch('/api/admin/hospitals'),
      ]);
      const aptData = await aptRes.json();
      const hospData = await hospRes.json();

      if (aptData.appointments) setAppointments(aptData.appointments);
      if (hospData.hospitals) setHospitals(hospData.hospitals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.patientPhone.includes(searchQuery) || 
                          apt.appointmentCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHospital = hospitalFilter === 'ALL' || apt.hospitalId === hospitalFilter;
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.appointmentDate === dateFilter;
    return matchesSearch && matchesHospital && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight">Appointment Control Center</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Centralized control over all patient appointment bookings across hospitals in Chittagong District.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Patient name, phone, or APT ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
          />
        </div>

        {/* Hospital Filter */}
        <div>
          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
          >
            <option value="ALL">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="NO_SHOW">NO_SHOW</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Appointments Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">APT Code</th>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Doctor & Hospital</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-nuvicaNavy-900">
                      {apt.appointmentCode}
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <div className="font-extrabold text-nuvicaNavy-900 text-sm">{apt.patientName}</div>
                      <div className="text-slate-500 text-[11px]">{apt.patientPhone} • {apt.patientAge} Yrs ({apt.patientGender})</div>
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{apt.doctor?.name}</div>
                      <div className="text-slate-500 text-[11px]">{apt.hospital?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{apt.appointmentDate}</div>
                      <div className="text-slate-500 text-[11px]">{apt.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-sky-100 text-sky-800'
                          : apt.status === 'COMPLETED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : apt.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : apt.status === 'NO_SHOW'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {apt.status !== 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[10px]"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px]"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px]"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
