'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock,
  ArrowUpRight, 
  Info, 
  ChevronRight, 
  UserCheck, 
  Stethoscope, 
  CheckCircle2, 
  PhoneCall, 
  ZoomIn,
  Video,
  MapPin,
  X,
  ShieldCheck,
  Award,
  Sparkles,
  Phone
} from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';
import DoctorCardName from '@/components/DoctorCardName';

interface DoctorCardProps {
  doc: {
    id: string;
    slug?: string;
    name: string;
    degrees: string;
    specialization: string;
    bmdcNumber?: string | null;
    photoUrl?: string | null;
    phone?: string | null;
    experienceYears?: number;
    consultationFee?: number;
    telemedicineFee?: number;
    isTelemedicineAvailable?: boolean;
    chamberRoom?: string;
    bio?: string | null;
    treatedDiseases?: string | null;
    subscriptionExpiresAt?: any;
    department?: {
      nameEn: string;
      nameBn: string;
    } | null;
    hospital?: {
      name: string;
      slug: string;
      phone?: string | null;
      district?: any;
    } | null;
    schedules?: any[];
  };
  filteredDistrict?: string;
  ALL_WEEK_DAYS?: any[];
  availableDayNamesSet?: Set<string>;
}

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

function toBanglaDigits(str: string | number): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatBanglaTime(timeStr: string): string {
  if (!timeStr) return '';
  
  const clean = timeStr.trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);

  // Extract hours and minutes
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return toBanglaDigits(clean);
  }

  let hour = parseInt(match[1], 10);
  const min = match[2] ? match[2] : '00';

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  // Determine Bangla period
  let period = 'সকাল';
  if (hour >= 12 && hour < 15) {
    period = 'দুপুর';
  } else if (hour >= 15 && hour < 18) {
    period = 'বিকাল';
  } else if (hour >= 18 && hour < 20) {
    period = 'সন্ধ্যা';
  } else if (hour >= 20 || hour < 5) {
    period = 'রাত';
  } else {
    period = 'সকাল';
  }

  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  const minFormatted = min === '00' ? '' : `:${toBanglaDigits(min)}`;
  return `${period} ${toBanglaDigits(displayHour)}${minFormatted} টা`;
}

