'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Building2, ChevronDown, Check, Search, X } from 'lucide-react';

export const BD_DIVISIONS_MAP: Record<string, string[]> = {
  'সকল বিভাগ': [],
  'খুলনা': ['চুয়াডাঙ্গা', 'কুষ্টিয়া', 'ঝিনাইদহ', 'মেহেরপুর', 'যশোর', 'খুলনা', 'বাগেরহাট', 'সাতক্ষীরা', 'মাগুরা', 'নড়াইল'],
  'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'নরসিংদী', 'টাঙ্গাইল', 'কিশোরগঞ্জ', 'ফরিদপুর', 'মাদারীপুর', 'গোপালগঞ্জ', 'রাজবাড়ী', 'শরীয়তপুর'],
  'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'নোয়াখালী', 'ফেনী', 'লক্ষ্মীপুর', 'রাঙ্গামাটি', 'বান্দরবান', 'খাগড়াছড়ি'],
  'রাজশাহী': ['রাজশাহী', 'পাবনা', 'বগুড়া', 'সিরাজগঞ্জ', 'নাটোর', 'নওগাঁ', 'চাঁপাইনবাবগঞ্জ', 'জয়পুরহাট'],
  'বরিশাল': ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
  'সিলেট': ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  'রংপুর': ['রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'গাইবান্ধা', 'নীলফামারী', 'পঞ্চগড়', 'ঠাকুরগাঁও', 'লালমনিরহাট'],
  'ময়মনসিংহ': ['ময়মনসিংহ', 'জামালপুর', 'নেত্রকোণা', 'শেরপুর'],
};

// All 64 Districts flattened
export const ALL_BD_DISTRICTS: string[] = Object.values(BD_DIVISIONS_MAP).flat();

// Helper to find parent Division for any District (e.g. "চুয়াডাঙ্গা" -> "খুলনা")
export function getDivisionByDistrict(districtName?: string | null): string {
  if (!districtName) return 'খুলনা';
  const clean = districtName.trim();
  for (const [division, districts] of Object.entries(BD_DIVISIONS_MAP)) {
    if (division === 'সকল বিভাগ') continue;
    if (districts.includes(clean)) {
      return division;
    }
  }
  return 'খুলনা';
}

// Helper to format District with Division (e.g. "চুয়াডাঙ্গা, খুলনা")
export function getDistrictWithDivision(districtName?: string | null): string {
  if (!districtName || districtName === 'সকল জেলা' || districtName === 'All') return 'বাংলাদেশ';
  const clean = districtName.trim();
  if (clean.includes(',')) return clean;
  for (const [division, districts] of Object.entries(BD_DIVISIONS_MAP)) {
    if (division === 'সকল বিভাগ') continue;
    if (districts.includes(clean)) {
      return `${clean}, ${division}`;
    }
  }
  return clean;
}

interface CustomLocationSelectorProps {
  selectedDivision: string;
  selectedDistrict: string;
  onDivisionChange: (division: string) => void;
  onDistrictChange: (district: string) => void;
  theme?: 'light' | 'dark';
}

export default function CustomLocationSelector({
  selectedDivision,
  selectedDistrict,
  onDivisionChange,
  onDistrictChange,
  theme = 'dark',
}: CustomLocationSelectorProps) {
  const [isDivisionOpen, setIsDivisionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');

  const divisionRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divisionRef.current && !divisionRef.current.contains(event.target as Node)) {
        setIsDivisionOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available districts based on selected division & search query
  const availableDistricts = useMemo(() => {
    let list = selectedDivision !== 'সকল বিভাগ' && BD_DIVISIONS_MAP[selectedDivision]
      ? BD_DIVISIONS_MAP[selectedDivision]
      : ALL_BD_DISTRICTS;

    if (districtSearch.trim()) {
      const q = districtSearch.toLowerCase().trim();
      list = list.filter((d) => d.toLowerCase().includes(q));
    }
    return list;
  }, [selectedDivision, districtSearch]);

  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-xs">
      
      {/* ---------------- 1. DIVISION SELECTOR ---------------- */}
      <div className="relative" ref={divisionRef}>
        <button
          type="button"
          onClick={() => {
            setIsDivisionOpen(!isDivisionOpen);
            setIsDistrictOpen(false);
          }}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl font-bold transition-all duration-200 cursor-pointer border ${
            isDark
              ? 'bg-white/10 hover:bg-white/15 text-white border-white/15 focus:ring-2 focus:ring-sky-400/30'
              : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200 focus:ring-2 focus:ring-sky-500/20'
          } ${isDivisionOpen ? (isDark ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-sky-500 ring-2 ring-sky-500/20') : ''}`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className={`p-1 rounded-lg ${isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
              <MapPin className="w-3.5 h-3.5 shrink-0" />
            </span>
            <span className="truncate">
              {selectedDivision === 'সকল বিভাগ' ? 'সকল বিভাগ' : `${selectedDivision} বিভাগ`}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedDivision !== 'সকল বিভাগ' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDivisionChange('সকল বিভাগ');
                  onDistrictChange('সকল জেলা');
                }}
                className={`p-0.5 rounded-md hover:bg-black/20 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                title="রিসেট করুন"
              >
                <X className="w-3 h-3" />
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              } ${isDivisionOpen ? 'rotate-180 text-sky-500' : ''}`}
            />
          </div>
        </button>

        {/* Division Custom Dropdown Popover */}
        {isDivisionOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 z-[999] rounded-2xl shadow-2xl border p-2 space-y-1 animate-fadeIn max-h-72 overflow-y-auto scrollbar-thin ${
            isDark
              ? 'bg-[#121826] border-white/20 text-white shadow-black/90'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            {Object.keys(BD_DIVISIONS_MAP).map((div) => {
              const isSelected = selectedDivision === div;
              const count = div === 'সকল বিভাগ' ? ALL_BD_DISTRICTS.length : (BD_DIVISIONS_MAP[div]?.length || 0);

              return (
                <button
                  key={div}
                  type="button"
                  onClick={() => {
                    onDivisionChange(div);
                    onDistrictChange('সকল জেলা');
                    setIsDivisionOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-sm'
                      : isDark
                        ? 'text-slate-100 hover:bg-white/10'
                        : 'text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{div}</span>
                    {div !== 'সকল বিভাগ' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count} জেলা
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- 2. DISTRICT SELECTOR (WITH SEARCH) ---------------- */}
      <div className="relative" ref={districtRef}>
        <button
          type="button"
          onClick={() => {
            setIsDistrictOpen(!isDistrictOpen);
            setIsDivisionOpen(false);
            setDistrictSearch('');
          }}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl font-bold transition-all duration-200 cursor-pointer border ${
            isDark
              ? 'bg-white/10 hover:bg-white/15 text-white border-white/15 focus:ring-2 focus:ring-sky-400/30'
              : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200 focus:ring-2 focus:ring-sky-500/20'
          } ${isDistrictOpen ? (isDark ? 'border-sky-400 ring-2 ring-sky-400/30' : 'border-sky-500 ring-2 ring-sky-500/20') : ''}`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className={`p-1 rounded-lg ${isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
              <Building2 className="w-3.5 h-3.5 shrink-0" />
            </span>
            <span className="truncate">
              {selectedDistrict === 'সকল জেলা'
                ? selectedDivision !== 'সকল বিভাগ'
                  ? `${selectedDivision}র সকল জেলা`
                  : 'সকল জেলা'
                : `${selectedDistrict} জেলা`}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedDistrict !== 'সকল জেলা' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDistrictChange('সকল জেলা');
                }}
                className={`p-0.5 rounded-md hover:bg-black/20 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                title="রিসেট করুন"
              >
                <X className="w-3 h-3" />
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              } ${isDistrictOpen ? 'rotate-180 text-sky-500' : ''}`}
            />
          </div>
        </button>

        {/* District Custom Dropdown Popover with Search */}
        {isDistrictOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 z-[999] rounded-2xl shadow-2xl border p-2 space-y-2 animate-fadeIn max-h-72 flex flex-col ${
            isDark
              ? 'bg-[#121826] border-white/20 text-white shadow-black/90'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            
            {/* Quick Search Input Inside District Popover */}
            <div className={`relative flex items-center rounded-xl px-2.5 py-1.5 border ${
              isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="জেলা খুঁজুন (যেমন: চুয়াডাঙ্গা, কুষ্টিয়া)..."
                autoFocus
                className="w-full bg-transparent text-xs placeholder-slate-400 focus:outline-none font-semibold"
              />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch('')}
                  className="p-0.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* District List */}
            <div className="overflow-y-auto max-h-48 space-y-0.5 scrollbar-thin pr-1">
              {/* Option: All Districts */}
              <button
                type="button"
                onClick={() => {
                  onDistrictChange('সকল জেলা');
                  setIsDistrictOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition-colors cursor-pointer ${
                  selectedDistrict === 'সকল জেলা'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isDark
                      ? 'text-slate-100 hover:bg-white/10'
                      : 'text-slate-700 hover:bg-sky-50'
                }`}
              >
                <span className="text-xs">
                  {selectedDivision !== 'সকল বিভাগ' ? `${selectedDivision}র সকল জেলা` : 'সকল জেলা (বাংলাদেশ)'}
                </span>
                {selectedDistrict === 'সকল জেলা' && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>

              {availableDistricts.map((dist) => {
                const isSelected = selectedDistrict === dist;
                return (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      onDistrictChange(dist);
                      // Auto set parent division if currently 'সকল বিভাগ'
                      if (selectedDivision === 'সকল বিভাগ') {
                        for (const [divName, distList] of Object.entries(BD_DIVISIONS_MAP)) {
                          if (distList.includes(dist)) {
                            onDivisionChange(divName);
                            break;
                          }
                        }
                      }
                      setIsDistrictOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-sm'
                        : isDark
                          ? 'text-slate-100 hover:bg-white/10'
                          : 'text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <span className="text-xs">{dist} জেলা</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}

              {availableDistricts.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400">
                  কোনো জেলা পাওয়া যায়নি
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
