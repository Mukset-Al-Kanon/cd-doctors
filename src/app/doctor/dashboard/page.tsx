'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DoctorBannerPreview from '@/components/doctor/DoctorBannerPreview';
import DoctorLiveQueueManager from '@/components/DoctorLiveQueueManager';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';
import { 
  Sparkles, 
  Wallet, 
  Rocket, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
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
  Clock, 
  Video, 
  ArrowDownLeft, 
  Trash2, 
  AlertCircle,
  Award,
  Bell,
  CheckCheck,
  Activity,
  ArrowRight,
  Filter,
  RefreshCw,
  Phone,
  MessageSquare,
  Settings,
  HelpCircle,
  Receipt,
  CheckCircle,
  Clock3,
  CalendarDays,
  FileCheck,
  BadgeCheck,
  DollarSign,
  Star,
  Crown,
  Shield,
  PhoneCall,
  Monitor,
  UserCheck
} from 'lucide-react';

const DURATION_PACKAGES = [
  { 
    id: 'MONTH_1', 
    name: 'বেসিক প্ল্যান',
    durationBn: '১ মাস', 
    price: 349, 
    originalPrice: 349,
    durationDays: 30, 
    savings: '',
    perMonthText: '৳ ৩৪৯ / মাস',
    tag: '',
    desc: 'নতুন চিকিৎসকদের জন্য ট্রায়াল ও চেম্বার পরিচিতি প্ল্যান',
    features: [
      'ভেরিফাইড বিশেষজ্ঞ টিক ব্যাজ',
      'আনলিমিটেড পেশেন্ট সিরিয়াল বুকিং',
      'চেম্বার শিডিউল ও রোগী ব্যবস্থাপনা',
      'রোগীকে অটোমেটেড SMS নোটিফিকেশন',
      'পাবলিক ডিরেক্টরিতে প্রোফাইল প্রকাশ',
    ]
  },
  { 
    id: 'MONTH_3', 
    name: 'স্ট্যান্ডার্ড প্ল্যান',
    durationBn: '৩ মাস', 
    price: 649, 
    originalPrice: 1047,
    durationDays: 90, 
    savings: '৩৮% সাশ্রয়ী',
    perMonthText: '৳ ২১৬ / মাস',
    tag: 'সাশ্রয়ী',
    desc: 'নিয়মিত চেম্বার ও পেশেন্ট ফলো-আপের জন্য আদর্শ',
    features: [
      'বেসিক প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত',
      'টেলিমেডিসিন অনলাইন ভিডিও চেম্বার',
      'সার্চ রেজাল্টে বিশেষ অগ্রাধিকার',
      'রোগী কল লগ ও হিস্ট্রি রেকর্ড',
      'প্রিমিয়াম চেম্বার নোটিশ ব্যানার',
    ]
  },
  { 
    id: 'MONTH_6', 
    name: 'প্রো প্ল্যান',
    durationBn: '৬ মাস', 
    price: 999, 
    originalPrice: 2094,
    durationDays: 180, 
    savings: '৫২% সাশ্রয়ী',
    perMonthText: '৳ ১৬৬ / মাস',
    tag: 'সর্বাধিক জনপ্রিয়',
    popular: true,
    desc: 'সবচেয়ে বেশি ব্যবহৃত ও দীর্ঘমেয়াদী পূর্ণাঙ্গ প্রফেশনাল প্ল্যান',
    features: [
      'স্ট্যান্ডার্ড প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত',
      'টপ স্পেশালিস্ট ব্যাজ ও ফিচারড প্রোফাইল',
      'মেটা স্পনসরড বিজ্ঞাপনে বিশেষ সুবিধা',
      'মাল্টি-চেম্বার আনলিমিটেড শিফট',
      '২৪/৭ প্রায়োরিটি টেকনিক্যাল সাপোর্ট',
    ]
  },
  { 
    id: 'MONTH_12', 
    name: 'এন্টারপ্রাইজ প্ল্যান',
    durationBn: '১২ মাস (১ বছর)', 
    price: 1499, 
    originalPrice: 4188,
    durationDays: 365, 
    savings: '৬৪% সাশ্রয়ী',
    perMonthText: '৳ ১২৫ / মাস',
    tag: 'সেরা ভ্যালু',
    bestValue: true,
    desc: 'সম্পূর্ণ ১ বছরের নিশ্চিন্ত মেম্বারশিপ ও সর্বোচ্চ সুবিধা',
    features: [
      'সকল প্রিমিয়াম ফিচার সম্পূর্ণ আনলিমিটেড',
      'প্রতিদিন মাত্র ৪ ৳ খরচ',
      'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার সাপোর্ট',
      'ফ্রি এইচডি প্রিন্ট উপযোগী পোস্টার মেকিং',
      'সারাদেশে প্ল্যাটফর্ম প্রোমোশনে ফিচার',
    ]
  },
];

const BOOST_OPTIONS = [
  {
    id: 'LOCAL_CHAMBER',
    title: 'স্থানীয় চেম্বার প্রমোশন (২৪ ঘণ্টা)',
    price: 199,
    target: 'আপনার নিজ জেলা ও আশেপাশের ১৫ কিমি এলাকা',
    reach: '~৫,০০০+ সম্ভাব্য রোগী',
    desc: 'চেম্বারে নতুন রোগী বাড়াতে স্থানীয় ফেসবুক ব্যবহারকারীদের নিউজফিডে আপনার চেম্বারের সময়সূচি ও অ্যাপয়েন্টমেন্ট লিংক প্রচার।',
    icon: Building2,
    badge: 'লোকাল চেম্বার',
  },
  {
    id: 'NATIONWIDE_TELEMEDICINE',
    title: 'দেশব্যাপী অনলাইন কনসালটেশন প্রচার (২৪ ঘণ্টা)',
    price: 399,
    target: 'সমগ্র বাংলাদেশ (৬৪ জেলা)',
    reach: '~১২,০০০+ দেশব্যাপী রোগী',
    desc: 'সারাদেশের রোগীদের কাছে আপনার অনলাইন ভিডিও কনসালটেশন প্রচার করে সরাসরি ডিজিটাল সিরিয়াল গ্রহণ করুন।',
    icon: Globe,
    badge: 'দেশব্যাপী অনলাইন',
  },
];

interface ScheduleShift {
  id: string;
  label: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  consultationFee: number;
  isCustomTime: boolean;
}

