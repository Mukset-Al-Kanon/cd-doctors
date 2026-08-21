'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface DoctorScheduleItem {
  dayOfWeek: number;
  dayNameBn?: string;
  startTime: string;
  endTime: string;
}

interface DoctorItem {
  id: string;
  name: string;
  slug?: string;
  degrees: string;
  specialization: string;
  photoUrl?: string | null;
  phone?: string | null;
  experienceYears?: number;
  department?: {
    nameEn: string;
    nameBn: string;
  } | null;
  hospital?: {
    name: string;
    slug: string;
  } | null;
  schedules?: DoctorScheduleItem[];
}

interface HomeDoctorCarouselProps {
  doctors: DoctorItem[];
}

const DOCTOR_NAME_BANGLA_MAP: Record<string, string> = {
  'Dr. Mahbubur Rahman Chowdhury': 'ডা. মাহবুবুর রহমান চৌধুরী',
  'Dr. Selina Parveen': 'ডা. সেলিনা পারভীন',
  'Dr. Kazi Ariful Haque': 'ডা. কাজী আরিফুল হক',
  'Dr. Nuzhat Fatema': 'ডা. নুজহাত ফাতেমা',
  'Dr. Towhidul Islam': 'ডা. তৌহিদুল ইসলাম',
  'Dr. Sharmeen Sultana': 'ডা. শারমীন সুলতানা',
  'Dr. Md. Rafiqul Islam': 'ডা. মোঃ রফিকুল ইসলাম',
  'Dr. Farida Yasmin': 'ডা. ফরিদা ইয়াসমিন',
  'Dr. A.H.M. Kamal Hossain': 'ডা. এ.এইচ.এম কামাল হোসেন',
  'Dr. Nazmul Huda': 'ডা. নাজমুল হুদা',
  'Dr. Syeda Rawnak Jahan': 'ডা. সৈয়দা রওনক জাহান',
  'Dr. Md. Moniruzzaman': 'ডা. মোঃ মনিরুজ্জামান',
  'Dr. Sheikh Asaduzzaman': 'ডা. শেখ আসাদুজ্জামান',
  'Dr. Afroza Begum': 'ডা. আফরোজা বেগম',
  'Dr. Md. Zakir Hossain': 'ডা. মোঃ জাকir হোসেন',
  'Dr. Rehana Chowdhury': 'ডা. রেহানা চৌধুরী',
  'Dr. Md. Enamul Kabir': 'ডা. মোঃ এনামুল কবির',
  'Dr. Shahriar Ahmed': 'ডা. শাহরিয়ার আহমেদ',
  'Dr. Md. Motiur Rahman': 'ডা. মোঃ মতিউর রহমান',
  'Dr. Tahmina Akter': 'ডা. তাহমিনা আক্তার',
  'Dr. Md. Saiful Islam': 'ডা. মোঃ সাইফুল ইসলাম',
  'Dr. Golam Sarwar': 'ডা. গোলাম সারোয়ার',
  'Dr. Rumana Parvin': 'ডা. রুমানা পারভীন',
  'Dr. Md. Imran Hossain': 'ডা. মোঃ ইমরান হোসেন',
  'Dr. A.K.M. Fazlul Haque': 'ডা. এ.কে.এম ফজলুল হক',
  'Dr. Sayeeda Sultana': 'ডা. সাইয়িদা সুলতানা',
  'Dr. Md. Tariq Hasan': 'ডা. মোঃ তারিক হাসান',
  'Dr. Nazma Akter': 'ডা. নাজমা আক্তার',
  'Dr. Md. Babul Akhter': 'ডা. মোঃ বাবুল আক্তার',
  'Dr. Shamim Ara Begum': 'ডা. শামীম আরা বেগম',
  'Dr. Tanvir Ahmed': 'ডা. তানভীর আহমেদ',
  'Dr. Md. Tariqul Islam': 'ডা. মোঃ তারিকুল ইসলাম',
  'Dr. Shamima Nasrin': 'ডা. শামীমা নাসরিন',
  'Dr. Md. Asaduzzaman': 'ডা. মোঃ আসাদুজ্জামান',
};

function getDoctorBanglaName(name: string): string {
  if (!name) return '';
  return DOCTOR_NAME_BANGLA_MAP[name.trim()] || name;
}

