'use client';

import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Search, 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserX,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Eye
} from 'lucide-react';

interface BloodDonor {
  id: string;
  fullName: string;
  phone: string;
  bloodGroup: string;
  age: number;
  gender?: string;
  address: string;
  area: string;
  availability: 'available' | 'unavailable';
  lastDonationDate?: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  available: number;
  unavailable: number;
}

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CHUADANGA_AREAS = ['All', 'Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'];

export default function AdminBloodDonorsPage() {
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    available: 0,
    unavailable: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Donor
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bloodGroup: 'O+',
    age: '',
    gender: 'Male',
    address: '',
    area: 'Chuadanga Sadar',
    availability: 'available',
    lastDonationDate: '',
    note: '',
    status: 'approved',
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('status', activeTab);
      if (selectedGroup !== 'All') params.set('bloodGroup', selectedGroup);
      if (selectedArea !== 'All') params.set('area', selectedArea);
      if (searchQuery.trim() !== '') params.set('q', searchQuery.trim());

      const res = await fetch(`/api/admin/blood?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDonors(data.donors || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin blood donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [activeTab, selectedGroup, selectedArea]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  // Status Change Actions
  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/blood/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDonors();
      }
    } catch (err) {
      console.error('Error updating donor status:', err);
    }
  };

  // Availability Toggle Action
  const handleToggleAvailability = async (id: string, currentAvailability: string) => {
    try {
      const newAvail = currentAvailability === 'available' ? 'unavailable' : 'available';
      const res = await fetch(`/api/admin/blood/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newAvail }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDonors();
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Delete Action
  const handleDeleteDonor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donor record?')) return;
    try {
      const res = await fetch(`/api/admin/blood/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDonors();
      }
    } catch (err) {
      console.error('Error deleting donor:', err);
    }
  };

  // Modal Open Handlers
  const openViewModal = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setIsViewModalOpen(true);
  };

  const openEditModal = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setFormData({
      fullName: donor.fullName,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      age: String(donor.age),
      gender: donor.gender || 'Male',
      address: donor.address,
      area: donor.area,
      availability: donor.availability,
      lastDonationDate: donor.lastDonationDate || '',
      note: donor.note || '',
      status: donor.status,
    });
    setActionError(null);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      fullName: '',
      phone: '',
      bloodGroup: 'O+',
      age: '',
      gender: 'Male',
      address: '',
      area: 'Chuadanga Sadar',
      availability: 'available',
      lastDonationDate: '',
      note: '',
      status: 'approved',
    });
    setActionError(null);
    setIsAddModalOpen(true);
  };

  // Add / Edit Form Submission
  const handleSaveDonor = async (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    setActionError(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.age || !formData.address.trim()) {
      setActionError('Please fill in all required fields.');
      return;
    }

    try {
      setActionLoading(true);
      const url = isEdit ? `/api/admin/blood/${selectedDonor?.id}` : '/api/admin/blood';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save donor information');
      }

      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      fetchDonors();
    } catch (err: any) {
      setActionError(err.message || 'Error saving donor');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-600 mb-1 uppercase tracking-wider">
            <Droplet className="w-4 h-4 fill-rose-600" /> Central Admin Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-900 tracking-tight">
            Blood Donors Directory Control
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Review pending registrations, manage donor availability, and maintain blood donor listings in Chuadanga.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-nuvica-primary !bg-rose-600 hover:!bg-rose-700 text-xs !py-3 !px-5 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Manually Add Donor
        </button>
      </div>

      {/* 1. STATS DASHBOARD CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Total Donors</span>
          <div className="text-2xl font-black text-nuvicaNavy-900">{stats.total}</div>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
          </span>
          <div className="text-2xl font-black text-amber-900">{stats.pending}</div>
        </div>

        <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-sky-800 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" /> Approved Donors
          </span>
          <div className="text-2xl font-black text-sky-900">{stats.approved}</div>
        </div>

        <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold uppercase text-rose-800 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" /> Available Now
          </span>
          <div className="text-2xl font-black text-rose-900">{stats.available}</div>
        </div>

        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
          <span className="text-[11px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
            <UserX className="w-3.5 h-3.5 text-slate-400" /> Unavailable
          </span>
          <div className="text-2xl font-black text-slate-700">{stats.unavailable}</div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {[
            { id: 'all', label: 'All Donors', count: stats.total },
            { id: 'pending', label: 'Pending Approval', count: stats.pending, badgeColor: 'bg-amber-500 text-white' },
            { id: 'approved', label: 'Approved', count: stats.approved },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-nuvicaNavy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      tab.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700')
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters Grid */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg === 'All' ? 'All Blood Groups' : bg}
              </option>
            ))}
          </select>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50"
          >
            {CHUADANGA_AREAS.map((area) => (
              <option key={area} value={area}>
                {area === 'All' ? 'All Areas in Chuadanga' : area}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, address..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button type="submit" className="btn-nuvica-primary text-xs !py-2.5 !px-4">
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* 3. DONOR TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold text-xs">
            Loading blood donors data...
          </div>
        ) : donors.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Droplet className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No blood donors match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Area & Address</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {donors.map((donor) => {
                  const isPending = donor.status === 'pending';
                  const isApproved = donor.status === 'approved';
                  const isRejected = donor.status === 'rejected';
                  const isAvailable = donor.availability === 'available';

                  return (
                    <tr key={donor.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-nuvicaNavy-900">
                        <div>{donor.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {donor.age} Yrs • {donor.gender || 'Male'}
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-xs shadow-xs">
                          {donor.bloodGroup}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <a href={`tel:${donor.phone}`} className="hover:text-rose-600 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {donor.phone}
                        </a>
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{donor.area}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {donor.address}
                        </div>
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(donor.id, donor.availability)}
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-all ${
                            isAvailable
                              ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-sky-500' : 'bg-amber-500'}`}></span>
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-sky-600" /> Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(donor.id, 'approved')}
                                className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors"
                                title="Approve Donor"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(donor.id, 'rejected')}
                                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                                title="Reject Donor"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => openViewModal(donor)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(donor)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-sky-700 transition-colors"
                            title="Edit Donor"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteDonor(donor.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Delete Donor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-sm flex items-center justify-center">
                  {selectedDonor.bloodGroup}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-nuvicaNavy-900">{selectedDonor.fullName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedDonor.area}</p>
                </div>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-sky-50/60 p-4 rounded-2xl">
              <p><strong>Mobile:</strong> {selectedDonor.phone}</p>
              <p><strong>Age:</strong> {selectedDonor.age} Yrs ({selectedDonor.gender || 'Male'})</p>
              <p><strong>Address:</strong> {selectedDonor.address}</p>
              <p><strong>Area:</strong> {selectedDonor.area}</p>
              <p><strong>Availability:</strong> {selectedDonor.availability}</p>
              <p><strong>Status:</strong> {selectedDonor.status}</p>
              {selectedDonor.lastDonationDate && <p><strong>Last Donation:</strong> {selectedDonor.lastDonationDate}</p>}
              {selectedDonor.note && <p><strong>Note:</strong> "{selectedDonor.note}"</p>}
              <p className="text-[11px] text-slate-400 pt-2 border-t border-sky-100">
                Registered on: {new Date(selectedDonor.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn-nuvica-secondary text-xs !py-2 !px-5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-nuvicaNavy-900">
                {isEditModalOpen ? 'Edit Donor Information' : 'Manually Add Blood Donor'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={(e) => handleSaveDonor(e, isEditModalOpen)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-rose-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Area / Upazila *</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="Chuadanga Sadar">Chuadanga Sadar</option>
                    <option value="Alamdanga">Alamdanga</option>
                    <option value="Damurhuda">Damurhuda</option>
                    <option value="Jibannagar">Jibannagar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="available">Available Now</option>
                    <option value="unavailable">Currently Unavailable</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Address / Neighborhood *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Approval Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="approved">Approved (Publicly Visible)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Note</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-nuvica-primary !bg-rose-600 hover:!bg-rose-700 text-xs !py-2.5 !px-6"
                >
                  {actionLoading ? 'Saving...' : 'Save Donor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
