'use client';

import React, { useState, useEffect } from 'react';

interface HealthTip {
  id: string;
  categoryBn: string;
  title: string;
  tipBn: string;
}

const DEFAULT_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    categoryBn: 'চোখের যত্ন',
    title: '২০-২০-২০ নিয়ম মেনে চলুন',
    tipBn: 'মোবাইল বা কম্পিউটারে কাজের সময় প্রতি ২০ মিনিট পর পর ২০ ফুট দূরের কোনো বস্তুর দিকে অন্তত ২০ সেকেন্ড তাকিয়ে থাকুন। এটি চোখের ড্রাইনেস ও স্ক্রিন স্ট্রেন রোধ করে।',
  },
  {
    id: 'tip-2',
    categoryBn: 'পুষ্টি ও খাবার',
    title: 'খাবারের পর হালকা হাঁটা',
    tipBn: 'ভারী খাবারের পরপরই শুয়ে না পড়ে অন্তত ১০-১৫ মিনিট ধীরেসুস্থে হাঁটুন। এটি হজমে সহায়তা করে এবং রক্তে গ্লুকোজ নিয়ন্ত্রণে রাখে।',
  },
  {
    id: 'tip-3',
    categoryBn: 'পানি ও হাইড্রেশন',
    title: 'পর্যাপ্ত বিশুদ্ধ পানি পান করুন',
    tipBn: 'প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার বিশুদ্ধ পানি পান করুন। এটি শরীরের বিষাক্ত উপাদান বের করতে ও স্বাভাবিক রক্ত সঞ্চালন বজায় রাখতে সাহায্য করে।',
  },
  {
    id: 'tip-4',
    categoryBn: 'হৃদরোগ ও রক্তচাপ',
    title: 'লবণের মাত্রা নিয়ন্ত্রণ করুন',
    tipBn: 'খাবারের সাথে বাড়তি কাঁচা লবণ খাওয়া বন্ধ করুন। অতিরিক্ত সোডিয়াম রক্তনালীতে চাপ ফেলে রক্তচাপ (High BP) বাড়িয়ে দেয়।',
  },
  {
    id: 'tip-5',
    categoryBn: 'মানসিক প্রশান্তি ও ঘুম',
    title: 'ঘুমানোর ৩০ মিনিট আগে স্ক্রিন অফ রাখুন',
    tipBn: 'রাতে ঘুমানোর অন্তত আধা ঘণ্টা আগে মোবাইল ফোন বা ল্যাপটপের আলো এড়িয়ে চলুন। এটি মেলাটোনিন হরমোন নিঃসরণ বাড়িয়ে গভীর ঘুম নিশ্চিত করে।',
  },
  {
    id: 'tip-6',
    categoryBn: 'মৌসুমি সতর্কতা',
    title: 'জ্বর হলে পর্যাপ্ত তরল খাবার গ্রহণ করুন',
    tipBn: 'মৌসুমি জ্বর হলে পর্যাপ্ত বিশ্রামের পাশাপাশি স্যালাইন, স্যুপ ও ডাবের পানি পান করুন। ডাক্তারের পরামর্শ ছাড়া অ্যান্টিবায়োটিক বা ব্যথানাশক গ্রহণ করবেন না।',
  },
];

function cleanText(text: string): string {
  if (!text) return '';
  // Removes emojis and symbols
  try {
    return text.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF\uFE0F\u200D]/g, '').trim();
  } catch {
    return text.trim();
  }
}

export default function HealthTipsPage() {
  const [tips, setTips] = useState<HealthTip[]>(DEFAULT_TIPS);

  useEffect(() => {
    fetch('/api/health-tips')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.allTips && data.allTips.length > 0) {
          const cleaned = data.allTips.map((t: HealthTip) => ({
            ...t,
            categoryBn: cleanText(t.categoryBn),
            title: cleanText(t.title),
            tipBn: cleanText(t.tipBn),
          }));
          setTips(cleaned);
        }
      })
      .catch(() => null);
  }, []);

  const todayTip = tips[0] || DEFAULT_TIPS[0];
  const otherTips = tips.slice(1);

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 sm:py-10 px-4 sm:px-6 font-bengali">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Minimal Clean Header */}
        <div className="space-y-1 text-center sm:text-left pt-2 pb-1">
          <h1 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-950 tracking-tight">
            দৈনিক স্বাস্থ্য পরার্মশ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            সুস্থ জীবনের জন্য চিকিৎসাবিজ্ঞানসম্মত সহজ ও জরুরি স্বাস্থ্য টিপস।
          </p>
        </div>

        {/* Feature 1: Today's Featured Tip Card (Professional White Clean Card) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100/90 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200/60">
              আজকের পরামর্শ
            </span>
            <span className="text-xs font-bold text-slate-400">
              {cleanText(todayTip.categoryBn)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-nuvicaNavy-950 leading-snug">
            {cleanText(todayTip.title)}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {todayTip.tipBn}
          </p>
        </div>

        {/* Feature 2: Additional Health Tips List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-black text-slate-800 px-1">
            গুরুত্বপূর্ণ স্বাস্থ্য পরামর্শ
          </h3>

          <div className="space-y-3">
            {otherTips.map((tip) => (
              <div 
                key={tip.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-black text-nuvicaNavy-900 leading-snug">
                    {cleanText(tip.title)}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                    {cleanText(tip.categoryBn)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {tip.tipBn}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
