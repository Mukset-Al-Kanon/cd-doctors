'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building2,
  Filter,
  ArrowRight,
  Check,
  Phone,
  Stethoscope,
  LayoutGrid,
  List,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  X,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Activity,
  HeartPulse,
  Award,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

export interface HospitalItem {
  id: string;
  name: string;
  slug: string;
  hospitalType: string;
  status: string;
  isFeatured: boolean;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string | null;
  establishedYear?: number | null;
  description: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  district: {
    nameEn: string;
    nameBn: string;
    slug: string;
    division: {
      nameEn: string;
    };
  };
  facilities: Array<{
    id: string;
    facilityName: string;
    isAvailable: boolean;
  }>;
  _count: {
    doctors: number;
    departments: number;
    reviews: number;
  };
}

interface HospitalsClientViewProps {
  initialHospitals: HospitalItem[];
  initialQuery?: string;
  initialType?: string;
}

const UPAZILAS = [
  'Chuadanga Sadar',
  'Alamdanga',
  'Damurhuda',
  'Jibannagar',
];

const POPULAR_FACILITIES = [
  '24/7 Emergency',
  'ICU',
  'Blood Bank',
  'Ambulance',
  'Diagnostic Lab',
  'Surgery',
  'Pharmacy',
  'Oxygen Plant',
];

