'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  slug: string;
  hospitalType: string;
  address: string;
  phone: string;
  emergencyPhone?: string | null;
  description: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  isFeatured?: boolean;
  facilities?: { id: string; facilityName: string }[];
  _count?: {
    doctors: number;
  };
}

interface HeroHospitalSliderProps {
  hospitals?: Hospital[];
}

export default function HeroHospitalSlider({ hospitals = [] }: HeroHospitalSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    // SLIDE 01 — CD DOCTORS (BRAND INTRO)
    {
      id: 0,
      category: "CD DOCTORS",
      headlineWhite: "বিস্তারিত তথ্য",
      headlineCyan: "এখন এক প্ল্যাটফর্মে",
      description: "হাসপাতাল, চিকিৎসক, রক্তদাতা ও জরুরি স্বাস্থ্যসেবার তথ্য—একটি সহজ ও সংযুক্ত প্ল্যাটফর্মে।",
      ctaText: "স্বাস্থ্যসেবা খুঁজুন",
      ctaHref: "/hospitals",
      bgImage: "/images/brand-hero-banner.jpg",
      objectPosition: "right center",
      mobileObjectPosition: "right center",
      accentTextColor: "text-sky-400",
      badgeTextColor: "text-sky-300",
      badgeBorderColor: "border-sky-400/30",
      badgeBgColor: "bg-sky-950/80",
      badgeDotColor: "bg-sky-400",
      ctaBgColor: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/30",
      progressGradient: "from-sky-400 to-sky-500 shadow-sky-400/50",
      arrowHoverBgColor: "hover:bg-sky-500"
    },

    // SLIDE 02 — HOSPITALS
    {
      id: 1,
      category: "HOSPITALS",
      headlineWhite: "হাসপাতালের",
      headlineCyan: "বিস্তারিত তথ্য",
      description: "চুয়াডাঙ্গার হাসপাতাল ও ক্লিনিকের গুরুত্বপূর্ণ তথ্য এক জায়গায় দেখুন।",
      ctaText: "হাসপাতাল দেখুন",
      ctaHref: "/hospitals",
      bgImage: "/images/hospital-hero-banner.jpg",
      objectPosition: "65% center",
      mobileObjectPosition: "center center",
      accentTextColor: "text-sky-400",
      badgeTextColor: "text-sky-300",
      badgeBorderColor: "border-sky-400/30",
      badgeBgColor: "bg-sky-950/80",
      badgeDotColor: "bg-sky-400",
      ctaBgColor: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/30",
      progressGradient: "from-sky-400 to-sky-500 shadow-sky-400/50",
      arrowHoverBgColor: "hover:bg-sky-500"
    },

    // SLIDE 03 — DOCTORS
    {
      id: 2,
      category: "DOCTORS",
      headlineWhite: "বিশেষজ্ঞ",
      headlineCyan: "চিকিৎসক খুঁজুন",
      description: "বিশেষজ্ঞতা, চেম্বার ও যোগাযোগের তথ্য দেখে প্রয়োজন অনুযায়ী চিকিৎসক খুঁজে নিন।",
      ctaText: "চিকিৎসক দেখুন",
      ctaHref: "/doctors",
      bgImage: "/images/doctor-hero-banner.jpg",
      objectPosition: "70% center",
      mobileObjectPosition: "right center",
      accentTextColor: "text-sky-400",
      badgeTextColor: "text-sky-300",
      badgeBorderColor: "border-sky-400/30",
      badgeBgColor: "bg-sky-950/80",
      badgeDotColor: "bg-sky-400",
      ctaBgColor: "bg-sky-600 hover:bg-sky-500 shadow-sky-600/30",
      progressGradient: "from-sky-400 to-sky-500 shadow-sky-400/50",
      arrowHoverBgColor: "hover:bg-sky-500"
    },

    // SLIDE 04 — BLOOD DONORS (RED THEME)
    {
      id: 3,
      category: "BLOOD DONORS",
      headlineWhite: "জরুরি",
      headlineCyan: "রক্তদাতা খুঁজুন",
      description: "রক্তের গ্রুপ অনুযায়ী রক্তদাতার তথ্য খুঁজে সরাসরি যোগাযোগ করুন।",
      ctaText: "রক্তদাতা খুঁজুন",
      ctaHref: "/blood",
      bgImage: "/images/blood-hero-banner.jpg",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
      accentTextColor: "text-rose-500",
      badgeTextColor: "text-rose-300",
      badgeBorderColor: "border-rose-500/30",
      badgeBgColor: "bg-rose-950/80",
      badgeDotColor: "bg-rose-500",
      ctaBgColor: "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30",
      progressGradient: "from-rose-500 to-rose-600 shadow-rose-500/50",
      arrowHoverBgColor: "hover:bg-rose-600"
    },

    // SLIDE 05 — EMERGENCY (RED THEME)
    {
      id: 4,
      category: "EMERGENCY",
      headlineWhite: "জরুরি মুহূর্তে",
      headlineCyan: "যোগাযোগ",
      description: "জরুরি স্বাস্থ্যসেবা ও গুরুত্বপূর্ণ যোগাযোগের তথ্য দ্রুত খুঁজে নিন।",
      ctaText: "জরুরি তথ্য দেখুন",
      ctaHref: "/emergency",
      bgImage: "/images/emergency-hero-banner.jpg",
      objectPosition: "center center",
      mobileObjectPosition: "center center",
      accentTextColor: "text-rose-500",
      badgeTextColor: "text-rose-300",
      badgeBorderColor: "border-rose-500/30",
      badgeBgColor: "bg-rose-950/80",
      badgeDotColor: "bg-rose-500",
      ctaBgColor: "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30",
      progressGradient: "from-rose-500 to-rose-600 shadow-rose-500/50",
      arrowHoverBgColor: "hover:bg-rose-600"
    }
  ];

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

  const activeSlide = slides[currentSlide];

  return (
    <section 
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 font-bengali"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="CD Doctors Hero Slider"
    >
      {/* ========================================================================= */}
      {/* MOBILE HERO CONTAINER (< 768px): DEDICATED INTENTIONAL MOBILE-FIRST CARD  */}
      {/* ========================================================================= */}
      <div className="block md:hidden relative w-full h-[450px] xs:h-[465px] sm:h-[485px] rounded-[22px] overflow-hidden shadow-lg shadow-sky-950/20 border border-white/15 bg-nuvicaNavy-950 group">
        
        {/* Layer 1: Mobile Background Images (Pure Smooth Fade) */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.headlineWhite}
              style={{ objectPosition: slide.mobileObjectPosition || slide.objectPosition }}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Layer 2: Mobile Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(4, 16, 35, 0.20) 0%, rgba(4, 16, 35, 0.65) 45%, rgba(4, 16, 35, 0.94) 80%)'
          }}
        />

        {/* Layer 3: Mobile Text Content Blocks (Pure Opacity Fade per Slide) */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-20 p-5 flex flex-col justify-between transition-opacity duration-800 ease-in-out ${
              idx === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top-Left Category Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase ${slide.badgeTextColor} ${slide.badgeBgColor} border ${slide.badgeBorderColor} px-2.5 py-1 rounded-full backdrop-blur-md`}>
                <span className={`w-1.5 h-1.5 rounded-full ${slide.badgeDotColor} animate-pulse`} />
                <span>{slide.category}</span>
              </span>
            </div>

            {/* Lower-Left Text Block & CTA */}
            <div className="space-y-2.5 text-left pb-1">
              
              {/* Headline */}
              <h1 
                className="text-[25px] xs:text-[27px] font-extrabold tracking-tight font-noto-bengali-heading max-w-[310px] space-y-0.5"
                style={{ fontFamily: 'var(--font-noto-sans-bengali), "Noto Sans Bengali", sans-serif', fontWeight: 800 }}
              >
                <span className="block leading-[1.1] text-white">{slide.headlineWhite}</span>
                <span className={`block leading-[1.1] ${slide.accentTextColor} font-extrabold`}>{slide.headlineCyan}</span>
              </h1>

              {/* Short Mobile Description (2 lines max) */}
              <p className="text-xs text-white/85 font-medium leading-relaxed max-w-[280px] line-clamp-2">
                {slide.description}
              </p>

              {/* Compact Mobile CTA (Left Aligned, Fixed Consistent Width) */}
              <div className="pt-1">
                <Link
                  href={slide.ctaHref}
                  className={`inline-flex items-center justify-between min-w-[155px] h-[42px] px-4 rounded-[12px] ${slide.ctaBgColor} text-white font-semibold text-xs shadow-md group/btn`}
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform ml-2" />
                </Link>
              </div>

              {/* Ultra-Aesthetic Mobile Glassmorphic Navigation Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                
                {/* Step Progress Pills */}
                <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        currentSlide === i ? `w-6 bg-gradient-to-r ${slides[i].progressGradient}` : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Circular Glass Arrow Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className={`w-8 h-8 rounded-full bg-white/10 ${slide.arrowHoverBgColor} text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all active:scale-95 hover:scale-105 shadow-sm`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className={`w-8 h-8 rounded-full bg-white/10 ${slide.arrowHoverBgColor} text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all active:scale-95 hover:scale-105 shadow-sm`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>


      {/* ========================================================================= */}
      {/* DESKTOP / TABLET HERO CONTAINER (>= 768px): UNTOUCHED DESKTOP COMPOSITION */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative w-full aspect-[16/9] min-h-[520px] max-h-[620px] rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(5,20,40,0.12)] border border-white/15 bg-nuvicaNavy-950 group">
        
        {/* LAYER 1: FULL-BLEED BACKGROUND PHOTOGRAPHS WITH PURE SMOOTH FADE */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.headlineWhite}
              style={{ objectPosition: slide.objectPosition }}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* LAYER 2: CINEMATIC OVERLAY GRADIENTS */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(90deg, rgba(4, 16, 35, 0.85) 0%, rgba(4, 16, 35, 0.70) 30%, rgba(4, 16, 35, 0.35) 58%, rgba(4, 16, 35, 0.10) 82%, rgba(4, 16, 35, 0.02) 100%)'
          }}
        />

        {/* Subtle Overall Dark Vignette */}
        <div className="absolute inset-0 z-10 bg-nuvicaNavy-950/10 pointer-events-none" />

        {/* LAYER 3 & 4: DESKTOP CONTENT BLOCKS (Pure Simultaneous Opacity Crossfade) */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-20 p-8 lg:p-14 flex flex-col justify-between transition-opacity duration-800 ease-in-out ${
              idx === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            
            {/* EDITORIAL CONTENT BLOCK */}
            <div className="my-auto space-y-5 max-w-[540px] text-left">
              
              {/* Minimal Editorial Category Label */}
              <div className="flex items-center gap-2">
                <span className={`w-1 h-3.5 ${slide.badgeDotColor} rounded-full shrink-0`} />
                <span className="text-xs font-extrabold tracking-[0.14em] uppercase text-white/85">
                  {slide.category}
                </span>
              </div>

              {/* Main Headline */}
              <h1 
                className="text-[clamp(26px,4vw,48px)] lg:text-[42px] font-bold tracking-normal font-noto-bengali-heading space-y-0.5 sm:space-y-1"
                style={{ fontFamily: 'var(--font-noto-sans-bengali), "Noto Sans Bengali", sans-serif', fontWeight: 700 }}
              >
                <span className="block leading-[1.1] text-white">{slide.headlineWhite}</span>
                <span className={`block leading-[1.1] ${slide.accentTextColor} font-bold`}>{slide.headlineCyan}</span>
              </h1>

              {/* Description */}
              <p className="text-[16px] text-white/80 font-medium leading-relaxed max-w-[500px]">
                {slide.description}
              </p>

              {/* Single CTA Button (Left Aligned, Fixed Consistent Width) */}
              <div className="pt-2">
                <Link
                  href={slide.ctaHref}
                  className={`inline-flex items-center justify-between min-w-[175px] h-[44px] px-5 rounded-[12px] ${slide.ctaBgColor} text-white font-semibold text-sm shadow-lg group/btn`}
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform ml-2" />
                </Link>
              </div>

            </div>

            {/* ULTRA-AESTHETIC DESKTOP GLASSMORPHIC NAVIGATION BAR */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              
              {/* Step Progress Pills */}
              <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentSlide === i ? `w-10 bg-gradient-to-r ${slides[i].progressGradient}` : 'w-3 bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Circular Glass Arrow Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 ${slide.arrowHoverBgColor} text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all active:scale-95 hover:scale-105 shadow-md`}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 ${slide.arrowHoverBgColor} text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all active:scale-95 hover:scale-105 shadow-md`}
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
