'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock, 
  PhoneCall, 
  Video, 
  ShieldCheck, 
  Stethoscope, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Share2, 
  Check, 
  Heart,
  CalendarCheck,
  Star,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Sparkles,
  Phone,
  ThumbsUp,
  Briefcase,
  CheckCircle,
  ExternalLink,
  MapPinned,
  CreditCard,
  Wallet
} from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

interface DoctorDetailClientProps {
  doctor: any;
}

const BANGLA_DAYS_MAP = [
  { day: 6, short: 'শনি', full: 'শনিবার' },
  { day: 0, short: 'রবি', full: 'রবিবার' },
  { day: 1, short: 'সোম', full: 'সোমবার' },
  { day: 2, short: 'মঙ্গ', full: 'মঙ্গলবার' },
  { day: 3, short: 'বুধ', full: 'বুধবার' },
  { day: 4, short: 'বৃহ', full: 'বৃহস্পতিবার' },
  { day: 5, short: 'শুক্র', full: 'শুক্রবার' },
];

const SPECIALIZATION_BANGLA_MAP: Record<string, string> = {
  'Cardiology': 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
  'Cardiologist': 'হৃদরোগ বিশেষজ্ঞ',
  'Senior Consultant Cardiologist': 'সিনিয়র কনসালটেন্ট হৃদরোগ বিশেষজ্ঞ',
  'Medicine Specialist': 'মেডিসিন বিশেষজ্ঞ',
  'General Physician': 'জেনারেল ফিজিশিয়ান',
  'Gynecology & Obstetrics': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Gynecologist': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Consultant Gynecologist & Laparoscopic Surgeon': 'কনসালটেন্ট গাইনোকোলজিস্ট ও ল্যাপারোস্কোপিক সার্জন',
  'Pediatrics': 'শিশু রোগ বিশেষজ্ঞ',
  'Pediatrician': 'শিশু রোগ বিশেষজ্ঞ',
  'Orthopedics': 'হাড় ও জোড় বিশেষজ্ঞ',
  'Orthopedic Surgeon': 'অর্থোপেডিক সার্জন',
  'Trauma & Joint Replacement Surgeon': 'ট্রমা ও জয়েন্ট রিপ্লেসমেন্ট সার্জন',
  'Dermatology': 'চর্ম ও যৌনরোগ বিশেষজ্ঞ',
  'Dermatologist': 'চর্ম ও যৌনরোগ বিশেষজ্ঞ',
  'Neurology': 'নিউরোমেডিসিন বিশেষজ্ঞ',
  'Neurologist': 'নিউরোলজিস্ট',
  'ENT Specialist': 'নাক, কান ও গলা বিশেষজ্ঞ',
  'Ophthalmology': 'চক্ষু বিশেষজ্ঞ',
  'Eye Specialist': 'চক্ষু রোগ বিশেষজ্ঞ',
  'Dental Specialist': 'দন্ত রোগ বিশেষজ্ঞ',
  'Psychiatry': 'মানসিক রোগ বিশেষজ্ঞ',
  'Urology': 'ইউরোলজি বিশেষজ্ঞ',
  'Gastroenterology': 'গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ',
  'Nephrology': 'কিডনি রোগ বিশেষজ্ঞ',
};

