'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  ArrowUpRight, 
  Info, 
  ChevronDown, 
  UserCheck, 
  Stethoscope, 
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface DoctorCardProps {
  doc: {
    id: string;
    name: string;
    degrees: string;
    specialization: string;
    photoUrl?: string | null;
    phone?: string | null;
    experienceYears: number;
    consultationFee: number;
    chamberRoom: string;
    bio?: string | null;
    department?: {
      nameEn: string;
      nameBn: string;
    } | null;
    hospital?: {
      name: string;
      slug: string;
      phone?: string | null;
    } | null;
    schedules?: any[];
  };
  ALL_WEEK_DAYS: { full: string; short: string }[];
  availableDayNamesSet: Set<string>;
}

const BANGLA_DAYS_MAP: Record<string, string> = {
  Sat: 'শনি',
  Sun: 'রবি',
  Mon: 'সোম',
  Tue: 'মঙ্গ',
  Wed: 'বুধ',
  Thu: 'বৃহ',
  Fri: 'শুক্র',
};

export default function DoctorCardItem({ doc, ALL_WEEK_DAYS, availableDayNamesSet }: DoctorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card-nuvica flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
      <div className="space-y-3">
        {/* Top Profile Header */}
        <div className="flex items-start gap-4">
          <img
            src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
            alt={doc.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-2 border-white shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <span className="bg-sky-50 text-sky-700 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg border border-sky-100/90 inline-block mb-0.5 truncate max-w-full">
              {doc.department?.nameBn || doc.department?.nameEn || doc.specialization}
            </span>
            <h3 className="font-extrabold text-base text-nuvicaNavy-900 leading-snug">{doc.name}</h3>
            <p className="text-xs text-slate-500 leading-tight font-medium">{doc.degrees}</p>
            <p className="text-xs font-extrabold text-sky-700">{doc.specialization}</p>
          </div>
        </div>

        {/* Hospital & Weekly Schedule Card */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs text-slate-700 shadow-2xs">
          {doc.hospital?.name && (
            <p className="flex items-center gap-2 font-black text-nuvicaNavy-900 text-xs">
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">{doc.hospital.name}</span>
            </p>
          )}

          {/* Days Grid */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5 shadow-2xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-nuvicaNavy-900 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" /> চেম্বারের দিনসমূহ:
            </span>
            <div className="grid grid-cols-7 gap-1 text-center pt-0.5">
              {ALL_WEEK_DAYS.map((day) => {
                const isAvailable = availableDayNamesSet.has(day.full) || availableDayNamesSet.has(day.short);
                const dayBn = BANGLA_DAYS_MAP[day.short] || day.short;
                return (
                  <span
                    key={day.full}
                    title={`${day.full}: ${isAvailable ? 'খোলা' : 'বন্ধ'}`}
                    className={`py-1.5 px-0.5 text-[11px] font-extrabold rounded-xl transition-all block text-center whitespace-nowrap ${
                      isAvailable
                        ? 'bg-sky-500 text-white shadow-2xs border border-sky-400 font-black'
                        : 'bg-slate-100/80 text-slate-400 border border-slate-200/60 line-through decoration-slate-300 font-medium opacity-50'
                    }`}
                  >
                    {dayBn}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Fee & Experience Row */}
          <div className="pt-2.5 border-t border-slate-200/70 flex justify-between font-bold text-xs text-slate-700">
            <span>ভিজিট ফি: <strong className="text-sky-700 font-black">৳{doc.consultationFee} টাকা</strong></span>
            <span>অভিজ্ঞতা: <strong className="text-nuvicaNavy-900 font-black">{doc.experienceYears} বছর</strong></span>
          </div>
        </div>

        {/* Expandable Accordion: Experience & Treated Diseases */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors cursor-pointer border border-sky-100"
        >
          <span className="flex items-center gap-1.5 tracking-wide font-bold">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            অভিজ্ঞতা ও চিকিৎসাসমূহ
          </span>
          <ChevronDown
            className={`w-4 h-4 text-sky-600 transition-transform duration-300 ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showDetails && (
          <div className="pt-2.5 space-y-3.5 border-t border-slate-100 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-nuvicaNavy-900 uppercase tracking-wide flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                ডাক্তারের বিবরণ:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                {doc.bio || `${doc.name} একজন অভিজ্ঞ ও সুনামধন্য ${doc.specialization}। তিনি দীর্ঘকাল ধরে অত্যন্ত দক্ষতার সাথে আধুনিক ও মানসম্মত চিকিৎসাসেবা প্রদান করে আসছেন।`}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-nuvicaNavy-900 uppercase tracking-wide flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                যেসব রোগের চিকিৎসাসেবা প্রদান করেন:
              </span>
              <div className="space-y-1">
                {(doc as any).treatedDiseases
                  ? (doc as any).treatedDiseases
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 p-1.5 px-2.5 bg-sky-50/70 rounded-lg border border-sky-100 text-[11px] font-bold text-slate-800 tracking-wide">
                          <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))
                  : [
                      'উচ্চ রক্তচাপ ও হৃদরোগের চিকিৎসা',
                      'দীর্ঘমেয়াদী রোগ ও পরামর্শ',
                      'বিশেষজ্ঞ স্বাস্থ্য পরামর্শ',
                      'জরুরি কেয়ার ও পুনর্বাসন'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-1.5 px-2.5 bg-sky-50/70 rounded-lg border border-sky-100 text-[11px] font-bold text-slate-800 tracking-wide">
                        <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direct Phone Call CTA Button (Normal direct calling for all users) */}
      <a
        href={`tel:${doc.phone || doc.hospital?.phone || '+88076162588'}`}
        className="w-full btn-nuvica-primary text-xs sm:text-sm font-bold tracking-wide !py-3 justify-center rounded-2xl shadow-xs cursor-pointer flex items-center gap-2"
        title={`সরাসরি সিরিয়ালের জন্য কল করুন: ${doc.phone || doc.hospital?.phone || ''}`}
      >
        <PhoneCall className="w-4 h-4 text-sky-300 shrink-0" />
        <span className="tracking-wide">সিরিয়ালের জন্য কল করুন</span>
      </a>
    </div>
  );
}
