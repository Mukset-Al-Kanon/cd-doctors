'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DoctorBannerPreview from '@/components/doctor/DoctorBannerPreview';
import { 
  Sparkles, 
  Wallet, 
  Rocket, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  PhoneCall, 
  Users, 
  Eye, 
  Plus, 
  CheckCircle2, 
  LogOut, 
  Search, 
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  LayoutGrid,
  Zap,
  SlidersHorizontal,
  Home,
  Layers,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  Check,
  User,
  Building2,
  Stethoscope,
  FileText,
  Upload,
  Camera,
  MapPin,
  Globe,
  Clock
} from 'lucide-react';

const BANGLADESH_DIVISIONS = [
  {
    en: 'Khulna',
    bn: 'খুলনা',
    districts: [
      { en: 'Chuadanga', bn: 'চুয়াডাঙ্গা', reach: '~25,000+' },
      { en: 'Kushtia', bn: 'কুষ্টিয়া', reach: '~30,000+' },
      { en: 'Jhenaidah', bn: 'ঝিনাইদহ', reach: '~25,000+' },
      { en: 'Meherpur', bn: 'মেহেরপুর', reach: '~20,000+' },
      { en: 'Jashore', bn: 'যশোর', reach: '~40,000+' },
      { en: 'Khulna', bn: 'খুলনা', reach: '~50,000+' },
      { en: 'Bagerhat', bn: 'বাগেরহাট', reach: '~20,000+' },
      { en: 'Satkhira', bn: 'সাতক্ষীরা', reach: '~25,000+' },
      { en: 'Magura', bn: 'মাগুরা', reach: '~20,000+' },
      { en: 'Narail', bn: 'নড়াইল', reach: '~18,000+' },
    ],
  },
  {
    en: 'Dhaka',
    bn: 'ঢাকা',
    districts: [
      { en: 'Dhaka', bn: 'ঢাকা মহানগর', reach: '~1,00,000+' },
      { en: 'Gazipur', bn: 'গাজীপুর', reach: '~60,000+' },
      { en: 'Narayanganj', bn: 'নারায়ণগঞ্জ', reach: '~50,000+' },
      { en: 'Tangail', bn: 'টাঙ্গাইল', reach: '~35,000+' },
      { en: 'Faridpur', bn: 'ফরিদপুর', reach: '~30,000+' },
      { en: 'Manikganj', bn: 'মানিকগঞ্জ', reach: '~25,000+' },
      { en: 'Munshiganj', bn: 'মুন্সীগঞ্জ', reach: '~25,000+' },
      { en: 'Narsingdi', bn: 'নরসিংদী', reach: '~30,000+' },
      { en: 'Gopalganj', bn: 'গোপালগঞ্জ', reach: '~20,000+' },
      { en: 'Madaripur', bn: 'মাদারীপুর', reach: '~20,000+' },
      { en: 'Rajbari', bn: 'রাজবাড়ী', reach: '~20,000+' },
      { en: 'Shariatpur', bn: 'শরীয়তপুর', reach: '~20,000+' },
      { en: 'Kishoreganj', bn: 'কিশোরগঞ্জ', reach: '~30,000+' },
    ],
  },
  {
    en: 'Chattogram',
    bn: 'চট্টগ্রাম',
    districts: [
      { en: 'Chattogram', bn: 'চট্টগ্রাম সদর', reach: '~80,000+' },
      { en: 'Cumilla', bn: 'কুমিল্লা', reach: '~50,000+' },
      { en: 'Cox\'s Bazar', bn: 'কক্সবাজার', reach: '~35,000+' },
      { en: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া', reach: '~35,000+' },
      { en: 'Chandpur', bn: 'চাঁদপুর', reach: '~30,000+' },
      { en: 'Noakhali', bn: 'নোয়াখালী', reach: '~35,000+' },
      { en: 'Feni', bn: 'ফেনী', reach: '~25,000+' },
      { en: 'Lakshmipur', bn: 'লক্ষ্মীপুর', reach: '~25,000+' },
      { en: 'Rangamati', bn: 'রাঙ্গামাটি', reach: '~15,000+' },
      { en: 'Bandarban', bn: 'বান্দরবান', reach: '~15,000+' },
      { en: 'Khagrachhari', bn: 'খাগড়াছড়ি', reach: '~15,000+' },
    ],
  },
  {
    en: 'Rajshahi',
    bn: 'রাজশাহী',
    districts: [
      { en: 'Rajshahi', bn: 'রাজশাহী সদর', reach: '~50,000+' },
      { en: 'Bogura', bn: 'বগুড়া', reach: '~45,000+' },
      { en: 'Pabna', bn: 'পাবনা', reach: '~35,000+' },
      { en: 'Sirajganj', bn: 'সিরাজগঞ্জ', reach: '~35,000+' },
      { en: 'Naogaon', bn: 'নওগাঁ', reach: '~30,000+' },
      { en: 'Natore', bn: 'নাটোর', reach: '~25,000+' },
      { en: 'Chapai Nawabganj', bn: 'চাঁপাইনবাবগঞ্জ', reach: '~25,000+' },
      { en: 'Joypurhat', bn: 'জয়পুরহাট', reach: '~20,000+' },
    ],
  },
  {
    en: 'Barishal',
    bn: 'বরিশাল',
    districts: [
      { en: 'Barishal', bn: 'বরিশাল সদর', reach: '~40,000+' },
      { en: 'Patuakhali', bn: 'পটুয়াখালী', reach: '~25,000+' },
      { en: 'Bhola', bn: 'ভোলা', reach: '~25,000+' },
      { en: 'Pirojpur', bn: 'পিরোজপুর', reach: '~20,000+' },
      { en: 'Barguna', bn: 'বরগুনা', reach: '~18,000+' },
      { en: 'Jhalakathi', bn: 'ঝালকাঠি', reach: '~15,000+' },
    ],
  },
  {
    en: 'Sylhet',
    bn: 'সিলেট',
    districts: [
      { en: 'Sylhet', bn: 'সিলেট সদর', reach: '~50,000+' },
      { en: 'Moulvibazar', bn: 'মৌলভীবাজার', reach: '~30,000+' },
      { en: 'Habiganj', bn: 'হবিগঞ্জ', reach: '~28,000+' },
      { en: 'Sunamganj', bn: 'সুনামগঞ্জ', reach: '~25,000+' },
    ],
  },
  {
    en: 'Rangpur',
    bn: 'রংপুর',
    districts: [
      { en: 'Rangpur', bn: 'রংপুর সদর', reach: '~45,000+' },
      { en: 'Dinajpur', bn: 'দিনাজপুর', reach: '~35,000+' },
      { en: 'Gaibandha', bn: 'গাইবান্ধা', reach: '~25,000+' },
      { en: 'Kurigram', bn: 'কুড়িগ্রাম', reach: '~25,000+' },
      { en: 'Lalmonirhat', bn: 'লালমনিরহাট', reach: '~20,000+' },
      { en: 'Nilphamari', bn: 'নীলফামারী', reach: '~25,000+' },
      { en: 'Panchagarh', bn: 'পঞ্চগড়', reach: '~20,000+' },
      { en: 'Thakurgaon', bn: 'ঠাকুরগাঁও', reach: '~20,000+' },
    ],
  },
  {
    en: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    districts: [
      { en: 'Mymensingh', bn: 'ময়মনসিংহ সদর', reach: '~45,000+' },
      { en: 'Jamalpur', bn: 'জামালপুর', reach: '~30,000+' },
      { en: 'Netrokona', bn: 'নেত্রকোণা', reach: '~25,000+' },
      { en: 'Sherpur', bn: 'শেরপুর', reach: '~20,000+' },
    ],
  },
];

const TIME_PICKER_OPTIONS = [
  { id: '07:00 AM', time: '7:00', period: 'AM', labelBn: 'সকাল ০৭:০০' },
  { id: '07:30 AM', time: '7:30', period: 'AM', labelBn: 'সকাল ০৭:৩০' },
  { id: '08:00 AM', time: '8:00', period: 'AM', labelBn: 'সকাল ০৮:০০' },
  { id: '08:30 AM', time: '8:30', period: 'AM', labelBn: 'সকাল ০৮:৩০' },
  { id: '09:00 AM', time: '9:00', period: 'AM', labelBn: 'সকাল ০৯:০০' },
  { id: '09:30 AM', time: '9:30', period: 'AM', labelBn: 'সকাল ০৯:৩০' },
  { id: '10:00 AM', time: '10:00', period: 'AM', labelBn: 'সকাল ১০:০০' },
  { id: '10:30 AM', time: '10:30', period: 'AM', labelBn: 'সকাল ১০:৩০' },
  { id: '11:00 AM', time: '11:00', period: 'AM', labelBn: 'সকাল ১১:০০' },
  { id: '11:30 AM', time: '11:30', period: 'AM', labelBn: 'সকাল ১১:৩০' },
  { id: '12:00 PM', time: '12:00', period: 'PM', labelBn: 'দুপুর ১২:০০' },
  { id: '12:30 PM', time: '12:30', period: 'PM', labelBn: 'দুপুর ১২:৩০' },
  { id: '01:00 PM', time: '1:00', period: 'PM', labelBn: 'দুপুর ০১:০০' },
  { id: '01:30 PM', time: '1:30', period: 'PM', labelBn: 'দুপুর ০১:৩০' },
  { id: '02:00 PM', time: '2:00', period: 'PM', labelBn: 'দুপুর ০২:০০' },
  { id: '02:30 PM', time: '2:30', period: 'PM', labelBn: 'দুপুর ০২:৩০' },
  { id: '03:00 PM', time: '3:00', period: 'PM', labelBn: 'বিকাল ০৩:০০' },
  { id: '03:30 PM', time: '3:30', period: 'PM', labelBn: 'বিকাল ০৩:৩০' },
  { id: '04:00 PM', time: '4:00', period: 'PM', labelBn: 'বিকাল ০৪:০০' },
  { id: '04:30 PM', time: '4:30', period: 'PM', labelBn: 'বিকাল ০৪:৩০' },
  { id: '05:00 PM', time: '5:00', period: 'PM', labelBn: 'বিকাল ০৫:০০' },
  { id: '05:30 PM', time: '5:30', period: 'PM', labelBn: 'বিকাল ০৫:৩০' },
  { id: '06:00 PM', time: '6:00', period: 'PM', labelBn: 'সন্ধ্যা ০৬:০০' },
  { id: '06:30 PM', time: '6:30', period: 'PM', labelBn: 'সন্ধ্যা ০৬:৩০' },
  { id: '07:00 PM', time: '7:00', period: 'PM', labelBn: 'সন্ধ্যা ০৭:০০' },
  { id: '07:30 PM', time: '7:30', period: 'PM', labelBn: 'রাত ০৭:৩০' },
  { id: '08:00 PM', time: '8:00', period: 'PM', labelBn: 'রাত ০৮:০০' },
  { id: '08:30 PM', time: '8:30', period: 'PM', labelBn: 'রাত ০৮:৩০' },
  { id: '09:00 PM', time: '9:00', period: 'PM', labelBn: 'রাত ০৯:০০' },
  { id: '09:30 PM', time: '9:30', period: 'PM', labelBn: 'রাত ০৯:৩০' },
  { id: '10:00 PM', time: '10:00', period: 'PM', labelBn: 'রাত ১০:০০' },
  { id: '10:30 PM', time: '10:30', period: 'PM', labelBn: 'রাত ১০:৩০' },
  { id: '11:00 PM', time: '11:00', period: 'PM', labelBn: 'রাত ১১:০০' },
];

function IosTimeWheel({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const total = TIME_PICKER_OPTIONS.length;
  const rawIdx = TIME_PICKER_OPTIONS.findIndex((item) => item.id === value || item.time === value);
  const activeIdx = rawIdx >= 0 ? rawIdx : 20; // default 5:00 PM

  const [isBouncing, setIsBouncing] = useState(false);
  const bounceTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerBounce = () => {
    setIsBouncing(true);
    if (bounceTimer.current) clearTimeout(bounceTimer.current);
    bounceTimer.current = setTimeout(() => {
      setIsBouncing(false);
    }, 220);
  };

  const handleStep = (delta: number) => {
    // Infinite continuous circular loop
    const nextIdx = (activeIdx + delta + total) % total;
    if (nextIdx !== activeIdx) {
      triggerBounce();
      onChange(TIME_PICKER_OPTIONS[nextIdx].id);
    }
  };

  const touchStartY = useRef<number | null>(null);

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <div
      onWheel={(e) => {
        e.preventDefault();
        handleStep(e.deltaY > 0 ? 1 : -1);
      }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (touchStartY.current === null) return;
        const diff = touchStartY.current - e.touches[0].clientY;
        if (Math.abs(diff) > 20) {
          handleStep(diff > 0 ? 1 : -1);
          touchStartY.current = e.touches[0].clientY;
        }
      }}
      onTouchEnd={() => {
        touchStartY.current = null;
      }}
      className="relative flex flex-col items-center justify-center w-28 sm:w-36 py-1 select-none cursor-ns-resize group"
    >
      <div className="flex flex-col items-center gap-1 w-full">
        {visibleOffsets.map((offset) => {
          // Circular slot calculation
          const itemIdx = (activeIdx + offset + total) % total;
          const item = TIME_PICKER_OPTIONS[itemIdx];
          const isCenter = offset === 0;

          if (isCenter) {
            return (
              <div
                key={offset}
                className={`h-9 sm:h-10 px-4 sm:px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center gap-1 z-10 my-0.5 cursor-pointer transform transition-all duration-200 ease-out hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 active:scale-95 ${
                  isBouncing
                    ? 'scale-112 shadow-lg shadow-purple-600/45 ring-2 ring-purple-400/50'
                    : 'scale-105 shadow-md shadow-purple-600/30'
                }`}
              >
                <span className="text-lg sm:text-xl font-black tracking-tight leading-none transition-transform duration-150">
                  {item.time}
                </span>
                <span className="text-[9px] font-black uppercase text-purple-100 mt-0.5 ml-0.5">
                  {item.period}
                </span>
              </div>
            );
          }

          const isAdjacent = Math.abs(offset) === 1;

          return (
            <button
              key={offset}
              type="button"
              onClick={() => {
                triggerBounce();
                onChange(item.id);
              }}
              className={`h-7 sm:h-8 w-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:text-purple-600 hover:scale-105 ${
                isAdjacent
                  ? 'text-slate-600 font-extrabold text-base scale-95 opacity-80'
                  : 'text-slate-300 font-bold text-xs scale-90 opacity-40 hover:opacity-80'
              }`}
            >
              <span>{item.time}</span>
              <span className="text-[8px] font-bold uppercase ml-0.5 opacity-60">
                {item.period}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'packages' | 'banner' | 'boost' | 'wallet' | 'profile'>('home');
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<any>(null);
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Doctor Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    degrees: '',
    specialization: '',
    bmdcNumber: '',
    experienceYears: 0,
    consultationFee: 0,
    chamberRoom: '',
    chamberAddress: '',
    division: 'Khulna',
    district: 'Chuadanga',
    phone: '',
    photoUrl: '',
    bio: '',
    treatedDiseases: '',
    schedules: [0, 1, 2, 3, 4, 5, 6] as number[],
    startTime: '05:00 PM',
    endTime: '09:00 PM',
    visitingHours: '05:00 PM থেকে 09:00 PM',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Recharge Modal State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('1000');
  const [rechargeMethod, setRechargeMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [senderPhone, setSenderPhone] = useState('01718-703136');
  const [trxId, setTrxId] = useState('');
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeMessage, setRechargeMessage] = useState('');

  // Package Purchase & Toast State
  const [purchaseLoading, setPurchaseLoading] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDismissingNotification, setIsDismissingNotification] = useState(false);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Boost Scheduler State
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(() => new Date().getFullYear());
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');

  // Custom Location Dropdown States & Refs
  const [isDivisionOpen, setIsDivisionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const divisionDropdownRef = useRef<HTMLDivElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divisionDropdownRef.current && !divisionDropdownRef.current.contains(event.target as Node)) {
        setIsDivisionOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Synthesize a soothing gentle chime on notification pop-up
  const playGentleChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: Soft Harmonic Tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.08); // A5
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Note 2: Gentle E6 Shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.06); // E6
      gain2.gain.setValueAtTime(0.035, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.6);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.75);
    } catch {
      // Audio autoplay might be limited before first user gesture
    }
  };

  const showToastNotification = (type: 'success' | 'error', text: string) => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setIsDismissingNotification(false);
    setPurchaseMessage({ type, text });

    if (type === 'success') {
      playGentleChime();
    }

    notificationTimerRef.current = setTimeout(() => {
      dismissToastNotification();
    }, 4500);
  };

  const dismissToastNotification = () => {
    setIsDismissingNotification(true);
    setTimeout(() => {
      setPurchaseMessage(null);
      setIsDismissingNotification(false);
    }, 450);
  };

  const fetchDoctorData = async () => {
    try {
      const res = await fetch('/api/doctor/auth/me');
      const data = await res.json();
      if (!data.success) {
        router.push('/doctor/login');
        return;
      }
      setDoctor(data.doctor);
      if (data.doctor) {
        setProfileForm({
          name: data.doctor.name || '',
          degrees: data.doctor.degrees || '',
          specialization: data.doctor.specialization || '',
          bmdcNumber: data.doctor.bmdcNumber || '',
          experienceYears: data.doctor.experienceYears || 0,
          consultationFee: data.doctor.consultationFee || 0,
          chamberRoom: data.doctor.chamberRoom || '',
          chamberAddress: data.doctor.chamberAddress || '',
          division: data.doctor.hospital?.district?.division?.nameEn || 'Khulna',
          district: data.doctor.hospital?.district?.nameEn || 'Chuadanga',
          phone: data.doctor.phone || '',
          photoUrl: data.doctor.photoUrl || '',
          bio: data.doctor.bio || '',
          treatedDiseases: data.doctor.treatedDiseases || '',
          schedules: data.doctor.schedules?.map((s: any) => s.dayOfWeek) || [0, 1, 2, 3, 4, 5, 6],
          startTime: data.doctor.schedules?.[0]?.startTime?.split('থেকে')?.[0]?.trim() || 'বিকাল ০৫:০০ টা',
          endTime: data.doctor.schedules?.[0]?.startTime?.split('থেকে')?.[1]?.replace('পর্যন্ত', '')?.trim() || data.doctor.schedules?.[0]?.endTime || 'রাত ০৯:০০ টা',
          visitingHours: data.doctor.schedules?.[0]?.startTime || 'বিকাল ০৫:০০ টা থেকে রাত ০৯:০০ টা',
        });
      }
    } catch (e) {
      router.push('/doctor/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!profileForm.name.trim()) {
      showToastNotification('error', 'ডাক্তারের পুরো নাম লিখুন (Name is required)');
      return;
    }
    if (!profileForm.phone.trim()) {
      showToastNotification('error', 'সিরিয়াল বা যোগাযোগের ফোন নম্বর লিখুন (Phone is required)');
      return;
    }
    if (!profileForm.specialization.trim()) {
      showToastNotification('error', 'স্পেশালাইজেশন বা ডিপার্টমেন্ট উল্লেখ করুন (Specialization is required)');
      return;
    }
    if (!profileForm.degrees.trim()) {
      showToastNotification('error', 'ডিগ্রি ও শিক্ষাগত যোগ্যতা উল্লেখ করুন (Degrees is required)');
      return;
    }
    if (!profileForm.division || !profileForm.district) {
      showToastNotification('error', 'বিভাগ ও জেলা নির্বাচন করুন (Division & District are required)');
      return;
    }
    if (!profileForm.chamberAddress.trim()) {
      showToastNotification('error', 'চেম্বার বা হাসপাতালের পূর্ণ ঠিকানা লিখুন (Chamber Address is required)');
      return;
    }
    if (!profileForm.startTime || !profileForm.endTime) {
      showToastNotification('error', 'রোগী দেখার সময়সূচি (Start & End Time) সিলেক্ট করুন');
      return;
    }
    if (!profileForm.schedules || profileForm.schedules.length === 0) {
      showToastNotification('error', 'অন্তত একটি চেম্বারের দিন সিলেক্ট করুন (Select at least 1 Chamber Day)');
      return;
    }
    if (!profileForm.bio.trim()) {
      showToastNotification('error', 'ডাক্তারের সংক্ষিপ্ত বিবরণ লিখুন (Bio is required)');
      return;
    }
    if (!profileForm.treatedDiseases.trim()) {
      showToastNotification('error', 'যেসব রোগের চিকিৎসাসেবা প্রদান করেন তা উল্লেখ করুন (Treated Diseases is required)');
      return;
    }

    const payload = {
      ...profileForm,
      visitingHours: `${profileForm.startTime} থেকে ${profileForm.endTime}`,
      startTime: profileForm.startTime,
      endTime: profileForm.endTime,
    };

    setProfileLoading(true);
    try {
      const res = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.doctor) {
        setDoctor(data.doctor);
        showToastNotification('success', 'Doctor profile updated successfully!');
      } else {
        showToastNotification('error', data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      showToastNotification('error', err.message || 'Network error updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToastNotification('error', 'Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setProfileForm((prev) => ({ ...prev, photoUrl: reader.result as string }));
        showToastNotification('success', 'Photo selected from device! Click Save to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/doctor/auth/me', { method: 'DELETE' });
    router.push('/doctor/login');
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setRechargeLoading(true);
    setRechargeMessage('');

    try {
      const res = await fetch('/api/doctor/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: rechargeAmount,
          method: rechargeMethod,
          senderPhone,
          trxId,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit recharge request');
      }

      showToastNotification('success', 'Wallet recharge request submitted! Please wait for admin approval.');
      setShowRechargeModal(false);
      setTrxId('');
      fetchDoctorData();
    } catch (err: any) {
      showToastNotification('error', err.message || 'Recharge submission failed.');
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleSubscribePackage = async (packageKey: 'STARTER' | 'GROWTH' | 'PRO') => {
    setPurchaseLoading(packageKey);

    try {
      const res = await fetch('/api/doctor/packages/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey }),
      });
      const data = await res.json();

      if (!data.success) {
        showToastNotification('error', data.error);
        if (data.shortage) {
          setTimeout(() => setShowRechargeModal(true), 1200);
        }
        return;
      }

      showToastNotification('success', data.message);
      fetchDoctorData();
    } catch (err: any) {
      showToastNotification('error', err.message || 'Activation failed. Please try again.');
    } finally {
      setPurchaseLoading('');
    }
  };

  const handleScheduleBoost = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleLoading(true);

    try {
      const res = await fetch('/api/doctor/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledDate }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to schedule boost');
      }

      showToastNotification('success', 'Sponsored boost scheduled successfully! Your poster and Meta ads are ready.');
      fetchDoctorData();
    } catch (err: any) {
      showToastNotification('error', err.message || 'Scheduling failed. Please try again.');
    } finally {
      setScheduleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfafd] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Loading Doctor Portal...</p>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#fdf0f4] via-[#f7f5fb] to-[#ffffff] text-slate-900 antialiased select-none font-sans ${activeTab === 'boost' || activeTab === 'profile' ? 'pb-24' : 'pb-36'}`}>
      
      {/* Background Soft Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className={`max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 ${activeTab === 'boost' || activeTab === 'profile' ? 'pt-3 sm:pt-4 space-y-3' : 'pt-6 sm:pt-8 space-y-6'}`}>
        
        {/* 1. bKash-Inspired Dynamic Top Notch Header (Luxury Velvet Purple Theme - Hidden on Boost & Profile Pages) */}
        {activeTab !== 'boost' && activeTab !== 'profile' && (
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#130b24] via-[#23103c] to-[#3b0764] text-white p-5 sm:p-6 shadow-xl border-2 border-white/30 animate-fadeIn">
          
          {/* Subtle Abstract Wave Accents */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-fuchsia-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            
            {/* Left: Doctor Photo with Corner Brackets + Name & Balance Capsule */}
            <div className="flex items-center gap-3.5">
              
              {/* Corner Focus Frame Avatar */}
              <div className="relative p-1 shrink-0">
                {/* 4 Corner Focus Brackets */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-purple-200/90 rounded-tl-[3px]" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-purple-200/90 rounded-tr-[3px]" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-purple-200/90 rounded-bl-[3px]" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-purple-200/90 rounded-br-[3px]" />
                
                <img
                  src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
                  alt={doctor.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover object-top border-2 border-white/90 shadow-md"
                />
              </div>

              {/* Doctor Name & Interactive Tap-for-Balance Pill */}
              <div className="flex flex-col justify-center space-y-1">
                <h2 className="text-sm sm:text-base font-black text-white leading-tight tracking-tight">
                  {doctor.name}
                </h2>

                {/* bKash Style Interactive Balance Capsule Pill (Purple Theme) */}
                <button
                  type="button"
                  onClick={() => setIsBalanceRevealed((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-purple-50/90 text-purple-950 rounded-full pl-1 pr-3 py-1 shadow-md active:scale-95 transition-all group cursor-pointer w-fit"
                  title="Click to toggle balance view"
                >
                  <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 leading-none group-hover:rotate-12 transition-transform">
                    ৳
                  </span>
                  <span className="text-xs font-black tracking-tight select-none text-purple-950 leading-none">
                    {isBalanceRevealed ? `৳ ${doctor.walletBalance.toLocaleString()} BDT` : 'Tap for Balance'}
                  </span>
                </button>
              </div>

            </div>

            {/* Right: Quick Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Add Cash Quick Button */}
              <button
                onClick={() => setShowRechargeModal(true)}
                className="hidden sm:flex bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-sm transition-all items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Recharge</span>
              </button>

              {/* 3-Line Side Menu Button */}
              <button
                onClick={() => setShowSideMenu(true)}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs active:scale-95 flex items-center justify-center cursor-pointer"
                title="Open Side Menu"
              >
                <Menu className="w-5 h-5 text-white stroke-[2.5]" />
              </button>

            </div>

          </div>
        </div>
      )}

        {/* Global Toast Notification with Buttery Smooth Layout Expansion & Physics Animations */}
        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            purchaseMessage && !isDismissingNotification
              ? 'grid-rows-[1fr] opacity-100 mb-6'
              : 'grid-rows-[0fr] opacity-0 mb-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            {purchaseMessage && (
              <div
                className={`p-4 rounded-3xl border text-xs font-bold flex items-center justify-between shadow-[0_12px_36px_rgba(147,51,234,0.09)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                  !isDismissingNotification
                    ? 'translate-y-0 scale-100'
                    : '-translate-y-4 scale-95 opacity-0'
                } ${
                  purchaseMessage.type === 'success'
                    ? 'bg-purple-50/95 border-purple-200/90 text-purple-950'
                    : 'bg-rose-50/95 border-rose-200/90 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    purchaseMessage.type === 'success' ? 'bg-purple-200/80 text-purple-700' : 'bg-rose-200/80 text-rose-700'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-bold tracking-tight">{purchaseMessage.text}</span>
                </div>
                <button
                  onClick={dismissToastNotification}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors text-xs font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Tab Specific Content Area */}

        {/* TAB 1: HOME / ANALYTICS */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top 2x2 Live Analytics & Plan Grid (Side-by-Side Layout) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Card 1: Total Reach */}
              <div className="bg-white/85 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Reach</span>
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {(doctor.campaigns?.reduce((acc: number, c: any) => acc + (c.reach || 0), 0) || 0).toLocaleString()}
                  </h3>
                </div>
                <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1 border-t border-emerald-50 pt-2 truncate">
                  <span>📈</span> Local reach
                </p>
              </div>

              {/* Card 2: Impressions */}
              <div className="bg-white/85 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Impressions</span>
                    <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {(doctor.campaigns?.reduce((acc: number, c: any) => acc + (c.impressions || 0), 0) || 0).toLocaleString()}
                  </h3>
                </div>
                <p className="text-[11px] font-bold text-sky-600 mt-2 flex items-center gap-1 border-t border-sky-50 pt-2 truncate">
                  <span>👁️</span> Feed views
                </p>
              </div>

              {/* Card 3: Active Plan */}
              <div 
                onClick={() => setActiveTab('packages')}
                className="bg-white/85 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Active Plan</span>
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                    {doctor.activePackageName || (doctor.remainingBoostDays > 0 ? 'Starter' : 'Free Trial')}
                  </h3>
                </div>
                <div className="text-[11px] font-bold text-purple-600 mt-2 flex items-center justify-between border-t border-purple-50 pt-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span>{doctor.activePackageName ? `${doctor.activePackageName} Active` : (doctor.remainingBoostDays > 0 ? 'Plan Active' : 'Get Plan')}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>

              {/* Card 4: Active Growth Plan & Boost Days (Side by side with Phone Calls) */}
              <div 
                onClick={() => setActiveTab('boost')}
                className="bg-white/85 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Growth Plan</span>
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Rocket className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                    {doctor.remainingBoostDays > 0 ? `${doctor.remainingBoostDays}d Left` : '0d Left'}
                  </h3>
                </div>

                <div className="text-[11px] font-bold text-purple-600 mt-2 flex items-center justify-between border-t border-purple-50 pt-2">
                  <span className="truncate">Boost</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>

            </div>

            {/* Featured Mega Deal (Pro Plan Spotlight - Dark Velvet Luxury & BEST DEAL Theme) */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-[32px] p-6 sm:p-7 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative flex flex-col justify-between space-y-5 transition-all">
              
              {/* BEST DEAL Top Pill (Centered, No Emoji) */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase px-3.5 py-0.5 rounded-full shadow-md shadow-purple-600/30 tracking-wider">
                BEST DEAL
              </span>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300 bg-purple-950 border border-purple-400/30 px-3 py-1 rounded-full">
                    Pro
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-purple-400 tracking-tight">৳ 1,999</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">Weekly Premium Plan</p>
                </div>

                <p className="text-xs sm:text-[13px] font-medium text-slate-300 leading-relaxed">
                  Complete weekly branding and maximum patient acquisition with 7 days of sponsored Meta Boost targeting 25,000+ local reach.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2.5 text-xs font-semibold text-slate-200 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 stroke-[2.5] shrink-0" />
                    <span><b>5</b> Consultation Posts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 stroke-[2.5] shrink-0" />
                    <span><b>7 Days</b> Boost</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 stroke-[2.5] shrink-0" />
                    <span>24/7 Assistant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 stroke-[2.5] shrink-0" />
                    <span>Priority Rotation</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-semibold">Instant 1-Click Activation</span>
                <button
                  onClick={() => handleSubscribePackage('VIP_PRO')}
                  disabled={purchaseLoading === 'VIP_PRO'}
                  className="w-full sm:w-auto py-3 px-8 rounded-full bg-purple-400 hover:bg-purple-300 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {purchaseLoading === 'VIP_PRO' ? 'Activating...' : 'Get Pro (৳ 1,999)'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PACKAGES / PRICING TIERS */}
        {activeTab === 'packages' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="text-center max-w-md mx-auto space-y-1">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                Transparent Pricing
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Simple, Low-Cost Marketing
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Choose the best marketing package for your chamber. Upgrade or recharge anytime.
              </p>
            </div>

            {/* 3 Tier Pricing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Plan 1: Starter */}
              <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      Starter
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">৳ 599</h3>
                    <p className="text-[11px] font-semibold text-slate-400">Essential Launch Plan</p>
                  </div>

                  <p className="text-xs font-medium text-slate-600">Ideal for new chamber launches or weekend consultations.</p>

                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><span>📝</span> <b>1</b> Consultation Post</li>
                    <li className="flex items-center gap-2"><span>🚀</span> <b>1 Day</b> Sponsored Meta Boost</li>
                    <li className="flex items-center gap-2"><span>👥</span> ~5,000+ Local Reach</li>
                    <li className="flex items-center gap-2"><span>💬</span> 24/7 Assistant</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribePackage('STARTER')}
                  disabled={purchaseLoading === 'STARTER'}
                  className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all active:scale-95"
                >
                  {purchaseLoading === 'STARTER' ? 'Activating...' : 'Get Starter (৳ 599)'}
                </button>
              </div>

              {/* Plan 2: Growth (Highlighted) */}
              <div className="bg-white rounded-[32px] p-6 border-2 border-purple-500 shadow-xl relative flex flex-col justify-between space-y-6">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
                  MOST POPULAR
                </span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                      Growth
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">৳ 999</h3>
                    <p className="text-[11px] font-semibold text-slate-400">Popular Growth Plan</p>
                  </div>

                  <p className="text-xs font-medium text-slate-600">Perfect for scaling monthly chamber footfall.</p>

                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2"><span>📝</span> <b>2</b> Consultation Posts</li>
                    <li className="flex items-center gap-2"><span>🚀</span> <b>3 Days</b> Sponsored Meta Boost</li>
                    <li className="flex items-center gap-2"><span>👥</span> ~12,000+ Local Reach</li>
                    <li className="flex items-center gap-2"><span>💬</span> 24/7 Assistant</li>
                    <li className="flex items-center gap-2"><span>📈</span> Live Analytics Dashboard</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribePackage('GROWTH')}
                  disabled={purchaseLoading === 'GROWTH'}
                  className="w-full py-3 px-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md transition-all active:scale-95"
                >
                  {purchaseLoading === 'GROWTH' ? 'Activating...' : 'Get Growth (৳ 999)'}
                </button>
              </div>

              {/* Plan 3: Pro */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-[32px] p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-300 bg-purple-950 border border-purple-400/30 px-3 py-1 rounded-full">
                      Pro
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-purple-400 tracking-tight">৳ 1,999</h3>
                    <p className="text-[11px] font-semibold text-slate-400">Weekly Premium Plan</p>
                  </div>

                  <p className="text-xs font-medium text-slate-300">Complete month-long branding & maximum patient acquisition.</p>

                  <ul className="space-y-2.5 text-xs font-semibold text-slate-200 border-t border-slate-800 pt-4">
                    <li className="flex items-center gap-2"><span>📝</span> <b>5</b> Consultation Posts</li>
                    <li className="flex items-center gap-2"><span>🚀</span> <b>7 Days</b> Sponsored Meta Boost</li>
                    <li className="flex items-center gap-2"><span>👥</span> ~25,000+ Local Reach</li>
                    <li className="flex items-center gap-2"><span>💬</span> 24/7 Assistant</li>
                    <li className="flex items-center gap-2"><span>👑</span> Priority Featured Rotation</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribePackage('VIP_PRO')}
                  disabled={purchaseLoading === 'VIP_PRO'}
                  className="w-full py-3 px-4 rounded-full bg-purple-400 hover:bg-purple-300 text-slate-950 text-xs font-black shadow-md transition-all active:scale-95"
                >
                  {purchaseLoading === 'VIP_PRO' ? 'Activating...' : 'Get Pro (৳ 1,999)'}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: AI STUDIO & BANNER */}
        {activeTab === 'banner' && (
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-white/80 shadow-xs space-y-6 animate-fadeIn">
            
            <div className="text-center max-w-md mx-auto space-y-1">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                AI Studio Canvas Engine
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Your Consultation Banner
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Generated automatically from your verified profile credentials and studio portrait photo.
              </p>
            </div>

            <div className="flex justify-center">
              <DoctorBannerPreview
                doctorName={doctor.name}
                degrees={doctor.degrees}
                specialization={doctor.specialization}
                hospitalOrChamber={doctor.chamberAddress || doctor.hospital?.name || 'Private Specialist Chamber'}
                address={doctor.chamberAddress || 'Hospital Road, Chuadanga'}
                scheduleTime="Sat, Sun, Mon, Tue, Wed, Thu (4:00 PM - 8:00 PM)"
                phoneNumbers={doctor.phone}
                photoUrl={doctor.photoUrl}
              />
            </div>

          </div>
        )}

        {/* TAB 4: BOOST SCHEDULER */}
        {activeTab === 'boost' && (() => {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
          const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay(); // 0 = Sun
          
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

          const handlePrevMonth = () => {
            if (currentCalendarMonth === 0) {
              setCurrentCalendarMonth(11);
              setCurrentCalendarYear((y) => y - 1);
            } else {
              setCurrentCalendarMonth((m) => m - 1);
            }
          };

          const handleNextMonth = () => {
            if (currentCalendarMonth === 11) {
              setCurrentCalendarMonth(0);
              setCurrentCalendarYear((y) => y + 1);
            } else {
              setCurrentCalendarMonth((m) => m + 1);
            }
          };

          const setRelativeDate = (offsetDays: number) => {
            const target = new Date();
            target.setDate(target.getDate() + offsetDays);
            const formatted = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
            setScheduledDate(formatted);
            setCurrentCalendarMonth(target.getMonth());
            setCurrentCalendarYear(target.getFullYear());
          };

          return (
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-6 border border-white/90 shadow-xs max-w-lg mx-auto space-y-4 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Meta Ad Boost Scheduler
                </h2>
              </div>

              {/* Status Banner */}
              <div className="bg-[#f8f9fe] border border-purple-100 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Boost Days</span>
                  <h4 className="text-2xl font-black text-purple-700 mt-0.5">{doctor.remainingBoostDays} Days</h4>
                </div>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="text-xs font-black bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  + Add Days
                </button>
              </div>

              {/* Quick Select Day Chips */}
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Quick Select:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Today', offset: 0 },
                    { label: 'Tomorrow', offset: 1 },
                    { label: 'In 2 Days', offset: 2 },
                  ].map((chip) => {
                    const target = new Date();
                    target.setDate(target.getDate() + chip.offset);
                    const formatted = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
                    const isSelected = scheduledDate === formatted;

                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => setRelativeDate(chip.offset)}
                        className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aesthetic Custom Calendar Box */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    {monthNames[currentCalendarMonth]} {currentCalendarYear}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of week labels */}
                <div className="grid grid-cols-7 text-center text-[11px] font-black text-slate-400 mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty slots for first day offset */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isSelected = scheduledDate === dateStr;
                    const isToday = todayStr === dateStr;
                    
                    const cellDate = new Date(currentCalendarYear, currentCalendarMonth, dayNum);
                    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const isPast = cellDate < todayZero;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        disabled={isPast}
                        onClick={() => setScheduledDate(dateStr)}
                        className={`h-9 rounded-2xl text-xs font-black transition-all relative flex items-center justify-center ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md scale-105 z-10 font-black'
                            : isPast
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-800 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {isToday && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 bg-purple-600 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Schedule Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Start Date</span>
                  <span className="font-black text-slate-900 mt-0.5 block">
                    {new Date(scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target City</span>
                  <span className="font-bold text-purple-700 mt-0.5 block">{doctor.hospital?.district?.nameBn || doctor.hospital?.district?.nameEn || 'Chuadanga'} (~25k reach)</span>
                </div>
              </div>

              <form onSubmit={handleScheduleBoost}>
                <button
                  type="submit"
                  disabled={scheduleLoading || doctor.remainingBoostDays <= 0}
                  className="w-full py-3.5 px-4 rounded-full bg-slate-900 hover:bg-purple-600 text-white font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {scheduleLoading ? 'Scheduling...' : 'Confirm & Schedule Boost ➜'}
                </button>
              </form>

            </div>
          );
        })()}

        {/* TAB 5: WALLET & TRANSACTIONS */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Minimalist Hero Wallet Box */}
            <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Digital Balance</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">৳ {doctor.walletBalance.toLocaleString()} BDT</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Instant Bank-Grade bKash & Nagad payments</p>
              </div>

              <button
                onClick={() => setShowRechargeModal(true)}
                className="bg-slate-900 hover:bg-purple-600 text-white font-black text-xs px-6 py-3.5 rounded-full shadow-md transition-all active:scale-95"
              >
                + Add Funds
              </button>
            </div>

            {/* Transaction Logs */}
            <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 border border-white/80 shadow-xs">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
                Transaction History
              </h4>

              {doctor.walletTransactions && doctor.walletTransactions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {doctor.walletTransactions.map((tx: any) => (
                    <div key={tx.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black ${
                          tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {tx.type === 'CREDIT' ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{tx.notes || 'Wallet Transaction'}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {tx.method} • <span className="font-mono">{tx.trxId || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <div className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'CREDIT' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-8">No transactions recorded yet.</p>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: DOCTOR PROFILE & INFORMATION UPGRADE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            
            {/* Top Profile Header Hero with Light Purple Banner */}
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] border border-white/90 shadow-xs max-w-2xl mx-auto overflow-hidden">
              
              {/* Light Purple Theme Banner */}
              <div className="h-28 sm:h-36 bg-gradient-to-r from-purple-200/70 via-purple-100 to-indigo-100/80 relative flex items-end justify-center">
                {/* Subtle Decorative Pattern / Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-2xl" />

                {/* Overlapping Avatar in Center */}
                <div className="relative -mb-12 sm:-mb-14 z-10">
                  <label className="relative group cursor-pointer block" title="ছবি পরিবর্তন করতে ক্লিক করুন">
                    <img
                      src={profileForm.photoUrl || doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
                      alt={profileForm.name || doctor.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-top border-4 border-white shadow-xl group-hover:opacity-95 transition-all group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform border-2 border-white">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Profile Details Under Avatar */}
              <div className="pt-14 sm:pt-16 pb-6 px-6 sm:px-8 text-center space-y-1.5 border-b border-slate-100">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {profileForm.name || doctor.name}
                  </h2>
                  <ShieldCheck className="w-5 h-5 text-sky-500 fill-sky-500" />
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {profileForm.degrees || doctor.degrees}
                </p>
                {profileForm.specialization && (
                  <p className="text-xs font-bold text-purple-700">
                    {profileForm.specialization}
                  </p>
                )}
              </div>

              {/* Form Content Padding */}
              <div className="p-6 sm:p-8">
                {/* Profile Edit Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* 1. Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-600" /> Basic & Contact Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        Doctor Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="e.g. Dr. Hasan Ali"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        Serial / Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="e.g. 01718-703136"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        Specialization / Department *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.specialization}
                        onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                        placeholder="e.g. মেডিসিন ও কার্ডিওলজি বিশেষজ্ঞ"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        BMDC Reg. Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profileForm.bmdcNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, bmdcNumber: e.target.value })}
                          placeholder="e.g. A-12345"
                          className="w-full pl-4 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200 pointer-events-none shadow-2xs">
                          ঐচ্ছিক / Optional
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      Degrees & Qualifications *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.degrees}
                      onChange={(e) => setProfileForm({ ...profileForm, degrees: e.target.value })}
                      placeholder="e.g. MBBS (DMC), FCPS (Medicine), MD (Cardiology)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Chamber & Location Details */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-600" /> Chamber & Location Details
                  </h4>

                  {/* Division & District Selection with Professional Custom Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* 1. Custom Division Dropdown */}
                    <div className="relative" ref={divisionDropdownRef}>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" /> বিভাগ (Division) *
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsDivisionOpen(!isDivisionOpen);
                          setIsDistrictOpen(false);
                        }}
                        className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 border rounded-2xl text-xs font-bold text-slate-900 transition-all flex items-center justify-between cursor-pointer ${
                          isDivisionOpen
                            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-white shadow-sm'
                            : 'border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">
                            {BANGLADESH_DIVISIONS.find((d) => d.en === profileForm.division)?.bn || profileForm.division} বিভাগ
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            ({BANGLADESH_DIVISIONS.find((d) => d.en === profileForm.division)?.en || profileForm.division})
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDivisionOpen ? 'rotate-180 text-purple-600' : ''}`} />
                      </button>

                      {/* Custom Floating Division Popover */}
                      {isDivisionOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 z-50 max-h-60 overflow-y-auto space-y-0.5 animate-fadeIn">
                          {BANGLADESH_DIVISIONS.map((div) => {
                            const isSelected = profileForm.division === div.en;
                            return (
                              <button
                                key={div.en}
                                type="button"
                                onClick={() => {
                                  setProfileForm((prev) => ({
                                    ...prev,
                                    division: div.en,
                                    district: div.districts.length > 0 ? div.districts[0].en : prev.district,
                                  }));
                                  setIsDivisionOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                                  isSelected
                                    ? 'bg-purple-600 text-white font-extrabold shadow-xs'
                                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{div.bn} বিভাগ</span>
                                  <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400 font-medium'}`}>
                                    ({div.en})
                                  </span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 2. Custom District Dropdown */}
                    <div className="relative" ref={districtDropdownRef}>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" /> জেলা (District) *
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsDistrictOpen(!isDistrictOpen);
                          setIsDivisionOpen(false);
                        }}
                        className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 border rounded-2xl text-xs font-bold text-slate-900 transition-all flex items-center justify-between cursor-pointer ${
                          isDistrictOpen
                            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-white shadow-sm'
                            : 'border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-purple-700">
                            {(BANGLADESH_DIVISIONS.find((d) => d.en === profileForm.division)?.districts || []).find((d) => d.en === profileForm.district)?.bn || profileForm.district}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            ({profileForm.district})
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDistrictOpen ? 'rotate-180 text-purple-600' : ''}`} />
                      </button>

                      {/* Custom Floating District Popover */}
                      {isDistrictOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 z-50 max-h-60 overflow-y-auto space-y-0.5 animate-fadeIn">
                          {(BANGLADESH_DIVISIONS.find((d) => d.en === profileForm.division)?.districts || BANGLADESH_DIVISIONS[0].districts).map((dist) => {
                            const isSelected = profileForm.district === dist.en;
                            return (
                              <button
                                key={dist.en}
                                type="button"
                                onClick={() => {
                                  setProfileForm((prev) => ({ ...prev, district: dist.en }));
                                  setIsDistrictOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                                  isSelected
                                    ? 'bg-purple-600 text-white font-extrabold shadow-xs'
                                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{dist.bn}</span>
                                  <span className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400 font-medium'}`}>
                                    ({dist.en})
                                  </span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        ভিজিট ফি (Consultation Fee ৳)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={profileForm.consultationFee || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, consultationFee: parseInt(e.target.value, 10) || 0 })}
                          placeholder="e.g. 500"
                          className="w-full pl-4 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200 pointer-events-none shadow-2xs">
                          ঐচ্ছিক / Optional
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        Chamber Room / Floor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profileForm.chamberRoom}
                          onChange={(e) => setProfileForm({ ...profileForm, chamberRoom: e.target.value })}
                          placeholder="e.g. রুম নং- ২০৪ (২য় তলা)"
                          className="w-full pl-4 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200 pointer-events-none shadow-2xs">
                          ঐচ্ছিক / Optional
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      Hospital / Chamber Location Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.chamberAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, chamberAddress: e.target.value })}
                      placeholder="e.g. চুয়াডাঙ্গা সদর হাসপাতাল মোড়, চুয়াডাঙ্গা"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Visiting Time & Weekly Chamber Days */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" /> রোগী দেখার সময়সূচি *
                  </h4>

                  {/* Dual Scroll Wheel Picker Card */}
                  <div className="bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 rounded-3xl border border-slate-200/90 p-5 shadow-xs">
                    <div className="flex items-center justify-center gap-3 sm:gap-8 py-2">
                      
                      {/* Left Wheel: Start Time */}
                      <IosTimeWheel
                        value={profileForm.startTime}
                        onChange={(val) => setProfileForm((prev) => ({ ...prev, startTime: val }))}
                      />

                      {/* Middle Connector: "থেকে" */}
                      <div className="flex flex-col items-center justify-center px-1 sm:px-3">
                        <span className="bg-purple-100 text-purple-900 border border-purple-200 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-2xs">
                          থেকে
                        </span>
                      </div>

                      {/* Right Wheel: End Time */}
                      <IosTimeWheel
                        value={profileForm.endTime}
                        onChange={(val) => setProfileForm((prev) => ({ ...prev, endTime: val }))}
                      />

                    </div>

                    {/* Live Preview Summary Bar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs px-1">
                      <span className="text-slate-400 font-medium">নির্ধারিত সময়সূচি:</span>
                      <span className="text-purple-700 font-black bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                        {profileForm.startTime} থেকে {profileForm.endTime}
                      </span>
                    </div>

                  </div>

                  {/* 2. Weekly Chamber Days (নিচে) */}
                  <div className="space-y-2 pt-2 border-t border-dashed border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" /> চেম্বারের দিনসমূহ *
                      </label>
                      <span className="text-[10px] font-bold text-purple-700">অন্তত ১টি দিন সিলেক্ট করুন *</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {[
                        { day: 6, label: 'শনি' },
                        { day: 0, label: 'রবি' },
                        { day: 1, label: 'সোম' },
                        { day: 2, label: 'মঙ্গ' },
                        { day: 3, label: 'বুধ' },
                        { day: 4, label: 'বৃহ' },
                        { day: 5, label: 'শুক্র' },
                      ].map((item) => {
                        const isSelected = profileForm.schedules.includes(item.day);
                        return (
                          <button
                            key={item.day}
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => {
                                const newSchedules = isSelected
                                  ? prev.schedules.filter((d) => d !== item.day)
                                  : [...prev.schedules, item.day];
                                return { ...prev, schedules: newSchedules };
                              });
                            }}
                            className={`py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center cursor-pointer border ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30 scale-105'
                                : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60 hover:opacity-100 hover:border-purple-200'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Bio & Diseases Treated */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" /> ডাক্তারের বিবরণ ও চিকিৎসাসেবা *
                  </h4>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      ডাক্তারের বিবরণ *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="অভিজ্ঞ মেডিসিন ও কার্ডিওলজি বিশেষজ্ঞ..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      যেসব রোগের চিকিৎসাসেবা প্রদান করেন *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={profileForm.treatedDiseases}
                      onChange={(e) => setProfileForm({ ...profileForm, treatedDiseases: e.target.value })}
                      placeholder="উচ্চ রক্তচাপ, ডায়াবেটিস, বুকব্যথা, গ্যাস্ট্রিক..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit / Save Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      fetchDoctorData();
                      showToastNotification('success', 'Profile form reset to latest saved data');
                    }}
                    className="px-5 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex-1 sm:flex-initial px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {profileLoading ? 'Saving Changes...' : 'Save Profile Changes 💾'}
                  </button>
                </div>

              </form>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* 5. Klarna-Style Floating Bottom Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
        <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-full p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex items-center justify-between relative">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'packages', label: 'Plans', icon: Sparkles },
            { id: 'boost', label: 'Boost', icon: Rocket, isMiddle: true },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((dock) => {
            const Icon = dock.icon;
            const isActive = activeTab === dock.id;

            if (dock.isMiddle) {
              return (
                <button
                  key={dock.id}
                  onClick={() => setActiveTab(dock.id as any)}
                  className="relative -mt-6 flex flex-col items-center group cursor-pointer"
                  title="Boost Chamber"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-purple-600/40 ring-4 ring-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30 ring-4 ring-white'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] mt-1 font-black tracking-tight ${
                    isActive ? 'text-purple-600 font-black' : 'text-slate-500'
                  }`}>
                    {dock.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={dock.id}
                onClick={() => setActiveTab(dock.id as any)}
                className={`flex-1 flex flex-col items-center py-1.5 px-2 rounded-full transition-all cursor-pointer ${
                  isActive ? 'text-purple-600 font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.8] scale-110' : 'stroke-[2]'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">{dock.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Klarna-Style Aesthetic Recharge Popup Modal */}
      {showRechargeModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRechargeModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 animate-modal-backdrop cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[36px] max-w-sm w-full p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white relative animate-modal-spring cursor-default"
          >
            
            <button
              onClick={() => setShowRechargeModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1 mb-5">
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Instant Top-Up
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Add Funds</h3>
              <p className="text-xs font-semibold text-slate-400">Recharge with bKash or Nagad</p>
            </div>

            {rechargeMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200">
                {rechargeMessage}
              </div>
            )}

            <form onSubmit={handleRecharge} className="space-y-4">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRechargeMethod('BKASH')}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                      rechargeMethod === 'BKASH'
                        ? 'bg-pink-50 text-pink-700 border-pink-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80'
                    }`}
                  >
                    <span>🌸 bKash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRechargeMethod('NAGAD')}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                      rechargeMethod === 'NAGAD'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80'
                    }`}
                  >
                    <span>⚡ Nagad</span>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Amount (BDT)</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {['599', '999', '1999'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRechargeAmount(val)}
                      className={`py-2 rounded-xl text-xs font-black border transition-all ${
                        rechargeAmount === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      ৳ {val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-black text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Sender Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  TrxID <span className="text-[10px] text-slate-400 font-normal">(Optional for test recharge)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9B27XQ8K"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={rechargeLoading}
                className="w-full py-3.5 px-4 rounded-full bg-slate-900 hover:bg-purple-600 text-white text-xs font-black shadow-lg transition-all active:scale-95"
              >
                {rechargeLoading ? 'Processing...' : `Top-Up ৳${rechargeAmount} BDT ➜`}
              </button>
            </form>
          </div>
        </div>
      )}
      {showSideMenu && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setShowSideMenu(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto border-l border-slate-100 animate-slideLeft">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="CD Doctors Logo"
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-black text-sm text-slate-900 tracking-tight">
                    Doctor <span className="text-sky-600">Menu</span>
                  </span>
                </div>

                <button
                  onClick={() => setShowSideMenu(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Doctor Mini Profile Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
                <img
                  src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
                  alt={doctor.name}
                  className="w-10 h-10 rounded-full object-cover object-top border-2 border-white shadow-xs"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate leading-tight">{doctor.name}</h4>
                  <p className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{doctor.phone}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {[
                  { id: 'home', label: 'Home Overview', icon: Home },
                  { id: 'packages', label: 'Growth Packages', icon: Sparkles },
                  { id: 'boost', label: 'Boost Scheduler', icon: Calendar },
                  { id: 'wallet', label: 'Wallet & Billing', icon: Wallet },
                  { id: 'profile', label: 'Doctor Profile & Info', icon: User },
                  { id: 'banner', label: 'AI Banner Studio', icon: Layers },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setShowSideMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-black'
                          : 'text-slate-600 hover:bg-purple-50/50 hover:text-purple-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-2 pb-2">
                  <div className="h-px bg-slate-100" />
                </div>

                <Link
                  href="/"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Visit Public Website</span>
                </Link>
              </div>
            </div>

            {/* Logout at Bottom */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
