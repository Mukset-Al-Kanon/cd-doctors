'use client';

import React, { useState } from 'react';
import { Info, Layers, PhoneCall, MapPin, Globe, CheckCircle2, Navigation, ShieldCheck } from 'lucide-react';

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
    facilities: Array<{ id: string; facilityName: string }>;
  };
  mapDirectionsUrl: string;
}

export default function HospitalInfoTabs({ hospital, mapDirectionsUrl }: HospitalInfoProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'facilities' | 'contact'>('about');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Tab Header Bar */}
      <div className="bg-slate-50/80 border-b border-slate-200/80 p-2 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
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
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'facilities'
              ? 'bg-nuvicaNavy-900 text-white shadow-md'
              : 'text-slate-600 hover:text-nuvicaNavy-900 hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          Hospital Facilities ({hospital.facilities.length})
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
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
              {hospital.facilities.map((fac) => (
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

        {/* Tab 3: Contact & Location */}
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
