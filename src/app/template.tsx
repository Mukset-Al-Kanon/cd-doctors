'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(true);

  useEffect(() => {
    setNavigating(true);
    // Smooth scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div key={pathname} className="animate-page-enter relative w-full">
      {/* 🚀 Ultra-Thin Luxury Top Navigation Glow Bar */}
      {navigating && (
        <div className="fixed top-0 left-0 right-0 z-[999999] h-[2.5px] pointer-events-none overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(14,165,233,0.9)] page-progress-bar" />
        </div>
      )}
      {children}
    </div>
  );
}