const DOCTOR_NAME_BANGLA_MAP: Record<string, string> = {
  'Dr. Mahbubur Rahman Chowdhury': 'ডা. মাহবুবুর রহমান চৌধুরী',
  'Dr. Selina Parveen': 'ডা. সেলিনা পারভীন',
  'Dr. Kazi Ariful Haque': 'ডা. কাজী আরিফুল হক',
  'Dr. Nuzhat Fatema': 'ডা. নুজহাত ফাতেমা',
  'Dr. Towhidul Islam': 'ডা. তৌহিদুল ইসলাম',
  'Dr. Sharmeen Sultana': 'ডা. শারমীন সুলতানা',
  'Dr. Md. Rafiqul Islam': 'ডা. মোঃ রফিকুল ইসলাম',
  'Dr. Farida Yasmin': 'ডা. ফরিদা ইয়াসমিন',
  'Dr. A.H.M. Kamal Hossain': 'ডা. এ.এইচ.এম কামাল হোসেন',
  'Dr. Nazmul Huda': 'ডা. নাজমুল হুদা',
  'Dr. Syeda Rawnak Jahan': 'ডা. সৈয়দা রওনক জাহান',
  'Dr. Md. Moniruzzaman': 'ডা. মোঃ মনিরুজ্জামান',
  'Dr. Sheikh Asaduzzaman': 'ডা. শেখ আসাদুজ্জামান',
  'Dr. Afroza Begum': 'ডা. আফরোজা বেগম',
  'Dr. Md. Zakir Hossain': 'ডা. মোঃ জাকির হোসেন',
  'Dr. Rehana Chowdhury': 'ডা. রেহানা চৌধুরী',
  'Dr. Md. Enamul Kabir': 'ডা. মোঃ এনামুল কবির',
  'Dr. Shahriar Ahmed': 'ডা. শাহরিয়ার আহমেদ',
  'Dr. Md. Motiur Rahman': 'ডা. মোঃ মতিউর রহমান',
  'Dr. Tahmina Akter': 'ডা. তাহমিনা আক্তার',
  'Dr. Md. Saiful Islam': 'ডা. মোঃ সাইফুল ইসলাম',
  'Dr. Golam Sarwar': 'ডা. গোলাম সারোয়ার',
  'Dr. Rumana Parvin': 'ডা. রুমানা পারভীন',
  'Dr. Md. Imran Hossain': 'ডা. মোঃ ইমরান হোসেন',
  'Dr. A.K.M. Fazlul Haque': 'ডা. এ.কে.এম ফজলুল হক',
  'Dr. Sayeeda Sultana': 'ডা. সাইয়িদা সুলতানা',
  'Dr. Md. Tariq Hasan': 'ডা. মোঃ তারিক হাসান',
  'Dr. Nazma Akter': 'ডা. নাজমা আক্তার',
  'Dr. Md. Babul Akhter': 'ডা. মোঃ বাবুল আক্তার',
  'Dr. Shamim Ara Begum': 'ডা. শামীম আরা বেগম',
  'Dr. Tanvir Ahmed': 'ডা. তানভীর আহমেদ',
  'Dr. Md. Tariqul Islam': 'ডা. মোঃ তারিকুল ইসলাম',
  'Dr. Shamima Nasrin': 'ডা. শামীমা নাসরিন',
  'Dr. Md. Asaduzzaman': 'ডা. মোঃ আসাদুজ্জামান',
};

const BANGLA_WORD_MAP: Record<string, string> = {
  'dr.': 'ডা.',
  'dr': 'ডা.',
  'prof.': 'অধ্যাপক',
  'prof': 'অধ্যাপক',
  'md.': 'মোঃ',
  'md': 'মোঃ',
  'mst.': 'মোছাঃ',
  'mst': 'মোছাঃ',
  'mohammad': 'মোহাম্মদ',
  'muhammad': 'মুহাম্মদ',
  'sheikh': 'শেখ',
  'syed': 'সৈয়দ',
  'syeda': 'সৈয়দা',
  'kazi': 'কাজী',
  'mahbubur': 'মাহবুবুর',
  'rahman': 'রহমান',
  'chowdhury': 'চৌধুরী',
  'selina': 'সেলিনা',
  'parveen': 'পারভীন',
  'parvin': 'পারভীন',
  'ariful': 'আরিফুল',
  'haque': 'হক',
  'nuzhat': 'নুজহাত',
  'fatema': 'ফাতেমা',
  'fahmida': 'ফাহমিদা',
  'towhidul': 'তৌহিদুল',
  'islam': 'ইসলাম',
  'sharmeen': 'শারমীন',
  'sharmin': 'শারমীন',
  'sultana': 'সুলতানা',
  'rafiqul': 'রফিকুল',
  'farida': 'ফরিদা',
  'yasmin': 'ইয়াসমিন',
  'kamal': 'কামাল',
  'hossain': 'হোসেন',
  'huda': 'হুদা',
  'moniruzzaman': 'মনিরুজ্জামান',
  'asaduzzaman': 'আসাদুজ্জামান',
  'afroza': 'আফরোজা',
  'begum': 'বেগম',
  'zakir': 'জাকির',
  'rehana': 'রেহানা',
  'enamul': 'এনামুল',
  'kabir': 'কবির',
  'shahriar': 'শাহরিয়ার',
  'ahmed': 'আহমেদ',
  'motiur': 'মতিউর',
  'tahmina': 'তাহমিনা',
  'akter': 'আক্তার',
  'saiful': 'সাইফুল',
  'golam': 'গোলাম',
  'sarwar': 'সারোয়ার',
  'rumana': 'রুমানা',
  'imran': 'ইমরান',
  'fazlul': 'ফজলুল',
  'sayeeda': 'সাইয়িদা',
  'tariq': 'তারিক',
  'tariqul': 'তারিকুল',
  'nazma': 'নাজমা',
  'babul': 'বাবুল',
  'akhter': 'আক্তার',
  'shamim': 'শামীম',
  'ara': 'আরা',
  'tanvir': 'তানভীর',
  'shamima': 'শামীমা',
  'nasrin': 'নাসরিন',
  'alam': 'আলম',
  'arifur': 'আরিফুর',
  'nasim': 'নাসিম',
  'ali': 'আলী',
  'mostafa': 'মোস্তফা',
  'sirajul': 'সিরাজুল',
  'aminul': 'আমিনুল',
  'shakil': 'শাকিল',
  'jahangir': 'জাহাঙ্গীর',
  'mostafizur': 'মোস্তাফিজুর',
};

