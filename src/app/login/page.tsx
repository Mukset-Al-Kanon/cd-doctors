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
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-nuvicaNavy-900 tracking-tight">
              CD Doctors
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-black text-nuvicaNavy-900 tracking-tight font-noto-bengali-heading">
            {activeTab === 'LOGIN' && 'মোবাইল নম্বর দিয়ে লগইন'}
            {activeTab === 'REGISTER' && 'নতুন পেশেন্ট একাউন্ট তৈরি করুন'}
            {activeTab === 'FORGOT_PASSWORD' && 'পাসওয়ার্ড রিসেট করুন'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            চুয়াডাঙ্গা ডিজিটাল হেলথকেয়ার প্ল্যাটফর্ম
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-6">
          
          {/* Top Switcher Tabs (Login vs Register) */}
          {activeTab !== 'FORGOT_PASSWORD' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  clearMessages();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${
                  activeTab === 'LOGIN'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                লগইন (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('REGISTER');
                  setOtpStep('FORM');
                  clearMessages();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${
                  activeTab === 'REGISTER'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                সাইন-আপ (Sign Up)
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================
              TAB 1: LOGIN FORM (100% PHONE + PASSWORD)
              ======================================================== */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-black text-slate-400 select-none bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
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
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    required
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> লগইন হচ্ছে...
                  </span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
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
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর (ওটিপি পাঠানো হবে)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-black text-slate-400 select-none bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> ওটিপি পাঠানো হচ্ছে...
                  </span>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>ওটিপি কোড পাঠান (Send OTP)</span>
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
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto border border-sky-200">
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
                    className="w-12 h-14 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-sky-600 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {/* Resend OTP & Countdown Timer */}
              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => setOtpStep('FORM')}
                  className="text-slate-500 hover:text-slate-800"
                >
                  ← নম্বর পরিবর্তন করুন
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={(e) => handleSendRegistrationOtp(e)}
                    className="text-sky-600 hover:text-sky-700 font-bold"
                  >
                    পুনরায় কোড পাঠান (Resend)
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
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 animate-spin" /> একাউন্ট তৈরি হচ্ছে...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>যাচাই করে একাউন্ট তৈরি করুন</span>
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 pb-2"
              >
                <ChevronLeft className="w-4 h-4" /> লগইন পেজে ফিরে যান
              </button>

              {forgotStep === 'PHONE' ? (
                <form onSubmit={handleSendForgotOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">আপনার একাউন্টের মোবাইল নম্বর</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-black text-slate-400 select-none bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        +88
                      </span>
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> কোড পাঠানো হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        <span>রিসেট ওটিপি কোড পাঠান</span>
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
                        className="w-12 h-14 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-sky-600 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড দিন (ন্যূনতম ৬ অক্ষর)</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="আপনার নতুন পাসওয়ার্ড দিন"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600"
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
                      className="text-slate-500 hover:text-slate-800"
                    >
                      ← নম্বর পরিবর্তন
                    </button>
                    {forgotCanResend ? (
                      <button
                        type="button"
                        onClick={(e) => handleSendForgotOtp(e)}
                        className="text-sky-600 hover:text-sky-700 font-bold"
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
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> পাসওয়ার্ড পরিবর্তন হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Security Badge */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Alpha SMS দ্বারা সুরক্ষিত ওটিপি ভেরিফিকেশন</span>
          </div>

        </div>
      </div>
    </div>
  );
}
