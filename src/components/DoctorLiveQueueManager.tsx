'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import PosThermalTokenModal from '@/components/PosThermalTokenModal';
import { 
  Users, 
  Activity, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Phone, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw, 
  Printer, 
  Building2, 
  Calendar, 
  Ticket,
  UserCheck,
  Stethoscope,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Check,
  Tv,
  FileText
} from 'lucide-react';

interface Props {
  doctorId: string;
  doctorName: string;
  doctorInfo?: any;
  schedules?: any[];
  onStatsUpdate?: () => void;
}

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

export default function DoctorLiveQueueManager({ doctorId, doctorName, doctorInfo, schedules = [], onStatsUpdate }: Props) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedChamber, setSelectedChamber] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Queue Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    completed: number;
    waiting: number;
    calling: number;
    inConsultation: number;
    skipped: number;
  }>({ total: 0, completed: 0, waiting: 0, calling: 0, inConsultation: 0, skipped: 0 });

  const [currentActive, setCurrentActive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fast Always-Open Walk-in Form State
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInGender, setWalkInGender] = useState('Male');
  const [walkInReason, setWalkInReason] = useState('');
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [walkInError, setWalkInError] = useState('');
  const [walkInSuccess, setWalkInSuccess] = useState('');
  const [printToken, setPrintToken] = useState<any>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch Queue Data
  const fetchQueueData = useCallback(async (isManual = false) => {
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
      console.error('Queue data fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [doctorId, selectedDate]);

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(() => {
      fetchQueueData();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchQueueData]);

  // Queue Actions
  const handleQueueAction = async (action: string, appointmentId?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/doctor/appointments/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          appointmentId,
          doctorId,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchQueueData();
        if (onStatsUpdate) onStatsUpdate();
      } else {
        alert(data.error || 'অ্যাকশন সম্পন্ন করা যায়নি');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    } finally {
      setActionLoading(false);
    }
  };

  // Always-Open Walk-in Submit
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
          patientGender: walkInGender,
          visitReason: walkInReason.trim() || 'সরাসরি সিরিয়াল',
          appointmentDate: selectedDate,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalkInSuccess(`সিরিয়াল #${toBanglaDigits(data.appointment.serialNumber)} (${data.appointment.patientName}) সফলভাবে যোগ হয়েছে!`);
        setWalkInName('');
        setWalkInPhone('');
        setWalkInReason('');
        await fetchQueueData();
        if (onStatsUpdate) onStatsUpdate();
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 100);
        setTimeout(() => setWalkInSuccess(''), 4000);
      } else {
        setWalkInError(data.error || 'সিরিয়াল দিতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setWalkInError('সার্ভার এরর');
    } finally {
      setWalkInSubmitting(false);
    }
  };

  // Filter Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = !searchQuery || 
      apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone?.includes(searchQuery) ||
      apt.appointmentCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(apt.serialNumber).includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || apt.queueStatus === statusFilter;
    const matchesChamber = selectedChamber === 'ALL' || apt.chamberName === selectedChamber;

    return matchesSearch && matchesStatus && matchesChamber;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CONTROLS & DATE SELECTOR BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Date Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedDate === todayStr ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              আজকের সিরিয়াল
            </button>
            <button
              onClick={() => {
                const tmrw = new Date();
                tmrw.setDate(tmrw.getDate() + 1);
                setSelectedDate(tmrw.toISOString().split('T')[0]);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedDate !== todayStr ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              আগামীকাল / অন্যান্য
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          />

          <button
            onClick={() => fetchQueueData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>

        {/* Actions: Assistant Desk View, TV Screen & Focus Walk-in */}
        <div className="flex items-center gap-2">
          <Link
            href={`/doctor/tv-display?doctorId=${doctorId}`}
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            title="ওয়েটিং রুমের টিভি মনিটরের জন্য লাইভ ফুল-স্ক্রিন ডিসপ্লে"
          >
            <Tv className="w-3.5 h-3.5 text-sky-600" />
            <span>টিভি ডিসপ্লে ↗</span>
          </Link>

          <Link
            href={`/doctor/assistant?doctorId=${doctorId}`}
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            title="সহকারীর জন্য আলাদা পূর্ণাঙ্গ কিউ ডেস্ক ওপেন করুন"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
            <span>অ্যাসিস্ট্যান্ট ডেস্ক ↗</span>
          </Link>

          <button
            onClick={() => nameInputRef.current?.focus()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-xs shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ সরাসরি সিরিয়াল (Walk-in)</span>
          </button>
        </div>

      </div>

      {/* 2. LIVE QUEUE METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 block">মোট সিরিয়াল</span>
          <p className="text-xl sm:text-2xl font-black text-nuvicaNavy-950">{toBanglaDigits(stats.total)} জন</p>
          <p className="text-[10.5px] text-slate-500 font-medium">নিবন্ধিত রোগী</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-200 shadow-xs text-center space-y-0.5 bg-sky-50/30">
          <span className="text-[11px] font-bold text-sky-700 flex items-center justify-center gap-1.5 block">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            চলতি সিরিয়াল
          </span>
          <p className="text-xl sm:text-2xl font-black text-sky-700">
            {currentActive ? `#${toBanglaDigits(currentActive.serialNumber)}` : '—'}
          </p>
          <p className="text-[10.5px] text-sky-600 font-bold truncate">
            {currentActive ? currentActive.patientName : 'কেউ নেই'}
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-xs text-center space-y-0.5 bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 block">অপেক্ষারত</span>
          <p className="text-xl sm:text-2xl font-black text-amber-700">{toBanglaDigits(stats.waiting)} জন</p>
          <p className="text-[10.5px] text-amber-600 font-medium">ওয়েটিং রুমে</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-0.5 bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 block">পরামর্শ সম্পন্ন</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700">{toBanglaDigits(stats.completed)} জন</p>
          <p className="text-[10.5px] text-emerald-600 font-medium">ভিজিট সম্পন্ন</p>
        </div>
      </div>

      {/* 3. PROMINENT NOW-SERVING & QUEUE CONTROLLER CONSOLE (CLEAN WHITE HEALTHCARE CARD) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-nuvicaNavy-950">লাইভ সিরিয়াল কন্ট্রোল</h3>
              <p className="text-[11.5px] text-slate-500 font-medium">এক ক্লিকে রোগী ডাকুন ও কিউ পরিচালনা করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQueueAction('CALL_NEXT')}
              disabled={actionLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>পরবর্তী রোগী ডাকুন ➔</span>
            </button>
          </div>
        </div>

        {/* Current Active Patient Box */}
        {currentActive ? (
          <div className="bg-sky-50/50 rounded-2xl p-4 sm:p-5 border border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-700 text-white font-black text-xl flex flex-col items-center justify-center shrink-0 shadow-xs">
                <span className="text-[9px] uppercase tracking-wider opacity-80 leading-none">টোকেন</span>
                <span className="leading-tight">#{toBanglaDigits(currentActive.serialNumber)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black tracking-wide ${
                    currentActive.queueStatus === 'IN_CONSULTATION' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentActive.queueStatus === 'IN_CONSULTATION' ? 'পরামর্শ চলছে' : 'ডাকা হচ্ছে...'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">#{currentActive.appointmentCode}</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-nuvicaNavy-950">{currentActive.patientName}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {currentActive.patientAge} বছর • {currentActive.patientGender === 'Male' ? 'পুরুষ' : 'মহিলা'} • মোবাইল: <span className="font-bold text-slate-700">{currentActive.patientPhone}</span>
                </p>
              </div>
            </div>

            {/* In-Console Quick Action Buttons (Styled like official action buttons) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
              {currentActive.queueStatus === 'CALLING' && (
                <button
                  onClick={() => handleQueueAction('START_CONSULTATION', currentActive.id)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition active:scale-95 shadow-xs cursor-pointer"
                >
                  পরামর্শ শুরু
                </button>
              )}

              <Link
                href={`/doctor/prescription?doctorId=${doctorId}&appointmentId=${currentActive.id}&phone=${currentActive.patientPhone}`}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="ডিজিটাল প্রেসক্রিপশন লিখুন"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>প্রেসক্রিপশন</span>
              </Link>

              <button
                onClick={() => handleQueueAction('MARK_COMPLETED', currentActive.id)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>পরামর্শ সম্পন্ন</span>
              </button>

              <button
                onClick={() => handleQueueAction('SKIP_PATIENT', currentActive.id)}
                disabled={actionLoading}
                className="px-3 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer"
              >
                স্কিপ
              </button>

              {currentActive.patientPhone && currentActive.patientPhone !== 'N/A' && (
                <a
                  href={`tel:${currentActive.patientPhone}`}
                  className="p-2.5 rounded-2xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition"
                  title="রোগীকে কল দিন"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 space-y-1.5 bg-slate-50/50 rounded-2xl border border-slate-100">
            <p className="text-sm font-black text-slate-700">বর্তমানে কোনো রোগী পরামর্শে নেই</p>
            <p className="text-xs text-slate-500 font-medium">সিরিয়াল শুরু করতে উপরের <strong className="text-sky-700">"পরবর্তী রোগী ডাকুন"</strong> বাটনে চাপ দিন।</p>
          </div>
        )}

      </div>

      {/* 3.5 ALWAYS-OPEN FAST WALK-IN ENTRY STRIP */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3">
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

      {/* 4. PATIENT QUEUE TABLE & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
        
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="সিরিয়াল নং, রোগীর নাম, মোবাইল বা কোড..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'ALL', label: 'সকল' },
              { id: 'WAITING', label: 'অপেক্ষারত' },
              { id: 'CALLING', label: 'ডাকা হচ্ছে' },
              { id: 'IN_CONSULTATION', label: 'পরামর্শ চলছে' },
              { id: 'COMPLETED', label: 'সম্পন্ন' },
              { id: 'SKIPPED', label: 'স্কিপ' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-3 px-4">সিরিয়াল</th>
                  <th className="py-3 px-4">টোকেন নং</th>
                  <th className="py-3 px-4">রোগীর নাম</th>
                  <th className="py-3 px-4">মোবাইল নম্বর</th>
                  <th className="py-3 px-4">সময় ও চেম্বার</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredAppointments.map((apt: any) => {
                  const isCurrent = currentActive?.id === apt.id;
                  return (
                    <tr 
                      key={apt.id} 
                      className={`transition-colors ${
                        isCurrent 
                          ? 'bg-sky-50/60 font-semibold' 
                          : apt.queueStatus === 'COMPLETED'
                          ? 'opacity-70 hover:bg-slate-50/50'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-sky-700 text-sm">
                        #{toBanglaDigits(apt.serialNumber)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {apt.appointmentCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                        {apt.isWalkIn && (
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold border border-teal-200">
                            Walk-in কাউন্টার
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {apt.patientPhone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-bold text-slate-800 block">{apt.estimatedTime || apt.timeSlot}</span>
                        <span className="text-[10.5px] text-slate-400 truncate block">{apt.chamberName || 'মূল চেম্বার'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black border ${
                          apt.queueStatus === 'IN_CONSULTATION'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : apt.queueStatus === 'CALLING'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                            : apt.queueStatus === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : apt.queueStatus === 'SKIPPED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {apt.queueStatus === 'IN_CONSULTATION'
                            ? 'পরামর্শ চলছে'
                            : apt.queueStatus === 'CALLING'
                            ? 'ডাকা হচ্ছে'
                            : apt.queueStatus === 'COMPLETED'
                            ? 'সম্পন্ন'
                            : apt.queueStatus === 'SKIPPED'
                            ? 'অনুপস্থিত'
                            : 'অপেক্ষারত'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.queueStatus === 'WAITING' && (
                            <button
                              onClick={() => handleQueueAction('CALL_PATIENT', apt.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] transition cursor-pointer"
                            >
                              ডাকুন
                            </button>
                          )}

                          {apt.queueStatus === 'CALLING' && (
                            <button
                              onClick={() => handleQueueAction('START_CONSULTATION', apt.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                            >
                              শুরু
                            </button>
                          )}

                          {apt.queueStatus === 'SKIPPED' && (
                            <button
                              onClick={() => handleQueueAction('RECALL_PATIENT', apt.id)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>রিকল</span>
                            </button>
                          )}

                            <Link
                              href={`/doctor/prescription?doctorId=${doctorId}&appointmentId=${apt.id}&phone=${apt.patientPhone}`}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition cursor-pointer"
                              title="প্রেসক্রিপশন তৈরি করুন"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Link>

                            {/* POS Thermal Print Button */}
                            <button
                              onClick={() => setPrintToken(apt)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="POS থার্মাল টোকেন প্রিন্ট"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {apt.patientPhone && apt.patientPhone !== 'N/A' && (
                              <a
                                href={`tel:${apt.patientPhone}`}
                                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                title="কল দিন"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600 text-sm">এই তারিখের জন্য কোনো সিরিয়াল পাওয়া যায়নি।</p>
              <button
                onClick={() => nameInputRef.current?.focus()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                + উপরের ফর্মে সরাসরি নতুন সিরিয়াল দিন
              </button>
            </div>
          )}

        </div>

        {/* POS THERMAL TOKEN MODAL */}
        {printToken && (
          <PosThermalTokenModal
            token={{
              ...printToken,
              fee: printToken.fee ?? doctorInfo?.consultationFee,
            }}
            doctor={{
              ...(doctorInfo || {}),
              name: doctorName || doctorInfo?.name,
            }}
            autoPrint={printToken?.isAutoPrint ?? false}
            onClose={() => setPrintToken(null)}
          />
        )}

      </div>
    );
  }
