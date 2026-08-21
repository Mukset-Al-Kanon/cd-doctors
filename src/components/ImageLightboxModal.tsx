'use client';

import React, { useEffect, useState } from 'react';
import { X, ZoomIn, Stethoscope } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  doctorName: string;
  specialization?: string;
  hospitalName?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  doctorName,
  specialization,
  hospitalName,
}: ImageLightboxModalProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Trigger animation on next tick
      const timer = setTimeout(() => setActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        active ? 'bg-black/85 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-md w-full bg-slate-900/90 border border-white/15 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-4 opacity-0'
        }`}
      >
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="বন্ধ করুন (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Doctor Photo with zoom-in styling */}
        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden group">
          <img
            src={imageUrl}
            alt={doctorName}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Doctor Details Bar */}
        <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-1.5 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{specialization || 'বিশেষজ্ঞ চিকিৎসক'}</span>
          </div>

          <h3 className="font-black text-lg sm:text-xl text-white tracking-tight leading-snug">
            {doctorName}
          </h3>

          {hospitalName && (
            <p className="text-xs text-slate-400 font-medium truncate">
              🏢 {hospitalName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
