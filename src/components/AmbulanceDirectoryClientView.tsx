'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  PhoneCall, 
  MapPin, 
  Search, 
  X, 
  Truck, 
  PlusCircle, 
  CheckCircle2, 
  Phone, 
  UserPlus, 
  Activity, 
  Wind, 
  Snowflake
} from 'lucide-react';
import { AmbulanceItem } from '@/lib/staticAmbulanceData';
import DistrictSelectDropdown from '@/components/DistrictSelectDropdown';

interface AmbulanceDirectoryClientViewProps {
  initialAmbulances: AmbulanceItem[];
  userDistrict?: string | null;
}

const AMBULANCE_TYPES = [
  { id: 'All', label: 'সকল' },
  { id: 'AC', label: 'এসি' },
  { id: 'ICU', label: 'আইসিইউ' },
  { id: 'FREEZER', label: 'ফ্রিজার' },
  { id: 'NON_AC', label: 'নন-এসি' },
];

function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 11) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return phone;
}

function getTypeBadgeText(type: string): string {
  switch (type) {
    case 'ICU':
      return 'ICU';
    case 'AC':
      return 'AC';
    case 'FREEZER':
      return 'FRZ';
    case 'NON_AC':
      return 'NON';
    default:
      return type.slice(0, 3).toUpperCase();
  }
}

