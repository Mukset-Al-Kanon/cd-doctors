'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Mail, Phone, Lock, Award, Stethoscope, MapPin, DollarSign, Image, Sparkles } from 'lucide-react';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    degrees: 'MBBS, BCS (Health)',
    specialization: 'Medicine & Diabetes Specialist',
    bmdcNumber: '',
    experienceYears: 5,
    consultationFee: 500,
    chamberRoom: 'Room 202',
    chamberAddress: 'Private Chamber, Hospital Road, Chuadanga',
    treatedDiseases: 'Hypertension, Diabetes, Gastric & General Health Consultations',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'photoUrl' && value) {
      setPhotoPreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/doctor/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] via-[#f7f5fb] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Background Soft Glow Orbs */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Header Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md">
              ✚
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CD Doctors <span className="text-purple-600 font-bold">Portal</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Doctor Onboarding
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mx-auto">
            Create your profile, unlock automated AI consultation banners, and schedule Meta ad campaigns.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[36px] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-white space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Account Info */}
            <div className="space-y-3">
              <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block">
                1. Account Credentials
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Dr. Sabrina Rahman"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="doctor@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number (Direct Calls) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01718-XXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Portal Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Professional Credentials */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block">
                2. Professional Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Degrees & Titles *</label>
                  <input
                    type="text"
                    name="degrees"
                    required
                    placeholder="e.g. MBBS, BCS (Health), FCPS"
                    value={form.degrees}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    required
                    placeholder="e.g. Gynecology & Obstetrics Specialist"
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">BMDC Registration No.</label>
                  <input
                    type="text"
                    name="bmdcNumber"
                    placeholder="e.g. A-84920"
                    value={form.bmdcNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 3. Chamber & Fees */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block">
                3. Chamber Details & Visiting Hours
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Consultation Fee (BDT)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={form.consultationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Room / Floor</label>
                  <input
                    type="text"
                    name="chamberRoom"
                    placeholder="e.g. Room 204, 2nd Floor"
                    value={form.chamberRoom}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Chamber Address / Hospital Location</label>
                  <input
                    type="text"
                    name="chamberAddress"
                    required
                    placeholder="e.g. Sono Diagnostic Tower, Hospital Road, Chuadanga"
                    value={form.chamberAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Portrait Photo URL</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Doctor portrait"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <input
                      type="url"
                      name="photoUrl"
                      placeholder="https://..."
                      value={form.photoUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-full bg-slate-900 hover:bg-purple-600 text-white text-xs sm:text-sm font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Doctor Profile...' : 'Complete Registration & Open Dashboard ➜'}
            </button>

          </form>

          <div className="text-center pt-2">
            <Link
              href="/doctor/login"
              className="text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
            >
              Already registered? <span className="text-purple-600 font-extrabold underline">Login here</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
