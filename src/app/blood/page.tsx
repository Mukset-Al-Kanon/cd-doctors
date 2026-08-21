'use client';

import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Search, 
  MapPin, 
  Phone, 
  Heart, 
  UserPlus, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Info,
  Calendar,
  ShieldCheck,
  Lock,
  LogIn,
  X,
  Loader2
} from 'lucide-react';
import DonorRegistrationModal from '@/components/DonorRegistrationModal';
import { FALLBACK_DONORS } from '@/lib/staticHospitalData';

interface BloodDonor {
  id: string;
  fullName: string;
  bloodGroup: string;
  age: number;
  gender?: string;
  area: string;
  address: string;
  phone: string;
  availability: 'available' | 'unavailable';
  lastDonationDate?: string;
  note?: string;
}

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CHUADANGA_AREAS = ['All', 'Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'];

interface UserSessionInfo {
  name: string;
  email: string;
  phone?: string;
  isDonor?: boolean;
  donorStatus?: string;
  donorBloodGroup?: string;
  donorAvailability?: 'available' | 'unavailable';
}

export default function BloodDonorDirectoryPage() {
  const [donors, setDonors] = useState<BloodDonor[]>(FALLBACK_DONORS as any);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [loginModalReason, setLoginModalReason] = useState<'register' | 'call'>('call');
  const [isClosingLoginModal, setIsClosingLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSessionInfo | null>(null);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const closeLoginRequiredModal = () => {
    if (isClosingLoginModal) return;
    setIsClosingLoginModal(true);
    setTimeout(() => {
      setShowLoginRequiredModal(false);
      setIsClosingLoginModal(false);
    }, 280);
  };

  const handleToggleAvailability = async (newAvailability: 'available' | 'unavailable') => {
    try {
      setTogglingAvailability(true);
      const res = await fetch('/api/blood/toggle-availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newAvailability }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser((prev) => (prev ? { ...prev, donorAvailability: newAvailability } : null));
        fetchDonors();
      } else {
        alert(data.error || 'Failed to update donor availability.');
      }
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('openDonorModal') === 'true' && !data.user.isDonor) {
              setIsRegisterModalOpen(true);
            }
          }
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  // Lock body scroll when modal is active so popup is fixed right in viewport center
  useEffect(() => {
    if (showLoginRequiredModal) {
      setIsClosingLoginModal(false);
      document.body.style.overflow = 'hidden';
    } else if (isRegisterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginRequiredModal, isRegisterModalOpen]);

  const handleRegisterClick = () => {
    setIsClosingLoginModal(false);
    if (currentUser) {
      setIsRegisterModalOpen(true);
    } else {
      setLoginModalReason('register');
      setShowLoginRequiredModal(true);
    }
  };

  const handleCallLockClick = () => {
    setIsClosingLoginModal(false);
    setLoginModalReason('call');
    setShowLoginRequiredModal(true);
  };

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedGroup !== 'All') params.set('bloodGroup', selectedGroup);
      if (selectedArea !== 'All') params.set('area', selectedArea);
      if (searchQuery.trim() !== '') params.set('q', searchQuery.trim());

      const res = await fetch(`/api/blood?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.donors && data.donors.length > 0) {
        setDonors(data.donors);
      } else {
        // Fallback filtering on client
        const filtered = FALLBACK_DONORS.filter((donor) => {
          if (selectedGroup !== 'All' && donor.bloodGroup !== selectedGroup) return false;
          if (selectedArea !== 'All' && donor.area !== selectedArea) return false;
          if (searchQuery.trim() !== '') {
            const term = searchQuery.trim().toLowerCase();
            return (
              donor.fullName.toLowerCase().includes(term) ||
              donor.address.toLowerCase().includes(term) ||
              (donor.note && donor.note.toLowerCase().includes(term))
            );
          }
          return true;
        });
        setDonors(filtered as any);
      }
    } catch (err) {
      console.error('Failed to fetch blood donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedGroup, selectedArea]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleResetFilters = () => {
    setSelectedGroup('All');
    setSelectedArea('All');
    setSearchQuery('');
  };

  const scrollToFilters = () => {
    const filterElement = document.getElementById('search-filter-section');
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nuvicaNavy-950 via-slate-900 to-rose-950 text-white p-6 sm:p-10 border border-white/15 shadow-2xl">
        {/* Glow Effects & Decorative Watermarks */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 bottom-6 opacity-10 hidden md:block pointer-events-none transition-all duration-700 hover:scale-105">
          <Droplet className="w-56 h-56 text-rose-500 fill-rose-500" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-5">
          {/* Headline with Gradient Text */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Find a Blood Donor in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200">
              Chuadanga
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-xs sm:text-base font-semibold leading-relaxed max-w-2xl tracking-wide">
            একজন রক্তদাতা জীবন বাঁচানোর মহৎ কাজে পাশে দাঁড়ান। তাঁর সম্মান, নিরাপত্তা ও স্বাচ্ছন্দ্যকে সর্বোচ্চ গুরুত্ব দিয়ে আন্তরিকতা, কৃতজ্ঞতা ও সৌজন্যের সঙ্গে যোগাযোগ করুন।
          </p>

          {/* Donor Controls / Registration CTA */}
          <div className="pt-2">
            {currentUser?.isDonor ? (
              <div
                className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-xl ${
                  currentUser.donorAvailability === 'available'
                    ? 'bg-sky-950/80 border-sky-500/40 text-sky-100 shadow-sky-950/50'
                    : 'bg-slate-900/90 border-slate-700/60 text-slate-200 shadow-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentUser.donorAvailability === 'available'
                        ? 'bg-sky-400 animate-pulse ring-4 ring-sky-400/20'
                        : 'bg-amber-400 ring-4 ring-amber-400/20'
                    }`}
                  ></span>
                  <span className="text-xs font-bold text-slate-100">
                    Status:{' '}
                    <strong
                      className={
                        currentUser.donorAvailability === 'available'
                          ? 'text-sky-300 font-extrabold'
                          : 'text-amber-300 font-extrabold'
                      }
                    >
                      {currentUser.donorAvailability === 'available' ? 'Available' : 'Unavailable'}
                    </strong>
                    {currentUser.donorBloodGroup && (
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full font-black text-[11px] border ${
                          currentUser.donorAvailability === 'available'
                            ? 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                            : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                        }`}
                      >
                        {currentUser.donorBloodGroup}
                      </span>
                    )}
                  </span>
                </div>

                <div
                  className={`h-4 w-px hidden sm:block ${
                    currentUser.donorAvailability === 'available'
                      ? 'bg-sky-500/30'
                      : 'bg-slate-700/60'
                  }`}
                ></div>

                {currentUser.donorAvailability === 'available' ? (
                  <button
                    onClick={() => handleToggleAvailability('unavailable')}
                    disabled={togglingAvailability}
                    className="px-4 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 border border-sky-400/40 text-[11px] font-extrabold tracking-wide transition-all duration-200 ease-out hover:scale-105 active:scale-90 active:ring-4 active:ring-sky-400/30 touch-manipulation select-none disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {togglingAvailability ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Set Unavailable</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleAvailability('available')}
                    disabled={togglingAvailability}
                    className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[11px] tracking-wide transition-all duration-200 ease-out hover:scale-105 active:scale-90 active:ring-4 active:ring-sky-400/40 touch-manipulation select-none disabled:opacity-50 shadow-md shadow-sky-950/60 flex items-center gap-1.5"
                  >
                    {togglingAvailability ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Set Available</span>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="relative group/btn inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md shadow-rose-600/15 hover:shadow-rose-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-300 ease-out overflow-hidden border border-rose-400/30 cursor-pointer touch-manipulation"
                >
                  {/* Professional Light Shimmer Reflection Overlay */}
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                  
                  {/* Micro-animated Icon */}
                  <UserPlus className="relative z-10 w-4 h-4 text-white group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform duration-300 shrink-0" />
                  
                  {/* Button Label */}
                  <span className="relative z-10 tracking-wide font-extrabold">Register as a Donor</span>
                </button>
                <span className="text-xs text-rose-200 font-semibold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                  Become a blood donor and help save lives.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER SECTION */}
      <section id="search-filter-section" className="glass-nuvica p-6 rounded-3xl space-y-4">

        {/* Blood Group Quick Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" /> Select Blood Group:
          </label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((bg) => {
              const isSelected = selectedGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ease-out active:scale-95 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105 -translate-y-0.5'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/70 hover:shadow-md hover:shadow-rose-500/10 hover:-translate-y-0.5 hover:scale-105'
                  }`}
                >
                  {bg === 'All' ? 'All Blood Groups' : bg}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. DONOR RESULTS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600"></span>
            <h2 className="text-xl font-black text-nuvicaNavy-900">
              {loading ? (
                'Searching Chuadanga Donors...'
              ) : (
                <>
                  {donors.length} {selectedGroup !== 'All' ? selectedGroup : ''} Blood Donors Found
                  {selectedArea !== 'All' ? ` in ${selectedArea}` : ' in Chuadanga'}
                </>
              )}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-nuvica animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : donors.length === 0 ? (
          /* EMPTY STATE */
          <div className="glass-nuvica rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto border border-rose-100">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <Droplet className="w-8 h-8 fill-rose-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-nuvicaNavy-900">
                No approved blood donors found
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                No approved donors are currently listed for blood group{' '}
                <strong className="text-rose-600">{selectedGroup !== 'All' ? selectedGroup : 'any'}</strong>{' '}
                {selectedArea !== 'All' ? `in ${selectedArea}` : 'in Chuadanga'}.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Reset Filters
              </button>
              {!currentUser?.isDonor && (
                <button
                  onClick={handleRegisterClick}
                  className="relative group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all duration-300 ease-out overflow-hidden border border-rose-400/30 cursor-pointer"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                  <UserPlus className="relative z-10 w-3.5 h-3.5 text-white group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform duration-300 shrink-0" />
                  <span className="relative z-10">Register as a Donor</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* DONOR CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => {
              const isAvailable = donor.availability === 'available';

              return (
                <div
                  key={donor.id}
                  className="card-nuvica flex flex-col justify-between space-y-4 hover:border-rose-200 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header: Blood Group Badge & Status */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Prominent Blood Group Badge */}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                          {donor.bloodGroup}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-nuvicaNavy-900 leading-snug">
                            {donor.fullName}
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold">
                            Age: <span className="text-nuvicaNavy-900 font-bold">{donor.age} Yrs</span>
                          </p>
                        </div>
                      </div>

                      {/* Availability Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          isAvailable
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAvailable ? 'bg-sky-500 animate-pulse' : 'bg-amber-500'
                          }`}
                        ></span>
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    {/* Donor Details Card Box */}
                    <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100/80 text-xs text-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <strong className="text-nuvicaNavy-900">{donor.area}</strong>
                          <span className="text-slate-500"> ({donor.address})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className={`w-4 h-4 shrink-0 ${currentUser ? 'text-sky-700' : 'text-slate-400'}`} />
                          <span className={`font-bold truncate ${currentUser ? 'text-nuvicaNavy-900' : 'text-slate-500 tracking-wider select-none'}`}>
                            {currentUser ? donor.phone : '017•••••XXX'}
                          </span>
                        </div>

                        {!currentUser && (
                          <button
                            type="button"
                            onClick={handleCallLockClick}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-sky-100/90 hover:bg-sky-200/90 px-2 py-0.5 rounded-lg border border-sky-200/80 transition-colors shrink-0 cursor-pointer"
                          >
                            <Lock className="w-3 h-3 text-sky-600" />
                            লগইন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Call Button (Original Red Gradient Design with Auth Modal Trigger) */}
                  {currentUser ? (
                    <a
                      href={isAvailable ? `tel:${donor.phone}` : undefined}
                      className={`relative group/btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 ease-out overflow-hidden cursor-pointer ${
                        isAvailable
                          ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 text-white shadow-sm hover:shadow-md shadow-rose-600/15 hover:shadow-rose-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] border border-rose-400/30'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-not-allowed border border-slate-300/60'
                      }`}
                    >
                      {/* Light Reflection Glare Sweep */}
                      {isAvailable && (
                        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                      )}

                      {/* Micro-animated Phone Icon */}
                      <Phone className={`w-4 h-4 fill-current shrink-0 transition-transform duration-300 ${
                        isAvailable ? 'group-hover/btn:-rotate-12 group-hover/btn:scale-110 text-white' : 'text-slate-400'
                      }`} />
                      
                      <span className="relative z-10">Call Donor</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCallLockClick}
                      className="relative group/btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 text-white shadow-sm hover:shadow-md shadow-rose-600/15 hover:shadow-rose-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] border border-rose-400/30 transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                      <Phone className="w-4 h-4 fill-current shrink-0 text-white group-hover/btn:-rotate-12 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span className="relative z-10">Call Donor</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>


      {/* 5. TRUST / DISCLAIMER NOTICE */}
      <section className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-slate-500 text-xs font-semibold flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">Disclaimer:</strong> CD Doctors provides this directory to help connect people seeking blood with registered donors in Chuadanga. Donor availability may change over time, and users should confirm availability directly with the donor before making hospital or travel arrangements.
        </p>
      </section>

      {/* LOGIN REQUIRED MODAL - FULL MOBILE & DESKTOP COMPATIBLE */}
      {showLoginRequiredModal && (
        <div 
          onClick={closeLoginRequiredModal}
          className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-slate-950/75 ${
            isClosingLoginModal ? 'animate-backdrop-out' : 'animate-backdrop-in'
          }`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl p-5 sm:p-8 max-w-[340px] xs:max-w-sm sm:max-w-md w-full space-y-4 sm:space-y-5 shadow-2xl border border-slate-100 text-center relative max-h-[88vh] overflow-y-auto shrink-0 transform ${
              isClosingLoginModal
                ? 'animate-modal-spring-out'
                : 'animate-modal-spring-in'
            }`}
          >
            {/* Top Mobile Ergonomic Drag Handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-1" />

            <button
              type="button"
              onClick={closeLoginRequiredModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-90 transition-all duration-200 cursor-pointer touch-manipulation"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Container */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 shrink-0 border border-rose-100/80 shadow-xs">
              <div className="absolute inset-0 bg-rose-500/10 rounded-2xl animate-pulse" />
              <Lock className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 text-rose-600" />
            </div>

            {/* Modal Title & Message */}
            <div className="space-y-2 font-bengali">
              <h3 className="text-xl sm:text-2xl font-extrabold text-nuvicaNavy-900 tracking-tight">
                {loginModalReason === 'call'
                  ? 'রক্তদাতার নম্বরের জন্য লগইন করুন'
                  : 'রক্তদাতা নিবন্ধনের জন্য লগইন করুন'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {loginModalReason === 'call'
                  ? 'রক্তদাতার গোপনীয়তা ও নিরাপত্তা সুরক্ষার্থে মোবাইল নম্বর দেখতে এবং সরাসরি কল করতে অনুগ্রহ করে আপনার পেশেন্ট একাউন্টে লগইন করুন বা মাত্র ১ মিনিটে ফ্রি সাইন-আপ করুন।'
                  : 'প্রিয় ব্যবহারকারী, চুয়াডাঙ্গায় রক্তদাতাদের সঠিক তথ্য নিশ্চিতকরণ ও আমাদের স্বাস্থ্যসেবা কমিউনিটির নিরাপত্তা রক্ষার স্বার্থে, রক্তদাতা হিসেবে নিবন্ধন করার পূর্বে CD Doctors-এ লগইন অথবা নতুন অ্যাকাউন্ট তৈরি করা আবশ্যক।'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-bengali">
              <button
                type="button"
                onClick={closeLoginRequiredModal}
                className="w-full sm:w-1/2 py-3 px-4 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-[0.97] transition-all duration-200 cursor-pointer touch-manipulation"
              >
                বাতিল করুন
              </button>
              <a
                href={
                  loginModalReason === 'call'
                    ? '/login?redirect=/blood'
                    : '/login?redirect=/blood?openDonorModal=true'
                }
                className="w-full sm:w-1/2 relative group/btn inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:to-sky-600 text-white text-xs font-extrabold shadow-md hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.97] transition-all duration-300 overflow-hidden touch-manipulation"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                <LogIn className="w-4 h-4 z-10" /> 
                <span className="z-10">লগইন / সাইন-আপ</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      <DonorRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        currentUser={currentUser}
        onSuccess={() => {
          fetchDonors();
        }}
      />
    </div>
  );
}
