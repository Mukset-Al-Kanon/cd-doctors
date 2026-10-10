'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Stethoscope, 
  Users, 
  CheckCircle2, 
  Activity,
  AlertCircle
} from 'lucide-react';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatSerialBangla(serial: number | string | null | undefined): string {
  if (!serial && serial !== 0) return '০১';
  const num = parseInt(serial.toString().replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return toBanglaDigits(serial);
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toBanglaDigits(padded);
}

// Web Audio Calling Chime
function playHospitalChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
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
      gain2.gain.setValueAtTime(0.45, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.9);
    }, 180);
  } catch (e) {
    // Audio not supported
  }
}

function HospitalTvDisplayContent() {
  const searchParams = useSearchParams();
  const hospitalId = searchParams.get('hospitalId') || '';
  const hospitalSlug = searchParams.get('hospitalSlug') || searchParams.get('slug') || '';

  const [hospital, setHospital] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const prevCallingIdsRef = useRef<Set<string>>(new Set());

  // Clock in Bangla
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const isPm = hours >= 12;
      hours = hours % 12;
      if (hours === 0) hours = 12;

      const timeStr = `${toBanglaDigits(hours.toString().padStart(2, '0'))}:${toBanglaDigits(minutes.toString().padStart(2, '0'))}:${toBanglaDigits(seconds.toString().padStart(2, '0'))} ${isPm ? 'PM' : 'AM'}`;
      setCurrentTime(timeStr);

      const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
      const dateStr = `${daysBn[now.getDay()]}, ${toBanglaDigits(now.getDate())} ${monthsBn[now.getMonth()]}, ${toBanglaDigits(now.getFullYear())}`;
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Live Queue Data
  const fetchTvQueue = useCallback(async () => {
    try {
      let url = '/api/hospital/reception/queue?';
      if (hospitalId) url += `hospitalId=${hospitalId}`;
      else if (hospitalSlug) url += `hospitalSlug=${hospitalSlug}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setHospital(data.hospital);
        setDoctors(data.doctors || []);

        // Detect if any new patient is being called to play audio chime
        const currentCallingIds = new Set<string>();
        (data.doctors || []).forEach((d: any) => {
          (d.appointments || []).forEach((a: any) => {
            if (a.queueStatus === 'CALLING') {
              currentCallingIds.add(a.id);
            }
          });
        });

        // Check if there is a new call
        let hasNewCall = false;
        currentCallingIds.forEach((id) => {
          if (!prevCallingIdsRef.current.has(id)) {
            hasNewCall = true;
          }
        });

        if (hasNewCall && soundEnabled) {
          playHospitalChime();
        }

        prevCallingIdsRef.current = currentCallingIds;
      }
    } catch (e) {
      console.error('TV queue fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [hospitalId, hospitalSlug, soundEnabled]);

  useEffect(() => {
    fetchTvQueue();
    // Poll every 5 seconds for live hospital TV sync
    const interval = setInterval(fetchTvQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchTvQueue]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-bengali flex flex-col justify-between select-none overflow-hidden">
      
      {/* Top TV Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between backdrop-blur-md">
        
        {/* Hospital Branding */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center font-black text-white shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                লাইভ লবি ওপিডি ডিসপ্লে
              </span>
              <span className="text-xs text-slate-400 font-bold">চুয়াডাঙ্গা</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {hospital?.name || 'হাসপাতাল সেন্ট্রাল চেম্বার'}
            </h1>
          </div>
        </div>

        {/* Live Clock & Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xl font-black text-amber-300 font-mono tracking-wider">
              {currentTime}
            </div>
            <div className="text-xs text-slate-400 font-bold">
              {currentDate}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-400 hover:bg-sky-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-400'
              }`}
              title={soundEnabled ? 'সাউন্ড চালু আছে' : 'সাউন্ড বন্ধ'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="ফুলস্ক্রিন (F11)"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </header>

      {/* Main TV Screen: Multi-Doctor Cards */}
      <main className="flex-1 p-5 sm:p-6 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-bold text-lg animate-pulse">
            লাইভ ডিসপ্লে সিঙ্ক হচ্ছে...
          </div>
        ) : doctors.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-bold text-base">
            বর্তমানে কোনো অ্যাক্টিভ চেম্বার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {doctors.map((doc) => {
              const activeAppt = doc.activeAppointment;
              const isCalling = activeAppt?.queueStatus === 'CALLING';
              const isInConsultation = activeAppt?.queueStatus === 'IN_CONSULTATION';

              // Upcoming 3 waiting serials
              const upcomingSerials = (doc.appointments || [])
                .filter((a: any) => a.queueStatus === 'WAITING')
                .slice(0, 3)
                .map((a: any) => formatSerialBangla(a.serialNumber));

              return (
                <div
                  key={doc.id}
                  className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg ${
                    isCalling
                      ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/30'
                      : isInConsultation
                      ? 'bg-sky-950/40 border-sky-500/70 ring-1 ring-sky-500/20'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  
                  {/* Doctor Info Header */}
                  <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-3 bg-slate-900/60">
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-sky-400 bg-sky-950/90 px-2.5 py-1 rounded-lg border border-sky-800/60 inline-block mb-1">
                        {doc.chamberRoom || 'চেম্বার রুম'}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                        {doc.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-400 line-clamp-1">
                        {doc.specialization}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-md block">
                        মোট {toBanglaDigits(doc.stats?.total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Central Serial Display Box */}
                  <div className="p-6 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
                      {isCalling
                        ? '📢 চেম্বারে প্রবেশ করুন'
                        : isInConsultation
                        ? '🩺 পরামর্শ চলছে'
                        : 'বর্তমান চলমান সিরিয়াল'}
                    </span>

                    {doc.runningSerial ? (
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`text-6xl sm:text-7xl font-black tracking-tight px-6 py-2 rounded-3xl transition-all ${
                            isCalling
                              ? 'text-amber-300 bg-amber-500/20 border-2 border-amber-400 animate-pulse scale-105'
                              : 'text-sky-300 bg-sky-500/10 border border-sky-400/40'
                          }`}
                        >
                          {formatSerialBangla(doc.runningSerial)}
                        </div>
                        {activeAppt?.patientName && (
                          <div className="text-base sm:text-lg font-black text-slate-200 mt-1">
                            {activeAppt.patientName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4 text-slate-500 font-black text-xl">
                        চেম্বার অপেক্ষমাণ
                      </div>
                    )}
                  </div>

                  {/* Upcoming Queue Bottom Bar */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">পরবর্তী সিরিয়াল:</span>
                      {upcomingSerials.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {upcomingSerials.map((s: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono font-black"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600">আর কেউ নেই</span>
                      )}
                    </div>

                    <span className="text-slate-400 font-black">
                      অপেক্ষমাণ: <span className="text-amber-400">{toBanglaDigits(doc.stats?.waiting || 0)}</span>
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Ticker Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-400">
        <div className="flex items-center gap-2 text-sky-400 font-black">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>CD Doctors সেন্ট্রাল লাইভ কিউ ডিসপ্লে</span>
        </div>
        <div className="text-slate-400 hidden sm:block">
          রোগীর সুবিধা ও শৃঙ্খলা রক্ষায় সিরিয়াল অনুযায়ী নির্ধারিত সময়ে চেম্বারে প্রবেশ করুন।
        </div>
        <div className="text-amber-400 font-mono font-bold">
          LIVE SYNC
        </div>
      </footer>

    </div>
  );
}

export default function HospitalTvDisplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold">টিভি ডিসপ্লে লোড হচ্ছে...</div>}>
      <HospitalTvDisplayContent />
    </Suspense>
  );
}
