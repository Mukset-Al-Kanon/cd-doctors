'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Droplet, 
  MapPin, 
  ChevronDown,
  Check,
  Search
} from 'lucide-react';
import { getUpazilasForDistrict } from '@/lib/bangladeshLocations';
import { ALL_64_DISTRICTS, DistrictInfo } from '@/components/DistrictSelectDropdown';

// 🇧🇩 All 64 Districts of Bangladesh Sorted in Strict A to Z Alphabetical Order by default
export const ALL_DISTRICTS_A_TO_Z: DistrictInfo[] = [...ALL_64_DISTRICTS].sort((a, b) =>
  a.nameEn.localeCompare(b.nameEn)
);

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentUser?: { name: string; email: string; phone?: string; district?: string } | null;
}

export default function DonorRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}: DonorRegistrationModalProps) {
  const initialDistrict = currentUser?.district?.trim() || 'চুয়াডাঙ্গা';
  const initialUpazilas = useMemo(() => {
    const upz = getUpazilasForDistrict(initialDistrict);
    return [...upz].sort((a, b) => a.localeCompare(b, 'bn'));
  }, [initialDistrict]);

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bloodGroup: 'O+',
    age: '',
    gender: 'পুরুষ',
    district: initialDistrict,
    area: initialUpazilas[0] || 'সদর',
    address: '',
    availability: 'available',
    lastDonationDate: '',
    note: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Custom Dropdown states
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const districtRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) {
        setDistrictDropdownOpen(false);
      }
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setAreaDropdownOpen(false);
      }
      if (genderRef.current && !genderRef.current.contains(e.target as Node)) {
        setGenderDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamically compute Upazilas for the selected District sorted alphabetically
  const availableUpazilas = useMemo(() => {
    const upz = getUpazilasForDistrict(formData.district);
    return [...upz].sort((a, b) => a.localeCompare(b, 'bn'));
  }, [formData.district]);

  // Ranked districts recommendation when user types 1 or 2 letters (or more)
  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase().normalize('NFC');
    if (!q) return ALL_DISTRICTS_A_TO_Z;

    const scored: { district: DistrictInfo; score: number }[] = [];

    for (const d of ALL_DISTRICTS_A_TO_Z) {
      const en = d.nameEn.toLowerCase();
      const bn = d.nameBn.normalize('NFC');
      const aliases = (d.aliases || []).map((a) => a.toLowerCase());

      let score = 999;

      // 1. Exact match (Highest Priority)
      if (en === q || bn === q || aliases.includes(q)) {
        score = 0;
      }
      // 2. Starts with English name (e.g. typing "dh" -> Dhaka, "ch" -> Chandpur, Chuadanga, Chattogram)
      else if (en.startsWith(q)) {
        score = 1;
      }
      // 3. Starts with Bengali name (e.g. typing "চু" -> চুয়াডাঙ্গা, "ঢ" -> ঢাকা, "ব" -> বগুড়া)
      else if (bn.startsWith(q)) {
        score = 2;
      }
      // 4. Starts with any common Alias (e.g. "ctg", "cox", "bbaria", "bogra")
      else if (aliases.some((a) => a.startsWith(q))) {
        score = 3;
      }
      // 5. Contains substring in English name
      else if (en.includes(q)) {
        score = 4;
      }
      // 6. Contains substring in Bengali name
      else if (bn.includes(q)) {
        score = 5;
      }
      // 7. Contains substring in Alias
      else if (aliases.some((a) => a.includes(q))) {
        score = 6;
      }

      if (score < 999) {
        scored.push({ district: d, score });
      }
    }

    // Sort by recommendation score first, then alphabetically by English name
    scored.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.district.nameEn.localeCompare(b.district.nameEn);
    });

    return scored.map((s) => s.district);
  }, [districtSearch]);

  const handleDistrictSelect = (districtBn: string) => {
    const upazilas = getUpazilasForDistrict(districtBn);
    const sortedUpazilas = [...upazilas].sort((a, b) => a.localeCompare(b, 'bn'));
    setFormData((prev) => ({
      ...prev,
      district: districtBn,
      area: sortedUpazilas[0] || 'সদর',
    }));
    setDistrictDropdownOpen(false);
    setDistrictSearch('');
  };

  const handleAreaSelect = (areaName: string) => {
    setFormData((prev) => ({
      ...prev,
      area: areaName,
    }));
    setAreaDropdownOpen(false);
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
    setGenderDropdownOpen(false);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    document.body.classList.remove('hide-nav-for-modal');
    document.documentElement.classList.remove('hide-nav-for-modal');
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setSubmittedSuccess(false);
      setErrorMessage(null);
      setDistrictDropdownOpen(false);
      setAreaDropdownOpen(false);
      setGenderDropdownOpen(false);
      document.body.classList.add('hide-nav-for-modal');
      document.documentElement.classList.add('hide-nav-for-modal');
      document.body.style.overflow = 'hidden';

      // Always populate with user's registered district & credentials when modal opens
      if (currentUser) {
        const userDist = currentUser.district?.trim() || 'চুয়াডাঙ্গা';
        const userUpazilas = getUpazilasForDistrict(userDist);
        const sortedUserUpazilas = [...userUpazilas].sort((a, b) => a.localeCompare(b, 'bn'));
        setFormData((prev) => ({
          ...prev,
          fullName: currentUser.name || prev.fullName || '',
          phone: currentUser.phone || prev.phone || '',
          district: userDist,
          area: sortedUserUpazilas[0] || 'সদর',
        }));
      }
    } else {
      document.body.classList.remove('hide-nav-for-modal');
      document.documentElement.classList.remove('hide-nav-for-modal');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.classList.remove('hide-nav-for-modal');
      document.documentElement.classList.remove('hide-nav-for-modal');
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userDist = currentUser.district?.trim() || 'চুয়াডাঙ্গা';
      const userUpazilas = getUpazilasForDistrict(userDist);
      const sortedUserUpazilas = [...userUpazilas].sort((a, b) => a.localeCompare(b, 'bn'));
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name || prev.fullName || '',
        phone: currentUser.phone || prev.phone || '',
        district: userDist,
        area: sortedUserUpazilas[0] || 'সদর',
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Front-end validation
    if (!formData.fullName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    const cleanedPhone = formData.phone.trim();
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanedPhone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 01712345678)।');
      return;
    }

    const numAge = Number(formData.age);
    if (isNaN(numAge) || numAge < 18 || numAge > 65) {
      setErrorMessage('রক্তদাতার বয়স অবশ্যই ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('নিবন্ধনের জন্য আপনাকে শর্তাবলী ও সম্মতিতে টিক দিতে হবে।');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/blood/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'নিবন্ধন সম্পন্ন করা যায়নি');
      }

      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'কোনো সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div 
      onClick={handleClose}
      data-modal="true"
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[99999] w-full h-full flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-[2px] font-bengali overflow-y-auto ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] max-w-[540px] w-full border border-slate-100 my-auto transform p-6 sm:p-7 max-h-[92vh] overflow-y-auto ${
          isClosing ? 'animate-modal-spring-out' : 'animate-modal-spring-in'
        }`}
      >
        {/* 1. PROFESSIONAL & MINIMAL HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100/70 flex items-center justify-center text-rose-600 shrink-0">
              <Droplet className="w-4.5 h-4.5 fill-rose-600 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                রক্তদাতা নিবন্ধন
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                জরুরি প্রয়োজনে রক্তদানে যুক্ত হোন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100/70 hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. CONTENT */}
        {submittedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-xs mx-auto">
              <h3 className="text-lg font-black text-slate-900">
                নিবন্ধন সফল হয়েছে!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                আপনার তথ্য রক্তদাতা নেটওয়ার্কে সংরক্ষিত হয়েছে। মহৎ এই কাজের জন্য আন্তরিক ধন্যবাদ!
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={handleClose}
                className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
              >
                সম্পন্ন করুন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-xs sm:text-sm font-semibold text-rose-700 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Blood Group Quick Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>রক্তের গ্রুপ নির্বাচন করুন:</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                {bloodGroups.map((bg) => {
                  const isSelected = formData.bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, bloodGroup: bg }))}
                      className={`h-10 rounded-xl text-xs sm:text-[13px] font-extrabold transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30 scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields: Row 1 - Full Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="সাবির খান"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Form Fields: Row 2 - Age & Gender (ALWAYS Side-by-Side) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  বয়স (বছর)
                </label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="যেমন: ২৫"
                  className="w-full h-11 px-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>

              {/* Gender - Professional Custom Dropdown */}
              <div className="space-y-1.5 relative" ref={genderRef}>
                <label className="text-xs font-bold text-slate-600 block">
                  লিঙ্গ
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setGenderDropdownOpen(!genderDropdownOpen);
                    setDistrictDropdownOpen(false);
                    setAreaDropdownOpen(false);
                  }}
                  className={`w-full h-11 px-3.5 rounded-2xl bg-white border transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer ${
                    genderDropdownOpen
                      ? 'border-rose-500 ring-4 ring-rose-500/10'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {formData.gender}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      genderDropdownOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>

                {genderDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-[999] bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    {['পুরুষ', 'মহিলা', 'অন্যান্য'].map((g) => {
                      const isSelected = formData.gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleGenderSelect(g)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50 text-rose-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{g}</span>
                          {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields: Row 3 - District & Upazila (Professional Custom Dropdowns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* District Selection - Custom Professional Dropdown Sorted A to Z */}
              <div className="space-y-1.5 relative" ref={districtRef}>
                <label className="text-xs font-bold text-slate-600 block">
                  জেলা
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDistrictDropdownOpen(!districtDropdownOpen);
                    setAreaDropdownOpen(false);
                    setGenderDropdownOpen(false);
                  }}
                  className={`w-full h-11 px-3.5 rounded-2xl bg-white border transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer ${
                    districtDropdownOpen
                      ? 'border-rose-500 ring-4 ring-rose-500/10'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {formData.district}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      districtDropdownOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>

                {districtDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1.5 z-[999] bg-white rounded-2xl border border-slate-200 shadow-[0_-15px_40px_rgba(15,23,42,0.16)] p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                    {/* Search Bar inside Dropdown */}
                    <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:bg-white focus-within:border-rose-500 transition-all">
                      <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        placeholder="জেলা খুঁজুন / Search (e.g. Dhaka, Chuadanga)..."
                        className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        autoFocus
                      />
                      {districtSearch && (
                        <button
                          type="button"
                          onClick={() => setDistrictSearch('')}
                          className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* All 64 Districts List in Strict A to Z Order */}
                    <div className="max-h-56 overflow-y-auto space-y-0.5 overscroll-contain pr-1">
                      {filteredDistricts.length === 0 ? (
                        <div className="py-4 text-center text-xs text-slate-400 font-medium">
                          কোনো জেলা পাওয়া যায়নি
                        </div>
                      ) : (
                        filteredDistricts.map((item) => {
                          const isSelected = formData.district === item.nameBn;
                          return (
                            <button
                              key={item.nameEn}
                              type="button"
                              onClick={() => handleDistrictSelect(item.nameBn)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 text-rose-700 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{item.nameBn}</span>
                                <span className="text-[11px] text-slate-400 font-normal">({item.nameEn})</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upazila / Thana Selection - Custom Professional Dropdown Sorted Alphabetically */}
              <div className="space-y-1.5 relative" ref={areaRef}>
                <label className="text-xs font-bold text-slate-600 block">
                  উপজেলা / থানা
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAreaDropdownOpen(!areaDropdownOpen);
                    setDistrictDropdownOpen(false);
                    setGenderDropdownOpen(false);
                  }}
                  className={`w-full h-11 px-3.5 rounded-2xl bg-white border transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer ${
                    areaDropdownOpen
                      ? 'border-rose-500 ring-4 ring-rose-500/10'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {formData.area || 'উপজেলা নির্বাচন করুন'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      areaDropdownOpen ? 'rotate-180 text-rose-600' : ''
                    }`}
                  />
                </button>

                {areaDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1.5 z-[999] bg-white rounded-2xl border border-slate-200 shadow-[0_-15px_40px_rgba(15,23,42,0.16)] p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-56 overflow-y-auto space-y-0.5 overscroll-contain pr-1">
                      {availableUpazilas.length === 0 ? (
                        <div className="py-4 text-center text-xs text-slate-400 font-medium">
                          কোনো উপজেলা পাওয়া যায়নি
                        </div>
                      ) : (
                        availableUpazilas.map((upz) => {
                          const isSelected = formData.area === upz;
                          return (
                            <button
                              key={upz}
                              type="button"
                              onClick={() => handleAreaSelect(upz)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 text-rose-700 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <span>{upz}</span>
                              {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="w-4 h-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500/20 accent-rose-600 cursor-pointer shrink-0"
                  required
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors font-medium leading-normal">
                  রক্তদাতা হিসেবে সিডি ডক্টরস নেটওয়ার্কে তথ্য প্রদর্শনে সম্মতি দিচ্ছি
                </span>
              </label>
            </div>

            {/* Professional Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 hover:shadow-md hover:shadow-rose-600/30 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>নিবন্ধন জমা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>নিবন্ধন সম্পন্ন করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
