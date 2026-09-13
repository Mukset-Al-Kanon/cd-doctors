import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';
import DoctorsClientView from './DoctorsClientView';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    q?: string;
    specialty?: string;
    district?: string;
  };
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const query = searchParams?.q || '';
  const specialtyFilter = searchParams?.specialty || 'all';
  const paramDistrict = searchParams?.district;

  const session = await getSession().catch(() => null);
  const userDistrict = paramDistrict || session?.district || null;

  let doctors: any[] = [];

  try {
    const dbDoctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        hospital: { include: { district: { include: { division: true } } } },
        department: true,
        schedules: true,
      },
      orderBy: { experienceYears: 'desc' },
    }).catch(() => []);

    doctors = dbDoctors || [];
  } catch (err) {
    console.error('Error fetching doctors:', err);
  }

  // Use fallback doctors if database has none
  if (doctors.length === 0) {
    doctors = FALLBACK_DOCTORS;
  }

  return (
    <DoctorsClientView
      initialDoctors={doctors}
      initialQuery={query}
      initialSpecialty={specialtyFilter}
      initialUserDistrict={userDistrict}
    />
  );
}
