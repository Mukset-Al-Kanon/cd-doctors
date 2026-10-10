'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  doctorId: string;
  doctorSlug?: string;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  walletBalance?: number;
  appointmentsCount?: number;
}

interface MenuItem {
  id: string;
  name: string;
  iconSrc?: string;
  svgIcon?: React.ReactNode;
  type: 'tab' | 'link';
  href?: string;
  badge?: string | number | null;
  external?: boolean;
}

export default function DoctorCategoryGrid({
  doctorId,
  doctorSlug,
  activeTab,
  onSelectTab,
  walletBalance,
  appointmentsCount,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Initial 8 Always-Visible Menu Items
  const primaryMenuItems: MenuItem[] = [
    {
      id: 'appointments',
      name: 'সিরিয়াল',
      iconSrc: '/images/serial-icon.png',
      type: 'tab',
      badge: appointmentsCount ? String(appointmentsCount) : null,
    },
    {
      id: 'telemedicine',
      name: 'টেলিমেডিসিন',
      iconSrc: '/images/telemedicine-icon.png',
      type: 'tab',
    },
    {
      id: 'chambers',
      name: 'চেম্বার',
      iconSrc: '/images/hospital-icon.png',
      type: 'tab',
    },
    {
      id: 'prescription',
      name: 'প্রেসক্রিপশন',
      iconSrc: '/images/doctor-icon.png',
      type: 'link',
      href: `/doctor/prescription?doctorId=${doctorId}`,
    },
    {
      id: 'tv-display',
      name: 'টিভি ডিসপ্লে',
      iconSrc: '/images/scanner-icon.png',
      type: 'link',
      href: `/doctor/tv-display?doctorId=${doctorId}`,
      external: true,
    },
    {
      id: 'assistant',
      name: 'সহকারী ডেস্ক',
      iconSrc: '/images/locker-icon.png',
      type: 'link',
      href: `/doctor/assistant?doctorId=${doctorId}`,
      external: true,
    },
    {
      id: 'wallet',
      name: 'ওয়ালেট',
      iconSrc: '/images/medicine-icon.png',
      type: 'tab',
      badge: walletBalance !== undefined ? `৳${walletBalance}` : null,
    },
    {
      id: 'packages',
      name: 'মেম্বারশিপ',
      iconSrc: '/images/health-tips-icon.png',
      type: 'tab',
    },
  ];

  // 2. Extra 4 Collapsible Menu Items
  const extraMenuItems: MenuItem[] = [
    {
      id: 'boost',
      name: 'রোগী বৃদ্ধি',
      iconSrc: '/images/ambulance-icon.png',
      type: 'tab',
    },
    {
      id: 'banner',
      name: 'চেম্বার ব্যানার',
      iconSrc: '/images/blood-icon.png',
      type: 'tab',
    },
    {
      id: 'profile',
      name: 'প্রোফাইল সেটিংস',
      iconSrc: '/images/doctor-icon.png',
      type: 'tab',
    },
    {
      id: 'public-profile',
      name: 'পাবলিক ভিউ',
      iconSrc: '/images/hospital-icon.png',
      type: 'link',
      href: doctorSlug ? `/doctors/${doctorSlug}` : `/doctors/${doctorId}`,
      external: true,
    },
  ];

  const renderItem = (item: MenuItem) => {
    const isActive = item.type === 'tab' && activeTab === item.id;

    const content = (
      <div
        className={`flex flex-col items-center group cursor-pointer active:scale-95 transition-transform w-full ${
          isActive ? 'relative' : ''
        }`}
      >
        {/* Clean Icon Container with active highlight */}
        <div className="relative w-13.5 h-13.5 xs:w-15 xs:h-15 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-200 ease-out">
          {isActive && (
            <span className="absolute inset-0 rounded-2xl bg-sky-100/70 -z-10 animate-pulse border border-sky-300/80 shadow-xs" />
          )}

          {item.iconSrc ? (
            <img
              src={item.iconSrc}
              alt={item.name}
              className={`w-12 h-12 xs:w-13.5 xs:h-13.5 object-contain select-none transition-transform duration-200 ${
                isActive ? 'scale-105' : 'group-hover:scale-105'
              }`}
            />
          ) : (
            item.svgIcon
          )}

          {/* Optional notification or item badge */}
          {item.badge && (
            <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
              {item.badge}
            </span>
          )}
        </div>

        {/* Refined Bengali Label */}
        <span
          className={`text-[11px] xs:text-[12px] text-center mt-1 tracking-tight truncate max-w-full transition-colors ${
            isActive
              ? 'font-black text-sky-800'
              : 'font-semibold text-slate-700 group-hover:text-sky-700'
          }`}
        >
          {item.name}
        </span>

        {/* Active Pill Indicator */}
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5" />
        )}
      </div>
    );

    if (item.type === 'link' && item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          className="w-full"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectTab(item.id)}
        className="w-full bg-transparent border-none p-0 cursor-pointer text-left"
      >
        {content}
      </button>
    );
  };

  return (
    <section className="w-full bg-white relative font-bengali select-none">
      {/* White Container connecting directly below the upward curve */}
      <div className="w-full bg-white pt-2.5 xs:pt-3 pb-3.5 px-2 xs:px-3 sm:px-4">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
          
          {/* Primary 4-column Grid: Always-visible initial 8 icons */}
          <div className="grid grid-cols-4 gap-y-3.5 xs:gap-y-4 gap-x-1.5 xs:gap-x-2.5 sm:gap-x-4 justify-items-center">
            {primaryMenuItems.map((item) => renderItem(item))}
          </div>

          {/* 🌟 Fluid Collapsible Drawer for Extra Menu Items */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'grid-rows-[1fr] opacity-100 pt-3.5 xs:pt-4'
                : 'grid-rows-[0fr] opacity-0 pt-0 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              <div
                className={`grid grid-cols-4 gap-x-1.5 xs:gap-x-2.5 sm:gap-x-4 justify-items-center transition-all duration-300 ease-out ${
                  isExpanded ? 'translate-y-0' : '-translate-y-3'
                }`}
              >
                {extraMenuItems.map((item) => renderItem(item))}
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
