'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Stethoscope, 
  Droplet, 
  Siren, 
  Building2, 
  Search, 
  MapPin, 
  PhoneCall, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';

interface SlideData {
  id: number;
  badgeIcon: React.ElementType;
  badgeText: string;
  badgeColor: string;
  headlineLine1: string;
  headlineLine2: string;
  supportingText: string;
  renderVisual: () => React.ReactNode;
}

export default function AboutHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: SlideData[] = [
    // SLIDE 01 — EASY HEALTHCARE INFORMATION
    {
      id: 0,
      badgeIcon: Sparkles,
      badgeText: "CD Doctors সম্পর্কে",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200/90",
      headlineLine1: "প্রয়োজনের সময়",
      headlineLine2: "সঠিক তথ্য হাতের নাগালে",
      supportingText: "হাসপাতাল, চিকিৎসক ও স্বাস্থ্যসেবার গুরুত্বপূর্ণ তথ্য একটি সহজ ও সুসংগঠিত প্ল্যাটফর্মে খুঁজে পাওয়ার সুযোগ।",
      renderVisual: () => (
        <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-xl space-y-4 font-bengali">
          {/* Mock Search Header */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <Search className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="text-xs text-slate-400 font-medium">চুয়াডাঙ্গার হাসপাতাল বা ডাক্তার খুঁজুন...</span>
            <span className="ml-auto bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl">Search</span>
          </div>

          {/* Connected UI Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-nuvicaNavy-900">হাসপাতাল ডিরেক্টরি</p>
                <p className="text-[10px] text-slate-500 font-semibold">চুয়াডাঙ্গা সদর ও জেলা</p>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-nuvicaNavy-900">বিশেষজ্ঞ ডাক্তার</p>
                <p className="text-[10px] text-slate-500 font-semibold">চেম্বারের সময়সূচী সহ</p>
              </div>
            </div>
          </div>

          {/* Bottom Live Connection Pill */}
          <div className="bg-nuvicaNavy-900 text-white p-3 rounded-2xl flex items-center justify-between text-xs font-medium shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-[11px]">ডিজিটাল হেলথকেয়ার সংযোগ</span>
            </div>
            <span className="text-[10px] font-bold text-sky-300 bg-white/10 px-2 py-0.5 rounded-lg">চুয়াডাঙ্গা</span>
          </div>
        </div>
      )
    },

    // SLIDE 02 — FIND THE RIGHT DOCTOR
    {
      id: 1,
      badgeIcon: Stethoscope,
      badgeText: "Doctor Directory",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/90",
      headlineLine1: "সঠিক চিকিৎসক",
      headlineLine2: "খুঁজে পাওয়া আরও সহজ",
      supportingText: "প্রয়োজন অনুযায়ী চিকিৎসকের বিশেষজ্ঞতা, পরিচিতি ও অন্যান্য গুরুত্বপূর্ণ তথ্য সহজেই খুঁজে দেখুন।",
      renderVisual: () => (
        <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xl space-y-4 font-bengali">
          {/* Mock Doctor Profile Card */}
          <div className="bg-gradient-to-r from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-nuvicaNavy-900 text-sky-300 font-black text-xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
              DR
            </div>
            <div className="space-y-1">
              <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2 py-0.5 rounded-md">মেডিসিন বিশেষজ্ঞ</span>
              <h4 className="font-black text-sm text-nuvicaNavy-900 leading-snug">ডাঃ মোহাম্মদ রফিকুল ইসলাম</h4>
              <p className="text-[10px] text-slate-500 font-semibold">MBBS, FCPS (Medicine)</p>
            </div>
          </div>

          {/* Schedule & Visit info */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                চেম্বারের সময়সূচী:
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">শনি - বৃহস্পতি</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-bold text-slate-700">
              <span>ভিজিট ফি: ৳৮০০ টাকা</span>
              <span className="text-sky-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> চুয়াডাঙ্গা সদর
              </span>
            </div>
          </div>

          {/* Direct Serial CTA Mock */}
          <div className="bg-emerald-600 text-white p-3 rounded-2xl text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>সিরিয়ালের জন্য সরাসরি কল করুন</span>
          </div>
        </div>
      )
    },

    // SLIDE 03 — BLOOD DONATION
    {
      id: 2,
      badgeIcon: Droplet,
      badgeText: "Blood Donor",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200/90",
      headlineLine1: "এক ব্যাগ রক্ত,",
      headlineLine2: "একটি জীবন বাঁচাতে পারে",
      supportingText: "প্রয়োজনের সময় রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজে পাওয়া এবং দ্রুত যোগাযোগের সুযোগ তৈরি করা।",
      renderVisual: () => (
        <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xl space-y-4 font-bengali">
          {/* Blood Donor Search Bar UI */}
          <div className="flex items-center justify-between bg-rose-50/70 p-3 rounded-2xl border border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                O+
              </div>
              <div>
                <p className="text-xs font-black text-nuvicaNavy-900">O Positive Donor Directory</p>
                <p className="text-[10px] text-slate-500 font-semibold">চুয়াডাঙ্গা নিবন্ধিত রক্তদাতা</p>
              </div>
            </div>
            <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-1 rounded-xl">Available</span>
          </div>

          {/* Donor Profile Mock */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-xs">
                  AH
                </div>
                <div>
                  <h4 className="text-xs font-black text-nuvicaNavy-900">আরিফুল হাসান</h4>
                  <p className="text-[10px] text-slate-500 font-medium">চুয়াডাঙ্গা সদর • শেষ রক্তদান: ৩ মাস আগে</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Ready to Donate
              </span>
            </div>
          </div>

          {/* Emergency Call Action */}
          <div className="bg-rose-600 text-white p-3 rounded-2xl text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>রক্তদাতার সাথে সরাসরি যোগাযোগ করুন</span>
          </div>
        </div>
      )
    },

    // SLIDE 04 — EMERGENCY
    {
      id: 3,
      badgeIcon: Siren,
      badgeText: "Emergency",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/90",
      headlineLine1: "জরুরি মুহূর্তে",
      headlineLine2: "দ্রুত যোগাযোগ",
      supportingText: "জরুরি স্বাস্থ্যসেবা ও গুরুত্বপূর্ণ যোগাযোগের তথ্য সহজে খুঁজে পাওয়ার মাধ্যমে সংকটের সময় সিদ্ধান্ত নেওয়াকে আরও সহজ করা।",
      renderVisual: () => (
        <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xl space-y-4 font-bengali">
          {/* Emergency ER Banner */}
          <div className="bg-amber-500/10 border border-amber-300/40 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                <Siren className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-nuvicaNavy-900">চুয়াডাঙ্গা জরুরি সেবা</h4>
                <p className="text-[10px] text-slate-600 font-semibold">২৪ ঘণ্টা অ্যাম্বুলেন্স ও ইমার্জেন্সি হটলাইন</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-1 rounded-lg">24/7 Live</span>
          </div>

          {/* Emergency Hotline Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400">অ্যাম্বুলেন্স সার্ভিস</p>
              <p className="text-xs font-black text-nuvicaNavy-900">+880 1700-000000</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400">সদর হাসপাতাল ER</p>
              <p className="text-xs font-black text-nuvicaNavy-900">+880 761-62588</p>
            </div>
          </div>

          {/* Quick Call Action */}
          <div className="bg-nuvicaNavy-900 text-white p-3 rounded-2xl text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4 text-sky-400" />
            <span>জরুরি হটলাইনে কল করুন</span>
          </div>
        </div>
      )
    }
  ];

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay Effect (5.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const activeSlide = slides[currentSlide];
  const BadgeIcon = activeSlide.badgeIcon;

  return (
    <section 
      className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-16 bg-gradient-to-b from-sky-50/90 via-sky-50/30 to-white border-b border-slate-200/60 overflow-hidden font-bengali"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="CD Doctors Hero Slider"
    >
      {/* Background Subtle Medical Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[500px] sm:min-h-[520px] flex flex-col justify-between">
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
          {/* LEFT COLUMN: Text Content */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5 text-left transition-all duration-700 ease-in-out">
            {/* Slide Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black shadow-2xs border ${activeSlide.badgeColor}`}>
              <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{activeSlide.badgeText}</span>
            </div>

            {/* Headline with Noto Sans Bengali styling */}
            <h1 
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-nuvicaNavy-900 leading-[1.35] tracking-normal font-noto-bengali-heading"
              style={{ fontFamily: 'var(--font-noto-sans-bengali), "Noto Sans Bengali", sans-serif', fontWeight: 700, lineHeight: 1.35, letterSpacing: 'normal' }}
            >
              {activeSlide.headlineLine1} <br />
              <span className="text-sky-600 font-bold">{activeSlide.headlineLine2}</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              {activeSlide.supportingText}
            </p>
          </div>

          {/* RIGHT COLUMN: Product Visual Illustration */}
          <div className="md:col-span-6 lg:col-span-6 transition-all duration-700 ease-in-out transform">
            {activeSlide.renderVisual()}
          </div>
        </div>

        {/* BOTTOM SLIDER NAVIGATION CONTROLS */}
        <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 max-w-7xl mx-auto w-full">
          {/* Pagination Indicators (01 02 03 04) */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all duration-300 ${
                  currentSlide === idx
                    ? 'bg-sky-600 text-white shadow-xs scale-105'
                    : 'bg-white/80 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
                }`}
                aria-label={`Go to slide 0${idx + 1}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          {/* Minimal Line Arrow Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-sky-600 hover:border-sky-300 shadow-2xs transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-sky-600 hover:border-sky-300 shadow-2xs transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
