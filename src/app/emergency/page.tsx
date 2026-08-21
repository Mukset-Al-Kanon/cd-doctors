import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import EmergencyHelplinesList from '@/components/EmergencyHelplinesList';

export const revalidate = 0;

const DEFAULT_HOTLINES = [
  {
    id: 'def-1',
    title: 'National Emergency Service (Toll-Free)',
    number: '999',
    desc: 'Police, Ambulance & Fire Service Emergency Helpline',
    badge: 'National 24/7',
    icon: 'ShieldAlert',
  },
  {
    id: 'def-2',
    title: 'Chuadanga Sadar Hospital Emergency',
    number: '+880 761-63105',
    desc: '24/7 Outdoor Emergency, ICU & Patient Admission',
    badge: 'Chuadanga Sadar',
    icon: 'Building2',
  },
  {
    id: 'def-3',
    title: 'Chuadanga Specialized Hospital Hotline',
    number: '+880 761-62202',
    desc: 'Emergency Patient Admission & Diagnostics',
    badge: 'Chuadanga',
    icon: 'HeartPulse',
  },
  {
    id: 'def-4',
    title: 'Central Blood Bank Transfusion Unit',
    number: '+880 1711-998800',
    desc: '24/7 Emergency Blood Donor & Transfusion Support',
    badge: 'Blood Unit',
    icon: 'Droplet',
  },
  {
    id: 'def-5',
    title: 'Nationwide Air & Highway Ambulance',
    number: '+880 1711-554433',
    desc: 'Emergency Patient Air Evacuation & Transport',
    badge: 'Air Ambulance',
    icon: 'Truck',
  },
  {
    id: 'def-6',
    title: 'Chuadanga District Fire & Rescue Unit',
    number: '+880 761-62222',
    desc: 'Fire Rescue & Disaster Relief Emergency Operations',
    badge: 'Rescue Unit',
    icon: 'Flame',
  },
];

export default async function EmergencyPage() {
  // Fetch active helplines from Database with safe fallback
  let displayHelplines = DEFAULT_HOTLINES;

  try {
    if ((db as any).emergencyHelpline) {
      const dbHelplines = await db.emergencyHelpline.findMany({
        where: { isAvailable: true },
        orderBy: { orderIndex: 'asc' },
      });
      if (dbHelplines.length > 0) {
        displayHelplines = dbHelplines as any;
      }
    }
  } catch (err) {
    // Fallback to default hotlines
    displayHelplines = DEFAULT_HOTLINES;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Hero Emergency Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 text-white rounded-3xl p-7 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-xs font-bold border border-white/20">
            <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
            <span>24/7 Emergency Assistance • Chuadanga</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Medical Emergency & Hotline Directory
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium">
            Quick-dial national emergency service, local Chuadanga hospital helplines & ambulance units.
          </p>
        </div>

        {/* "Dial 999 Now" Button */}
        <a
          href="tel:999"
          className="group relative z-10 inline-flex items-center gap-3 bg-white text-rose-700 hover:bg-rose-50 font-black text-sm py-3.5 px-7 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] active:scale-95 border-2 border-white/90 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-xs shrink-0">
            <PhoneCall className="w-4 h-4 animate-pulse" />
          </div>
          <span className="tracking-wide">Dial 999 Now</span>
        </a>
      </div>

      {/* Dynamic Hotline Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            Direct Emergency Helplines
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Click button to call directly</span>
        </div>

        <EmergencyHelplinesList helplines={displayHelplines} />
      </div>
    </div>
  );
}
