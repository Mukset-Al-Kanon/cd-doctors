'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  User,
  Building2,
  PhoneCall,
  ExternalLink,
  Ambulance,
  MapPin,
} from 'lucide-react';

function AestheticAssistantIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21a9 9 0 1 0-9-9c0 1.48.36 2.88 1 4.11L3 21l4.89-1c1.23.64 2.63 1 4.11 1z" strokeWidth="2" />
      <path d="M12 7.5c0 2-1.3 3.3-3.3 3.3 2 0 3.3 1.3 3.3 3.3 0-2 1.3-3.3 3.3-3.3-2 0-3.3-1.3-3.3-3.3z" fill="currentColor" strokeWidth="1" />
    </svg>
  );
}

interface HospitalCardData {
  id: string;
  name: string;
  slug: string;
  hospitalType: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  hasEmergency: boolean;
  hasIcu: boolean;
  facilities: string[];
  districtName: string;
}

interface DoctorScheduleData {
  dayOfWeek: number;
  dayNameBn: string;
  startTime: string;
  endTime: string;
}

interface DoctorCardData {
  id: string;
  name: string;
  slug: string;
  degrees: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  chamberRoom: string;
  phone: string;
  photoUrl: string;
  hospitalName: string;
  hospitalSlug: string;
  departmentNameBn: string;
  departmentNameEn: string;
  schedules: DoctorScheduleData[];
}

interface BloodDonorCardData {
  id: string;
  fullName: string;
  phone: string;
  bloodGroup: string;
  age: number;
  gender: string;
  address: string;
  area: string;
  availability: string;
}

interface EmergencyCardData {
  id: string;
  title: string;
  number: string;
  desc: string;
  badge: string;
  icon: string;
  isAvailable: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  hospitals?: HospitalCardData[];
  doctors?: DoctorCardData[];
  bloodDonors?: BloodDonorCardData[];
  emergencyServices?: EmergencyCardData[];
}

