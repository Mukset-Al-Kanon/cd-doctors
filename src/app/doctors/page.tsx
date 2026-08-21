import React from 'react';
import { db } from '@/lib/db';
import { FALLBACK_DOCTORS } from '@/lib/staticHospitalData';
import DoctorsClientView from './DoctorsClientView';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    q?: string;
    specialty?: string;
  };
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const query = searchParams?.q || '';
  const specialtyFilter = searchParams?.specialty || 'all';

  let doctors: any[] = [];

  try {
    const dbDoctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
        hospital: { 
          status: { in: ['ACTIVE', 'APPROVED'] }, 
          district: { slug: 'chuadanga' } 
        },
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
    />
  );
}
