'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@cddoctors.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'OWNER_ADMIN') {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMessage('Access denied. Administrator privileges required.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Network error during login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#073644] via-[#086982] to-[#0a4859] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 space-y-6 shadow-2xl border border-white/90">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg mx-auto border-2 border-cyan-400 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="CD Doctors Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#073644]">Owner Admin Login</h1>
            <p className="text-xs text-cyan-800 font-bold mt-0.5">CD Doctors — Chuadanga Central Control</p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-cyan-600 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cddoctors.com"
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-cyan-600 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-xs text-white bg-[#086982] hover:bg-[#065063] shadow-lg shadow-cyan-900/20 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Owner Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
