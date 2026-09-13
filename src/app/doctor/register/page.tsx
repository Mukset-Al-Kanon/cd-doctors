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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8 select-none font-bengali">
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Header Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CD Doctors <span className="text-sky-600 font-bold">পোর্টাল</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ডাক্তার অনবোর্ডিং রেজিস্ট্রেশন
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto">
            আপনার প্রোফাইল তৈরি করুন, চেম্বার শিডিউল যুক্ত করুন ও সরাসরি রোগীর সিরিয়াল গ্রহণ শুরু করুন।
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Account Info */}
            <div className="space-y-3">
              <span className="text-[11.5px] font-black text-sky-800 uppercase tracking-wider block">
                ১. একাউন্ট ও লগইন তথ্য
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">ডাক্তারের পূর্ণ নাম *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="যেমন: Dr. Sabrina Rahman"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">ইমেইল অ্যাড্রেস *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="doctor@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01718-XXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">পোর্টাল পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="নূন্যতম ৬ অক্ষর"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Professional Credentials */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11.5px] font-black text-sky-800 uppercase tracking-wider block">
                ২. ডিগ্রি ও প্রফেশনাল তথ্য
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">ডিগ্রি ও পদবী *</label>
                  <input
                    type="text"
                    name="degrees"
                    required
                    placeholder="যেমন: MBBS, BCS (Health), FCPS"
                    value={form.degrees}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">স্পেশালাইজেশন / বিভাগ *</label>
                  <input
                    type="text"
                    name="specialization"
                    required
                    placeholder="যেমন: Gynecology & Obstetrics Specialist"
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">BMDC রেজিস্ট্রেশন নম্বর</label>
                  <input
                    type="text"
                    name="bmdcNumber"
                    placeholder="যেমন: A-84920"
                    value={form.bmdcNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">অভিজ্ঞতা (বছর)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 3. Chamber & Fees */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11.5px] font-black text-sky-800 uppercase tracking-wider block">
                ৩. চেম্বার ও কনসালটেশন ফি
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">ভিজিট ফি (BDT)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={form.consultationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">রুম নম্বর / ফ্লোর</label>
                  <input
                    type="text"
                    name="chamberRoom"
                    placeholder="যেমন: Room 204, 2nd Floor"
                    value={form.chamberRoom}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">প্রধান চেম্বারের ঠিকানা ও এলাকা *</label>
                  <input
                    type="text"
                    name="chamberAddress"
                    required
                    placeholder="যেমন: সনো ডায়াগনস্টিক টাওয়ার, হাসপাতাল রোড, চুয়াডাঙ্গা"
                    value={form.chamberAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11.5px] font-black text-slate-700 mb-1">প্রোফাইল ছবির লিংক (Photo URL)</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Doctor portrait"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <input
                      type="url"
                      name="photoUrl"
                      placeholder="https://..."
                      value={form.photoUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'প্রোফাইল তৈরি হচ্ছে...' : 'রেজিস্ট্রেশন সম্পন্ন করুন ➜'}
            </button>

          </form>

          <div className="text-center pt-2">
            <Link
              href="/doctor/login"
              className="text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors"
            >
              ইতোমধ্যে অ্যাকাউন্ট আছে? <span className="text-sky-600 font-black underline">এখানে লগইন করুন</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
