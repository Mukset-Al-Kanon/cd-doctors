'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Stethoscope, Building2, PhoneCall } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  doctorName: string;
  specialization?: string;
  hospitalName?: string;
  phone?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  doctorName,
  specialization,
  hospitalName,
  phone,
}: ImageLightboxModalProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setActive(true), 15);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      document.body.style.overflow = '';
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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        active ? 'bg-slate-950/85 backdrop-blur-md opacity-100' : 'bg-slate-950/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Modal Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-md sm:max-w-lg w-full bg-slate-900 border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="বন্ধ করুন (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Doctor Photo */}
        <div className="relative aspect-square sm:aspect-4/3 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt={doctorName}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Doctor Information Footer */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white space-y-3 border-t border-white/10">
          <div className="space-y-1">
            {specialization && (
              <div className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-black bg-sky-950/80 px-2.5 py-0.5 rounded-lg border border-sky-400/20">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{specialization}</span>
              </div>
            )}

            <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-snug">
              {doctorName}
            </h3>

            {hospitalName && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-1.5 pt-0.5">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{hospitalName}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
