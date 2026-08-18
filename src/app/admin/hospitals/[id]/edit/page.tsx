'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  Camera, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  PhoneCall, 
  Phone,
  Mail,
  Globe,
  FileText, 
  CheckCircle2, 
  Star, 
  Check,
  Loader2,
  AlertCircle,
  MapPin,
  Sparkles,
  Stethoscope,
  Plus,
  Edit3,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  UserPlus,
  Award,
  Hash,
  ExternalLink,
  UserCheck
} from 'lucide-react';

const WEEK_DAYS = [
  { id: 6, short: 'Sat', bn: 'শনি' },
  { id: 0, short: 'Sun', bn: 'রবি' },
  { id: 1, short: 'Mon', bn: 'সোম' },
  { id: 2, short: 'Tue', bn: 'মঙ্গ' },
  { id: 3, short: 'Wed', bn: 'বুধ' },
  { id: 4, short: 'Thu', bn: 'বৃহ' },
  { id: 5, short: 'Fri', bn: 'শুক্র' },
];

export default function EditHospitalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const hospitalId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('branding');

  // Hospital Form Data
  const [formData, setFormData] = useState({
    name: '',
    hospitalType: 'Private Hospital',
    address: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    website: '',
    googleMapUrl: '',
    licenseNumber: '',
    description: '',
    status: 'ACTIVE',
    isFeatured: false,
    facilitiesText: '',
    logoUrl: '',
    coverUrl: '',
  });

  // Hospital Doctors list & Expand states
  const [doctors, setDoctors] = useState<any[]>([]);
  const [expandedDoctorIds, setExpandedDoctorIds] = useState<Record<string, boolean>>({});

  // Doctor Modal State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [doctorError, setDoctorError] = useState<string | null>(null);

  // Doctor Form State
  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    photoUrl: '',
    degrees: '',
    specialization: '',
    bmdcNumber: '',
    experienceYears: 5,
    consultationFee: 700,
    chamberRoom: 'Room 101',
    phone: '',
    bio: '',
    status: 'ACTIVE',
    availableDays: [6, 0, 1, 2, 3, 4], // Sat - Thu by default
  });

  const fetchHospitalDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hospitals/${hospitalId}`);
      const data = await res.json();

      if (!res.ok || !data.hospital) {
        throw new Error(data.error || 'Hospital not found');
      }

      const h = data.hospital;
      setFormData({
        name: h.name || '',
        hospitalType: h.hospitalType || 'Private Hospital',
        address: h.address || '',
        phone: h.phone || '',
        emergencyPhone: h.emergencyPhone || '',
        email: h.email || '',
        website: h.website || '',
        googleMapUrl: h.googleMapUrl || '',
        licenseNumber: h.licenseNumber || '',
        description: h.description || '',
        status: h.status || 'ACTIVE',
        isFeatured: Boolean(h.isFeatured),
        facilitiesText: h.facilities ? h.facilities.map((f: any) => f.facilityName).join(', ') : '',
        logoUrl: h.logoUrl || '',
        coverUrl: h.coverUrl || '',
      });

      if (h.doctors) {
        setDoctors(h.doctors);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalDetails();
  }, [hospitalId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addPresetFacility = (facilityName: string) => {
    const current = formData.facilitiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!current.includes(facilityName)) {
      const updated = [...current, facilityName].join(', ');
      setFormData({ ...formData, facilitiesText: updated });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/hospitals/${hospitalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save hospital details');
      }

      setSuccess('Hospital profile saved successfully! Redirecting back to hospital list...');
      setTimeout(() => {
        router.push('/admin/hospitals');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const toggleDoctorAccordion = (docId: string) => {
    setExpandedDoctorIds((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  // Open Doctor Modal for Create or Edit
  const openDoctorModal = (doc?: any) => {
    setDoctorError(null);
    if (doc) {
      setEditingDoctor(doc);
      // Parse available days from doc schedules
      const currentDays = doc.schedules && doc.schedules.length > 0
        ? doc.schedules.map((s: any) => Number(s.dayOfWeek))
        : [6, 0, 1, 2, 3, 4];

      setDoctorFormData({
        name: doc.name || '',
        photoUrl: doc.photoUrl || '',
        degrees: doc.degrees || '',
        specialization: doc.specialization || '',
        bmdcNumber: doc.bmdcNumber || '',
        experienceYears: doc.experienceYears || 5,
        consultationFee: doc.consultationFee || 700,
        chamberRoom: doc.chamberRoom || 'Room 101',
        phone: doc.phone || formData.phone || '',
        bio: doc.bio || '',
        status: doc.status || 'ACTIVE',
        availableDays: currentDays,
      });
    } else {
      setEditingDoctor(null);
      setDoctorFormData({
        name: '',
        photoUrl: '',
        degrees: '',
        specialization: '',
        bmdcNumber: '',
        experienceYears: 5,
        consultationFee: 700,
        chamberRoom: 'Room 101',
        phone: formData.phone || '',
        bio: '',
        status: 'ACTIVE',
        availableDays: [6, 0, 1, 2, 3, 4],
      });
    }
    setIsDoctorModalOpen(true);
  };

  const handleDoctorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setDoctorFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleDoctorDay = (dayId: number) => {
    const current = [...doctorFormData.availableDays];
    if (current.includes(dayId)) {
      setDoctorFormData({
        ...doctorFormData,
        availableDays: current.filter((d) => d !== dayId),
      });
    } else {
      setDoctorFormData({
        ...doctorFormData,
        availableDays: [...current, dayId],
      });
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDoctor(true);
    setDoctorError(null);

    try {
      const payload = {
        ...doctorFormData,
        hospitalId: hospitalId,
      };

      const url = editingDoctor ? `/api/admin/doctors/${editingDoctor.id}` : '/api/admin/doctors';
      const method = editingDoctor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save doctor profile');
      }

      setIsDoctorModalOpen(false);
      setSuccess(editingDoctor ? 'Doctor profile updated successfully!' : 'New doctor added successfully!');
      fetchHospitalDetails();
    } catch (err: any) {
      setDoctorError(err.message || 'Error saving doctor profile');
    } finally {
      setSavingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to remove Dr. ${docName} from this hospital?`)) return;

    try {
      const res = await fetch(`/api/admin/doctors/${docId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete doctor');
      }
      setSuccess(`Dr. ${docName} removed successfully.`);
      fetchHospitalDetails();
    } catch (err: any) {
      setError(err.message || 'Failed to delete doctor');
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-9 h-9 text-sky-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading hospital details & doctor profiles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-page-smooth">
      {/* Top Executive Header Banner */}
      <div className="bg-gradient-to-r from-nuvicaNavy-950 via-nuvicaNavy-900 to-nuvicaNavy-950 text-white rounded-3xl p-6 sm:p-8 border border-nuvicaNavy-800 shadow-xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Link
              href="/admin/hospitals"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-300 hover:text-white transition-colors group bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Hospitals List
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Building2 className="w-8 h-8 text-sky-400 shrink-0" />
              <span>Edit Hospital — {formData.name || 'Hospital Profile'}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-md font-bold border border-sky-500/30">
                <MapPin className="w-3 h-3" /> Chuadanga District Scope
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 text-white px-2.5 py-0.5 rounded-md font-semibold">
                ID: {hospitalId}
              </span>
              <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-md font-bold">
                <Stethoscope className="w-3 h-3 text-sky-400" /> {doctors.length} Doctors
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/hospitals"
              className="px-5 py-3 rounded-full text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-7 py-3 rounded-full text-xs font-black text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/40 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Hospital Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

            {/* SECTION 1: Visual Branding Studio */}
            <div id="section-branding" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Visual Identity</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-sky-600" />
                    1. Hospital Branding & Media Studio
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Logo & Cover Banner
                </span>
              </div>

              {/* Combined Header Cover Banner & Logo Interactive Preview Bar */}
              <div className="relative rounded-3xl border-2 border-slate-200 bg-slate-900 overflow-hidden shadow-md">
                {/* Banner Preview Background */}
                <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-900">
                  {formData.coverUrl ? (
                    <img src={formData.coverUrl} alt="Cover Banner" className="w-full h-full object-cover opacity-85" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                      <span className="text-xs font-bold">No Cover Banner Set</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Overlay Upload Cover Button */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {formData.coverUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, coverUrl: '' })}
                        className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-xs flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Cover
                      </button>
                    )}
                    <label className="cursor-pointer bg-white/90 hover:bg-white text-nuvicaNavy-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md backdrop-blur-xs transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95">
                      <Upload className="w-3.5 h-3.5 text-sky-600" /> Change Cover Banner
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'coverUrl')}
                      />
                    </label>
                  </div>
                </div>

                {/* Logo & Banner Bottom Overlay */}
                <div className="bg-white p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-slate-100 relative">
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white bg-white shadow-xl shrink-0 overflow-hidden -mt-10 relative z-10 flex items-center justify-center">
                      {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-base text-nuvicaNavy-900">{formData.name || 'Hospital Name'}</h4>
                      <p className="text-xs text-slate-500 font-medium">Public Header Branding & Logo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: '' })}
                        className="text-rose-600 hover:text-rose-700 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Logo
                      </button>
                    )}
                    <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-sky-500 shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95">
                      <Upload className="w-3.5 h-3.5" /> Upload New Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Hospital Doctors & Medical Specialists */}
            <div id="section-doctors" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Medical Staff</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-600" />
                    2. Hospital Doctors & Medical Specialists ({doctors.length})
                  </h3>
                </div>

                <Link
                  href={`/admin/doctors/new?hospitalId=${hospitalId}`}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add Doctor to Hospital
                </Link>
              </div>

              {doctors.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
                  <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No doctors currently registered under this hospital.</p>
                  <Link
                    href={`/admin/doctors/new?hospitalId=${hospitalId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-600 hover:underline cursor-pointer"
                  >
                    + Click here to add the first doctor profile
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doc) => {
                    const isExpanded = expandedDoctorIds[doc.id] || false;

                    // Compute set of available day numbers for this doctor
                    const availableDayNumbers = new Set(
                      doc.schedules && doc.schedules.length > 0
                        ? doc.schedules.map((s: any) => Number(s.dayOfWeek))
                        : [6, 0, 1, 2, 3, 4]
                    );

                    return (
                      <div key={doc.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between relative group">
                        
                        <div className="space-y-4">
                          {/* 1. Header Profile Area */}
                          <div className="flex items-start gap-4">
                            <img
                              src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                              alt={doc.name}
                              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-2 border-white shadow-md shrink-0 group-hover:scale-[1.02] transition-transform duration-300"
                            />
                            <div className="space-y-1 min-w-0 flex-1">
                              <span className="bg-sky-50 text-sky-700 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg border border-sky-100/90 inline-block max-w-full truncate">
                                {doc.department?.nameEn || doc.specialization || 'General Medicine'}
                              </span>
                              <h3 className="font-black text-base sm:text-lg text-nuvicaNavy-900 leading-snug truncate">{doc.name}</h3>
                              <p className="text-xs text-slate-500 font-medium line-clamp-1">{doc.degrees}</p>
                              <p className="text-xs font-extrabold text-sky-700 line-clamp-1">{doc.specialization}</p>
                              {doc.bmdcNumber && (
                                <p className="text-[10px] text-slate-400 font-semibold pt-0.5">BMDC Reg: {doc.bmdcNumber}</p>
                              )}
                            </div>
                          </div>

                          {/* 2. Chamber & Schedule Box */}
                          <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs text-slate-700 shadow-2xs">
                            <p className="flex items-center gap-2 font-black text-nuvicaNavy-900 text-xs">
                              🏢 <span className="truncate">{formData.name || 'Hospital Name'}</span>
                            </p>

                            {/* Weekly Schedule Row */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5 shadow-2xs">
                              <span className="text-[11px] font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-1.5 whitespace-nowrap">
                                📅 চেম্বারের দিনসমূহ:
                              </span>
                              <div className="grid grid-cols-7 gap-1 text-center pt-0.5">
                                {WEEK_DAYS.map((day) => {
                                  const isAvailable = availableDayNumbers.has(day.id);
                                  return (
                                    <span
                                      key={day.id}
                                      title={`${day.short}: ${isAvailable ? 'খোলা' : 'বন্ধ'}`}
                                      className={`text-[10px] py-1.5 rounded-xl font-extrabold transition-all block text-center ${
                                        isAvailable
                                          ? 'bg-sky-500 text-white shadow-2xs border border-sky-400 font-black'
                                          : 'bg-slate-100/80 text-slate-400 border border-slate-200/60 line-through opacity-50'
                                      }`}
                                    >
                                      {day.bn}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Fee & Experience Row */}
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-bold text-slate-700">
                              <span>ভিজিট ফি: <strong className="text-sky-700 font-black">৳{doc.consultationFee || 700} টাকা</strong></span>
                              <span>অভিজ্ঞতা: <strong className="text-nuvicaNavy-900 font-black">{doc.experienceYears || 5} বছর</strong></span>
                            </div>
                          </div>

                          {/* 3. Expandable Accordion Bar */}
                          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => toggleDoctorAccordion(doc.id)}
                              className={`w-full p-3 text-xs font-extrabold tracking-wide flex items-center justify-between transition-all cursor-pointer select-none ${
                                isExpanded
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-sky-50/80 hover:bg-sky-100 text-sky-800 border-sky-200/80'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                ⓘ  অভিজ্ঞতা ও চিকিৎসাসমূহ
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-sky-600" />}
                            </button>

                            {isExpanded && (
                              <div className="p-4 space-y-3.5 text-xs bg-white border-t border-slate-200/80">
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-nuvicaNavy-900 uppercase tracking-wide flex items-center gap-1">
                                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                                    ডাক্তারের বিবরণ:
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                                    {doc.bio || `${doc.name} ${formData.name}-এ নিয়মিত চিকিৎসাসেবা প্রদান করছেন।`}
                                  </p>
                                </div>

                                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                  <span className="text-[11px] font-bold text-nuvicaNavy-900 uppercase tracking-wide flex items-center gap-1">
                                    <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                                    যেসব রোগের চিকিৎসাসেবা প্রদান করেন:
                                  </span>
                                  <div className="space-y-1">
                                    {(doc.treatedDiseases
                                      ? doc.treatedDiseases.split(',').map((s: string) => s.trim()).filter(Boolean)
                                      : [
                                          'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা',
                                          'দীর্ঘমেয়াদী রোগ ও পরামর্শ',
                                          'বিশেষজ্ঞ স্বাস্থ্য পরামর্শ',
                                          'জরুরি কেয়ার ও পুনর্বাসন'
                                        ]
                                    ).map((item: string, idx: number) => (
                                      <div key={idx} className="flex items-center gap-1.5 p-1.5 px-2.5 bg-sky-50/70 rounded-lg border border-sky-100 text-[11px] font-bold text-slate-800 tracking-wide">
                                        <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Admin Control Actions Bar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <Link
                            href={`/admin/doctors/${doc.id}/edit?returnHospitalId=${hospitalId}`}
                            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-600/20 active:scale-95 text-center"
                          >
                            <Edit3 className="w-4 h-4 text-white" /> Edit Profile & Schedule
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteDoctor(doc.id, doc.name);
                            }}
                            className="p-2.5 text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer active:scale-95 shadow-2xs"
                            title="Remove Doctor Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 3: Basic Hospital Information */}
            <div id="section-basic" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Hospital Profile</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-600" />
                    3. Basic Hospital Information
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Hospital Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Damurhuda Digital Hospital & Diagnostic"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Hospital Category Type *</label>
                  <select
                    name="hospitalType"
                    value={formData.hospitalType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
                  >
                    <option value="Private Hospital">Private Hospital</option>
                    <option value="Super Specialty Hospital">Super Specialty Hospital</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Diagnostic Center">Diagnostic Center</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">License / Registration Number *</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. REG-CDG-2026-001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">District Scope</label>
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    Chuadanga District (Fixed Scope)
                  </div>
                </div>
              </div>

              {/* Status & Featured Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Operational Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE (Publicly Operational)</option>
                    <option value="INACTIVE">INACTIVE (Hidden from Platform)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                {/* Interactive Featured Toggle Card */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Featured Highlight</label>
                  <div
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all select-none ${
                      formData.isFeatured
                        ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-xs ring-1 ring-sky-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Star className={`w-5 h-5 ${formData.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-extrabold text-xs">Featured Hospital</div>
                        <span className="text-[10px] text-slate-500 font-medium">Show in Home Hero Slider</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      formData.isFeatured ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {formData.isFeatured && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Contact & Location Details */}
            <div id="section-contact" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Communication & Navigation</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    4. Contact & Location Details
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-100">
                  Chuadanga District
                </span>
              </div>

              <div className="space-y-6">
                {/* 1. Physical Address Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sky-600" /> Chuadanga Physical Address *
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">Full Street / Landmark Address</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Hospital Road, Chuadanga Sadar, Chuadanga"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all shadow-2xs"
                    />
                    <MapPin className="w-4 h-4 text-sky-600 absolute left-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Communication Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Primary Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-sky-600" /> Primary Telephone *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+880 761-62588"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all shadow-2xs"
                      />
                      <Phone className="w-4 h-4 text-sky-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Emergency Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-rose-600" /> 24/7 Emergency Hotline
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        placeholder="+880 1711-000000"
                        className="w-full bg-rose-50/30 border border-rose-200/80 rounded-2xl pl-10 pr-3.5 py-3 text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
                      />
                      <PhoneCall className="w-4 h-4 text-rose-600 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-sky-600" /> Official Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="info@hospital.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all shadow-2xs"
                      />
                      <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 3. Online Web & Google Maps Studio Card */}
                <div className="bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-50 p-5 rounded-2xl border border-sky-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-nuvicaNavy-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-600" /> Online Presence & Digital Navigation
                    </span>
                    <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                      Public Profile Links
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Website URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-600" /> Official Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://www.hospital.com"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 shadow-2xs"
                        />
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Google Maps Location URL */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" /> Google Maps Location URL
                        </label>
                        {formData.googleMapUrl && (
                          <a
                            href={formData.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Test Link
                          </a>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          name="googleMapUrl"
                          value={formData.googleMapUrl}
                          onChange={handleInputChange}
                          placeholder="https://maps.google.com/?q=Damurhuda+Digital+Hospital"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 shadow-2xs"
                        />
                        <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    💡 Paste your Google Maps place URL or share link so users can open turn-by-turn directions directly from the hospital public card.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Description & Facilities */}
            <div id="section-description" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Clinical Services</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" />
                    5. Description & Facilities List
                  </h3>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Hospital Profile Overview & Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Comprehensive summary of hospital care, specialty departments & facilities..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  ></textarea>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">Available Facilities & Services (Comma Separated)</label>
                  <input
                    type="text"
                    name="facilitiesText"
                    value={formData.facilitiesText}
                    onChange={handleInputChange}
                    placeholder="24/7 Emergency, ICU Support, Operation Theatre, Pharmacy, Diagnostic Laboratory"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                    <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Quick Add Common Facilities:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        '24/7 Emergency',
                        'ICU & CCU Support',
                        'Operation Theatre',
                        'Ambulance Service',
                        'Blood Bank Unit',
                        'Pharmacy',
                        'Diagnostic Laboratory',
                        'X-Ray & USG',
                        'Dialysis Unit',
                        'Patient Cabin'
                      ].map((fac) => (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => addPresetFacility(fac)}
                          className="text-[11px] font-bold bg-white hover:bg-sky-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-sky-600 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          + {fac}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Form Actions Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-semibold">
                Ready to save changes for <strong className="text-nuvicaNavy-900">{formData.name || 'Hospital Profile'}</strong>?
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/hospitals"
                  className="px-6 py-3 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Hospital Changes'}</span>
                </button>
              </div>
            </div>
          </form>
    </div>
  );
}
