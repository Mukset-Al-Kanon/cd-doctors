'use client';

import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function CreateHospitalPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('branding');

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
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create hospital record');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/hospitals');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Network error while creating hospital');
    } finally {
      setSaving(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
              <span>Add New Hospital — Chuadanga District</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-md font-bold border border-sky-500/30">
                <MapPin className="w-3 h-3" /> Chuadanga District Scope
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                ● NEW RECORD CREATION
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
              <span>{saving ? 'Creating...' : 'Create Hospital Record'}</span>
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
          Hospital record created successfully! Redirecting back to hospital list...
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
                      <Upload className="w-3.5 h-3.5 text-sky-600" /> Upload Cover Banner
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

            {/* SECTION 2: Basic Hospital Information */}
            <div id="section-basic" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Hospital Profile</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-600" />
                    2. Basic Hospital Information
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
                    placeholder="e.g. Chuadanga Sadar Hospital"
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

            {/* SECTION 3: Contact & Location Details */}
            <div id="section-contact" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Communication & Navigation</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    3. Contact & Location Details
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

            {/* SECTION 4: Description & Facilities */}
            <div id="section-description" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Clinical Services</span>
                  <h3 className="text-lg font-black text-nuvicaNavy-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-600" />
                    4. Description & Facilities List
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
                Ready to create hospital record for <strong className="text-nuvicaNavy-900">{formData.name || 'New Hospital'}</strong>?
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
                  <span>{saving ? 'Creating...' : 'Create Hospital Record'}</span>
                </button>
              </div>
            </div>
          </form>
    </div>
  );
}
