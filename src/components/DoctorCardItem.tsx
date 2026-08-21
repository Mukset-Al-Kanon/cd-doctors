'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock,
  ArrowUpRight, 
  Info, 
  ChevronDown, 
  UserCheck, 
  Stethoscope, 
  CheckCircle2,
  PhoneCall,
  ZoomIn
} from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';

interface DoctorCardProps {
  doc: {
    id: string;
    name: string;
    degrees: string;
    specialization: string;
    photoUrl?: string | null;
    phone?: string | null;
    experienceYears?: number;
    consultationFee?: number;
    chamberRoom?: string;
    bio?: string | null;
    treatedDiseases?: string | null;
    department?: {
      nameEn: string;
      nameBn: string;
    } | null;
    hospital?: {
      name: string;
      slug: string;
      phone?: string | null;
    } | null;
    schedules?: any[];
  };
  ALL_WEEK_DAYS?: any[];
  availableDayNamesSet?: Set<string>;
}

const SPECIALIZATION_BANGLA_MAP: Record<string, string> = {
  'Cardiology': 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
  'Cardiologist': 'হৃদরোগ বিশেষজ্ঞ',
  'Medicine Specialist': 'মেডিসিন বিশেষজ্ঞ',
  'General Physician': 'জেনারেল ফিজিশিয়ান',
  'Gynecology & Obstetrics': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Gynecologist': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Pediatrics': 'শিশু রোগ বিশেষজ্ঞ',
  'Pediatrician': 'শিশু রোগ বিশেষজ্ঞ',
  'Orthopedics': 'হাড় ও জোড় বিশেষজ্ঞ',
  'Orthopedic Surgeon': 'অর্থোপেডিক সার্জন',
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
  'rawnak': 'রওনক',
  'jahan': 'জাহান',
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
  'hasan': 'হাসান',
  'nazma': 'নাজমা',
  'babul': 'বাবুল',
  'akhter': 'আক্তার',
  'shamima': 'শামীমা',
  'nasrin': 'নাসরিন',
  'anisur': 'আনিসুর',
  'nusrat': 'নুসরাত',
  'kamrul': 'কামরুল',
  'rezaul': 'রেজাউল',
  'karim': 'করিম',
  'rashedul': 'রাশেদুল',
  'sabrina': 'সাবরিনা',
  'ashikur': 'আশিকুর',
  'mahmudul': 'মাহমুদুল',
  'farzana': 'ফারজানা',
  'sajjad': 'সাজ্জাদ',
  'monira': 'মনিরা',
  'zahid': 'জাহিদ',
  'mizanur': 'মিজানুর',
  'jannatul': 'জান্নাতুল',
  'ferdous': 'ফেরদৌস',
  'shah': 'শাহ',
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

export default function DoctorCardItem({ doc }: DoctorCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { daysText, timeText } = getDoctorScheduleInfo(doc.schedules);
  const specializationBn =
    doc.department?.nameBn ||
    SPECIALIZATION_BANGLA_MAP[doc.specialization] ||
    doc.specialization;
  const doctorNameBn = formatDoctorNameBangla(doc.name);

  return (
    <div className="card-nuvica flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
      <div className="space-y-3">
        {/* Top Profile Header */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div
            onClick={() => setShowImageModal(true)}
            className="relative shrink-0 group/photo cursor-pointer rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-sky-400"
            title="ছবি বড় করে দেখতে ক্লিক করুন"
          >
            <img
              src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
              alt={doc.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-white bg-slate-100 transition-transform duration-500 group-hover/photo:scale-110"
            />
            {/* Soft Hover Zoom Indicator */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <div className="w-8 h-8 rounded-full bg-white/90 text-sky-700 flex items-center justify-center shadow-md transform scale-75 group-hover/photo:scale-100 transition-transform duration-300">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1.5">
            <h3 className="font-black text-base sm:text-lg text-nuvicaNavy-950 leading-snug tracking-tight">
              {doctorNameBn}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
              {doc.degrees}
            </p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100/90 shadow-2xs">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{specializationBn}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Hospital & Weekly Schedule Card */}
        <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700 shadow-2xs">
          {doc.hospital?.name && (
            <p className="flex items-center gap-2 font-black text-nuvicaNavy-900 text-xs">
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">{doc.hospital.name}</span>
            </p>
          )}

          {/* Typed Schedule Text Box */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-2xs">
            <div className="flex items-start gap-2.5 text-xs leading-snug">
              <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100/80">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">রোগী দেখছেন:</span>
                <span className="font-extrabold text-sky-700 text-xs sm:text-[13px] block mt-0.5">{daysText}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs leading-snug pt-2 border-t border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100/80">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">রোগী দেখার সময়:</span>
                <span className="font-extrabold text-sky-700 text-xs sm:text-[13px] block mt-0.5">{timeText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Accordion: Experience & Treated Diseases */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer border select-none ${
            showDetails
              ? 'bg-sky-100/90 text-sky-950 border-sky-300/80 shadow-2xs'
              : 'bg-slate-100/80 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border-slate-200/80 hover:border-sky-200'
          }`}
          title={showDetails ? 'বিবরণ বন্ধ করুন' : 'অভিজ্ঞতা ও চিকিৎসাসমূহ দেখুন'}
        >
          <span className="flex items-center gap-2 tracking-wide text-xs font-bold">
            <span className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors duration-300 ${
              showDetails ? 'bg-sky-600 text-white shadow-2xs' : 'bg-sky-100 text-sky-700'
            }`}>
              <Info className="w-3 h-3" />
            </span>
            অভিজ্ঞতা ও চিকিৎসাসমূহ
          </span>
          <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-300 ${
            showDetails ? 'bg-sky-200/80 text-sky-800 rotate-180' : 'text-slate-400'
          }`}>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* ULTRA-SMOOTH ACCORDION COLLAPSIBLE CONTAINER */}
        <div className={`accordion-smooth-wrapper ${showDetails ? 'open-card' : ''}`}>
          <div className="accordion-smooth-inner">
            <div className="pt-2.5">
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs">
                {/* Doctor Bio */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-nuvicaNavy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    ডাক্তারের বিবরণ:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                    {doc.bio || `${doc.name} একজন অভিজ্ঞ ও সুনামধন্য ${specializationBn}। তিনি দীর্ঘকাল ধরে অত্যন্ত দক্ষতার সাথে আধুনিক ও মানসম্মত চিকিৎসাসেবা প্রদান করে আসছেন।`}
                  </p>
                </div>

                {/* Treated Diseases */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-extrabold text-nuvicaNavy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    যেসব রোগের চিকিৎসাসেবা প্রদান করেন:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {(doc as any).treatedDiseases
                      ? (doc as any).treatedDiseases
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                          .map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 p-2 px-3 bg-white rounded-xl border border-slate-200/70 text-[11px] sm:text-xs font-bold text-slate-700 shadow-2xs hover:border-sky-300 hover:bg-sky-50/40 transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))
                      : [
                          'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা',
                          'দীর্ঘমেয়াদী রোগ ও পরামর্শ',
                          'বিশেষজ্ঞ স্বাস্থ্য পরামর্শ',
                          'জরুরি কেয়ার ও পুনর্বাসন'
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 px-3 bg-white rounded-xl border border-slate-200/70 text-[11px] sm:text-xs font-bold text-slate-700 shadow-2xs hover:border-sky-300 hover:bg-sky-50/40 transition-colors">
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
      </div>

      {/* Direct Phone Call CTA Button (Normal direct calling for all users) */}
      <a
        href={`tel:${doc.phone || doc.hospital?.phone || '+88076162588'}`}
        className="w-full btn-nuvica-primary text-xs sm:text-sm font-bold tracking-wide !py-3 justify-center rounded-2xl shadow-xs cursor-pointer flex items-center gap-2"
        title={`সরাসরি সিরিয়ালের জন্য কল করুন: ${doc.phone || doc.hospital?.phone || ''}`}
      >
        <PhoneCall className="w-4 h-4 text-sky-300 shrink-0" />
        <span className="tracking-wide">সিরিয়ালের জন্য কল করুন</span>
      </a>

      {/* Ultra-Smooth Doctor Photo Lightbox Modal */}
      <ImageLightboxModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
        doctorName={doctorNameBn}
        specialization={specializationBn}
        hospitalName={doc.hospital?.name}
      />
    </div>
  );
}
