'use client';

import React, { useState, useEffect } from 'react';
import { Lock, LogIn, X, PhoneCall, Stethoscope } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectUrl?: string;
  iconType?: 'lock' | 'doctor' | 'hotline' | 'blood';
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  title = 'লগইন আবশ্যক',
  description = 'এই সেবাটি পেতে এবং ডাক্তারের সিরিয়াল নিশ্চিত করতে অনুগ্রহ করে আপনার একাউন্টে লগইন করুন বা সাইন-আপ করুন।',
  redirectUrl = '/login',
  iconType = 'doctor',
}: LoginPromptModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 280);
  };

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl p-5 sm:p-8 max-w-[340px] xs:max-w-sm sm:max-w-md w-full space-y-4 sm:space-y-5 shadow-2xl border border-slate-100 text-center relative max-h-[88vh] overflow-y-auto shrink-0 transform ${
          isClosing ? 'animate-modal-spring-out' : 'animate-modal-spring-in'
        }`}
      >
        {/* Top Mobile Ergonomic Drag Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-1" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-90 transition-all duration-200 cursor-pointer touch-manipulation"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing Icon Container */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-600 shrink-0 border border-sky-100/80 shadow-xs">
          <div className="absolute inset-0 bg-sky-500/10 rounded-2xl animate-pulse" />
          {iconType === 'doctor' && <Stethoscope className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />}
          {iconType === 'hotline' && <PhoneCall className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />}
          {iconType === 'lock' && <Lock className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />}
        </div>

        {/* Modal Title & Message */}
        <div className="space-y-2 font-bengali">
          <h3 className="text-xl sm:text-2xl font-extrabold text-nuvicaNavy-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-bengali">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-[0.97] transition-all duration-200 cursor-pointer touch-manipulation"
          >
            বাতিল করুন
          </button>
          <a
            href={redirectUrl}
            className="w-full sm:w-1/2 relative group/btn inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 hover:from-sky-700 hover:to-sky-600 text-white text-xs font-extrabold shadow-md hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.97] transition-all duration-300 overflow-hidden touch-manipulation"
          >
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
            <LogIn className="w-4 h-4 z-10" />
            <span className="z-10">লগইন / সাইন-আপ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
