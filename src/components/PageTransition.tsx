'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll smoothly to top on page switch
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div key={pathname} className="animate-page-smooth flex-1 flex flex-col w-full">
      {children}
    </div>
  );
}
