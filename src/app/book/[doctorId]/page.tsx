'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PosThermalTokenModal from '@/components/PosThermalTokenModal';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  PhoneCall, 
  Building2, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  X,
  Stethoscope,
  UserCheck,
  ChevronDown,
  Activity,
  Printer,
  Share2,
  Copy,
  ArrowRight,
  Sparkles,
  Ticket,
  Check
} from 'lucide-react';
import LoginPromptModal from '@/components/LoginPromptModal';

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ALL_WEEK_DAYS = [
  { full: 'Saturday', short: 'শনি' },
  { full: 'Sunday', short: 'রবি' },
  { full: 'Monday', short: 'সোম' },
  { full: 'Tuesday', short: 'মঙ্গ' },
  { full: 'Wednesday', short: 'বুধ' },
  { full: 'Thursday', short: 'বৃহ' },
  { full: 'Friday', short: 'শুক্র' },
];

function toBanglaDigits(str: string | number): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

export default function AppointmentBookingPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');

  // Patient Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientEmail, setPatientEmail] = useState('');
  const [visitReason, setVisitReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedData, setBookedData] = useState<any>(null);
  const [showPosPrintModal, setShowPosPrintModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          if (data.user.name && !patientName) setPatientName(data.user.name);
          if (data.user.phone && !patientPhone) setPatientPhone(data.user.phone);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Fetch Doctor Profile & Schedules
  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/doctors/detail?id=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.doctor) {
          setDoctor(data.doctor);
          if (data.doctor.schedules && data.doctor.schedules.length > 0) {
            setSelectedScheduleId(data.doctor.schedules[0].id);
          }
        } else {
          setErrorMessage('ডাক্তারের তথ্য পাওয়া যায়নি।');
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('ডাক্তারের তথ্য লোড করতে ব্যর্থ হয়েছে।');
        setLoading(false);
      });
  }, [doctorId]);

  const doctorPhoneRaw = doctor?.phone || doctor?.hospital?.phone || '+8801700000000';

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      setErrorMessage('অনুগ্রহ করে রোগীর নাম প্রদান করুন।');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMessage('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!patientAge) {
      setErrorMessage('রোগীর বয়স প্রদান করুন।');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const activeSchedule = doctor?.schedules?.find((s: any) => s.id === selectedScheduleId) || doctor?.schedules?.[0];
      const chamberName = activeSchedule?.chamberName || doctor?.chamberRoom || doctor?.hospital?.name || 'প্রধান চেম্বার';

      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          hospitalId: doctor.hospitalId,
          scheduleId: selectedScheduleId || null,
          chamberName,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientAge: parseInt(patientAge, 10),
          patientGender,
          patientEmail: patientEmail.trim() || null,
          visitReason: visitReason.trim() || null,
          appointmentDate: selectedDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'সিরিয়াল বুকিং ব্যর্থ হয়েছে।');
        setSubmitting(false);
        return;
      }

      setBookedData(data);
      setBookingSuccess(true);
    } catch (err: any) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTokenCode = () => {
    if (bookedData?.appointmentCode) {
      navigator.clipboard.writeText(bookedData.appointmentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const availableDayNamesSet = new Set<string>(
    doctor?.schedules && doctor.schedules.length > 0
      ? doctor.schedules.map((s: any) => DAYS_MAP[s.dayOfWeek])
      : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-nuvicaNavy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">ডাক্তারের চেম্বার ও সিরিয়ালের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (errorMessage && !doctor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{errorMessage}</h2>
        <button onClick={() => router.push('/doctors')} className="btn-nuvica-primary text-xs">
          সকল ডাক্তারদের তালিকা দেখুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
              স্মার্ট সিরিয়াল বুকিং
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              লাইভ চালু আছে
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-nuvicaNavy-950 tracking-tight leading-snug">
            ডাক্তারের চেম্বার সিরিয়াল বুকিং
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
            অনলাইনে তাৎক্ষণিক সিরিয়াল টোকেন সংগ্রহ করুন এবং লাইভ কিউ ট্র্যাক করুন।
          </p>
        </div>

        <Link
          href="/serial-tracker"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs font-black shadow-2xs hover:shadow-sm transition-all"
        >
          <Activity className="w-4 h-4 text-sky-600" />
          <span>সিরিয়াল ট্র্যাকার</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* SUCCESS SCREEN: DIGITAL TOKEN SLIP */}
      {bookingSuccess && bookedData ? (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl overflow-hidden relative">
            {/* Top Success Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center space-y-2 relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto border border-white/30">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-black">সিরিয়াল বুকিং সফল হয়েছে!</h2>
              <p className="text-xs text-emerald-100 font-medium">
                আপনার সিরিয়াল টোকেনটি সংরক্ষিত রাখা হয়েছে। সিরিয়াল নম্বর ও সম্ভাব্য সময় নিচে দেখুন।
              </p>
            </div>

            {/* Token Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Highlighted Serial & Token Number */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-br from-sky-50 via-slate-50 to-teal-50 rounded-2xl border border-sky-100 text-center sm:text-left">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">আপনার ক্রমিক সিরিয়াল নম্বর</span>
                  <div className="text-3xl sm:text-4xl font-black text-sky-700 flex items-center justify-center sm:justify-start gap-2">
                    <Ticket className="w-8 h-8 text-sky-600" />
                    <span>সিরিয়াল #{toBanglaDigits(bookedData.serialNumber)}</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-0.5">
                  <span className="text-[10.5px] font-bold text-slate-400 block uppercase">অ্যাপয়েন্টমেন্ট টোকেন কোড</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-800 tracking-wider">{bookedData.appointmentCode}</span>
                    <button 
                      onClick={copyTokenCode} 
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                      title="কোড কপি করুন"
                    >
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Consultation Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">রোগীর নাম</span>
                  <p className="font-bold text-slate-900 text-sm">{patientName}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">মোবাইল নম্বর</span>
                  <p className="font-bold text-slate-900 font-mono text-sm">{patientPhone}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">সাক্ষাতের তারিখ</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedDate}</p>
                </div>
                <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1">
                  <span className="text-sky-700 font-bold">সম্ভাব্য সময় (Estimated Time)</span>
                  <p className="font-black text-sky-900 text-sm">{bookedData.estimatedTime || 'সিরিয়াল অনুযায়ী'}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">ডাক্তার</span>
                  <p className="font-bold text-slate-900 text-sm">{doctor?.name}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium">চেম্বার / রুম</span>
                  <p className="font-bold text-slate-900 text-sm">{bookedData.appointment?.chamberName || doctor?.chamberRoom || 'মূল চেম্বার'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/track/${bookedData.appointmentCode}`}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span>লাইভ সিরিয়াল ট্র্যাকার দেখুন 🔴</span>
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setShowPosPrintModal(true)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>স্লিপ প্রিন্ট করুন</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setBookedData(null);
                      setPatientName('');
                      setPatientPhone('');
                      setPatientAge('');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>নতুন সিরিয়াল নিন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* POS THERMAL TOKEN PRINT MODAL */}
          {showPosPrintModal && bookedData && (
            <PosThermalTokenModal
              token={{
                serialNumber: bookedData.serialNumber,
                appointmentCode: bookedData.appointmentCode,
                patientName: patientName,
                patientPhone: patientPhone,
                patientAge: patientAge,
                appointmentDate: selectedDate,
                estimatedTime: bookedData.estimatedTime,
                timeSlot: bookedData.timeSlot,
                chamberName: bookedData.appointment?.chamberName || doctor?.chamberRoom,
                fee: doctor?.consultationFee,
                createdAt: bookedData.appointment?.createdAt || new Date(),
              }}
              doctor={doctor || { name: 'ডাক্তার চেম্বার' }}
              onClose={() => setShowPosPrintModal(false)}
            />
          )}

        </div>
      ) : (
        /* MAIN BOOKING & DOCTOR DETAILS SECTION */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Doctor Summary Sidebar Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs">
              <img
                src={doctor?.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
                alt={doctor?.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div>
              <h2 className="font-extrabold text-lg text-nuvicaNavy-900 leading-snug">{doctor?.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{doctor?.degrees}</p>
              <p className="text-xs font-bold text-sky-700 mt-0.5">{doctor?.specialization}</p>
            </div>

            {/* Quick Fee & Room Tag */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10.5px] text-slate-400 font-bold block">ভিজিট ফি</span>
                <span className="font-black text-sky-700 text-sm">৳{doctor?.consultationFee || 500}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10.5px] text-slate-400 font-bold block">রুম নম্বর</span>
                <span className="font-bold text-slate-800 text-xs truncate block">{doctor?.chamberRoom || 'সাধারণ চেম্বার'}</span>
              </div>
            </div>

            {/* Expandable Doctor Profile Accordion */}
            <button
              onClick={() => setShowInfoModal(!showInfoModal)}
              className={`w-full py-2.5 px-3.5 rounded-2xl transition-all duration-200 border text-xs font-bold flex items-center justify-between cursor-pointer ${
                showInfoModal
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border-sky-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                ডাক্তারের বিবরণ ও চিকিৎসাসমূহ
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showInfoModal ? 'rotate-180 text-white' : ''}`} />
            </button>

            {showInfoModal && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 leading-relaxed font-medium space-y-2">
                <p>{doctor?.bio || `${doctor?.name} অভিজ্ঞ চিকিৎসক হিসেবে আন্তরিক স্বাস্থ্যসেবা দিয়ে থাকেন।`}</p>
              </div>
            )}

            {/* Direct Call Button */}
            <a
              href={`tel:${doctorPhoneRaw}`}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>চেম্বারের হটলাইন: {doctorPhoneRaw}</span>
            </a>
          </div>

          {/* Booking Form & Schedule Section */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleBookingSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Step 1: Chamber & Date Selection */}
              <div className="space-y-4">
                <h3 className="text-sm sm:text-base font-black text-nuvicaNavy-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <CalendarIcon className="w-4 h-4 text-sky-600" />
                  <span>১. চেম্বার ও তারিখ নির্বাচন</span>
                </h3>

                {/* Chamber Picker if multiple */}
                {doctor?.schedules && doctor.schedules.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">চেম্বার নির্বাচন করুন:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doctor.schedules.map((sch: any) => (
                        <button
                          key={sch.id}
                          type="button"
                          onClick={() => setSelectedScheduleId(sch.id)}
                          className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                            selectedScheduleId === sch.id
                              ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <p className="font-extrabold text-slate-900">{sch.chamberName || 'মূল চেম্বার'}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{sch.startTime} - {sch.endTime}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">সাক্ষাতের তারিখ:</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div className="text-[11.5px] leading-tight text-slate-700">
                      <span className="font-bold text-sky-900 block">স্মার্ট সিরিয়াল ক্রম</span>
                      বুক করার সাথে সাথে ক্রমানুসারে সিরিয়াল নম্বর ও সম্ভাব্য সময় পাবেন।
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Patient Information */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm sm:text-base font-black text-nuvicaNavy-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>২. রোগীর তথ্য</span>
                </h3>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">রোগীর নাম *</label>
                    <input
                      type="text"
                      placeholder="যেমন: মোঃ করিম হাসান"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      placeholder="যেমন: 017XXXXXXXX"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">বয়স (বছর) *</label>
                    <input
                      type="number"
                      placeholder="যেমন: 35"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      min="1"
                      max="120"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">লিঙ্গ</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Male">পুরুষ (Male)</option>
                      <option value="Female">মহিলা (Female)</option>
                      <option value="Other">অন্যান্য (Other)</option>
                    </select>
                  </div>
                </div>

                {/* Optional Reason / Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">সমস্যা বা প্রধান লক্ষণ (ঐচ্ছিক)</label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: ৩ দিন ধরে তীব্র জ্বর ও মাথা ব্যথা..."
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>সিরিয়াল নিশ্চিত করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>তাৎক্ষণিক সিরিয়াল টোকেন নিন ➜</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
                  বুকিং সফল হলে আপনি ডিজিটাল টোকেন ও লাইভ ট্র্যাকিং লিংক পেয়ে যাবেন।
                </p>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
