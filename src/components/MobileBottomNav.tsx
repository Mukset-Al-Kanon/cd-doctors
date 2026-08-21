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

  // If on admin routes, do not render mobile bottom nav
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';
  const isHospitals = pathname.startsWith('/hospitals');
  const isDoctors = pathname.startsWith('/doctors');
  const isBlood = pathname.startsWith('/blood');

  return (
    <>
      {/* 📱 ULTRA-PREMIUM MINIMALIST FIXED MOBILE BOTTOM NAVIGATION */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 w-full h-16 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] select-none"
      >
        <div className="grid grid-cols-5 items-center h-full max-w-md mx-auto px-2 relative">
          
          {/* 1. Home */}
          <Link
            href="/"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 select-none touch-manipulation active:scale-95 ${
              isHome 
                ? 'text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            {isHome && (
              <span className="absolute top-0 w-6 h-1 bg-sky-600 rounded-b-full shadow-xs" />
            )}
            <Home className={`w-5 h-5 transition-transform duration-200 ${isHome ? 'scale-110 stroke-[2.4]' : 'stroke-[1.7]'}`} />
            <span className="text-[10.5px] tracking-tight mt-1">হোম</span>
          </Link>

          {/* 2. Hospitals */}
          <Link
            href="/hospitals"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 select-none touch-manipulation active:scale-95 ${
              isHospitals 
                ? 'text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            {isHospitals && (
              <span className="absolute top-0 w-6 h-1 bg-sky-600 rounded-b-full shadow-xs" />
            )}
            <Building2 className={`w-5 h-5 transition-transform duration-200 ${isHospitals ? 'scale-110 stroke-[2.4]' : 'stroke-[1.7]'}`} />
            <span className="text-[10.5px] tracking-tight mt-1">হাসপাতাল</span>
          </Link>

          {/* 3. Center Minimalist Scan Button */}
          <div className="flex flex-col items-center justify-center relative -top-3">
            <button
              type="button"
              onClick={() => setShowScanModal(true)}
              aria-label="প্রেসক্রিপশন স্ক্যান করুন"
              className="w-12 h-12 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 border-[3px] border-white active:scale-90 transition-all duration-200 cursor-pointer group touch-manipulation"
            >
              <Scan className="w-5 h-5 text-white stroke-[2.2] group-hover:scale-110 transition-transform duration-200" />
            </button>
            <span className="text-[10px] font-extrabold text-sky-700 tracking-tight mt-0.5">
              স্ক্যান
            </span>
          </div>

          {/* 4. Doctors */}
          <Link
            href="/doctors"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 select-none touch-manipulation active:scale-95 ${
              isDoctors 
                ? 'text-sky-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            {isDoctors && (
              <span className="absolute top-0 w-6 h-1 bg-sky-600 rounded-b-full shadow-xs" />
            )}
            <Stethoscope className={`w-5 h-5 transition-transform duration-200 ${isDoctors ? 'scale-110 stroke-[2.4]' : 'stroke-[1.7]'}`} />
            <span className="text-[10.5px] tracking-tight mt-1">ডাক্তার</span>
          </Link>

          {/* 5. Blood */}
          <Link
            href="/blood"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 select-none touch-manipulation active:scale-95 ${
              isBlood 
                ? 'text-rose-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            {isBlood && (
              <span className="absolute top-0 w-6 h-1 bg-rose-600 rounded-b-full shadow-xs" />
            )}
            <Droplet className={`w-5 h-5 transition-transform duration-200 ${isBlood ? 'scale-110 text-rose-600 fill-rose-500 stroke-[2.4]' : 'stroke-[1.7]'}`} />
            <span className="text-[10.5px] tracking-tight mt-1">রক্তদান</span>
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
