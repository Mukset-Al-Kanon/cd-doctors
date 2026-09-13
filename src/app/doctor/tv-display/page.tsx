'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Users, 
  CheckCircle2, 
  UserCheck, 
  Activity, 
  Stethoscope, 
  Sparkles,
  ShieldCheck,
  BellRing,
  BadgeCheck
} from 'lucide-react';

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatSerialBangla(serial: number | string | null | undefined): string {
  if (serial === null || serial === undefined || serial === '') return '০১';
  const cleanStr = serial.toString().replace(/[^0-9]/g, '');
  const num = parseInt(cleanStr, 10);
  if (isNaN(num)) return toBanglaDigits(serial);
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toBanglaDigits(padded);
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const monthNamesBn = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const mIdx = parseInt(month, 10) - 1;
      const monthName = monthNamesBn[mIdx] || month;
      return `${toBanglaDigits(parseInt(day, 10))} ${monthName}, ${toBanglaDigits(year)}`;
    }
    return toBanglaDigits(dateStr);
  } catch {
    return toBanglaDigits(dateStr);
  }
}

// Clean Web Audio Synthesizer for pleasant Hospital Ding-Dong Calling Chime
function playHospitalChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Note 1 (High bell)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.7);

    // Note 2 (Low bell)
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain2.gain.setValueAtTime(0.4, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 1.0);
      } catch {}
    }, 220);
  } catch (err) {
    console.log('Audio chime error:', err);
  }
}

// Bengali Natural Number Words for 100% Native Human Speech Flow
const banglaNumberWords: { [key: number]: string } = {
  0: 'শূন্য', 1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ', 6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়', 10: 'দশ',
  11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ', 15: 'পনেরো', 16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ', 20: 'বিশ',
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ', 26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আটাশ', 29: 'উনত্রিশ', 30: 'ত্রিশ',
  31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ', 36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'উনচল্লিশ', 40: 'চল্লিশ',
  41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ', 46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'উনপঞ্চাশ', 50: 'পঞ্চাশ',
  51: 'একান্ন', 52: 'বায়ান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন', 56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'উনষাট', 60: 'ষাট',
  61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি', 66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'উনসত্তর', 70: 'সত্তর',
  71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর', 76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'উনাশি', 80: 'আশি',
  81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি', 86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'অষ্টআশি', 89: 'উননব্বই', 90: 'নব্বই',
  91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই', 96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই', 100: 'এক শত'
};

