import React from 'react';

interface OfficialVerifiedBadgeProps {
  className?: string;
  size?: number | string;
  title?: string;
}

export default function OfficialVerifiedBadge({
  className = "w-4 h-4 shrink-0 inline-block align-middle select-none",
  size,
  title = "ভেরিফাইড বিশেষজ্ঞ (Verified)",
}: OfficialVerifiedBadgeProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/icons/official_verified_badge.png"
      alt="Verified"
      title={title}
      style={style}
      className={className}
      draggable={false}
    />
  );
}

export { OfficialVerifiedBadge };
