'use client';

import React, { useState, useEffect } from 'react';

export default function InitialLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progressRatio, setProgressRatio] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Lock body scroll during initial cinematic loading screen
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Check user preference for reduced motion
    const motionQuery = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery && motionQuery.matches) {
      setPrefersReducedMotion(true);
    }

    // Phase 1: Double requestAnimationFrame ensures initial 0-frame paints cleanly before transition starts
    let raf1: number, raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsRevealed(true);
      });
    });

    // Phase 2: Ultra-smooth GPU-accelerated progress animation using scaleX
    let animationFrameId: number;
    const progressDuration = 1500; // 1.5s progress sweep
    let startTime: number | null = null;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawRatio = Math.min(elapsed / progressDuration, 1);
      
      // Ease-Out Quartic curve (1 - (1-t)^4) for liquid continuous movement
      const easedRatio = 1 - Math.pow(1 - rawRatio, 4);
      setProgressRatio(easedRatio);

      if (rawRatio < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Phase 3: Hold progress brief moment, then initiate smooth 1000ms floating dissolve fade-out
        setTimeout(() => {
          setIsFadingOut(true);
        }, 220);

        // Phase 4: Unmount loader after fade-out completes
        setTimeout(() => {
          setIsLoading(false);
          if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
          }
        }, 1150);
      }
    };

    // Delay progress bar start until logo entrance completes (220ms)
    const progressTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animateProgress);
    }, 220);

    // Fallback safety timeout (max 3200ms)
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }, 3200);

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(progressTimer);
      clearTimeout(fallbackTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading CD Doctors"
      role="status"
    >
      {/* Center Composition Box with Silky Floating Exit Motion */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-sm sm:max-w-md w-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isFadingOut ? 'opacity-0 scale-95 -translate-y-3 blur-xs' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        
        {/* Center Logo Treatment */}
        <div
          className={`relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            prefersReducedMotion
              ? isRevealed ? 'opacity-100' : 'opacity-0'
              : isRevealed
              ? 'opacity-100 blur-0 translate-y-0 scale-100'
              : 'opacity-0 blur-xs translate-y-4 scale-90'
          }`}
        >
          <img
            src="/logo.png"
            alt="CD Doctors Logo"
            width="88"
            height="88"
            className="relative z-10 w-16 h-16 sm:w-22 sm:h-22 rounded-full object-cover shadow-[0_14px_36px_rgba(15,23,42,0.06)] border-2 border-white"
          />
        </div>

        {/* Brand Name & Tagline */}
        <div
          className={`mt-4 space-y-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-120 ${
            prefersReducedMotion
              ? isRevealed ? 'opacity-100' : 'opacity-0'
              : isRevealed
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0A192F] font-sans">
            CD Doctors
          </h1>
          <p className="text-[11px] sm:text-xs font-extrabold tracking-[0.28em] text-[#0284C7] uppercase">
            Digital Healthcare Platform
          </p>
        </div>

        {/* Premium GPU-Accelerated ScaleX Progress Bar */}
        <div
          className={`mt-8 w-[72vw] max-w-[280px] sm:max-w-[320px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-220 ${
            isRevealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Clean Light Track */}
          <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60 shadow-inner">
            {/* GPU ScaleX Hardware-Accelerated Progress Fill */}
            <div
              className="h-full w-full bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 rounded-full origin-left transition-transform duration-100 ease-out"
              style={{ transform: `scaleX(${progressRatio})` }}
            />
          </div>
        </div>

        {/* Status Text */}
        <p
          className={`mt-3.5 text-[9px] sm:text-[10px] font-extrabold tracking-[0.24em] text-[#64748B] uppercase transition-all duration-700 delay-320 ${
            isRevealed && !isFadingOut ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Preparing your healthcare experience
        </p>

      </div>
    </div>
  );
}
