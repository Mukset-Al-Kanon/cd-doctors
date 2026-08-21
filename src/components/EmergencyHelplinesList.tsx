'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Truck, 
  Droplet, 
  Flame,
  Lock
} from 'lucide-react';
import LoginPromptModal from '@/components/LoginPromptModal';

const ICON_MAP: Record<string, any> = {
  ShieldAlert,
  Building2,
  HeartPulse,
  Droplet,
  Truck,
  Flame,
  PhoneCall,
};

interface HelplineItem {
  id: string;
  title: string;
  number: string;
  desc: string;
  badge: string;
  icon: string;
}

interface EmergencyHelplinesListProps {
  helplines: HelplineItem[];
}

export default function EmergencyHelplinesList({ helplines }: EmergencyHelplinesListProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedHelpline, setSelectedHelpline] = useState<HelplineItem | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleCallClick = (h: HelplineItem) => {
    setSelectedHelpline(h);
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {helplines.map((h) => {
          const Icon = ICON_MAP[h.icon] || PhoneCall;
          return (
            <div
              key={h.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                    {h.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-base text-nuvicaNavy-900 leading-snug group-hover:text-sky-700 transition-colors">
                    {h.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              </div>

              {/* Call Button (with login prompt for unauthenticated visitors) */}
              {isLoggedIn ? (
                <a
                  href={`tel:${h.number}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-sky-500 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3 h-3 text-white" />
                  </div>
                  <span className="tracking-wide">Call {h.number}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCallClick(h)}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-sky-500 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3 h-3 text-white" />
                  </div>
                  <span className="tracking-wide">Call {h.number}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Login Prompt Modal for Emergency Hotline Call */}
      <LoginPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="জরুরি হটলাইনের জন্য লগইন করুন"
        description="জরুরি হটলাইন সেবায় সরাসরি সংযোগ নিশ্চিত করতে অনুগ্রহ করে আপনার একাউন্টে লগইন করুন বা মাত্র ১ মিনিটে ফ্রি সাইন-আপ করুন।"
        redirectUrl="/login?redirect=/emergency"
        iconType="hotline"
      />
    </>
  );
}
