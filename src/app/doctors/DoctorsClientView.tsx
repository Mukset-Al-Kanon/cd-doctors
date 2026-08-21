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
}

export default function DoctorsClientView({
  initialDoctors,
  initialQuery = '',
  initialSpecialty = 'all',
}: DoctorsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filter doctors based on search query & selected category
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

      return matchesQuery && matchesSpecialty;
    });
  }, [initialDoctors, searchQuery, selectedSpecialty]);

  // Compute counts per category for badge counters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialDoctors.length };
    
    SPECIALTY_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      const cnt = initialDoctors.filter((doc) => {
        const docText = `
          ${doc.specialization || ''} 
          ${doc.department?.nameEn || ''} 
          ${doc.department?.nameBn || ''} 
          ${doc.degrees || ''} 
          ${doc.bio || ''}
        `.toLowerCase();
        return cat.keywords.some((kw) => docText.includes(kw.toLowerCase()));
      }).length;
      counts[cat.id] = cnt;
    });

    return counts;
  }, [initialDoctors]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
  };

  const isFiltered = searchQuery.trim() !== '' || selectedSpecialty !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-sky-50/20 to-slate-100/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* 🌟 HERO & SEARCH HEADER SECTION */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nuvicaNavy-950 via-slate-900 to-sky-950 text-white p-6 sm:p-10 shadow-xl border border-white/10">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-4 sm:space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                চুয়াডাঙ্গার <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-200 to-teal-200">বিশেষজ্ঞ ডাক্তার</span> তালিকা
              </h1>
            </div>

            {/* Search Input Box */}
            <div>
              <div className="relative flex items-center bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/40 focus-within:ring-4 focus-within:ring-sky-400/30 transition-all">
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5 text-sky-600" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ডাক্তারের নাম, বিভাগ বা স্পেশালিটি খুঁজুন (যেমন: হৃদরোগ, গাইনি, ডা. মাহবুবুর)..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-semibold py-2 px-1"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer mr-1"
                    title="ক্লিয়ার করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="hidden sm:flex items-center pr-2 pl-3 border-l border-slate-200 text-xs font-bold text-slate-500 shrink-0">
                  <span>{toBanglaDigits(filteredDoctors.length)} জন ডাক্তার</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🏷️ SPECIALTY FILTER PILLS (CATEGORY BAR WITH EXPAND / MINIMIZE) */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm transition-all duration-300">
          
          {/* Entire Header Row is Clickable Trigger */}
          <div 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center justify-between gap-2 cursor-pointer select-none -m-1 p-1 rounded-2xl hover:bg-slate-50/80 transition-colors"
            title={isFilterExpanded ? 'ফিল্টার মিনিমাইজ করতে ক্লিক করুন' : 'ফিল্টার দেখতে যেকোনো জায়গায় ক্লিক করুন'}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-extrabold text-nuvicaNavy-950 group-hover:text-sky-700 transition-colors text-left flex-1 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shadow-2xs shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="truncate">বিশেষজ্ঞ বিভাগ অনুযায়ী ফিল্টার করুন:</span>
                {!isFilterExpanded && selectedSpecialty !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100 shadow-2xs shrink-0">
                    🎯 {SPECIALTY_CATEGORIES.find((c) => c.id === selectedSpecialty)?.labelBn}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isFiltered && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetFilters();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-rose-100 shadow-2xs"
                  title="ফিল্টার রিসেট করুন"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">রিসেট</span>
                </button>
              )}

              <div
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-700 transition-all border border-slate-200/80 shadow-2xs"
                aria-label="ফিল্টার টগল করুন"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isFilterExpanded ? 'rotate-180 text-sky-600' : 'text-slate-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ULTRA-SMOOTH ACCORDION COLLAPSIBLE FILTER PILLS */}
          <div className={`accordion-smooth-wrapper ${isFilterExpanded ? 'open-card' : ''}`}>
            <div className="accordion-smooth-inner">
              <div className="pt-3.5 border-t border-slate-100 mt-3.5">
                {/* Scrollable / Wrapping Pills */}
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_CATEGORIES.map((cat) => {
                    const isSelected = selectedSpecialty === cat.id;
                    const count = categoryCounts[cat.id] ?? 0;

                    // Hide empty specialty categories if they have 0 doctors (except 'all')
                    if (cat.id !== 'all' && count === 0) return null;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedSpecialty(cat.id)}
                        className={`group inline-flex items-center px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer select-none border ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/25 scale-[1.02]'
                            : 'bg-slate-50 hover:bg-sky-50/80 text-slate-700 hover:text-sky-800 border-slate-200/80 hover:border-sky-200'
                        }`}
                      >
                        <span>{cat.labelBn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

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
