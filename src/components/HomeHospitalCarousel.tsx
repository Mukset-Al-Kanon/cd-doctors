'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Building2 } from 'lucide-react';

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
  const router = useRouter();

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
  const isDraggingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isHorizontalGesture = useRef<boolean | null>(null);

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

  // Enhanced Touch Swipe Handlers with Vertical Scroll Protection
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
    isHorizontalGesture.current = null;
    isDraggingRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    touchEndX.current = currentX;
    touchEndY.current = currentY;

    const deltaX = Math.abs(currentX - touchStartX.current);
    const deltaY = Math.abs(currentY - touchStartY.current);

    if (deltaX > 10) {
      isDraggingRef.current = true;
    }

    if (isHorizontalGesture.current === null && (deltaX > 8 || deltaY > 8)) {
      if (deltaY >= deltaX) {
        // Vertical page scroll: don't intercept
        isHorizontalGesture.current = false;
      } else {
        // Horizontal swipe: pause and prepare slide
        isHorizontalGesture.current = true;
        setIsPaused(true);
      }
    }
  };

  const onTouchEnd = () => {
    if (
      touchStartX.current !== null && 
      touchEndX.current !== null && 
      isHorizontalGesture.current === true
    ) {
      const diffX = touchStartX.current - touchEndX.current;
      const isLeftSwipe = diffX > 45;
      const isRightSwipe = diffX < -45;

      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
    isHorizontalGesture.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
      setIsPaused(false);
    }, 200);
  };

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      return;
    }
    router.push(`/hospitals/${slug}`);
  };

  const goToDot = (dotIdx: number) => {
    if (isAnimatingRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex(N + dotIdx);
  };

  if (N === 0) return null;

  return (
    <div 
      className="relative w-full touch-pan-y"
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: INFINITE CIRCULAR LOOP CAROUSEL (MATCHING DOCTOR STYLE) */}
      {/* ========================================================================= */}
      <div 
        className="md:hidden overflow-hidden w-screen relative left-1/2 -translate-x-1/2 py-3 touch-pan-y"
        style={{ touchAction: 'pan-y' }}
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
                className={`shrink-0 w-[75vw] max-w-[325px] mx-[1.2vw] cursor-pointer bg-transparent ${
                  isTransitioning 
                    ? 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]' 
                    : 'transition-none'
                } ${
                  isActive 
                    ? 'scale-100 opacity-100 z-20' 
                    : 'scale-[0.93] opacity-45 z-10 pointer-events-auto blur-[0.2px]'
                }`}
              >
                {/* 🎴 Clickable Hospital Card (Entire Card is Link to Hospital Profile) */}
                <Link
                  href={`/hospitals/${hospital.slug}`}
                  onClick={(e) => handleCardClick(e, hospital.slug)}
                  className={`block bg-slate-950 rounded-3xl overflow-hidden group active:scale-[0.98] transition-all duration-200 cursor-pointer ${
                    isActive ? 'shadow-[0_20px_40px_-10px_rgba(15,23,42,0.65)]' : 'shadow-md shadow-slate-950/30'
                  }`}
                >
                  {/* Hospital Cover Image Box with Dark Gradient Overlay (4:3 Aspect Ratio) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                      alt={hospital.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>

                  {/* Dark Theme Details Box (Name & Location Only, No Buttons) */}
                  <div className="p-4 pt-2.5 pb-4 space-y-1.5 bg-slate-950 text-white">
                    <div className="flex items-center gap-1.5 text-sky-400 text-xs font-black">
                      <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{hospital.hospitalType || 'হাসপাতাল ও ডায়াগনস্টিক'}</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-1">
                      {hospital.name}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hospital.address}</span>
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* 🔘 Brand Sky-Blue Pagination Dots Indicator */}
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
      {/* 💻 DESKTOP 3-COLUMN MODERN GRID (MATCHING LUXURY CARD THEME) */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-[40px]">
        {displayHospitals.slice(0, 3).map((hospital) => (
          <Link
            key={hospital.id} 
            href={`/hospitals/${hospital.slug}`}
            className="block bg-slate-950 rounded-3xl overflow-hidden shadow-lg shadow-slate-950/20 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-white/5"
          >
            {/* Hospital Cover Image Box - 4:3 Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
              <img
                src={hospital.coverUrl || hospital.logoUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                alt={hospital.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            {/* Info Content */}
            <div className="p-5 space-y-1.5 bg-slate-950 text-white">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-black">
                <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{hospital.hospitalType || 'হাসপাতাল ও ডায়াগনস্টিক'}</span>
              </div>

              <h3 className="font-black text-lg text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-1">
                {hospital.name}
              </h3>

              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hospital.address}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
