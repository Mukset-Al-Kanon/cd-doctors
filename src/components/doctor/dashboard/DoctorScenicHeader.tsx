'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu, X, ExternalLink, LogOut, CheckCircle2, ShieldCheck, Sparkles, UserCheck, Monitor, FileText } from 'lucide-react';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

interface Props {
  doctor: {
    id: string;
    name: string;
    photoUrl?: string;
    specialization?: string;
    degrees?: string;
    hospital?: { name: string; address?: string };
    chamberAddress?: string;
    district?: string;
    slug?: string;
    walletBalance?: number;
    subscriptionExpiresAt?: string;
    unreadNotificationsCount?: number;
  };
  isVerified: boolean;
  onOpenMobileNav: () => void;
  onLogout?: () => void;
  activeTab: string;
  onSelectTab: (tabId: any) => void;
}

export default function DoctorScenicHeader({
  doctor,
  isVerified,
  onOpenMobileNav,
  onLogout,
  activeTab,
  onSelectTab,
}: Props) {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const displaySubtitle = doctor.specialization || doctor.degrees || doctor.hospital?.name || doctor.district || 'চুয়াডাঙ্গা';

  return (
    <>
      {/* 🌟 SCENIC MEDICAL ART HEADER (Identical to Homepage Header) */}
      <header className="sticky top-0 z-40 w-full aspect-[2.75/1] min-h-[135px] max-h-[165px] overflow-hidden bg-[#73B0EB] font-bengali select-none shadow-xs">
        {/* Layer 1: Scenic Medical Artwork Background (Full Wide Panoramic Display) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img 
            src="/images/mobile-header-medical-art.png" 
            alt="Medical Header Artwork" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Layer 2: Soft Sky Vignette for Text Legibility */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 30, 65, 0.40) 0%, rgba(8, 30, 65, 0.08) 50%, rgba(8, 30, 65, 0.15) 100%)'
          }}
        />

        {/* Layer 3: Doctor Greeting & Actions Row (Positioned gracefully in header) */}
        <div className="relative z-10 w-full pt-8 xs:pt-10 pb-3 px-3.5 xs:px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            
            {/* Doctor Avatar, Name & Specialization */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                onClick={() => onSelectTab('profile')}
                className="relative w-[40px] h-[40px] xs:w-[44px] xs:h-[44px] rounded-full border-2 border-white overflow-hidden shadow-sm bg-white/20 shrink-0 cursor-pointer active:scale-95 transition-transform"
                title="প্রোফাইল সেটিংস"
              >
                <img
                  src={doctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left flex flex-col justify-center pt-0.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 max-w-[200px] xs:max-w-[230px] sm:max-w-xs">
                  <h1 className="text-[15px] xs:text-[16px] sm:text-[17px] font-black text-white leading-tight tracking-tight truncate min-w-0">
                    {doctor.name}
                  </h1>
                  {isVerified && <OfficialVerifiedBadge className="w-4 h-4 shrink-0" />}
                </div>
                <div className="text-[11px] xs:text-[11.5px] text-white/95 font-medium pt-0.5 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-200 shrink-0" />
                  <span className="truncate">{displaySubtitle}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Notification Bell + Hamburger Menu */}
            <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setNotificationModalOpen(true)}
                className="w-[36px] h-[36px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/30 cursor-pointer relative shadow-sm"
                aria-label="Notifications"
                title="নোটিফিকেশন"
              >
                <Bell className="w-3.5 h-3.5 text-white" />
                {Boolean(doctor.unreadNotificationsCount) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenMobileNav}
                className="w-[36px] h-[36px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 border border-white/30 cursor-pointer relative shadow-sm"
                aria-label="Menu"
                title="ডাক্তার মেনু"
              >
                <Menu className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

          </div>
        </div>

        {/* Layer 4: Seamless Upward White Bottom Curve */}
        <div className="absolute -bottom-0.5 left-0 right-0 h-4 xs:h-5 bg-[#73B0EB] pointer-events-none z-20">
          <div className="w-full h-full bg-white rounded-t-[14px] xs:rounded-t-[16px] sm:rounded-t-[18px] shadow-[0_-3px_10px_rgba(4,20,50,0.06)]" />
        </div>
      </header>

      {/* 🔔 Notifications Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 font-bengali">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">ডাক্তার নোটিফিকেশন</h4>
              </div>
              <button 
                onClick={() => setNotificationModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-sky-900">
                  <span>সিরিয়াল সার্ভিস সক্রিয়</span>
                  <span className="text-[10px] text-sky-600">আজ</span>
                </div>
                <p className="text-slate-600 text-[11px]">আপনার আজকের রোগী দেখার সিরিয়াল ও টিভি ডিসপ্লে সম্পূর্ণ প্রস্তুত রয়েছে।</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>ভেরিফাইড বিশেষজ্ঞ ব্যাজ</span>
                  <span className="text-[10px] text-emerald-600">অ্যাক্টিভ</span>
                </div>
                <p className="text-slate-600 text-[11px]">আপনার প্রোফাইল সফলভাবে ভেরিফাইড এবং পাবলিক ডিরেক্টরিতে শীর্ষে প্রদর্শিত হচ্ছে।</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotificationModalOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
}
