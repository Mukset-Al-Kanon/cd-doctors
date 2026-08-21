'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  ArrowUpRight, 
  Building2 
} from 'lucide-react';

interface HospitalItem {
  id: string;
  name: string;
  slug: string;
  hospitalType?: string;
  address: string;
  phone?: string | null;
  description: string;
  coverUrl?: string | null;
  logoUrl?: string | null;
  _count?: { doctors: number };
}

interface HomeHospitalCarouselProps {
  hospitals: HospitalItem[];
}

export default function HomeHospitalCarousel({ hospitals }: HomeHospitalCarouselProps) {
  // Take first 6 hospitals
  const displayHospitals = hospitals.slice(0, 6);
  const N = displayHospitals.length;

  // Create 3 cloned sets for infinite circular loop: [Set 0 (0..N-1), Set 1 (N..2N-1), Set 2 (2N..3N-1)]
  const extendedHospitals = N > 0 
    ? [...displayHospitals, ...displayHospitals, ...displayHospitals]
    : [];

  // Start in the middle set (index N)
  const [currentIndex, setCurrentIndex] = useState(N > 0 ? N : 0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const isAnimatingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Active dot index (0 to N - 1)
  const activeDotIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  // Move forward by 1 card with smooth transition
  const handleNext = useCallback(() => {
    if (N === 0 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);

    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next;
    });

    // After 500ms slide transition finishes, silently normalize index if at boundary
    setTimeout(() => {
      setCurrentIndex((curr) => {
        if (curr >= 2 * N) {
          setIsTransitioning(false);
          return curr - N;
        }
        return curr;
      });
      isAnimatingRef.current = false;
    }, 510);
  }, [N]);

  // Move backward by 1 card with smooth transition
  const handlePrev = useCallback(() => {
    if (N === 0 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);

    setCurrentIndex((prev) => {
      const next = prev - 1;
      return next;
    });

    // After 500ms slide transition finishes, silently normalize index if at boundary
    setTimeout(() => {
      setCurrentIndex((curr) => {
        if (curr < N) {
          setIsTransitioning(false);
          return curr + N;
        }
        return curr;
      });
      isAnimatingRef.current = false;
    }, 510);
  }, [N]);

  // Re-enable smooth transition in next animation frame after silent teleport
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // 🔄 Automatic smooth scrolling every 3.5 seconds in a continuous infinite circular loop
  useEffect(() => {
    if (isPaused || N <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, N, handleNext]);

  // Touch Swipe Handlers for Mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false);
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 2000);
  };

  const goToDot = (dotIdx: number) => {
    if (isAnimatingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex(N + dotIdx);
  };

  if (N === 0) return null;

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: INFINITE CIRCULAR LOOP CAROUSEL WITH FADED PEEKING SIDES */}
      {/* ========================================================================= */}
      <div 
        className="md:hidden overflow-hidden w-screen relative left-1/2 -translate-x-1/2 py-3 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Sliding Infinite Track */}
        <div 
          className={`flex will-change-transform ${
            isTransitioning 
              ? 'transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]' 
              : 'transition-none'
          }`}
          style={{
            transform: `translateX(calc(11.3vw - ${(currentIndex * 77.4)}vw))`,
          }}
        >
          {extendedHospitals.map((hospital, idx) => {
            const isActive = idx === currentIndex;

            return (
              <div
                key={`${hospital.id}-clone-${idx}`}
                onClick={() => {
                  if (!isActive && !isAnimatingRef.current) {
                    setIsTransitioning(true);
                    setCurrentIndex(idx);
                  }
                }}
                className={`shrink-0 w-[75vw] max-w-[325px] mx-[1.2vw] cursor-pointer ${
                  isTransitioning 
                    ? 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]' 
                    : 'transition-none'
                } ${
                  isActive 
                    ? 'scale-100 opacity-100 z-20 shadow-[0_16px_36px_-10px_rgba(14,165,233,0.22)]' 
                    : 'scale-[0.93] opacity-45 z-10 pointer-events-auto blur-[0.2px]'
                }`}
              >
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden h-full">
                  <div className="space-y-3 p-3.5 pb-1">
                    {/* Hospital Cover Image Box - 16:9 Aspect Ratio with Location Overlay */}
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner">
                      <img
                        src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                        alt={hospital.name}
                        className="w-full h-full object-cover opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white text-[11px] font-semibold drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{hospital.address}</span>
                      </div>
                    </div>

                    {/* Info Content */}
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-nuvicaNavy-900 leading-snug line-clamp-2">
                        {isActive ? (
                          <Link href={`/hospitals/${hospital.slug}`}>
                            {hospital.name}
                          </Link>
                        ) : (
                          <span>{hospital.name}</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {hospital.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer - 2-Button Row */}
                  <div className="p-3 bg-slate-50/90 border-t border-slate-100 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {hospital.phone ? (
                        <a
                          href={`tel:${hospital.phone}`}
                          onClick={(e) => {
                            if (!isActive) {
                              e.preventDefault();
                              if (!isAnimatingRef.current) {
                                setIsTransitioning(true);
                                setCurrentIndex(idx);
                              }
                            }
                          }}
                          className="py-2 px-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-900 border border-sky-200/90 text-xs font-black shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          title={`হটলাইন: ${hospital.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>হটলাইন</span>
                        </a>
                      ) : null}

                      <Link 
                        href={`/hospitals/${hospital.slug}`}
                        onClick={(e) => {
                          if (!isActive) {
                            e.preventDefault();
                            if (!isAnimatingRef.current) {
                              setIsTransitioning(true);
                              setCurrentIndex(idx);
                            }
                          }
                        }}
                        className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-xs font-black shadow-sm active:scale-95 transition-all ${hospital.phone ? '' : 'col-span-2'}`}
                      >
                        <span>বিস্তারিত</span> 
                        <ArrowUpRight className="w-3.5 h-3.5 text-white shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔘 Brand Sky-Blue Pagination Dots Indicator (Synced with Card Animation) */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {displayHospitals.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToDot(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer ${
                activeDotIndex === idx 
                  ? 'w-6 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 shadow-xs' 
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP 3-COLUMN MODERN GRID (md and up) */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-[40px]">
        {displayHospitals.slice(0, 3).map((hospital) => (
          <div 
            key={hospital.id} 
            className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-250 ease-in-out cursor-pointer flex flex-col justify-between overflow-hidden group"
          >
            <div className="space-y-4 p-6 pb-2">
              {/* Hospital Cover Image Box - 16:9 Aspect Ratio */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group-hover:border-sky-300 transition-colors">
                <img
                  src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                  alt={hospital.name}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{hospital.address}</span>
                </div>
              </div>

              {/* Info Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-[19px] text-nuvicaNavy-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
                  <Link href={`/hospitals/${hospital.slug}`}>
                    {hospital.name}
                  </Link>
                </h3>
                <p className="text-[14px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                  {hospital.description}
                </p>
              </div>
            </div>

            {/* Card Action Footer - Clean 2-Button Grid */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2.5">
                {hospital.phone ? (
                  <a
                    href={`tel:${hospital.phone}`}
                    className="relative w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-900 border border-sky-200/90 hover:border-sky-400 text-xs font-extrabold shadow-2xs hover:shadow-md hover:shadow-sky-500/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-1.5 overflow-hidden group/btn"
                    title={`হটলাইন: ${hospital.phone}`}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-sky-200/40 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                    <Phone className="relative z-10 w-3.5 h-3.5 text-sky-600 group-hover/btn:text-sky-700 group-hover/btn:rotate-12 group-hover/btn:scale-115 transition-transform duration-300 shrink-0" />
                    <span className="relative z-10">হটলাইন</span>
                  </a>
                ) : null}

                <Link 
                  href={`/hospitals/${hospital.slug}`} 
                  className={`relative w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:via-sky-600 hover:to-sky-700 text-white text-xs font-extrabold shadow-sm hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden group/detail ${hospital.phone ? '' : 'col-span-2'}`}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/detail:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                  <span className="relative z-10">বিস্তারিত</span> 
                  <ArrowUpRight className="relative z-10 w-3.5 h-3.5 text-white group-hover/detail:translate-x-0.5 group-hover/detail:-translate-y-0.5 group-hover/detail:scale-110 transition-transform duration-300 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
