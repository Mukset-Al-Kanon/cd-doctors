import React from 'react';
import { db } from '@/lib/db';
import HospitalsClientView from './HospitalsClientView';

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
  const districtSlug = searchParams?.district || 'chuadanga';

  const hospitals = await db.hospital.findMany({
    where: {
      status: { in: ['ACTIVE', 'APPROVED'] },
      district: { slug: districtSlug },
    },
    include: {
      district: { include: { division: true } },
      facilities: true,
      _count: { select: { doctors: true, departments: true, reviews: true } },
    },
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
  });

  return (
    <HospitalsClientView
      initialHospitals={hospitals}
      initialQuery={query}
      initialType={typeFilter}
    />
  );
}