function formatDoctorNameBangla(name: string): string {
  if (!name) return '';
  if (DOCTOR_NAME_BANGLA_MAP[name]) return DOCTOR_NAME_BANGLA_MAP[name];

  const words = name.split(/\s+/);
  const convertedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[,.:]/g, '');
    const cleanWithDot = w.toLowerCase();
    if (BANGLA_WORD_MAP[cleanWithDot]) return BANGLA_WORD_MAP[cleanWithDot];
    if (BANGLA_WORD_MAP[cleanWord]) return BANGLA_WORD_MAP[cleanWord];
    return w;
  });

  let result = convertedWords.join(' ');
  if (!result.startsWith('ডা.') && !result.startsWith('অধ্যাপক')) {
    result = `ডা. ${result}`;
  }
  return result;
}

function toBanglaDigits(str: string | number): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatBanglaTime(timeStr: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);

  const match = clean.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return toBanglaDigits(clean);

  let hour = parseInt(match[1], 10);
  const min = match[2] ? match[2] : '00';

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  let period = 'সকাল';
  if (hour >= 12 && hour < 15) period = 'দুপুর';
  else if (hour >= 15 && hour < 18) period = 'বিকাল';
  else if (hour >= 18 && hour < 20) period = 'সন্ধ্যা';
  else if (hour >= 20 || hour < 5) period = 'রাত';

  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  const minFormatted = min === '00' ? '' : `:${toBanglaDigits(min)}`;
  return `${period} ${toBanglaDigits(displayHour)}${minFormatted} টা`;
}

