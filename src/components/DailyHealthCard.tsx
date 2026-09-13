'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Check, Bell, ChevronRight, Heart, Apple, Moon, Activity, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface DailyHealthTip {
  id: string;
  category: string;
  categoryBn: string;
  title: string;
  tipBn: string;
  icon: string;
  actionText: string;
}

export default function DailyHealthCard() {
  const [tip, setTip] = useState<DailyHealthTip | null>(null);
  const [hasCompletedDailyAction, setHasCompletedDailyAction] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/health-tips')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.todayTip) {
          setTip(data.todayTip);
        }
      })
      .catch(() => null);

    // Read stored daily habit action state
    if (typeof window !== 'undefined') {
      const savedAction = localStorage.getItem('cddoctors_daily_action_done');
      if (savedAction === new Date().toISOString().split('T')[0]) {
        setHasCompletedDailyAction(true);
      }
    }
  }, []);

  const handleCompleteAction = () => {
    setHasCompletedDailyAction(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cddoctors_daily_action_done', new Date().toISOString().split('T')[0]);
    }
  };

  const toggleNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationEnabled(true);
        new Notification('CD Doctors স্বাস্থ্য রিমাইন্ডার', {
          body: 'প্রতিদিনের স্বাস্থ্য টিপস ও মেডিসিন রিমাইন্ডার নোটিফিকেশন সফলভাবে চালু হয়েছে!',
          icon: '/favicon.ico',
        });
      } else {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationEnabled(true);
        }
      }
    }
  };

  const renderIcon = (category?: string) => {
    switch (category) {
      case 'EYE_CARE':
        return <Eye className="w-5 h-5 text-sky-400" />;
      case 'NUTRITION':
        return <Apple className="w-5 h-5 text-emerald-400" />;
      case 'MENTAL_HEALTH':
        return <Moon className="w-5 h-5 text-indigo-300" />;
      case 'SEASONAL':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'DIABETES':
        return <Activity className="w-5 h-5 text-teal-300" />;
      default:
        return <Heart className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-900 via-sky-950 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-sky-800/40 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 border border-white/15 text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              আজকের হেলথ টিপস
            </span>
            <span className="text-[11px] text-sky-200/70 font-medium">
              {tip?.categoryBn || '💡 সুস্থতার বার্তা'}
            </span>
          </div>

          <button
            onClick={toggleNotifications}
            className="text-[11px] font-extrabold text-sky-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            title="দৈনিক পুশ নোটিফিকেশন অন করুন"
          >
            <Bell className="w-3 h-3 text-amber-400" />
            <span>{notificationEnabled ? '🔔 নোটিফিকেশন চালু' : 'অ্যালার্ট চালু করুন'}</span>
          </button>
        </div>

        {/* Tip Content */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 backdrop-blur-md">
            {renderIcon(tip?.category)}
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              {tip?.title || '২০-২০-২০ নিয়ম মেনে চলুন'}
            </h3>
            <p className="text-xs sm:text-[13px] text-sky-100/90 font-normal leading-relaxed">
              {tip?.tipBn || 'মোবাইল বা কম্পিউটারে কাজের সময় প্রতি ২০ মিনিট পর পর ২০ ফুট দূরের কোনো বস্তুর দিকে অন্তত ২০ সেকেন্ড তাকিয়ে থাকুন। এটি চোখের ড্রাইনেস ও স্ক্রিন স্ট্রেন রোধ করে।'}
            </p>
          </div>
        </div>

        {/* Daily Habit Commitment Row */}
        <div className="pt-2 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 sm:p-3.5 border border-white/10 flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] text-sky-200/70 font-semibold">আজকের স্বাস্থ্য অভ্যাস</p>
                <p className="text-xs sm:text-[13px] font-black text-white">{tip?.actionText || 'টিপসটি মেনে চলব'}</p>
              </div>
            </div>

            <button
              onClick={handleCompleteAction}
              disabled={hasCompletedDailyAction}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs shrink-0 ${
                hasCompletedDailyAction
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-md'
              }`}
            >
              {hasCompletedDailyAction ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>পালন করেছি ✓</span>
                </>
              ) : (
                <span>আজ পালন করব</span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="flex items-center justify-between text-xs pt-1 text-sky-200/80">
          <Link 
            href="/patient/med-schedule"
            className="hover:text-white font-bold flex items-center gap-1 transition-colors group"
          >
            <span>⏰ আজকের মেডিসিন শিডিউল দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link 
            href="/patient/scanner"
            className="hover:text-white font-bold text-sky-300 flex items-center gap-1 transition-colors group"
          >
            <span>📸 প্রেসক্রিপশন স্ক্যান করুন</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
