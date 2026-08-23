import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Star, 
  ArrowRight,
  UserCheck,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import HospitalInfoTabs from './HospitalInfoTabs';
import DoctorCardItem from '@/components/DoctorCardItem';

export const revalidate = 0;

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ALL_WEEK_DAYS = [
  { full: 'Saturday', short: 'Sat' },
  { full: 'Sunday', short: 'Sun' },
  { full: 'Monday', short: 'Mon' },
  { full: 'Tuesday', short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday', short: 'Thu' },
  { full: 'Friday', short: 'Fri' },
];

interface PageProps {
  params: {
    slug: string;
  };
}

import { FALLBACK_HOSPITALS } from '@/lib/staticHospitalData';

export default async function HospitalProfilePage({ params }: PageProps) {
  let hospital: any = null;

  try {
    hospital = await db.hospital.findUnique({
      where: { slug: params.slug },
      include: {
        district: { include: { division: true } },
        facilities: true,
        doctors: {
          where: { status: 'ACTIVE' },
          include: { schedules: true },
        },
      },
    }).catch(() => null);
  } catch (err) {
    console.error('Error fetching hospital by slug, using fallback:', err);
  }

  if (!hospital) {
    hospital = FALLBACK_HOSPITALS.find((h) => h.slug === params.slug) || null;
  }

  if (!hospital) {
    notFound();
  }

  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hospital.name + ' ' + hospital.address
  )}`;

  const defaultDocPhoto = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-10 pb-16 pt-4 sm:pt-6">
      {/* 🌟 EXACT REFERENCE HOSPITAL PROFILE CARD UI */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[32px] sm:rounded-[40px] p-3.5 sm:p-6 border border-slate-200/80 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          
          {/* Top Banner Cover Photo */}
          <div className="relative h-44 sm:h-56 w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-gradient-to-r from-pink-200 via-rose-100 to-amber-100 shadow-inner">
            <img
              src={hospital.coverUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80'}
              alt={hospital.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Avatar & Action Buttons Row (55% of Avatar overlaps the banner) */}
          <div className="flex items-end justify-between px-3 sm:px-4 -mt-[64px] sm:-mt-[82px] relative z-10 mb-3">
            {/* Circular Profile Avatar (Left Aligned - 55% Over Banner) */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl ring-2 ring-slate-100/80 bg-white shrink-0 overflow-hidden">
              <img
                src={hospital.logoUrl || hospital.coverUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80'}
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Buttons (Right Aligned) */}
            <div className="flex items-center gap-2 pb-1">
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
                title="গুগল ম্যাপে দিকনির্দেশনা দেখুন"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Profile Details (Name, Handle, About) */}
          <div className="px-3 sm:px-4 space-y-3 pt-1">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {hospital.name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500 text-white shrink-0" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
                @{hospital.slug || 'chuadanga_hospital'} • <span className="text-sky-600 font-bold">{hospital.hospitalType || 'হাসপাতাল ও ডায়াগনস্টিক'}</span>
              </p>
            </div>

            {/* About Section */}
            <div className="space-y-1 pt-1">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                About
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {hospital.description}
              </p>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{hospital.address}</span>
              </p>
            </div>

            {/* 📊 Bottom 3-Column Stats Row */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-left">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {(hospital.doctors || []).length}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5 block">
                  ডাক্তার (Doctors)
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {(hospital.facilities || []).length || 6}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5 block">
                  বিভাগ (Depts)
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ২৪/৭
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-400 mt-0.5 block">
                  জরুরি সেবা (24/7)
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Doctors Section */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Medical Experts</span>
              <h2 className="text-2xl font-black text-nuvicaNavy-900 tracking-tight">Specialist Doctors</h2>
            </div>
            <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {(hospital.doctors || []).length} Doctors Available
            </span>
          </div>

          {(!hospital.doctors || hospital.doctors.length === 0) ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 text-sm font-medium shadow-sm">
              No doctors scheduled for this hospital currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {hospital.doctors.map((doc: any) => {
                const availableDayNamesSet = new Set<string>(
                  doc.schedules && doc.schedules.length > 0
                    ? doc.schedules.map((s: any) => DAYS_MAP[s.dayOfWeek])
                    : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
                );

                return (
                  <DoctorCardItem
                    key={doc.id}
                    doc={{ ...doc, hospital: { name: hospital.name, slug: hospital.slug } }}
                    ALL_WEEK_DAYS={ALL_WEEK_DAYS}
                    availableDayNamesSet={availableDayNamesSet}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Executive Hospital Information Tabbed Panel */}
        <HospitalInfoTabs hospital={hospital} mapDirectionsUrl={mapDirectionsUrl} />
      </div>
    </div>
  );
}