function getDoctorScheduleInfo(schedules?: any[]): { daysText: string; timeText: string } {
  if (!schedules || schedules.length === 0) {
    return {
      daysText: 'শনিবার হতে বৃহস্পতিবার',
      timeText: 'বিকাল ৫:০০ টা হতে রাত ৮:০০ টা',
    };
  }

  const BANGLA_WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];
  const DAY_FULL_BN: Record<number, string> = {
    6: 'শনিবার',
    0: 'রবিবার',
    1: 'সোমবার',
    2: 'মঙ্গলবার',
    3: 'বুধবার',
    4: 'বৃহস্পতিবার',
    5: 'শুক্রবার',
  };

  const activeDays = schedules
    .map((s) => s.dayOfWeek)
    .filter((d) => d !== undefined && d !== null);

  const sortedDays = BANGLA_WEEK_ORDER.filter((d) => activeDays.includes(d));

  let daysText = '';
  if (sortedDays.length === 7) {
    daysText = 'সপ্তাহের প্রতিদিন';
  } else if (sortedDays.length === 6 && !sortedDays.includes(5)) {
    daysText = 'শনিবার হতে বৃহস্পতিবার';
  } else if (sortedDays.length >= 3) {
    const startIdx = BANGLA_WEEK_ORDER.indexOf(sortedDays[0]);
    const endIdx = BANGLA_WEEK_ORDER.indexOf(sortedDays[sortedDays.length - 1]);
    const isContiguous = endIdx - startIdx + 1 === sortedDays.length;
    if (isContiguous) {
      daysText = `${DAY_FULL_BN[sortedDays[0]]} হতে ${DAY_FULL_BN[sortedDays[sortedDays.length - 1]]}`;
    } else {
      daysText = sortedDays.map((d) => DAY_FULL_BN[d]).join(', ');
    }
  } else if (sortedDays.length === 2) {
    daysText = `${DAY_FULL_BN[sortedDays[0]]} ও ${DAY_FULL_BN[sortedDays[1]]}`;
  } else if (sortedDays.length === 1) {
    daysText = `শুধুমাত্র ${DAY_FULL_BN[sortedDays[0]]}`;
  } else {
    daysText = 'শনিবার হতে বৃহস্পতিবার';
  }

  const firstSched = schedules[0];
  let timeText = '';
  if (firstSched?.startTime && firstSched?.endTime) {
    timeText = `${formatBanglaTime(firstSched.startTime)} হতে ${formatBanglaTime(firstSched.endTime)}`;
  } else {
    timeText = 'বিকাল ৫:০০ টা হতে রাত ৮:০০ টা';
  }

  return { daysText, timeText };
}

