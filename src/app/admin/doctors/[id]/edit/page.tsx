'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Stethoscope,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Building2,
  Award,
  Calendar,
  FileText,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import DoctorCardItem from '@/components/DoctorCardItem';

const WEEK_DAYS = [
  { id: 6, short: 'Sat', bn: 'শনি' },
  { id: 0, short: 'Sun', bn: 'রবি' },
  { id: 1, short: 'Mon', bn: 'সোম' },
  { id: 2, short: 'Tue', bn: 'মঙ্গ' },
  { id: 3, short: 'Wed', bn: 'বুধ' },
  { id: 4, short: 'Thu', bn: 'বৃহ' },
  { id: 5, short: 'Fri', bn: 'শুক্র' },
];

const ADMIN_FILTER_CATEGORIES = [
  { id: 'medicine', labelBn: 'মেডিসিন ও ডায়াবেটিস', enKey: 'Medicine & Diabetes' },
  { id: 'cardiology', labelBn: 'হৃদরোগ (কার্ডিওলজি)', enKey: 'Cardiology' },
  { id: 'gynecology', labelBn: 'স্ত্রী ও প্রসূতি রোগ', enKey: 'Gynecology & Obstetrics' },
  { id: 'pediatrics', labelBn: 'শিশু রোগ ও নবজাতক', enKey: 'Pediatrics & Child Health' },
  { id: 'orthopedics', labelBn: 'অর্থোপেডিক্স ও হাড়জোড়', enKey: 'Orthopedics & Spine' },
  { id: 'neurology', labelBn: 'নিউরোমেডিসিন ও ব্রেইন', enKey: 'Neurology & Brain' },
  { id: 'dermatology', labelBn: 'চর্ম, এলার্জি ও যৌন', enKey: 'Dermatology & Skin' },
  { id: 'eye', labelBn: 'চক্ষু রোগ (Eye)', enKey: 'Ophthalmology & Eye' },
  { id: 'ent', labelBn: 'নাক, কান ও গলা (ENT)', enKey: 'ENT & Head Neck' },
  { id: 'surgery', labelBn: 'জেনারেল ও ল্যাপারোস্কোপিক সার্জারি', enKey: 'General & Laparoscopic Surgery' },
  { id: 'gastroenterology', labelBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার', enKey: 'Gastroenterology & Liver' },
  { id: 'chest', labelBn: 'বক্ষব্যাধি ও অ্যাজমা', enKey: 'Pulmonology & Chest' },
  { id: 'urology', labelBn: 'ইউরোলজি ও কিডনি সার্জারি', enKey: 'Urology & Kidney' },
  { id: 'dental', labelBn: 'ডেন্টাল ও মুখরোগ', enKey: 'Dental Surgery' },
];

function EditDoctorForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnHospitalId = searchParams.get('returnHospitalId');
  const doctorId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreviewAccordion, setShowPreviewAccordion] = useState(true);

  const [hospitals, setHospitals] = useState<any[]>([]);

  const [formData, setFormData] = useState({
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
    treatedDiseases: '',
    hospitalId: '',
    status: 'ACTIVE',
    availableDays: [6, 0, 1, 2, 3, 4],
  });

  const handleToggleSpecialtyCategory = (cat: typeof ADMIN_FILTER_CATEGORIES[0]) => {
    const current = formData.specialization.trim();
    if (!current) {
      setFormData((prev) => ({ ...prev, specialization: cat.labelBn }));
    } else if (current.includes(cat.labelBn) || current.includes(cat.enKey)) {
      const updated = current
        .replace(cat.labelBn, '')
        .replace(cat.enKey, '')
        .replace(/^,\s*|,\s*$/g, '')
        .replace(/,\s*,/g, ',');
      setFormData((prev) => ({ ...prev, specialization: updated.trim() }));
    } else {
      setFormData((prev) => ({ ...prev, specialization: `${current}, ${cat.labelBn}` }));
    }
  };

  const [doctorDetails, setDoctorDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docRes, hospRes] = await Promise.all([
          fetch(`/api/admin/doctors/${doctorId}`),
          fetch('/api/admin/hospitals'),
        ]);

        const docData = await docRes.json();
        const hospData = await hospRes.json();

        if (!docRes.ok || !docData.doctor) {
          throw new Error(docData.error || 'Doctor profile not found');
        }

        if (hospData.hospitals) {
          setHospitals(hospData.hospitals);
        }

        const doc = docData.doctor;
        setDoctorDetails(doc);

        const currentDays = doc.schedules && doc.schedules.length > 0
          ? doc.schedules.map((s: any) => Number(s.dayOfWeek))
          : [6, 0, 1, 2, 3, 4];

        setFormData({
          name: doc.name || '',
          photoUrl: doc.photoUrl || '',
          degrees: doc.degrees || '',
          specialization: doc.specialization || '',
          bmdcNumber: doc.bmdcNumber || '',
          experienceYears: doc.experienceYears || 5,
          consultationFee: doc.consultationFee || 700,
          chamberRoom: doc.chamberRoom || 'Room 101',
          phone: doc.phone || '',
          bio: doc.bio || '',
          treatedDiseases: doc.treatedDiseases || 'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা, দীর্ঘমেয়াদী রোগ ও পরামর্শ, বিশেষজ্ঞ স্বাস্থ্য পরামর্শ, জরুরি কেয়ার ও পুনর্বাসন',
          hospitalId: doc.hospitalId || '',
          status: doc.status || 'ACTIVE',
          availableDays: currentDays,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addPresetDisease = (disease: string) => {
    const current = formData.treatedDiseases
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!current.includes(disease)) {
      const updated = [...current, disease].join(', ');
      setFormData({ ...formData, treatedDiseases: updated });
    }
  };

  const toggleDay = (dayId: number) => {
    const current = [...formData.availableDays];
    if (current.includes(dayId)) {
      setFormData({
        ...formData,
        availableDays: current.filter((d) => d !== dayId),
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...current, dayId],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update doctor profile');
      }

      setSuccess('Doctor profile updated successfully!');
      setTimeout(() => {
        if (returnHospitalId) {
          router.push(`/admin/hospitals/${returnHospitalId}/edit`);
        } else if (formData.hospitalId) {
          router.push(`/admin/hospitals/${formData.hospitalId}/edit`);
        } else {
          router.push('/admin/doctors');
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Network error while saving profile');
    } finally {
      setSaving(false);
    }
  };

  const selectedHospital = hospitals.find((h) => h.id === formData.hospitalId) || doctorDetails?.hospital;
  const availableDaySet = new Set(formData.availableDays);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-9 h-9 text-sky-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading doctor profile details...</p>
      </div>
    );
  }

  const backLink = returnHospitalId 
    ? `/admin/hospitals/${returnHospitalId}/edit` 
    : formData.hospitalId 
    ? `/admin/hospitals/${formData.hospitalId}/edit` 
    : '/admin/doctors';

  const treatedDiseasesList = formData.treatedDiseases
    ? formData.treatedDiseases.split(',').map((s) => s.trim()).filter(Boolean)
    : ['উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা', 'দীর্ঘমেয়াদী রোগ ও পরামর্শ', 'বিশেষজ্ঞ স্বাস্থ্য পরামর্শ', 'জরুরি কেয়ার ও পুনর্বাসন'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-page-smooth">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-nuvicaNavy-950 via-nuvicaNavy-900 to-nuvicaNavy-950 text-white rounded-3xl p-6 sm:p-8 border border-nuvicaNavy-800 shadow-xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Link
              href={backLink}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-300 hover:text-white transition-colors group bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Hospital Edit Page
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-sky-400 shrink-0" />
              <span>Edit Doctor — {formData.name || 'Doctor Profile'}</span>
            </h1>
            <p className="text-xs text-slate-300">
              Update doctor details, BMDC registration, treated diseases list, weekly schedule & hospital chamber assignment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={backLink}
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
              <span>{saving ? 'Saving...' : 'Save Doctor Profile'}</span>
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

      {/* Main Full-Width Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Doctor Photo & Media Studio */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Profile Photo</span>
              <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-600" />
                1. Doctor Media & Photo Upload
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Square Photo (1:1 Ratio)
            </span>
          </div>

          <div className="bg-sky-50/60 p-6 rounded-3xl border border-sky-100 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={formData.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
              alt={formData.name || 'Doctor'}
              className="w-32 h-32 rounded-2xl object-cover object-top border-4 border-white shadow-lg shrink-0 bg-white"
            />

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <h4 className="font-extrabold text-sm text-nuvicaNavy-900">{formData.name || 'Dr. Doctor Name'}</h4>
                <p className="text-xs text-slate-500 font-medium">Clear portrait image with medical apron recommended.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 active:scale-95">
                  <Upload className="w-4 h-4" /> Upload New Photo File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: '' })}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-all"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Qualifications & Specialization */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Professional Credentials</span>
              <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-600" />
                2. Qualifications & Specialization
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Doctor Full Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Dr. Md. Rafiqul Islam"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Degrees & Medical Qualifications *</label>
              <input
                type="text"
                required
                name="degrees"
                value={formData.degrees}
                onChange={handleInputChange}
                placeholder="e.g. MBBS, FCPS (Medicine), MD (Cardiology)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Specialization / Department *</label>
              <input
                type="text"
                required
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g. Medicine Specialist & Cardiologist"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">BMDC Registration Reg *</label>
              <input
                type="text"
                required
                name="bmdcNumber"
                value={formData.bmdcNumber}
                onChange={handleInputChange}
                placeholder="e.g. A-65412"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            {/* Specialty Filter Category Multi-Selector */}
            <div className="sm:col-span-2 space-y-2 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-xs font-black text-nuvicaNavy-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  ডাক্তার সার্চ ফিল্টার ক্যাটাগরি যুক্ত করুন (Specialty Filter Categories):
                </label>
                <span className="text-[11px] text-slate-500 font-medium">ক্লিক করে ১ বা একাধিক ক্যাটাগরি সেট করুন</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {ADMIN_FILTER_CATEGORIES.map((cat) => {
                  const isSelected = formData.specialization.includes(cat.labelBn) || 
                                     formData.specialization.toLowerCase().includes(cat.enKey.toLowerCase()) ||
                                     formData.specialization.toLowerCase().includes(cat.id.toLowerCase());
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleSpecialtyCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/25 scale-[1.02]'
                          : 'bg-slate-50 hover:bg-sky-50/80 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                      <span>{cat.labelBn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Hospital Assignment & Fees */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Chamber Details</span>
              <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                3. Hospital Chamber Assignment & Fees
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Assigned Hospital Chamber *</label>
              <select
                name="hospitalId"
                required
                value={formData.hospitalId}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 cursor-pointer"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    🏥 {h.name} — {h.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Chamber Room No. *</label>
              <input
                type="text"
                required
                name="chamberRoom"
                value={formData.chamberRoom}
                onChange={handleInputChange}
                placeholder="e.g. Room 102 (2nd Floor)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Serial Booking Hotline Phone *</label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +880 1711-000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Weekly Chamber Schedule */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Weekly Schedule</span>
              <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                4. Chamber Days (চেম্বারের দিনসমূহ)
              </h3>
            </div>
            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              {formData.availableDays.length} Days Selected
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-600 font-medium">
              Select available chamber days for public schedule cards:
            </p>

            <div className="grid grid-cols-7 gap-2 text-center">
              {WEEK_DAYS.map((day) => {
                const isSelected = formData.availableDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-400/40'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 line-through opacity-60'
                    }`}
                  >
                    {day.bn} ({day.short})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5: Doctor Biography & Treated Diseases List */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Public Overview</span>
              <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                5. Doctor Biography & Treated Diseases (ডাক্তারের বিবরণ ও চিকিৎসাসমূহ)
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Doctor Bio Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-600" /> 👤 ডাক্তারের বিবরণ (Doctor Profile Bio Overview)
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Dr. Mahbubur Rahman Chowdhury is a senior interventional cardiologist with over 18 years of specialized experience..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              ></textarea>
            </div>

            {/* 2. Treated Diseases Input & Presets */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-sky-600" /> 🩺 যেসব রোগের চিকিৎসাসেবা প্রদান করেন (Comma Separated List)
              </label>
              <input
                type="text"
                name="treatedDiseases"
                value={formData.treatedDiseases}
                onChange={handleInputChange}
                placeholder="উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা, দীর্ঘমেয়াদী রোগ ও পরামর্শ, বিশেষজ্ঞ স্বাস্থ্য পরামর্শ, জরুরি কেয়ার ও পুনর্বাসন"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />

              {/* Quick Preset Buttons for Common Treated Diseases */}
              <div className="space-y-2 bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
                <span className="text-[11px] font-extrabold text-sky-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Quick Add Common Treatment Specialties:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা',
                    'দীর্ঘমেয়াদী রোগ ও পরামর্শ',
                    'বিশেষজ্ঞ স্বাস্থ্য পরামর্শ',
                    'জরুরি কেয়ার ও পুনর্বাসন',
                    'হৃদযন্ত্রের বিশেষ এনজিওপ্লাস্টি',
                    'ডায়াবেটিস ও হরমোন পরামর্শ',
                    'বুকের ব্যথা ও এনজাইনা চিকিৎসা',
                    'নিউরো ও স্ট্রোক পুনর্বাসন'
                  ].map((disease) => (
                    <button
                      key={disease}
                      type="button"
                      onClick={() => addPresetDisease(disease)}
                      className="text-[11px] font-bold bg-white hover:bg-sky-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-sky-600 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      + {disease}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Doctor Profile Card Standard Rule Verification */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" /> Standard Doctor Profile Card Live Preview
            </h4>
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              ● Live Dynamic Preview
            </span>
          </div>

          <div className="max-w-md mx-auto">
            <DoctorCardItem
              doc={{
                id: doctorId || 'preview-doc',
                name: formData.name || 'ডা. ডাক্তারের নাম',
                degrees: formData.degrees || 'MBBS, FCPS (Medicine)',
                specialization: formData.specialization || 'মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ',
                photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
                phone: formData.phone || selectedHospital?.phone || '01700000000',
                bio: formData.bio || `${formData.name || 'ডাক্তার'} একজন অভিজ্ঞ ও সুনামধন্য চিকিৎসক। তিনি দীর্ঘকাল ধরে অত্যন্ত দক্ষতার সাথে আধুনিক ও মানসম্মত চিকিৎসাসেবা প্রদান করে আসছেন।`,
                treatedDiseases: formData.treatedDiseases || 'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা, দীর্ঘমেয়াদী রোগ ও পরামর্শ, বিশেষজ্ঞ স্বাস্থ্য পরামর্শ, জরুরি কেয়ার ও পুনর্বাসন',
                hospital: {
                  name: selectedHospital?.name || 'চুয়াডাঙ্গা সদর হাসপাতাল',
                  slug: selectedHospital?.slug || 'chuadanga-sadar-hospital',
                  phone: selectedHospital?.phone,
                },
                schedules: (formData.availableDays && formData.availableDays.length > 0 ? formData.availableDays : [6, 0, 1, 2, 3, 4]).map((d) => ({
                  dayOfWeek: d,
                  startTime: '04:00 PM',
                  endTime: '09:00 PM',
                })),
              }}
            />
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-semibold">
            Ready to update doctor profile for <strong className="text-nuvicaNavy-900">{formData.name || 'Doctor Profile'}</strong>?
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={backLink}
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
              <span>{saving ? 'Saving...' : 'Save Doctor Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EditDoctorPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12 text-slate-500 font-bold text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-sky-600" /> Loading doctor editor...
      </div>
    }>
      <EditDoctorForm params={params} />
    </Suspense>
  );
}

