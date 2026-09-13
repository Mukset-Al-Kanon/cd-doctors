'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Ticket, 
  Phone, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function SerialTrackerLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setError('অনুগ্রহ করে আপনার টোকেন কোড (যেমন: APT-2026...) অথবা মোবাইল নম্বর লিখুন।');
      return;
    }
    setError('');
    setSearching(true);

    // If matches appointment code pattern
    if (query.toUpperCase().startsWith('APT-')) {
      router.push(`/track/${query.toUpperCase()}`);
    } else {
      // Look up phone
      fetch(`/api/appointments/live-queue?phone=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.patientInfo?.appointmentCode) {
            router.push(`/track/${data.patientInfo.appointmentCode}`);
          } else {
            setError('এই মোবাইল নম্বরে আজকের কোনো সক্রিয় সিরিয়াল পাওয়া যায়নি।');
            setSearching(false);
          }
        })
        .catch(() => {
          setError('সিরিয়াল খুঁজতে সমস্যা হয়েছে। অনুগ্রহ করে টোকেন কোড দিয়ে চেষ্টা করুন।');
          setSearching(false);
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-black shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
          </span>
          <span>রিয়েল-টাইম লাইভ সিরিয়াল মনিটর</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-nuvicaNavy-950 tracking-tight leading-snug">
          আপনার ডাক্তারের চেম্বার সিরিয়াল লাইভ ট্র্যাক করুন
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
          চেম্বারে দীর্ঘক্ষণ ভিড়ে বসে না থেকে ঘরে বসেই জানুন বর্তমানে কত নম্বর সিরিয়াল চলছে এবং আপনার ডাক আসতে কত সময় লাগবে।
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              টোকেন কোড অথবা মোবাইল নম্বর:
            </label>
            <div className="relative">
              <Ticket className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="যেমন: APT-20260831-001 বা 017XXXXXXXX"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-sky-500 transition shadow-2xs"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={searching}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {searching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>অনুসন্ধান করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>লাইভ সিরিয়াল দেখুন ➔</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            সিরিয়াল বুকিং করার সময় প্রদত্ত এসএমএস অথবা ডিজিটাল স্লিপে টোকেন কোড উল্লেখ রয়েছে।
          </p>
        </div>
      </div>



      {/* Doctor Directory CTA */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-nuvicaNavy-950 via-slate-900 to-sky-950 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black">নতুন কোনো ডাক্তারের সিরিয়াল বুক করতে চান?</h3>
          <p className="text-xs text-slate-300 font-medium">বিশেষজ্ঞ ডাক্তারদের তালিকা দেখুন এবং এখনই সুবিধাজনক সিরিয়াল বেছে নিন।</p>
        </div>
        <Link
          href="/doctors"
          className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md transition whitespace-nowrap"
        >
          ডাক্তারদের তালিকা ➜
        </Link>
      </div>

    </div>
  );
}
