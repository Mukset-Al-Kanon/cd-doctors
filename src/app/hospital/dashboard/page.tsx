'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Users,
  UserCheck,
  Clock,
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  Save,
  ExternalLink,
  Tv,
  Stethoscope,
  MapPin,
  Activity,
  FileText,
  ChevronRight,
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  Mail,
  Globe,
  DollarSign,
  Megaphone,
  Bed,
  Image as ImageIcon,
  Upload,
  Trash2,
  KeyRound,
  Lock,
  UserPlus,
  Shield,
  X
} from 'lucide-react';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

const DAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

const ALL_AVAILABLE_FACILITIES = [
  '24/7 Emergency & Trauma Center',
  'ICU Intensive Support',
  'CCU Cardiac Care Unit',
  'NICU Neonatal ICU',
  'Dialysis Unit',
  'Digital Radiology & MRI',
  'High-Resolution 4D USG',
  '24 Hours Pharmacy',
  'Dedicated Ambulance Service',
  'Central Oxygen Supply',
  'Modern Operation Theater (OT)',
  'Laparoscopic Surgery Unit',
  'Pathology & Diagnostic Lab',
  'Blood Bank & Transfusion',
  'Executive Cabin & General Ward',
  'Generator & Power Backup'
];

export default function HospitalDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHospitalId = searchParams.get('hospitalId') || '';

  const [hospitalsList, setHospitalsList] = useState<any[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(initialHospitalId);
  const [loading, setLoading] = useState<boolean>(true);
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalDoctors: 0,
    pendingRequestsCount: 0,
    todayAppointmentsCount: 0,
    facilitiesCount: 0,
  });

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'DOCTORS' | 'PROFILE' | 'BEDS' | 'TESTS' | 'STAFF'>('REQUESTS');
  const [pendingAffiliations, setPendingAffiliations] = useState<any[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<any[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Staff & Reception State
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    phone: '',
    role: 'CENTRAL_RECEPTIONIST' as 'CENTRAL_RECEPTIONIST' | 'DOCTOR_ASSISTANT',
    doctorId: '',
    password: '',
    notes: '',
  });
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const [staffActionId, setStaffActionId] = useState<string | null>(null);

  // Profile Edit State
  const [editForm, setEditForm] = useState<any>({
    name: '',
    hospitalType: 'Private Hospital',
    establishedYear: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    address: '',
    website: '',
    googleMapUrl: '',
    description: '',
    licenseNumber: '',
    logoUrl: '',
    coverUrl: '',
    visitingHours: '',
    noticeText: '',
    facilities: [] as string[],
    bedStats: {
      generalBedsTotal: 100,
      generalBedsAvailable: 25,
      icuTotal: 10,
      icuAvailable: 4,
      cabinTotal: 30,
      cabinAvailable: 8,
      oxygenStatus: '২৪/৭ সক্রিয় চালু',
    },
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Test Prices State
  const [testAvailabilities, setTestAvailabilities] = useState<any[]>([]);
  const [testsSaving, setTestsSaving] = useState(false);

  // Doctor search state
  const [doctorSearch, setDoctorSearch] = useState('');

  // Fetch dashboard data
  const loadDashboardData = async (hId?: string) => {
    setLoading(true);
    setFeedbackMessage(null);
    try {
      const targetId = hId || selectedHospitalId;
      const url = targetId ? `/api/hospital/dashboard?hospitalId=${targetId}` : '/api/hospital/dashboard';
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setHospitalData(data.hospital);
        setHospitalsList(data.hospitalsList || []);
        if (!selectedHospitalId && data.hospital?.id) {
          setSelectedHospitalId(data.hospital.id);
        }
        setStats(data.stats || {});
        setPendingAffiliations(data.pendingAffiliations || []);
        setApprovedDoctors(data.approvedDoctors || []);
        loadStaffData(targetId);

        let parsedBeds = {
          generalBedsTotal: 100,
          generalBedsAvailable: 25,
          icuTotal: 10,
          icuAvailable: 4,
          cabinTotal: 30,
          cabinAvailable: 8,
          oxygenStatus: '২৪/৭ সক্রিয় চালু',
        };
        try {
          if (data.hospital.bedStats) {
            parsedBeds = typeof data.hospital.bedStats === 'string'
              ? JSON.parse(data.hospital.bedStats)
              : data.hospital.bedStats;
          }
        } catch (e) {}

        // Populate edit form
        setEditForm({
          name: data.hospital.name || '',
          hospitalType: data.hospital.hospitalType || 'Private Hospital',
          establishedYear: data.hospital.establishedYear || '',
          phone: data.hospital.phone || '',
          emergencyPhone: data.hospital.emergencyPhone || '',
          email: data.hospital.email || '',
          address: data.hospital.address || '',
          website: data.hospital.website || '',
          googleMapUrl: data.hospital.googleMapUrl || '',
          description: data.hospital.description || '',
          licenseNumber: data.hospital.licenseNumber || '',
          logoUrl: data.hospital.logoUrl || '',
          coverUrl: data.hospital.coverUrl || '',
          visitingHours: data.hospital.visitingHours || '',
          noticeText: data.hospital.noticeText || '',
          facilities: data.hospital.facilities?.map((f: any) => f.facilityName) || [],
          bedStats: parsedBeds,
        });

        setTestAvailabilities(data.hospital.testAvailabilities || []);
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'ডাটা লোড করতে ব্যর্থ হয়েছে।' });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: 'সার্ভারে সংযোগ স্থাপন সম্ভব হয়নি।' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedHospitalId]);

  // Switch hospital
  const handleHospitalChange = (newId: string) => {
    setSelectedHospitalId(newId);
    router.push(`/hospital/dashboard?hospitalId=${newId}`);
  };

  // Handle Approve / Reject Affiliation
  const handleAffiliationAction = async (scheduleId: string, action: 'APPROVE' | 'REJECT', assignedRoom?: string) => {
    setActionLoadingId(scheduleId);
    setFeedbackMessage(null);
    try {
      const res = await fetch('/api/hospital/affiliations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId,
          action,
          roomNumber: assignedRoom || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: data.message });
        loadDashboardData(selectedHospitalId);
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'অ্যাকশন সম্পন্ন করা যায়নি।' });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: 'নেটওয়ার্ক এরর।' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Save Hospital Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch('/api/hospital/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospitalId,
          ...editForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: 'হাসপাতালের সকল তথ্য ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে! পাবলিক পেজে আপডেট লাইভ হয়েছে।' });
        loadDashboardData(selectedHospitalId);
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'সংরক্ষণ ব্যর্থ হয়েছে।' });
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'নেটওয়ার্ক এরর।' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Toggle Facility Checkbox
  const toggleFacility = (facilityName: string) => {
    const exists = editForm.facilities.includes(facilityName);
    if (exists) {
      setEditForm({ ...editForm, facilities: editForm.facilities.filter((f: string) => f !== facilityName) });
    } else {
      setEditForm({ ...editForm, facilities: [...editForm.facilities, facilityName] });
    }
  };

  // Handle File Upload from device (Logo or Cover Banner)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = field === 'logoUrl' ? 400 : 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditForm((prev: any) => ({ ...prev, [field]: dataUrl }));
        } else {
          setEditForm((prev: any) => ({ ...prev, [field]: event.target?.result as string }));
        }
      };
      img.onerror = () => {
        setEditForm((prev: any) => ({ ...prev, [field]: event.target?.result as string }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save Diagnostic Test Prices
  const handleSaveTests = async () => {
    setTestsSaving(true);
    setFeedbackMessage(null);
    try {
      const testPricesPayload = testAvailabilities.map((ta: any) => ({
        testId: ta.testId,
        price: ta.price,
        availabilityStatus: ta.availabilityStatus,
      }));

      const res = await fetch('/api/hospital/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospitalId,
          testPrices: testPricesPayload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: 'ডায়াগনস্টিক টেস্টের মূল্যতালিকা সফলভাবে হালনাগাদ করা হয়েছে।' });
        loadDashboardData(selectedHospitalId);
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'সংরক্ষণ ব্যর্থ হয়েছে।' });
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'নেটওয়ার্ক এরর।' });
    } finally {
      setTestsSaving(false);
    }
  };

  // Fetch Staff Data
  const loadStaffData = async (hId?: string) => {
    const targetId = hId || selectedHospitalId;
    if (!targetId) return;
    setStaffLoading(true);
    try {
      const res = await fetch(`/api/hospital/staff?hospitalId=${targetId}`);
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      }
    } catch (e) {
      console.error('Error fetching staff:', e);
    } finally {
      setStaffLoading(false);
    }
  };

  // Add Staff Account
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.phone || !staffForm.password) {
      alert('নাম, মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    if (staffForm.role === 'DOCTOR_ASSISTANT' && !staffForm.doctorId) {
      alert('অনুগ্রহ করে একজন ডাক্তার নির্বাচন করুন।');
      return;
    }
    setStaffSubmitting(true);
    try {
      const res = await fetch('/api/hospital/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospitalId,
          ...staffForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `স্টাফ একাউন্ট "${staffForm.name}" সফলভাবে তৈরি হয়েছে!` });
        setShowAddStaffModal(false);
        setStaffForm({
          name: '',
          phone: '',
          role: 'CENTRAL_RECEPTIONIST',
          doctorId: '',
          password: '',
          notes: '',
        });
        loadStaffData(selectedHospitalId);
      } else {
        alert(data.error || 'স্টাফ তৈরি করা যায়নি।');
      }
    } catch (err) {
      alert('নেটওয়ার্ক এরর।');
    } finally {
      setStaffSubmitting(false);
    }
  };

  // Toggle Staff Active / Inactive Status
  const handleToggleStaffStatus = async (staffId: string, currentStatus: boolean) => {
    setStaffActionId(staffId);
    try {
      const res = await fetch('/api/hospital/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          isActive: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({
          type: 'success',
          text: !currentStatus ? 'স্টাফ অ্যাকাউন্ট সক্রিয় করা হয়েছে।' : 'স্টাফ অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।',
        });
        loadStaffData(selectedHospitalId);
      } else {
        alert(data.error || 'আপডেট ব্যর্থ হয়েছে।');
      }
    } catch (e) {
      alert('নেটওয়ার্ক এরর।');
    } finally {
      setStaffActionId(null);
    }
  };

  // Reset Staff Password
  const handleResetStaffPassword = async (staffId: string, staffName: string) => {
    const newPass = window.prompt(`"${staffName}"-এর জন্য নতুন পাসওয়ার্ড দিন:`);
    if (!newPass || !newPass.trim()) return;
    setStaffActionId(staffId);
    try {
      const res = await fetch('/api/hospital/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          password: newPass.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${staffName}"-এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।`);
      } else {
        alert(data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
      }
    } catch (e) {
      alert('নেটওয়ার্ক এরর।');
    } finally {
      setStaffActionId(null);
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${staffName}"-এর অ্যাকাউন্ট মুছে ফেলতে চান?`)) return;
    setStaffActionId(staffId);
    try {
      const res = await fetch(`/api/hospital/staff?staffId=${staffId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `স্টাফ অ্যাকাউন্ট মুছে ফেলা হয়েছে।` });
        loadStaffData(selectedHospitalId);
      } else {
        alert(data.error || 'মুছে ফেলা যায়নি।');
      }
    } catch (e) {
      alert('নেটওয়ার্ক এরর।');
    } finally {
      setStaffActionId(null);
    }
  };

  // Filter approved doctors by search
  const filteredApprovedDoctors = approvedDoctors.filter((doc) => {
    if (!doctorSearch) return true;
    const term = doctorSearch.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(term) ||
      doc.specialization?.toLowerCase().includes(term) ||
      doc.bmdcNumber?.toLowerCase().includes(term) ||
      doc.chamberRoom?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 font-bengali pb-8">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left: Hospital Name & Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0 border border-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase tracking-wider">
                  ম্যানেজমেন্ট প্যানেল
                </span>
                {hospitalData?.status === 'ACTIVE' && (
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                    <OfficialVerifiedBadge className="w-3.5 h-3.5 inline" /> ভেরিফাইড হাসপাতাল
                  </span>
                )}
              </div>
              <div className="relative mt-1">
                <select
                  value={selectedHospitalId}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  className="font-black text-slate-900 text-base sm:text-lg bg-transparent border-0 p-0 pr-6 focus:ring-0 cursor-pointer truncate max-w-[280px] sm:max-w-md"
                >
                  {hospitalsList.map((h) => (
                    <option key={h.id} value={h.id} className="text-slate-900 font-bold">
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Link
              href={`/hospital/reception?hospitalId=${selectedHospitalId}`}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>সেন্ট্রাল রিসেপশন ডেস্ক</span>
            </Link>

            <Link
              href={`/hospital/tv-display?hospitalId=${selectedHospitalId}`}
              target="_blank"
              className="py-2 px-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 font-black text-xs transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <Tv className="w-3.5 h-3.5 text-sky-600" />
              <span>লাইভ টিভি কিউ</span>
            </Link>

            {hospitalData?.slug && (
              <Link
                href={`/hospitals/${hospitalData.slug}`}
                target="_blank"
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
                title="পাবলিক পেজে সরাসরি দেখুন"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>পাবলিক ওয়েবসাইট পেজ</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm font-bold shadow-xs animate-fadeIn ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{feedbackMessage.text}</div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Stat 1: Pending Affiliation Requests */}
          <div
            onClick={() => setActiveTab('REQUESTS')}
            className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer ${
              pendingAffiliations.length > 0
                ? 'bg-amber-500/10 border-amber-300 shadow-md ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">চেম্বারের নতুন রিকুয়েস্ট</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  pendingAffiliations.length > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.pendingRequestsCount || 0}
              </span>
              <span className="text-[11px] font-bold text-amber-700">
                {pendingAffiliations.length > 0 ? 'অনুমোদনের অপেক্ষায়' : 'সব ক্লিয়ার'}
              </span>
            </div>
          </div>

          {/* Stat 2: Total Active Doctors */}
          <div
            onClick={() => setActiveTab('DOCTORS')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">অনুমোদিত কর্মরত ডাক্তার</span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.totalDoctors || approvedDoctors.length || 0}
              </span>
              <span className="text-[11px] font-bold text-sky-700">সক্রিয় প্র্যাকটিস</span>
            </div>
          </div>

          {/* Stat 3: Today's Appointments */}
          <Link
            href={`/hospital/reception?hospitalId=${selectedHospitalId}`}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">আজকের মোট অ্যাপয়েন্টমেন্ট</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.todayAppointmentsCount || 0}
              </span>
              <span className="text-[11px] font-bold text-indigo-700">রিসেপশন কিউ</span>
            </div>
          </Link>

          {/* Stat 4: Facilities Count */}
          <div
            onClick={() => setActiveTab('PROFILE')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">চিকিৎসা সুবিধা ও আইসিইউ</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.facilitiesCount || editForm.facilities.length || 0}
              </span>
              <span className="text-[11px] font-bold text-emerald-700">অ্যাক্টিভ সেবা</span>
            </div>
          </div>

        </section>

        {/* Tab Navigation */}
        <section className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          
          <button
            type="button"
            onClick={() => setActiveTab('REQUESTS')}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'REQUESTS'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>ডাক্তার চেম্বার রিকুয়েস্ট</span>
            {pendingAffiliations.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {pendingAffiliations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DOCTORS')}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'DOCTORS'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>কর্মরত ডাক্তার তালিকা ({approvedDoctors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'PROFILE'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>ওয়েবসাইট কাস্টমাইজেশন ও তথ্য</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BEDS')}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'BEDS'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>লাইভ বেড ও আইসিইউ ট্র্যাকার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TESTS')}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'TESTS'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>ডায়াগনস্টিক টেস্টের মূল্য</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('STAFF');
              loadStaffData();
            }}
            className={`py-3 px-4 font-black text-xs sm:text-sm rounded-t-2xl transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'STAFF'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>রিসেপশন ও স্টাফ ({staffList.length})</span>
          </button>

        </section>

        {/* Tab 1: PENDING DOCTOR AFFILIATION REQUESTS */}
        {activeTab === 'REQUESTS' && (
          <div className="space-y-4">
            
            {/* Header / Notice */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-nuvicaNavy-950">
                  নতুন চেম্বার অনুমোদন প্রোটোকল
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  যেসব ডাক্তার আপনার হাসপাতালে চেম্বার নেওয়ার জন্য রিকুয়েস্ট পাঠিয়েছেন। অনুমোদন করার পরেই কেবল তাদের চেম্বার পাবলিক পেজে ও বুকিং তালিকায় দৃশ্যমান হবে।
                </p>
              </div>
              <button
                onClick={() => loadDashboardData(selectedHospitalId)}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {/* List of Pending Affiliations */}
            {pendingAffiliations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  বর্তমানে কোনো নতুন চেম্বার রিকুয়েস্ট পেন্ডিং নেই!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  নতুন কোনো ডাক্তার আপনার হাসপাতালে চেম্বার অ্যাড করার আবেদন করলে তা সরাসরি এখানে প্রদর্শিত হবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingAffiliations.map((req) => {
                  const doc = req.doctor;
                  const dayName = DAYS_BN[req.dayOfWeek] || 'নির্ধারিত বার';

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md space-y-4"
                    >
                      {/* Doctor Info Row */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={doc?.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                            alt={doc?.name || 'Doctor'}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950">
                                {doc?.name}
                              </h3>
                              <OfficialVerifiedBadge className="w-4 h-4" />
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                                অনুমোদন প্রয়োজন
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold">{doc?.degrees}</p>
                            <p className="text-xs font-black text-sky-700">{doc?.specialization}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                BMDC: <b className="text-slate-800">{doc?.bmdcNumber || 'N/A'}</b>
                              </span>
                              {doc?.phone && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" /> {doc.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Proposed Shift & Consultation Fee */}
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-right sm:min-w-[200px] space-y-1 self-stretch sm:self-auto flex flex-col justify-center">
                          <span className="text-[11px] font-bold text-slate-400">প্রস্তাবিত চেম্বার সময়সূচি</span>
                          <div className="text-sm font-black text-slate-800 flex items-center justify-end gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sky-600" />
                            <span>{dayName}</span>
                          </div>
                          <div className="text-xs font-bold text-sky-700 flex items-center justify-end gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{req.startTime} - {req.endTime}</span>
                          </div>
                          <div className="pt-1 text-xs font-black text-emerald-700">
                            ফি: ৳{req.consultationFee || doc?.consultationFee || 'নির্ধারিত নয়'}
                          </div>
                        </div>
                      </div>

                      {/* Request Details & Notes */}
                      <div className="bg-amber-50/60 rounded-2xl p-3.5 border border-amber-100 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold">প্রস্তাবিত চেম্বার রুম: </span>
                          <span className="font-black bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-950">
                            {req.roomNumber || 'রুম নির্ধারিত হয়নি'}
                          </span>
                          {req.requestNote && (
                            <span className="ml-2 text-slate-600 italic">"{req.requestNote}"</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          আবেদনের তারিখ: {new Date(req.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>

                      {/* Decision Action Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleAffiliationAction(req.id, 'REJECT')}
                          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200/80 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>আবেদন বাতিল করুন</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoadingId === req.id}
                          onClick={() => handleAffiliationAction(req.id, 'APPROVE', req.roomNumber || 'রুম নির্ধারিত')}
                          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>অনুমোদন দিন ও প্রোফাইলে যুক্ত করুন</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: APPROVED / ACTIVE DOCTORS */}
        {activeTab === 'DOCTORS' && (
          <div className="space-y-4">
            
            {/* Top Bar with Search */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-nuvicaNavy-950">
                  হাসপাতালে সক্রিয় ডাক্তারদের তালিকা ({approvedDoctors.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  এই ডাক্তারগণ অনুমোদিত এবং বর্তমানে আপনার হাসপাতালে নিয়মিত রোগী দেখছেন।
                </p>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ডাক্তার বা স্পেশালিটি সার্চ..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Doctors Grid */}
            {filteredApprovedDoctors.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 text-xs font-bold">
                কোনো ডাক্তার পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApprovedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm text-nuvicaNavy-950 truncate">
                            {doc.name}
                          </h4>
                          <OfficialVerifiedBadge className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{doc.degrees}</p>
                        <p className="text-xs font-black text-sky-700 truncate">{doc.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {doc.chamberRoom || 'চেম্বার রুম'}
                          </span>
                          <span className="text-[10.5px] font-black text-emerald-700">
                            ফি: ৳{doc.consultationFee || 800}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Shifts */}
                    {doc.schedules && doc.schedules.length > 0 && (
                      <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          সাপ্তাহিক বসার সময়সূচি
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {doc.schedules.map((sch: any) => (
                            <span
                              key={sch.id}
                              className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800"
                            >
                              {DAYS_BN[sch.dayOfWeek]}: {sch.startTime} - {sch.endTime}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <Link
                        href={`/hospital/reception?hospitalId=${selectedHospitalId}`}
                        className="font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>লাইভ কিউ দেখুন</span>
                      </Link>

                      <Link
                        href={`/doctors/${doc.slug || doc.id}`}
                        target="_blank"
                        className="font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                      >
                        <span>প্রোফাইল পেজ</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 3: WEBSITE CUSTOMIZATION & PROFILE */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Flash Notice Board Section */}
            <div className="bg-white rounded-3xl border border-amber-200/80 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950">
                    জরুরি নোটিশ বোর্ড ও ঘোষণা (Notice Board)
                  </h3>
                  <p className="text-xs text-slate-500">
                    এখানে লেখা নোটিশটি পাবলিক ওয়েবসাইটের সবার উপরে ফ্ল্যাশ ব্যানার হিসেবে প্রদর্শিত হবে।
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="যেমন: আগামী শুক্রবার ফ্রি ডায়াবেটিস ও চক্ষু ক্যাম্প অনুষ্ঠিত হবে। অথবা ২৪ ঘণ্টা ডেডিকেটেড অ্যাম্বুলেন্স সেবা চালু রয়েছে।"
                  value={editForm.noticeText}
                  onChange={(e) => setEditForm({ ...editForm, noticeText: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-amber-800/40 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-inner"
                />
                {editForm.noticeText && (
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, noticeText: '' })}
                    className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    ✕ নোটিশ মুছে ফেলুন
                  </button>
                )}
              </div>
            </div>

            {/* Hospital Identity & Branding Images */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-600" />
                  <span>হাসপাতালের ব্র্যান্ডিং, ছবি ও ভিজুয়াল</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  লোগো ও আকর্ষণীয় কভার ব্যানার আপনার হাসপাতালের ভার্চুয়াল ওয়েবসাইটকে আন্তর্জাতিক রূপ দেয়।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Logo Image Upload & Preview */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>হাসপাতাল লোগো (Logo Image)</span>
                    </label>
                    {editForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, logoUrl: '' })}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    )}
                  </div>

                  {/* Device Upload Button */}
                  <div>
                    <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-sky-50/60 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-xl cursor-pointer transition-all text-sky-800 text-xs font-extrabold shadow-2xs group">
                      <Upload className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                      <span>{editForm.logoUrl ? '📱 ডিভাইস থেকে নতুন লোগো সিলেক্ট করুন' : '📱 ডিভাইস থেকে লোগো ছবি সিলেক্ট করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      />
                    </label>
                  </div>

                  {/* Logo Preview */}
                  {editForm.logoUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xs bg-slate-100 shrink-0">
                        <img src={editForm.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">লোগো ছবি রেডি</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> সেভ করলে ওয়েবসাইটে দৃশ্যমান হবে
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-medium italic text-center py-1">
                      কোনো লোগো আপলোড করা নেই (ডিফল্ট আইকন দেখানো হবে)
                    </p>
                  )}

                  {/* URL Input (Alternative) */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">অথবা ওয়েব ইমেজ URL লিংক দিন:</label>
                    <input
                      type="url"
                      value={editForm.logoUrl}
                      onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... বা ইমেজ লিংক"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* 2. Cover Banner Upload & Preview */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span>কভার ব্যানার (Cover Banner)</span>
                    </label>
                    {editForm.coverUrl && (
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, coverUrl: '' })}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    )}
                  </div>

                  {/* Device Upload Button */}
                  <div>
                    <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-sky-50/60 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-xl cursor-pointer transition-all text-sky-800 text-xs font-extrabold shadow-2xs group">
                      <Upload className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                      <span>{editForm.coverUrl ? '📱 ডিভাইস থেকে নতুন কভার ব্যানার সিলেক্ট করুন' : '📱 ডিভাইস থেকে কভার ছবি সিলেক্ট করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'coverUrl')}
                      />
                    </label>
                  </div>

                  {/* Cover Preview */}
                  {editForm.coverUrl ? (
                    <div className="space-y-1.5">
                      <div className="h-24 sm:h-28 w-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-100">
                        <img src={editForm.coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> কভার প্রিভিউ সক্রিয়
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 font-medium italic text-center py-1">
                      কোনো কভার ব্যানার আপলোড করা নেই
                    </p>
                  )}

                  {/* URL Input (Alternative) */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">অথবা ওয়েব ব্যানার URL লিংক দিন:</label>
                    <input
                      type="url"
                      value={editForm.coverUrl}
                      onChange={(e) => setEditForm({ ...editForm, coverUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... বা ব্যানার লিংক"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Hospital Contact & Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>হাসপাতালের মৌলিক তথ্য ও জরুরি যোগাযোগ</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  রোগীরা যাতে জরুরি মুহূর্তে তাৎক্ষণিক যোগাযোগ করতে পারে সেজন্য সকল তথ্য নির্ভুল রাখুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">হাসপাতালের পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">হাসপাতালের ধরন / ট্যাগলাইন *</label>
                  <input
                    type="text"
                    required
                    value={editForm.hospitalType}
                    onChange={(e) => setEditForm({ ...editForm, hospitalType: e.target.value })}
                    placeholder="যেমন: Private Hospital, Super Specialty, Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">লাইসেন্স / রেজিস্ট্রেশন নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={editForm.licenseNumber}
                    onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">প্রতিষ্ঠার সাল (Established Year)</label>
                  <input
                    type="number"
                    value={editForm.establishedYear}
                    onChange={(e) => setEditForm({ ...editForm, establishedYear: e.target.value })}
                    placeholder="1998"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">রিসেপশন বা হেল্পলাইন নম্বর *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-700">২৪/৭ জরুরি ও অ্যাম্বুলেন্স নম্বর *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={editForm.emergencyPhone}
                      onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">অফিসিয়াল ইমেইল অ্যাড্রেস *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">ওয়েবসাইট URL (ঐচ্ছিক)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-amber-800">রোগী দেখার সময়সূচি (Visiting Hours)</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={editForm.visitingHours}
                      onChange={(e) => setEditForm({ ...editForm, visitingHours: e.target.value })}
                      placeholder="যেমন: সকাল ১১:০০ - দুপুর ১:০০ এবং বিকাল ৪:০০ - সন্ধ্যা ৭:০০"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">হাসপাতালের পূর্ণ ঠিকানা *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">গুগল ম্যাপ লোকেশন লিংক (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={editForm.googleMapUrl}
                    onChange={(e) => setEditForm({ ...editForm, googleMapUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">হাসপাতাল পরিচিতি ও বর্ণনা</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

              </div>
            </div>

            {/* Medical Facilities & Amenities Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>হাসপাতালের সুযোগ-সুবিধা ও বিভাগসমূহ ({editForm.facilities.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার হাসপাতালে যেসব সুবিধা ও সেবা সক্রিয় আছে সেগুলো সিলেক্ট করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                {ALL_AVAILABLE_FACILITIES.map((fac) => {
                  const isChecked = editForm.facilities.includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => toggleFacility(fac)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isChecked
                          ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-xs ring-1 ring-sky-400/30'
                          : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100/80'
                      }`}
                    >
                      <span className="truncate">{fac}</span>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-sky-600 text-white' : 'bg-slate-200 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-end gap-3 sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-lg">
              <button
                type="submit"
                disabled={profileSaving}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'সংরক্ষণ হচ্ছে...' : 'সব তথ্য ও সেটিংস সংরক্ষণ করুন'}</span>
              </button>
            </div>

          </form>
        )}

        {/* Tab 4: LIVE BED & ICU AVAILABILITY MANAGER */}
        {activeTab === 'BEDS' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                    <Bed className="w-5 h-5 text-sky-600" />
                    <span>লাইভ বেড, কেবিন ও আইসিইউ প্রাপ্যতা ট্র্যাকার</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    হাসপাতালে সিট খালি হলে বা পূর্ণ হলে সংখ্যাটি আপডেট করুন; রোগীরা সরাসরি ওয়েবসাইটে রিয়েল-টাইম তথ্য দেখতে পাবেন।
                  </p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* ICU Beds */}
                <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
                      আইসিইউ (ICU Beds)
                    </span>
                    <span className="text-[11px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      জরুরি ইউনিট
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">মোট ICU বেড</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.icuTotal || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, icuTotal: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm font-black text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-rose-700 block">বর্তমানে ফাঁকা</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.icuAvailable || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, icuAvailable: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm font-black text-rose-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* General Beds */}
                <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      জেনারেল ওয়ার্ড বেড
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      সাধারণ সিট
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">মোট সাধারণ বেড</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.generalBedsTotal || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, generalBedsTotal: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-sm font-black text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-emerald-700 block">বর্তমানে ফাঁকা</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.generalBedsAvailable || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, generalBedsAvailable: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-sm font-black text-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Private Cabins */}
                <div className="bg-sky-50/70 p-4 sm:p-5 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-900 uppercase tracking-wider">
                      প্রাইভেট কেবিন (Cabins)
                    </span>
                    <span className="text-[11px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                      ভিআইপি / নন-এসি
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block">মোট কেবিন</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.cabinTotal || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, cabinTotal: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sky-200 text-sm font-black text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-sky-700 block">বর্তমানে ফাঁকা</label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.bedStats?.cabinAvailable || 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          bedStats: { ...editForm.bedStats, cabinAvailable: parseInt(e.target.value, 10) || 0 }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sky-300 text-sm font-black text-sky-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Central Oxygen Status */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">সেন্ট্রাল অক্সিজেন সরবরাহ স্ট্যাটাস</label>
                  <select
                    value={editForm.bedStats?.oxygenStatus || '২৪/৭ সক্রিয় চালু'}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      bedStats: { ...editForm.bedStats, oxygenStatus: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="২৪/৭ সক্রিয় চালু">২৪/৭ সক্রিয় চালু (Full Flow Supply)</option>
                    <option value="স্ট্যান্ডবাই সাপোর্ট">স্ট্যান্ডবাই সাপোর্ট (Standby Support)</option>
                    <option value="জরুরি সিলিন্ডার সাপোর্ট">জরুরি সিলিন্ডার সাপোর্ট (Cylinder Only)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:to-sky-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'সংরক্ষণ হচ্ছে...' : 'বেড স্ট্যাটাস সেভ করুন'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 5: DIAGNOSTIC TEST PRICING */}
        {activeTab === 'TESTS' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>ডায়াগনস্টিক ও ল্যাব টেস্টের মূল্য তালিকা</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  রোগীরা সার্চ করে আপনার হাসপাতালের সঠিক মূল্য ও টেস্টের প্রাপ্যতা দেখতে পারবেন।
                </p>
              </div>

              <button
                type="button"
                disabled={testsSaving}
                onClick={handleSaveTests}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{testsSaving ? 'সংরক্ষণ হচ্ছে...' : 'মূল্যতালিকা সংরক্ষণ করুন'}</span>
              </button>
            </div>

            {/* Test Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">টেস্টের নাম</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">মূল্য (টাকা ৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {testAvailabilities.map((ta: any, idx: number) => (
                    <tr key={ta.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {ta.test?.name || 'ল্যাব টেস্ট'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10.5px]">
                          {ta.test?.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ta.availabilityStatus}
                          onChange={(e) => {
                            const updated = [...testAvailabilities];
                            updated[idx] = { ...updated[idx], availabilityStatus: e.target.value };
                            setTestAvailabilities(updated);
                          }}
                          className="py-1 px-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
                        >
                          <option value="AVAILABLE">পাওয়া যায় (Available)</option>
                          <option value="UNAVAILABLE">সাময়িক বন্ধ (Unavailable)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <input
                          type="number"
                          value={ta.price || ''}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : null;
                            const updated = [...testAvailabilities];
                            updated[idx] = { ...updated[idx], price: val };
                            setTestAvailabilities(updated);
                          }}
                          className="w-24 px-2.5 py-1.5 text-right font-black text-slate-900 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 6: STAFF & RECEPTION ACCOUNT MANAGEMENT */}
        {activeTab === 'STAFF' && (
          <div className="space-y-6">
            
            {/* Top Action Header */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-950 flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>রিসেপশন ও স্টাফ একাউন্ট ম্যানেজমেন্ট</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                    সেন্ট্রাল রিসেপশন ডেস্ক অথবা নির্দিষ্ট ডাক্তারের নিজস্ব সহকারীর জন্য আলাদা একাউন্ট তৈরি করুন। প্রতিটি কর্মী শুধুমাত্র তার নির্ধারিত দায়িত্ব ও কিউ স্ক্রিন দেখতে পারবেন।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/hospital/reception?hospitalId=${selectedHospitalId}`}
                    target="_blank"
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-sky-700" />
                    <span>সেন্ট্রাল রিসেপশন ডেস্ক</span>
                  </Link>

                  <Link
                    href={`/hospital/tv-display?hospitalId=${selectedHospitalId}`}
                    target="_blank"
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Tv className="w-4 h-4 text-amber-400" />
                    <span>টিভি স্ক্রিন</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(true)}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ নতুন স্টাফ যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">মোট নিয়োজিত স্টাফ</span>
                    <Users className="w-4 h-4 text-slate-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">{staffList.length}</p>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">হাসপাতালে সক্রিয় কর্মী</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800">সেন্ট্রাল রিসেপশনিস্ট</span>
                    <Building2 className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-2xl font-black text-sky-950 mt-1">
                    {staffList.filter((s) => s.role === 'CENTRAL_RECEPTIONIST').length}
                  </p>
                  <p className="text-[10.5px] text-sky-700 mt-0.5">সব ডাক্তারের সিরিয়াল এক্সেস</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-800">ডাক্তারের ব্যক্তিগত সহকারী</span>
                    <Stethoscope className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-purple-950 mt-1">
                    {staffList.filter((s) => s.role === 'DOCTOR_ASSISTANT').length}
                  </p>
                  <p className="text-[10.5px] text-purple-700 mt-0.5">নির্দিষ্ট চেম্বার কিউ এক্সেস</p>
                </div>
              </div>
            </div>

            {/* Staff Roster Grid */}
            {staffLoading ? (
              <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-200/80">
                স্টাফ তালিকা লোড হচ্ছে...
              </div>
            ) : staffList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-slate-800">কোনো স্টাফ একাউন্ট তৈরি করা হয়নি</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  রিসেপশনিস্ট বা ডাক্তারের সহকারীর জন্য এখনই একটি একাউন্ট তৈরি করুন। তারা মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে তাদের নিজস্ব কিউ স্ক্রিন পরিচালনা করতে পারবে।
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(true)}
                  className="mt-2 py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>প্রথম স্টাফ একাউন্ট তৈরি করুন</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffList.map((st: any) => {
                  const isCentral = st.role === 'CENTRAL_RECEPTIONIST';
                  const deskLink = isCentral
                    ? `/hospital/reception?hospitalId=${selectedHospitalId}`
                    : `/hospital/reception?hospitalId=${selectedHospitalId}&doctorId=${st.doctorId || ''}`;

                  return (
                    <div
                      key={st.id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div>
                        {/* Top: Role Badge & Active Status */}
                        <div className="flex items-center justify-between gap-2">
                          {isCentral ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-sky-600" />
                              <span>সেন্ট্রাল রিসেপশন</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 truncate max-w-[200px]">
                              <Stethoscope className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{st.doctor?.name || 'ডাক্তার সহকারী'}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            disabled={staffActionId === st.id}
                            onClick={() => handleToggleStaffStatus(st.id, st.isActive)}
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                              st.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${st.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{st.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                          </button>
                        </div>

                        {/* Middle: Staff Info */}
                        <div className="mt-3.5 space-y-1">
                          <h4 className="font-black text-base text-slate-900">{st.name}</h4>
                          <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>লগইন আইডি: {st.phone}</span>
                          </p>

                          {!isCentral && st.doctor && (
                            <div className="mt-2 p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-purple-200 shrink-0">
                                {st.doctor.photoUrl ? (
                                  <img src={st.doctor.photoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Stethoscope className="w-4 h-4 m-2 text-purple-500" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11.5px] font-black text-purple-950 truncate">{st.doctor.name}</p>
                                <p className="text-[10px] text-purple-700 font-bold truncate">
                                  {st.doctor.chamberRoom || st.doctor.specialization}
                                </p>
                              </div>
                            </div>
                          )}

                          {st.notes && (
                            <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              "{st.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Link
                          href={deskLink}
                          target="_blank"
                          className="py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3 h-3 text-sky-600" />
                          <span>{isCentral ? 'রিসেপশন স্ক্রিন' : 'চেম্বার কিউ'}</span>
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            title="পাসওয়ার্ড পরিবর্তন করুন"
                            onClick={() => handleResetStaffPassword(st.id, st.name)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            title="স্টাফ একাউন্ট মুছুন"
                            onClick={() => handleDeleteStaff(st.id, st.name)}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* MODAL: ADD NEW STAFF / RECEPTIONIST */}
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900">নতুন স্টাফ / রিসেপশনিস্ট যোগ করুন</h4>
                    <p className="text-xs text-slate-500 font-medium">দায়িত্ব অনুযায়ী একাউন্ট তৈরি করুন</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4">
                
                {/* Role Choice (Radio Cards) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-800 block">স্টাফের পদবি ও দায়িত্বের ধরন *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    {/* Option 1: Central Receptionist */}
                    <label
                      onClick={() => setStaffForm({ ...staffForm, role: 'CENTRAL_RECEPTIONIST', doctorId: '' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        staffForm.role === 'CENTRAL_RECEPTIONIST'
                          ? 'border-sky-600 bg-sky-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className={`w-4 h-4 ${staffForm.role === 'CENTRAL_RECEPTIONIST' ? 'text-sky-600' : 'text-slate-500'}`} />
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          staffForm.role === 'CENTRAL_RECEPTIONIST' ? 'border-sky-600 bg-sky-600' : 'border-slate-300'
                        }`}>
                          {staffForm.role === 'CENTRAL_RECEPTIONIST' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-black text-slate-900">সেন্ট্রাল রিসেপশন ডেস্ক</p>
                        <p className="text-[10.5px] text-slate-500 mt-0.5 font-medium leading-tight">
                          হাসপাতালের সকল ডাক্তারের সিরিয়াল লেখা ও সেন্ট্রাল কিউ
                        </p>
                      </div>
                    </label>

                    {/* Option 2: Doctor's Assistant */}
                    <label
                      onClick={() => setStaffForm({ ...staffForm, role: 'DOCTOR_ASSISTANT' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        staffForm.role === 'DOCTOR_ASSISTANT'
                          ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Stethoscope className={`w-4 h-4 ${staffForm.role === 'DOCTOR_ASSISTANT' ? 'text-purple-600' : 'text-slate-500'}`} />
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          staffForm.role === 'DOCTOR_ASSISTANT' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                        }`}>
                          {staffForm.role === 'DOCTOR_ASSISTANT' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-black text-slate-900">ডাক্তারের নিজস্ব সহকারী</p>
                        <p className="text-[10.5px] text-slate-500 mt-0.5 font-medium leading-tight">
                          শুধুমাত্র নির্দিষ্ট ডাক্তারের চেম্বার কিউ স্ক্রিন
                        </p>
                      </div>
                    </label>

                  </div>
                </div>

                {/* If Doctor Assistant: Select Doctor */}
                {staffForm.role === 'DOCTOR_ASSISTANT' && (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50/50 border border-purple-200 animate-in fade-in duration-150">
                    <label className="text-xs font-black text-purple-900 block">কোন ডাক্তারের জন্য দায়িত্ব দেওয়া হবে? *</label>
                    <select
                      required
                      value={staffForm.doctorId}
                      onChange={(e) => setStaffForm({ ...staffForm, doctorId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-purple-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                    >
                      <option value="">-- ডাক্তার নির্বাচন করুন --</option>
                      {approvedDoctors.map((doc: any) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.specialization} - {doc.chamberRoom || 'চেম্বার'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Staff Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">স্টাফের পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="যেমন: মোঃ করিম উদ্দিন"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                {/* Phone & Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">মোবাইল নম্বর (লগইন আইডি) *</label>
                    <input
                      type="tel"
                      required
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">লগইন পাসওয়ার্ড / পিন *</label>
                    <input
                      type="password"
                      required
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      placeholder="কমপক্ষে ৪-৬ সংখ্যার পিন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">নোট বা শিফট বিবরণ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={staffForm.notes}
                    onChange={(e) => setStaffForm({ ...staffForm, notes: e.target.value })}
                    placeholder="যেমন: মর্নিং শিফট (সকাল ৮টা - দুপুর ২টা)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-all cursor-pointer"
                  >
                    বাতিল
                  </button>

                  <button
                    type="submit"
                    disabled={staffSubmitting}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{staffSubmitting ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি সম্পন্ন করুন'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