// Fisher-Yates array randomizer so doctors order is randomized every visit
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function HomeDoctorCarousel({ doctors }: HomeDoctorCarouselProps) {
  const [shuffledDoctors, setShuffledDoctors] = useState<DoctorItem[]>([]);

  // Shuffle doctors on mount
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      setShuffledDoctors(shuffleArray(doctors).slice(0, 10));
    }
  }, [doctors]);

  const displayDoctors = shuffledDoctors.length > 0 ? shuffledDoctors : doctors.slice(0, 10);
  const N = displayDoctors.length;

  // Create 3 cloned sets for infinite circular loop: [Set 0, Set 1, Set 2]
  const extendedDoctors = N > 0 
    ? [...displayDoctors, ...displayDoctors, ...displayDoctors]
    : [];

  const [currentIndex, setCurrentIndex] = useState(N > 0 ? N : 0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const isAnimatingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync starting index when doctors change
  useEffect(() => {
    if (N > 0) {
      setCurrentIndex(N);
      setIsTransitioning(true);
    }
  }, [N]);

  // Active dot index (0 to N - 1)
  const activeDotIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  const handleNext = useCallback(() => {
    if (N === 0 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);

    setCurrentIndex((prev) => prev + 1);

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

  const handlePrev = useCallback(() => {
    if (N === 0 || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);

    setCurrentIndex((prev) => prev - 1);

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

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // 🔄 Automatic smooth scrolling every 3.5 seconds on both Mobile & Desktop
  useEffect(() => {
    if (isPaused || N <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, N, handleNext]);

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
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: INFINITE CIRCULAR LOOP CAROUSEL */}
      {/* ========================================================================= */}
      <div 
        className="md:hidden overflow-hidden w-screen relative left-1/2 -translate-x-1/2 py-3 select-none"
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
          {extendedDoctors.map((doctor, idx) => {
            const isActive = idx === currentIndex;
            const docNameBn = getDoctorBanglaName(doctor.name);
            const deptName = doctor.department?.nameBn || doctor.specialization || 'বিশেষজ্ঞ বিভাগ';
            const hospitalName = doctor.hospital?.name || 'চুয়াডাঙ্গা হাসপাতাল';

            return (
              <div
                key={`${doctor.id}-mobile-doc-${idx}`}
                onClick={() => {
                  if (!isActive && !isAnimatingRef.current) {
                    setIsTransitioning(true);
                    setCurrentIndex(idx);
                  }
                }}
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
                {/* 🎴 Clickable Doctor Card (Entire Card is Button) */}
                <Link
                  href={`/doctors?q=${encodeURIComponent(doctor.name)}`}
                  className={`block bg-slate-950 rounded-3xl overflow-hidden group active:scale-[0.98] transition-all duration-200 ${
                    isActive ? 'shadow-[0_20px_40px_-10px_rgba(15,23,42,0.65)]' : 'shadow-md shadow-slate-950/30'
                  }`}
                >
                  {/* Doctor Photo Box with Dark Gradient Overlay */}
                  <div className="relative aspect-[1/1] w-full overflow-hidden bg-slate-900">
                    <img
                      src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                      alt={docNameBn}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>

                  {/* Dark Theme Details Box */}
                  <div className="p-4 pt-2.5 pb-4 space-y-1.5 bg-slate-950 text-white">
                    <div className="flex items-center gap-1.5 text-sky-400 text-xs font-black">
                      <Stethoscope className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{deptName}</span>
                    </div>

                    <h3 className="font-black text-base sm:text-lg text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-1">
                      {docNameBn}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hospitalName}</span>
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* 🔘 Brand Sky-Blue Pagination Dots Indicator (Synced with Card Animation) */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {displayDoctors.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToDot(idx)}
              aria-label={`Doctor slide ${idx + 1}`}
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
      {/* 💻 DESKTOP / WINDOWS VIEW: 4-COLUMN INFINITE SMOOTH SCROLL CAROUSEL */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative group/desktop-slider mb-8 lg:mb-[40px]">
        {/* Overflow Container */}
        <div className="overflow-hidden w-full py-2">
          {/* Infinite Track shifting 1 card (25%) per step */}
          <div 
            className={`flex gap-6 will-change-transform ${
              isTransitioning 
                ? 'transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]' 
                : 'transition-none'
            }`}
            style={{
              transform: `translateX(calc(-${currentIndex} * (25% + 18px)))`,
            }}
          >
            {extendedDoctors.map((doctor, idx) => {
              const docNameBn = getDoctorBanglaName(doctor.name);
              const deptName = doctor.department?.nameBn || doctor.specialization || 'বিশেষজ্ঞ বিভাগ';
              const hospitalName = doctor.hospital?.name || 'চুয়াডাঙ্গা হাসপাতাল';

              return (
                <div 
                  key={`${doctor.id}-desktop-doc-${idx}`}
                  className="w-[calc(25%-18px)] shrink-0 select-none"
                >
                  <Link
                    href={`/doctors?q=${encodeURIComponent(doctor.name)}`}
                    className="block bg-slate-950 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden group transition-all duration-300 cursor-pointer"
                  >
                    {/* Doctor Photo */}
                    <div className="relative aspect-[1/1] w-full overflow-hidden bg-slate-900">
                      <img
                        src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                        alt={docNameBn}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </div>

                    {/* Doctor Details */}
                    <div className="p-4 pt-2.5 pb-4 space-y-1.5 bg-slate-950 text-white">
                      <div className="flex items-center gap-1.5 text-sky-400 text-xs font-black">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{deptName}</span>
                      </div>

                      <h3 className="font-black text-base lg:text-lg text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-1">
                        {docNameBn}
                      </h3>

                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{hospitalName}</span>
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Left / Right Navigation Arrow Buttons */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous doctors"
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-sky-600 border border-slate-200/90 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 cursor-pointer opacity-0 group-hover/desktop-slider:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next doctors"
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-sky-600 border border-slate-200/90 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-20 cursor-pointer opacity-0 group-hover/desktop-slider:opacity-100"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 🔘 Desktop Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {displayDoctors.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToDot(idx)}
              aria-label={`Doctor slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer ${
                activeDotIndex === idx 
                  ? 'w-7 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 shadow-xs' 
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
