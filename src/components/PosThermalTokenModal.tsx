'use client';

import React, { useEffect } from 'react';
import { Printer, X, FileText } from 'lucide-react';

interface PosThermalTokenModalProps {
  token: {
    serialNumber: number | string;
    appointmentCode?: string;
    patientName: string;
    patientPhone?: string;
    patientAge?: number | string;
    patientGender?: string;
    appointmentDate: string;
    timeSlot?: string;
    estimatedTime?: string;
    chamberName?: string;
    chamberRoom?: string;
    fee?: number | string;
    createdAt?: string | Date;
    isWalkIn?: boolean;
  };
  doctor: {
    name: string;
    specialization?: string;
    degrees?: string;
    consultationFee?: number | string;
    chamberRoom?: string;
    chamberAddress?: string;
    hospitalName?: string;
    hospital?: { name: string; address?: string } | string;
    schedules?: Array<{ chamberName?: string; chamberAddress?: string }>;
  };
  onClose: () => void;
  autoPrint?: boolean;
}

function toBanglaDigits(str: string | number | null | undefined): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

// Formats serial as 01, 02, 03... strictly in Bangla without # hashtag
function formatSerialBangla(serial: number | string | null | undefined): string {
  if (serial === null || serial === undefined || serial === '') return '০১';
  const cleanStr = serial.toString().replace(/[^0-9]/g, '');
  const num = parseInt(cleanStr, 10);
  if (isNaN(num)) return toBanglaDigits(serial);
  const padded = num < 10 ? `0${num}` : `${num}`;
  return toBanglaDigits(padded);
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const monthNamesBn = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const mIdx = parseInt(month, 10) - 1;
      const monthName = monthNamesBn[mIdx] || month;
      return `${toBanglaDigits(parseInt(day, 10))} ${monthName}, ${toBanglaDigits(year)}`;
    }
    return toBanglaDigits(dateStr);
  } catch {
    return toBanglaDigits(dateStr);
  }
}

function formatBookingTime(createdAt?: string | Date, fallbackTime?: string): string {
  if (createdAt) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const isPm = hours >= 12;
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const timeStr = `${toBanglaDigits(hours.toString().padStart(2, '0'))}:${toBanglaDigits(minutes.toString().padStart(2, '0'))} ${isPm ? 'PM' : 'AM'}`;
        return timeStr;
      }
    } catch {
      // ignore
    }
  }
  return fallbackTime ? toBanglaDigits(fallbackTime) : '';
}

