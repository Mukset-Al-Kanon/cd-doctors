'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Building2, 
  Stethoscope, 
  Edit3, 
  Trash2, 
  X,
  PhoneCall,
  DollarSign,
  CheckSquare,
  Square,
  Building,
  Award,
  Layers,
  Camera,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

const WEEK_DAYS = [
  { label: 'Saturday', short: 'Sat', value: 6 },
  { label: 'Sunday', short: 'Sun', value: 0 },
  { label: 'Monday', short: 'Mon', value: 1 },
  { label: 'Tuesday', short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday', short: 'Thu', value: 4 },
  { label: 'Friday', short: 'Fri', value: 5 },
];

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    degrees: '',
    specialization: '',
    bmdcNumber: '',
    experienceYears: 5,
    bio: '',
    consultationFee: 800,
    chamberRoom: 'Chamber 101',
    phone: '',
    hospitalId: '',
    departmentId: '',
    status: 'ACTIVE',
  });

  // Multi-Hospital & Available Days State
  const [assignedHospitalIds, setAssignedHospitalIds] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([6, 0, 1, 2, 3, 4]); // Sat to Thu default

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, hospRes] = await Promise.all([
        fetch('/api/admin/doctors'),
        fetch('/api/admin/hospitals'),
      ]);
      const docData = await docRes.json();
      const hospData = await hospRes.json();

      if (docData && Array.isArray(docData.doctors)) setDoctors(docData.doctors);
      if (hospData && Array.isArray(hospData.hospitals)) {
        setHospitals(hospData.hospitals);
        if (hospData.hospitals.length > 0) {
          const firstHId = hospData.hospitals[0].id;
          setFormData((prev) => ({ ...prev, hospitalId: firstHId }));
          setAssignedHospitalIds([firstHId]);
          fetchDepartments(firstHId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async (hId: string) => {
    if (!hId) return;
    try {
      const res = await fetch(`/api/hospitals/departments?hospitalId=${hId}`);
      const data = await res.json();
      if (data && Array.isArray(data.departments)) {
        setDepartments(data.departments);
        if (data.departments.length > 0) {
          setFormData((prev) => ({ ...prev, departmentId: data.departments[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'hospitalId') {
      fetchDepartments(value);
      if (!assignedHospitalIds.includes(value)) {
        setAssignedHospitalIds([...assignedHospitalIds, value]);
      }
    }
  };

  const toggleHospitalAssignment = (hId: string) => {
    if (assignedHospitalIds.includes(hId)) {
      if (assignedHospitalIds.length === 1) {
        alert('Doctor must be assigned to at least one hospital.');
        return;
      }
      setAssignedHospitalIds(assignedHospitalIds.filter((id) => id !== hId));
    } else {
      setAssignedHospitalIds([...assignedHospitalIds, hId]);
    }
  };

  const selectAllHospitals = () => {
    if (Array.isArray(hospitals) && assignedHospitalIds.length === hospitals.length) {
      if (hospitals.length > 0) setAssignedHospitalIds([hospitals[0].id]);
    } else if (Array.isArray(hospitals)) {
      setAssignedHospitalIds(hospitals.map((h) => h.id));
    }
  };

  const toggleDaySelection = (dayVal: number) => {
    if (selectedDays.includes(dayVal)) {
      if (selectedDays.length === 1) {
        alert('Please select at least one available day for consultation.');
        return;
      }
      setSelectedDays(selectedDays.filter((d) => d !== dayVal));
    } else {
      setSelectedDays([...selectedDays, dayVal]);
    }
  };

  const setPresetDays = (preset: 'EVERYDAY' | 'WEEKDAYS' | 'WEEKEND') => {
    if (preset === 'EVERYDAY') setSelectedDays([6, 0, 1, 2, 3, 4, 5]);
    if (preset === 'WEEKDAYS') setSelectedDays([6, 0, 1, 2, 3, 4]); // Sat to Thu
    if (preset === 'WEEKEND') setSelectedDays([5, 6]); // Fri, Sat
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assignedHospitalIds,
        availableDays: selectedDays,
      };

      const url = editingDoctor ? `/api/admin/doctors/${editingDoctor.id}` : '/api/admin/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setEditingDoctor(null);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save doctor.');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDelete = async () => {
    if (!deletingDoctor) return;
    try {
      const res = await fetch(`/api/admin/doctors/${deletingDoctor.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingDoctor(null);
        fetchData();
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  const resetForm = () => {
    const firstHId = Array.isArray(hospitals) && hospitals.length > 0 ? hospitals[0].id : '';
    setFormData({
      name: '',
      photoUrl: '',
      degrees: '',
      specialization: '',
      bmdcNumber: '',
      experienceYears: 5,
      bio: '',
      consultationFee: 800,
      chamberRoom: 'Chamber 101',
      phone: '',
      hospitalId: firstHId,
      departmentId: '',
      status: 'ACTIVE',
    });
    setAssignedHospitalIds(firstHId ? [firstHId] : []);
    setSelectedDays([6, 0, 1, 2, 3, 4]);
    if (firstHId) {
      fetchDepartments(firstHId);
    }
  };

  const openEdit = (doc: any) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      photoUrl: doc.photoUrl || '',
      degrees: doc.degrees,
      specialization: doc.specialization,
      bmdcNumber: doc.bmdcNumber,
      experienceYears: doc.experienceYears,
      bio: doc.bio || '',
      consultationFee: doc.consultationFee,
      chamberRoom: doc.chamberRoom,
      phone: doc.phone || '',
      hospitalId: doc.hospitalId,
      departmentId: doc.departmentId,
      status: doc.status,
    });
    setAssignedHospitalIds([doc.hospitalId]);
    if (doc.schedules && doc.schedules.length > 0) {
      setSelectedDays(doc.schedules.map((s: any) => s.dayOfWeek));
    } else {
      setSelectedDays([6, 0, 1, 2, 3, 4]);
    }
    fetchDepartments(doc.hospitalId);
    setIsAddModalOpen(true);
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!doc) return false;
    const nameStr = (doc.name || '').toLowerCase();
    const specStr = (doc.specialization || '').toLowerCase();
    const bmdcStr = (doc.bmdcNumber || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch = nameStr.includes(query) || specStr.includes(query) || bmdcStr.includes(query);
    const matchesHospital = hospitalFilter === 'ALL' || doc.hospitalId === hospitalFilter;
    return matchesSearch && matchesHospital;
  });

  const defaultPhoto = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight">Doctors Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold">
            Add doctors, select available days of the week, and assign to single or multiple Chuadanga hospitals.
          </p>
        </div>

        <Link
          href="/admin/doctors/new"
          className="btn-nuvica-primary text-xs !py-3 !px-5 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-nuvicaMint-400" />
          Add New Doctor
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, BMDC reg number, or specialization..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-nuvicaNavy-800 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500">Filter Hospital:</span>
          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500 font-semibold">
          Loading Doctors Data...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-sm">
          No doctors found. Click "Add New Doctor" to add specialists to Chittagong hospitals.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const daysList = doc.schedules && doc.schedules.length > 0
              ? doc.schedules.map((s: any) => WEEK_DAYS.find(w => w.value === s.dayOfWeek)?.short).filter(Boolean).join(', ')
              : 'Sat, Sun, Mon, Tue, Wed, Thu';

            return (
              <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photoUrl || defaultPhoto}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0 bg-slate-100"
                    />
                    <div>
                      <span className="badge-mint text-[10px] py-0.5 px-2 font-bold">{doc.specialization}</span>
                      <h3 className="font-black text-base text-nuvicaNavy-900 leading-snug mt-1">{doc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{doc.degrees}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-bold text-slate-800">{doc.hospital?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Available: <strong className="text-sky-700">{daysList}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>Fee: <strong className="text-sky-700">৳{doc.consultationFee} BDT</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    doc.status === 'ACTIVE' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/doctors/${doc.id}/edit`}
                      className="btn-nuvica-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile & Days
                    </Link>
                    <button
                      onClick={() => setDeletingDoctor(doc)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200"
                      title="Delete Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT DOCTOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in-overlay">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-white my-8 max-h-[90vh] overflow-y-auto animate-modal-pop">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-nuvicaNavy-900">
                  {editingDoctor ? `Edit Doctor — ${editingDoctor.name}` : 'Add New Doctor'}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Chittagong District Doctor & Schedule Assignment</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. EXECUTIVE DOCTOR CONSULTATION DAYS & SCHEDULE SETUP */}
              <div className="bg-gradient-to-br from-nuvicaNavy-950 to-nuvicaNavy-900 text-white p-6 rounded-3xl shadow-lg border border-nuvicaNavy-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nuvicaNavy-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      1. Chamber Practice Days
                    </div>
                    <h3 className="text-base font-black text-white">Weekly Availability Schedule</h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Configure active consultation days of the week for patient booking.
                    </p>
                  </div>

                  {/* Quick Presets Switcher */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-nuvicaNavy-900/90 p-1.5 rounded-2xl border border-nuvicaNavy-700">
                    <button
                      type="button"
                      onClick={() => setPresetDays('EVERYDAY')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                        selectedDays.length === 7
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-nuvicaNavy-800'
                      }`}
                    >
                      All 7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDays('WEEKDAYS')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                        selectedDays.length === 6 && !selectedDays.includes(5)
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-nuvicaNavy-800'
                      }`}
                    >
                      Sat – Thu (6 Days)
                    </button>
                  </div>
                </div>

                {/* 7 Days Interactive Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {WEEK_DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDaySelection(day.value)}
                        className={`py-3.5 px-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-white text-nuvicaNavy-950 border-white shadow-lg ring-2 ring-sky-400 scale-[1.02]'
                            : 'bg-nuvicaNavy-900/60 text-slate-400 border-nuvicaNavy-800 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[11px] font-extrabold uppercase tracking-wide">{day.label}</span>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                            Available
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5">
                            Closed
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Executive Summary Bar */}
                <div className="bg-nuvicaNavy-900/90 border border-nuvicaNavy-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>
                      Selected Schedule: <strong className="text-white">{selectedDays.length} Active Chamber Days</strong> per week
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-300 font-bold bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                    {selectedDays.map(d => WEEK_DAYS.find(w => w.value === d)?.short).join(' • ')}
                  </span>
                </div>
              </div>

              {/* 2. MULTI-HOSPITAL ASSIGNMENT SECTION */}
              <div className="bg-sky-50/70 p-5 rounded-3xl border border-sky-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-sky-600" />
                    2. Assign Doctor to Hospital(s)
                  </h3>

                  {!editingDoctor && (
                    <button
                      type="button"
                      onClick={selectAllHospitals}
                      className="text-[11px] font-black text-sky-700 hover:underline flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-sky-200 shadow-2xs"
                    >
                      {assignedHospitalIds.length === hospitals.length ? 'Deselect All' : '✓ Select All Hospitals'}
                    </button>
                  )}
                </div>

                {!editingDoctor ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto pr-1">
                      {hospitals.map((h) => {
                        const isAssigned = assignedHospitalIds.includes(h.id);
                        return (
                          <div
                            key={h.id}
                            onClick={() => toggleHospitalAssignment(h.id)}
                            className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isAssigned
                                ? 'bg-white border-sky-500 shadow-sm ring-1 ring-sky-400'
                                : 'bg-white/60 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {isAssigned ? (
                                <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div>
                                <div className="font-extrabold text-xs text-nuvicaNavy-900">{h.name}</div>
                                <span className="text-[10px] text-slate-500 font-medium">{h.hospitalType}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Assigned Hospital</label>
                    <select
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-nuvicaNavy-800"
                    >
                      {hospitals.map((h) => (
                        <option key={h.id} value={h.id}>{h.name} ({h.hospitalType})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 3. DOCTOR PERSONAL & PROFESSIONAL DETAILS */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-sky-600" />
                  3. Doctor Professional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Dr. Mahfuzur Rahman"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g. Cardiologist & Heart Specialist"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Degrees & Qualifications *</label>
                    <input
                      type="text"
                      name="degrees"
                      required
                      value={formData.degrees}
                      onChange={handleInputChange}
                      placeholder="e.g. MBBS, FCPS (Cardiology), MD"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">BMDC Registration Number *</label>
                    <input
                      type="text"
                      name="bmdcNumber"
                      required
                      value={formData.bmdcNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. BMDC-A-98741"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chamber Room / Floor</label>
                    <input
                      type="text"
                      name="chamberRoom"
                      value={formData.chamberRoom}
                      onChange={handleInputChange}
                      placeholder="e.g. Room 402, 4th Floor"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Phone / Serial Contact</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1800-000000"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>
                </div>
              </div>

              {/* 4. DOCTOR PHOTO & BIO */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-600" />
                  4. Doctor Photo & Biography
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Photo URL</label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleInputChange}
                      placeholder="Paste photo URL e.g. https://images.unsplash.com/..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Bio / Overview</label>
                    <textarea
                      name="bio"
                      rows={2}
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Senior Specialist with extensive clinical experience..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-nuvicaNavy-800"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-nuvica-primary text-xs !py-3 px-6 shadow-md">
                  {editingDoctor ? 'Update Doctor Profile' : `Save & Assign Doctor (${assignedHospitalIds.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-white">
            <h3 className="text-lg font-black text-slate-900">Delete Doctor Record?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong>{deletingDoctor.name}</strong> from <strong>{deletingDoctor.hospital?.name}</strong>?
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={() => setDeletingDoctor(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              >
                Delete Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
