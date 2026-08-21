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
  Calendar
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
    <div className="space-y-10 pb-16">
      {/* Cover Header Banner */}
      <div className="relative h-64 sm:h-80 bg-nuvicaNavy-900 overflow-hidden">
        <img
          src={hospital.coverUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80'}
          alt={hospital.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nuvicaNavy-950 via-nuvicaNavy-950/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute bottom-6 inset-x-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-2xl border border-white/20 shrink-0">
              <img
                src={hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80'}
                alt={hospital.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="badge-mint text-[10px] uppercase tracking-wider">{hospital.hospitalType}</span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">{hospital.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                {hospital.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nuvica-mint text-xs shadow-lg !py-2.5"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
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
