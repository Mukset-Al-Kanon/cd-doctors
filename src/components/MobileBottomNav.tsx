'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Stethoscope, 
  Droplet, 
  Video 
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin portal, doctor portal, doctor detail pages, booking page, video room, and auth pages
  const isDoctorPortal = pathname === '/doctor' || pathname.startsWith('/doctor/');
  const isAdminPortal = pathname === '/admin' || pathname.startsWith('/admin/');
  const isDoctorDetailPage = pathname.startsWith('/doctors/') && pathname !== '/doctors';
  const isBookingPage = pathname.startsWith('/book/') || pathname === '/book';
  const isVideoRoom = pathname.startsWith('/telemedicine/room');
  const isAuthPage = 
    pathname === '/login' || 
    pathname.startsWith('/login/') || 
    pathname === '/register' || 
    pathname.startsWith('/register/');

  if (isAdminPortal || isDoctorPortal || isAuthPage || isDoctorDetailPage || isBookingPage || isVideoRoom) {
    return null;
  }

  const navItems = [
    { id: 'home', label: 'হোম', href: '/', icon: Home, isActive: pathname === '/' },
    { id: 'telemedicine', label: 'টেলিমেডিসিন', href: '/telemedicine', icon: Video, isActive: pathname.startsWith('/telemedicine') },
    { id: 'hospitals', label: 'হাসপাতাল', href: '/hospitals', icon: Building2, isActive: pathname.startsWith('/hospitals') },
    { id: 'doctors', label: 'ডাক্তার', href: '/doctors', icon: Stethoscope, isActive: pathname.startsWith('/doctors') },
    { id: 'blood', label: 'রক্তদান', href: '/blood', icon: Droplet, isActive: pathname.startsWith('/blood') },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full select-none font-bengali mobile-bottom-bar"
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-x border-slate-200/80 rounded-t-[32px] sm:rounded-t-[36px] px-3 pt-3 pb-3.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          const isBlood = item.id === 'blood';

          return (
            <Link
              key={item.id}
              href={item.href}
              scroll={false}
              onClick={() => {
                if (item.href === '/') window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer transition-all duration-200"
            >
              {active ? (
                /* 🌟 ACTIVE CLEAN & PROFESSIONAL STATE */
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <Icon 
                    className={`w-[22px] h-[22px] stroke-[2.3] transition-colors ${
                      isBlood ? 'text-rose-600' : 'text-sky-600'
                    }`} 
                  />
                  <span 
                    className={`text-[11px] font-black tracking-tight mt-1 transition-colors ${
                      isBlood ? 'text-rose-600' : 'text-sky-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ) : (
                /* 🌟 INACTIVE SUBTLE OUTLINE STATE */
                <div className="flex flex-col items-center justify-center transition-all duration-200 group-hover:text-slate-600 group-active:scale-95">
                  <Icon className="w-[21px] h-[21px] text-slate-400 stroke-[1.6] group-hover:text-slate-600 transition-colors" />
                  <span className="text-[10.5px] font-semibold text-slate-400 tracking-tight mt-1 group-hover:text-slate-600 transition-colors">
                    {item.label}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
