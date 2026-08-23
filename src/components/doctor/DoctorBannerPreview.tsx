'use client';

import React from 'react';

interface DoctorBannerProps {
  doctorName: string;
  degrees: string;
  specialization: string;
  hospitalOrChamber: string;
  address: string;
  scheduleTime: string;
  phoneNumbers: string;
  photoUrl?: string;
  logoText?: string;
}

export default function DoctorBannerPreview({
  doctorName = 'ডাঃ শাপলা খাতুন',
  degrees = 'MBBS, BCS (Health), MS (Obs & Gynae)',
  specialization = 'স্ত্রী ও প্রসূতি রোগ বিশেষজ্ঞ ও সার্জন',
  hospitalOrChamber = 'সনো ডায়াগনস্টিক সেন্টার লিমিটেড',
  address = 'সনো টাওয়ার, হাসপাতাল রোড, চুয়াডাঙ্গা - ৭২০০',
  scheduleTime = 'প্রতিদিন বিকাল ৩টা থেকে রাত ৮টা ও শুক্রবার সকাল ৯টা থেকে দুপুর ২টা পর্যন্ত।',
  phoneNumbers = '01718-703136 | 01922-393636',
  photoUrl = 'https://images.unsplash.com/photo-1594824813580-c1165d6c8e31?w=800&auto=format&fit=crop&q=80',
  logoText = 'Chuadanga Branch',
}: DoctorBannerProps) {
  return (
    <div className="relative w-full max-w-[480px] mx-auto aspect-[4/5] rounded-[28px] overflow-hidden shadow-xl bg-gradient-to-b from-[#eaf4fc] via-[#f3f8fd] to-[#ffffff] border-4 border-white flex flex-col justify-between p-5 select-none font-sans">
      
      {/* Decorative Vector Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full border border-sky-300/30 pointer-events-none -mr-12 -mt-12" />
      <div className="absolute top-10 right-4 w-44 h-44 rounded-full border border-sky-400/20 pointer-events-none" />

      {/* 1. Header: Clinic / Center Brand */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h3 className="font-black text-sm sm:text-base text-[#0f2d59] leading-tight">
            Sono Diagnostic <span className="text-slate-400 font-normal">|</span> <span className="font-bold text-sky-700">Chuadanga</span>
          </h3>
          <p className="text-[10px] font-black text-sky-800 tracking-wider uppercase">
            Center LTD <span className="font-semibold text-slate-500 lowercase italic text-[9px]">State Of Art Diagnostic Service</span>
          </p>
        </div>

        <span className="bg-sky-100 text-sky-800 text-[9px] font-bold px-2 py-0.5 rounded-md border border-sky-200">
          Verified Specialist
        </span>
      </div>

      {/* 2. Middle Body: Info on Left + Doctor Portrait on Right */}
      <div className="relative z-10 grid grid-cols-12 gap-2 my-auto items-center">
        
        {/* Left: Doctor Credentials */}
        <div className="col-span-7 pr-1 space-y-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0a2540] leading-tight tracking-tight">
              {doctorName}
            </h1>
            <p className="text-[11px] font-bold text-slate-600 mt-0.5 leading-snug">
              {degrees}
            </p>
          </div>

          {/* Specialization Badge */}
          <div className="inline-block bg-[#00529b] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            {specialization}
          </div>

          {/* Address / Chamber Subtitle */}
          <p className="text-[10px] font-semibold text-slate-600 leading-snug">
            {address}
          </p>

          {/* Visiting Hours Blue Box */}
          <div className="bg-[#dcf0fa] border border-sky-200/80 rounded-xl p-2.5 shadow-2xs">
            <p className="text-[11px] font-extrabold text-[#00529b]">
              রোগী দেখার সময়ঃ
            </p>
            <p className="text-[10px] font-bold text-slate-800 mt-0.5 leading-snug">
              {scheduleTime}
            </p>
          </div>
        </div>

        {/* Right: Doctor Studio Portrait */}
        <div className="col-span-5 relative flex justify-center items-end">
          <div className="relative w-36 h-48 sm:w-40 sm:h-54">
            <img
              src={photoUrl}
              alt={doctorName}
              className="w-full h-full object-cover object-top rounded-2xl shadow-lg border-2 border-white relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute -bottom-2 -left-2 z-20 bg-white text-sky-900 text-[9px] font-black px-2 py-0.5 rounded-md shadow-md border border-sky-100 flex items-center gap-1">
              <span>✨</span> Studio HD
            </div>
          </div>
        </div>

      </div>

      {/* 3. Bottom Dark Navy Footer Bar */}
      <div className="relative z-10 bg-[#072b4f] text-white rounded-xl p-2.5 shadow-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00529b] text-white font-black text-xs flex items-center justify-center border border-sky-400/30">
            sdc
          </div>
          <div>
            <p className="text-[8px] text-sky-200 font-semibold uppercase tracking-wider leading-none">
              সিরিয়াল এর জন্য-
            </p>
            <p className="text-[11px] sm:text-xs font-black tracking-wide text-white mt-0.5">
              📞 {phoneNumbers}
            </p>
          </div>
        </div>

        <div className="text-[8px] text-sky-200/80 font-medium text-right leading-tight max-w-[140px] truncate">
          📍 {address}
        </div>
      </div>

    </div>
  );
}
