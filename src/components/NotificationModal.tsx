'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Droplet, 
  Pill, 
  Stethoscope, 
  Building2, 
  Clock, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'health' | 'blood' | 'doctor' | 'hospital' | 'system';
  time: string;
  link?: string;
  isRead: boolean;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'জরুরি রক্তের আবেদন',
    message: 'চুয়াডাঙ্গা সদর হাসপাতালে রোগীর জন্য জরুরি ভিত্তিতে O+ গ্রুপের রক্তের প্রয়োজন।',
    type: 'blood',
    time: '১০ মিনিট আগে',
    link: '/blood',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'দৈনিক স্বাস্থ্য রিমাইন্ডার',
    message: 'প্রতিদিন পর্যাপ্ত পানি পান করুন এবং আপনার নির্ধারিত মেডিসিন রুটিন মেনে চলুন।',
    type: 'health',
    time: '১ ঘণ্টা আগে',
    link: '/patient/med-schedule',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'নতুন বিশেষজ্ঞ ডাক্তার শিডিউল',
    message: 'আপনার জেলায় হৃদরোগ ও মেডিসিন বিশেষজ্ঞ ডাক্তারের নতুন চেম্বার শিডিউল আপডেট করা হয়েছে।',
    type: 'doctor',
    time: '৩ ঘণ্টা আগে',
    link: '/doctors',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'হাসপাতাল ও ডায়াগনস্টিক সেবা',
    message: '২৪ ঘণ্টা জরুরি সেবা ও আইসিইউ সুবিধাযুক্ত হাসপাতাল তালিকা সরাসরি দেখুন।',
    type: 'hospital',
    time: '১ দিন আগে',
    link: '/hospitals',
    isRead: true,
  },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDistrict?: string | null;
}

export default function NotificationModal({
  isOpen,
  onClose,
  userDistrict,
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cd_app_notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch {
          setNotifications(DEFAULT_NOTIFICATIONS);
        }
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    }
  }, [isOpen]);

  const saveNotifications = (newList: AppNotification[]) => {
    setNotifications(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cd_app_notifications', JSON.stringify(newList));
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const markSingleAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'blood':
        return <Droplet className="w-4 h-4 text-rose-600" />;
      case 'health':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-sky-600" />;
      case 'hospital':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-sky-600" />;
    }
  };

  const getBadgeBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'blood':
        return 'bg-rose-50 border-rose-200/80';
      case 'health':
        return 'bg-emerald-50 border-emerald-200/80';
      case 'doctor':
        return 'bg-sky-50 border-sky-200/80';
      case 'hospital':
        return 'bg-indigo-50 border-indigo-200/80';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center font-bengali">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-250 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal / Bottom Sheet Box */}
      <div
        className={`relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden border border-slate-100 transition-all duration-250 ${
          isClosing
            ? 'translate-y-full sm:translate-y-6 sm:scale-95 opacity-0'
            : 'translate-y-0 sm:scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 via-white to-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 leading-none">
                  নোটিফিকেশন
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white">
                    {unreadCount} নতুন
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-slate-500 font-medium pt-0.5">
                স্বাস্থ্য আপডেট ও গুরুত্বপূর্ণ সতর্কতা
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar (Mark All / Clear) */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs font-bold shrink-0">
            {unreadCount > 0 ? (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>সবগুলো পড়া হয়েছে</span>
              </button>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1 text-[11.5px]">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>সব নোটিফিকেশন পড়া হয়েছে</span>
              </span>
            )}

            <button
              onClick={clearAllNotifications}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer text-[11.5px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>মুছে ফেলুন</span>
            </button>
          </div>
        )}

        {/* Notifications Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-slate-100/60 divide-y-reverse">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-sky-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                কোনো নতুন নোটিফিকেশন নেই
              </h4>
              <p className="text-xs text-slate-400 max-w-[220px] pt-1">
                জরুরি স্বাস্থ্য বা রক্তদানের আপডেট আসলে এখানে দেখতে পাবেন।
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markSingleAsRead(notif.id);
                  if (notif.link) {
                    handleClose();
                  }
                }}
                className={`relative group p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-slate-100 hover:bg-slate-50/70'
                    : 'bg-sky-50/40 border-sky-100/80 shadow-2xs hover:bg-sky-50/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Category Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${getBadgeBg(
                      notif.type
                    )}`}
                  >
                    {getIcon(notif.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`text-xs sm:text-[13px] font-bold leading-snug truncate ${
                          notif.isRead ? 'text-slate-800' : 'text-sky-950 font-black'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-[11.5px] sm:text-xs text-slate-600 pt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </div>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={(e) => {
                            e.stopPropagation();
                            markSingleAsRead(notif.id);
                            handleClose();
                          }}
                          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline"
                        >
                          <span>দেখুন</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all cursor-pointer absolute top-2.5 right-2.5"
                    title="মুছুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