function getDoctorScheduleInfo(schedules?: any[]): { daysText: string; timeText: string } {
  if (!schedules || schedules.length === 0) {
    return {
      daysText: 'শনিবার হতে বৃহস্পতিবার',
      timeText: 'বিকাল ৫ টা হতে রাত ৮ টা',
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
    timeText = 'বিকাল ৫ টা হতে রাত ৮ টা';
  }

  return { daysText, timeText };
}

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

  // Try word-by-word conversion
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

function DoctorNameWithVerifiedBadge({ name, isVerified }: { name: string; isVerified?: boolean }) {
  if (!isVerified) {
    return <span>{name}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{name}</span>
      <OfficialVerifiedBadge className="w-4 h-4 shrink-0 inline-block align-middle select-none" />
    </span>
  );
}

const BANGLA_DAYS_MAP = [
  { day: 6, short: 'শনি' },
  { day: 0, short: 'রবি' },
  { day: 1, short: 'সোম' },
  { day: 2, short: 'মঙ্গ' },
  { day: 3, short: 'বুধ' },
  { day: 4, short: 'বৃহ' },
  { day: 5, short: 'শুক্র' },
];

export default function DoctorCardItem({ doc, filteredDistrict }: DoctorCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showChamberModal, setShowChamberModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);

  const specializationBn =
    doc.department?.nameBn ||
    SPECIALIZATION_BANGLA_MAP[doc.specialization] ||
    doc.specialization;
  const doctorNameBn = formatDoctorNameBangla(doc.name);

  // Group schedules by distinct chamber / hospital
  const chambers = useMemo(() => {
    if (!doc.schedules || doc.schedules.length === 0) {
      return [{
        name: doc.hospital?.name || 'প্রধান চেম্বার',
        address: doc.chamberRoom || doc.hospital?.district?.name || 'চুয়াডাঙ্গা',
        phone: doc.hospital?.phone || doc.phone || '+88076162588',
        division: '',
        district: '',
        isTelemedicine: false,
        fee: doc.consultationFee || 800,
        schedules: []
      }];
    }

    const map: Record<string, {
      name: string;
      address: string;
      phone: string;
      division: string;
      district: string;
      isTelemedicine: boolean;
      fee: number;
      schedules: any[];
    }> = {};

    doc.schedules.forEach((s) => {
      const key = (s.chamberName && s.chamberName.trim()) || doc.hospital?.name || 'প্রধান চেম্বার';
      if (!map[key]) {
        map[key] = {
          name: key,
          address: s.chamberAddress || doc.chamberRoom || 'চেম্বার কক্ষ',
          phone: s.serialPhone || doc.hospital?.phone || doc.phone || '+88076162588',
          division: s.division || '',
          district: s.district || '',
          isTelemedicine: Boolean(s.isTelemedicine),
          fee: s.consultationFee || doc.consultationFee || 800,
          schedules: []
        };
      }
      map[key].schedules.push(s);
    });

    return Object.values(map);
  }, [doc.schedules, doc.hospital, doc.chamberRoom, doc.phone, doc.consultationFee]);

  const isVerified = (doc as any).isVerified !== undefined
    ? Boolean((doc as any).isVerified)
    : Boolean((doc.subscriptionExpiresAt && new Date(doc.subscriptionExpiresAt) > new Date()) || doc.bmdcNumber || true);

  const doctorProfileUrl = `/doctors/${doc.id || doc.slug || 'doc'}`;

  return (
    <>
      <div className="card-nuvica flex flex-col justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-4 group">
        
        {/* ========================================================================= */}
        {/* 1. TOP SECTION: 1:1 Photo (Left) + Name, Degrees, Specialization (Right) */}
        {/* ========================================================================= */}
        <div className="flex gap-3.5 sm:gap-4 items-start">
          
          {/* Left: 1:1 Square Doctor Photo */}
          <div 
            onClick={() => setShowImageModal(true)}
            className="relative aspect-square w-[110px] xs:w-[120px] sm:w-[130px] md:w-[140px] shrink-0 rounded-2xl overflow-hidden shadow-xs border-2 border-white bg-slate-100 cursor-pointer group/photo hover:ring-2 hover:ring-sky-400 hover:shadow-md transition-all duration-300"
            title="ডাক্তারের ছবি বড় করে দেখতে ক্লিক করুন"
          >
            <img
              src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80'}
              alt={doc.name}
              className="w-full h-full object-cover object-top group-hover/photo:scale-105 transition-transform duration-500"
            />

            {/* Hover Zoom Icon Indicator */}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[0.5px]">
              <div className="w-7 h-7 rounded-full bg-white/90 text-sky-700 flex items-center justify-center shadow-md transform scale-75 group-hover/photo:scale-100 transition-transform duration-300">
                <ZoomIn className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Right: Doctor Credentials (Beside Photo) */}
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 pt-0.5">
            
            {/* Doctor Name with Verified Badge (Clickable Link to Profile, always aligned to first line) */}
            <Link 
              href={doctorProfileUrl}
              className="group/name block"
            >
              <DoctorCardName 
                name={doctorNameBn}
                isVerified={isVerified}
                className="font-black text-base sm:text-lg md:text-[18px] text-nuvicaNavy-950 group-hover/name:text-sky-700 transition-colors leading-snug tracking-tight cursor-pointer"
              />
            </Link>

            {/* Degrees (Smaller font) */}
            <p className="text-[11.5px] sm:text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
              {doc.degrees}
            </p>

            {/* Specialization (Larger font) */}
            <p className="text-xs sm:text-[13.5px] md:text-sm font-black text-sky-700 leading-snug pt-0.5">
              {specializationBn}
            </p>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. BOTTOM SECTION: Chamber Button (Left) + Profile Button (Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
          
          {/* Left: Chamber Button (Multi-Hospital & Schedules) */}
          <button
            type="button"
            onClick={() => setShowChamberModal(true)}
            className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs sm:text-[13px] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs group/btn cursor-pointer active:scale-95"
            title="ডাক্তারের চেম্বার, বসার দিন ও সিরিয়ালের নম্বর দেখুন"
          >
            <Building2 className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">চেম্বার ও সময়</span>
          </button>

          {/* Right: Profile Button -> Navigates to Dedicated Doctor Profile Page */}
          <Link
            href={doctorProfileUrl}
            className="w-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200/80 hover:border-sky-200 font-black text-xs sm:text-[13px] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs group/btn cursor-pointer active:scale-95"
            title="ডাক্তারের সম্পূর্ণ পরিচিতি, চেম্বার ও প্রোফাইল দেখুন"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-sky-700 shrink-0" />
            <span className="truncate">প্রোফাইল</span>
          </Link>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🌟 MODAL 1: CHAMBERS & MULTI-HOSPITAL SCHEDULES MODAL */}
      {/* ========================================================================= */}
      {showChamberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-white to-sky-50/50 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-nuvicaNavy-950 leading-tight">
                    চেম্বারের সময়সূচি ও সিরিয়াল
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">
                    {doctorNameBn} — {toBanglaDigits(chambers.length)}টি চেম্বার
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChamberModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Chambers List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {chambers.map((ch, idx) => {
                const { daysText, timeText } = getDoctorScheduleInfo(ch.schedules.length > 0 ? ch.schedules : doc.schedules);
                const activeDayNumbers = (ch.schedules.length > 0 ? ch.schedules : (doc.schedules || []))
                  .map((s: any) => s.dayOfWeek)
                  .filter((d: any) => d !== undefined && d !== null);

                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/80 hover:bg-white hover:border-sky-300 transition-all duration-200 shadow-2xs space-y-3"
                  >
                    {/* Hospital Name & Location */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md mb-1">
                          চেম্বার #{toBanglaDigits(idx + 1)}
                        </span>
                        <h5 className="text-sm sm:text-base font-black text-nuvicaNavy-950 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>{ch.name}</span>
                        </h5>
                        {ch.address && (
                          <p className="text-xs text-slate-500 font-medium pl-5.5 mt-0.5">
                            {ch.address}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold block">ভিজিট ফি:</span>
                        <span className="text-sm font-black text-amber-600">৳ {toBanglaDigits(ch.fee)} টাকা</span>
                      </div>
                    </div>

                    {/* Schedule Days & 7-Day Bangla Pills */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          <span>বসার দিনসমূহ:</span>
                        </span>
                        <span className="text-[11px] font-bold text-sky-700">
                          {daysText}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {BANGLA_DAYS_MAP.map((d) => {
                          const isActive = activeDayNumbers.length === 0 ? d.day !== 5 : activeDayNumbers.includes(d.day);
                          return (
                            <div
                              key={d.day}
                              className={`py-1 text-center rounded-lg text-[10px] font-extrabold transition-all select-none ${
                                isActive
                                  ? 'bg-sky-500 text-white shadow-2xs font-black'
                                  : 'bg-slate-200/60 text-slate-400 line-through opacity-50'
                              }`}
                            >
                              {d.short}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time & Direct Call CTA */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold block">রোগী দেখার সময়:</span>
                        <span className="text-xs font-black text-sky-900 block">{timeText}</span>
                      </div>

                      <a
                        href={`tel:${ch.phone || doc.phone || '+88076162588'}`}
                        className="btn-nuvica-primary text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                        title={`সিরিয়ালের জন্য কল করুন: ${ch.phone || doc.phone || ''}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-sky-300" />
                        <span>সিরিয়ালে কল দিন</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between px-4 sm:px-5 gap-2">
              <Link
                href={`/book/${doc.id}`}
                className="text-xs font-black text-white bg-sky-600 hover:bg-sky-700 py-2 px-3.5 rounded-xl shadow-xs transition"
              >
                অনলাইনে সিরিয়াল নিন ➜
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href={doctorProfileUrl}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 hidden sm:inline"
                >
                  সম্পূর্ণ প্রোফাইল →
                </Link>
                <button
                  type="button"
                  onClick={() => setShowChamberModal(false)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌐 MODAL 2: TELEMEDICINE & ONLINE CONSULTATION MODAL */}
      {/* ========================================================================= */}
      {showTelemedicineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-sky-50 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-nuvicaNavy-950 leading-tight">
                    টেলিমেডিসিন কনসালটেশন
                  </h4>
                  <p className="text-xs text-sky-700 font-bold">
                    ঘরে বসেই ভিডিও ও ফোন কলে পরামর্শ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTelemedicineModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              
              {/* Doctor Summary Bar */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <img
                  src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="text-sm font-black text-nuvicaNavy-950 truncate">{doctorNameBn}</h5>
                  <p className="text-xs text-sky-700 font-bold truncate">{specializationBn}</p>
                </div>
              </div>

              {/* Telemedicine Key Points */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>ভিডিও কনসালটেশনের মাধ্যমে রোগীর সম্পূর্ণ স্বাস্থ্য সমস্যা আলোচনা</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>পরামর্শের পর সরাসরি ডিজিটাল প্রেসক্রিপশন প্রদান</span>
                </div>
              </div>

              {/* Fee & Timing */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">অনলাইন কনসালটেশন ফি:</span>
                  <span className="text-sm font-black text-emerald-700">৳ {toBanglaDigits(doc.telemedicineFee || 500)} টাকা</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block">পরামর্শের সময়:</span>
                  <span className="text-xs font-black text-sky-900">সন্ধ্যা ৭ টা হতে রাত ১০ টা</span>
                </div>
              </div>

              {/* Telemedicine Direct Call Button */}
              <a
                href={`tel:${doc.phone || doc.hospital?.phone || '+88076162588'}`}
                className="w-full btn-nuvica-primary text-xs sm:text-sm font-bold !py-3 justify-center rounded-2xl shadow-xs cursor-pointer flex items-center gap-2"
                title="টেলিমেডিসিন সিরিয়ালের জন্য সরাসরি কল করুন"
              >
                <PhoneCall className="w-4 h-4 text-sky-300 shrink-0" />
                <span>টেলিমেডিসিন সিরিয়ালে কল দিন</span>
              </a>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-center flex items-center justify-between px-5">
              <Link
                href={doctorProfileUrl}
                className="text-xs font-bold text-sky-700 hover:text-sky-800"
              >
                সম্পূর্ণ প্রোফাইল দেখুন →
              </Link>
              <button
                type="button"
                onClick={() => setShowTelemedicineModal(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-4 rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖼️ IMAGE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <ImageLightboxModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
        doctorName={doctorNameBn}
        specialization={specializationBn}
        hospitalName={doc.hospital?.name}
        phone={doc.phone || doc.hospital?.phone || ''}
      />
    </>
  );
}