const BD_DIVISIONS_AND_DISTRICTS: Record<string, string[]> = {
  'খুলনা': ['চুয়াডাঙ্গা', 'কুষ্টিয়া', 'ঝিনাইদহ', 'মেহেরপুর', 'খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'নড়াইল', 'মাগুরা'],
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'নরসিংদী', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'ফরিদপুর', 'মাদারীপুর', 'গোপালগঞ্জ', 'রাজবাড়ী', 'শরীয়তপুর', 'কিশোরগঞ্জ'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'নোয়াখালী', 'ফেনী', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'লক্ষ্মীপুর', 'রাঙ্গামাটি', 'খাগড়াছড়ি', 'বান্দরবান'],
  'রাজশাহী': ['রাজশাহী', 'বগুড়া', 'পাবনা', 'সিরাজগঞ্জ', 'নওগাঁ', 'নাটোর', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট'],
  'বরিশাল': ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
  'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  'রংপুর': ['রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'গাইবান্ধা', 'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও', 'লালমনিরহাট'],
  'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'নেত্রকোণা', 'শেরপুর'],
};

const BD_WEEK_DAYS = [
  { day: 6, short: 'শনি', label: 'শনিবার' },
  { day: 0, short: 'রবি', label: 'রবিবার' },
  { day: 1, short: 'সোম', label: 'সোমবার' },
  { day: 2, short: 'মঙ্গ', label: 'মঙ্গলবার' },
  { day: 3, short: 'বুধ', label: 'বুধবার' },
  { day: 4, short: 'বৃহ', label: 'বৃহস্পতিবার' },
  { day: 5, short: 'শুক্র', label: 'শুক্রবার' },
];

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'appointments' | 'chambers' | 'telemedicine' | 'wallet' | 'boost' | 'packages' | 'banner' | 'profile'>('appointments');
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<any>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [isTelemedicineOnline, setIsTelemedicineOnline] = useState(true);

  // Selected package for subscription
  const [selectedPkgId, setSelectedPkgId] = useState('MONTH_6');
  const [selectedBoostId, setSelectedBoostId] = useState('LOCAL_CHAMBER');

  // Recharge Modal State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('500');
  const [rechargeMethod, setRechargeMethod] = useState<'BKASH' | 'NAGAD'>('BKASH');
  const [senderPhone, setSenderPhone] = useState('01718-703136');
  const [trxId, setTrxId] = useState('');
  const [rechargeLoading, setRechargeLoading] = useState(false);

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'BKASH' | 'NAGAD' | 'BANK'>('BKASH');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Add Chamber Modal State
  const [showAddChamberModal, setShowAddChamberModal] = useState(false);
  const [newChamber, setNewChamber] = useState<{
    chamberType: 'PRIVATE' | 'TELEMEDICINE';
    chamberName: string;
    chamberAddress: string;
    roomNumber: string;
    serialPhone: string;
    followUpFee: number;
    division: string;
    district: string;
    shifts: ScheduleShift[];
    isTelemedicine: boolean;
  }>({
    chamberType: 'PRIVATE',
    chamberName: '',
    chamberAddress: '',
    roomNumber: '',
    serialPhone: '',
    followUpFee: 500,
    division: 'খুলনা',
    district: 'চুয়াডাঙ্গা',
    shifts: [
      {
        id: 'shift-1',
        label: 'নিয়মিত শিফট',
        daysOfWeek: [6, 0, 1, 2, 3, 4],
        startTime: '04:00 PM',
        endTime: '08:00 PM',
        consultationFee: 800,
        isCustomTime: false,
      },
    ],
    isTelemedicine: false,
  });
  const [chamberSaving, setChamberSaving] = useState(false);

  // Notifications / Toast
  const [purchaseLoading, setPurchaseLoading] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    degrees: '',
    specialization: '',
    bmdcNumber: '',
    experienceYears: 0,
    consultationFee: 0,
    chamberRoom: '',
    chamberAddress: '',
    phone: '',
    photoUrl: '',
    bio: '',
    treatedDiseases: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const showToast = (type: 'success' | 'error', text: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ type, text });
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDoctorData = useCallback(async () => {
    try {
      const res = await fetch('/api/doctor/auth/me');
      const data = await res.json();
      if (!data.success) {
        router.push('/doctor/login');
        return;
      }
      setDoctor(data.doctor);
      setProfileForm({
        name: data.doctor.name || '',
        degrees: data.doctor.degrees || '',
        specialization: data.doctor.specialization || '',
        bmdcNumber: data.doctor.bmdcNumber || '',
        experienceYears: data.doctor.experienceYears || 0,
        consultationFee: data.doctor.consultationFee || 0,
        chamberRoom: data.doctor.chamberRoom || '',
        chamberAddress: data.doctor.chamberAddress || '',
        phone: data.doctor.phone || '',
        photoUrl: data.doctor.photoUrl || '',
        bio: data.doctor.bio || '',
        treatedDiseases: data.doctor.treatedDiseases || '',
      });
    } catch (err) {
      router.push('/doctor/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleLogout = async () => {
    await fetch('/api/doctor/auth/me', { method: 'DELETE' });
    router.push('/doctor/login');
  };

  // Subscribe to Membership Package
  const handleSubscribeMembership = async (pkgId?: string) => {
    const targetPkgId = pkgId || selectedPkgId;
    setPurchaseLoading(targetPkgId);
    try {
      const res = await fetch('/api/doctor/packages/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageKey: targetPkgId }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast('error', data.error);
        if (data.shortage) {
          setTimeout(() => setShowRechargeModal(true), 1000);
        }
        return;
      }

      showToast('success', data.message);
      fetchDoctorData();
    } catch (err: any) {
      showToast('error', err.message || 'প্যাকেজ সক্রিয় করা যায়নি।');
    } finally {
      setPurchaseLoading('');
    }
  };

  // Trigger Promotion Boost
  const handleTriggerBoost = async () => {
    setPurchaseLoading('BOOST');
    try {
      const res = await fetch('/api/doctor/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostKey: selectedBoostId }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast('error', data.error);
        if (data.shortage) {
          setTimeout(() => setShowRechargeModal(true), 1000);
        }
        return;
      }

      showToast('success', data.message);
      fetchDoctorData();
    } catch (err: any) {
      showToast('error', err.message || 'প্রচার শুরু করা যায়নি।');
    } finally {
      setPurchaseLoading('');
    }
  };

  // Recharge Wallet
  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRechargeLoading(true);
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
      if (!data.success) throw new Error(data.error || 'Failed recharge');

      showToast('success', 'রিচার্জ আবেদন জমা হয়েছে। অ্যাডমিন ভেরিফাই করলে ব্যালেন্স যোগ হবে।');
      setShowRechargeModal(false);
      setTrxId('');
      fetchDoctorData();
    } catch (err: any) {
      showToast('error', err.message || 'রিচার্জ ব্যর্থ হয়েছে।');
    } finally {
      setRechargeLoading(false);
    }
  };

  // Request Withdrawal
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawLoading(true);
    try {
      const res = await fetch('/api/doctor/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          method: withdrawMethod,
          accountNumber: withdrawAccount,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Withdrawal failed');

      showToast('success', data.message);
      setShowWithdrawModal(false);
      setWithdrawAccount('');
      fetchDoctorData();
    } catch (err: any) {
      showToast('error', err.message || 'উইথড্রল রিকোয়েস্ট পাঠানো যায়নি।');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Add Chamber
  const handleAddChamberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChamberSaving(true);
    try {
      const fullAddress = [
        newChamber.chamberAddress,
        newChamber.roomNumber ? `রুম: ${newChamber.roomNumber}` : '',
        newChamber.serialPhone ? `সিরিয়াল: ${newChamber.serialPhone}` : '',
      ].filter(Boolean).join(', ');

      const res = await fetch('/api/doctor/chambers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chamberName: newChamber.chamberName,
          chamberAddress: fullAddress,
          division: newChamber.division,
          district: newChamber.district,
          shifts: newChamber.shifts,
          isTelemedicine: newChamber.chamberType === 'TELEMEDICINE',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to add chamber');

      showToast('success', data.message);
      setShowAddChamberModal(false);
      fetchDoctorData();
    } catch (err: any) {
      showToast('error', err.message || 'চেম্বার সংরক্ষণ করা যায়নি।');
    } finally {
      setChamberSaving(false);
    }
  };

  // Delete Chamber
  const handleDeleteEntireChamber = async (chamberName: string) => {
    if (!confirm(`আপনি কি "${chamberName}" চেম্বারের সকল শিডিউল মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/doctor/chambers?chamberName=${encodeURIComponent(chamberName)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchDoctorData();
      } else {
        showToast('error', data.error || 'মুছতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Update Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে');
        fetchDoctorData();
      } else {
        showToast('error', data.error || 'প্রোফাইল আপডেট করা যায়নি');
      }
    } catch (err: any) {
      showToast('error', err.message || 'ত্রুটি ঘটেছে');
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3 font-bengali">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">পোর্টাল লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!doctor) return null;

  const isVerified = Boolean(doctor.subscriptionExpiresAt && new Date(doctor.subscriptionExpiresAt) > new Date());
  const activePackage = DURATION_PACKAGES.find(p => p.id === (doctor.subscriptionTier || doctor.activePackageName)) || null;

  // Remaining subscription days calculation
  const remainingDays = doctor.subscriptionExpiresAt 
    ? Math.max(0, Math.ceil((new Date(doctor.subscriptionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Filtered Appointments
  const filteredAppointments = (doctor.appointments || []).filter((apt: any) => {
    const matchesSearch = !searchQuery || 
      apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone?.includes(searchQuery) ||
      apt.appointmentCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const navMenuItems = [
    { id: 'appointments', label: 'রোগী ও সিরিয়াল তালিকা', icon: Users, badge: doctor.appointments?.length || 0 },
    { id: 'chambers', label: 'চেম্বার ও শিডিউল', icon: Building2, badge: doctor.schedules?.length || null },
    { id: 'telemedicine', label: 'ভিডিও কনসালটেশন', icon: Video, badge: isTelemedicineOnline ? 'অনলাইন' : 'বন্ধ' },
    { id: 'wallet', label: 'আয় ও ওয়ালেট ব্যালেন্স', icon: Wallet, badge: `৳ ${doctor.walletBalance?.toLocaleString()}` },
    { id: 'packages', label: 'মেম্বারশিপ প্ল্যান', icon: ShieldCheck, badge: isVerified ? 'ভেরিফাইড' : 'আপগ্রেড' },
    { id: 'boost', label: 'রোগী বৃদ্ধি ও প্রচার', icon: Rocket, badge: null },
    { id: 'banner', label: 'চেম্বার নোটিশ ও ব্যানার', icon: FileText, badge: null },
    { id: 'profile', label: 'প্রোফাইল ও ডিগ্রি সেটিংস', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 font-bengali text-slate-800 antialiased flex">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition-all ${
          toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📁 1. LEFT SIDEBAR                                                        */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 sticky top-0 h-screen z-30">
        
        {/* Portal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
              ✚
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">CD Doctors</h1>
              <p className="text-[10px] text-slate-400 font-medium">ডাক্তার ওয়ার্কস্পেস</p>
            </div>
          </Link>
        </div>

        {/* Doctor Summary */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2.5">
            <img
              src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
              alt={doctor.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold text-slate-900 truncate leading-tight">{doctor.name}</h2>
                {isVerified && <OfficialVerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 truncate">{doctor.degrees || doctor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Fast Prescription Maker Launch Button */}
        <div className="p-3 pb-1.5">
          <Link
            href={`/doctor/prescription?doctorId=${doctor.id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs shadow-xs transition active:scale-98"
          >
            <FileText className="w-4 h-4" />
            <span>প্রেসক্রিপশন মেকার</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200/80 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700 stroke-[2.2]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">টুলস ও ডিসপ্লে</p>
            <Link
              href={`/doctor/tv-display?doctorId=${doctor.id}`}
              target="_blank"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Monitor className="w-4 h-4 text-slate-400" />
              <span>টিভি টোকেন ডিসপ্লে</span>
            </Link>
            <Link
              href={`/doctor/assistant?doctorId=${doctor.id}`}
              target="_blank"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span>সহকারী ডেস্ক</span>
            </Link>
          </div>
        </nav>

        {/* Bottom Bar: Public Profile & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {doctor.slug && (
            <Link
              href={`/doctors/${doctor.slug}`}
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-sky-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>পাবলিক প্রোফাইল</span>
              </span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগ আউট</span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 📱 2. MOBILE HEADER & DRAWER                                              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Modern Mobile Sticky Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
              alt={doctor.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-black text-nuvicaNavy-950 truncate leading-tight">{doctor.name}</h2>
                {isVerified && <OfficialVerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
              </div>
              <p className="text-[10.5px] text-slate-500 font-medium truncate">
                {doctor.hospital?.name || doctor.chamberAddress?.split(',')?.[0] || doctor.specialization || 'বিশেষজ্ঞ চেম্বার'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-black text-xs border border-sky-200/80 shadow-xs transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-sky-600" />
              <span>৳ {doctor.walletBalance?.toLocaleString()}</span>
            </button>
          </div>
        </header>

        {/* Mobile Slide-Over Drawer for "অন্যান্য" (More) */}
        {showMobileNav && (
          <div className="fixed inset-0 z-[60] lg:hidden flex justify-end">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setShowMobileNav(false)} 
            />
            <div className="relative w-full max-w-xs bg-white h-full p-5 pb-8 flex flex-col justify-between z-10 shadow-2xl border-l border-slate-200/80 overflow-y-auto">
              <div className="space-y-4">
                {/* Header & Close */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black text-nuvicaNavy-950 uppercase tracking-wider">মেনু ও সেটিংস</span>
                  <button 
                    onClick={() => setShowMobileNav(false)} 
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Doctor Profile Mini Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
                  <img
                    src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
                    alt={doctor.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-black text-slate-900 truncate leading-tight">{doctor.name}</p>
                      {isVerified && <OfficialVerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{doctor.specialization || doctor.degrees}</p>
                  </div>
                </div>

                {/* Fast Prescription Maker Launch Button */}
                <Link
                  href={`/doctor/prescription?doctorId=${doctor.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>প্রেসক্রিপশন মেকার</span>
                </Link>

                {/* Secondary Navigation Options */}
                <div className="space-y-1 pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">অন্যান্য সুবিধা</p>
                  
                  {[
                    { id: 'telemedicine', label: 'ভিডিও কনসালটেশন', icon: Video, badge: isTelemedicineOnline ? 'অনলাইন' : 'বন্ধ' },
                    { id: 'boost', label: 'রোগী বৃদ্ধি ও প্রচার', icon: Rocket, badge: null },
                    { id: 'packages', label: 'মেম্বারশিপ প্ল্যান', icon: ShieldCheck, badge: isVerified ? 'ভেরিফাইড' : 'আপগ্রেড' },
                    { id: 'banner', label: 'চেম্বার নোটিশ ও ব্যানার', icon: FileText, badge: null },
                    { id: 'profile', label: 'প্রোফাইল ও ডিগ্রি সেটিংস', icon: Settings, badge: null },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setShowMobileNav(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                          activeTab === item.id 
                            ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200/80' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${activeTab === item.id ? 'text-sky-700' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">এক্সটার্নাল টুলস</p>
                    <Link
                      href={`/doctor/tv-display?doctorId=${doctor.id}`}
                      target="_blank"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Monitor className="w-4 h-4 text-slate-400" />
                      <span>টিভি টোকেন ডিসপ্লে</span>
                    </Link>
                    <Link
                      href={`/doctor/assistant?doctorId=${doctor.id}`}
                      target="_blank"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span>সহকারী ডেস্ক</span>
                    </Link>
                    {doctor.slug && (
                      <Link
                        href={`/doctors/${doctor.slug}`}
                        target="_blank"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span>পাবলিক প্রোফাইল দেখুন</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগ আউট</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 💻 3. DESKTOP SUB-HEADER                                                  */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200/80 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              {navMenuItems.find(m => m.id === activeTab)?.label}
            </span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-medium">
              {doctor.hospital?.name || doctor.chamberAddress?.split(',')?.[0] || 'মেইন চেম্বার'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Telemedicine Online Toggle */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
              <span className={`w-2 h-2 rounded-full ${isTelemedicineOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>ভিডিও কনসালটেশন: {isTelemedicineOnline ? 'চালু' : 'বন্ধ'}</span>
              <button 
                onClick={() => setIsTelemedicineOnline(!isTelemedicineOnline)}
                className="text-[10px] font-bold text-sky-700 underline ml-1 cursor-pointer"
              >
                {isTelemedicineOnline ? 'বন্ধ করুন' : 'চালু করুন'}
              </button>
            </div>

            {/* Wallet Quick Button */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
              <span className="text-slate-500 font-medium">ব্যালেন্স:</span>
              <span className="font-bold text-slate-900">৳ {doctor.walletBalance?.toLocaleString()}</span>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="ml-1 text-sky-700 font-bold hover:underline cursor-pointer"
              >
                + রিচার্জ
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📋 4. WORKSPACE CONTENT AREA                                              */}
        {/* ========================================================================= */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6 pb-28 lg:pb-10">
          
          {/* TAB 1: APPOINTMENTS & PATIENTS QUEUE */}
          {activeTab === 'appointments' && (
            <DoctorLiveQueueManager
              doctorId={doctor.id}
              doctorName={doctor.name}
              doctorInfo={doctor}
              schedules={doctor.schedules}
              onStatsUpdate={fetchDoctorData}
            />
          )}

          {/* TAB 2: CHAMBERS & VISITING SCHEDULE */}
          {activeTab === 'chambers' && (() => {
            const groupedChambers: Record<string, {
              name: string;
              address: string;
              division: string;
              district: string;
              isTelemedicine: boolean;
              shifts: Array<{
                startTime: string;
                endTime: string;
                consultationFee: number;
                days: number[];
              }>;
            }> = {};

            if (doctor.schedules && doctor.schedules.length > 0) {
              doctor.schedules.forEach((sch: any) => {
                const name = sch.chamberName || doctor.hospital?.name || 'প্রধান চেম্বার';
                if (!groupedChambers[name]) {
                  groupedChambers[name] = {
                    name,
                    address: sch.chamberAddress || doctor.chamberAddress || 'ঠিকানা নির্ধারিত নেই',
                    division: sch.division || 'খুলনা',
                    district: sch.district || 'চুয়াডাঙ্গা',
                    isTelemedicine: sch.isTelemedicine || false,
                    shifts: [],
                  };
                }

                let shift = groupedChambers[name].shifts.find(
                  (s) => s.startTime === sch.startTime && s.endTime === sch.endTime && s.consultationFee === (sch.consultationFee || 500)
                );
                if (!shift) {
                  shift = {
                    startTime: sch.startTime,
                    endTime: sch.endTime,
                    consultationFee: sch.consultationFee || 500,
                    days: [],
                  };
                  groupedChambers[name].shifts.push(shift);
                }
                if (!shift.days.includes(sch.dayOfWeek)) {
                  shift.days.push(sch.dayOfWeek);
                }
              });
            }

            const chamberList = Object.values(groupedChambers);

            return (
              <div className="space-y-5">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">চেম্বার ও রোগী দেখার সময়সূচি</h3>
                    <p className="text-xs text-slate-500 font-medium">আপনার সকল চেম্বারের তালিকা এবং নিয়মিত রোগী দেখার সময়।</p>
                  </div>

                  <button
                    onClick={() => setShowAddChamberModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন চেম্বার যোগ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chamberList.length > 0 ? (
                    chamberList.map((chamber, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{chamber.name}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 pt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{chamber.address}</span>
                                <span className="font-semibold text-slate-700">({chamber.district})</span>
                              </p>
                            </div>

                            <button
                              onClick={() => handleDeleteEntireChamber(chamber.name)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                              title="চেম্বার মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-2 pt-1 border-t border-slate-100">
                            {chamber.shifts.map((shift, sIdx) => (
                              <div key={sIdx} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium">
                                  <span className="text-slate-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{shift.startTime} - {shift.endTime}</span>
                                  </span>
                                  <span className="font-bold text-slate-900">ভিজিট ফি: ৳ {shift.consultationFee}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {BD_WEEK_DAYS.map((d) => {
                                    const isActive = shift.days.includes(d.day);
                                    return (
                                      <span
                                        key={d.day}
                                        className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                          isActive ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-400 line-through'
                                        }`}
                                      >
                                        {d.short}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>সিরিয়াল বুকিং সক্রিয়</span>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 space-y-1">
                      <p className="text-xs font-semibold">কোনো চেম্বার শিডিউল যোগ করা হয়নি</p>
                      <p className="text-[11px]">উপরের বাটন থেকে আপনার চেম্বার ও সময়সূচি যুক্ত করুন।</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {/* TAB 3: TELEMEDICINE CONSOLE */}
          {activeTab === 'telemedicine' && (
            <div className="space-y-5">
              {/* Telemedicine Status & Settings Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">টেলিমেডিসিন ভার্চুয়াল চেম্বার</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                        isTelemedicineOnline ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isTelemedicineOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{isTelemedicineOnline ? 'অনলাইন চালু' : 'অফলাইন বন্ধ'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">সারা দেশের রোগীদের সাথে সরাসরি ব্রাউজারে এইচডি ভিডিও কলে পরামর্শ দিন।</p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      const nextState = !isTelemedicineOnline;
                      setIsTelemedicineOnline(nextState);
                      try {
                        await fetch('/api/doctor/profile', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isTelemedicineAvailable: nextState }),
                        });
                        showToast('success', nextState ? 'অনলাইন চেম্বার সফলভাবে চালু করা হয়েছে' : 'অনলাইন চেম্বার সাময়িকভাবে বন্ধ করা হয়েছে');
                      } catch (err) {
                        showToast('error', 'স্ট্যাটাস আপডেট করা যায়নি');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                      isTelemedicineOnline 
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isTelemedicineOnline ? 'bg-rose-500' : 'bg-white'}`} />
                    <span>{isTelemedicineOnline ? 'অনলাইন চেম্বার বন্ধ করুন' : 'অনলাইন চেম্বার চালু করুন'}</span>
                  </button>
                </div>

                {/* Consultation Fee & Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">ভিডিও কনসালটেশন ফি</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">৳ {doctor.telemedicineFee || 500}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          const newFee = prompt('নতুন টেলিমেডিসিন ভিজিট ফি (টাকায়) লিখুন:', String(doctor.telemedicineFee || 500));
                          if (newFee && !isNaN(Number(newFee))) {
                            try {
                              await fetch('/api/doctor/profile', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ telemedicineFee: parseInt(newFee, 10) }),
                              });
                              showToast('success', 'ভিজিট ফি আপডেট হয়েছে');
                              fetchDoctorData();
                            } catch (e) {
                              showToast('error', 'ফি আপডেট করা যায়নি');
                            }
                          }
                        }}
                        className="text-[11px] text-sky-700 font-bold hover:underline cursor-pointer"
                      >
                        পরিবর্তন
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">অনলাইন কনসালটেশন সম্পন্ন</span>
                    <p className="text-lg font-black text-emerald-700">
                      {doctor.appointments?.filter((a: any) => a.status === 'COMPLETED' && a.isTelemedicine).length || 14} জন
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">টেলিমেডিসিন আয়</span>
                    <p className="text-lg font-black text-sky-800">
                      ৳ {((doctor.appointments?.filter((a: any) => a.status === 'COMPLETED' && a.isTelemedicine).length || 14) * (doctor.telemedicineFee || 500)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Telemedicine Appointments Queue */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                    <h4 className="text-sm font-bold text-slate-900">ভিডিও কনসালটেশন বুকিং তালিকা</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    মোট: {doctor.appointments?.length || 0} জন
                  </span>
                </div>

                <div className="space-y-3">
                  {(doctor.appointments || []).length > 0 ? (
                    (doctor.appointments || []).slice(0, 10).map((apt: any) => (
                      <div key={apt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                            <span className="text-slate-400 font-medium">({apt.patientAge || 25}y, {apt.patientGender || 'পুরুষ'})</span>
                            <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-mono font-bold">
                              {apt.appointmentCode || 'TELE-ACTIVE'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {apt.patientPhone}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {apt.appointmentDate}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {apt.timeSlot || 'সন্ধ্যা ৭:০০'}</span>
                          </p>
                          {apt.visitReason && (
                            <p className="text-slate-700 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                              সমস্যা: {apt.visitReason}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                          {/* Join Video Call */}
                          <Link
                            href={`/telemedicine/room/${apt.appointmentCode || apt.id}`}
                            target="_blank"
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>ভিডিও কল শুরু</span>
                          </Link>

                          {/* Prescribe */}
                          <Link
                            href={`/doctor/prescription?appointmentId=${apt.appointmentCode || apt.id}&patientName=${encodeURIComponent(apt.patientName || '')}&patientPhone=${encodeURIComponent(apt.patientPhone || '')}&patientAge=${apt.patientAge || ''}&patientGender=${encodeURIComponent(apt.patientGender || '')}&doctorId=${doctor.id}`}
                            target="_blank"
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            <span>প্রেসক্রিপশন দিন</span>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <Video className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">বর্তমানে কোনো রোগী ভিডিও কনসালটেশনের জন্য অপেক্ষারত নেই।</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EARNINGS & WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">মোট উত্তোলনযোগ্য ব্যালেন্স</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-0.5">৳ {doctor.walletBalance?.toLocaleString()} BDT</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold cursor-pointer"
                  >
                    রিচার্জ
                  </button>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer border border-slate-200"
                  >
                    উইথড্রল আবেদন
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">সাম্প্রতিক লেনদেনের বিবরণী</h4>
                {doctor.walletTransactions && doctor.walletTransactions.length > 0 ? (
                  <div className="divide-y divide-slate-100 text-xs">
                    {doctor.walletTransactions.map((tx: any) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{tx.notes || tx.method}</p>
                          <p className="text-[11px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString('bn-BD')} • {tx.type}</p>
                        </div>
                        <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {tx.type === 'CREDIT' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center font-medium">কোনো লেনদেনের রেকর্ড নেই।</p>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 👑 TAB 5: MEMBERSHIP PLANS (EXECUTIVE ENTERPRISE PRICING GRID)    */}
          {/* ================================================================= */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">প্ল্যাটফর্ম মেম্বারশিপ ও বিশেষজ্ঞ ভেরিফিকেশন</h3>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    ভেরিফাইড টিক ব্যাজ, আনলিমিটেড পেশেন্ট সিরিয়াল ও দেশব্যাপী অনলাইন কনসালটেশনের জন্য মেয়াদ নির্বাচন করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs text-slate-500 font-medium">ব্যালেন্স:</span>
                  <span className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    ৳ {doctor.walletBalance?.toLocaleString()} BDT
                  </span>
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                  >
                    + রিচার্জ
                  </button>
                </div>
              </div>

              {/* Current Active Plan Status Banner */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isVerified 
                  ? 'bg-sky-50/70 border-sky-200 text-sky-950' 
                  : 'bg-slate-100/70 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isVerified ? 'bg-sky-700 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isVerified ? <OfficialVerifiedBadge className="w-7 h-7" /> : <Shield className="w-6 h-6" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {isVerified ? `আপনার বর্তমান মেম্বারশিপ: ${activePackage?.name || 'ভেরিফাইড স্পেশালিস্ট'}` : 'বর্তমান স্ট্যাটাস: ফ্রি ট্রায়াল অ্যাকাউন্ট'}
                      </span>
                      {isVerified && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>সক্রিয়</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      {isVerified 
                        ? `মেয়াদ শেষ হবে: ${new Date(doctor.subscriptionExpiresAt).toLocaleDateString('bn-BD')} (বাকি ${remainingDays} দিন)` 
                        : 'ভেরিফাইড টিক ব্যাজ ও আনলিমিটেড রোগী পেতে নিচের যেকোনো একটি প্ল্যান বেছে নিন।'}
                    </p>
                  </div>
                </div>

                {isVerified && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 block">স্ট্যাটাস</span>
                    <span className="text-xs font-bold text-sky-800">ভেরিফাইড বিশেষজ্ঞ ✓</span>
                  </div>
                )}
              </div>

              {/* 4-Column Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DURATION_PACKAGES.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  const isPopular = pkg.popular;
                  const isBestValue = pkg.bestValue;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`relative bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between p-5 space-y-4 hover:shadow-md ${
                        isSelected
                          ? 'border-sky-700 ring-2 ring-sky-700/20 shadow-xs'
                          : isPopular
                          ? 'border-sky-400/80 shadow-2xs'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 min-h-[22px]">
                        {pkg.tag ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPopular 
                              ? 'bg-sky-100 text-sky-800 font-black' 
                              : isBestValue 
                              ? 'bg-emerald-100 text-emerald-800 font-black' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {pkg.tag}
                          </span>
                        ) : <span />}

                        {pkg.savings && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.2 rounded-md">
                            {pkg.savings}
                          </span>
                        )}
                      </div>

                      {/* Header & Price */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                          <span className="text-xs font-semibold text-slate-500 font-mono">({pkg.durationBn})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight min-h-[30px]">{pkg.desc}</p>

                        <div className="pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-slate-900">৳ {pkg.price}</span>
                            {pkg.originalPrice > pkg.price && (
                              <span className="text-xs text-slate-400 line-through">৳ {pkg.originalPrice}</span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-sky-800 block mt-0.5">
                            {pkg.perMonthText}
                          </span>
                        </div>
                      </div>

                      {/* Feature Checklist */}
                      <div className="pt-3 border-t border-slate-100 space-y-2 flex-1">
                        <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">প্ল্যান সুবিধাসমূহ:</p>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {pkg.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-[11.5px] leading-snug">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button on Each Card */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPkgId(pkg.id);
                            handleSubscribeMembership(pkg.id);
                          }}
                          disabled={purchaseLoading === pkg.id}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 ${
                            isSelected || isPopular
                              ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {purchaseLoading === pkg.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span>সক্রিয় করুন — ৳{pkg.price}</span>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Platform Core Benefits Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  মেম্বারশিপের সাথে প্ল্যাটফর্মে যা যা পাচ্ছেন:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center font-bold">
                      <OfficialVerifiedBadge className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-slate-900">ভেরিফাইড স্পেশালিস্ট ব্যাজ</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">রোগীদের কাছে আপনার প্রোফাইল বিশ্বস্ত ও অফিশিয়াল বিশেষজ্ঞ হিসেবে চিহ্নিত হবে।</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-slate-900">আনলিমিটেড পেশেন্ট সিরিয়াল</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">চেম্বারের যত খুশি রোগী সরাসরি অনলাইনে সিরিয়াল বুকিং নিতে পারবে।</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-slate-900">অটোমেটেড SMS নোটিফিকেশন</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">সিরিয়াল বুকিংয়ের সাথে সাথে রোগীর মোবাইলে কনফার্মেশন কোড পাঠানো হবে।</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-slate-900">সার্চে অগ্রাধিকার</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">আপনার জেলা ও স্পেশালাইজেশন সার্চে সাধারণ তালিকার সবার উপরে প্রদর্শিত হবেন।</p>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Questions (FAQ) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  সাধারণ প্রশ্ন ও উত্তর (FAQ)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-900">পেমেন্ট কীভাবে সম্পন্ন করব?</p>
                    <p className="text-[11.5px] text-slate-600">আপনার ওয়ালেটে bKash বা Nagad দিয়ে ব্যালেন্স রিচার্জ করে ১-ক্লিকেই যেকোনো প্ল্যান সক্রিয় করতে পারবেন।</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 space-y-1">
                    <p className="font-bold text-slate-900">একাধিক চেম্বারের জন্য কি আলাদা ফি লাগবে?</p>
                    <p className="text-[11.5px] text-slate-600">না, একটি মেম্বারশিপ প্ল্যানেই আপনার সকল চেম্বার, হাসপাতাল ও অনলাইন ভিডিও শিডিউল অন্তর্ভুক্ত থাকবে।</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: PATIENT OUTREACH & PROMOTION */}
          {activeTab === 'boost' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">রোগী বৃদ্ধি ও সামাজিক যোগাযোগ মাধ্যমে প্রচার</h3>
                <p className="text-xs text-slate-500">ফেসবুকে আপনার চেম্বার বা অনলাইন কনসালটেশন প্রচার করে সরাসরি সিরিয়াল বৃদ্ধি করুন।</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BOOST_OPTIONS.map((opt) => {
                  const isSelected = selectedBoostId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedBoostId(opt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected ? 'border-sky-700 bg-sky-50/50 shadow-2xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {opt.badge}
                          </span>
                          <div className={`w-3.5 h-3.5 rounded-full border ${isSelected ? 'border-sky-700 bg-sky-700' : 'border-slate-300'}`} />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{opt.title}</h4>
                          <p className="text-lg font-bold text-slate-900 mt-0.5">৳ {opt.price}</p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 font-medium">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span>এলাকা: {opt.target}</span></p>
                          <p className="flex items-center gap-1.5 text-emerald-700 font-semibold"><Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span>আনুমানিক প্রচার: {opt.reach}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleTriggerBoost}
                disabled={purchaseLoading === 'BOOST'}
                className="px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs cursor-pointer"
              >
                {purchaseLoading === 'BOOST' ? 'প্রচার সক্রিয় হচ্ছে...' : `প্রচার শুরু করুন — ${BOOST_OPTIONS.find(o => o.id === selectedBoostId)?.price} ৳`}
              </button>
            </div>
          )}

          {/* TAB 7: POSTER STUDIO */}
          {activeTab === 'banner' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">অফিসিয়াল চেম্বার ব্যানার ও ভিজিটিং কার্ড</h3>
                <p className="text-xs text-slate-500">প্রিন্ট ও সোশ্যাল মিডিয়ায় শেয়ারের জন্য এইচডি কোয়ালিটি নোটিশ।</p>
              </div>
              <div className="flex justify-center pt-2">
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

          {/* TAB 8: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900">প্রোফাইল ও ডিগ্রি তথ্য</h3>
                <p className="text-xs text-slate-500">রোগীদের জন্য সঠিক তথ্য ও ডিগ্রি আপডেট রাখুন।</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ডাক্তারের নাম</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">BMDC রেজিস্ট্রেশন নম্বর</label>
                    <input
                      type="text"
                      value={profileForm.bmdcNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, bmdcNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ডিগ্রি ও পদবী</label>
                    <input
                      type="text"
                      value={profileForm.degrees}
                      onChange={(e) => setProfileForm({ ...profileForm, degrees: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">স্পেশালাইজেশন</label>
                    <input
                      type="text"
                      value={profileForm.specialization}
                      onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">অভিজ্ঞতা (বছর)</label>
                    <input
                      type="number"
                      value={profileForm.experienceYears}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceYears: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">প্রোফাইল ছবির লিংক (Photo URL)</label>
                  <input
                    type="text"
                    value={profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">চিকিৎসা প্রদানকৃত রোগসমূহ</label>
                  <textarea
                    value={profileForm.treatedDiseases}
                    onChange={(e) => setProfileForm({ ...profileForm, treatedDiseases: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs cursor-pointer"
                >
                  {profileLoading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </form>
            </div>
          )}

        </main>

        {/* ========================================================================= */}
        {/* 📱 DOCTOR MOBILE BOTTOM BAR (Matches MobileBottomNav.tsx)                 */}
        {/* ========================================================================= */}
        <nav 
          aria-label="Doctor Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full select-none font-bengali mobile-bottom-bar"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-x border-slate-200/80 rounded-t-[32px] sm:rounded-t-[36px] px-3 pt-3 pb-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-around relative">
            
            {/* Tab 1: সিরিয়াল */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('appointments');
                setShowMobileNav(false);
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              {activeTab === 'appointments' ? (
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <Users className="w-[22px] h-[22px] stroke-[2.3] text-sky-600 transition-colors" />
                  <span className="text-[11px] font-black tracking-tight mt-1 text-sky-700">
                    সিরিয়াল
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                  <Users className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                  <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                    সিরিয়াল
                  </span>
                </div>
              )}
            </button>

            {/* Tab 2: প্রেসক্রিপশন */}
            <Link
              href={`/doctor/prescription?doctorId=${doctor.id}`}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                <FileText className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                  প্রেসক্রিপশন
                </span>
              </div>
            </Link>

            {/* Tab 3: চেম্বার */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('chambers');
                setShowMobileNav(false);
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              {activeTab === 'chambers' ? (
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <Building2 className="w-[22px] h-[22px] stroke-[2.3] text-sky-600 transition-colors" />
                  <span className="text-[11px] font-black tracking-tight mt-1 text-sky-700">
                    চেম্বার
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                  <Building2 className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                  <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                    চেম্বার
                  </span>
                </div>
              )}
            </button>

            {/* Tab 4: ওয়ালেট */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('wallet');
                setShowMobileNav(false);
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              {activeTab === 'wallet' ? (
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <Wallet className="w-[22px] h-[22px] stroke-[2.3] text-sky-600 transition-colors" />
                  <span className="text-[11px] font-black tracking-tight mt-1 text-sky-700">
                    ওয়ালেট
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                  <Wallet className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                  <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                    ওয়ালেট
                  </span>
                </div>
              )}
            </button>

            {/* Tab 5: অন্যান্য */}
            <button
              type="button"
              onClick={() => setShowMobileNav(true)}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              {['boost', 'packages', 'banner', 'profile', 'telemedicine'].includes(activeTab) || showMobileNav ? (
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <SlidersHorizontal className="w-[22px] h-[22px] stroke-[2.3] text-sky-600 transition-colors" />
                  <span className="text-[11px] font-black tracking-tight mt-1 text-sky-700">
                    অন্যান্য
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                  <SlidersHorizontal className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                  <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                    অন্যান্য
                  </span>
                </div>
              )}
            </button>

          </div>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 💳 RECHARGE MODAL                                                         */}
      {/* ========================================================================= */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">ব্যালেন্স রিচার্জ</h4>
              <button onClick={() => setShowRechargeModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleRechargeSubmit} className="space-y-2.5">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">পেমেন্ট মেথড</label>
                <div className="grid grid-cols-2 gap-2">
                  {['BKASH', 'NAGAD'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRechargeMethod(m as any)}
                      className={`py-1.5 rounded border font-semibold ${
                        rechargeMethod === m ? 'border-sky-700 bg-sky-50 text-sky-800' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m === 'BKASH' ? 'বিকাশ' : 'নগদ'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">টাকার পরিমাণ</label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">ট্রানজ্যাকশন আইডি (TrxID)</label>
                <input
                  type="text"
                  placeholder="যেমন: 9J2K1L90XP"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={rechargeLoading}
                className="w-full py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold cursor-pointer mt-1"
              >
                {rechargeLoading ? 'জমা হচ্ছে...' : 'রিচার্জ সাবমিট'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💸 WITHDRAW MODAL                                                         */}
      {/* ========================================================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full space-y-3 text-xs shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">টাকা উত্তোলন (Withdraw)</h4>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-2.5">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">মাধ্যম</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['BKASH', 'NAGAD', 'BANK'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWithdrawMethod(m as any)}
                      className={`py-1.5 rounded border font-semibold ${
                        withdrawMethod === m ? 'border-sky-700 bg-sky-50 text-sky-800' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">টাকার পরিমাণ (সর্বনিম্ন ৫০০ ৳)</label>
                <input
                  type="number"
                  min={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">{withdrawMethod} নম্বর / একাউন্ট</label>
                <input
                  type="text"
                  placeholder="যেমন: 017xxxxxxxx"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={withdrawLoading}
                className="w-full py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold cursor-pointer mt-1"
              >
                {withdrawLoading ? 'সাবমিট হচ্ছে...' : 'উইথড্রল রিকোয়েস্ট পাঠান'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏥 ADD CHAMBER MODAL                                                      */}
      {/* ========================================================================= */}
      {showAddChamberModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full space-y-3.5 text-xs shadow-xl my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">নতুন চেম্বার ও সময়সূচি</h4>
              <button onClick={() => setShowAddChamberModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddChamberSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">চেম্বারের নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: ইমপ্যাক্ট হাসপাতাল, চুয়াডাঙ্গা"
                  value={newChamber.chamberName}
                  onChange={(e) => setNewChamber({ ...newChamber, chamberName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">বিভাগ *</label>
                  <select
                    value={newChamber.division}
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      const defaultDist = BD_DIVISIONS_AND_DISTRICTS[newDiv]?.[0] || '';
                      setNewChamber({ ...newChamber, division: newDiv, district: defaultDist });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-semibold"
                  >
                    {Object.keys(BD_DIVISIONS_AND_DISTRICTS).map((divName) => (
                      <option key={divName} value={divName}>{divName} বিভাগ</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">জেলা *</label>
                  <select
                    value={newChamber.district}
                    onChange={(e) => setNewChamber({ ...newChamber, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-semibold"
                  >
                    {(BD_DIVISIONS_AND_DISTRICTS[newChamber.division] || []).map((distName) => (
                      <option key={distName} value={distName}>{distName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ঠিকানা ও রুম নং</label>
                  <input
                    type="text"
                    placeholder="যেমন: রুম ২০৩, হাসপাতাল রোড"
                    value={newChamber.chamberAddress}
                    onChange={(e) => setNewChamber({ ...newChamber, chamberAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">সিরিয়াল বুকিং ফোন</label>
                  <input
                    type="text"
                    placeholder="01718-xxxxxx"
                    value={newChamber.serialPhone}
                    onChange={(e) => setNewChamber({ ...newChamber, serialPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Shifts */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-800 block">রোগী দেখার দিন ও সময়সূচি</span>

                {newChamber.shifts.map((shift, sIdx) => (
                  <div key={shift.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-2">
                    <div className="grid grid-cols-7 gap-1">
                      {BD_WEEK_DAYS.map((d) => {
                        const isSelected = shift.daysOfWeek.includes(d.day);
                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => {
                              const updated = [...newChamber.shifts];
                              if (isSelected) {
                                if (shift.daysOfWeek.length > 1) {
                                  updated[sIdx].daysOfWeek = shift.daysOfWeek.filter((x) => x !== d.day);
                                }
                              } else {
                                updated[sIdx].daysOfWeek = [...shift.daysOfWeek, d.day];
                              }
                              setNewChamber({ ...newChamber, shifts: updated });
                            }}
                            className={`py-1 rounded text-[10px] font-semibold ${
                              isSelected ? 'bg-sky-700 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            {d.short}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">শুরুর সময়</label>
                        <input
                          type="text"
                          value={shift.startTime}
                          onChange={(e) => {
                            const updated = [...newChamber.shifts];
                            updated[sIdx].startTime = e.target.value;
                            setNewChamber({ ...newChamber, shifts: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-semibold text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">শেষের সময়</label>
                        <input
                          type="text"
                          value={shift.endTime}
                          onChange={(e) => {
                            const updated = [...newChamber.shifts];
                            updated[sIdx].endTime = e.target.value;
                            setNewChamber({ ...newChamber, shifts: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-semibold text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">ভিজিট ফি (৳)</label>
                        <input
                          type="number"
                          value={shift.consultationFee}
                          onChange={(e) => {
                            const updated = [...newChamber.shifts];
                            updated[sIdx].consultationFee = parseInt(e.target.value, 10) || 0;
                            setNewChamber({ ...newChamber, shifts: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={chamberSaving}
                className="w-full py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold cursor-pointer"
              >
                {chamberSaving ? 'সংরক্ষণ হচ্ছে...' : 'চেম্বার সংরক্ষণ করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
