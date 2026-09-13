'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, UserPlus, Stethoscope } from 'lucide-react';

export default function DoctorLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/doctor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/doctor/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email: string, pass: string = 'password123') => {
    setEmailOrPhone(email);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-slate-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none font-bengali">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CD Doctors <span className="text-sky-600 font-bold">পোর্টাল</span>
            </span>
          </Link>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ডাক্তার লগইন
          </h2>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
            আপনার চেম্বার শিডিউল, পেশেন্ট সিরিয়াল, মেটা বুস্ট ও ওয়ালেট পরিচালনা করুন।
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xs border border-slate-200/80 space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11.5px] font-black text-slate-700 mb-1.5">
                ইমেইল বা মোবাইল নম্বর
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="doctor@example.com অথবা 017xxxxxxxx"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-black text-slate-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন ➜'}
            </button>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ডেমো লগইন (টেস্টিং)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('dr.shapla@cddoctors.com', 'password123')}
                className="p-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-200 transition-colors truncate text-center cursor-pointer"
              >
                Dr. Shapla Khatun
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('dr.hasan@cddoctors.com', 'doctor123')}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 transition-colors truncate text-center cursor-pointer"
              >
                Dr. Hasan Ali
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/doctor/register"
              className="text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন ডাক্তার? অ্যাকাউন্ট রেজিস্ট্রেশন করুন</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
