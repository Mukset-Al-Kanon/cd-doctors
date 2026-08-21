'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

interface PatientSignupBannerProps {
  initialSession?: any | null;
}

export default function PatientSignupBanner({ initialSession }: PatientSignupBannerProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(initialSession));

  useEffect(() => {
    // Verify client-side auth state
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  // If user is already logged in, do not render this registration CTA banner
  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-nuvicaNavy-900 via-sky-900 to-sky-800 p-8 sm:p-12 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-200 text-xs font-bold border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> মোবাইল ওটিপি দ্বারা সুরক্ষিত রেজিস্ট্রেশন
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ডাক্তারের সিরিয়াল ও স্বাস্থ্যসেবার জন্য একাউন্ট খুলুন
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
              আপনার মোবাইল নম্বর যাচাই করে মাত্র ১ মিনিটে একটি ফ্রি পেশেন্ট একাউন্ট তৈরি করুন এবং চুয়াডাঙ্গার বিশেষজ্ঞ ডাক্তারদের সিরিয়াল নিশ্চিত করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-nuvicaNavy-900 hover:bg-sky-50 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <UserCheck className="w-4 h-4 text-sky-600" />
              ফ্রি সাইন-আপ করুন
            </Link>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all"
            >
              <Stethoscope className="w-4 h-4 text-sky-300" />
              ডাক্তারদের তালিকা
            </Link>
          </div>
        </div>

        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
