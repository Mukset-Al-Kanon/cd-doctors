'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, Stethoscope, Droplet, PhoneCall } from 'lucide-react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  trigger: boolean;
  isSecondaryAccent?: boolean;
}

function AnimatedCounter({ target, suffix = '', duration = 650, trigger, isSecondaryAccent }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Snappy flow with continuous movement right up to the final number (no end pause)
      const ease = progress * (2 - progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [trigger, target, duration]);

  return (
    <span className="text-3xl sm:text-4xl lg:text-[36px] font-black lg:font-extrabold tracking-tight tabular-nums text-sky-600">
      {count}{suffix}
    </span>
  );
}

interface StatCardsProps {
  hospitalCount: number;
  doctorCount?: number;
  bloodDonorCount?: number;
}

type StatItem =
  | { isText?: false; target: number; suffix?: string; label: string; icon: React.ElementType; isSecondaryAccent?: boolean }
  | { isText: true; text: string; label: string; icon: React.ElementType; isSecondaryAccent?: boolean };

export default function StatCards({ hospitalCount, doctorCount, bloodDonorCount }: StatCardsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  const stats: StatItem[] = [
    {
      target: hospitalCount ?? 0,
      suffix: '+',
      label: 'Hospitals in Chuadanga',
      icon: Building2,
    },
    {
      target: doctorCount ?? 0,
      suffix: '+',
      label: 'Specialist Doctors',
      icon: Stethoscope,
    },
    {
      target: bloodDonorCount ?? 0,
      suffix: '+',
      label: 'Blood Donors',
      icon: Droplet,
      isSecondaryAccent: true,
    },
    {
      isText: true,
      text: '24/7',
      label: 'Hotline & Emergency',
      icon: PhoneCall,
    },
  ];

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                transitionDelay: `${idx * 100}ms`,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
                opacity: isVisible ? 1 : 0,
              }}
              className={`bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs text-center space-y-1 transition-all duration-300 ease-in-out lg:hover:-translate-y-[2px] lg:hover:shadow-md ${
                stat.isSecondaryAccent ? 'lg:hover:border-emerald-300' : 'lg:hover:border-sky-300'
              }`}
            >
              {stat.isText ? (
                <span className="text-3xl sm:text-4xl lg:text-[36px] font-black lg:font-extrabold text-sky-600 tracking-tight block">
                  {stat.text}
                </span>
              ) : (
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  trigger={isVisible}
                  isSecondaryAccent={stat.isSecondaryAccent}
                />
              )}
              <p className="text-[11px] lg:text-[12px] font-extrabold lg:font-semibold text-slate-500 lg:text-[#6B7280] uppercase tracking-wider lg:tracking-[0.5px]">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
