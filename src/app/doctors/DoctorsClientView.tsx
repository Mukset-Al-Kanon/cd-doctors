'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw,
  Check,
  UserCheck,
  Building2,
  HeartPulse,
  ChevronDown
} from 'lucide-react';
import DoctorCardItem from '@/components/DoctorCardItem';
import CustomLocationSelector, { BD_DIVISIONS_MAP, getDivisionByDistrict } from '@/components/CustomLocationSelector';

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ALL_WEEK_DAYS = [
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
];

export interface SpecialtyCategory {
  id: string;
  labelBn: string;
  keywords: string[];
  icon?: string;
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

interface DoctorsClientViewProps {
  initialDoctors: any[];
  initialQuery?: string;
  initialSpecialty?: string;
  initialUserDistrict?: string | null;
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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

export default function DoctorsClientView({
  initialDoctors,
  initialQuery = '',
  initialSpecialty = 'all',
  initialUserDistrict = null,
}: DoctorsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedHospital, setSelectedHospital] = useState('সব হাসপাতাল');
  const [selectedDivision, setSelectedDivision] = useState(
    initialUserDistrict ? getDivisionByDistrict(initialUserDistrict) : 'সব বিভাগ'
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialUserDistrict || 'সব শহর'
  );
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // If user signs in on client side, automatically default to their district
  React.useEffect(() => {
    if (!initialUserDistrict) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.district) {
            setSelectedDistrict(data.user.district);
            setSelectedDivision(getDivisionByDistrict(data.user.district));
          }
        })
        .catch(() => {});
    }
  }, [initialUserDistrict]);

  // Extract unique hospitals from doctor schedules & hospital info
  const hospitalList = useMemo(() => {
    const set = new Set<string>();
    initialDoctors.forEach((doc) => {
      if (doc.hospital?.name) set.add(doc.hospital.name);
      if (doc.schedules) {
        doc.schedules.forEach((s: any) => {
          if (s.chamberName && s.chamberName.trim()) set.add(s.chamberName.trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [initialDoctors]);

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

  // Filter doctors based on search query, category, hospital & location
  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      
      // Text search match (name, degrees, specialization, hospital, dept)
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
        }
      }

      // Hospital Match
      let matchesHospital = true;
      if (selectedHospital !== 'সব হাসপাতাল') {
        matchesHospital = 
          doc.hospital?.name === selectedHospital ||
          doc.schedules?.some((s: any) => s.chamberName === selectedHospital);
      }

      // Division & District Location Match
      let matchesLocation = true;
      if (selectedDivision !== 'সব বিভাগ' && selectedDivision !== 'সকল বিভাগ') {
        const divMatch = 
          (doc.hospital?.district?.division?.nameBn && doc.hospital.district.division.nameBn.includes(selectedDivision)) ||
          (doc.hospital?.district?.division?.nameEn && doc.hospital.district.division.nameEn.toLowerCase().includes(selectedDivision.toLowerCase())) ||
          (typeof doc.hospital?.district?.division === 'string' && doc.hospital.district.division.includes(selectedDivision)) ||
          doc.schedules?.some((s: any) => s.division && s.division.includes(selectedDivision)) ||
          (selectedDivision === 'খুলনা' && (
            (doc.hospital?.address && (doc.hospital.address.toLowerCase().includes('chuadanga') || doc.hospital.address.includes('চুয়াডাঙ্গা'))) ||
            (doc.hospital?.name && (doc.hospital.name.toLowerCase().includes('chuadanga') || doc.hospital.name.includes('চুয়াডাঙ্গা'))) ||
            doc.schedules?.some((s: any) => (s.district && (s.district.includes('চুয়াডাঙ্গা') || s.district.toLowerCase().includes('chuadanga'))))
          ));
        if (!divMatch) matchesLocation = false;
      }
      if (matchesLocation && selectedDistrict !== 'সব শহর' && selectedDistrict !== 'সকল জেলা') {
        const cleanDist = selectedDistrict.replace(' জেলা', '').trim();
        const distMatch = 
          (doc.hospital?.district?.name && doc.hospital.district.name.includes(cleanDist)) ||
          (doc.hospital?.district?.nameBn && doc.hospital.district.nameBn.includes(cleanDist)) ||
          (doc.hospital?.district?.nameEn && doc.hospital.district.nameEn.toLowerCase().includes(cleanDist.toLowerCase())) ||
          (doc.hospital?.name && (doc.hospital.name.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && doc.hospital.name.toLowerCase().includes('chuadanga')))) ||
          (doc.hospital?.address && (doc.hospital.address.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && doc.hospital.address.toLowerCase().includes('chuadanga')))) ||
          (doc.chamberRoom && doc.chamberRoom.includes(cleanDist)) ||
          doc.schedules?.some((s: any) => 
            (s.district && (s.district.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.district.toLowerCase().includes('chuadanga')))) ||
            (s.chamberName && (s.chamberName.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.chamberName.toLowerCase().includes('chuadanga')))) ||
            (s.chamberAddress && (s.chamberAddress.includes(cleanDist) || (cleanDist === 'চুয়াডাঙ্গা' && s.chamberAddress.toLowerCase().includes('chuadanga'))))
          );
        if (!distMatch) matchesLocation = false;
      }

      return matchesQuery && matchesSpecialty && matchesHospital && matchesLocation;
    });
  }, [initialDoctors, searchQuery, selectedSpecialty, selectedHospital, selectedDivision, selectedDistrict]);

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

  return (
    <div className="min-h-screen bg-[#F4F5F7] pt-2.5 pb-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* SEO Heading (Screen reader accessible) */}
        <h1 className="sr-only">
          {selectedDistrict !== 'সব শহর' && selectedDistrict !== 'সকল জেলা' 
            ? `${selectedDistrict.replace(' জেলা', '')} জেলার` 
            : selectedDivision !== 'সব বিভাগ' && selectedDivision !== 'সকল বিভাগ' 
            ? `${selectedDivision.replace(' বিভাগ', '')} বিভাগের` 
            : 'বাংলাদেশের'} বিশেষজ্ঞ ডাক্তার তালিকা
        </h1>

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
        {/* 🩺 DOCTORS GRID OR EMPTY STATE */}
        {/* ========================================================================= */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const availableDayNamesSet = new Set<string>(
                doc.schedules && doc.schedules.length > 0
                  ? doc.schedules.map((s: any) => DAYS_MAP[s.dayOfWeek])
                  : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
              );

              return (
                <DoctorCardItem
                  key={doc.id}
                  doc={doc}
                  filteredDistrict={selectedDistrict !== 'সকল জেলা' ? selectedDistrict : undefined}
                  ALL_WEEK_DAYS={ALL_WEEK_DAYS}
                  availableDayNamesSet={availableDayNamesSet}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100 shadow-2xs">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-lg text-nuvicaNavy-950">কোনো ডাক্তার পাওয়া যায়নি</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ডাক্তারের তথ্য মেলেনি। দয়া করে ভিন্ন শব্দ বা বিভাগ দিয়ে চেষ্টা করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-nuvica-primary text-xs !py-2.5 px-6"
            >
              সকল ডাক্তার দেখুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
