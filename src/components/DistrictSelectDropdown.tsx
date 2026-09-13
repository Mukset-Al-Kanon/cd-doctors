'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Search, ChevronDown, Check, X } from 'lucide-react';

export interface DistrictInfo {
  nameBn: string;
  nameEn: string;
  aliases: string[];
}

// 🇧🇩 All 64 Districts of Bangladesh Sorted in Bengali Alphabetical Order (অ-হ)
export const ALL_64_DISTRICTS: DistrictInfo[] = [
  // ক
  { nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', aliases: ['coxsbazar', 'coxs bazar', 'coxbazar', 'cox', 'koxbazar', 'koxsbazar', 'kox'] },
  { nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', aliases: ['kishoreganj', 'kishoregonj', 'kisorganj', 'kisoregonj', 'kishorganj'] },
  { nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', aliases: ['kurigram', 'kuri', 'kurigrom', 'kurigramm'] },
  { nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', aliases: ['kushtia', 'kustia', 'kustiya', 'kushtiya'] },
  { nameBn: 'কুমিল্লা', nameEn: 'Cumilla', aliases: ['cumilla', 'comilla', 'kumilla', 'komilla'] },

  // খ
  { nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', aliases: ['khagrachhari', 'khagrachari', 'khagrachori', 'khagrachhori'] },
  { nameBn: 'খুলনা', nameEn: 'Khulna', aliases: ['khulna', 'kulna', 'khulnah'] },

  // গ
  { nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', aliases: ['gaibandha', 'gaybandha', 'gaibanda', 'gaybanda'] },
  { nameBn: 'গাজীপুর', nameEn: 'Gazipur', aliases: ['gazipur', 'gajipur', 'gazipure'] },
  { nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', aliases: ['gopalganj', 'gopalgonj', 'gopalgunj'] },

  // চ
  { nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', aliases: ['chattogram', 'chittagong', 'ctg', 'chatogram', 'chitagon', 'chottogram'] },
  { nameBn: 'চাঁদপুর', nameEn: 'Chandpur', aliases: ['chandpur', 'cadpur', 'chandpore'] },
  { nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', aliases: ['chapainawabganj', 'chapai', 'nawabganj', 'chapainababgonj', 'chapainobabgonj'] },
  { nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', aliases: ['chuadanga', 'cuadanga', 'chua', 'chuadangga', 'chuadangah'] },

  // জ
  { nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', aliases: ['joypurhat', 'jaipurhat', 'joypur', 'jaipoorhat'] },
  { nameBn: 'জামালপুর', nameEn: 'Jamalpur', aliases: ['jamalpur', 'zamalpur', 'jamalpore'] },

  // ঝ
  { nameBn: 'ঝালকাঠি', nameEn: 'Jhalokathi', aliases: ['jhalokathi', 'jhalakati', 'jhalakathi', 'jhalokati', 'jhalkathi'] },
  { nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', aliases: ['jhenaidah', 'jhenaidha', 'jenaidah', 'jhenaidaha', 'jinaidaha', 'jinaidah'] },

  // ট
  { nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', aliases: ['tangail', 'tangailh', 'tangayel'] },

  // ঠ
  { nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', aliases: ['thakurgaon', 'thakurgon', 'thakurgoan'] },

  // ঢ
  { nameBn: 'ঢাকা', nameEn: 'Dhaka', aliases: ['dhaka', 'dacca', 'daka', 'dhakah'] },

  // দ
  { nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', aliases: ['dinajpur', 'dinajpore', 'dinajpurr'] },

  // ন
  { nameBn: 'নওগাঁ', nameEn: 'Naogaon', aliases: ['naogaon', 'nogaon', 'nowgaon', 'nawgaon'] },
  { nameBn: 'নড়াইল', nameEn: 'Narail', aliases: ['narail', 'norail', 'narayel'] },
  { nameBn: 'নরসিংদী', nameEn: 'Narsingdi', aliases: ['narsingdi', 'norsingdi', 'narsindi'] },
  { nameBn: 'নাটোর', nameEn: 'Natore', aliases: ['natore', 'nator', 'natorh'] },
  { nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', aliases: ['narayanganj', 'narayangonj', 'narayongonj', 'narayonganj'] },
  { nameBn: 'নীলফামারী', nameEn: 'Nilphamari', aliases: ['nilphamari', 'nilfamari', 'nilfamary'] },
  { nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', aliases: ['netrokona', 'netrakona', 'netrokona'] },
  { nameBn: 'নোয়াখালী', nameEn: 'Noakhali', aliases: ['noakhali', 'noyakhali', 'noakhaly'] },

  // প
  { nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', aliases: ['panchagarh', 'panchagor', 'ponchogor', 'panchagar'] },
  { nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', aliases: ['patuakhali', 'patuakhaly', 'potuakhali'] },
  { nameBn: 'পাবনা', nameEn: 'Pabna', aliases: ['pabna', 'pabnah'] },
  { nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', aliases: ['pirojpur', 'perojpur', 'pirozpur', 'pirojpoor'] },

  // ফ
  { nameBn: 'ফরিদপুর', nameEn: 'Faridpur', aliases: ['faridpur', 'foridpur', 'faridpore'] },
  { nameBn: 'ফেনী', nameEn: 'Feni', aliases: ['feni', 'pheni', 'feni'] },

  // ব
  { nameBn: 'বগুড়া', nameEn: 'Bogura', aliases: ['bogura', 'bogra', 'bagura', 'bogurah', 'boguraa'] },
  { nameBn: 'বরগুনা', nameEn: 'Barguna', aliases: ['barguna', 'borguna', 'bargunah'] },
  { nameBn: 'বরিশাল', nameEn: 'Barishal', aliases: ['barishal', 'barisal', 'borisal', 'borishal'] },
  { nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', aliases: ['bagerhat', 'bagerhaat', 'bagherhat'] },
  { nameBn: 'বান্দরবান', nameEn: 'Bandarban', aliases: ['bandarban', 'bandarbon', 'bandarbaan'] },
  { nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', aliases: ['brahmanbaria', 'bbaria', 'b.baria', 'b-baria', 'bhramonbaria', 'brahmanbariah'] },

  // ভ
  { nameBn: 'ভোলা', nameEn: 'Bhola', aliases: ['bhola', 'vola', 'bholah'] },

  // ম
  { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', aliases: ['mymensingh', 'moymensingh', 'mymensing', 'moymensing', 'mymonsingh'] },
  { nameBn: 'মাগুরা', nameEn: 'Magura', aliases: ['magura', 'magurah'] },
  { nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', aliases: ['manikganj', 'manikgonj', 'manikgunj'] },
  { nameBn: 'মাদারীপুর', nameEn: 'Madaripur', aliases: ['madaripur', 'madaripore'] },
  { nameBn: 'মুন্সিগঞ্জ', nameEn: 'Munshiganj', aliases: ['munshiganj', 'munshigonj', 'munsiganj'] },
  { nameBn: 'মেহেরপুর', nameEn: 'Meherpur', aliases: ['meherpur', 'mehorpur', 'meherpore'] },
  { nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', aliases: ['moulvibazar', 'moulavibazar', 'maulvibazar', 'molvibazar', 'moulvibazer'] },

  // য
  { nameBn: 'যশোর', nameEn: 'Jashore', aliases: ['jashore', 'jessore', 'joshor', 'jashor', 'jeshore'] },

  // র
  { nameBn: 'রংপুর', nameEn: 'Rangpur', aliases: ['rangpur', 'rongpur', 'rongpore', 'rangpore', 'rongpurr', 'rangpurr'] },
  { nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', aliases: ['rangamati', 'rongamati', 'rangamaty'] },
  { nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', aliases: ['rajbari', 'rajbary', 'razbari'] },
  { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', aliases: ['rajshahi', 'rajshaye', 'rajshahy'] },

  // ল
  { nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', aliases: ['lakshmipur', 'laxmipur', 'lokkhipur', 'laksmipur'] },
  { nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', aliases: ['lalmonirhat', 'lalmonirhaat', 'lalmonir'] },

  // শ
  { nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', aliases: ['shariatpur', 'sariatpur', 'shoriotpur', 'shariatpore'] },
  { nameBn: 'শেরপুর', nameEn: 'Sherpur', aliases: ['sherpur', 'serpur', 'sherpore'] },

  // স
  { nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', aliases: ['satkhira', 'shatkhira', 'satkhirah'] },
  { nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', aliases: ['sirajganj', 'sirajgonj', 'serajganj'] },
  { nameBn: 'সিলেট', nameEn: 'Sylhet', aliases: ['sylhet', 'silhet', 'silet', 'sylhett'] },
  { nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', aliases: ['sunamganj', 'sunamgonj', 'shunamganj'] },

  // হ
  { nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', aliases: ['habiganj', 'habigonj', 'hobiganj', 'hobigonj'] },
].sort((a, b) => a.nameBn.localeCompare(b.nameBn, 'bn'));

// 🔍 Phonetic & Vowel-Agnostic Normalizer for English / Banglish transliteration search
function toBanglishPhonetic(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/['`\.\-_,\s]/g, '')
    .replace(/ph/g, 'f')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/bh/g, 'b')
    .replace(/v/g, 'b')
    .replace(/z/g, 'j')
    .replace(/w/g, 'o')
    .replace(/y/g, 'i')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/o/g, 'a') // o and a interchange (e.g. rongpur vs rangpur, bogra vs bagra, borisal vs barisal)
    .replace(/u/g, 'a') // u and a interchange (e.g. bogura vs bogra)
    .replace(/e/g, 'i'); // e and i interchange (e.g. jessore vs jashore)
}

// 📏 Levenshtein Distance for fuzzy typo tolerance
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// 🎯 Robust matcher matching direct substring, phonetic variation, or fuzzy similarity
function isDistrictMatch(district: DistrictInfo, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  // 1. Direct Bengali substring
  if (district.nameBn.includes(q)) return true;

  // 2. Direct English name or Alias substring match
  if (district.nameEn.toLowerCase().includes(q)) return true;
  for (const alias of district.aliases) {
    if (alias.toLowerCase().includes(q)) return true;
  }

  // 3. Phonetic normalizer match (e.g. "rongpur" matches "rangpur", "borisal" matches "barisal")
  const normQ = toBanglishPhonetic(q);
  if (normQ.length >= 2) {
    const normEn = toBanglishPhonetic(district.nameEn);
    if (normEn.includes(normQ) || normQ.includes(normEn)) return true;
    for (const alias of district.aliases) {
      const normAlias = toBanglishPhonetic(alias);
      if (normAlias.includes(normQ) || normQ.includes(normAlias)) return true;
    }
  }

  // 4. Fuzzy edit distance match for typos
  if (q.length >= 3) {
    const en = district.nameEn.toLowerCase();
    if (levenshteinDistance(q, en) <= 2) return true;
    for (const alias of district.aliases) {
      if (levenshteinDistance(q, alias.toLowerCase()) <= (q.length <= 4 ? 1 : 2)) return true;
    }
  }

  return false;
}

interface DistrictSelectDropdownProps {
  value: string;
  onChange: (district: string) => void;
  label?: string;
  className?: string;
}

export default function DistrictSelectDropdown({
  value,
  onChange,
  label = 'আপনার জেলা / লোকেশন',
  className = '',
}: DistrictSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Current selected district name in Bengali
  const selectedDistrictName = useMemo(() => {
    if (!value || value === 'সকল জেলা' || value === 'All') return 'সকল জেলা';
    const found = ALL_64_DISTRICTS.find(
      (d) => d.nameBn === value || d.nameEn.toLowerCase() === (value || '').toLowerCase()
    );
    if (found) return found.nameBn;
    return value || 'সকল জেলা';
  }, [value]);

  // Filtered districts using robust fuzzy/phonetic search
  const filteredDistricts = useMemo(() => {
    return ALL_64_DISTRICTS.filter((d) => isDistrictMatch(d, search));
  }, [search]);

  return (
    <div className={`space-y-1.5 relative select-none font-bengali ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-slate-700 block">
          {label}
        </label>
      )}

      {/* Simple Clean Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-2xl bg-slate-50/90 hover:bg-white border transition-all duration-200 px-3.5 py-3 shadow-2xs group cursor-pointer text-left ${
          isOpen
            ? 'border-sky-500 bg-white ring-4 ring-sky-500/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
            {selectedDistrictName}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-sky-600' : ''
          }`}
        />
      </button>

      {/* Simple Clean Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-[9999] bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Simple Search Input */}
          <div className="relative flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 focus-within:bg-white focus-within:border-sky-500 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="জেলা খুঁজুন (যেমন: rongpur, dhaka, bogra)..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 64 District List in Bengali Alphabetical Order */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 overscroll-contain">
            {(!search || 'সকল জেলা সমগ্র বাংলাদেশ all'.includes(search.toLowerCase())) && (
              <button
                type="button"
                onClick={() => {
                  onChange('সকল জেলা');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDistrictName === 'সকল জেলা'
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>সকল জেলা (সমগ্র বাংলাদেশ)</span>
                {selectedDistrictName === 'সকল জেলা' && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
              </button>
            )}
            {filteredDistricts.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                কোনো জেলা পাওয়া যায়নি
              </div>
            ) : (
              filteredDistricts.map((item) => {
                const isSelected = selectedDistrictName === item.nameBn;
                return (
                  <button
                    key={item.nameBn}
                    type="button"
                    onClick={() => {
                      onChange(item.nameBn);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.nameBn}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