export default function HospitalsClientView({
  initialHospitals,
  initialQuery = '',
  initialType = 'all',
}: HospitalsClientViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'doctors' | 'name' | 'type'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual router refresh call
  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Toggle Facility Filter
  const toggleFacility = (facilityName: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityName)
        ? prev.filter((f) => f !== facilityName)
        : [...prev, facilityName]
    );
  };

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setAreaFilter('all');
    setSelectedFacilities([]);
    setSortBy('featured');
  };

  // Calculate filtered and sorted hospitals
  const filteredHospitals = useMemo(() => {
    return initialHospitals
      .filter((hospital) => {
        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = hospital.name.toLowerCase().includes(q);
          const matchDesc = hospital.description.toLowerCase().includes(q);
          const matchAddr = hospital.address.toLowerCase().includes(q);
          const matchFacility = hospital.facilities.some((f) =>
            f.facilityName.toLowerCase().includes(q)
          );
          if (!matchName && !matchDesc && !matchAddr && !matchFacility) {
            return false;
          }
        }

        // Type filter matching
        if (typeFilter !== 'all' && hospital.hospitalType !== typeFilter) {
          return false;
        }

        // Area filter matching
        if (areaFilter !== 'all') {
          const addr = hospital.address.toLowerCase();
          if (!addr.includes(areaFilter.toLowerCase())) {
            return false;
          }
        }

        // Selected facilities matching
        if (selectedFacilities.length > 0) {
          const hospitalFacilityNames = hospital.facilities.map((f) =>
            f.facilityName.toLowerCase()
          );
          const hasAllFacilities = selectedFacilities.every((fac) => {
            const facLower = fac.toLowerCase();
            return (
              hospitalFacilityNames.some((hFac) => hFac.includes(facLower)) ||
              hospital.description.toLowerCase().includes(facLower)
            );
          });
          if (!hasAllFacilities) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'doctors') {
          return b._count.doctors - a._count.doctors;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'type') {
          return a.hospitalType.localeCompare(b.hospitalType);
        }
        return 0;
      });
  }, [initialHospitals, searchQuery, typeFilter, areaFilter, selectedFacilities, sortBy]);

  // Aggregate stats
  const totalDoctorsCount = useMemo(() => {
    return initialHospitals.reduce((acc, h) => acc + (h._count.doctors || 0), 0);
  }, [initialHospitals]);

  const featuredHospitals = useMemo(() => {
    return initialHospitals.filter((h) => h.isFeatured);
  }, [initialHospitals]);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (typeFilter !== 'all' ? 1 : 0) +
    (areaFilter !== 'all' ? 1 : 0) +
    selectedFacilities.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 via-sky-50/30 to-slate-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Compact & Professional Search & Category Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
          {/* Live Search Input */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border border-slate-200 focus-within:border-sky-500 rounded-2xl p-1 transition-all">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="হাসপাতালের নাম বা ঠিকানা লিখে খুঁজুন..."
              className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition mr-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Type Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-extrabold text-slate-600 mr-1 flex items-center gap-1.5 shrink-0">
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" /> ক্যাটাগরি:
            </span>
            {[
              { label: 'সকল হাসপাতাল', value: 'all' },
              { label: 'প্রাইভেট হাসপাতাল', value: 'Private Hospital' },
              { label: 'ক্লিনিক', value: 'Clinic' },
              { label: 'ডায়াগনস্টিক সেন্টার', value: 'Diagnostic Center' },
            ].map((t) => {
              const isSelected = typeFilter === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-2xs border border-sky-600/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Summary Counter & View Mode Toggle */}
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
          <div>
            Showing <strong className="text-nuvicaNavy-900 font-black">{filteredHospitals.length} active hospitals</strong> in Chuadanga
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="গ্রিড ভিউ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="লিস্ট ভিউ"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredHospitals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No Hospitals Match Your Criteria</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any hospitals matching your current search query or active filter parameters.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="btn-nuvica-primary text-xs !py-2.5 !px-6 mx-auto inline-flex items-center gap-2"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters & View All
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredHospitals.map((hospital) => {
              const displayedFacilities = hospital.facilities.slice(0, 4);
              const extraFacilitiesCount = Math.max(0, hospital.facilities.length - 4);

              return (
                <div
                  key={hospital.id}
                  className="bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Portion: Cover Image, Overlay Badges, Logo & Title */}
                  <div className="space-y-4">
                    {/* Cover Banner (16:9) */}
                    <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-t-3xl">
                      <div className="w-full h-full rounded-t-3xl overflow-hidden relative">
                        <img
                          src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                          alt={hospital.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                      </div>

                      {/* Logo Avatar overlapping cover bottom left - PROMINENT WHITE BORDER */}
                      <div className="absolute -bottom-9 left-5 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 border-2 border-white shadow-xl overflow-hidden shrink-0 z-20">
                        <img
                          src={hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80'}
                          alt={hospital.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>

                    {/* Info Content */}
                    <div className="px-5 pt-10 space-y-3">
                      <div>
                        <h3 className="font-black text-lg text-nuvicaNavy-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-1">
                          <Link href={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span>{hospital.address}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {hospital.description}
                      </p>

                      {/* Doctor Count Badge */}
                      <div className="pt-1 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-xl font-extrabold border border-sky-100/90 text-xs">
                          <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span><strong className="text-sky-900 font-black">{hospital._count.doctors}</strong> জন বিশেষজ্ঞ ডাক্তার</span>
                        </span>
                      </div>

                      {/* Facility Tags */}
                      {displayedFacilities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {displayedFacilities.map((f) => (
                            <span
                              key={f.id}
                              className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-sky-500 shrink-0" />
                              {f.facilityName}
                            </span>
                          ))}
                          {extraFacilitiesCount > 0 && (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200/60 px-2 py-1 rounded-lg">
                              +{extraFacilitiesCount}টি আরও
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer - Clean 2-Button Grid */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 mt-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      {hospital.phone ? (
                        <a
                          href={`tel:${hospital.phone}`}
                          className="relative w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-900 border border-sky-200/90 hover:border-sky-400 text-xs font-extrabold shadow-2xs hover:shadow-md hover:shadow-sky-500/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-1.5 overflow-hidden group/btn"
                          title={`সরাসরি জরুরি ফোন: ${hospital.phone}`}
                        >
                          {/* Light Shimmer Glare */}
                          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-sky-200/40 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                          <PhoneCall className="relative z-10 w-3.5 h-3.5 text-sky-600 group-hover/btn:text-sky-700 group-hover/btn:rotate-12 group-hover/btn:scale-115 transition-transform duration-300 shrink-0" />
                          <span className="relative z-10">হটলাইন</span>
                        </a>
                      ) : null}

                      <Link
                        href={`/hospitals/${hospital.slug}`}
                        className={`relative w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white text-xs font-extrabold shadow-sm hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group/detail ${hospital.phone ? '' : 'col-span-2'}`}
                      >
                        {/* Light Shimmer Glare */}
                        <span className="absolute inset-0 -translate-x-full group-hover/detail:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                        <span className="relative z-10">বিস্তারিত</span> 
                        <ArrowRight className="relative z-10 w-3.5 h-3.5 text-white group-hover/detail:translate-x-1 group-hover/detail:scale-110 transition-transform duration-300 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-4">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  {/* Circular Logo Avatar - Prominent White Border */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-50 p-1 border-2 border-white shadow-lg overflow-hidden shrink-0">
                    <img
                      src={hospital.logoUrl || hospital.coverUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80'}
                      alt={hospital.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
                        {hospital.hospitalType}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 truncate group-hover:text-sky-600 transition-colors">
                      <Link href={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      {hospital.address}
                    </p>

                    {/* Facilities inline list */}
                    {hospital.facilities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-600">
                        {hospital.facilities.slice(0, 3).map((f) => (
                          <span key={f.id} className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3 text-sky-500 shrink-0" />
                            {f.facilityName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 gap-3 shrink-0">
                  <div className="text-xs text-slate-600 font-semibold text-right">
                    <div>
                      <strong className="text-nuvicaNavy-900 font-black text-sm">{hospital._count.doctors}</strong> জন বিশেষজ্ঞ ডাক্তার
                    </div>
                    {hospital.establishedYear && (
                      <div className="text-[11px] text-slate-400">স্থাপিত: {hospital.establishedYear}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {hospital.phone && (
                      <a
                        href={`tel:${hospital.phone}`}
                        className="btn-nuvica-hotline"
                        title={`সরাসরি জরুরি ফোন: ${hospital.phone}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>হটলাইন</span>
                      </a>
                    )}
                    <Link
                      href={`/hospitals/${hospital.slug}`}
                      className="btn-nuvica-primary text-xs !py-2.5 !px-4"
                    >
                      বিস্তারিত <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