export default function AiAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  function formatTime(date: Date) {
    return date.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerWelcomeWithTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: 'আসসালামু আলাইকুম। আমি CD Doctors AI। কী তথ্য দিয়ে আপনাকে সহায়তা করতে পারি?',
          timestamp: formatTime(new Date()),
        },
      ]);
      setHasWelcomed(true);
    }, 850);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      if (!hasOpenedBefore) {
        setHasOpenedBefore(true);
      }
      if (!hasWelcomed && messages.length === 0 && !isTyping) {
        triggerWelcomeWithTyping();
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isTyping, hasWelcomed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: 'আসসালামু আলাইকুম। আমি CD Doctors AI। কী তথ্য দিয়ে আপনাকে সহায়তা করতে পারি?',
          timestamp: formatTime(new Date()),
        },
      ]);
    }, 850);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    const startTime = Date.now();
    const minTypingDuration = 800; // Guaranteed 800ms minimum typing animation duration

    try {
      const response = await fetch(
        'https://persevere-tripping-plywood.ngrok-free.dev/webhook/website',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({ message: text }),
        }
      );

      const data = await response.json();
      console.log('Bot response:', data);

      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, minTypingDuration - elapsed);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }

      // Extract bot reply from data.output or data.reply (with fallbacks for arrays or alternate key names)
      let botReply = '';
      if (typeof data === 'string') {
        botReply = data;
      } else if (data) {
        botReply =
          data.output ||
          data.reply ||
          data.message ||
          data.text ||
          data.response ||
          (Array.isArray(data) && (data[0]?.output || data[0]?.reply || data[0]?.message || data[0]?.text)) ||
          '';
      }

      if (!botReply) {
        botReply = 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।';
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: botReply,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error fetching AI response from n8n webhook:', err);
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, minTypingDuration - elapsed);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }
      const fallbackMessage: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'দুঃখিত, এই মুহূর্তে তথ্যটি আনতে একটু সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।',
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* CHAT TOGGLE BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50 font-sans">
          <button
            onClick={handleToggle}
            aria-label="CD Doctors Assistant Chat"
            className="relative group flex items-center gap-2.5 bg-white/80 hover:bg-white/95 backdrop-blur-xl border border-white/90 text-slate-900 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-[0_12px_36px_-6px_rgba(14,165,233,0.28)] hover:shadow-[0_16px_44px_-4px_rgba(14,165,233,0.38)] active:scale-95 transition-all duration-300 ring-1 ring-sky-500/15"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-sky-400 text-white flex items-center justify-center shadow-sm shrink-0">
              <AestheticAssistantIcon className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black tracking-wide text-slate-900">
                CD Doctors
              </span>
              <span className="text-[10px] text-slate-500 font-medium">স্বাস্থ্য তথ্য সহায়ক</span>
            </div>
          </button>
        </div>
      )}

      {/* MOBILE DIM OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 sm:hidden transition-opacity duration-300"
        />
      )}

      {/* CHAT WINDOW */}
      <div
        className={`fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 z-50 w-full sm:w-[420px] max-w-full h-[100dvh] sm:h-[620px] bg-white/85 backdrop-blur-2xl sm:rounded-3xl shadow-[0_24px_60px_-15px_rgba(15,23,42,0.18)] border border-white/90 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ring-1 ring-slate-900/5 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* LIQUID GLASS HEADER */}
        <div className="bg-white/80 backdrop-blur-xl text-slate-900 p-3.5 sm:p-4 flex items-center justify-between shrink-0 border-b border-slate-200/60 w-full min-w-0 box-border">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center shadow-sm text-white shrink-0">
              <AestheticAssistantIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight truncate">CD Doctors</h3>
                <span className="bg-sky-100/80 text-sky-800 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-sky-200/80 shrink-0">
                  Assistant
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">চুয়াডাঙ্গা স্বাস্থ্যসেবা তথ্য সহায়ক</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleClearChat}
              title="নতুন চ্যাট শুরু করুন"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggle}
              title="বন্ধ করুন"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MESSAGES CONTAINER */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-4 bg-slate-50/50 scroll-smooth min-w-0 w-full box-border">
          {messages.map((msg) => {
            const hasRichCards = Boolean(
              (msg.hospitals && msg.hospitals.length > 0) ||
              (msg.doctors && msg.doctors.length > 0) ||
              (msg.bloodDonors && msg.bloodDonors.length > 0) ||
              (msg.emergencyServices && msg.emergencyServices.length > 0)
            );

            return (
              <div
                key={msg.id}
                className={`flex flex-col w-full min-w-0 ${
                  msg.sender === 'user' ? 'items-end animate-msg-user' : 'items-start animate-msg-ai'
                } space-y-1.5`}
              >
                <div
                  className={`flex items-start gap-2 min-w-0 ${
                    hasRichCards
                      ? 'w-full max-w-full'
                      : msg.sender === 'user'
                      ? 'max-w-[85%] sm:max-w-[80%] flex-row-reverse'
                      : 'max-w-[92%] sm:max-w-[88%]'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-nuvicaNavy-900 text-white'
                        : 'bg-gradient-to-tr from-sky-600 to-sky-500 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <AestheticAssistantIcon className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs flex flex-col gap-2 min-w-0 w-full box-border break-words overflow-hidden ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-600 to-nuvicaNavy-900 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                    }`}
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  >
                    <p className="whitespace-pre-line break-words min-w-0">{msg.text}</p>

                    {/* Hospital Cards Result Stream */}
                    {msg.hospitals && msg.hospitals.length > 0 && (
                      <div className="space-y-2.5 w-full min-w-0 pt-1">
                        {msg.hospitals.map((hosp, idx) => (
                          <div
                            key={hosp.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="bg-white border border-sky-100 hover:border-sky-300 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-200 flex flex-col gap-2.5 min-w-0 w-full box-border overflow-hidden animate-card-pop"
                          >
                            <div className="flex items-start justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="p-2 bg-sky-50 text-sky-700 rounded-xl shrink-0">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words">
                                    {hosp.name}
                                  </h4>
                                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-md border border-sky-200 inline-block mt-0.5 truncate max-w-full">
                                    {hosp.hospitalType}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium break-words min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                              <span className="break-words min-w-0">{hosp.address}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {hosp.hasEmergency && (
                                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                  24/7 Emergency
                                </span>
                              )}
                              {hosp.hasIcu && (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  ICU Facility
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 min-w-0">
                              <Link
                                href={`/hospitals/${hosp.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-slate-900 hover:bg-sky-700 text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl transition-colors shadow-2xs truncate"
                              >
                                <span className="truncate">View Details</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </Link>
                              {hosp.phone && (
                                <a
                                  href={`tel:${hosp.phone}`}
                                  className="flex-1 sm:flex-none min-w-0 flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl transition-colors shadow-2xs truncate"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">Call</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Doctor Cards Result Stream */}
                    {msg.doctors && msg.doctors.length > 0 && (
                      <div className="space-y-3 w-full min-w-0 pt-1">
                        {msg.doctors.map((doctor, idx) => (
                          <div
                            key={doctor.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-200 flex flex-col gap-2.5 min-w-0 w-full box-border overflow-hidden animate-card-pop"
                          >
                            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                              <img
                                src={doctor.photoUrl}
                                alt={doctor.name}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover object-top border border-white shadow-sm shrink-0"
                              />
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <span className="bg-sky-50 text-sky-700 font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border border-sky-100/90 inline-block mb-0.5 truncate max-w-full">
                                  {doctor.departmentNameBn || doctor.specialization}
                                </span>
                                <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug break-words">
                                  {doctor.name}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-slate-500 font-medium break-words">
                                  {doctor.degrees}
                                </p>
                                <p className="text-[11px] sm:text-xs font-bold text-sky-700 break-words">
                                  {doctor.specialization}
                                </p>
                              </div>
                            </div>

                            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2 sm:p-2.5 space-y-1.5 text-xs min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] sm:text-xs truncate min-w-0">
                                <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                <span className="truncate">{doctor.hospitalName}</span>
                              </div>

                              {doctor.schedules && doctor.schedules.length > 0 && (
                                <div className="pt-0.5">
                                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 block mb-1">
                                    📅 চেম্বারের দিনসমূহ:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {[
                                      { num: 6, label: 'শনি' },
                                      { num: 0, label: 'রবি' },
                                      { num: 1, label: 'সোম' },
                                      { num: 2, label: 'মঙ্গ' },
                                      { num: 3, label: 'বুধ' },
                                      { num: 4, label: 'বৃহ' },
                                      { num: 5, label: 'শুক্র' },
                                    ].map((d) => {
                                      const isAvailable = doctor.schedules.some((s) => s.dayOfWeek === d.num);
                                      return (
                                        <span
                                          key={d.num}
                                          className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md ${
                                            isAvailable
                                              ? 'bg-sky-500 text-white shadow-2xs'
                                              : 'bg-slate-200 text-slate-400 line-through opacity-60'
                                          }`}
                                        >
                                          {d.label}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] sm:text-[11px] pt-1 text-slate-600 font-bold border-t border-slate-200/60 mt-1 min-w-0">
                                <span>ভিজিট ফি: ৳{doctor.consultationFee} টাকা</span>
                                <span className="text-slate-500 font-normal">অভিজ্ঞতা: {doctor.experienceYears} বছর</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 min-w-0">
                              <Link
                                href="/doctors"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-slate-900 hover:bg-sky-700 text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl transition-colors shadow-2xs truncate"
                              >
                                <span className="truncate">View Profile</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </Link>
                              {doctor.phone && (
                                <a
                                  href={`tel:${doctor.phone}`}
                                  className="flex-1 sm:flex-none min-w-0 flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] sm:text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl transition-colors shadow-2xs truncate"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">Call</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Blood Donor Cards Result Stream (PRIVACY PROTECTED) */}
                    {msg.bloodDonors && msg.bloodDonors.length > 0 && (
                      <div className="space-y-2.5 w-full min-w-0 pt-1">
                        {msg.bloodDonors.map((donor, idx) => (
                          <div
                            key={donor.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="bg-white border border-rose-100 hover:border-rose-300 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-200 flex flex-col gap-2 min-w-0 w-full box-border overflow-hidden animate-card-pop"
                          >
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs shrink-0">
                                  {donor.bloodGroup}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                                    {donor.fullName}
                                  </h4>
                                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-bold flex items-center gap-1 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                    Available Donor
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 p-2 rounded-xl border border-slate-100 break-words min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span className="break-words min-w-0">{donor.address || donor.area}</span>
                            </div>

                            <a
                              href={`tel:${donor.phone}`}
                              className="w-full flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-2xs truncate"
                            >
                              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Call Donor ({donor.phone})</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Emergency Services Result Stream */}
                    {msg.emergencyServices && msg.emergencyServices.length > 0 && (
                      <div className="space-y-2.5 w-full min-w-0 pt-1">
                        {msg.emergencyServices.map((em, idx) => (
                          <div
                            key={em.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="bg-gradient-to-br from-white to-amber-50/40 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all duration-200 flex flex-col gap-2 min-w-0 w-full box-border overflow-hidden animate-card-pop"
                          >
                            <div className="flex items-start justify-between gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
                                  <Ambulance className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words">
                                    {em.title}
                                  </h4>
                                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-0.5 truncate max-w-full">
                                    {em.badge}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed break-words min-w-0">{em.desc}</p>

                            <a
                              href={`tel:${em.number}`}
                              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] sm:text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-2xs truncate"
                            >
                              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Call Emergency ({em.number})</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-9 font-medium">{msg.timestamp}</span>
              </div>
            );
          })}

          {/* Typing Indicator — Minimalist 3 Dots */}
          {isTyping && (
            <div className="flex items-center gap-2 animate-in fade-in min-w-0">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AestheticAssistantIcon className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* LIQUID GLASS INPUT FOOTER */}
        <div className="p-2.5 sm:p-3 bg-white/75 backdrop-blur-xl border-t border-slate-200/60 shrink-0 w-full min-w-0 box-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="স্বাস্থ্য বিষয়ক প্রশ্ন বা তথ্য লিখুন..."
              aria-label="Write healthcare query or question"
              className="flex-1 min-w-0 bg-white/90 border border-slate-200/80 focus:border-sky-500 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-2xl px-3 sm:px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all font-medium placeholder:text-slate-400 shadow-2xs"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl shadow-md hover:shadow-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-medium px-1 mt-1.5">
            <span className="truncate">CD Doctors Healthcare Assistant</span>
            <span className="text-slate-400 shrink-0">চুয়াডাঙ্গা স্বাস্থ্যসেবা</span>
          </div>
        </div>
      </div>
    </>
  );
}
