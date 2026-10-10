'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  ChevronLeft,
  MapPin,
  Stethoscope,
  Mail,
  UserPlus
} from 'lucide-react';
import DistrictSelectDropdown from '@/components/DistrictSelectDropdown';
import AuthRoleSwitcher, { AuthRole } from '@/components/auth/AuthRoleSwitcher';

interface UnifiedAuthPortalProps {
  initialRole?: AuthRole;
}

export default function UnifiedAuthPortal({ initialRole = 'PATIENT' }: UnifiedAuthPortalProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine role based on URL pathname
  const roleFromPath: AuthRole = pathname?.startsWith('/doctor') 
    ? 'DOCTOR' 
    : pathname?.startsWith('/hospital') 
      ? 'HOSPITAL' 
      : 'PATIENT';

  // Active Role State with Smooth Client-Side Switching
  const [currentRole, setCurrentRole] = useState<AuthRole>(roleFromPath || initialRole);

  // Sync state whenever pathname changes
  useEffect(() => {
    if (roleFromPath && roleFromPath !== currentRole) {
      setCurrentRole(roleFromPath);
    }
  }, [roleFromPath]);

  // Pre-fetch all auth routes for instant 0ms transitions
  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/doctor/login');
    router.prefetch('/hospital/login');
  }, [router]);

  // Patient tab: LOGIN | REGISTER | FORGOT_PASSWORD
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');

  // Patient Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Patient Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('চুয়াডাঙ্গা');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Patient Forgot password state
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtpDigits, setForgotOtpDigits] = useState(['', '', '', '']);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'PHONE' | 'RESET'>('PHONE');
  const [forgotCountdown, setForgotCountdown] = useState(60);
  const [forgotCanResend, setForgotCanResend] = useState(false);

  // Doctor Auth state
  const [docEmailOrPhone, setDocEmailOrPhone] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState('');

  // Hospital Auth state
  const [hospitalsList, setHospitalsList] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [hospitalPin, setHospitalPin] = useState('123456');
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [hospitalError, setHospitalError] = useState('');

  // General feedback state
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

  // Fetch hospitals list for hospital counter tab
  useEffect(() => {
    fetch('/api/hospital/reception/queue')
      .then((r) => r.json())
      .then((data) => {
        if (data.hospitalsList) {
          setHospitalsList(data.hospitalsList);
          if (data.hospitalsList.length > 0) {
            setSelectedHospitalId(data.hospitalsList[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

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
    setDocError('');
    setHospitalError('');
  };

  // 🌟 Handle Silky Smooth 1-Click Role Switching
  const handleRoleChange = (newRole: AuthRole) => {
    if (newRole === currentRole) return;
    setCurrentRole(newRole);
    clearMessages();
    const targetUrl = newRole === 'DOCTOR' ? '/doctor/login' : newRole === 'HOSPITAL' ? '/hospital/login' : '/login';
    router.push(targetUrl, { scroll: false });
  };

  // 1. Patient Login Submit
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

  // 2. Patient Registration OTP Send
  const handleSendRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!regName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।');
      setLoading(false);
      return;
    }

    if (!regPhone.trim() || !/^01[3-9]\d{8}$/.test(regPhone.trim())) {
      setErrorMessage('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)');
      setLoading(false);
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: regPhone.trim(), type: 'REGISTER' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ওটিপি পাঠানো সম্ভব হয়নি।');
        setLoading(false);
        return;
      }

      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }

      setSuccessMessage('আপনার মোবাইলে ৪-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।');
      setOtpStep('OTP');
      setCountdown(60);
      setCanResend(false);
      setLoading(false);

      setTimeout(() => otpInputRefs[0].current?.focus(), 200);
    } catch (err) {
      setErrorMessage('সার্ভার এরর: ওটিপি কোড পাঠানো ব্যর্থ হয়েছে।');
      setLoading(false);
    }
  };

  // 3. Patient Verify OTP & Register
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 4) {
      setErrorMessage('সম্পূর্ণ ৪-সংখ্যার ওটিপি কোডটি প্রদান করুন।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          district: regDistrict,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
        setLoading(false);
        return;
      }

      setSuccessMessage('রেজিস্ট্রেশন সফল হয়েছে! অ্যাকাউন্টে প্রবেশ করা হচ্ছে...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err) {
      setErrorMessage('সার্ভার এরর: অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।');
      setLoading(false);
    }
  };

  // 4. Patient Forgot Password Send OTP
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    if (!forgotPhone.trim() || !/^01[3-9]\d{8}$/.test(forgotPhone.trim())) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ওটিপি পাঠানো যায়নি।');
        setLoading(false);
        return;
      }

      setSuccessMessage('পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।');
      setForgotStep('RESET');
      setForgotCountdown(60);
      setForgotCanResend(false);
      setLoading(false);

      setTimeout(() => forgotOtpInputRefs[0].current?.focus(), 200);
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
      setLoading(false);
    }
  };

  // 5. Patient Reset Password with OTP
  const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const otpCode = forgotOtpDigits.join('');
    if (otpCode.length !== 4) {
      setErrorMessage('৪-সংখ্যার ওটিপি কোডটি লিখুন।');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: forgotPhone.trim(),
          otp: otpCode,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
        setLoading(false);
        return;
      }

      setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! লগইন করুন।');
      setLoading(false);
      setTimeout(() => {
        setActiveTab('LOGIN');
        setLoginPhone(forgotPhone);
        setLoginPassword('');
        setForgotStep('PHONE');
        setForgotOtpDigits(['', '', '', '']);
        setForgotNewPassword('');
        clearMessages();
      }, 1500);
    } catch (err) {
      setErrorMessage('সার্ভার এরর: পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
      setLoading(false);
    }
  };

  // 6. Resend Registration OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage('');
    setSuccessMessage('নতুন ওটিপি কোড পাঠানো হচ্ছে...');
    setCanResend(false);
    setCountdown(60);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: regPhone.trim(), type: 'REGISTER' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'পুনরায় কোড পাঠানো ব্যর্থ হয়েছে।');
        setCanResend(true);
      } else {
        if (data.devOtp) setDevOtpHint(data.devOtp);
        setSuccessMessage('নতুন ওটিপি কোড আপনার মোবাইলে পাঠানো হয়েছে।');
      }
    } catch {
      setErrorMessage('পুনরায় কোড পাঠানো ব্যর্থ হয়েছে।');
      setCanResend(true);
    }
  };

  // 7. Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    if (!forgotCanResend) return;
    setErrorMessage('');
    setSuccessMessage('নতুন ওটিপি কোড পাঠানো হচ্ছে...');
    setForgotCanResend(false);
    setForgotCountdown(60);

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: forgotPhone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'পুনরায় কোড পাঠানো সম্ভব হয়নি।');
        setForgotCanResend(true);
      } else {
        setSuccessMessage('নতুন কোড পাঠানো হয়েছে।');
      }
    } catch {
      setErrorMessage('সার্ভার এরর।');
      setForgotCanResend(true);
    }
  };

  // OTP Digits Change Handlers
  const handleOtpDigitChange = (
    index: number,
    value: string,
    digitsState: string[],
    setDigitsState: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<HTMLInputElement | null>[]
  ) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digitsState];
    newDigits[index] = cleanVal;
    setDigitsState(newDigits);

    if (cleanVal && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  // 🌟 Doctor Submit
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocLoading(true);
    setDocError('');

    try {
      const res = await fetch('/api/doctor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: docEmailOrPhone, password: docPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'ভুল ইমেইল বা পাসওয়ার্ড');
      }

      router.push('/doctor/dashboard');
    } catch (err: any) {
      setDocError(err.message);
    } finally {
      setDocLoading(false);
    }
  };

  const handleDoctorDemoLogin = (email: string, pass: string = 'password123') => {
    setDocEmailOrPhone(email);
    setDocPassword(pass);
  };

  // 🌟 Hospital Submit
  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospitalId) {
      setHospitalError('অনুগ্রহ করে একটি হাসপাতাল নির্বাচন করুন।');
      return;
    }
    setHospitalLoading(true);
    setTimeout(() => {
      router.push(`/hospital/dashboard?hospitalId=${selectedHospitalId}`);
    }, 400);
  };

  const handleHospitalQuickEnter = (hospitalId: string) => {
    router.push(`/hospital/dashboard?hospitalId=${hospitalId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/50 via-white to-slate-50 -mb-20 md:mb-0 select-none font-bengali">
      <div className="max-w-md w-full space-y-6 sm:space-y-7 my-auto">
        
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

          {/* Smoothly Crossfading Heading & Subtitle */}
          <div key={currentRole} className="space-y-1 pt-1 animate-auth-crossfade">
            <h2 className="text-xl sm:text-2xl font-black text-nuvicaNavy-900 tracking-tight font-noto-bengali-heading">
              {currentRole === 'PATIENT' && (
                activeTab === 'LOGIN' ? 'অ্যাকাউন্টে প্রবেশ করুন' : activeTab === 'REGISTER' ? 'নতুন পেশেন্ট অ্যাকাউন্ট তৈরি করুন' : 'পাসওয়ার্ড পুনরুদ্ধার করুন'
              )}
              {currentRole === 'DOCTOR' && 'ডাক্তার পোর্টাল লগইন'}
              {currentRole === 'HOSPITAL' && 'হাসপাতাল সেন্ট্রাল কাউন্টার'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {currentRole === 'PATIENT' && 'চুয়াডাঙ্গার হাসপাতাল, বিশেষজ্ঞ ডাক্তার ও জরুরি স্বাস্থ্যসেবা'}
              {currentRole === 'DOCTOR' && 'আপনার চেম্বার শিডিউল, পেশেন্ট কিউ কনসোল ও প্রেসক্রিপশন পরিচালনা করুন'}
              {currentRole === 'HOSPITAL' && 'হাসপাতালের সকল ডাক্তারের চেম্বার সিরিয়াল, লাইভ কিউ ও রসিদ প্রিন্ট ডেস্ক'}
            </p>
          </div>
        </div>

        {/* 🌟 3-Way Unified Role Switcher with Animated Sliding Pill */}
        <AuthRoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />

        {/* Auth Box Container */}
        <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-9 rounded-[32px] border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_70px_-15px_rgba(15,23,42,0.12)] transition-all duration-500 space-y-6">
          
          {/* ========================================================================= */}
          {/* ROLE 1: PATIENT PORTAL                                                    */}
          {/* ========================================================================= */}
          {currentRole === 'PATIENT' && (
            <div key="patient-panel" className="space-y-6 animate-auth-crossfade">
              {/* Top Switcher Tabs (Login vs Register) */}
              {activeTab !== 'FORGOT_PASSWORD' && (
                <div className="p-1.5 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-inner flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('LOGIN');
                      clearMessages();
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-300 ease-out flex items-center justify-center gap-1.5 cursor-pointer ${
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
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all duration-300 ease-out flex items-center justify-center gap-1.5 cursor-pointer ${
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

              {/* PATIENT TAB 1: LOGIN FORM */}
              {activeTab === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="flex items-center gap-1 px-3.5 py-3 bg-slate-100/70 border-r border-slate-200/90 select-none shrink-0 group-hover:bg-slate-100 transition-colors">
                        <span className="text-xs font-black text-slate-600 tracking-wide">+88</span>
                      </div>
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full px-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

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
                        className="relative text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-sky-600 after:transition-all after:duration-300 cursor-pointer"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="আপনার পাসওয়ার্ড দিন"
                        required
                        className="w-full pr-2 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="pr-3.5 pl-2 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
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

              {/* PATIENT TAB 2: REGISTER FORM */}
              {activeTab === 'REGISTER' && otpStep === 'FORM' && (
                <form onSubmit={handleSendRegistrationOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">পুরো নাম</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="আপনার পুরো নাম লিখুন"
                        required
                        className="w-full pr-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="flex items-center gap-1 px-3.5 py-3 bg-slate-100/70 border-r border-slate-200/90 select-none shrink-0 group-hover:bg-slate-100 transition-colors">
                        <span className="text-xs font-black text-slate-600 tracking-wide">+88</span>
                      </div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full px-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">জেলা</label>
                    <DistrictSelectDropdown
                      value={regDistrict}
                      onChange={(districtName) => setRegDistrict(districtName)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                        required
                        className="w-full pr-2 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="pr-3.5 pl-2 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> কোড পাঠানো হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">ওটিপি কোড পাঠান</span>
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* PATIENT TAB 2 STEP 2: VERIFY OTP */}
              {activeTab === 'REGISTER' && otpStep === 'OTP' && (
                <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900">+88 {regPhone}</span> নম্বরে পাঠানো ৪ সংখ্যার কোডটি লিখুন
                    </p>
                    {devOtpHint && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold inline-block">
                        টেস্টিং ওটিপি: <span className="font-mono">{devOtpHint}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value, otpDigits, setOtpDigits, otpInputRefs)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && idx > 0) {
                            otpInputRefs[idx - 1].current?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-xl font-black rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> যাচাই হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">যাচাই ও অ্যাকাউন্ট তৈরি</span>
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep('FORM')}
                      className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>তথ্য পরিবর্তন</span>
                    </button>

                    <button
                      type="button"
                      disabled={!canResend}
                      onClick={handleResendOtp}
                      className={`font-bold transition-colors cursor-pointer ${
                        canResend ? 'text-sky-600 hover:text-sky-700' : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canResend ? 'আবার পাঠান' : `${countdown}s পর আবার পাঠান`}
                    </button>
                  </div>
                </form>
              )}

              {/* PATIENT TAB 3: FORGOT PASSWORD */}
              {activeTab === 'FORGOT_PASSWORD' && forgotStep === 'PHONE' && (
                <form onSubmit={handleSendForgotOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">নিবন্ধিত মোবাইল নম্বর</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="flex items-center gap-1 px-3.5 py-3 bg-slate-100/70 border-r border-slate-200/90 select-none shrink-0 group-hover:bg-slate-100 transition-colors">
                        <span className="text-xs font-black text-slate-600 tracking-wide">+88</span>
                      </div>
                      <input
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full px-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> কোড পাঠানো হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">রিসেট কোড পাঠান</span>
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('LOGIN');
                        clearMessages();
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-sky-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>লগইন পেজে ফিরুন</span>
                    </button>
                  </div>
                </form>
              )}

              {/* PATIENT TAB 3 STEP 2: RESET PASSWORD */}
              {activeTab === 'FORGOT_PASSWORD' && forgotStep === 'RESET' && (
                <form onSubmit={handleResetPasswordWithOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900">+88 {forgotPhone}</span> নম্বরে পাঠানো ৪ সংখ্যার কোড দিন
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    {forgotOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={forgotOtpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value, forgotOtpDigits, setForgotOtpDigits, forgotOtpInputRefs)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && idx > 0) {
                            forgotOtpInputRefs[idx - 1].current?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-xl font-black rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড</label>
                    <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                      <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                        required
                        className="w-full pr-2 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="pr-3.5 pl-2 text-slate-400 hover:text-sky-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    {loading ? (
                      <span className="relative z-10 inline-flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" /> পাসওয়ার্ড পরিবর্তন হচ্ছে...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">পাসওয়ার্ড রিসেট করুন</span>
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep('PHONE')}
                      className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>নম্বর পরিবর্তন</span>
                    </button>

                    <button
                      type="button"
                      disabled={!forgotCanResend}
                      onClick={handleResendForgotOtp}
                      className={`font-bold transition-colors cursor-pointer ${
                        forgotCanResend ? 'text-sky-600 hover:text-sky-700' : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {forgotCanResend ? 'আবার পাঠান' : `${forgotCountdown}s পর আবার পাঠান`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ROLE 2: DOCTOR PORTAL                                                     */}
          {/* ========================================================================= */}
          {currentRole === 'DOCTOR' && (
            <div key="doctor-panel" className="space-y-5 animate-auth-crossfade">
              {docError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn shadow-2xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{docError}</span>
                </div>
              )}

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ইমেইল বা মোবাইল নম্বর
                  </label>
                  <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                    <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="doctor@example.com অথবা 017xxxxxxxx"
                      value={docEmailOrPhone}
                      onChange={(e) => setDocEmailOrPhone(e.target.value)}
                      className="w-full pr-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    পাসওয়ার্ড
                  </label>
                  <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                    <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={docPassword}
                      onChange={(e) => setDocPassword(e.target.value)}
                      className="w-full pr-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={docLoading}
                  className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                  {docLoading ? (
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 animate-spin" /> লগইন হচ্ছে...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">ডাক্তার পোর্টালে প্রবেশ করুন</span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Account Helpers */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  ডেমো অ্যাকাউন্ট দিয়ে টেস্ট করুন
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDoctorDemoLogin('dr.shapla@cddoctors.com', 'password123')}
                    className="p-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-black border border-sky-200/80 transition-colors truncate text-center cursor-pointer shadow-2xs"
                  >
                    ডা. শাপলা খাতুন
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDoctorDemoLogin('dr.hasan@cddoctors.com', 'doctor123')}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-black border border-slate-200 transition-colors truncate text-center cursor-pointer shadow-2xs"
                  >
                    ডা. হাসান আলী
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/doctor/register"
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>নতুন ডাক্তার? অ্যাকাউন্ট রেজিস্ট্রেশন করুন ➔</span>
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ROLE 3: HOSPITAL PORTAL                                                   */}
          {/* ========================================================================= */}
          {currentRole === 'HOSPITAL' && (
            <div key="hospital-panel" className="space-y-5 animate-auth-crossfade">
              {hospitalError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn shadow-2xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{hospitalError}</span>
                </div>
              )}

              <form onSubmit={handleHospitalSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    হাসপাতাল বা ক্লিনিক নির্বাচন করুন
                  </label>
                  <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                    <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedHospitalId}
                      onChange={(e) => setSelectedHospitalId(e.target.value)}
                      className="w-full pr-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {hospitalsList.map((h) => (
                        <option key={h.id} value={h.id} className="text-slate-900 py-1">
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    কাউন্টার এক্সেস পিন বা পাসওয়ার্ড
                  </label>
                  <div className="flex items-center rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-slate-300 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:shadow-md shadow-2xs transition-all duration-300 overflow-hidden group">
                    <div className="pl-3.5 pr-2 py-3 text-slate-400 group-focus-within:text-sky-600 transition-colors shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={hospitalPin}
                      onChange={(e) => setHospitalPin(e.target.value)}
                      className="w-full pr-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={hospitalLoading}
                  className="group/btn relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 cursor-pointer"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                  {hospitalLoading ? (
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 animate-spin" /> প্রবেশ করা হচ্ছে...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">হাসপাতাল ড্যাশবোর্ডে প্রবেশ করুন</span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <Link
                    href={`/hospital/reception?hospitalId=${selectedHospitalId}`}
                    className="text-[11.5px] font-bold text-sky-700 hover:text-sky-800 hover:underline inline-flex items-center gap-1"
                  >
                    <span>অথবা সরাসরি সেন্ট্রাল রিসেপশন কাউন্টারে যান</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </form>

              {/* Quick Demo Hospitals list */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  ১-ক্লিকে ডেমো হাসপাতাল ম্যানেজমেন্ট
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {hospitalsList.slice(0, 3).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleHospitalQuickEnter(h.id)}
                      className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/80 text-slate-800 hover:text-sky-900 text-xs font-bold border border-slate-200/70 hover:border-sky-200 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{h.name}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
