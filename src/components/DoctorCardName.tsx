'use client';

import React, { useRef, useState, useEffect } from 'react';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

interface DoctorCardNameProps {
  name: string;
  isVerified?: boolean;
  className?: string;
}

export default function DoctorCardName({
  name,
  isVerified = true,
  className = "font-black text-base sm:text-lg md:text-[18px] text-nuvicaNavy-950 group-hover/name:text-sky-700 transition-colors leading-snug tracking-tight cursor-pointer",
}: DoctorCardNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = (name || '').trim().split(/\s+/);

  // Default initial lines:
  // If words <= 3, assume 1 line; if words > 3, Line 1 gets all words except last, Line 2 gets last word
  const getInitialLines = () => {
    if (words.length <= 3) {
      return { line1: name, line2: '' };
    }
    return {
      line1: words.slice(0, -1).join(' '),
      line2: words.slice(-1).join(' '),
    };
  };

  const [lines, setLines] = useState<{ line1: string; line2: string }>(getInitialLines);

  useEffect(() => {
    if (!isVerified || !containerRef.current) return;

    const measureAndSplit = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      // Create a canvas context to measure text with exact font styles
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computed = window.getComputedStyle(container);
      ctx.font = `${computed.fontWeight || '900'} ${computed.fontSize || '17px'} ${computed.fontFamily || 'sans-serif'}`;

      const badgeWidthWithGap = 24; // 16px badge + 6px gap + 2px buffer

      // Check if all words fit on 1 line with the badge
      const fullWidth = ctx.measureText(name).width;
      if (fullWidth + badgeWidthWithGap <= containerWidth) {
        setLines({ line1: name, line2: '' });
        return;
      }

      // If it doesn't fit on 1 line, find maximum words that fit on Line 1 with badge
      let bestIndex = 1;
      for (let i = words.length - 1; i >= 1; i--) {
        const candidateLine1 = words.slice(0, i).join(' ');
        const candidateWidth = ctx.measureText(candidateLine1).width;
        if (candidateWidth + badgeWidthWithGap <= containerWidth) {
          bestIndex = i;
          break;
        }
      }

      setLines({
        line1: words.slice(0, bestIndex).join(' '),
        line2: words.slice(bestIndex).join(' '),
      });
    };

    measureAndSplit();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureAndSplit();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [name, isVerified]);

  if (!isVerified) {
    return (
      <div ref={containerRef} className={className}>
        <span className="line-clamp-2">{name}</span>
      </div>
    );
  }

  // If fits on 1 line:
  if (!lines.line2) {
    return (
      <div ref={containerRef} className={className}>
        <span className="inline-flex items-center gap-1.5">
          <span>{lines.line1}</span>
          <OfficialVerifiedBadge className="w-4 h-4 shrink-0 inline-block align-middle select-none -translate-y-0.5" />
        </span>
      </div>
    );
  }

  // If 2 lines: Line 1 has the badge right beside it, Line 2 is below it with NO gap!
  return (
    <div ref={containerRef} className={className}>
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span>{lines.line1}</span>
        <OfficialVerifiedBadge className="w-4 h-4 shrink-0 inline-block align-middle select-none -translate-y-0.5" />
      </div>
      <div className="leading-snug pt-0.5 truncate">
        {lines.line2}
      </div>
    </div>
  );
}