function isRoomString(str?: string): boolean {
  if (!str) return false;
  return /^(রুম|room|chamber\s*#|room\s*#)\s*[\d০-৯a-z]+/i.test(str.trim());
}

function cleanRoomNumber(room?: string): string {
  if (!room) return '';
  const cleaned = room.replace(/^(রুম\s*নং|রুম\s*নম্বর|রুম|Room\s*No\.?|Room)\s*:?\s*/i, '').trim();
  return cleaned ? `রুম: ${toBanglaDigits(cleaned)}` : '';
}

function getHospitalAndChamber(doctor: any, token: any): { 
  venueLabel: string; 
  venueName: string; 
  roomFormatted: string; 
} {
  let venueName = '';
  let isHospital = false;

  // 1. Doctor attached hospital
  if (doctor?.hospital) {
    if (typeof doctor.hospital === 'string' && doctor.hospital.trim()) {
      venueName = doctor.hospital.trim();
      isHospital = true;
    } else if (doctor.hospital.name && doctor.hospital.name.trim()) {
      venueName = doctor.hospital.name.trim();
      isHospital = true;
    }
  }

  // 2. Doctor Chamber Address
  if (!venueName && doctor?.chamberAddress && doctor.chamberAddress.trim()) {
    venueName = doctor.chamberAddress.trim();
  }

  // 3. Schedule Chamber Name
  if (!venueName && doctor?.schedules && doctor.schedules.length > 0 && doctor.schedules[0].chamberName) {
    venueName = doctor.schedules[0].chamberName.trim();
  }

  // 4. Token Chamber Name (if not a raw room string)
  if (!venueName && token?.chamberName && !isRoomString(token.chamberName) && token.chamberName !== 'চেম্বার কাউন্টার' && token.chamberName !== 'চেম্বার') {
    venueName = token.chamberName.trim();
  }

  if (!venueName && doctor?.hospitalName && doctor.hospitalName.trim()) {
    venueName = doctor.hospitalName.trim();
  }

  if (!venueName) {
    venueName = 'সিডি ডক্টরস চেম্বার';
  }

  // Extract Room
  let rawRoom = doctor?.chamberRoom || token?.chamberRoom || '';
  if (!rawRoom && isRoomString(token?.chamberName)) {
    rawRoom = token.chamberName;
  }

  const roomFormatted = cleanRoomNumber(rawRoom);
  const venueLabel = isHospital ? 'হাসপাতাল' : 'চেম্বার';

  return { venueLabel, venueName, roomFormatted };
}

export default function PosThermalTokenModal({
  token,
  doctor,
  onClose,
  autoPrint = false,
}: PosThermalTokenModalProps) {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  const feeAmount = token.fee ?? doctor.consultationFee;
  const bookingTimeStr = formatBookingTime(token.createdAt, token.estimatedTime || token.timeSlot);
  const bookingDateStr = token.createdAt 
    ? formatDisplayDate(new Date(token.createdAt).toISOString().split('T')[0]) 
    : formatDisplayDate(token.appointmentDate);

  const { venueLabel, venueName, roomFormatted } = getHospitalAndChamber(doctor, token);
  const serialFormatted = formatSerialBangla(token.serialNumber);

  return (
    <>
      {/* ========================================================================= */}
      {/* MODAL WRAPPER & WYSIWYG PRINT CONTAINER                                   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-transparent print:static print:block animate-in fade-in duration-150 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-3.5 border border-slate-100 my-auto font-sans print:p-0 print:shadow-none print:border-none print:m-0 print:max-w-none">
          
          {/* Top Modal Bar (Hidden in Print) */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 print:hidden">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">সিরিয়াল টোকেন স্লিপ</h3>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* 🎯 THE COMPACT TICKET PASS (1:1 EXACT PRINT & PREVIEW) */}
          <div className="print-sheet-root bg-white rounded-2xl border border-slate-300 p-3.5 shadow-xs print:rounded-lg print:border-slate-400 print:shadow-none print:max-w-[110mm]">
            
            {/* 1. TOP HEADER: Chamber on LEFT, CD DOCTORS on RIGHT */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 text-xs">
              {/* Left: Venue Name & Room Number */}
              <div className="text-left text-[11px] truncate max-w-[300px]">
                <span className="text-slate-500 font-medium">{venueLabel}: </span>
                <span className="text-slate-950 font-black">{venueName}</span>
                {roomFormatted && (
                  <span className="text-slate-600 font-bold ml-1">({roomFormatted})</span>
                )}
              </div>

              {/* Right: CD DOCTORS */}
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                CD DOCTORS
              </span>
            </div>

            {/* 2. MAIN HORIZONTAL BODY */}
            <div className="grid grid-cols-12 gap-3 items-center pt-2.5">
              
              {/* LEFT SIDE: Doctor Name, Specialization & Patient Details (8.5 cols) */}
              <div className="col-span-8 space-y-2 pr-2.5 border-r border-dashed border-slate-300">
                
                {/* Doctor Name & Specialization Only (No Degrees) */}
                <div>
                  <h4 className="text-[15px] font-black text-slate-950 leading-tight">
                    {doctor.name}
                  </h4>
                  {doctor.specialization && (
                    <p className="text-[11px] text-slate-600 font-medium leading-tight pt-0.5">
                      {doctor.specialization}
                    </p>
                  )}
                </div>

                {/* Compact Key-Value Details Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 text-[10px] font-medium block">রোগীর নাম:</span>
                    <span className="font-bold text-slate-950 text-[11.5px] truncate block">{token.patientName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] font-medium block">মোবাইল:</span>
                    <span className="font-bold text-slate-800 font-mono text-[11px] block">
                      {token.patientPhone && token.patientPhone !== 'N/A' ? token.patientPhone : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] font-medium block">সিরিয়াল তারিখ:</span>
                    <span className="font-bold text-slate-900 text-[11px] block">{formatDisplayDate(token.appointmentDate)}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] font-medium block">ভিজিট ফি:</span>
                    <span className="font-bold text-slate-950 text-[11.5px] block">
                      {feeAmount !== undefined && feeAmount !== null ? `৳ ${toBanglaDigits(feeAmount)}` : 'নির্ধারিত'}
                    </span>
                  </div>

                  <div className="col-span-2 pt-1 border-t border-slate-100 flex items-baseline gap-1 text-[10.5px]">
                    <span className="text-slate-500 font-medium shrink-0">বুকিং সময়:</span>
                    <span className="font-bold text-slate-800">
                      {bookingTimeStr ? `${bookingTimeStr}, ` : ''}{bookingDateStr}
                    </span>
                  </div>
                </div>

                {/* Minimal Instruction (No Emoji) */}
                <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-700 font-medium leading-tight">
                  <strong className="text-slate-950 font-bold">নির্দেশনা:</strong> সিরিয়াল অনুযায়ী অপেক্ষা করুন ও ডাকার সময় চেম্বারে উপস্থিত থাকুন।
                </div>

              </div>

              {/* RIGHT SIDE: Standout Serial Number (3.5 cols) */}
              <div className="col-span-4 flex flex-col items-center justify-center text-center space-y-0.5">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-widest">
                  সিরিয়াল নম্বর
                </span>
                
                {/* Large Bangla Serial (01, 02, 03... No Hashtag) */}
                <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans py-0.5 leading-none">
                  {serialFormatted}
                </div>

                {token.appointmentCode && (
                  <span className="text-[8px] font-mono font-medium text-slate-400 block pt-0.5">
                    {token.appointmentCode}
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* Action Buttons (Hidden in Print) */}
          <div className="flex items-center gap-2 pt-0.5 print:hidden">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRINT STYLES FOR CLEAN 1:1 WYSIWYG PRINTING                            */}
      {/* ========================================================================= */}
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 4mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body > * {
            visibility: hidden !important;
          }
          .print-sheet-root,
          .print-sheet-root * {
            visibility: visible !important;
          }
          .print-sheet-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 110mm !important;
            margin: 0 auto !important;
            display: block !important;
            z-index: 9999999 !important;
            background: #ffffff !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
