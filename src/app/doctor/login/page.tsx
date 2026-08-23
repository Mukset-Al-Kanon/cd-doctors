'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, UserPlus } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] via-[#f7f5fb] to-[#ffffff] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Background Soft Glow Orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md">
              ✚
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CD Doctors <span className="text-purple-600 font-bold">Portal</span>
            </span>
          </Link>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Doctor Login
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Manage your AI banners, Meta boost scheduler & digital wallet.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-white space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="doctor@example.com or 01718XXXXXX"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-full bg-slate-900 hover:bg-purple-600 text-white text-xs font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In ➜'}
            </button>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('dr.shapla@cddoctors.com', 'password123')}
                className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200 transition-colors truncate text-center"
              >
                Dr. Shapla Khatun
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('dr.hasan@cddoctors.com', 'doctor123')}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 transition-colors truncate text-center"
              >
                Dr. Hasan Ali
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/doctor/register"
              className="text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors inline-flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New doctor? Create your profile</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
