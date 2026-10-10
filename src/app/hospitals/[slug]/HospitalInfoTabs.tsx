'use client';

import React, { useState } from 'react';
import { Info, Layers, PhoneCall, MapPin, Globe, CheckCircle2, Navigation, Clock, Activity, DollarSign } from 'lucide-react';

interface HospitalInfoProps {
  hospital: {
    description: string;
    establishedYear: number | null;
    licenseNumber: string;
    emergencyPhone: string;
    phone: string;
    email: string;
    website: string | null;
    address: string;
    name: string;
    visitingHours?: string | null;
    bedStats?: string | null;
    facilities: Array<{ id: string; facilityName: string }>;
    testAvailabilities?: Array<{
      id: string;
      price: number | null;
      availabilityStatus: string;
      test?: {
        name: string;
        category: string;
      };
    }>;
  };
  mapDirectionsUrl: string;
}

export default function HospitalInfoTabs({ hospital, mapDirectionsUrl }: HospitalInfoProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'facilities' | 'tests' | 'contact'>('about');

  let parsedBeds: any = null;
  try {
    if (hospital.bedStats) {
      parsedBeds = typeof hospital.bedStats === 'string' ? JSON.parse(hospital.bedStats) : hospital.bedStats;
    }
  } catch (e) {
    parsedBeds = null;
  }

  const hasTests = hospital.testAvailabilities && hospital.testAvailabilities.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Tab Header Bar */}
      <div className="bg-slate-50/80 border-b border-slate-200/80 p-2 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'about'
              ? 'bg-nuvicaNavy-900 text-white shadow-md'
              : 'text-slate-600 hover:text-nuvicaNavy-900 hover:bg-white'
          }`}
        >
          <Info className="w-4 h-4 shrink-0" />
          About Hospital
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'facilities'
              ? 'bg-nuvicaNavy-900 text-white shadow-md'
              : 'text-slate-600 hover:text-nuvicaNavy-900 hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          Facilities ({hospital.facilities?.length || 0})
        </button>

        {hasTests && (
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tests'
                ? 'bg-nuvicaNavy-900 text-white shadow-md'
                : 'text-slate-600 hover:text-nuvicaNavy-900 hover:bg-white'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            Tests & Pricing ({hospital.testAvailabilities?.length || 0})
          </button>
        )}

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'contact'
              ? 'bg-nuvicaNavy-900 text-white shadow-md'
              : 'text-slate-600 hover:text-nuvicaNavy-900 hover:bg-white'
          }`}
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          Contact & Location
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: About Hospital */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-nuvicaNavy-900 mb-2">Hospital Profile</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {hospital.description}
              </p>
            </div>

            {/* Visiting Hours if provided */}
            {hospital.visitingHours && (
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-wider block">
                    রোগী দেখার সময়সূচি (Visiting Hours)
                  </span>
                  <strong className="text-xs sm:text-sm font-black text-amber-950 mt-0.5 block">
                    {hospital.visitingHours}
                  </strong>
                </div>
              </div>
            )}

            {/* Live Bed & ICU Counter if provided */}
            {parsedBeds && (
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    লাইভ বেড ও আইসিইউ স্ট্যাটাস (Live Bed Counter)
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-400">রিয়েল-টাইম আপডেট</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block">আইসিইউ (ICU)</span>
                    <strong className="text-base font-black text-rose-700 block mt-0.5">
                      {parsedBeds.icuAvailable ?? 0} <span className="text-xs text-slate-400 font-normal">/ {parsedBeds.icuTotal ?? 0}</span>
                    </strong>
                    <span className="text-[9.5px] font-bold text-rose-600">ফাঁকা সিট</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block">জেনারেল বেড</span>
                    <strong className="text-base font-black text-emerald-700 block mt-0.5">
                      {parsedBeds.generalBedsAvailable ?? 0} <span className="text-xs text-slate-400 font-normal">/ {parsedBeds.generalBedsTotal ?? 0}</span>
                    </strong>
                    <span className="text-[9.5px] font-bold text-emerald-600">ফাঁকা বেড</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block">কেবিন</span>
                    <strong className="text-base font-black text-sky-700 block mt-0.5">
                      {parsedBeds.cabinAvailable ?? 0} <span className="text-xs text-slate-400 font-normal">/ {parsedBeds.cabinTotal ?? 0}</span>
                    </strong>
                    <span className="text-[9.5px] font-bold text-sky-600">ফাঁকা রুম</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-center shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 block">সেন্ট্রাল অক্সিজেন</span>
                    <strong className="text-sm font-black text-teal-700 block mt-1">
                      {parsedBeds.oxygenStatus || 'সক্রিয় চালু'}
                    </strong>
                    <span className="text-[9.5px] font-bold text-teal-600">২৪/৭ সাপ্লাই</span>
                  </div>
                </div>
              </div>
            )}

            {/* Exact Reference 3-Card Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100/80">
                <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">
                  24/7 Emergency Hotline
                </span>
                <strong className="text-base font-black text-rose-700 mt-0.5 block">
                  {hospital.emergencyPhone}
                </strong>
              </div>

              <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100/80">
                <span className="text-[10px] font-extrabold text-nuvicaNavy-700 uppercase tracking-wider block">
                  Established Year
                </span>
                <strong className="text-base font-black text-nuvicaNavy-900 mt-0.5 block">
                  {hospital.establishedYear || 'N/A'}
                </strong>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100/80">
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                  BMDC / License Reg
                </span>
                <strong className="text-xs font-black text-emerald-900 mt-0.5 block truncate">
                  {hospital.licenseNumber}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hospital Facilities */}
        {activeTab === 'facilities' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-nuvicaNavy-900">Medical Facilities & Units</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(hospital.facilities || []).map((fac) => (
                <div
                  key={fac.id}
                  className="flex items-center gap-2.5 text-xs font-bold text-nuvicaNavy-900 bg-sky-50/60 px-4 py-3 rounded-2xl border border-sky-100/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{fac.facilityName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Diagnostic & Lab Tests */}
        {activeTab === 'tests' && hasTests && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-nuvicaNavy-900">Diagnostic & Lab Tests Pricing</h3>
              <span className="text-xs font-bold text-slate-500">
                {hospital.testAvailabilities?.length || 0} টি টেস্টের তালিকা
              </span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">টেস্টের নাম</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">প্রাপ্যতা</th>
                    <th className="py-3 px-4 text-right">মূল্য (টাকা ৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {hospital.testAvailabilities?.map((ta) => (
                    <tr key={ta.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-black text-slate-900">
                        {ta.test?.name || 'ল্যাব টেস্ট'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {ta.test?.category || 'General'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            ta.availabilityStatus === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {ta.availabilityStatus === 'AVAILABLE' ? 'পাওয়া যায়' : 'সাময়িক বন্ধ'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900">
                        {ta.price ? `৳ ${ta.price}` : 'আলোচনা সাপেক্ষে'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-nuvicaNavy-900">Hospital Location & Direct Phone</h3>
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-nuvicaNavy-900 block font-extrabold text-xs mb-0.5">Address:</strong>
                    <span>{hospital.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <PhoneCall className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <strong className="text-nuvicaNavy-900 block font-extrabold text-xs mb-0.5">Telephone:</strong>
                    <span>{hospital.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                  <Globe className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <strong className="text-nuvicaNavy-900 block font-extrabold text-xs mb-0.5">Official Website:</strong>
                    {hospital.website ? (
                      <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 font-bold hover:underline">
                        {hospital.website}
                      </a>
                    ) : (
                      <span className="text-slate-400">No website provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-50/70 p-6 rounded-3xl border border-sky-100 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="badge-mint text-[10px] uppercase">Navigation</span>
                <h4 className="font-extrabold text-base text-nuvicaNavy-900">Find Directions on Map</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Open Google Maps for turn-by-turn navigation directly to {hospital.name}.
                </p>
              </div>

              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-nuvica-primary text-xs !py-3 justify-center shadow-md"
              >
                <Navigation className="w-4 h-4 text-nuvicaMint-400" />
                Open Google Maps Navigation
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
