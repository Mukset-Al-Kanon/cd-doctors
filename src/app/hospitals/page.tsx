import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import HospitalsClientView from './HospitalsClientView';
import { FALLBACK_HOSPITALS } from '@/lib/staticHospitalData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams?: {
    q?: string;
    type?: string;
    district?: string;
  };
}

export default async function HospitalsPage({ searchParams }: PageProps) {
  const query = searchParams?.q || '';
  const typeFilter = searchParams?.type || 'all';
  const paramDistrict = searchParams?.district;

  const session = await getSession().catch(() => null);
  const userDistrict = paramDistrict || session?.district || null;

  let hospitals: any[] = FALLBACK_HOSPITALS;

  try {
    const dbHospitals = await db.hospital.findMany({
      where: {
        status: { in: ['ACTIVE', 'APPROVED'] },
      },
      include: {
        district: { include: { division: true } },
        facilities: true,
        _count: { select: { doctors: true, departments: true, reviews: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    }).catch(() => []);

    if (dbHospitals && dbHospitals.length > 0) {
      hospitals = dbHospitals;
    }
  } catch (err) {
    console.error('Error fetching hospitals on Vercel, using fallback:', err);
  }

  return (
    <HospitalsClientView
      initialHospitals={hospitals}
      initialQuery={query}
      initialType={typeFilter}
      initialUserDistrict={userDistrict}
    />
  );
}

