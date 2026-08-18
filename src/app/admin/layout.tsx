'use client';

import React from 'react';
import Link from 'next/link';
import '@/app/globals.css';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  CalendarCheck, 
  MapPin, 
  FileText, 
  Star, 
  Users, 
  UserCheck,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Droplet
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, render full width without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const sidebarGroups = [
    {
      groupTitle: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: 'HEALTHCARE DIRECTORIES',
      items: [
        { name: 'Hospitals', href: '/admin/hospitals', icon: Building2 },
        { name: 'Specialist Doctors', href: '/admin/doctors', icon: Stethoscope },
        { name: 'Blood Donors', href: '/admin/blood', icon: Droplet },
      ],
    },
    {
      groupTitle: 'PATIENT OPERATIONS',
      items: [
        { name: 'Appointments', href: '/admin/appointments', icon: CalendarCheck },
        { name: 'Patients List', href: '/admin/patients', icon: Users },
        { name: 'User Accounts', href: '/admin/users', icon: UserCheck },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
      ],
    },
    {
      groupTitle: 'SYSTEM & AUDIT',
      items: [
        { name: 'Emergency Helplines', href: '/admin/emergency', icon: ShieldAlert },
        { name: 'Locations', href: '/admin/locations', icon: MapPin },
        { name: 'Audit Logs', href: '/admin/logs', icon: FileText },
      ],
    },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col md:flex-row">
      {/* Executive Sidebar — Nuvica Navy & Sky Blue Branding Theme */}
      <aside className="w-full md:w-64 bg-nuvicaNavy-950 text-white shrink-0 p-5 space-y-6 flex flex-col justify-between border-r border-nuvicaNavy-900 shadow-xl">
        <div className="space-y-6">
          {/* Admin Header matching Logo Colors */}
          <div className="bg-nuvicaNavy-900/90 p-3.5 rounded-2xl border border-sky-500/30 space-y-2 shadow-inner">
            <div className="flex items-center gap-2.5 font-black text-sm text-white">
              <img
                src="/logo.png"
                alt="CD Doctors Logo"
                width="34"
                height="34"
                style={{ width: '34px', height: '34px' }}
                className="w-8.5 h-8.5 rounded-full object-cover shadow-sm shrink-0 border border-sky-400/40 p-0.5 bg-white"
              />
              <span className="tracking-tight text-white font-extrabold">CD Doctors Admin</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Chuadanga Control Panel
              </span>
            </div>
          </div>

          {/* Grouped Sidebar Navigation */}
          <nav className="space-y-5">
            {sidebarGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-3">
                  {group.groupTitle}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-sky-600 text-white border-l-4 border-sky-300 shadow-md shadow-sky-600/30'
                            : 'text-slate-300 hover:bg-nuvicaNavy-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-nuvicaNavy-900 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full text-xs font-bold text-white hover:text-white bg-sky-600/30 hover:bg-sky-600 py-2.5 px-3 rounded-xl transition-all border border-sky-500/40 flex items-center justify-center gap-2"
          >
            Visit Public Platform
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 py-2.5 px-3 rounded-xl transition-all border border-rose-800/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-100/80">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
