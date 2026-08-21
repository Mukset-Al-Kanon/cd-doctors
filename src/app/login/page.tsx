'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  LogIn,
  KeyRound,
  RotateCcw,
  Smartphone,
  ArrowLeft
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

  // OTP Verification State
  const [otpStep, setOtpStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectTarget = searchParams?.get('redirect') || null;

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

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
        setErrorMessage(data.error || 'ভুল ইমেইল অথবা পাসওয়ার্ড প্রদান করেছেন।');
        setLoading(false);
        return;
      }

      setSuccessMessage('সফলভাবে লগইন হয়েছে! রিডাইরেক্ট করা হচ্ছে...');
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
      setErrorMessage('নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Phone
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।');
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('অনুগ্রহ করে ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ওটিপি পাঠাতে সমস্যা হয়েছে।');
        setLoading(false);
        return;
      }

      setOtpStep('OTP');
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '']);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }
      setSuccessMessage(data.message || 'আপনার মোবাইল নম্বরে ৪ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।');
      setLoading(false);

      // Auto-focus first OTP input
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 100);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // Handle OTP Box Input
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData.length > 0) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedData.length, 3);
      otpInputRefs[nextIdx].current?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'পুনরায় ওটিপি পাঠাতে সমস্যা হয়েছে।');
        setLoading(false);
        return;
      }

      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '']);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }
      setSuccessMessage('নতুন ওটিপি কোড পাঠানো হয়েছে!');
      setLoading(false);
      otpInputRefs[0].current?.focus();
    } catch (err) {
      setErrorMessage('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Complete Registration
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 4) {
      setErrorMessage('অনুগ্রহ করে ৪ ডিজিটের সম্পূর্ণ ওটিপি কোডটি লিখুন।');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          otpCode: fullOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ভেরিফিকেশন সম্পন্ন হয়নি।');
        setLoading(false);
        return;
      }

      setSuccessMessage('অভিনন্দন! আপনার মোবাইল নম্বর যাচাই সম্পন্ন ও একাউন্ট তৈরি হয়েছে।');
      setTimeout(() => {
        if (redirectTarget) {
          window.location.href = redirectTarget;
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      setErrorMessage('রেজিস্ট্রেশন প্রক্রিয়ায় সমস্যা হয়েছে।');
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
              : 'Register with verified mobile number for booking appointments'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-2xl bg-slate-100 p-1 font-bold text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setOtpStep('FORM');
              setErrorMessage('');
              setSuccessMessage('');
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
              setSuccessMessage('');
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
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-semibold animate-shake">
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
          /* Register Flow with OTP Phone Verification */
          <div>
            {otpStep === 'FORM' ? (
              /* Step 1: User Details Form */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Full Name (পুরো নাম)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Tanvir Ahmed"
                      className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Mobile Phone (মোবাইল নম্বর)</span>
                    <span className="text-[10px] text-sky-600 font-semibold lowercase">OTP যাচাই করা হবে</span>
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                    <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-xs font-black text-slate-500 select-none">+88</span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01711223344"
                      className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Email Address (ইমেইল)
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
                    Password (পাসওয়ার্ড)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-sky-600 focus-within:bg-white transition-all">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ন্যূনতম ৬ অক্ষরের পাসওয়ার্ড"
                      className="w-full bg-transparent text-xs font-bold text-nuvicaNavy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'ওটিপি কোড পাঠানো হচ্ছে...' : 'ওটিপি কোড পাঠান (Send OTP)'}
                  <Smartphone className="w-4 h-4 text-white" />
                </button>
              </form>
            ) : (
              /* Step 2: 4-Digit OTP Verification Screen */
              <form onSubmit={handleVerifyAndRegister} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Phone Header Info */}
                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center space-y-1">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white mb-1 shadow-sm">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-sky-950">
                    মোবাইল নম্বর ভেরিফিকেশন কোড
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-extrabold text-sky-800 tracking-wide">{phone}</span> নম্বরে ৪ ডিজিটের কোড পাঠানো হয়েছে
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('FORM');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 pt-1 underline"
                  >
                    <ArrowLeft className="w-3 h-3" /> নম্বর পরিবর্তন করুন
                  </button>
                </div>

                {/* Dev Mode OTP Display (Quick Testing) */}
                {devOtpHint && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <span>💡 [টেস্টিং কোড: <strong className="text-amber-800 text-sm tracking-widest">{devOtpHint}</strong>]</span>
                  </div>
                )}

                {/* 4-Digit PIN Boxes */}
                <div>
                  <label className="block text-center text-[11px] font-bold text-slate-600 mb-3 uppercase tracking-wider">
                    ৪ ডিজিটের কোডটি লিখুন
                  </label>
                  <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePasteOtp}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black text-nuvicaNavy-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-sky-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend OTP Timer */}
                <div className="text-center pt-1">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> পুনরায় কোড পাঠান (Resend OTP)
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">
                      পুনরায় কোড পাঠাতে অপেক্ষা করুন: <strong className="text-slate-700">{countdown}s</strong>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 4}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-full shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'যাচাই করা হচ্ছে...' : 'যাচাই করে একাউন্ট তৈরি করুন'}
                  <ShieldCheck className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