export default function AmbulanceDirectoryClientView({
  initialAmbulances,
  userDistrict,
}: AmbulanceDirectoryClientViewProps) {
  const [ambulances, setAmbulances] = useState<AmbulanceItem[]>(initialAmbulances);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(userDistrict || 'চুয়াডাঙ্গা');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Driver registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    driverName: '',
    driverPhone: '',
    type: 'AC' as 'ICU' | 'AC' | 'NON_AC' | 'FREEZER',
    district: userDistrict || 'চুয়াডাঙ্গা',
    upazila: 'চুয়াডাঙ্গা সদর',
    locationDetails: '',
    regNumber: '',
    vehicleModel: '',
  });
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Filter logic
  const filteredAmbulances = useMemo(() => {
    return ambulances.filter((amb) => {
      const matchDistrict = 
        !selectedDistrict || 
        selectedDistrict === 'সকল জেলা' || 
        amb.district.includes(selectedDistrict) || 
        selectedDistrict.includes(amb.district);

      const matchType = selectedType === 'All' || amb.type === selectedType;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q ||
        amb.name.toLowerCase().includes(q) ||
        amb.driverName.toLowerCase().includes(q) ||
        amb.driverPhone.includes(q) ||
        amb.locationDetails.toLowerCase().includes(q) ||
        amb.upazila.toLowerCase().includes(q) ||
        amb.regNumber.toLowerCase().includes(q);

      return matchDistrict && matchType && matchQuery;
    }).sort((a, b) => {
      if (a.isAvailable === b.isAvailable) return 0;
      return a.isAvailable ? -1 : 1;
    });
  }, [ambulances, selectedDistrict, selectedType, searchQuery]);

  const handleResetFilters = () => {
    setSelectedType('All');
    setSearchQuery('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.driverPhone) {
      alert('অনুগ্রহ করে নাম ও মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    setRegLoading(true);
    setTimeout(() => {
      const newAmb: AmbulanceItem = {
        id: `amb-${Date.now()}`,
        name: regForm.name,
        type: regForm.type,
        typeNameBn: 
          regForm.type === 'ICU' ? 'আইসিইউ' :
          regForm.type === 'AC' ? 'এসি' :
          regForm.type === 'FREEZER' ? 'ফ্রিজার' : 'সাধারণ',
        district: regForm.district,
        upazila: regForm.upazila,
        locationDetails: regForm.locationDetails || regForm.upazila,
        driverName: regForm.driverName || 'চালক',
        driverPhone: regForm.driverPhone,
        regNumber: regForm.regNumber || 'রেজিস্ট্রেশন প্রক্রিয়াধীন',
        vehicleModel: regForm.vehicleModel || 'Ambulance',
        isAvailable: true,
        facilities: ['অক্সিজেন', 'স্ট্রেচার'],
        approxFare: 'আলোচনা সাপেক্ষে',
        rating: 5.0,
        totalTrips: 1,
      };

      setAmbulances((prev) => [newAmb, ...prev]);
      setRegLoading(false);
      setRegSuccess(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-12 space-y-6 sm:space-y-8 font-bengali">
      
      {/* 🌟 1. SLEEK MINIMAL HERO HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-nuvicaNavy-950 via-slate-900 to-rose-950 text-white p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              ২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {selectedDistrict && selectedDistrict !== 'সকল জেলা' ? `${selectedDistrict} অ্যাম্বুলেন্স ডিরেক্টরি` : 'জরুরি অ্যাম্বুলেন্স ডিরেক্টরি'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              নিকটস্থ খালি অ্যাম্বুলেন্স খুঁজুন এবং সরাসরি চালককে কল দিন।
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => {
                setRegSuccess(false);
                setIsRegisterModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              + অ্যাম্বুলেন্স যুক্ত করুন
            </button>
          </div>

        </div>
      </section>

      {/* 🌟 2. SIMPLE MINIMAL FILTER & SEARCH */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {AMBULANCE_TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* District Selector & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
          <div className="md:col-span-1">
            <DistrictSelectDropdown
              value={selectedDistrict}
              onChange={(dist) => setSelectedDistrict(dist)}
              label="জেলা"
            />
          </div>

          <div className="md:col-span-2 relative flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 focus-within:bg-white focus-within:border-rose-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অ্যাম্বুলেন্সের নাম, চালক বা এলাকা দিয়ে খুঁজুন..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </section>

      {/* 🌟 3. ULTRA-MINIMAL AMBULANCE CARDS */}
      <section className="space-y-4">
        
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
          <span>উপলব্ধ অ্যাম্বুলেন্স: <strong className="text-slate-800 font-extrabold">{filteredAmbulances.length} টি</strong></span>
          {(searchQuery || selectedType !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="text-rose-600 hover:underline cursor-pointer"
            >
              ফিল্টার রিসেট
            </button>
          )}
        </div>

        {filteredAmbulances.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-slate-200">
            <p className="font-bold text-slate-700 text-sm">কোনো অ্যাম্বুলেন্স পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">অন্য জেলা বা ফিল্টার দিয়ে চেষ্টা করুন অথবা ৯৯৯ এ কল করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAmbulances.map((amb) => {
              const isAvailable = amb.isAvailable;

              return (
                <div
                  key={amb.id}
                  className="card-nuvica flex flex-col justify-between space-y-4 hover:border-rose-200 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header: Type Badge & Status */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Prominent Red Squircle Badge */}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                          {getTypeBadgeText(amb.type)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-nuvicaNavy-900 leading-snug">
                            {amb.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold">
                            Driver: <span className="text-nuvicaNavy-900 font-bold">{amb.driverName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Availability Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 ${
                          isAvailable
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAvailable ? 'bg-sky-500 animate-pulse' : 'bg-amber-500'
                          }`}
                        />
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    {/* Details Box */}
                    <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100/80 text-xs text-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <strong className="text-nuvicaNavy-900">{amb.upazila}</strong>
                          <span className="text-slate-500"> ({amb.locationDetails})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 text-sky-700 shrink-0" />
                        <span className="font-bold text-nuvicaNavy-900">
                          {amb.driverPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call Button (Identical to Call Donor in Blood Section) */}
                  <a
                    href={isAvailable ? `tel:${amb.driverPhone}` : undefined}
                    className={`relative group/btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 ease-out overflow-hidden cursor-pointer ${
                      isAvailable
                        ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 text-white shadow-sm hover:shadow-md shadow-rose-600/15 hover:shadow-rose-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] border border-rose-400/30'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-not-allowed border border-slate-300/60'
                    }`}
                  >
                    {isAvailable && (
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                    )}

                    <Phone className={`w-4 h-4 fill-current shrink-0 transition-transform duration-300 ${
                      isAvailable ? 'group-hover/btn:-rotate-12 group-hover/btn:scale-110 text-white' : 'text-slate-400'
                    }`} />
                    
                    <span className="relative z-10">Call Ambulance</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* 🌟 4. ONBOARDING MODAL */}
      {isRegisterModalOpen && (
        <div 
          onClick={() => setIsRegisterModalOpen(false)}
          className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-bengali"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">অ্যাম্বুলেন্স যুক্ত করুন</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {regSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">অ্যাম্বুলেন্স সফলভাবে যুক্ত হয়েছে!</p>
                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  সম্পন্ন
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">অ্যাম্বুলেন্সের নাম *</label>
                  <input
                    type="text"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="যেমন: আল-মদিনা এসি অ্যাম্বুলেন্স"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ধরন *</label>
                    <select
                      value={regForm.type}
                      onChange={(e) => setRegForm({ ...regForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                    >
                      <option value="AC">এসি</option>
                      <option value="ICU">আইসিইউ</option>
                      <option value="FREEZER">ফ্রিজার</option>
                      <option value="NON_AC">নন-এসি</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">উপজেলা *</label>
                    <input
                      type="text"
                      value={regForm.upazila}
                      onChange={(e) => setRegForm({ ...regForm, upazila: e.target.value })}
                      placeholder="যেমন: চুয়াডাঙ্গা সদর"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">চালকের নাম</label>
                    <input
                      type="text"
                      value={regForm.driverName}
                      onChange={(e) => setRegForm({ ...regForm, driverName: e.target.value })}
                      placeholder="মোঃ রফিকুল"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      value={regForm.driverPhone}
                      onChange={(e) => setRegForm({ ...regForm, driverPhone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all mt-2"
                >
                  {regLoading ? 'যুক্ত হচ্ছে...' : 'যুক্ত করুন'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
