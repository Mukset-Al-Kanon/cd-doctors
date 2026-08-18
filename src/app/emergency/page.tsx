import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Truck, 
  Droplet, 
  Sparkles, 
  Flame, 
  Phone
} from 'lucide-react';

export const revalidate = 0;

const ICON_MAP: Record<string, any> = {
  ShieldAlert,
  Building2,
  HeartPulse,
  Droplet,
  Truck,
  Flame,
  PhoneCall,
};

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
            <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Direct Emergency Helplines
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Click button to call directly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayHelplines.map((h) => {
            const Icon = ICON_MAP[h.icon] || PhoneCall;
            return (
              <div
                key={h.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                      {h.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-base text-nuvicaNavy-900 leading-snug group-hover:text-sky-700 transition-colors">
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                </div>

                {/* Call Button */}
                <a
                  href={`tel:${h.number}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-sky-500"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3 h-3 text-white" />
                  </div>
                  <span className="tracking-wide">Call {h.number}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
