'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Video, 
  Wallet, 
  ShieldCheck, 
  FileText, 
  Monitor, 
  UserCheck, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

interface Props {
  doctor: any;
  isVerified: boolean;
  remainingDays: number;
  activePackageName?: string;
  isTelemedicineOnline: boolean;
  onToggleTelemedicine: () => void;
  onOpenRechargeModal: () => void;
  onOpenWithdrawModal: () => void;
  onSelectTab: (tabId: string) => void;
}

export default function DoctorDashboardOverview({
  doctor,
  isVerified,
  remainingDays,
  activePackageName,
  isTelemedicineOnline,
  onToggleTelemedicine,
  onOpenRechargeModal,
  onOpenWithdrawModal,
  onSelectTab,
}: Props) {
  const appointments = doctor.appointments || [];
  const completedCount = appointments.filter((a: any) => a.status === 'COMPLETED').length;
  const waitingCount = appointments.filter((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED').length;

  return (
    <div className="w-full space-y-4 font-bengali">
      
      {/* 4 Responsive KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: সিরিয়াল ও রোগী */}
        <div 
          onClick={() => onSelectTab('appointments')}
          className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500">আজকের সিরিয়াল</span>
            <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
              {appointments.length} <span className="text-xs font-bold text-slate-500">জন</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>অপেক্ষমাণ: {waitingCount} • সম্পন্ন: {completedCount}</span>
            </p>
          </div>
        </div>

        {/* KPI 2: ভিডিও কনসালটেশন */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500">ভিডিও কনসালটেশন</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              isTelemedicineOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
            }`}>
              <Video className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                isTelemedicineOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isTelemedicineOnline ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                <span>{isTelemedicineOnline ? 'লাইভ অনলাইন' : 'অফলাইন'}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleTelemedicine}
              className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer"
            >
              {isTelemedicineOnline ? 'বন্ধ করুন' : 'চালু করুন'}
            </button>
          </div>
        </div>

        {/* KPI 3: ওয়ালেট ব্যালেন্স */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500">ওয়ালেট ব্যালেন্স</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
              ৳ {(doctor.walletBalance || 0).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenRechargeModal}
                className="px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-[10.5px] font-bold transition-colors cursor-pointer"
              >
                + রিচার্জ
              </button>
            </div>
          </div>
        </div>

        {/* KPI 4: মেম্বারশিপ ও ভেরিফিকেশন */}
        <div 
          onClick={() => onSelectTab('packages')}
          className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500">মেম্বারশিপ স্ট্যাটাস</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isVerified ? (
                <>
                  <OfficialVerifiedBadge className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-sky-950">ভেরিফাইড বিশেষজ্ঞ</span>
                </>
              ) : (
                <span className="text-xs font-bold text-slate-600">ফ্রি ট্রায়াল</span>
              )}
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
              {isVerified ? `বাকি ${remainingDays} দিন` : 'আপগ্রেড'}
            </span>
          </div>
        </div>

      </div>

      {/* 🚀 Quick Action Toolbar Banner */}
      <div className="bg-gradient-to-r from-sky-700 to-sky-800 rounded-3xl p-3.5 sm:p-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs shrink-0">
            <Sparkles className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black">কুইক অ্যাকশন ও টুলস</h4>
            <p className="text-[10.5px] sm:text-[11px] text-sky-100 font-medium">প্রেসক্রিপশন তৈরি, টিভি টোকেন ডিসপ্লে ও সহকারী ডেস্ক সরাসরি ওপেন করুন</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/doctor/prescription?doctorId=${doctor.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-sky-900 font-black text-xs hover:bg-sky-50 transition-all shadow-2xs active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-sky-700" />
            <span>নতুন প্রেসক্রিপশন</span>
          </Link>

          <Link
            href={`/doctor/tv-display?doctorId=${doctor.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all backdrop-blur-xs"
          >
            <Monitor className="w-3.5 h-3.5 text-sky-200" />
            <span>টিভি ডিসপ্লে</span>
          </Link>

          <Link
            href={`/doctor/assistant?doctorId=${doctor.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all backdrop-blur-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-200" />
            <span>সহকারী ডেস্ক</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