function toSpokenBanglaNumber(val: string | number): string {
  const num = parseInt(val.toString().replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return val.toString();
  if (banglaNumberWords[num]) return banglaNumberWords[num];
  if (num > 100 && num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rem = num % 100;
    const hWord = hundreds === 1 ? 'এক শ' : hundreds === 2 ? 'দুই শ' : hundreds === 3 ? 'তিন শ' : `${banglaNumberWords[hundreds] || hundreds} শ`;
    return rem === 0 ? hWord : `${hWord} ${banglaNumberWords[rem] || rem}`;
  }
  return num.toString();
}

function cleanBanglaName(name: string): string {
  if (!name) return '';
  return name
    .replace(/^মো[ঃ:]\s*/i, 'মোহাম্মদ ')
    .replace(/^মো\.\s*/i, 'মোহাম্মদ ')
    .replace(/^মোঃ\s*/i, 'মোহাম্মদ ')
    .replace(/^মুহা[ঃ:]\s*/i, 'মুহাম্মদ ')
    .replace(/^মুহা\.\s*/i, 'মুহাম্মদ ')
    .replace(/^মুহাম্মদ\s*/i, 'মুহাম্মদ ')
    .replace(/^ডা[ঃ:]\s*/i, 'ডাক্তার ')
    .replace(/^ডা\.\s*/i, 'ডাক্তার ')
    .trim();
}

// Fallback browser speech synthesis if needed
function speakBanglaFallback(speechText: string) {
  if (typeof window === 'undefined') return;
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.lang = 'bn-BD';

      const voices = window.speechSynthesis.getVoices();
      const bdVoice = voices.find(v => 
        v.name.includes('Nabanita') || 
        v.name.includes('Pradeep') || 
        (v.name.includes('Natural') && (v.lang === 'bn-BD' || v.lang === 'bn_BD')) ||
        v.lang === 'bn-BD' || v.lang === 'bn_BD'
      ) || voices.find(v => v.lang.startsWith('bn'));

      if (bdVoice) utterance.voice = bdVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

// Automatic Hospital Voice Announcement (Guaranteed Studio MP3 Audio Stream)
function playVoiceAnnouncement(
  currentPatient: { serialNumber: string | number; patientName: string } | null,
  nextPatientData?: { serialNumber: string | number; patientName: string } | null,
  roomText?: string,
  isReAnnounce = false
) {
  if (typeof window === 'undefined' || !currentPatient) return;

  // 1. Play pleasant hospital ding-dong bell first
  playHospitalChime();

  // 2. Prepare Bangla announcement text in natural spoken words
  const serialSpoken = toSpokenBanglaNumber(currentPatient.serialNumber);
  const patientSpoken = cleanBanglaName(currentPatient.patientName);
  const roomSpoken = roomText ? `, ${roomText} এ আসুন` : ', ডাক্তারের চেম্বারে আসুন';
  
  let speechText = '';
  if (isReAnnounce) {
    // Re-Announce ONLY this specific patient
    speechText = `পুনরায় ঘোষণা করা হচ্ছে। সিরিয়াল নম্বর ${serialSpoken}, রোগী ${patientSpoken}${roomSpoken}।`;
  } else {
    // Fresh New Call: Announce current patient + next patient
    speechText = `সিরিয়াল নম্বর ${serialSpoken}, রোগী ${patientSpoken}${roomSpoken}।`;
    if (nextPatientData && nextPatientData.serialNumber && nextPatientData.patientName) {
      const nextSerialSpoken = toSpokenBanglaNumber(nextPatientData.serialNumber);
      const nextPatientSpoken = cleanBanglaName(nextPatientData.patientName);
      speechText += ` পরবর্তী সিরিয়াল নম্বর ${nextSerialSpoken}, রোগী ${nextPatientSpoken}, অনুগ্রহ করে প্রস্তুত থাকুন।`;
    }
  }

  // 3. Play Direct Bengali Audio Stream after bell (650ms)
  setTimeout(() => {
    try {
      const audioUrl = `/api/doctor/tts?text=${encodeURIComponent(speechText)}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = 0.95;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Direct MP3 playback warning, using speech fallback:', err);
          speakBanglaFallback(speechText);
        });
      }
    } catch (e) {
      speakBanglaFallback(speechText);
    }
  }, 650);
}

export default function DoctorTvDisplayPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId') || '';

  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, waiting: 0, calling: 0, inConsultation: 0, skipped: 0 });
  const [currentCalling, setCurrentCalling] = useState<any>(null);
  const [nextPatient, setNextPatient] = useState<any>(null);
  const [upcomingPatients, setUpcomingPatients] = useState<any[]>([]);
  
  const [currentTime, setCurrentTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const prevActiveIdRef = useRef<string | null>(null);
  const prevCalledAtRef = useRef<string | null>(null);

  // 1. Digital Clock Live Ticker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const isPm = h >= 12;
      h = h % 12 || 12;
      const timeStr = `${toBanglaDigits(h.toString().padStart(2, '0'))}:${toBanglaDigits(m.toString().padStart(2, '0'))}:${toBanglaDigits(s.toString().padStart(2, '0'))} ${isPm ? 'PM' : 'AM'}`;
      setCurrentTime(timeStr);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Doctor Profile
  useEffect(() => {
    if (!doctorId) return;
    async function loadDoctor() {
      try {
        const res = await fetch(`/api/doctors/detail?id=${doctorId}`);
        const data = await res.json();
        if (data.doctor) {
          setDoctor(data.doctor);
        }
      } catch (err) {
        console.error('Doctor fetch error:', err);
      }
    }
    loadDoctor();
  }, [doctorId]);

  // Pre-load Speech Synthesis Voices for instantaneous playback
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const venueName = doctor?.hospital?.name || doctor?.chamberAddress || doctor?.schedules?.[0]?.chamberName || 'মূল চেম্বার';
  const rawRoom = doctor?.chamberRoom || '';
  const cleanRoom = rawRoom.replace(/^(রুম\s*নং|রুম\s*নম্বর|রুম|Room\s*No\.?|Room)\s*:?\s*/i, '').trim();
  const roomText = cleanRoom ? `রুম ${toBanglaDigits(cleanRoom)}` : '';

  // 3. Fetch Live Queue & Auto Announcement
  const todayStr = new Date().toISOString().split('T')[0];

  const fetchLiveQueue = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`/api/doctor/appointments/list?doctorId=${doctorId}&date=${todayStr}`);
      const data = await res.json();
      if (data.success && data.appointments) {
        const allList: any[] = data.appointments;
        setAppointments(allList);
        setStats(data.stats || { total: 0, completed: 0, waiting: 0, calling: 0, inConsultation: 0, skipped: 0 });

        // Identify Active Calling (CALLING or IN_CONSULTATION)
        const active = allList.find((a) => a.queueStatus === 'CALLING' || a.queueStatus === 'IN_CONSULTATION') || null;
        setCurrentCalling(active);

        // Remaining Waiting patients
        const waitingList = allList.filter((a) => a.queueStatus === 'WAITING' && a.id !== active?.id);
        const nextInLine = waitingList[0] || null;
        setNextPatient(nextInLine);
        setUpcomingPatients(waitingList.slice(1, 6));

        // Sound + Voice Announcement trigger
        if (active) {
          const isFirstLoad = prevActiveIdRef.current === null;
          const isNewPatient = active.id !== prevActiveIdRef.current;
          const isRecall = !isNewPatient && Boolean(active.calledAt && active.calledAt !== prevCalledAtRef.current);

          if (soundEnabled && !isFirstLoad && (isNewPatient || isRecall)) {
            playVoiceAnnouncement(active, nextInLine, roomText, isRecall);
          }

          prevActiveIdRef.current = active.id;
          prevCalledAtRef.current = active.calledAt || null;
        }
      }
    } catch (err) {
      console.error('Live queue fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId, todayStr, soundEnabled, roomText]);

  // Live Auto Polling every 3.5 seconds
  useEffect(() => {
    if (doctorId) {
      fetchLiveQueue();
      const interval = setInterval(fetchLiveQueue, 3500);
      return () => clearInterval(interval);
    }
  }, [doctorId, fetchLiveQueue]);

  // Fullscreen Handler
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
    <div className="h-screen w-screen bg-[#F4F6F9] text-slate-900 flex flex-col justify-between font-sans select-none overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (BRANDING, VENUE & LIVE DIGITAL CLOCK)                     */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 px-6 py-3 flex items-center justify-between shadow-2xs shrink-0 z-10">
        
        {/* Left: Brand Badge & Chamber Location */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3.5 py-1.5 rounded-xl text-sky-800 font-black text-sm tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>CD DOCTORS LIVE OPD</span>
          </div>

          <div className="flex items-center gap-2 text-slate-800 text-sm font-bold pl-3 border-l-2 border-slate-200">
            <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-slate-500 font-medium">চেম্বার:</span>
            <span className="font-black text-slate-950 text-base">{venueName}</span>
            {roomText && (
              <span className="text-sky-800 font-black bg-sky-100 px-2.5 py-0.5 rounded-lg border border-sky-200">
                {roomText}
              </span>
            )}
          </div>
        </div>

        {/* Right: Digital Clock, Date & Controls */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-lg font-black text-nuvicaNavy-950 font-mono tracking-tight flex items-center gap-2 justify-end">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>{currentTime}</span>
            </div>
            <div className="text-xs font-bold text-slate-500">
              {formatDisplayDate(todayStr)}
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 pl-3 border-l-2 border-slate-200">
            {/* Voice Announcement Test Button */}
            <button
              onClick={() => {
                const testCurrent = currentCalling || { serialNumber: 8, patientName: 'মোঃ করিম' };
                const testNext = nextPatient || { serialNumber: 9, patientName: 'সাদিয়া আক্তার' };
                playVoiceAnnouncement(testCurrent, testNext, roomText);
              }}
              title="অডিও ঘোষণা শুনুন"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-black transition cursor-pointer shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>ভয়েস টেস্ট</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'সাউন্ড ও ভয়েস বন্ধ করুন' : 'সাউন্ড ও ভয়েস চালু করুন'}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
                  : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title="ফুল-স্ক্রিন মোড"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 16:9 SPLIT VIEW                                                  */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-5 grid grid-cols-12 gap-5 items-stretch overflow-hidden min-h-0">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: FULL-BLEED PORTRAIT DOCTOR CARD (EXACT MATCH TO REFERENCE) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-0 flex flex-col">
          
          {/* Exact Portrait Card Container with Soft White Border Frame */}
          <div className="relative h-full w-full rounded-[40px] overflow-hidden border-[6px] border-white/90 shadow-xl bg-slate-100 group">
            
            {/* 1. Doctor Full-Bleed Background Photo */}
            {doctor?.photoUrl ? (
              <img
                src={doctor.photoUrl}
                alt={doctor.name || 'Doctor'}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-900 via-slate-800 to-slate-950 flex items-center justify-center">
                <Stethoscope className="w-24 h-24 text-sky-400/40" />
              </div>
            )}

            {/* 2. Glassmorphic Frosted Glass Layer (Background Blur Only with Gradient Mask) */}
            <div 
              className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-white/70 via-white/40 to-transparent backdrop-blur-2xl pointer-events-none rounded-b-[34px]"
              style={{
                WebkitBackdropFilter: 'blur(30px)',
                backdropFilter: 'blur(30px)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
              }}
            />

            {/* 3. Text & Credentials Layer (100% Solid & Crisp - Absolutely No Mask Fading) */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 space-y-3.5">
              
              {/* Doctor Name & Scalloped Verified Checkmark Badge */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl sm:text-5xl lg:text-[46px] font-black text-slate-950 leading-tight tracking-tight">
                    {doctor?.name || 'ডাক্তার প্রোফাইল'}
                  </h2>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  </div>
                </div>

                {/* Specialization (100% Solid Bold Sky Blue) */}
                {doctor?.specialization && (
                  <p className="text-base sm:text-lg lg:text-xl font-black text-sky-900 leading-snug pt-0.5">
                    {doctor.specialization}
                  </p>
                )}

                {/* Degrees (100% Solid Dark Slate) */}
                {doctor?.degrees && (
                  <p className="text-sm sm:text-base text-slate-800 font-bold leading-relaxed line-clamp-2 pt-0.5">
                    {doctor.degrees}
                  </p>
                )}
              </div>

              {/* Bottom Action / Chamber Bar (Matching Reference Layout) */}
              <div className="pt-3 border-t border-slate-300/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 min-w-0">
                  <Building2 className="w-4 h-4 text-sky-700 shrink-0" />
                  <span className="text-slate-600 font-medium shrink-0">চেম্বার:</span>
                  <span className="font-black text-slate-950 truncate">{venueName}</span>
                </div>
                
                {/* Floating Pill Button for Room (Like 'Follow +' Pill in Reference) */}
                {roomText && (
                  <div className="bg-white/90 shadow-sm border border-slate-200/90 px-3.5 py-1.5 rounded-full font-black text-xs text-slate-950 shrink-0 flex items-center gap-1">
                    {roomText}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Live Queue Table & Calling Rows (8 cols / ~67%)          */}
        {/* ----------------------------------------------------------------------- */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between h-full space-y-3.5 min-h-0">
          
          <div className="bg-white rounded-[40px] border-[6px] border-white/90 shadow-xl p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5 overflow-hidden min-h-0">
            
            {/* 1. TOP HEADER & QUEUE STATUS BAR */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                <h3 className="font-black text-slate-950 text-base sm:text-lg tracking-tight">
                  লাইভ সিরিয়াল কলিং বোর্ড
                </h3>
              </div>

              {/* Status Summary Pills */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
                  রানিং: <strong className="font-sans font-black text-sm text-emerald-950">{currentCalling ? formatSerialBangla(currentCalling.serialNumber) : '--'}</strong>
                </span>
                <span className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-xl">
                  পরবর্তী: <strong className="font-sans font-black text-sm text-sky-950">{nextPatient ? formatSerialBangla(nextPatient.serialNumber) : '--'}</strong>
                </span>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-xl">
                  বাকি: <strong className="font-sans font-black text-sm text-slate-950">{toBanglaDigits(stats.waiting)}</strong> জন
                </span>
              </div>
            </div>

            {/* 2. TABLE COLUMN HEADERS (Clean 3 Columns: Serial, Patient Name, Status) */}
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-slate-100/90 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600 shrink-0 border border-slate-200/60">
              <div className="col-span-2 text-center">সিরিয়াল নং</div>
              <div className="col-span-7">রোগীর নাম</div>
              <div className="col-span-3 text-right pr-2">স্ট্যাটাস</div>
            </div>

            {/* 3. CURRENT ACTIVE CALLING (🟢 RUNNING ROW - BORDERLESS CLEAN CARD) */}
            <div className="shrink-0">
              {currentCalling ? (
                <div className="bg-emerald-50/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs grid grid-cols-12 gap-4 items-center">
                  
                  {/* Serial Badge */}
                  <div className="col-span-2 flex justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <span className="text-3xl sm:text-4xl font-black font-sans leading-none text-white">
                        {formatSerialBangla(currentCalling.serialNumber)}
                      </span>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="col-span-6">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 truncate leading-tight">
                      {currentCalling.patientName}
                    </h3>
                  </div>

                  {/* Status Pill */}
                  <div className="col-span-4 text-right">
                    <span className="inline-block bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base shadow-xs whitespace-nowrap">
                      চেম্বারে আছেন
                    </span>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center text-slate-400 space-y-1">
                  <p className="text-base font-bold text-slate-700">বর্তমানে কোনো সক্রিয় রোগী চেম্বারে নেই</p>
                  <p className="text-xs text-slate-400">পরবর্তী সিরিয়ালের জন্য অপেক্ষা করুন</p>
                </div>
              )}
            </div>

            {/* 4. NEXT UP (🔵 PREPARE NEXT ROW - SKY BLUE THEME HERO CARD) */}
            {nextPatient && (
              <div className="shrink-0 bg-sky-50 border-3 border-sky-500 rounded-3xl p-4 sm:p-5 shadow-xs grid grid-cols-12 gap-4 items-center">
                
                {/* Serial Badge (Huge & Bold Sky Blue) */}
                <div className="col-span-2 flex justify-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <span className="text-4xl sm:text-5xl font-black font-sans leading-none text-white">
                      {formatSerialBangla(nextPatient.serialNumber)}
                    </span>
                  </div>
                </div>

                {/* Patient Name */}
                <div className="col-span-6">
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-950 truncate leading-tight">
                    {nextPatient.patientName}
                  </h4>
                </div>

                {/* Status */}
                <div className="col-span-4 text-right">
                  <span className="inline-block bg-sky-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base shadow-xs whitespace-nowrap">
                    পরবর্তী সিরিয়াল (প্রস্তুত থাকুন)
                  </span>
                </div>

              </div>
            )}

            {/* 5. UPCOMING WAITING ROWS (PROMINENT, LARGE, HIGH-CONTRAST CARDS) */}
            <div className="flex-1 flex flex-col justify-start space-y-3 overflow-hidden min-h-0">
              {upcomingPatients.length > 0 ? (
                upcomingPatients.map((apt, idx) => (
                  <div
                    key={apt.id || idx}
                    className="bg-slate-50 hover:bg-sky-50/60 border-2 border-slate-200/90 rounded-3xl px-6 py-4 sm:py-4.5 grid grid-cols-12 gap-4 items-center shadow-xs transition"
                  >
                    {/* Serial (Large Bold Box) */}
                    <div className="col-span-2 flex justify-center">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border-3 border-slate-300 text-slate-950 font-black text-3xl sm:text-4xl font-sans flex items-center justify-center shadow-xs">
                        {formatSerialBangla(apt.serialNumber)}
                      </div>
                    </div>

                    {/* Patient Name (Large & Bold) */}
                    <div className="col-span-7 font-black text-slate-950 truncate text-2xl sm:text-3xl">
                      {apt.patientName}
                    </div>

                    {/* Status */}
                    <div className="col-span-3 text-right">
                      <span className="bg-white text-slate-800 font-black text-sm sm:text-base px-5 py-2 rounded-2xl border-2 border-slate-200/90 inline-block shadow-2xs">
                        অপেক্ষমাণ
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 text-center text-xs text-slate-400 font-medium">
                  {nextPatient ? 'আর কোনো অপেক্ষমাণ রোগী নেই।' : 'বর্তমানে কোনো লাইভ সিরিয়াল পেন্ডিং নেই।'}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TICKER MARQUEE BANNER                                           */}
      {/* ========================================================================= */}
      <footer className="bg-nuvicaNavy-950 text-white px-6 py-2.5 flex items-center justify-between text-xs shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-2 text-amber-400 font-black shrink-0 pr-4 border-r border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>জরুরি নোটিশ:</span>
        </div>

        <div className="flex-1 overflow-hidden px-4 text-slate-200 font-medium">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8">
            <span>
              অনুগ্রহ করে আপনার সিরিয়াল নম্বরের দিকে লক্ষ্য রাখুন এবং সিরিয়াল ডাকার ৫ মিনিট পূর্বে চেম্বারের দরজার সামনে প্রস্তুত থাকুন।
            </span>
            <span className="text-amber-300">•</span>
            <span>
              ডাক্তারের কক্ষে প্রবেশের সময় আপনার ডিজিটাল টোকেন স্লিপ সাথে রাখুন।
            </span>
            <span className="text-amber-300">•</span>
            <span>
              আপনার সুস্বাস্থ্য কামনা করি — CD DOCTORS হেলথকেয়ার নেটওয়ার্ক (চুয়াডাঙ্গা)
            </span>
          </div>
        </div>

        <div className="shrink-0 pl-4 border-l border-slate-800 font-black text-[11px] text-slate-400 tracking-wider">
          WWW.CDDOCTORS.COM
        </div>
      </footer>

      {/* Marquee Animation Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 28s linear infinite;
        }
      `}</style>

    </div>
  );
}
