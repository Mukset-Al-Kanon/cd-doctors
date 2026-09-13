'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Volume2, 
  ChevronLeft, 
  Ticket, 
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

export default function AppointmentTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentCode = params.appointmentCode as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLiveQueue = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/appointments/live-queue?code=${appointmentCode}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
        setError('');
        setLastUpdated(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setError(json.error || 'সিরিয়াল ট্র্যাকিং ডেটা পাওয়া যায়নি।');
      }
    } catch (err: any) {
      if (!data) setError('সার্ভার থেকে লাইভ সিরিয়াল লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!appointmentCode) return;
    fetchLiveQueue();

    // Auto-refresh every 12 seconds
    const interval = setInterval(() => {
      fetchLiveQueue();
    }, 12000);

    return () => clearInterval(interval);
  }, [appointmentCode]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-slate-700">লাইভ সিরিয়াল ট্র্যাকার লোড হচ্ছে...</p>
        <p className="text-xs text-slate-400">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-slate-800">সিরিয়াল তথ্য পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-500">{error || 'অনুগ্রহ করে সঠিক টোকেন কোড দিয়ে আবার চেষ্টা করুন।'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/serial-tracker" className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs">
            সিরিয়াল সার্চ করুন
          </Link>
          <Link href="/doctors" className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
            সকল ডাক্তার
          </Link>
        </div>
      </div>
    );
  }

  const patient = data.patientInfo;
  const doctor = data.doctor;
  const currentServing = data.currentServing;
  const isMyTurnCalling = patient?.queueStatus === 'CALLING' || patient?.queueStatus === 'IN_CONSULTATION';
  const isCompleted = patient?.queueStatus === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      
      {/* Top Bar Navigation & Refresh */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/serial-tracker"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>সিরিয়াল ট্র্যাকার হোম</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
            সর্বশেষ আপডেট: {lastUpdated}
          </span>
          <button
            onClick={() => fetchLiveQueue(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition cursor-pointer"
            title="লাইভ রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* CALLING / ALERT BANNER */}
      {isMyTurnCalling ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg animate-bounce duration-1000 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">📢 আপনার সিরিয়াল ডাকা হয়েছে!</h3>
              <p className="text-xs text-emerald-100 font-medium">
                অনুগ্রহ করে অবিলম্বে ডাক্তারের রুম <span className="font-bold underline">({doctor?.chamberRoom || 'মূল চেম্বার'})</span>-এ প্রবেশ করুন।
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-xs">
            এখনই রুমে যান ➔
          </span>
        </div>
      ) : patient?.isNextInLine ? (
        <div className="p-4 rounded-2xl bg-amber-500 text-white shadow-md flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="text-xs">
            <p className="font-black text-sm">⚠️ আপনার সিরিয়াল অত্যন্ত সন্নিকটে!</p>
            <p className="text-amber-100 font-medium">অনুগ্রহ করে চেম্বারের ওয়েটিং রুমে প্রস্তুত থাকুন। যেকোনো মুহূর্তে আপনাকে ডাকা হবে।</p>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="p-4 rounded-2xl bg-slate-800 text-white shadow-md flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-black text-sm">✅ আপনার কনসালটেশন সম্পন্ন হয়েছে</p>
            <p className="text-slate-300 font-medium">পরবর্তী প্রেসক্রিপশন ও ওষুধের রিমাইন্ডার আপনার অ্যাকাউন্টে দেখতে পারবেন। সুস্থ থাকুন!</p>
          </div>
        </div>
      ) : null}

      {/* HERO LIVE QUEUE DISPLAY (2 BIG CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CARD 1: NOW SERVING (চলতি সিরিয়াল) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              চলতি সিরিয়াল (Now Serving)
            </span>
            <Activity className="w-5 h-5 text-emerald-200" />
          </div>

          <div className="py-2">
            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              {currentServing?.serialNumber > 0 ? (
                `#${toBanglaDigits(currentServing.serialNumber)}`
              ) : (
                <span className="text-2xl font-bold opacity-80">শুরু হয়নি</span>
              )}
            </div>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              {currentServing?.status === 'IN_CONSULTATION' 
                ? 'ডাক্তার রোগী দেখছেন' 
                : currentServing?.status === 'CALLING' 
                ? 'পরবর্তী রোগীকে ডাকা হচ্ছে...' 
                : 'চেম্বার প্রস্তুত'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
            <span>আজকের মোট রোগী: {toBanglaDigits(data.stats?.total || 0)} জন</span>
            <span>সম্পন্ন: {toBanglaDigits(data.stats?.completed || 0)}</span>
          </div>
        </div>

        {/* CARD 2: YOUR SERIAL (আপনার সিরিয়াল ও ওয়েটিং টাইম) */}
        <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider">
              আপনার সিরিয়াল
            </span>
            <Ticket className="w-5 h-5 text-sky-200" />
          </div>

          <div className="py-2">
            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              #{toBanglaDigits(patient?.serialNumber || 0)}
            </div>
            <p className="text-xs text-sky-100 font-medium mt-1">
              টোকেন কোড: <span className="font-mono font-bold tracking-wider">{patient?.appointmentCode}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-sky-200 block text-[10.5px]">আপনার আগে বাকি:</span>
              <span className="font-black text-sm">
                {patient?.patientsAhead !== undefined ? `${toBanglaDigits(patient.patientsAhead)} জন রোগী` : '—'}
              </span>
            </div>
            <div>
              <span className="text-sky-200 block text-[10.5px]">আনুমানিক সময়:</span>
              <span className="font-black text-sm">
                {patient?.estimatedTime || `~${toBanglaDigits(patient?.estimatedWaitMinutes || 0)} মিনিট`}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* DOCTOR & CHAMBER SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-100 overflow-hidden shrink-0">
              <img
                src={doctor?.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                alt={doctor?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-nuvicaNavy-900 leading-snug">{doctor?.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{doctor?.degrees}</p>
              <p className="text-xs font-bold text-sky-700 mt-0.5">{doctor?.specialization}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {doctor?.phone && (
              <a
                href={`tel:${doctor.phone}`}
                className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>চেম্বারে কল দিন</span>
              </a>
            )}

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>স্লিপ প্রিন্ট</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px]">চেম্বার / স্থান</span>
            <p className="font-bold text-slate-800">{patient?.chamberName || doctor?.hospitalName || 'প্রধান চেম্বার'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px]">রুম নম্বর</span>
            <p className="font-bold text-slate-800">{doctor?.chamberRoom || 'নির্ধারিত রুম'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
            <span className="text-slate-400 font-medium text-[11px]">তারিখ</span>
            <p className="font-bold text-slate-800">{data.date}</p>
          </div>
        </div>
      </div>

      {/* TODAY'S QUEUE TIMELINE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-nuvicaNavy-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>আজকের সিরিয়াল কিউ (Queue Timeline)</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            মোট {toBanglaDigits(data.queueList?.length || 0)} টি সিরিয়াল
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {data.queueList?.map((q: any) => {
            const isMe = q.serialNumber === patient?.serialNumber;
            const isCurrent = q.serialNumber === currentServing?.serialNumber && currentServing?.serialNumber > 0;
            const isDone = q.queueStatus === 'COMPLETED';
            const isSkipped = q.queueStatus === 'SKIPPED';

            let bgClass = 'bg-slate-50 text-slate-600 border-slate-200';
            if (isCurrent) bgClass = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300 font-black';
            else if (isMe) bgClass = 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300 font-black';
            else if (isDone) bgClass = 'bg-slate-100 text-slate-400 line-through border-slate-200';
            else if (isSkipped) bgClass = 'bg-rose-50 text-rose-500 border-rose-200';

            return (
              <div
                key={q.serialNumber}
                className={`p-2.5 rounded-2xl border text-center text-xs transition-all ${bgClass}`}
                title={`সিরিয়াল #${q.serialNumber} (${q.queueStatus})`}
              >
                <span className="font-bold block text-sm">#{toBanglaDigits(q.serialNumber)}</span>
                <span className="text-[10px] block opacity-80 truncate">
                  {isCurrent ? 'চলতি' : isMe ? 'আপনার' : isDone ? 'সম্পন্ন' : isSkipped ? 'স্কিপ' : 'অপেক্ষায়'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
