'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  ChevronLeft
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Forgot password state
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '']);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'PHONE' | 'RESET'>('PHONE');
  const [forgotCountdown, setForgotCountdown] = useState(60);
  const [forgotCanResend, setForgotCanResend] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const forgotOtpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer for registration OTP
  useEffect(() => {
    let timer: any;
    if (otpStep === 'OTP' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  // Countdown timer for forgot password OTP
  useEffect(() => {
    let timer: any;
    if (forgotStep === 'RESET' && forgotCountdown > 0) {
      timer = setInterval(() => setForgotCountdown((c) => c - 1), 1000);
    } else if (forgotCountdown === 0) {
      setForgotCanResend(true);
    }
    return () => clearInterval(timer);
  }, [forgotStep, forgotCountdown]);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMessage('মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone.trim(), password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'লগইন ব্যর্থ হয়েছে।');
        setLoading(false);
        return;
      }

      setSuccessMessage('লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
      setTimeout(() => {
        if (data.user?.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 800);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // 2. Handle Send OTP for Registration (Step 1)
  const handleSendRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!regName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      setLoading(false);
      return;
    }

    const cleanPhone = regPhone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      setLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
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
      if (data.devOtp) setDevOtpHint(data.devOtp);
      setSuccessMessage(data.message || 'আপনার মোবাইলে ৪ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।');
      setLoading(false);

      setTimeout(() => otpInputRefs[0].current?.focus(), 100);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP and Complete Registration (Step 2)
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const otpCode = otpDigits.join('');
    if (otpCode.length < 4) {
      setErrorMessage('৪ ডিজিটের সম্পূর্ণ ওটিপি কোড প্রদান করুন।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
        setLoading(false);
        return;
      }

      setSuccessMessage('আপনার একাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // 4. Handle Send OTP for Forgot Password
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const cleanPhone = forgotPhone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ওটিপি পাঠাতে সমস্যা হয়েছে।');
        setLoading(false);
        return;
      }

      setForgotStep('RESET');
      setForgotCountdown(60);
      setForgotCanResend(false);
      setForgotOtpDigits(['', '', '', '']);
      setSuccessMessage(data.message || 'পাসওয়ার্ড রিসেটের জন্য ওটিপি কোড পাঠানো হয়েছে।');
      setLoading(false);

      setTimeout(() => forgotOtpInputRefs[0].current?.focus(), 100);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // 5. Handle Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const otpCode = forgotOtpDigits.join('');
    if (otpCode.length < 4) {
      setErrorMessage('৪ ডিজিটের সম্পূর্ণ ওটিপি কোড প্রদান করুন।');
      setLoading(false);
      return;
    }

    if (forgotNewPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: forgotPhone.trim(),
          otpCode,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setTimeout(() => {
        setActiveTab('LOGIN');
        setLoginPhone(forgotPhone);
        setForgotStep('PHONE');
        clearMessages();
      }, 1500);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
      setLoading(false);
    }
  };

  // Helper for OTP Digit Inputs
  const handleOtpBoxChange = (
    index: number,
    value: string,
    digitsArr: string[],
    setDigits: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<HTMLInputElement>[]
  ) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digitsArr];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    if (cleanVal && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center gap-3 group">
            <img
              src="/logo.png"
              alt="CD Doctors Logo"
              width="48"
              height="48"
              className="w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0 border border-white"
            />
            <div className="text-left">
              <div className="font-black text-2xl sm:text-[26px] text-nuvicaNavy-900 tracking-tight leading-none">
                CD <span className="text-nuvicaNavy-800">Doctors</span>
                <span className="inline-block w-2 h-2 rounded-full bg-sky-500 ml-1"></span>
              </div>
              <div className="text-[10px] font-extrabold text-sky-700 tracking-wider uppercase mt-1">
                Digital Healthcare Platform
              </div>
            </div>
          </Link>

          <div className="space-y-1 pt-1">
            <h2 className="text-xl sm:text-2xl font-black text-nuvicaNavy-900 tracking-tight font-noto-bengali-heading">
              {activeTab === 'LOGIN' && 'অ্যাকাউন্টে প্রবেশ করুন'}
              {activeTab === 'REGISTER' && 'নতুন পেশেন্ট অ্যাকাউন্ট তৈরি করুন'}
              {activeTab === 'FORGOT_PASSWORD' && 'পাসওয়ার্ড পুনরুদ্ধার করুন'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              চুয়াডাঙ্গার হাসপাতাল, বিশেষজ্ঞ ডাক্তার ও জরুরি স্বাস্থ্যসেবা
            </p>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-9 rounded-[32px] border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_70px_-15px_rgba(15,23,42,0.12)] transition-all duration-500 space-y-6">
          
          {/* Top Switcher Tabs (Login vs Register) with Smooth Animation */}
          {activeTab !== 'FORGOT_PASSWORD' && (
            <div className="p-1.5 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-inner flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  clearMessages();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-300 ease-out flex items-center justify-center gap-1.5 ${
                  activeTab === 'LOGIN'
                    ? 'bg-white text-sky-700 shadow-md shadow-slate-300/30 scale-[1.01] -translate-y-0.5 border border-slate-100'
                    : 'text-slate-500 hover:text-nuvicaNavy-900 hover:bg-white/60'
                }`}
              >
                <span>লগইন</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('REGISTER');
                  setOtpStep('FORM');
                  clearMessages();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-300 ease-out flex items-center justify-center gap-1.5 ${
                  activeTab === 'REGISTER'
                    ? 'bg-white text-sky-700 shadow-md shadow-slate-300/30 scale-[1.01] -translate-y-0.5 border border-slate-100'
                    : 'text-slate-500 hover:text-nuvicaNavy-900 hover:bg-white/60'
                }`}
              >
                <span>সাইন-আপ</span>
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn shadow-2xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================
              TAB 1: LOGIN FORM (100% PHONE + PASSWORD)
              ======================================================== */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone Input with Hover & Focus Ring */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>মোবাইল নম্বর</span>
                </label>
                <div className="relative flex items-center group/phone">
                  <span className="absolute left-3 text-xs font-black text-slate-500 select-none bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs group-hover/phone:border-sky-300 group-focus-within/phone:border-sky-500 transition-colors">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full pl-18 pr-4 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                  />
                </div>
              </div>

              {/* Password Input with Smooth Hover */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('FORGOT_PASSWORD');
                      setForgotPhone(loginPhone);
                      setForgotStep('PHONE');
                      clearMessages();
                    }}
                    className="relative text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-sky-600 after:transition-all after:duration-300"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative flex items-center group/pass">
                  <Lock className="w-4 h-4 text-slate-400 group-hover/pass:text-sky-500 group-focus-within/pass:text-sky-600 absolute left-3.5 pointer-events-none transition-colors duration-200" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all p-1"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button with Hover Glare & Elevation */}
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
              >
                {/* Light Shimmer Sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                
                {loading ? (
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> লগইন হচ্ছে...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">লগইন করুন</span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 2: REGISTER FORM (100% PHONE + 2-STEP OTP)
              ======================================================== */}
          {activeTab === 'REGISTER' && otpStep === 'FORM' && (
            <form onSubmit={handleSendRegistrationOtp} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">আপনার পুরো নাম</label>
                <div className="relative flex items-center group/name">
                  <User className="w-4 h-4 text-slate-400 group-hover/name:text-sky-500 group-focus-within/name:text-sky-600 absolute left-3.5 pointer-events-none transition-colors duration-200" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর (ওটিপি পাঠানো হবে)</label>
                <div className="relative flex items-center group/regphone">
                  <span className="absolute left-3 text-xs font-black text-slate-500 select-none bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs group-hover/regphone:border-sky-300 group-focus-within/regphone:border-sky-500 transition-colors">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full pl-18 pr-4 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)</label>
                <div className="relative flex items-center group/regpass">
                  <Lock className="w-4 h-4 text-slate-400 group-hover/regpass:text-sky-500 group-focus-within/regpass:text-sky-600 absolute left-3.5 pointer-events-none transition-colors duration-200" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={loading}
                className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                {loading ? (
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> ওটিপি পাঠানো হচ্ছে...
                  </span>
                ) : (
                  <>
                    <Phone className="relative z-10 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="relative z-10">ওটিপি কোড পাঠান</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================
              REGISTER STEP 2: 4-DIGIT PIN OTP VERIFICATION
              ======================================================== */}
          {activeTab === 'REGISTER' && otpStep === 'OTP' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto border border-sky-200 shadow-sm animate-bounce">
                  <KeyRound className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600 font-medium pt-2">
                  <span className="font-bold text-nuvicaNavy-900">+88{regPhone}</span> নম্বরে পাঠানো ৪ ডিজিটের ওটিপি কোডটি লিখুন:
                </p>
              </div>

              {/* 4 OTP PIN Boxes */}
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpBoxChange(index, e.target.value, otpDigits, setOtpDigits, otpInputRefs)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
                        otpInputRefs[index - 1].current?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-black bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 hover:border-sky-300 focus:border-sky-600 rounded-2xl shadow-2xs hover:shadow-xs focus:shadow-lg focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-300 ease-out"
                  />
                ))}
              </div>

              {/* Resend OTP & Countdown Timer */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => setOtpStep('FORM')}
                  className="text-slate-500 hover:text-nuvicaNavy-900 hover:underline transition-colors"
                >
                  ← নম্বর পরিবর্তন করুন
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={(e) => handleSendRegistrationOtp(e)}
                    className="text-sky-600 hover:text-sky-700 font-bold hover:underline transition-colors"
                  >
                    পুনরায় কোড পাঠান
                  </button>
                ) : (
                  <span className="text-slate-400">
                    পুনরায় পাঠান ({countdown}s)
                  </span>
                )}
              </div>

              {/* Verify & Create Account Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length < 4}
                className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                {loading ? (
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> একাউন্ট তৈরি হচ্ছে...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="relative z-10 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="relative z-10">যাচাই করে একাউন্ট তৈরি করুন</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 3: FORGOT PASSWORD (100% PHONE + OTP RESET)
              ======================================================== */}
          {activeTab === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  clearMessages();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-nuvicaNavy-900 pb-2 transition-colors group/back"
              >
                <ChevronLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" /> লগইন পেজে ফিরে যান
              </button>

              {forgotStep === 'PHONE' ? (
                <form onSubmit={handleSendForgotOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">আপনার একাউন্টের মোবাইল নম্বর</label>
                    <div className="relative flex items-center group/forgotphone">
                      <span className="absolute left-3 text-xs font-black text-slate-500 select-none bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs group-hover/forgotphone:border-sky-300 group-focus-within/forgotphone:border-sky-500 transition-colors">
                        +88
                      </span>
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full pl-18 pr-4 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> কোড পাঠানো হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <Phone className="relative z-10 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="relative z-10">রিসেট ওটিপি কোড পাঠান</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600 font-medium">
                      <span className="font-bold text-nuvicaNavy-900">+88{forgotPhone}</span> নম্বরে পাঠানো ৪ ডিজিটের ওটিপি লিখুন:
                    </p>
                  </div>

                  {/* 4 OTP PIN Boxes */}
                  <div className="flex justify-center gap-3">
                    {forgotOtpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={forgotOtpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpBoxChange(
                            index,
                            e.target.value,
                            forgotOtpDigits,
                            setForgotOtpDigits,
                            forgotOtpInputRefs
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !forgotOtpDigits[index] && index > 0) {
                            forgotOtpInputRefs[index - 1].current?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-xl font-black bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 hover:border-sky-300 focus:border-sky-600 rounded-2xl shadow-2xs hover:shadow-xs focus:shadow-lg focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-300 ease-out"
                      />
                    ))}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড দিন (ন্যূনতম ৬ অক্ষর)</label>
                    <div className="relative flex items-center group/resetpass">
                      <Lock className="w-4 h-4 text-slate-400 group-hover/resetpass:text-sky-500 group-focus-within/resetpass:text-sky-600 absolute left-3.5 pointer-events-none transition-colors duration-200" />
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="আপনার নতুন পাসওয়ার্ড দিন"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-11 py-3 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs hover:shadow-xs focus:shadow-md transition-all duration-300 ease-out"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all p-1"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Resend link */}
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setForgotStep('PHONE')}
                      className="text-slate-500 hover:text-nuvicaNavy-900 hover:underline transition-colors"
                    >
                      ← নম্বর পরিবর্তন
                    </button>
                    {forgotCanResend ? (
                      <button
                        type="button"
                        onClick={(e) => handleSendForgotOtp(e)}
                        className="text-sky-600 hover:text-sky-700 font-bold hover:underline transition-colors"
                      >
                        পুনরায় কোড পাঠান
                      </button>
                    ) : (
                      <span className="text-slate-400">
                        পুনরায় পাঠান ({forgotCountdown}s)
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || forgotOtpDigits.join('').length < 4}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> পাসওয়ার্ড পরিবর্তন হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="relative z-10 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="relative z-10">পাসওয়ার্ড পরিবর্তন করুন</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
