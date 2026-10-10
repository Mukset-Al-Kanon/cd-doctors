'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PosThermalTokenModal from '@/components/PosThermalTokenModal';
import { 
  Building2, 
  Users, 
  Clock, 
  Phone, 
  Printer, 
  Tv, 
  Search, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Filter, 
  ChevronDown, 
  FileSpreadsheet, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  X, 
  Check, 
  Receipt, 
  UserCheck, 
  Stethoscope, 
  Flame, 
  SlidersHorizontal,
  DollarSign,
  ChevronRight
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

// Clean Web Audio Calling Chime
function playCallingChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain2.gain.setValueAtTime(0.4, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.9);
    }, 190);
  } catch (e) {
    console.log('Audio not supported');
  }
}

function HospitalReceptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('hospitalSlug') || searchParams.get('slug') || '';
  const initialId = searchParams.get('hospitalId') || '';
  const initialDoctorId = searchParams.get('doctorId') || '';

  // Main State
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(initialId);
  const [selectedHospitalSlug, setSelectedHospitalSlug] = useState<string>(initialSlug);
  const [hospitalsList, setHospitalsList] = useState<any[]>([]);
  const [currentHospital, setCurrentHospital] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState<any>({
    totalToday: 0,
    waitingToday: 0,
    callingToday: 0,
    inConsultationToday: 0,
    completedToday: 0,
    totalRevenueToday: 0,
    totalDoctors: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>(initialDoctorId || 'ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Rapid Walk-in Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState<string>('');
  const [bookingPatientName, setBookingPatientName] = useState('');
  const [bookingPatientPhone, setBookingPatientPhone] = useState('');
  const [bookingPatientAge, setBookingPatientAge] = useState('32');
  const [bookingPatientGender, setBookingPatientGender] = useState('Male');
  const [bookingIsWalkIn, setBookingIsWalkIn] = useState(true);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [autoPrintToken, setAutoPrintToken] = useState(true);

  // POS Thermal Token Print Modal State
  const [printToken, setPrintToken] = useState<any>(null);
  const [printDoctor, setPrintDoctor] = useState<any>(null);

  // Daily Summary Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [dailyReportData, setDailyReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // 1. Fetch Queue & Doctor Data
  const fetchQueue = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      let url = `/api/hospital/reception/queue?date=${selectedDate}`;
      if (selectedHospitalId) url += `&hospitalId=${selectedHospitalId}`;
      else if (selectedHospitalSlug) url += `&hospitalSlug=${selectedHospitalSlug}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCurrentHospital(data.hospital);
        setHospitalsList(data.hospitalsList || []);
        setDoctors(data.doctors || []);
        setOverallStats(data.overallStats || {});
        if (!selectedHospitalId && data.hospital?.id) {
          setSelectedHospitalId(data.hospital.id);
        }
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate, selectedHospitalId, selectedHospitalSlug]);

  useEffect(() => {
    fetchQueue();
    // Auto-refresh every 12 seconds
    const interval = setInterval(() => {
      fetchQueue();
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // Handle Hospital Switch
  const handleHospitalChange = (id: string) => {
    setSelectedHospitalId(id);
    setSelectedHospitalSlug('');
    setSelectedDoctorFilter('ALL');
    setLoading(true);
  };

  // Open Quick Booking Modal
  const handleOpenBooking = (docId?: string) => {
    if (docId) {
      setBookingDoctorId(docId);
    } else if (doctors.length > 0 && !bookingDoctorId) {
      setBookingDoctorId(doctors[0].id);
    }
    setBookingPatientName('');
    setBookingPatientPhone('');
    setBookingError('');
    setBookingSuccess('');
    setShowBookingModal(true);
  };

  // Submit Fast Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctorId || !bookingPatientName.trim() || !bookingPatientPhone.trim()) {
      setBookingError('অনুগ্রহ করে ডাক্তার, রোগীর নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    setBookingSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/hospital/reception/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: currentHospital?.id,
          doctorId: bookingDoctorId,
          patientName: bookingPatientName.trim(),
          patientPhone: bookingPatientPhone.trim(),
          patientAge: bookingPatientAge,
          patientGender: bookingPatientGender,
          appointmentDate: selectedDate,
          isWalkIn: bookingIsWalkIn,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'বুকিং সম্পন্ন করা যায়নি।');
      }

      setBookingSuccess(data.message);
      if (soundEnabled) playCallingChime();

      // Trigger Print Token Modal if enabled
      if (autoPrintToken && data.appointment && data.doctor) {
        setPrintToken({
          serialNumber: data.appointment.serialNumber,
          appointmentCode: data.appointment.appointmentCode,
          patientName: data.appointment.patientName,
          patientPhone: data.appointment.patientPhone,
          patientAge: data.appointment.patientAge,
          patientGender: data.appointment.patientGender,
          appointmentDate: data.appointment.appointmentDate,
          timeSlot: data.appointment.timeSlot,
          estimatedTime: data.appointment.estimatedTime,
          fee: data.doctor.consultationFee,
          createdAt: data.appointment.createdAt,
          isWalkIn: data.appointment.isWalkIn,
        });
        setPrintDoctor({
          name: data.doctor.name,
          specialization: data.doctor.specialization,
          degrees: data.doctor.degrees,
          consultationFee: data.doctor.consultationFee,
          chamberRoom: data.doctor.chamberRoom,
          hospitalName: data.doctor.hospitalName || currentHospital?.name,
          hospitalAddress: data.doctor.hospitalAddress || currentHospital?.address,
        });
      }

      // Refresh list
      fetchQueue();

      // Reset form
      setTimeout(() => {
        setBookingPatientName('');
        setBookingPatientPhone('');
        setBookingSuccess('');
        setShowBookingModal(false);
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Change Appointment Queue Status
  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      if (newStatus === 'CALLING' && soundEnabled) {
        playCallingChime();
      }

      const res = await fetch('/api/hospital/reception/queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, queueStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchQueue();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Call Next Patient for a Doctor
  const handleCallNextDoctor = async (doc: any) => {
    const nextWaiting = (doc.appointments || []).find((a: any) => a.queueStatus === 'WAITING');
    if (!nextWaiting) {
      alert(`${doc.name}-এর কোনো অপেক্ষমাণ রোগী নেই।`);
      return;
    }
    handleUpdateStatus(nextWaiting.id, 'CALLING');
  };

  // Open POS Print Slip for an existing appointment
  const handlePrintExisting = (appt: any, doc: any) => {
    setPrintToken({
      serialNumber: appt.serialNumber,
      appointmentCode: appt.appointmentCode,
      patientName: appt.patientName,
      patientPhone: appt.patientPhone,
      patientAge: appt.patientAge,
      patientGender: appt.patientGender,
      appointmentDate: appt.appointmentDate,
      timeSlot: appt.timeSlot,
      estimatedTime: appt.estimatedTime,
      fee: doc?.consultationFee,
      createdAt: appt.createdAt,
      isWalkIn: appt.isWalkIn,
    });
    setPrintDoctor({
      name: doc?.name || '',
      specialization: doc?.specialization,
      degrees: doc?.degrees,
      consultationFee: doc?.consultationFee,
      chamberRoom: doc?.chamberRoom,
      hospitalName: currentHospital?.name,
      hospitalAddress: currentHospital?.address,
    });
  };

  // Fetch End-of-Day Report
  const handleOpenReport = async () => {
    if (!currentHospital?.id) return;
    setShowReportModal(true);
    setReportLoading(true);
    try {
      const res = await fetch(`/api/hospital/reception/daily-report?hospitalId=${currentHospital.id}&date=${selectedDate}`);
      const data = await res.json();
      if (data.success) {
        setDailyReportData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReportLoading(false);
    }
  };

  // Flattened and Filtered Appointments List
  const allFilteredAppointments = doctors
    .filter((d) => selectedDoctorFilter === 'ALL' || d.id === selectedDoctorFilter)
    .flatMap((d) => (d.appointments || []).map((a: any) => ({ ...a, doctor: d })))
    .filter((a) => selectedStatusFilter === 'ALL' || a.queueStatus === selectedStatusFilter)
    .filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.patientPhone.includes(q) ||
        a.serialNumber.toString().includes(q) ||
        a.doctor.name.toLowerCase().includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-bengali pb-8 select-none">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Hospital Switcher */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  সেন্ট্রাল রিসেপশন ডেস্ক
                </span>
                <span className="text-[11px] font-bold text-slate-400">| চুয়াডাঙ্গা</span>
              </div>
              
              {/* Hospital Dropdown */}
              <div className="relative inline-block mt-0.5">
                <select
                  value={selectedHospitalId}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  className="appearance-none pr-8 pl-1 py-0.5 bg-transparent text-sm sm:text-base font-black text-slate-900 border-b border-dashed border-slate-300 hover:border-sky-500 cursor-pointer focus:outline-none transition-colors"
                >
                  {hospitalsList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({toBanglaDigits(h._count?.doctors || 0)} জন ডাক্তার)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Bar Right */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Date Picker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer"
              />
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'সাউন্ড চালু আছে' : 'সাউন্ড বন্ধ আছে'}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchQueue(true)}
              disabled={refreshing}
              title="রিমোট রিফ্রেশ"
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-600' : ''}`} />
            </button>

            {/* TV Screen Button */}
            <Link
              href={`/hospital/tv-display?hospitalId=${selectedHospitalId || currentHospital?.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <span>লবি টিভি স্ক্রিন</span>
            </Link>

            {/* Daily Report Button */}
            <button
              type="button"
              onClick={handleOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-black transition-all cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>আজকের হিসাব</span>
            </button>

            {/* Fast Walk-in Entry CTA */}
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>দ্রুত সিরিয়াল দিন</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block">মোট রোগী আজ</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{toBanglaDigits(overallStats.totalToday)}</span>
              <span className="text-xs font-bold text-slate-400">জন</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/70 bg-amber-50/20 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-700 block">অপেক্ষমাণ রোগী</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-amber-800">{toBanglaDigits(overallStats.waitingToday)}</span>
              <span className="text-xs font-bold text-amber-600">জন</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-sky-200/70 bg-sky-50/20 shadow-2xs">
            <span className="text-[11px] font-bold text-sky-700 block">পরামর্শ চলছে / ডাকা হচ্ছে</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-sky-800">{toBanglaDigits(overallStats.inConsultationToday + overallStats.callingToday)}</span>
              <span className="text-xs font-bold text-sky-600">জন</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/70 bg-emerald-50/20 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-700 block">পরামর্শ সম্পন্ন</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-800">{toBanglaDigits(overallStats.completedToday)}</span>
              <span className="text-xs font-bold text-emerald-600">জন</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block">মোট অ্যাক্টিভ ডাক্তার</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{toBanglaDigits(overallStats.totalDoctors || doctors.length)}</span>
              <span className="text-xs font-bold text-slate-400">জন</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-indigo-200/70 bg-indigo-50/20 shadow-2xs">
            <span className="text-[11px] font-bold text-indigo-700 block">মোট কালেকশন (সম্পন্ন)</span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-xl font-black text-indigo-900">৳ {toBanglaDigits(overallStats.totalRevenueToday)}</span>
            </div>
          </div>

        </div>

        {/* Doctor Grid (Multi-Doctor Overview) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                হাসপাতালের সকল ডাক্তারের লাইভ চেম্বার
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                {toBanglaDigits(doctors.length)} জন
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">
              রুম অনুযায়ী রোগী ডাকুন বা দ্রুত এন্ট্রি নিন
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm font-bold animate-pulse">
              ডাক্তারদের চেম্বার তথ্য লোড হচ্ছে...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 font-bold text-xs">
              এই হাসপাতালে কোনো সক্রিয় ডাক্তার পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {doctors.map((doc) => {
                const isFiltered = selectedDoctorFilter === doc.id;
                return (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-3xl border transition-all p-4 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs ${
                      isFiltered ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Header info */}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md inline-block mb-1 border border-sky-200/60">
                            {doc.chamberRoom || 'চেম্বার রুম'}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">
                            {doc.name}
                          </h3>
                          <p className="text-[11.5px] font-bold text-slate-500 line-clamp-1">
                            {doc.specialization}
                          </p>
                        </div>
                        
                        {/* Consultation fee badge */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-900 block">
                            ৳ {toBanglaDigits(doc.consultationFee || 0)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">ভিজিট ফি</span>
                        </div>
                      </div>

                      {/* Current Running Serial Box */}
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                            বর্তমান সিরিয়াল
                          </span>
                          <span className="text-lg font-black text-slate-900">
                            {doc.runningSerial ? `সিরিয়াল ${formatSerialBangla(doc.runningSerial)}` : 'চেম্বার শুরু হয়নি'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                            অপেক্ষমাণ
                          </span>
                          <span className="text-sm font-black text-amber-700">
                            {toBanglaDigits(doc.stats?.waiting || 0)} জন
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for this Doctor */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                      
                      {/* Fast Entry for this doctor */}
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(doc.id)}
                        className="py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-black border border-sky-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="এই ডাক্তারের সিরিয়াল দিন"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>সিরিয়াল</span>
                      </button>

                      {/* Call Next Button */}
                      <button
                        type="button"
                        onClick={() => handleCallNextDoctor(doc)}
                        className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="পরবর্তী রোগীকে ডাকুন"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>পরের জন</span>
                      </button>

                      {/* Filter Queue Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedDoctorFilter(isFiltered ? 'ALL' : doc.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-black border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          isFiltered
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="শুধুমাত্র এই ডাক্তারের কিউ দেখুন"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isFiltered ? 'সকল' : 'কিউ'}</span>
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Live Patient Queue Management Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  লাইভ রোগীর সিরিয়াল তালিকা
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {selectedDoctorFilter === 'ALL'
                    ? 'হাসপাতালের সব ডাক্তারের সমন্বিত কিউ'
                    : `${doctors.find((d) => d.id === selectedDoctorFilter)?.name}-এর চেম্বার তালিকা`}
                </p>
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Search bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="রোগী বা ফোন নম্বর..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 w-44 sm:w-56 transition-all"
                />
              </div>

              {/* Doctor filter dropdown */}
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">সব ডাক্তার ({toBanglaDigits(doctors.length)})</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({toBanglaDigits(d.stats?.total || 0)})
                  </option>
                ))}
              </select>

              {/* Status filter dropdown */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="ALL">সব স্ট্যাটাস</option>
                <option value="WAITING">অপেক্ষমাণ</option>
                <option value="CALLING">ডাকা হচ্ছে</option>
                <option value="IN_CONSULTATION">পরামর্শ চলছে</option>
                <option value="COMPLETED">সম্পন্ন</option>
                <option value="SKIPPED">অনুপস্থিত</option>
              </select>

            </div>

          </div>

          {/* Queue Table */}
          <div className="overflow-x-auto">
            {allFilteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold text-xs space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p>কোনো রোগীর রেকর্ড পাওয়া যায়নি।</p>
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="px-3.5 py-1.5 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  + নতুন রোগী এন্ট্রি দিন
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3">সিরিয়াল</th>
                    <th className="py-3 px-3">রোগীর বিবরণ</th>
                    <th className="py-3 px-3">ডাক্তার ও রুম</th>
                    <th className="py-3 px-3">সময় ও টাইপ</th>
                    <th className="py-3 px-3">স্ট্যাটাস</th>
                    <th className="py-3 px-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {allFilteredAppointments.map((appt) => {
                    const isCalling = appt.queueStatus === 'CALLING';
                    const isInConsultation = appt.queueStatus === 'IN_CONSULTATION';
                    const isCompleted = appt.queueStatus === 'COMPLETED';

                    return (
                      <tr
                        key={appt.id}
                        className={`transition-colors hover:bg-slate-50/70 ${
                          isCalling ? 'bg-amber-50/60' : isInConsultation ? 'bg-sky-50/60' : ''
                        }`}
                      >
                        {/* Serial */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xs ${
                              isCalling
                                ? 'bg-amber-500 text-white animate-pulse'
                                : isInConsultation
                                ? 'bg-sky-600 text-white'
                                : isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {formatSerialBangla(appt.serialNumber)}
                          </span>
                        </td>

                        {/* Patient info */}
                        <td className="py-3.5 px-3">
                          <div className="font-black text-slate-900 text-xs sm:text-sm">
                            {appt.patientName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{appt.patientPhone}</span>
                            {appt.patientAge && <span>• {toBanglaDigits(appt.patientAge)} বছর</span>}
                          </div>
                        </td>

                        {/* Doctor info */}
                        <td className="py-3.5 px-3">
                          <div className="font-black text-slate-900 line-clamp-1">
                            {appt.doctor?.name}
                          </div>
                          <div className="text-[11px] font-bold text-sky-700">
                            {appt.doctor?.chamberRoom || 'চেম্বার রুম'}
                          </div>
                        </td>

                        {/* Time & type */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-700">
                            {appt.estimatedTime || appt.timeSlot}
                          </div>
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${
                              appt.isWalkIn
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {appt.isWalkIn ? 'ওয়াক-ইন' : 'অনলাইন বুকিং'}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          {isCalling ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1 animate-pulse">
                              <Volume2 className="w-3 h-3" /> ডাকা হচ্ছে
                            </span>
                          ) : isInConsultation ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300 inline-flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" /> পরামর্শ চলছে
                            </span>
                          ) : isCompleted ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> সম্পন্ন
                            </span>
                          ) : appt.queueStatus === 'SKIPPED' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                              অনুপস্থিত
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                              অপেক্ষমাণ
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Call Button */}
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt.id, 'CALLING')}
                              title="রোগীকে ডাকুন"
                              className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            {/* In Consultation Button */}
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt.id, 'IN_CONSULTATION')}
                              title="চেম্বারে প্রবেশ করেছে"
                              className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                            </button>

                            {/* Complete Button */}
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                              title="পরামর্শ সম্পন্ন"
                              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>

                            {/* Print Slip Button */}
                            <button
                              type="button"
                              onClick={() => handlePrintExisting(appt, appt.doctor)}
                              title="থার্মাল টোকেন প্রিন্ট"
                              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
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
            )}
          </div>

        </section>

      </main>

      {/* Rapid Walk-in Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">দ্রুত সিরিয়াল বুকিং</h3>
                  <p className="text-xs text-sky-100 font-bold">কাউন্টার ও ফোন বুকিং এন্ট্রি</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBookingSubmit} className="p-5 space-y-4">
              
              {bookingError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  ⚠️ {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  ✅ {bookingSuccess}
                </div>
              )}

              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ডাক্তার নির্বাচন করুন *
                </label>
                <select
                  value={bookingDoctorId}
                  onChange={(e) => setBookingDoctorId(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.chamberRoom} (ফি: ৳{toBanglaDigits(d.consultationFee)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  রোগীর নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  value={bookingPatientName}
                  onChange={(e) => setBookingPatientName(e.target.value)}
                  autoFocus
                  className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Patient Phone */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  মোবাইল নম্বর * (অটো SMS যাবে)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={bookingPatientPhone}
                  onChange={(e) => setBookingPatientPhone(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    বয়স
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={bookingPatientAge}
                    onChange={(e) => setBookingPatientAge(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    লিঙ্গ
                  </label>
                  <select
                    value={bookingPatientGender}
                    onChange={(e) => setBookingPatientGender(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Male">পুরুষ</option>
                    <option value="Female">মহিলা</option>
                    <option value="Child">শিশু</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              {/* Walk-in vs Phone toggle & Auto Print toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={bookingIsWalkIn}
                    onChange={(e) => setBookingIsWalkIn(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>সরাসরি কাউন্টার ওয়াক-ইন (Walk-in)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-sky-700">
                  <input
                    type="checkbox"
                    checked={autoPrintToken}
                    onChange={(e) => setAutoPrintToken(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <Printer className="w-3.5 h-3.5" />
                  <span>অটো টোকেন প্রিন্ট</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={bookingSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-black shadow-xs transition-all active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {bookingSubmitting ? 'সিরিয়াল তৈরি হচ্ছে...' : 'সিরিয়াল কনফার্ম করুন ➜'}
              </button>

            </form>

          </div>
        </div>
      )}

      {/* POS Thermal Token Slip Modal */}
      {printToken && printDoctor && (
        <PosThermalTokenModal
          token={printToken}
          doctor={printDoctor}
          onClose={() => {
            setPrintToken(null);
            setPrintDoctor(null);
          }}
          autoPrint={true}
        />
      )}

      {/* Daily Summary Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black">{currentHospital?.name} — দিনশেষের হিসাব</h3>
                  <p className="text-xs text-slate-400 font-bold">তারিখ: {toBanglaDigits(selectedDate)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {reportLoading ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  রিপোর্ট তৈরি হচ্ছে...
                </div>
              ) : dailyReportData ? (
                <div className="space-y-4">
                  
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block">মোট রোগী</span>
                      <span className="text-lg font-black text-slate-900">
                        {toBanglaDigits(dailyReportData.summary?.grandTotalPatients)} জন
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block">সম্পন্ন</span>
                      <span className="text-lg font-black text-emerald-700">
                        {toBanglaDigits(dailyReportData.summary?.grandCompletedPatients)} জন
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block">মোট সংগৃহীত ফি</span>
                      <span className="text-lg font-black text-indigo-700">
                        ৳ {toBanglaDigits(dailyReportData.summary?.grandTotalRevenue)}
                      </span>
                    </div>
                  </div>

                  {/* Doctor-wise table */}
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-black text-[11px]">
                        <th className="py-2 px-2">ডাক্তার ও চেম্বার</th>
                        <th className="py-2 px-2 text-center">মোট রোগী</th>
                        <th className="py-2 px-2 text-center">সম্পন্ন</th>
                        <th className="py-2 px-2 text-right">ভিজিট ফি</th>
                        <th className="py-2 px-2 text-right">মোট কালেকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {(dailyReportData.doctorReports || []).map((doc: any) => (
                        <tr key={doc.doctorId}>
                          <td className="py-2.5 px-2">
                            <div className="font-black text-slate-900">{doc.name}</div>
                            <div className="text-[10.5px] text-slate-400">{doc.chamberRoom}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">{toBanglaDigits(doc.totalPatients)}</td>
                          <td className="py-2.5 px-2 text-center text-emerald-700">{toBanglaDigits(doc.completedPatients)}</td>
                          <td className="py-2.5 px-2 text-right text-slate-600">৳{toBanglaDigits(doc.consultationFee)}</td>
                          <td className="py-2.5 px-2 text-right font-black text-indigo-700">৳{toBanglaDigits(doc.totalRevenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              ) : null}
            </div>

            {/* Modal Footer with Print */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রিপোর্ট প্রিন্ট করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function HospitalReceptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-400">রিসেপশন ডেস্ক লোড হচ্ছে...</div>}>
      <HospitalReceptionContent />
    </Suspense>
  );
}
