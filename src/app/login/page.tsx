'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Lock, 
  Mail, 
  Phone,
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  Stethoscope, 
  CheckCircle2,
  LogIn
} from 'lucide-react';

export default function UserLoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectTarget = searchParams?.get('redirect') || null;

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

      setSuccessMessage('Logged in successfully! Redirecting...');
      setTimeout(() => {
        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'OWNER_ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 800);
    } catch (err) {
      setErrorMessage('Network error during login.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else {
          window.location.href = '/';
        }
      }, 800);
    } catch (err) {
      setErrorMessage('Network error during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200/80">
        {/* Header & Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="CD Doctors Logo"
              className="w-12 h-12 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="text-left">
              <span className="font-extrabold text-xl text-nuvicaNavy-900 leading-tight block">
                CD <span className="text-sky-600">Doctors</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">Chuadanga District Platform</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-nuvicaNavy-900 tracking-tight pt-1">
            {activeTab === 'login' ? 'User & Patient Login' : 'Create Patient Account'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {activeTab === 'login'
              ? 'Sign in to manage appointments & healthcare records'
              : 'Register to book doctor appointments in Chuadanga'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-2xl bg-slate-100 p-1 font-bold text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-nuvicaNavy-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-nuvicaNavy-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Account'}
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Mobile Phone Number
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
