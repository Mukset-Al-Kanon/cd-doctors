'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PosThermalTokenModal from '@/components/PosThermalTokenModal';
import { 
  Users, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Plus, 
  Search, 
  Phone, 
  AlertCircle, 
  RotateCcw, 
  Printer, 
  Ticket, 
  X, 
  RefreshCw, 
  ChevronLeft, 
  Share2, 
  Check, 
  BellRing,
  Sparkles,
  Tv,
  FileText
} from 'lucide-react';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

// Web Audio API Synthesizer for Clean Hospital Calling Chime
function playCallingChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.9);
    }, 180);
  } catch (err) {
    console.log('Audio chime not supported');
  }
}

export default function AssistantDeskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get('doctorId');

  const [doctor, setDoctor] = useState<any>(null);
  const [doctorId, setDoctorId] = useState<string>(docIdParam || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, completed: 0, waiting: 0, calling: 0, inConsultation: 0, skipped: 0 });
  const [currentActive, setCurrentActive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fast Always-Open Walk-in Form State (Only Name & Phone)
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [walkInError, setWalkInError] = useState('');
  const [walkInSuccess, setWalkInSuccess] = useState('');
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Print Token Slip State
  const [printToken, setPrintToken] = useState<any>(null);

  const rawRoom = doctor?.chamberRoom || '';
  const cleanRoom = rawRoom.replace(/^(রুম\s*নং|রুম\s*নম্বর|রুম|Room\s*No\.?|Room)\s*:?\s*/i, '').trim();
  const roomText = cleanRoom ? `রুম ${toBanglaDigits(cleanRoom)}` : '';

  // 1. Fetch Doctor Info
  useEffect(() => {
    async function loadDoctor() {
      if (docIdParam) {
        try {
          const res = await fetch(`/api/doctors/detail?id=${docIdParam}`);
          const data = await res.json();
          if (data.doctor) {
            setDoctor(data.doctor);
            setDoctorId(data.doctor.id);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const res = await fetch('/api/doctor/auth/me');
          const data = await res.json();
          if (data.success && data.doctor) {
            setDoctor(data.doctor);
            setDoctorId(data.doctor.id);
          } else {
            router.push('/doctor/login');
          }
        } catch (e) {
          router.push('/doctor/login');
        }
      }
    }
    loadDoctor();
  }, [docIdParam, router]);

  // 2. Fetch Live Queue
  const fetchQueueData = useCallback(async (isManual = false) => {
    if (!doctorId) return;
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/doctor/appointments/list?doctorId=${doctorId}&date=${selectedDate}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments(data.appointments || []);
        setStats(data.stats || { total: 0, completed: 0, waiting: 0, calling: 0, inConsultation: 0, skipped: 0 });
        setCurrentActive(data.currentActive || null);
      }
    } catch (err) {
      console.error('Queue fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [doctorId, selectedDate]);

  useEffect(() => {
    if (doctorId) {
      fetchQueueData();
      const interval = setInterval(() => {
        fetchQueueData();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [doctorId, fetchQueueData]);

  // 3. 1-Click Master Action Handler (Triggers TV Screen Announcement)
  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      if (soundEnabled) playCallingChime();

      const res = await fetch('/api/doctor/appointments/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CALL_NEXT',
          doctorId,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQueueData();
      } else {
        alert(data.error || 'অ্যাকশন সম্পন্ন করা যায়নি');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setActionLoading(false);
    }
  };

  // Re-Announce / Call Again (TV স্ক্রিনে পুনরায় উচ্চস্বরে ঘোষণা পাঠাবে)
  const handleReAnnounce = async (apt: any) => {
    if (!apt) return;
    setActionLoading(true);
    try {
      if (soundEnabled) playCallingChime();

      const res = await fetch('/api/doctor/appointments/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RE_ANNOUNCE',
          appointmentId: apt.id,
          doctorId,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQueueData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Skip Active Patient
  const handleSkipPatient = async (appointmentId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/doctor/appointments/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SKIP_PATIENT',
          appointmentId,
          doctorId,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQueueData();
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setActionLoading(false);
    }
  };

  // Specific Call
  const handleCallSpecific = async (appointmentId: string) => {
    setActionLoading(true);
    try {
      if (soundEnabled) playCallingChime();

      const res = await fetch('/api/doctor/appointments/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CALL_PATIENT',
          appointmentId,
          doctorId,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQueueData();
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Always-Open Instant Walk-in Submission
  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      setWalkInError('রোগীর নাম আবশ্যক');
      return;
    }
    setWalkInSubmitting(true);
    setWalkInError('');
    setWalkInSuccess('');
    try {
      const res = await fetch('/api/doctor/appointments/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          patientName: walkInName.trim(),
          patientPhone: walkInPhone.trim() || 'N/A',
          patientAge: 30,
          patientGender: 'Male',
          visitReason: 'সরাসরি চেম্বার সিরিয়াল',
          appointmentDate: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalkInSuccess(`সিরিয়াল #${toBanglaDigits(data.appointment.serialNumber)} (${data.appointment.patientName}) যুক্ত হয়েছে!`);
        setWalkInName('');
        setWalkInPhone('');
        await fetchQueueData();
        // Re-focus name input for fast consecutive typing
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 100);
        setTimeout(() => setWalkInSuccess(''), 4000);
      } else {
        setWalkInError(data.error || 'সিরিয়াল দিতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setWalkInError('সার্ভার ত্রুটি');
    } finally {
      setWalkInSubmitting(false);
    }
  };

  const copyDeskLink = () => {
    if (typeof window !== 'undefined' && doctorId) {
      const url = `${window.location.origin}/doctor/assistant?doctorId=${doctorId}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Find next waiting patient in line
  const nextWaiting = appointments.find((a) => a.queueStatus === 'WAITING');

  const filteredAppointments = appointments.filter((apt) => {
    return !searchQuery || 
      apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone?.includes(searchQuery) ||
      apt.appointmentCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(apt.serialNumber).includes(searchQuery);
  });

  if (loading && !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3 font-bengali">
        <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-bengali antialiased flex flex-col">
      
      {/* 1. TOP MINIMAL HEADER BAR */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 sticky top-0 z-40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Doctor Info */}
        <div className="flex items-center gap-3">
          <Link
            href="/doctor/dashboard"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            title="ড্যাশবোর্ডে ফিরুন"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {doctor?.name || 'ডাক্তার চেম্বার'}
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                অ্যাসিস্ট্যান্ট ডেস্ক
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {doctor?.chamberRoom ? `রুম: ${doctor.chamberRoom} • ` : ''}{doctor?.hospital?.name || doctor?.specialization}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playCallingChime();
            }}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              soundEnabled 
                ? 'bg-sky-50 text-sky-800 border-sky-200' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title="কলিং বেল সাউন্ড"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'সাউন্ড অন' : 'মিউট'}</span>
          </button>

          {/* Refresh */}
          <button
            onClick={() => fetchQueueData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition cursor-pointer"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* Copy Desk Link */}
          <button
            onClick={copyDeskLink}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="সহকারীর মোবাইল বা ট্যাবের জন্য লিংক কপি করুন"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">ডেস্ক লিংক</span>
          </button>

          {/* TV Screen Display Button */}
          {doctorId && (
            <a
              href={`/doctor/tv-display?doctorId=${doctorId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title="ওয়েটিং রুমের স্মার্ট টিভি বা মনিটরের জন্য লাইভ ফুল-স্ক্রিন ডিসপ্লে"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">টিভি ডিসপ্লে</span>
            </a>
          )}
        </div>

      </header>

      {/* 2. MAIN 1-CLICK DESK WORKSPACE */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* 🌟 1-CLICK MASTER CALLING CONSOLE                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* Active Patient Box (Currently in consultation) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-slate-200/80">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-xs">
                {currentActive ? `#${toBanglaDigits(currentActive.serialNumber)}` : '—'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase ${
                    currentActive 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentActive ? '🩺 বর্তমানে চেম্বারে আছেন' : '🟢 চেম্বার ফ্রি'}
                  </span>
                  {currentActive && (
                    <span className="text-xs font-mono font-bold text-slate-400">#{currentActive.appointmentCode}</span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {currentActive ? currentActive.patientName : 'পরবর্তী রোগীর অপেক্ষায়'}
                </h2>

                {currentActive && (
                  <p className="text-xs text-slate-500 font-medium">
                    মোবাইল: <span className="font-mono font-bold text-slate-700">{currentActive.patientPhone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {currentActive && (
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <Link
                  href={`/doctor/prescription?doctorId=${doctorId}&appointmentId=${currentActive.id}&phone=${currentActive.patientPhone}`}
                  className="text-xs font-black text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  title="এই রোগীর ডিজিটাল প্রেসক্রিপশন তৈরি করুন"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>প্রেসক্রিপশন লিখুন</span>
                </Link>

                <button
                  onClick={() => handleReAnnounce(currentActive)}
                  disabled={actionLoading}
                  className="text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="রোগী উপস্থিত না হলে পুনরায় উচ্চস্বরে লাউডস্পিকারে ঘোষণা দিন"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>পুনরায় ঘোষণা</span>
                </button>

                <button
                  onClick={() => handleSkipPatient(currentActive.id)}
                  disabled={actionLoading}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200/70 transition cursor-pointer"
                >
                  স্কিপ
                </button>
              </div>
            )}

          </div>

          {/* 🌟 THE SINGLE 1-CLICK MASTER BUTTON */}
          <div>
            <button
              onClick={handleCallNext}
              disabled={actionLoading || !nextWaiting}
              className={`w-full py-5 px-6 rounded-2xl font-black text-base sm:text-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer ${
                nextWaiting
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20 hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <BellRing className={`w-6 h-6 ${nextWaiting ? 'animate-bounce' : ''}`} />
              <span>
                {nextWaiting ? (
                  <>পরবর্তী রোগী ডাকুন: <span className="underline decoration-white/50">সিরিয়াল #{toBanglaDigits(nextWaiting.serialNumber)} ({nextWaiting.patientName})</span> ➔</>
                ) : (
                  '📢 পরবর্তী রোগী ডাকুন'
                )}
              </span>
            </button>
          </div>

          {/* 3 Clean Metric Counters */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-bold block">মোট সিরিয়াল</span>
              <span className="text-base font-black text-slate-900">{toBanglaDigits(stats.total)} জন</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <span className="text-[11px] text-amber-700 font-bold block">অপেক্ষারত বাকি</span>
              <span className="text-base font-black text-amber-800">{toBanglaDigits(stats.waiting)} জন</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <span className="text-[11px] text-emerald-700 font-bold block">পরামর্শ সম্পন্ন</span>
              <span className="text-base font-black text-emerald-800">{toBanglaDigits(stats.completed)} জন</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ➕ ALWAYS-OPEN FAST WALK-IN ENTRY STRIP (সরাসরি সর্বদা উন্মুক্ত ফর্ম)     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">+</span>
              <span>সরাসরি নতুন সিরিয়াল যোগ করুন (Fast Walk-in)</span>
            </h3>

            {walkInSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80 animate-in fade-in flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{walkInSuccess}</span>
              </span>
            )}
          </div>

          {walkInError && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{walkInError}</span>
            </div>
          )}

          <form onSubmit={handleWalkInSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            {/* Patient Name */}
            <div className="sm:col-span-7">
              <input
                ref={nameInputRef}
                type="text"
                placeholder="রোগীর পূর্ণ নাম *"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 transition"
                required
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-3">
              <input
                type="tel"
                placeholder="মোবাইল নম্বর (ঐচ্ছিক)"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            {/* Submit */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={walkInSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{walkInSubmitting ? '...' : 'সিরিয়াল দিন ➜'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* 📋 SEQUENTIAL QUEUE LIST                                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
          
          {/* Table Search */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="রোগীর নাম, সিরিয়াল নং বা ফোন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-400">
              মোট {toBanglaDigits(filteredAppointments.length)} জন
            </span>
          </div>

          {/* Table List */}
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-3 px-4">সিরিয়াল</th>
                    <th className="py-3 px-4">রোগীর নাম</th>
                    <th className="py-3 px-4">মোবাইল</th>
                    <th className="py-3 px-4">সময়</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredAppointments.map((apt: any) => {
                    const isCurrent = currentActive?.id === apt.id;
                    const isDone = apt.queueStatus === 'COMPLETED';

                    return (
                      <tr 
                        key={apt.id} 
                        className={`transition-colors ${
                          isCurrent 
                            ? 'bg-sky-50/70 font-semibold' 
                            : isDone
                            ? 'opacity-60 bg-slate-50/30'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-black text-sky-700 text-sm">
                          #{toBanglaDigits(apt.serialNumber)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                          {apt.isWalkIn && (
                            <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-semibold border border-teal-200">
                              Walk-in
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {apt.patientPhone}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {apt.estimatedTime || apt.timeSlot}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isDone
                              ? 'bg-slate-100 text-slate-500 border-slate-200'
                              : apt.queueStatus === 'SKIPPED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {isCurrent ? 'রুমে আছেন' : isDone ? 'সম্পন্ন' : apt.queueStatus === 'SKIPPED' ? 'অনুপস্থিত' : 'অপেক্ষারত'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isCurrent && (
                              <button
                                onClick={() => handleReAnnounce(apt)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-500 hover:text-white font-black text-[11px] transition cursor-pointer border border-amber-200 flex items-center gap-1"
                                title="পুনরায় ডাকুন ও ঘোষণা দিন"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>পুনঃঘোষণা</span>
                              </button>
                            )}

                            {apt.queueStatus === 'WAITING' && (
                              <button
                                onClick={() => handleCallSpecific(apt.id)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-bold text-[11px] transition cursor-pointer border border-sky-200"
                              >
                                ডাকুন
                              </button>
                            )}

                            <Link
                              href={`/doctor/prescription?doctorId=${doctorId}&appointmentId=${apt.id}&phone=${apt.patientPhone}`}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
                              title="প্রেসক্রিপশন লিখুন"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setPrintToken(apt)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                              title="টোকেন প্রিন্ট"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              কোনো সিরিয়াল পাওয়া যায়নি।
            </div>
          )}

        </div>

      </main>

      {/* POS THERMAL TOKEN PRINT MODAL */}
      {printToken && (
        <PosThermalTokenModal
          token={{
            ...printToken,
            fee: printToken.fee ?? doctor?.consultationFee,
          }}
          doctor={doctor || { name: 'ডাক্তার চেম্বার' }}
          autoPrint={printToken?.isAutoPrint ?? false}
          onClose={() => setPrintToken(null)}
        />
      )}

    </div>
  );
}
