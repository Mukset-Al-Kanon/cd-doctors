import React from 'react';
import { getSession } from '@/lib/auth';
import { STATIC_AMBULANCES } from '@/lib/staticAmbulanceData';
import AmbulanceDirectoryClientView from '@/components/AmbulanceDirectoryClientView';

export const revalidate = 0;

export default async function EmergencyAmbulancePage() {
  const session = await getSession().catch(() => null);
  const userDistrict = session?.district || 'চুয়াডাঙ্গা';

  return (
    <AmbulanceDirectoryClientView 
      initialAmbulances={STATIC_AMBULANCES} 
      userDistrict={userDistrict}
    />
  );
}

