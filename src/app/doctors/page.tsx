import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Search, MapPin } from 'lucide-react';
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
  searchParams: {
    q?: string;
    specialty?: string;
  };
}

import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';

export default async function DoctorsPage({ searchParams }: PageProps) {
  const query = (searchParams?.q || '').toLowerCase();
  const specialtyFilter = (searchParams?.specialty || '').toLowerCase();

  let doctors: any[] = [];

  try {
    const dbDoctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
        hospital: { 
          status: { in: ['ACTIVE', 'APPROVED'] }, 
          district: { slug: 'chuadanga' } 
        },
        OR: query || specialtyFilter
          ? [
              { name: { contains: query } },
              { specialization: { contains: query || specialtyFilter } },
              { degrees: { contains: query } },
              { department: { nameEn: { contains: query || specialtyFilter } } },
            ]
          : undefined,
      },
      include: {
        hospital: { include: { district: true } },
        department: true,
        schedules: true,
      },
      orderBy: { experienceYears: 'desc' },
    }).catch(() => []);

    doctors = dbDoctors || [];
  } catch (err) {
    console.error('Error fetching doctors on Vercel:', err);
  }

  if (doctors.length === 0) {
    doctors = FALLBACK_DOCTORS.filter((doc) => {
      if (!query && !specialtyFilter) return true;
      const matchQuery =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        doc.department.nameEn.toLowerCase().includes(query) ||
        doc.hospital.name.toLowerCase().includes(query);
      const matchSpecialty =
        !specialtyFilter ||
        doc.specialization.toLowerCase().includes(specialtyFilter) ||
        doc.department.nameEn.toLowerCase().includes(specialtyFilter);
      return matchQuery && matchSpecialty;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/70 via-sky-50/30 to-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-nuvicaNavy-800 mb-1">
            <MapPin className="w-4 h-4 text-sky-500" /> Chuadanga District, Bangladesh
          </div>
          <h1 className="text-3xl font-black text-nuvicaNavy-900 tracking-tight">Specialist Doctors in Chuadanga</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">
            Find expert doctors and consultants across private hospitals in Chuadanga District.
          </p>
        </div>

        {/* Search Header */}
        <form action="/doctors" method="GET" className="glass-nuvica p-4 rounded-3xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Doctor name, specialty, or degree in Chuadanga..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
            />
          </div>
          <button type="submit" className="btn-nuvica-primary text-xs !py-3 px-8">
            Search Doctors
          </button>
        </form>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => {
            const availableDayNamesSet = new Set<string>(
              doc.schedules && doc.schedules.length > 0
                ? doc.schedules.map((s: any) => DAYS_MAP[s.dayOfWeek])
                : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
            );

            return (
              <DoctorCardItem
                key={doc.id}
                doc={doc}
                ALL_WEEK_DAYS={ALL_WEEK_DAYS}
                availableDayNamesSet={availableDayNamesSet}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
