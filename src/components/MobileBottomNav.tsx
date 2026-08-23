'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Stethoscope, 
  Droplet, 
  Scan 
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [showScanModal, setShowScanModal] = useState(false);

  // Hide on admin portal, doctor portal, and login/register pages (keep visible on public /doctors)
  const isDoctorPortal = pathname === '/doctor' || pathname.startsWith('/doctor/');
  const isAdminPortal = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthPage = 
    pathname === '/login' || 
    pathname.startsWith('/login/') || 
    pathname === '/register' || 
    pathname.startsWith('/register/');

  if (isAdminPortal || isDoctorPortal || isAuthPage) {
    return null;
  }

  const isHome = pathname === '/';
  const isHospitals = pathname.startsWith('/hospitals');
  const isDoctors = pathname.startsWith('/doctors');
  const isBlood = pathname.startsWith('/blood');

  return (
    <>
      {/* 📱 FLOATING CAPSULE DOCK MOBILE NAVIGATION */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md select-none"
      >
        <div className="bg-white/90 backdrop-blur-2xl border border-white/85 rounded-full p-1.5 sm:p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex items-center justify-between relative">
          
          {/* 1. Home */}
          <Link
            href="/"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
              isHome 
                ? 'text-sky-600 font-black' 
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <Home className={`w-5 h-5 transition-transform duration-200 ${isHome ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">হোম</span>
          </Link>

          {/* 2. Hospitals */}
          <Link
            href="/hospitals"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
              isHospitals 
                ? 'text-sky-600 font-black' 
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <Building2 className={`w-5 h-5 transition-transform duration-200 ${isHospitals ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">হাসপাতাল</span>
          </Link>

          {/* 3. Center Elevated Protruding Floating Button (Scan / AI) */}
          <button
            type="button"
            onClick={() => setShowScanModal(true)}
            aria-label="প্রেসক্রিপশন স্ক্যান করুন"
            className="relative -mt-6 flex flex-col items-center group cursor-pointer px-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105 active:scale-90 bg-gradient-to-tr from-sky-400 via-sky-500 to-sky-600 text-white shadow-sky-500/40 ring-4 ring-white">
              <Scan className="w-5 h-5 stroke-[2.3] group-hover:scale-110 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-0.5 font-black text-sky-600 tracking-tight">
              স্ক্যান
            </span>
          </button>

          {/* 4. Doctors */}
          <Link
            href="/doctors"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
              isDoctors 
                ? 'text-sky-600 font-black' 
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <Stethoscope className={`w-5 h-5 transition-transform duration-200 ${isDoctors ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">ডাক্তার</span>
          </Link>

          {/* 5. Blood */}
          <Link
            href="/blood"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
              isBlood 
                ? 'text-rose-600 font-black' 
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <Droplet className={`w-5 h-5 transition-transform duration-200 ${isBlood ? 'scale-110 text-rose-600 fill-rose-500 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">রক্তদান</span>
          </Link>

        </div>
      </nav>

      {/* Minimalist Scan Feature Preview Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-overlay">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-sky-100 text-center space-y-4 animate-modal-pop">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/25">
              <Scan className="w-7 h-7 animate-pulse stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100 inline-block">
                আসন্ন নতুন ফিচার 🚀
              </span>
              <h3 className="text-lg font-black text-nuvicaNavy-950">প্রেসক্রিপশন স্ক্যানার</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ডাক্তারের প্রেসক্রিপশন স্ক্যান করে চুয়াডাঙ্গার কোন হাসপাতালে কোন টেস্ট পাওয়া যাবে ও কত খরচ পড়বে তা খুব শীঘ্রই এই ফিচারের মাধ্যমে সরাসরি জানতে পারবেন!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowScanModal(false)}
              className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
            >
              ঠিক আছে, ধন্যবাদ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
