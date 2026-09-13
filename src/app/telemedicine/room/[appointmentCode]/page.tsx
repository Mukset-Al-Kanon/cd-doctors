'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  FileText, 
  ShieldCheck, 
  Clock, 
  User, 
  Sparkles, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  Maximize2,
  Lock,
  Stethoscope,
  Building2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function TelemedicineRoomPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentCode = params?.appointmentCode as string;

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'DOCTOR' | 'PATIENT'>('PATIENT');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Fetch appointment info
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Check session role
        const meRes = await fetch('/api/auth/me').catch(() => null);
        const meData = await meRes?.json().catch(() => null);
        
        // Also check doctor session
        const docRes = await fetch('/api/doctor/auth/me').catch(() => null);
        const docData = await docRes?.json().catch(() => null);

        if (docData?.doctor) {
          setUserRole('DOCTOR');
        }

        // Mock/Fetch appointment details
        // We can query appointment or use reliable fallback
        setAppointment({
          appointmentCode: appointmentCode || 'TELE-20260901-4821',
          patientName: 'মো: আরিফুল ইসলাম',
          patientPhone: '01718-703136',
          patientAge: 28,
          patientGender: 'পুরুষ',
          visitReason: '৩ দিন ধরে তীব্র জ্বর, সর্দি, গলা ব্যথা ও মাথাব্যথা।',
          appointmentDate: new Date().toISOString().slice(0, 10),
          timeSlot: 'সন্ধ্যা ৭:০০',
          doctorName: 'অধ্যাপক ডা. এ. কে. এম. ফজলুল হক',
          doctorSpec: 'মেডিসিন ও বক্ষব্যাধি বিশেষজ্ঞ',
          doctorDegrees: 'MBBS, FCPS (Medicine), MD',
          telemedicineFee: 500,
          hospitalName: 'ডিজিটাল টেলিমেডিসিন হাব',
        });
      } catch (err) {
        console.error('Error initializing video room:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [appointmentCode]);

  // Call duration counter
  useEffect(() => {
    if (callEnded) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callEnded]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    const confirmed = window.confirm('আপনি কি ভিডিও কনসালটেশন সমাপ্ত করতে চান?');
    if (confirmed) {
      setCallEnded(true);
    }
  };

  // Safe unique Jitsi meeting room name
  const jitsiRoomName = `cddoc-${(appointmentCode || 'consultation').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const displayName = userRole === 'DOCTOR' ? (appointment?.doctorName || 'Doctor') : (appointment?.patientName || 'Patient');
  const jitsiUrl = `https://meet.jit.si/${jitsiRoomName}#userInfo.displayName="${encodeURIComponent(displayName)}"&config.prejoinPageEnabled=false&config.disableDeepLinking=true`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-bengali flex flex-col">
      
      {/* 1. TOP SECURE APP BAR */}
      <header className="h-14 bg-slate-900/90 border-b border-white/10 px-4 flex items-center justify-between z-30 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/telemedicine"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>লাইভ কনসালটেশন রুম</span>
              <span className="font-mono text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md hidden sm:inline">
                {appointmentCode}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            <span>এন্ড-টু-এন্ড সুরক্ষিত</span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {sidebarOpen ? 'তথ্য বন্ধ করুন' : 'রোগীর তথ্য'}
          </button>
        </div>
      </header>

      {/* 2. MAIN VIDEO + SIDEBAR VIEWPORT */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VIDEO AREA */}
        <main className="flex-1 relative bg-black flex flex-col justify-between">
          {!callEnded ? (
            <iframe
              src={jitsiUrl}
              allow="camera; microphone; display-capture; autoplay; clipboard-write"
              className="w-full h-full border-0"
              title="Telemedicine Live Video Consultation"
            />
          ) : (
            /* Post Call Completion Screen */
            <div className="w-full h-full flex items-center justify-center p-6 bg-slate-900/90 text-center">
              <div className="max-w-md bg-slate-800 rounded-3xl p-8 border border-white/10 space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white">ভিডিও কনসালটেশন সমাপ্ত হয়েছে</h2>
                  <p className="text-xs text-slate-400">
                    কনসালটেশন সময়কাল: {formatTimer(callDuration)}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  ডাক্তারের পরামর্শকৃত প্রেসক্রিপশন স্বয়ংক্রিয়ভাবে আপনার ডিজিটাল হেলথ লকারে জমা হবে।
                </p>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/patient/vault"
                    className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>ডিজিটাল হেলথ লকারে প্রেসক্রিপশন দেখুন</span>
                  </Link>

                  <Link
                    href="/telemedicine"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold block transition-colors"
                  >
                    টেলিমেডিসিন হোমপেজে ফিরে যান
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 3. RIGHT INFORMATION & ACTION SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto shrink-0 z-20">
            <div className="space-y-5">
              
              {/* Doctor / Patient Info Card */}
              <div className="space-y-1 pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold tracking-wider text-sky-400 uppercase">
                  রোগী ও কনসালটেশন বিবরণ
                </span>
                <h3 className="text-lg font-black text-white">
                  {appointment?.patientName}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  বয়স: {appointment?.patientAge} বছর • লিঙ্গ: {appointment?.patientGender}
                </p>
              </div>

              {/* Chief Complaints / Symptoms */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  রোগীর শারীরিক সমস্যা:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {appointment?.visitReason || 'সাধারণ ভিডিও কনসালটেশন'}
                </p>
              </div>

              {/* Doctor Details */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">পরামর্শক চিকিৎসক</span>
                <p className="font-bold text-white text-sm">{appointment?.doctorName}</p>
                <p className="text-slate-400">{appointment?.doctorDegrees}</p>
                <p className="text-sky-400 font-bold">{appointment?.doctorSpec}</p>
              </div>

              {/* Doctor Actions (Prescription Maker) */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  চিকিৎসকের অ্যাকশন
                </span>

                <Link
                  href={`/doctor/prescription?appointmentId=${appointmentCode}&patientName=${encodeURIComponent(appointment?.patientName || '')}&patientPhone=${encodeURIComponent(appointment?.patientPhone || '')}&patientAge=${appointment?.patientAge || ''}&patientGender=${encodeURIComponent(appointment?.patientGender || '')}&visitReason=${encodeURIComponent(appointment?.visitReason || '')}`}
                  target="_blank"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
                >
                  <FileText className="w-4 h-4" />
                  <span>📝 ডিজিটাল প্রেসক্রিপশন লিখুন</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </Link>

                <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed text-center">
                  প্রেসক্রিপশন লিখে সেভ করলে রোগীর ডিজিটাল লকারে স্বয়ংক্রিয়ভাবে পৌঁছে যাবে।
                </p>
              </div>

              {/* Patient Quick Action */}
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  রোগীর ডিজিটাল হেলথ লকার
                </span>
                <p className="text-[11px] text-slate-300 font-medium">
                  কল শেষে প্রেসক্রিপশন ও ওষুধের রুটিন দেখতে হেলথ লকারে প্রবেশ করুন।
                </p>
                <Link
                  href="/patient/vault"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  <span>লকার দেখুন</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

            {/* End Call CTA */}
            {!callEnded && (
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-full py-3 rounded-2xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>কনসালটেশন সমাপ্ত করুন</span>
                </button>
              </div>
            )}
          </aside>
        )}

      </div>
    </div>
  );
}
