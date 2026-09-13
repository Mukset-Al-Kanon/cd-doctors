'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Camera, 
  Sun, 
  Sunset, 
  Moon, 
  Check, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
  Loader2,
  Calendar,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import Link from 'next/link';

interface MedicineScheduleItem {
  id: string;
  medicineName: string;
  genericName?: string;
  dosage: string;
  timing: string;
  scheduledTimes: string[];
  durationDays: number;
  startDate: string;
  instructions?: string;
  isActive: boolean;
  logs: {
    id: string;
    date: string;
    scheduledTime: string;
    status: string;
    takenAt: string;
  }[];
}

export default function SimpleMedicineSchedulePage() {
  const [schedules, setSchedules] = useState<MedicineScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClosingAddModal, setIsClosingAddModal] = useState(false);

  const openAddModal = () => {
    setIsClosingAddModal(false);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsClosingAddModal(true);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setIsClosingAddModal(false);
    }, 240);
  };

  // Quick Add Form State
  const [quickName, setQuickName] = useState('');
  const [quickSlotMorning, setQuickSlotMorning] = useState(true);
  const [quickSlotNoon, setQuickSlotNoon] = useState(false);
  const [quickSlotNight, setQuickSlotNight] = useState(true);
  const [quickTiming, setQuickTiming] = useState<'AFTER_MEAL' | 'BEFORE_MEAL'>('AFTER_MEAL');
  const [savingQuickMed, setSavingQuickMed] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Bangla Formatted Today Date
  const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const now = new Date();
  const todayFormattedBn = `${banglaDays[now.getDay()]}, ${now.getDate()} ${banglaMonths[now.getMonth()]}`;

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patient/schedules');
      const data = await res.json();
      if (data.success && data.schedules) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  // Play satisfying soft chime sound on check
  const playChimeSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext ignored if blocked
    }
  };

  const handleToggleDose = async (scheduleId: string, scheduledTime: string, currentTaken: boolean) => {
    if (!currentTaken) {
      playChimeSound();
    }

    try {
      // Optimistic update
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id === scheduleId) {
            let updatedLogs = [...s.logs];
            if (currentTaken) {
              updatedLogs = updatedLogs.filter(
                (l) => !(l.date === todayStr && l.scheduledTime === scheduledTime)
              );
            } else {
              updatedLogs.unshift({
                id: `log-${Date.now()}`,
                date: todayStr,
                scheduledTime,
                status: 'TAKEN',
                takenAt: new Date().toISOString(),
              });
            }
            return { ...s, logs: updatedLogs };
          }
          return s;
        })
      );

      await fetch('/api/patient/schedules/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId,
          scheduledTime,
          status: currentTaken ? 'SKIPPED' : 'TAKEN',
          date: todayStr,
        }),
      });
    } catch (err) {
      console.error('Failed to toggle dose:', err);
      fetchSchedules();
    }
  };

  const isDoseTaken = (schedule: MedicineScheduleItem, time: string) => {
    return schedule.logs.some(
      (l) => l.date === todayStr && l.scheduledTime === time && l.status === 'TAKEN'
    );
  };

  // Metrics
  const totalDosesToday = schedules.reduce((acc, s) => acc + (s.isActive ? s.scheduledTimes.length : 0), 0);
  const completedDosesToday = schedules.reduce((acc, s) => {
    if (!s.isActive) return acc;
    return acc + s.scheduledTimes.filter((t) => isDoseTaken(s, t)).length;
  }, 0);

  const progressPercent = totalDosesToday > 0 ? Math.round((completedDosesToday / totalDosesToday) * 100) : 0;

  // Split into 3 simple time slots
  const getSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0], 10);
    if (hour >= 5 && hour < 12) return 'MORNING';
    if (hour >= 12 && hour < 18) return 'AFTERNOON';
    return 'NIGHT';
  };

  const morningItems = schedules.flatMap((s) => 
    s.scheduledTimes.filter((t) => getSlot(t) === 'MORNING').map((t) => ({ schedule: s, time: t }))
  );

  const noonItems = schedules.flatMap((s) => 
    s.scheduledTimes.filter((t) => getSlot(t) === 'AFTERNOON').map((t) => ({ schedule: s, time: t }))
  );

  const nightItems = schedules.flatMap((s) => 
    s.scheduledTimes.filter((t) => getSlot(t) === 'NIGHT').map((t) => ({ schedule: s, time: t }))
  );

  // Quick Add Medicine Handler
  const handleQuickAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const times: string[] = [];
    if (quickSlotMorning) times.push('08:30');
    if (quickSlotNoon) times.push('14:00');
    if (quickSlotNight) times.push('20:30');

    if (times.length === 0) {
      alert('কমপক্ষে একটি সময় (সকাল/দুপুর/রাত) সিলেক্ট করুন।');
      return;
    }

    try {
      setSavingQuickMed(true);
      const res = await fetch('/api/patient/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: quickName,
          dosage: `${quickSlotMorning ? '১' : '০'}+${quickSlotNoon ? '১' : '০'}+${quickSlotNight ? '১' : '০'}`,
          timing: quickTiming,
          scheduledTimes: times,
          durationDays: 14,
        }),
      });

      const data = await res.json();
      if (data.success) {
        closeAddModal();
        setQuickName('');
        fetchSchedules();
      }
    } catch (err) {
      console.error('Quick add failed:', err);
    } finally {
      setSavingQuickMed(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* 🌟 1. SUPER SIMPLE HERO HEADER */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-sky-600 tracking-wide">{todayFormattedBn}</p>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-0.5">
                আজকের ঔষধের রুটিন
              </h1>
            </div>

            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{completedDosesToday} / {totalDosesToday} টি সম্পন্ন</span>
            </span>
          </div>

          {/* Simple Clean Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && totalDosesToday > 0 && (
              <p className="text-xs font-black text-emerald-700 text-center pt-1">
                🎉 দারুণ! আজকের সমস্ত ঔষধ সময়মতো খাওয়া হয়েছে।
              </p>
            )}
          </div>

          {/* Quick Action 2-Button Row */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <button
              onClick={openAddModal}
              className="w-full bg-sky-50 hover:bg-sky-100/90 text-sky-900 font-black text-xs py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 border border-sky-200/80 transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] cursor-pointer shadow-2xs group"
            >
              <Plus className="w-4 h-4 text-sky-600 transition-transform duration-300 group-hover:rotate-90" />
              <span>ঔষধ যোগ করুন</span>
            </button>

            <Link
              href="/patient/scanner"
              className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs py-3.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] cursor-pointer shadow-xs group"
            >
              <Camera className="w-4 h-4 text-white transition-transform duration-300 group-hover:scale-110" />
              <span>প্রেসক্রিপশন স্ক্যান</span>
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. THREE INTUITIVE TIME CARDS (সকাল | দুপুর | রাত) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          
          {/* 🌅 SECTION A: MORNING (সকাল) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">সকাল (Morning)</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">নাস্তার পর / আগে</span>
            </div>

            {morningItems.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-1">সকালে কোনো ঔষধ নেই।</p>
            ) : (
              <div className="space-y-2.5">
                {morningItems.map(({ schedule, time }, idx) => {
                  const taken = isDoseTaken(schedule, time);
                  return (
                    <div 
                      key={`m-${schedule.id}-${time}-${idx}`}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        taken 
                          ? 'bg-emerald-50/70 border-emerald-300' 
                          : 'bg-[#F8FAFD] border-slate-200/90'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${taken ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                          <h3 className={`text-sm sm:text-base font-black truncate ${taken ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                            {schedule.medicineName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
                          <span className="text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            ⏰ {time}
                          </span>
                          <span className="text-sky-700 font-extrabold text-[11px] flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3" />
                            {schedule.timing === 'AFTER_MEAL' ? 'খাওয়ার পরে' : 'খাওয়ার আগে (খালি পেটে)'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Tap Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleDose(schedule.id, time, taken)}
                        className={`text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-90 shrink-0 shadow-xs ${
                          taken 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {taken ? (
                          <>
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                            <span>খেয়েছি</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" />
                            <span>খাইনি</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ☀️ SECTION B: NOON (দুপুর) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Sunset className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">দুপুর (Noon)</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">দুপুরের খাবারের পর / আগে</span>
            </div>

            {noonItems.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-1">দুপুরে কোনো ঔষধ নেই।</p>
            ) : (
              <div className="space-y-2.5">
                {noonItems.map(({ schedule, time }, idx) => {
                  const taken = isDoseTaken(schedule, time);
                  return (
                    <div 
                      key={`n-${schedule.id}-${time}-${idx}`}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        taken 
                          ? 'bg-emerald-50/70 border-emerald-300' 
                          : 'bg-[#F8FAFD] border-slate-200/90'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${taken ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                          <h3 className={`text-sm sm:text-base font-black truncate ${taken ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                            {schedule.medicineName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
                          <span className="text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            ⏰ {time}
                          </span>
                          <span className="text-sky-700 font-extrabold text-[11px] flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3" />
                            {schedule.timing === 'AFTER_MEAL' ? 'খাওয়ার পরে' : 'খাওয়ার আগে (খালি পেটে)'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Tap Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleDose(schedule.id, time, taken)}
                        className={`text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-90 shrink-0 shadow-xs ${
                          taken 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {taken ? (
                          <>
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                            <span>খেয়েছি</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" />
                            <span>খাইনি</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 🌙 SECTION C: NIGHT (রাত) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">রাত (Night)</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">রাতের খাবার / ঘুমানোর আগে</span>
            </div>

            {nightItems.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium py-1">রাতে কোনো ঔষধ নেই।</p>
            ) : (
              <div className="space-y-2.5">
                {nightItems.map(({ schedule, time }, idx) => {
                  const taken = isDoseTaken(schedule, time);
                  return (
                    <div 
                      key={`nt-${schedule.id}-${time}-${idx}`}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        taken 
                          ? 'bg-emerald-50/70 border-emerald-300' 
                          : 'bg-[#F8FAFD] border-slate-200/90'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${taken ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                          <h3 className={`text-sm sm:text-base font-black truncate ${taken ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                            {schedule.medicineName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
                          <span className="text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            ⏰ {time}
                          </span>
                          <span className="text-sky-700 font-extrabold text-[11px] flex items-center gap-1">
                            <UtensilsCrossed className="w-3 h-3" />
                            {schedule.timing === 'AFTER_MEAL' ? 'খাওয়ার পরে' : 'খাওয়ার আগে (খালি পেটে)'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Tap Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleDose(schedule.id, time, taken)}
                        className={`text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-90 shrink-0 shadow-xs ${
                          taken 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {taken ? (
                          <>
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                            <span>খেয়েছি</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" />
                            <span>খাইনি</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 🌟 3. HEALTH LOCKER QUICK SHORTCUT */}
        {/* ========================================================================= */}
        <Link
          href="/patient/vault"
          className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-sky-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">ডিজিタル হেলথ লকার</h4>
              <p className="text-xs text-slate-500 font-medium">প্রেসক্রিপশন ও টেস্ট রিপোর্ট সংরক্ষিত রাখুন</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>

      {/* ========================================================================= */}
      {/* 🌟 QUICK ADD MEDICINE MODAL (ULTRA PROFESSIONAL & USER-FRIENDLY) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 ${
            isClosingAddModal ? 'animate-modal-backdrop-exit' : 'animate-modal-backdrop'
          }`}
          onClick={closeAddModal}
        >
          <div 
            className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
              isClosingAddModal ? 'animate-modal-spring-exit' : 'animate-modal-spring'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-sky-50/60 via-white to-sky-50/40 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    নতুন ঔষধ যোগ করুন
                  </h3>
                  <p className="text-xs text-slate-400 font-medium pt-0.5">
                    রুটিন ও রিমাইন্ডার সেট করার জন্য
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={closeAddModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickAddMedicine} className="p-5 sm:p-6 space-y-4">
              
              {/* Medicine Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  ঔষধের নাম: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="যেমন: Napa 500mg, Seclo 20mg, Fexo"
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 focus:ring-3 focus:ring-sky-500/10 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all"
                />
              </div>

              {/* Time Slots (Ultra-Simple 3 Pills) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-slate-700 block">
                  কখন খাবেন?
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Morning */}
                  <button
                    type="button"
                    onClick={() => setQuickSlotMorning(!quickSlotMorning)}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none active:scale-95 text-center ${
                      quickSlotMorning 
                        ? 'bg-sky-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    সকাল
                  </button>

                  {/* Noon */}
                  <button
                    type="button"
                    onClick={() => setQuickSlotNoon(!quickSlotNoon)}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none active:scale-95 text-center ${
                      quickSlotNoon 
                        ? 'bg-sky-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    দুপুর
                  </button>

                  {/* Night */}
                  <button
                    type="button"
                    onClick={() => setQuickSlotNight(!quickSlotNight)}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none active:scale-95 text-center ${
                      quickSlotNight 
                        ? 'bg-sky-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    রাত
                  </button>
                </div>
              </div>

              {/* Meal Timing (Ultra-Simple 2 Pills) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-black text-slate-700 block">
                  খাওয়ার নিয়ম:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickTiming('AFTER_MEAL')}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none active:scale-95 text-center ${
                      quickTiming === 'AFTER_MEAL'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    খাবারের পর
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickTiming('BEFORE_MEAL')}
                    className={`py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none active:scale-95 text-center ${
                      quickTiming === 'BEFORE_MEAL'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    খাবারের আগে
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingQuickMed}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm py-3.5 rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {savingQuickMed ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>যুক্ত হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>রুটিনে যুক্ত করুন</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