export default function DoctorDetailClientView({ doctor }: DoctorDetailClientProps) {
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [consultationType, setConsultationType] = useState<'in_person' | 'video'>('in_person');
  const [selectedChamberIndex, setSelectedChamberIndex] = useState(0);

  const specializationBn =
    doctor.department?.nameBn ||
    SPECIALIZATION_BANGLA_MAP[doctor.specialization] ||
    doctor.specialization;

  const doctorNameBn = formatDoctorNameBangla(doctor.name);

  const isVerified = (doctor as any).isVerified !== undefined
    ? Boolean((doctor as any).isVerified)
    : Boolean((doctor.subscriptionExpiresAt && new Date(doctor.subscriptionExpiresAt) > new Date()) || doctor.bmdcNumber || true);

  // Group schedules by chamber / hospital
  const chambers = useMemo(() => {
    if (!doctor.schedules || doctor.schedules.length === 0) {
      return [{
        name: doctor.hospital?.name || 'প্রধান চেম্বার',
        address: doctor.chamberRoom || doctor.hospital?.address || 'চুয়াডাঙ্গা',
        phone: doctor.phone || doctor.hospital?.phone || '+88076162588',
        isTelemedicine: false,
        fee: doctor.consultationFee || 800,
        schedules: []
      }];
    }

    const map: Record<string, any> = {};
    doctor.schedules.forEach((s: any) => {
      const key = (s.chamberName && s.chamberName.trim()) || doctor.hospital?.name || 'প্রধান চেম্বার';
      if (!map[key]) {
        map[key] = {
          name: key,
          address: s.chamberAddress || doctor.chamberRoom || doctor.hospital?.address || 'চেম্বার কক্ষ',
          phone: s.serialPhone || doctor.phone || doctor.hospital?.phone || '+88076162588',
          isTelemedicine: Boolean(s.isTelemedicine),
          fee: s.consultationFee || doctor.consultationFee || 800,
          schedules: []
        };
      }
      map[key].schedules.push(s);
    });

    return Object.values(map);
  }, [doctor.schedules, doctor.hospital, doctor.chamberRoom, doctor.phone, doctor.consultationFee]);

  const currentChamber = chambers[selectedChamberIndex] || chambers[0];
  const { daysText, timeText } = getDoctorScheduleInfo(currentChamber?.schedules?.length > 0 ? currentChamber.schedules : doctor.schedules);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const primaryPhone = currentChamber?.phone || doctor.phone || doctor.hospital?.phone || '+88076162588';

  const treatedList = doctor.treatedDiseases
    ? doctor.treatedDiseases.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [
        'হৃদরোগ ও উচ্চ রক্তচাপের আধুনিক চিকিৎসা',
        'ইসিজি, ইকো ও হার্ট অ্যাটাক পরবর্তী পুনর্বাসন',
        'ডায়াবেটিস ও হরমোনজনিত জটিলতার পরামর্শ',
        'দীর্ঘমেয়াদী মেডিসিন ও ইনফেকশন কেয়ার',
        'ল্যাব টেস্ট ও রিপোর্ট পর্যালোচনা',
      ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-24 selection:bg-sky-100 selection:text-sky-900">
      
      {/* ========================================================================= */}
      {/* 💻 DESKTOP / PC VIEW (Matching User's Desktop Reference Image) */}
      {/* ========================================================================= */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-6 space-y-6">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-700 transition-colors">হোম</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/doctors" className="hover:text-emerald-700 transition-colors">সকল ডাক্তার</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-bold">{doctorNameBn}</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors cursor-pointer ${
                isFavorite ? 'text-rose-500' : 'text-slate-500'
              }`}
              title="পছন্দের তালিকায় রাখুন"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>

        {/* 🌟 1. Top Wide Panoramic Banner & Overlapping Circular Avatar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Panoramic Backdrop Banner */}
          <div className="h-56 lg:h-64 w-full relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-800 to-sky-900">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&auto=format&fit=crop&q=80"
              alt="Medical Consultation Banner"
              className="w-full h-full object-cover opacity-35 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Doctor Header Profile Block */}
          <div className="px-8 pb-8 pt-0 relative">
            
            {/* Overlapping Circular Avatar on Left */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 mb-4">
              
              <div 
                onClick={() => setShowImageLightbox(true)}
                className="relative w-36 h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-emerald-50 cursor-pointer group shrink-0 hover:ring-4 hover:ring-emerald-400/40 transition-all"
                title="বড় করে দেখতে ক্লিক করুন"
              >
                <img
                  src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>

            {/* Doctor Name, Degree, Specialization & BMDC Registration */}
            <div className="space-y-1.5 pt-1">
              
              {/* Doctor Name with Verified Blue Tick */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-2xl lg:text-3xl text-slate-900 leading-tight tracking-tight">
                  {doctorNameBn}
                </h1>
                {isVerified && (
                  <OfficialVerifiedBadge className="w-6 h-6 shrink-0 select-none inline-block align-middle" />
                )}
              </div>

              {/* Degrees */}
              <p className="text-sm font-medium text-slate-600 leading-normal">
                {doctor.degrees}
              </p>

              {/* Specialization */}
              <p className="text-base lg:text-lg font-extrabold text-sky-700 leading-normal pt-0.5">
                {specializationBn}
              </p>

              {/* Registration Number (BMDC) */}
              <p className="text-xs text-slate-400 font-semibold tracking-tight pt-0.5">
                BMDC: {doctor.bmdcNumber || 'A-31205'}
              </p>

            </div>

          </div>

        </div>

        {/* 🌟 2. 2-Column Main Layout: Left Main Info (70%) + Right Sidebar (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Doctor Profile + Practice Experience (70%) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* A. Doctor Profile (Bio) */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4 transition-colors duration-300">
              <h2 className="font-extrabold text-lg text-slate-900">
                ডাক্তারের পরিচিতি
              </h2>

              {/* Smooth Collapsible Bio Container */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  showFullBio ? 'max-h-[1000px]' : 'max-h-[76px]'
                }`}
                style={{
                  WebkitMaskImage: showFullBio
                    ? 'none'
                    : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                  maskImage: showFullBio
                    ? 'none'
                    : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                }}
              >
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {doctor.bio || `${doctorNameBn} একজন দক্ষ ও অভিজ্ঞ ${specializationBn}। তিনি দীর্ঘকাল ধরে অত্যন্ত সুনামের সাথে আধুনিক চিকিৎসা সেবা ও রোগীর পরামর্শ প্রদান করে আসছেন। সঠিক রোগ নির্ণয় ও মানবিক চিকিৎসা সেবায় তিনি বিশেষভাবে সমাদৃত।`}
                </p>

                {/* Diseases / Conditions Treated */}
                {treatedList.length > 0 && (
                  <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showFullBio ? 'opacity-100 translate-y-0 mt-4 pt-4 border-t border-slate-100' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <h3 className="font-extrabold text-sm text-slate-900 mb-2.5">
                      যেসব রোগের চিকিৎসা ও সেবা প্রদান করেন:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium pb-1">
                      {treatedList.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-xs font-bold text-slate-900 hover:text-black flex items-center gap-1 cursor-pointer transition-colors py-0.5"
                >
                  <span>{showFullBio ? 'See Less' : 'See More'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showFullBio ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* B. Practice Experience (Chambers & Hospitals) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-lg text-slate-900">
                  চেম্বারের তালিকা ও সময়সূচি
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                  {toBanglaDigits(chambers.length)}টি সক্রিয় চেম্বার
                </span>
              </div>

              {/* Stacked Hospital Experience Cards (Clean Modern Structure) */}
              <div className="space-y-4">
                {chambers.map((ch: any, idx: number) => {
                  const { daysText: chDays, timeText: chTime } = getDoctorScheduleInfo(
                    ch.schedules.length > 0 ? ch.schedules : doctor.schedules
                  );

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all space-y-4 relative group"
                    >
                      {/* 1. Top Section: Hospital Icon + Name + Address + Share Button */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50/40 to-slate-100 border border-sky-100/90 flex items-center justify-center text-sky-600 shadow-2xs shrink-0">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-base sm:text-lg text-nuvicaNavy-950 leading-snug">
                              {ch.name}
                            </h3>
                            {ch.address && (
                              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">
                                {ch.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={handleShare}
                          className="text-slate-300 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2. Middle Section: Visiting Hour Bar (Days & Time) */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-[#F8FAFD] border border-slate-200/80 overflow-hidden text-xs">
                        <div className="bg-slate-100 text-slate-700 font-extrabold px-4 py-2.5 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200/80 flex items-center gap-1.5">
                          <span>Visiting Hour</span>
                        </div>
                        <div className="flex-1 px-4 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-slate-700 font-medium">
                          {/* কি বার থেকে কি বার রোগী দেখেন */}
                          <span className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
                            <span>{chDays}</span>
                          </span>
                          {/* সময়সূচি */}
                          <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
                            <span>{chTime}</span>
                          </span>
                        </div>
                      </div>

                      {/* 3. Bottom Section: Fee & Call Number (Below Visiting Hour) */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                        {/* Consultation Fee Pill */}
                        <div className="bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-2xs">
                          <Wallet className="w-4 h-4 text-[#047857] shrink-0" />
                          <span>Consultation Fee Tk {toBanglaDigits(ch.fee)}</span>
                        </div>

                        {/* Serial Direct Call Button */}
                        <a
                          href={`tel:${(ch.phone || primaryPhone).replace(/\s+/g, '')}`}
                          className="bg-[#007A78] hover:bg-[#006664] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                          title="সরাসরি সিরিয়ালে কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5 text-white" />
                          <span className="font-mono font-bold tracking-wide">{ch.phone || primaryPhone}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR: Medical Actions + Make Appointment CTA (30%) */}
          <div className="space-y-6">
            
            {/* A. Medical Actions & Services Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                প্রধান সেবাসমূহ
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                {treatedList.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B. Telemedicine Online Card */}
            <div className="bg-gradient-to-br from-sky-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                <Video className="w-4 h-4" />
                <span>টেলিমেডিসিন সেবা</span>
              </div>

              <h4 className="font-extrabold text-base leading-snug">
                ঘরে বসেই ভিডিও কলে বিশেষজ্ঞ পরামর্শ নিন
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                অনলাইন ফি: <strong className="text-emerald-400">৳ {toBanglaDigits(doctor.telemedicineFee || 500)} টাকা</strong>
              </p>

              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="w-full bg-white hover:bg-sky-50 text-slate-900 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-700" />
                <span>টেলিমেডিসিন সিরিয়ালে কল দিন</span>
              </a>
            </div>

          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW (2 Separate Standalone Rounded Rectangular Boxes) */}
      {/* ========================================================================= */}
      <div className="block md:hidden max-w-md mx-auto bg-[#F4F7FB] min-h-screen relative shadow-2xl pb-28 pt-3 px-3 space-y-2.5">
        
        {/* 📦 BOX 1: Standalone Rounded Cover Banner Box */}
        <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-gradient-to-r from-emerald-200 via-teal-100 to-sky-200">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
            alt="Cover Banner"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />

          {/* Top Floating Controls */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
            <Link
              href="/doctors"
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  isFavorite ? 'text-[#FF6B6B]' : 'text-slate-600 hover:text-[#FF6B6B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF6B6B]' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 📦 BOX 2: Standalone Rounded Profile Info Card */}
        <div className="bg-white rounded-2xl px-5 pt-0 pb-6 shadow-sm border border-slate-200/80 relative">
          
          {/* Overlapping Larger Circular Avatar (Positioned Higher) */}
          <div 
            onClick={() => setShowImageLightbox(true)}
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-lg shadow-slate-900/15 -mt-20 overflow-hidden bg-slate-100 cursor-pointer shrink-0"
            title="ছবি বড় করে দেখতে ক্লিক করুন"
          >
            <img
              src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
              alt={doctor.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Doctor Identity Block */}
          <div className="space-y-1 pt-2">
            
            {/* Doctor Name with Verified Blue Tick */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-black text-2xl text-slate-900 leading-tight tracking-tight">
                {doctorNameBn}
              </h1>
              {isVerified && (
                <OfficialVerifiedBadge className="w-5 h-5 shrink-0 select-none inline-block align-middle" />
              )}
            </div>

            {/* Degrees */}
            <p className="text-xs text-slate-500 font-medium leading-normal">
              {doctor.degrees}
            </p>

            {/* Specialization */}
            <p className="text-[15px] font-extrabold text-sky-700 leading-normal pt-0.5">
              {specializationBn}
            </p>

            {/* BMDC Registration Number */}
            <p className="text-xs text-slate-400 font-semibold tracking-tight pt-0.5">
              BMDC: {doctor.bmdcNumber || 'A-31205'}
            </p>
          </div>

          {/* About Section Inside Rounded Rectangular Box */}
          <div className="bg-[#F8FAFD] rounded-2xl p-4 border border-slate-100 shadow-2xs mt-4 transition-colors duration-300">
            <h2 className="font-extrabold text-sm text-slate-900 mb-1.5">পরিচিতি</h2>

            {/* Smooth Collapsible Bio Container */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showFullBio ? 'max-h-[800px]' : 'max-h-[60px]'
              }`}
              style={{
                WebkitMaskImage: showFullBio
                  ? 'none'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                maskImage: showFullBio
                  ? 'none'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              }}
            >
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {doctor.bio || `${doctorNameBn} একজন দক্ষ ও অভিজ্ঞ ${specializationBn}। তিনি দীর্ঘকাল ধরে অত্যন্ত সুনামের সাথে আধুনিক চিকিৎসা সেবা ও রোগীর পরামর্শ প্রদান করে আসছেন।`}
              </p>

              {/* Diseases / Conditions Treated */}
              {treatedList.length > 0 && (
                <div
                  className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showFullBio ? 'opacity-100 translate-y-0 mt-3 pt-3 border-t border-slate-200/80' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="font-extrabold text-[11.5px] text-slate-900 tracking-tight mb-2">
                    যেসব রোগের চিকিৎসা ও সেবা প্রদান করেন:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium pb-1">
                    {treatedList.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Lower Right Corner Toggle Button */}
            <div className="flex justify-end pt-1.5">
              <button
                type="button"
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-xs font-bold text-slate-900 hover:text-black cursor-pointer flex items-center gap-1 transition-colors py-0.5"
              >
                <span>{showFullBio ? 'Show less' : 'Show more'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showFullBio ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* 2. Mobile Content Body Below */}
        <div className="space-y-3 pt-1">

          {/* Book appointment section */}
          <div className="bg-white rounded-3xl p-5 shadow-2xs border border-slate-100 space-y-4">
            <h2 className="font-extrabold text-base text-slate-900">Book appointment</h2>

            <div className="bg-[#F1F4F9] p-1.5 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setConsultationType('in_person')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  consultationType === 'in_person' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                In Person (চেম্বার)
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('video')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  consultationType === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                টেলিমেডিসিন
              </button>
            </div>

            {consultationType === 'in_person' ? (
              <div className="space-y-3.5">
                {chambers.map((ch: any, idx: number) => {
                  const { daysText: chDays, timeText: chTime } = getDoctorScheduleInfo(ch.schedules.length > 0 ? ch.schedules : doctor.schedules);

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5 relative"
                    >
                      {/* 1. Top Row: Hospital Icon + Name + Address + Share */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50 border border-sky-100 p-2 flex items-center justify-center text-sky-700 shadow-2xs shrink-0">
                            <Building2 className="w-5 h-5 text-sky-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-black text-sm text-nuvicaNavy-950 leading-snug">
                              {ch.name}
                            </h3>
                            {ch.address && (
                              <p className="text-[11.5px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                                {ch.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={handleShare}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition shrink-0 cursor-pointer"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2. Middle Row: Visiting Hour Bar with Days (কি বার থেকে কি বার) & Timing */}
                      <div className="flex flex-col rounded-2xl bg-[#F8FAFD] border border-slate-200/80 overflow-hidden text-xs">
                        <div className="bg-slate-100/90 text-slate-700 font-black px-3.5 py-1.5 border-b border-slate-200/80 flex items-center gap-1.5">
                          <span>Visiting Hour</span>
                        </div>
                        <div className="px-3.5 py-2 space-y-1 text-slate-700 font-medium">
                          {/* কি বার থেকে কি বার রোগী দেখেন */}
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
                            <span>{chDays}</span>
                          </div>
                          {/* সময়সূচি */}
                          <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
                            <span>{chTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Bottom Row: Fee & Call Button (Below Visiting Hour) */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        {/* Consultation Fee Badge */}
                        <div className="bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/80 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs">
                          <Wallet className="w-3.5 h-3.5 text-[#047857]" />
                          <span>Fee Tk {toBanglaDigits(ch.fee)}</span>
                        </div>

                        {/* Direct Call Button */}
                        <a
                          href={`tel:${(ch.phone || primaryPhone).replace(/\s+/g, '')}`}
                          className="bg-[#007A78] hover:bg-[#006664] text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                          title="সরাসরি সিরিয়ালে কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5 text-white" />
                          <span className="font-mono">{ch.phone || primaryPhone}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#F8FAFD] p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>টেলিমেডিসিন ভিডিও পরামর্শ</span>
                  </span>
                  <span className="text-emerald-700 font-black">
                    ৳ {toBanglaDigits(doctor.telemedicineFee || 500)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ঘরে বসেই ভিডিও বা অডিও কলে বিশেষজ্ঞ পরামর্শ ও তাৎক্ষণিক ডিজিটাল প্রেসক্রিপশন গ্রহণ করুন।
                </p>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-3xl p-5 shadow-2xs border border-slate-100 space-y-3">
            <h2 className="font-extrabold text-base text-slate-900">Services & Specialties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {treatedList.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-[#F8FAFD] rounded-xl text-xs font-medium text-slate-700 border border-slate-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 z-50 shadow-xl">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="w-13 h-13 rounded-2xl bg-[#F0F4FA] hover:bg-sky-50 text-slate-800 flex items-center justify-center shrink-0 shadow-2xs"
            >
              <PhoneCall className="w-5 h-5 text-sky-700" />
            </a>

            <Link
              href={`/book/${doctor.id || doctor.slug}`}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <span>Check availability</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 🖼️ Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={showImageLightbox}
        onClose={() => setShowImageLightbox(false)}
        imageUrl={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
        doctorName={doctorNameBn}
        specialization={specializationBn}
        hospitalName={doctor.hospital?.name}
        phone={primaryPhone}
      />

    </div>
  );
}
