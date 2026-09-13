'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DoctorIllustratedIcon,
  TelemedicineIllustratedIcon,
  HospitalIllustratedIcon,
  SerialIllustratedIcon,
  BloodIllustratedIcon,
  MedicineIllustratedIcon,
  LockerIllustratedIcon,
  ScannerIllustratedIcon,
  AmbulanceIllustratedIcon,
  HealthTipsIllustratedIcon,
} from './CategoryIcons';

interface CategoryItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  { 
    id: 'doctors', 
    name: 'ডাক্তার', 
    href: '/doctors', 
    icon: DoctorIllustratedIcon,
  },
  { 
    id: 'telemedicine', 
    name: 'টেলিমেডিসিন', 
    href: '/telemedicine', 
    icon: TelemedicineIllustratedIcon,
  },
  { 
    id: 'hospitals', 
    name: 'হাসপাতাল', 
    href: '/hospitals', 
    icon: HospitalIllustratedIcon,
  },
  { 
    id: 'serial-tracker', 
    name: 'সিরিয়াল', 
    href: '/serial-tracker', 
    icon: SerialIllustratedIcon,
  },
  { 
    id: 'blood', 
    name: 'রক্তদান', 
    href: '/blood', 
    icon: BloodIllustratedIcon,
  },
  { 
    id: 'medicine', 
    name: 'মেডিসিন', 
    href: '/patient/med-schedule', 
    icon: MedicineIllustratedIcon,
  },
  { 
    id: 'vault', 
    name: 'লকার', 
    href: '/patient/vault', 
    icon: LockerIllustratedIcon,
  },
  { 
    id: 'scanner', 
    name: 'স্ক্যানার', 
    href: '/patient/scanner', 
    icon: ScannerIllustratedIcon,
  },
  { 
    id: 'emergency', 
    name: 'অ্যাম্বুলেন্স', 
    href: '/emergency', 
    icon: AmbulanceIllustratedIcon,
  },
  { 
    id: 'health-tips', 
    name: 'স্বাস্থ্যবার্তা', 
    href: '/health-tips', 
    icon: HealthTipsIllustratedIcon,
  },
];

export default function HomeCategoryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialCategories = CATEGORIES.slice(0, 8);
  const extraCategories = CATEGORIES.slice(8);

  return (
    <section className="md:hidden w-full bg-white relative font-bengali">
      {/* White Area with Clean Top Spacing connecting seamlessly below the header's upward curve */}
      <div className="w-full bg-white pt-2.5 xs:pt-3 pb-3.5 px-2 xs:px-3">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
          {/* Primary 4-column Grid: Always-visible initial 8 icons */}
          <div className="grid grid-cols-4 gap-y-3.5 xs:gap-y-4 gap-x-1.5 xs:gap-x-2.5 justify-items-center">
            {initialCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform w-full"
                >
                  {/* Clean Icon Container with slightly larger size */}
                  <div className="w-13.5 h-13.5 xs:w-15 xs:h-15 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-200 ease-out">
                    <Icon className="w-12 h-12 xs:w-13.5 xs:h-13.5" />
                  </div>

                  {/* Refined Bengali Label */}
                  <span className="text-[11px] xs:text-[12px] font-semibold text-slate-700 text-center mt-1 tracking-tight group-hover:text-sky-700 transition-colors truncate max-w-full">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* 🌟 Ultra-Smooth Fluid Collapsible Drawer for Extra Categories */}
          <div 
            className={`grid transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'grid-rows-[1fr] opacity-100 pt-3.5 xs:pt-4' 
                : 'grid-rows-[0fr] opacity-0 pt-0 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              <div 
                className={`grid grid-cols-4 gap-x-1.5 xs:gap-x-2.5 justify-items-center transition-all duration-300 ease-out ${
                  isExpanded ? 'translate-y-0' : '-translate-y-3'
                }`}
              >
                {extraCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform w-full"
                    >
                      {/* Clean Icon Container */}
                      <div className="w-13.5 h-13.5 xs:w-15 xs:h-15 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-200 ease-out">
                        <Icon className="w-12 h-12 xs:w-13.5 xs:h-13.5" />
                      </div>

                      {/* Refined Bengali Label */}
                      <span className="text-[11px] xs:text-[12px] font-semibold text-slate-700 text-center mt-1 tracking-tight group-hover:text-sky-700 transition-colors truncate max-w-full">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 'আরও' / 'কম দেখুন' Toggle Button */}
          <div className="flex justify-center mt-3 xs:mt-3.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11.5px] xs:text-xs font-semibold text-slate-600 hover:text-sky-700 bg-slate-100/90 hover:bg-sky-50 transition-all border border-slate-200/60 active:scale-95 cursor-pointer shadow-2xs select-none"
            >
              <span>{isExpanded ? 'কম দেখুন' : 'আরও'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                  isExpanded ? 'rotate-180 text-sky-600' : 'text-slate-500'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
