'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, ShieldCheck, QrCode } from 'lucide-react';

interface HealthQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientPhone?: string;
  vaultUrl?: string;
}

export default function HealthQrModal({
  isOpen,
  onClose,
  patientName = 'মো: করিম উদ্দিন',
  patientPhone = '01712-345678',
  vaultUrl,
}: HealthQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleSmoothClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  const fullShareUrl = vaultUrl || (typeof window !== 'undefined' ? `${window.location.origin}/patient/vault?access=temp_${Date.now()}` : 'https://cddoctors.com/patient/vault');
  
  // High-contrast clean black-on-white QR Code for maximum optical scan accuracy & professional aesthetic
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullShareUrl)}&color=0f172a&bgcolor=ffffff&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 font-bengali ${
        isClosing ? 'animate-modal-backdrop-exit' : 'animate-modal-backdrop'
      }`}
      onClick={handleSmoothClose}
    >
      <div 
        className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
          isClosing ? 'animate-modal-spring-exit' : 'animate-modal-spring'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Minimal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              রোগীর মেডিকেল QR পাস
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              চেম্বারে স্ক্যান করে ফাইল দেখতে
            </p>
          </div>

          <button
            onClick={handleSmoothClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Digital Pass Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          
          {/* Patient Header Badge */}
          <div className="w-full bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 font-bold block">রোগীর নাম</span>
              <h4 className="text-sm font-black text-slate-900">{patientName}</h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-bold block">মোবাইল</span>
              <span className="text-xs font-black text-slate-700">{patientPhone}</span>
            </div>
          </div>

          {/* Crisp High-Contrast Monochrome QR Tile */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
            <img
              src={qrApiUrl}
              alt="Health Vault QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
            ডাক্তার এই QR স্ক্যান করলেই আপনার সংরক্ষিত প্রেসক্রিপশন ও টেস্ট রিপোর্ট সরাসরি দেখতে পাবেন।
          </p>

          {/* 2-Button Action Bar */}
          <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCopyLink}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>লিংক কপি</span>
                </>
              )}
            </button>

            <a
              href={qrApiUrl}
              download="health-qr.png"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>ডাউনলোড</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
