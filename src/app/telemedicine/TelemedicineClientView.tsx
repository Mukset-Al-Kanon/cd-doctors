'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  User, 
  ArrowRight, 
  X, 
  ChevronRight,
  ExternalLink,
  Lock,
  BadgeCheck,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { BD_DIVISIONS_MAP, getDivisionByDistrict } from '@/components/CustomLocationSelector';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';
import DoctorCardName from '@/components/DoctorCardName';

export interface SpecialtyCategory {
  id: string;
  labelBn: string;
  keywords: string[];
}

const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  { id: 'all', labelBn: 'সকল বিশেষজ্ঞ', keywords: [] },
  { id: 'medicine', labelBn: 'মেডিসিন ও ডায়াবেটিস', keywords: ['medicine', 'diabet', 'মেডিসিন', 'ডায়াবেটিস', 'internal'] },
  { id: 'cardiology', labelBn: 'হৃদরোগ (কার্ডিওলজি)', keywords: ['cardio', 'heart', 'কার্ডিওলজি', 'হৃদরোগ'] },
  { id: 'gynecology', labelBn: 'স্ত্রী ও প্রসূতি রোগ', keywords: ['gynae', 'obs', 'স্ত্রী', 'প্রসূতি', 'women', 'maternal'] },
  { id: 'pediatrics', labelBn: 'শিশু রোগ ও নবজাতক', keywords: ['pediatric', 'paed', 'child', 'শিশু', 'neonat'] },
  { id: 'orthopedics', labelBn: 'অর্থোপেডিক্স ও হাড়জোড়', keywords: ['ortho', 'bone', 'অর্থোপেডিক্স', 'হাড়', 'trauma', 'spine'] },
  { id: 'neurology', labelBn: 'নিউরোমেডিসিন ও ব্রেইন', keywords: ['neuro', 'brain', 'নিউরো', 'স্ট্রোক', 'stroke'] },
  { id: 'dermatology', labelBn: 'চর্ম, এলার্জি ও যৌন', keywords: ['dermat', 'skin', 'চর্ম', 'এলার্জি', 'laser'] },
  { id: 'eye', labelBn: 'চক্ষু রোগ (Eye)', keywords: ['eye', 'ophthalm', 'চক্ষু', 'চোখ', 'phaco'] },
  { id: 'ent', labelBn: 'নাক, কান ও গলা (ENT)', keywords: ['ent', 'ear', 'nose', 'throat', 'নাক', 'কান', 'গলা'] },
  { id: 'surgery', labelBn: 'জেনারেল ও ল্যাপারোস্কোপিক সার্জারি', keywords: ['surgery', 'surgeon', 'সার্জারি', 'সার্জন', 'laparoscopic'] },
  { id: 'gastroenterology', labelBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার', keywords: ['gastro', 'liver', 'লিভার', 'গ্যাস্ট্রো', 'endoscop'] },
  { id: 'chest', labelBn: 'বক্ষব্যাধি ও অ্যাজমা', keywords: ['chest', 'pulmon', 'asthma', 'বক্ষব্যাধি', 'অ্যাজমা', 'respiratory'] },
  { id: 'urology', labelBn: 'ইউরোলজি ও কিডনি সার্জারি', keywords: ['uro', 'kidney', 'ইউরোলজি', 'কিডনি', 'nephro'] },
  { id: 'dental', labelBn: 'ডেন্টাল ও মুখরোগ', keywords: ['dental', 'dent', 'দাঁত', 'ডেন্টাল', 'oral'] },
];

function toBanglaDigits(str: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

function DoctorNameWithVerifiedBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{name}</span>
      <OfficialVerifiedBadge className="w-4 h-4 shrink-0 inline-block align-middle select-none" />
    </span>
  );
}

interface CustomDropdownOption {
  value: string;
  label: string;
}

interface CustomSmoothDropdownProps {
  label: string;
  value: string;
  options: CustomDropdownOption[];
  onChange: (val: string) => void;
  alignRight?: boolean;
}

function CustomSmoothDropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  alignRight = false 
}: CustomSmoothDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value) || options[0];
  const displayLabel = selectedOption?.label || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1 block">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between cursor-pointer transition-all shadow-2xs text-left ${
          isOpen 
            ? 'border-blue-500 ring-2 ring-blue-500/20' 
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
        title={displayLabel}
      >
        <span className="truncate pr-2">{displayLabel}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-[calc(100%+6px)] ${
            alignRight ? 'right-0' : 'left-0'
          } min-w-[260px] sm:min-w-[320px] max-w-[calc(100vw-36px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 max-h-72 overflow-y-auto overscroll-contain animate-fadeIn`}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="leading-snug break-words flex-1">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TeleDoctor {
  id: string;
  name: string;
  slug: string;
  degrees: string;
  specialization: string;
  bmdcNumber?: string;
  experienceYears?: number;
  photoUrl?: string;
  telemedicineFee: number;
  consultationFee?: number;
  isTelemedicineAvailable: boolean;
  languages?: string;
  bio?: string;
  hospital?: {
    name: string;
    address?: string;
    district?: {
      id?: string;
      nameEn?: string;
      nameBn?: string;
      division?: {
        nameEn?: string;
        nameBn?: string;
      } | string;
    };
  };
  department?: {
    nameEn?: string;
    nameBn?: string;
  };
  schedules?: any[];
}

export default function TelemedicineClientView() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<TeleDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States (Exact match with Doctor Page)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState('সব হাসপাতাল');
  const [selectedDivision, setSelectedDivision] = useState('সব বিভাগ');
  const [selectedDistrict, setSelectedDistrict] = useState('সব শহর');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<TeleDoctor | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '28',
    patientGender: 'পুরুষ',
    appointmentDate: new Date().toISOString().slice(0, 10),
    timeSlot: 'সন্ধ্যা ৭:০০',
    visitReason: '',
  });

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/telemedicine/doctors');
        const data = await res.json();
        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error('Failed to load telemedicine doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Pre-select user district if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.district) {
          setSelectedDistrict(data.user.district);
          setSelectedDivision(getDivisionByDistrict(data.user.district));
        }
      })
      .catch(() => {});
  }, []);

  // Extract unique hospitals from doctor schedules & hospital info
  const hospitalList = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((doc) => {
      if (doc.hospital?.name) set.add(doc.hospital.name);
      if (doc.schedules) {
        doc.schedules.forEach((s: any) => {
          if (s.chamberName && s.chamberName.trim()) set.add(s.chamberName.trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [doctors]);

  // District options filtered by selected division
  const availableDistricts = useMemo(() => {
    if (selectedDivision === 'সব বিভাগ' || !BD_DIVISIONS_MAP[selectedDivision]) {
      const all: string[] = [];
      Object.values(BD_DIVISIONS_MAP).forEach((distList) => all.push(...distList));
      return Array.from(new Set(all)).sort();
    }
    return BD_DIVISIONS_MAP[selectedDivision] || [];
  }, [selectedDivision]);

  const divisionOptions = useMemo(() => [
    { value: 'সব বিভাগ', label: 'সব বিভাগ' },
    ...Object.keys(BD_DIVISIONS_MAP).map((divName) => ({ value: divName, label: divName }))
  ], []);

  const districtOptions = useMemo(() => [
    { value: 'সব শহর', label: 'সব শহর' },
    ...availableDistricts.map((distName) => ({ value: distName, label: distName }))
  ], [availableDistricts]);

  const hospitalOptions = useMemo(() => [
    { value: 'সব হাসপাতাল', label: 'সব হাসপাতাল' },
    ...hospitalList.map((hosp) => ({ value: hosp, label: hosp }))
  ], [hospitalList]);

  const specialtyOptions = useMemo(() => [
    { value: 'all', label: 'সব বিশেষজ্ঞ' },
    ...SPECIALTY_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({ value: cat.id, label: cat.labelBn }))
  ], []);

  // Instant Client Filter Match
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();

      // Text search match (name, degrees, specialization, hospital, bio, department)
      const matchesQuery =
        !q ||
        (doc.name && doc.name.toLowerCase().includes(q)) ||
        (doc.degrees && doc.degrees.toLowerCase().includes(q)) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(q)) ||
        (doc.department?.nameEn && doc.department.nameEn.toLowerCase().includes(q)) ||
        (doc.department?.nameBn && doc.department.nameBn.toLowerCase().includes(q)) ||
        (doc.hospital?.name && doc.hospital.name.toLowerCase().includes(q)) ||
        (doc.bio && doc.bio.toLowerCase().includes(q));

      // Specialty category match
      let matchesSpecialty = true;
      if (selectedSpecialty && selectedSpecialty !== 'all') {
        const cat = SPECIALTY_CATEGORIES.find((c) => c.id === selectedSpecialty);
        if (cat) {
          const docText = `
            ${doc.specialization || ''} 
            ${doc.department?.nameEn || ''} 
            ${doc.department?.nameBn || ''} 
            ${doc.degrees || ''} 
            ${doc.bio || ''}
          `.toLowerCase();

          matchesSpecialty = cat.keywords.some((kw) => docText.includes(kw.toLowerCase()));
        } else {
          matchesSpecialty = doc.specialization?.toLowerCase().includes(selectedSpecialty.toLowerCase()) ?? false;
        }
      }

      // Hospital Match
      let matchesHospital = true;
      if (selectedHospital !== 'সব হাসপাতাল') {
        matchesHospital = Boolean(
          doc.hospital?.name === selectedHospital ||
          doc.schedules?.some((s: any) => s.chamberName === selectedHospital)
        );
      }

      // Division & District Location Match
      let matchesLocation = true;
      if (selectedDivision !== 'সব বিভাগ' && selectedDivision !== 'সকল বিভাগ') {
        const divMatch = Boolean(
          (doc.hospital?.district?.division && (
            (typeof doc.hospital.district.division === 'object' && (
              (doc.hospital.district.division.nameBn && doc.hospital.district.division.nameBn.includes(selectedDivision)) ||
              (doc.hospital.district.division.nameEn && doc.hospital.district.division.nameEn.toLowerCase().includes(selectedDivision.toLowerCase()))
            )) ||
            (typeof doc.hospital.district.division === 'string' && doc.hospital.district.division.includes(selectedDivision))
          )) ||
          (doc.hospital?.address && (doc.hospital.address.includes(selectedDivision) || (selectedDivision === 'খুলনা' && doc.hospital.address.includes('চুয়াডাঙ্গা')))) ||
          doc.schedules?.some((s: any) => s.division && s.division.includes(selectedDivision))
        );
        if (!divMatch) matchesLocation = false;
      }

      if (matchesLocation && selectedDistrict !== 'সব শহর' && selectedDistrict !== 'সকল জেলা') {
        const cleanDist = selectedDistrict.replace(' জেলা', '').trim();
        const distMatch = Boolean(
          (doc.hospital?.district?.nameBn && doc.hospital.district.nameBn.includes(cleanDist)) ||
          (doc.hospital?.district?.nameEn && doc.hospital.district.nameEn.toLowerCase().includes(cleanDist.toLowerCase())) ||
          (doc.hospital?.name && (doc.hospital.name.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && doc.hospital.name.toLowerCase().includes('chuadanga')))) ||
          (doc.hospital?.address && (doc.hospital.address.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && doc.hospital.address.toLowerCase().includes('chuadanga')))) ||
          doc.schedules?.some((s: any) => 
            (s.district && (s.district.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.district.toLowerCase().includes('chuadanga')))) ||
            (s.chamberName && (s.chamberName.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.chamberName.toLowerCase().includes('chuadanga')))) ||
            (s.chamberAddress && (s.chamberAddress.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.chamberAddress.toLowerCase().includes('chuadanga'))))
          )
        );
        if (!distMatch) matchesLocation = false;
      }

      return matchesQuery && matchesSpecialty && matchesHospital && matchesLocation;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedHospital, selectedDivision, selectedDistrict]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedHospital('সব হাসপাতাল');
    setSelectedDivision('সব বিভাগ');
    setSelectedDistrict('সব শহর');
  };

  const isFiltered = 
    searchQuery.trim() !== '' || 
    selectedSpecialty !== 'all' || 
    selectedHospital !== 'সব হাসপাতাল' || 
    (selectedDivision !== 'সব বিভাগ' && selectedDivision !== 'সকল বিভাগ') || 
    (selectedDistrict !== 'সব শহর' && selectedDistrict !== 'সকল জেলা');

  const openBookingModal = (doc: TeleDoctor) => {
    setSelectedDoctor(doc);
    setBookingSuccessData(null);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.patientPhone.trim()) {
      alert('অনুগ্রহ করে রোগীর নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    try {
      setBookingSubmitting(true);
      const payload = {
        doctorId: selectedDoctor?.id,
        ...formData,
      };

      const res = await fetch('/api/telemedicine/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.appointment) {
        setBookingSuccessData(data);
      } else {
        alert(data.error || 'বুকিং সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('সার্ভার সমস্যার কারণে বুকিং ব্যর্থ হয়েছে।');
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-bengali pt-2.5 pb-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        

        {/* ========================================================================= */}
        {/* 🌟 2. SEARCH & FILTER CARD (Custom Ultra-Smooth Popover Dropdowns) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-[28px] p-4 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
          
          {/* Top Row: Search Input + Blue Filter Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Search Input Box */}
            <div className="flex-1 relative flex items-center bg-[#F8FAFC] border border-slate-200/90 rounded-2xl px-3.5 sm:px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-2xs">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2 sm:mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ডাক্তারের নাম, হাসপাতাল বা বিশেষজ্ঞ খুঁজুন..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium py-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer mr-0.5 shrink-0"
                  title="ক্লিয়ার করুন"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sky Blue Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-2xl flex items-center gap-1.5 sm:gap-2 shadow-xs transition-all cursor-pointer shrink-0"
              title="ফিল্টার অপশন টগল করুন"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>ফিল্টার</span>
            </button>

          </div>

          {/* 2-Column Exact Filter Grid with Smooth Popover Dropdowns */}
          {isFilterOpen && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* 🌐 ১. বিভাগ (Division) */}
                <CustomSmoothDropdown
                  label="বিভাগ"
                  value={selectedDivision}
                  options={divisionOptions}
                  onChange={(val) => {
                    setSelectedDivision(val);
                    setSelectedDistrict('সব শহর');
                  }}
                />

                {/* 📍 ২. শহর (City / District) */}
                <CustomSmoothDropdown
                  label="শহর"
                  value={selectedDistrict}
                  options={districtOptions}
                  onChange={(val) => setSelectedDistrict(val)}
                  alignRight={true}
                />

                {/* 🏥 ৩. হাসপাতাল (Hospital) */}
                <CustomSmoothDropdown
                  label="হাসপাতাল"
                  value={selectedHospital}
                  options={hospitalOptions}
                  onChange={(val) => setSelectedHospital(val)}
                />

                {/* 🩺 ৪. বিশেষজ্ঞ (Specialty) */}
                <CustomSmoothDropdown
                  label="বিশেষজ্ঞ"
                  value={selectedSpecialty}
                  options={specialtyOptions}
                  onChange={(val) => setSelectedSpecialty(val)}
                  alignRight={true}
                />

              </div>

              {/* Bottom Row: Total Count + Reset / Close Action Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  মোট প্রাপ্ত: <span className="text-sky-600 font-black">{toBanglaDigits(filteredDoctors.length)} জন</span> ডাক্তার
                </span>

                <div className="flex items-center gap-3">
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      ফিল্টার মুছুন
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 🌟 3. DOCTORS DIRECTORY */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                অনলাইন চেম্বার সক্রিয় ডাক্তারগণ ({toBanglaDigits(filteredDoctors.length)})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">টেলিমেডিসিন ডাক্তার তালিকা লোড হচ্ছে...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">কোনো ডাক্তার পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-400 font-medium">অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="card-nuvica flex flex-col justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-4 group"
                >
                  {/* ========================================================================= */}
                  {/* 1. TOP SECTION: 1:1 Photo (Left) + Name, Degrees, Specialization (Right) */}
                  {/* ========================================================================= */}
                  <div className="flex gap-3.5 sm:gap-4 items-start">
                    {/* Left: 1:1 Square Doctor Photo */}
                    <div className="relative aspect-square w-[110px] xs:w-[120px] sm:w-[130px] md:w-[140px] shrink-0 rounded-2xl overflow-hidden shadow-xs border-2 border-white bg-slate-100">
                      <img
                        src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Right: Doctor Credentials */}
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5 pt-0.5">
                      {/* Doctor Name with Verified Badge (Always on first line) */}
                      <Link 
                        href={`/doctors/${doc.slug || doc.id}`}
                        className="group/name block"
                      >
                        <DoctorCardName 
                          name={doc.name}
                          isVerified={true}
                          className="font-black text-base sm:text-lg md:text-[18px] text-nuvicaNavy-950 group-hover/name:text-sky-700 transition-colors leading-snug tracking-tight cursor-pointer"
                        />
                      </Link>

                      {/* Degrees */}
                      {doc.degrees && (
                        <p className="text-[11.5px] sm:text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                          {doc.degrees}
                        </p>
                      )}

                      {/* Specialization */}
                      <p className="text-xs sm:text-[13.5px] md:text-sm font-black text-sky-700 leading-snug pt-0.5">
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* 2. BOTTOM SECTION: Telemedicine Button (Left) + Profile Button (Right) */}
                  {/* ========================================================================= */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                    {/* Left: Telemedicine Button */}
                    <button
                      type="button"
                      onClick={() => openBookingModal(doc)}
                      className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-xs sm:text-[13px] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs group/btn cursor-pointer active:scale-95"
                      title="অনলাইন ভিডিও কনসালটেশন বুক করুন"
                    >
                      <Video className="w-3.5 h-3.5 text-white shrink-0" />
                      <span className="truncate">টেলিমেডিসিন</span>
                    </button>

                    {/* Right: Profile Button */}
                    <Link
                      href={`/doctors/${doc.slug || doc.id}`}
                      className="w-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200/80 hover:border-sky-200 font-black text-xs sm:text-[13px] px-3 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs group/btn cursor-pointer active:scale-95 text-center"
                      title="ডাক্তারের সম্পূর্ণ পরিচিতি ও চেম্বার প্রোফাইল দেখুন"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-sky-700 shrink-0" />
                      <span className="truncate">প্রোফাইল</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 🌟 4. TELEMEDICINE BOOKING MODAL */}
      {/* ========================================================================= */}
      {bookingModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            {!bookingSuccessData ? (
              <>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-black">
                    <Video className="w-3 h-3 text-sky-600" /> অনলাইন ভিডিও কনসালটেশন বুকিং
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {selectedDoctor.specialization} • Fee: <span className="text-emerald-600 font-black">৳ {selectedDoctor.telemedicineFee}</span>
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">রোগীর পূর্ণ নাম *</label>
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="যেমন: মোঃ আব্দুল্লাহ"
                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">রোগীর মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                        placeholder="০১৭xxxxxxxx"
                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">বয়স</label>
                        <input
                          type="text"
                          value={formData.patientAge}
                          onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">লিঙ্গ</label>
                        <select
                          value={formData.patientGender}
                          onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                        >
                          <option value="পুরুষ">পুরুষ</option>
                          <option value="মহিলা">মহিলা</option>
                          <option value="অন্যান্য">অন্যান্য</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">পরামর্শের তারিখ</label>
                        <input
                          type="date"
                          value={formData.appointmentDate}
                          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                          className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1">সময় স্লট</label>
                        <select
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                        >
                          <option value="সন্ধ্যা ৭:০০">সন্ধ্যা ৭:০০</option>
                          <option value="সন্ধ্যা ৭:৩০">সন্ধ্যা ৭:৩০</option>
                          <option value="রাত ৮:০০">রাত ৮:০০</option>
                          <option value="রাত ৮:৩০">রাত ৮:৩০</option>
                          <option value="রাত ৯:০০">রাত ৯:০০</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">সমস্যা বা রোগের লক্ষণ (সংক্ষেপে)</label>
                      <textarea
                        rows={2}
                        value={formData.visitReason}
                        onChange={(e) => setFormData({ ...formData, visitReason: e.target.value })}
                        placeholder="যেমন: ৩ দিন ধরে তীব্র জ্বর এবং কাশি..."
                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Note Box */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-[11.5px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      ভিডিও কলের পূর্বে কোনো অগ্রিম পেমেন্ট নেই। বুকিং নিশ্চিত হওয়ার পর কনসালটেশন রুমে প্রবেশ করে সরাসরি ডাক্তারের প্রেসক্রিপশন পাবেন।
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:to-sky-700 text-white font-black text-sm shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {bookingSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>কনসালটেশন নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">ভিডিও কনসালটেশন সফলভাবে বুক হয়েছে!</h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    আপনার সিরিয়াল ও কনসালটেশন রুম লিংক তৈরি হয়েছে।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">সিরিয়াল নম্বর:</span>
                    <span className="font-black text-sky-600">{toBanglaDigits(bookingSuccessData.appointment?.serialNumber || 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">রোগী:</span>
                    <span className="font-black text-slate-800">{bookingSuccessData.appointment?.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">ডাক্তার:</span>
                    <span className="font-black text-slate-800">{bookingSuccessData.appointment?.doctor?.name || selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">তারিখ ও সময়:</span>
                    <span className="font-black text-slate-800">{bookingSuccessData.appointment?.appointmentDate} ({bookingSuccessData.appointment?.timeSlot})</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={bookingSuccessData.roomUrl}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-center cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>সরাসরি ভিডিও কনসালটেশন রুমে প্রবেশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
