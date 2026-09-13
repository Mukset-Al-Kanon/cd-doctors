'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Share2, 
  Check, 
  FileText, 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  Phone, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';

interface PrescriptionPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: any;
  prescription: {
    prescriptionCode?: string;
    patientName: string;
    patientPhone: string;
    patientAge?: number | string;
    patientGender?: string;
    patientWeight?: string;
    bp?: string;
    pulse?: string;
    temperature?: string;
    bloodSugar?: string;
    chiefComplaints?: string[] | string;
    clinicalFindings?: string;
    diagnosis?: string;
    investigations?: string[] | string;
    medicines: Array<{
      brandName: string;
      genericName?: string;
      form?: string;
      strength?: string;
      dosage?: string;
      duration?: string;
      instruction?: string;
    }>;
    advice?: string[] | string;
    nextVisit?: string;
    createdAt?: string;
  };
}

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatDisplayDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  return `${toBanglaDigits(d.getDate())} ${months[d.getMonth()]}, ${toBanglaDigits(d.getFullYear())}`;
}

export default function PrescriptionPrintModal({
  isOpen,
  onClose,
  doctor,
  prescription
}: PrescriptionPrintModalProps) {
  const [printOnPreprintedPad, setPrintOnPreprintedPad] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    if (prescription.prescriptionCode) {
      navigator.clipboard.writeText(prescription.prescriptionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parse arrays if they are JSON strings
  const parseList = (item?: any): string[] => {
    if (!item) return [];
    if (Array.isArray(item)) return item;
    try {
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed : [item];
    } catch {
      return [item];
    }
  };

  const complaintsList = parseList(prescription.chiefComplaints);
  const investigationsList = parseList(prescription.investigations);
  const adviceList = parseList(prescription.advice);

  const venueName = doctor?.hospital?.name || doctor?.chamberAddress || doctor?.schedules?.[0]?.chamberName || 'মূল চেম্বার';
  const chamberRoom = doctor?.chamberRoom ? `রুম: ${toBanglaDigits(doctor.chamberRoom)}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Container Dialog */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:m-0 print:rounded-none">
        
        {/* ========================================================================= */}
        {/* Top Control Bar (Hidden on actual print paper)                            */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide">প্রেসক্রিপশন প্রিন্ট ও প্রিভিউ</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {prescription.prescriptionCode || 'RX-DRAFT'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Pad Mode */}
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 cursor-pointer border border-slate-700 text-xs font-semibold select-none">
              <input
                type="checkbox"
                checked={printOnPreprintedPad}
                onChange={(e) => setPrintOnPreprintedPad(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 cursor-pointer accent-sky-500"
              />
              <span>ডাক্তারের নিজস্ব প্যাডে প্রিন্ট (হেডার লুকান)</span>
            </label>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন (A4)</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📄 THE A4 CLINICAL PRESCRIPTION SHEET (100% Print Compatible)              */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 font-sans min-h-[950px] flex flex-col justify-between print:p-6 print:min-h-screen">
          
          <div>
            {/* 1. DOCTOR OFFICIAL LETTERHEAD / PAD (Hide if preprinted pad is checked) */}
            {!printOnPreprintedPad ? (
              <div className="border-b-2 border-sky-800/80 pb-5 mb-5 flex flex-col sm:flex-row justify-between gap-4">
                
                {/* Doctor Left Info */}
                <div className="space-y-1 max-w-md">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                    <span>{doctor?.name || 'ডাক্তার'}</span>
                    <OfficialVerifiedBadge className="w-5 h-5 shrink-0 inline-block align-middle" />
                  </h1>
                  <p className="text-xs font-bold text-slate-700 leading-snug">
                    {doctor?.degrees || 'MBBS, BCS (Health)'}
                  </p>
                  <p className="text-xs font-black text-sky-800">
                    {doctor?.specialization || 'জেনারেল ফিজিশিয়ান ও কনসালট্যান্ট'}
                  </p>
                  {doctor?.bmdcNumber && (
                    <p className="text-[11px] font-mono text-slate-500 font-semibold">
                      BMDC রেজি: নং: <span className="font-bold text-slate-800">{doctor.bmdcNumber}</span>
                    </p>
                  )}
                </div>

                {/* Chamber Right Info */}
                <div className="sm:text-right space-y-1 text-xs text-slate-600">
                  <div className="font-black text-slate-900 flex sm:justify-end items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>{venueName}</span>
                  </div>
                  {chamberRoom && (
                    <p className="font-bold text-sky-800">{chamberRoom}</p>
                  )}
                  {doctor?.phone && (
                    <p className="font-medium text-[11.5px] flex sm:justify-end items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>সিরিয়াল বুকিং: <span className="font-mono font-bold text-slate-800">{doctor.phone}</span></span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 font-medium">CD Doctors ডিজিটাল হেলথ নেটওয়ার্ক</p>
                </div>

              </div>
            ) : (
              /* Reserve margin for physical hospital pre-printed pad */
              <div className="h-28 print:h-32 border-b border-dashed border-slate-200 mb-5 flex items-center justify-center text-xs text-slate-400 print:text-transparent">
                (ডাক্তারের প্রি-প্রিন্টেড প্যাডের জন্য সংরক্ষিত ফাঁকা অংশ)
              </div>
            )}

            {/* 2. PATIENT INFO BAR */}
            <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">রোগীর নাম:</span>
                <span className="font-black text-slate-900 text-sm">{prescription.patientName}</span>
              </div>

              <div className="flex items-center gap-4">
                {prescription.patientAge && (
                  <div>
                    <span className="text-slate-400">বয়স:</span>{' '}
                    <span className="font-bold text-slate-900">{toBanglaDigits(prescription.patientAge)} বছর</span>
                  </div>
                )}

                {prescription.patientGender && (
                  <div>
                    <span className="text-slate-400">লিঙ্গ:</span>{' '}
                    <span className="font-bold text-slate-900">
                      {prescription.patientGender === 'MALE' ? 'পুরুষ' : prescription.patientGender === 'FEMALE' ? 'মহিলা' : prescription.patientGender}
                    </span>
                  </div>
                )}

                {prescription.patientWeight && (
                  <div>
                    <span className="text-slate-400">ওজন:</span>{' '}
                    <span className="font-bold text-slate-900">{toBanglaDigits(prescription.patientWeight)} কেজি</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {prescription.bp && (
                  <div>
                    <span className="text-slate-400">BP:</span>{' '}
                    <span className="font-mono font-black text-rose-700">{prescription.bp} mmHg</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400">তারিখ:</span>{' '}
                  <span className="font-bold text-slate-900">{formatDisplayDate(prescription.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* 3. DUAL-COLUMN CLINICAL BODY */}
            <div className="grid grid-cols-12 gap-6 min-h-[500px]">
              
              {/* ========================================================================= */}
              {/* LEFT COLUMN: Clinical Examination & Investigations (35% Width)           */}
              {/* ========================================================================= */}
              <div className="col-span-4 border-r-2 border-slate-100 pr-4 space-y-6 text-xs">
                
                {/* Chief Complaints (C/C) */}
                {complaintsList.length > 0 && (
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200/80 mb-2">
                      Chief Complaints (C/C):
                    </h3>
                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                      {complaintsList.map((c, i) => (
                        <li key={i} className="leading-tight">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* On Examination (O/E) / Clinical Findings */}
                {prescription.clinicalFindings && (
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200/80 mb-1.5">
                      On Examination (O/E):
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                      {prescription.clinicalFindings}
                    </p>
                  </div>
                )}

                {/* Diagnosis / Prov. Diagnosis */}
                {prescription.diagnosis && (
                  <div>
                    <h3 className="font-black text-sky-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200/80 mb-1.5">
                      Diagnosis:
                    </h3>
                    <p className="font-bold text-sky-800 bg-sky-50/80 px-2.5 py-1.5 rounded-lg border border-sky-200/60 leading-snug">
                      {prescription.diagnosis}
                    </p>
                  </div>
                )}

                {/* Investigations Advised */}
                {investigationsList.length > 0 && (
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200/80 mb-2">
                      Investigations Advised:
                    </h3>
                    <ul className="space-y-1.5 text-slate-700">
                      {investigationsList.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0"></span>
                          <span className="font-semibold">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* ========================================================================= */}
              {/* RIGHT COLUMN: Rx Medicines (65% Width)                                   */}
              {/* ========================================================================= */}
              <div className="col-span-8 pl-2 space-y-6">
                
                {/* Rx Symbol */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-serif italic font-black text-3xl text-sky-900 tracking-tighter">
                    ℞
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (ঔষধ সেবনের নিয়ম ও মাত্রা)
                  </span>
                </div>

                {/* Medicines List */}
                <div className="space-y-4">
                  {prescription.medicines.map((med, index) => (
                    <div key={index} className="space-y-1 pb-3 border-b border-slate-100 last:border-none">
                      
                      {/* Medicine Header: Type + Brand + Strength */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-xs text-slate-400 w-5">
                            {index + 1}.
                          </span>
                          <span className="font-black text-sm text-slate-950">
                            {med.form ? `${med.form} ` : ''}{med.brandName}
                          </span>
                          {med.strength && (
                            <span className="text-xs font-bold text-sky-700">
                              ({med.strength})
                            </span>
                          )}
                        </div>

                        {/* Duration */}
                        {med.duration && (
                          <span className="text-xs font-bold text-slate-700 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-md">
                            {med.duration}
                          </span>
                        )}
                      </div>

                      {/* Generic Subtitle */}
                      {med.genericName && (
                        <p className="text-[11px] text-slate-400 pl-6.5 font-medium italic">
                          {med.genericName}
                        </p>
                      )}

                      {/* Dosage + Timing Instruction */}
                      <div className="pl-6.5 flex flex-wrap items-center gap-3 text-xs pt-0.5">
                        <span className="font-black text-slate-900 font-mono text-[13px] tracking-wide">
                          {med.dosage || '১+০+১'}
                        </span>
                        {med.instruction && (
                          <span className="text-slate-600 font-medium bg-amber-50/70 border border-amber-200/60 px-2 py-0.5 rounded text-[11px]">
                            {med.instruction}
                          </span>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Special Advice / নির্দেশিকা */}
                {adviceList.length > 0 && (
                  <div className="pt-4 border-t border-slate-200/80">
                    <h4 className="font-black text-xs text-slate-900 mb-2">
                      পরামর্শ ও বিশেষ নির্দেশিকা (Advice):
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                      {adviceList.map((adv, idx) => (
                        <li key={idx} className="leading-relaxed">{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* 4. FOOTER: Follow-up & Doctor Signature */}
          <div className="mt-8 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
            
            {/* Follow-up Note */}
            <div className="text-xs space-y-1">
              {prescription.nextVisit && (
                <p className="font-bold text-sky-900 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/70 inline-block">
                  পরবর্তী সাক্ষাত: <span className="font-black">{prescription.nextVisit}</span> পর
                </p>
              )}
              <p className="text-[10.5px] text-slate-400">
                জরুরি প্রয়োজনে নিকটস্থ সরকারি হাসপাতালে যোগাযোগ করুন।
              </p>
            </div>

            {/* Doctor Signature Block */}
            <div className="text-right space-y-1 pt-6 sm:pt-0">
              <div className="w-44 border-b border-slate-400 pb-1 ml-auto"></div>
              <p className="text-xs font-black text-slate-900">ডাক্তারের স্বাক্ষর ও সিল</p>
              <p className="text-[10px] text-slate-400">স্বাক্ষরিত ডিজিটাল কপি</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
