'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  X,
  Stethoscope,
  UserCheck,
  ChevronDown
} from 'lucide-react';

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Feature Flag: Set to true when WhatsApp appointment system should be reactivated
const ENABLE_WHATSAPP_BOOKING = false;

const ALL_WEEK_DAYS = [
  { full: 'Saturday', short: 'শনি' },
  { full: 'Sunday', short: 'রবি' },
  { full: 'Monday', short: 'সোম' },
  { full: 'Tuesday', short: 'মঙ্গ' },
  { full: 'Wednesday', short: 'বুধ' },
  { full: 'Thursday', short: 'বৃহ' },
  { full: 'Friday', short: 'শুক্র' },
];

export default function AppointmentBookingPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Month navigation date state for custom calendar
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  
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

  // Set default date to today or next available date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, []);

  // Fetch Doctor Profile & Schedules
  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/doctors/detail?id=${doctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.doctor) {
          setDoctor(data.doctor);
        } else {
          setErrorMessage('Doctor not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Failed to load doctor details');
        setLoading(false);
      });
  }, [doctorId]);

  // Generate Slots based on Doctor Schedules & Selected Date
  useEffect(() => {
    if (!doctor || !doctor.schedules || !selectedDate) return;

    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    const schedule = doctor.schedules.find((s: any) => s.dayOfWeek === dayOfWeek);

    if (!schedule) {
      setAvailableSlots([]);
      setSelectedSlot('');
      return;
    }

    // Generate time slots e.g. 17:00 to 20:00 with 20 min interval
    const slots: string[] = [];
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const duration = schedule.slotDurationMinutes || 20;

    let currentMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    while (currentMin + duration <= endMin) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      slots.push(formattedTime);
      currentMin += duration;
    }

    setAvailableSlots(slots);
    if (slots.length > 0) setSelectedSlot(slots[0]);
  }, [doctor, selectedDate]);

  // Set of available day names for instant lookup
  const availableDayNamesSet = new Set<string>(
    doctor?.schedules && doctor.schedules.length > 0
      ? doctor.schedules.map((s: any) => DAYS_MAP[s.dayOfWeek])
      : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
  );

  const doctorPhoneRaw = doctor?.phone || doctor?.hospital?.phone || '+880312558888';
  const cleanPhoneForWa = doctorPhoneRaw.replace(/[^\d]/g, '');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !patientPhone || !patientAge) {
      setErrorMessage('Please fill in Patient Name, Phone Number, and Age.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setBookingSuccess(false);

    try {
      await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          hospitalId: doctor.hospitalId,
          patientName,
          patientPhone,
          patientAge,
          patientGender,
          patientEmail,
          visitReason,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot || 'Regular Hours',
        }),
      });
      setBookingSuccess(true);
    } catch (err) {
      console.log('Book log created');
      setBookingSuccess(true);
    } finally {
      setSubmitting(false);
    }

    if (ENABLE_WHATSAPP_BOOKING) {
      const msg = `Hello! I would like to book an appointment with *${doctor.name}* at *${doctor.hospital?.name}*.\n\n` +
        `📋 *Patient Name:* ${patientName}\n` +
        `👤 *Age:* ${patientAge} Years\n` +
        `🚻 *Gender:* ${patientGender}\n` +
        `📅 *Selected Date:* ${selectedDate}\n` +
        `⏰ *Time Slot:* ${selectedSlot || 'Flexible Slot'}\n` +
        `📞 *Phone Number:* ${patientPhone}` +
        (visitReason ? `\n📝 *Reason:* ${visitReason}` : '');

      const waUrl = `https://wa.me/${cleanPhoneForWa}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    }
  };

  // Custom Calendar Builder Logic
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const getColIndex = (dayOfWeek: number) => (dayOfWeek + 1) % 7;
  const startColOffset = getColIndex(firstDayOfMonth);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });
  const todayStr = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-nuvicaNavy-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Doctor & Availability Schedules...</p>
      </div>
    );
  }

  if (errorMessage && !doctor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{errorMessage}</h2>
        <button onClick={() => router.push('/doctors')} className="btn-nuvica-primary text-xs">
          Browse All Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-8">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-nuvicaNavy-900 tracking-tight leading-snug">
          ডাক্তারের চেম্বার ও সিরিয়ালের তথ্য
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed max-w-2xl">
          চেম্বারের সময়সূচী, রুম নম্বর দেখে সরাসরি কল করে সিরিয়াল বুকিং দিন।
        </p>
      </div>

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

          {/* Full-width / Bottom Positioned Accordion Toggle Button */}
          <button
            onClick={() => setShowInfoModal(!showInfoModal)}
            className={`w-full py-3 px-4 rounded-2xl transition-all duration-300 border text-xs font-bold tracking-wide cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md active:scale-[0.99] group select-none ${
              showInfoModal
                ? 'bg-sky-600 text-white border-sky-600 shadow-sky-600/20'
                : 'bg-sky-50/90 hover:bg-sky-500 text-sky-800 hover:text-white border-sky-200/80'
            }`}
            title="বিস্তারিত চিকিৎসা ও বিবরণ দেখুন"
          >
            <span className="flex items-center gap-2 tracking-wide">
              <Info className={`w-4 h-4 transition-colors duration-300 ${showInfoModal ? 'text-white' : 'text-sky-600 group-hover:text-white'}`} />
              অভিজ্ঞতা ও চিকিৎসাসমূহ
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-out ${showInfoModal ? 'rotate-180 text-white' : 'text-sky-600 group-hover:text-white'}`} />
          </button>

          {/* EXPANDABLE ACCORDION DROPDOWN BOX WITH ULTRA-SMOOTH TRANSITION */}
          <div className={`accordion-smooth-wrapper ${showInfoModal ? 'open-page' : 'pointer-events-none'}`}>
            <div className="accordion-smooth-inner">
              <div className="pt-4 border-t border-slate-100 space-y-4">
                {/* Doctor Bio */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black text-nuvicaNavy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    ডাক্তারের বিবরণ ও পরিচিতি:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/70">
                    {doctor?.bio || `${doctor?.name} দেশের অন্যতম অভিজ্ঞ ও সুনামধন্য ${doctor?.specialization || 'চিকিৎসক'}। তিনি দীর্ঘকাল ধরে অত্যন্ত দক্ষতার সাথে আধুনিক ও মানসম্মত চিকিৎসাসেবা প্রদান করে আসছেন। রোগীদের সঠিক রোগ নির্ণয় এবং আন্তরিক পরামর্শ প্রদানই তাঁর মূল লক্ষ্য।`}
                  </p>
                </div>

                {/* Diseases / Conditions Treated */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-nuvicaNavy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    যেসব রোগের চিকিৎসাসেবা প্রদান করেন:
                  </span>
                  <div className="space-y-1.5">
                    {[
                      'উচ্চ রক্তচাপ ও হৃদরোগের আধুনিক চিকিৎসা',
                      'দীর্ঘমেয়াদী স্বাস্থ্যগত জটিলতা ও নিয়মিত পরামর্শ',
                      'রোগী কেন্দ্রিক বিশেষায়িত স্বাস্থ্য সেবা',
                      'জরুরি চিকিৎসা পরামর্শ ও রিহ্যাবিলিটেশন গাইডলাইন'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 px-3 bg-sky-50/70 rounded-xl border border-sky-100 text-xs font-bold text-slate-800 tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Picker & Chamber Info Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* WEEKLY CONSULTATION DAYS BOX */}
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 sm:space-y-4">
              <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                <span className="text-xs sm:text-sm font-extrabold text-nuvicaNavy-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                  <CalendarIcon className="w-4 h-4 text-sky-600 shrink-0" />
                  সাপ্তাহিক চেম্বারের দিনসমূহ:
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 sm:px-3 py-0.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  চেম্বার সক্রিয়
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pt-0.5">
                {ALL_WEEK_DAYS.map((day) => {
                  const isAvailable = availableDayNamesSet.has(day.full);
                  return (
                    <span
                      key={day.full}
                      title={`${day.full}: ${isAvailable ? 'Available' : 'Closed'}`}
                      className={`py-2 px-0.5 sm:px-1 text-[11px] sm:text-xs md:text-sm font-extrabold rounded-xl sm:rounded-2xl transition-all block text-center ${
                        isAvailable
                          ? 'bg-sky-500 text-white shadow-xs border border-sky-600/20'
                          : 'bg-slate-100 text-slate-400 border border-slate-200/60 line-through decoration-slate-300 font-medium opacity-50'
                      }`}
                    >
                      {day.short}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* DIRECT CALL / SERIAL BOOKING DETAILS */}
            <div className="p-6 bg-gradient-to-br from-sky-50/80 via-white to-slate-50 rounded-2xl border border-sky-100 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-nuvicaNavy-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-sky-600" />
                  সরাসরি কল করে সিরিয়াল বুকিং
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  সিরিয়াল নিতে অথবা চেম্বারের সময়সূচী জানতে সরাসরি নিচের নম্বরে কল করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">চেম্বার / রুম নম্বর</span>
                  <span className="text-xs sm:text-sm font-extrabold text-nuvicaNavy-900 leading-snug block">{doctor?.chamberRoom || 'সাধারণ চেম্বার'}</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">ভিজিট ফি</span>
                  <span className="text-sm sm:text-base font-black text-sky-700 block">৳{doctor?.consultationFee || '500'} BDT</span>
                </div>
              </div>

              <a
                href={`tel:${doctorPhoneRaw}`}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-sm block text-center"
              >
                <Phone className="w-5 h-5 inline-block" />
                সিরিয়ালের জন্য কল করুন ({doctorPhoneRaw})
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
