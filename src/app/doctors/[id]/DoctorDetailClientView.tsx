'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock, 
  PhoneCall, 
  Video, 
  ShieldCheck, 
  Stethoscope, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Share2, 
  Check, 
  Heart,
  CalendarCheck,
  Star,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Sparkles,
  Phone,
  ThumbsUp,
  Briefcase,
  CheckCircle,
  ExternalLink,
  MapPinned,
  CreditCard,
  Wallet,
  FileText,
  Users,
  UserPlus,
  Lightbulb,
  Play,
  ZoomIn,
  Loader2,
  X,
  Plus,
  Globe2,
  MoreHorizontal,
  MessageSquare,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX
} from 'lucide-react';
import ImageLightboxModal from '@/components/ImageLightboxModal';
import OfficialVerifiedBadge from '@/components/OfficialVerifiedBadge';
import LoginPromptModal from '@/components/LoginPromptModal';
import DoctorPostCommentsModal from '@/components/DoctorPostCommentsModal';
import { SocialShareModal } from '@/components/SocialShareModal';

interface DoctorPostItem {
  id: string;
  doctorId: string;
  content: string;
  mediaType: 'NONE' | 'IMAGE' | 'YOUTUBE' | 'FACEBOOK' | string;
  mediaUrl?: string | null;
  videoTitle?: string | null;
  helpfulCount: number;
  sharesCount: number;
  commentsCount?: number;
  isPublished: boolean;
  createdAt: string;
}

interface DoctorDetailClientProps {
  doctor: any;
}

function formatRelativeBanglaTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'এইমাত্র';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${toBanglaDigits(diffInMinutes)} মিনিট আগে`;
    const diffInHours = Math.floor(diffInSeconds / 60);
    if (diffInHours < 24) return `${toBanglaDigits(diffInHours)} ঘণ্টা আগে`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'গতকাল';
    if (diffInDays < 30) return `${toBanglaDigits(diffInDays)} দিন আগে`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${toBanglaDigits(diffInMonths)} মাস আগে`;
    return `${toBanglaDigits(Math.floor(diffInDays / 365))} বছর আগে`;
  } catch {
    return 'সম্প্রতি';
  }
}

function formatRelativeEnglishTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInSeconds / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 52) return `${diffInWeeks}w`;
    return `${Math.floor(diffInDays / 365)}y`;
  } catch {
    return '1d';
  }
}

function formatInstagramCount(count: number): string {
  if (!count && count !== 0) return '0';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 10000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toLocaleString();
}

const BANGLA_DAYS_MAP = [
  { day: 6, short: 'শনি', full: 'শনিবার' },
  { day: 0, short: 'রবি', full: 'রবিবার' },
  { day: 1, short: 'সোম', full: 'সোমবার' },
  { day: 2, short: 'মঙ্গ', full: 'মঙ্গলবার' },
  { day: 3, short: 'বুধ', full: 'বুধবার' },
  { day: 4, short: 'বৃহ', full: 'বৃহস্পতিবার' },
  { day: 5, short: 'শুক্র', full: 'শুক্রবার' },
];

const SPECIALIZATION_BANGLA_MAP: Record<string, string> = {
  'Cardiology': 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
  'Cardiologist': 'হৃদরোগ বিশেষজ্ঞ',
  'Senior Consultant Cardiologist': 'সিনিয়র কনসালটেন্ট হৃদরোগ বিশেষজ্ঞ',
  'Medicine Specialist': 'মেডিসিন বিশেষজ্ঞ',
  'General Physician': 'জেনারেল ফিজিশিয়ান',
  'Gynecology & Obstetrics': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Gynecologist': 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
  'Consultant Gynecologist & Laparoscopic Surgeon': 'কনসালটেন্ট গাইনোকোলজিস্ট ও ল্যাপারোস্কোপিক সার্জন',
  'Pediatrics': 'শিশু রোগ বিশেষজ্ঞ',
  'Pediatrician': 'শিশু রোগ বিশেষজ্ঞ',
  'Orthopedics': 'হাড় ও জোড় বিশেষজ্ঞ',
  'Orthopedic Surgeon': 'অর্থোপেডিক সার্জন',
  'Trauma & Joint Replacement Surgeon': 'ট্রমা ও জয়েন্ট রিপ্লেসমেন্ট সার্জন',
  'Dermatology': 'চর্ম ও যৌনরোগ বিশেষজ্ঞ',
  'Dermatologist': 'চর্ম ও যৌনরোগ বিশেষজ্ঞ',
  'Neurology': 'নিউরোমেডিসিন বিশেষজ্ঞ',
  'Neurologist': 'নিউরোলজিস্ট',
  'ENT Specialist': 'নাক, কান ও গলা বিশেষজ্ঞ',
  'Ophthalmology': 'চক্ষু বিশেষজ্ঞ',
  'Eye Specialist': 'চক্ষু রোগ বিশেষজ্ঞ',
  'Dental Specialist': 'দন্ত রোগ বিশেষজ্ঞ',
  'Psychiatry': 'মানসিক রোগ বিশেষজ্ঞ',
  'Urology': 'ইউরোলজি বিশেষজ্ঞ',
  'Gastroenterology': 'গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ',
  'Nephrology': 'কিডনি রোগ বিশেষজ্ঞ',
};

const DOCTOR_NAME_BANGLA_MAP: Record<string, string> = {
  'Dr. Mahbubur Rahman Chowdhury': 'ডা. মাহবুবুর রহমান চৌধুরী',
  'Dr. Selina Parveen': 'ডা. সেলিনা পারভীন',
  'Dr. Kazi Ariful Haque': 'ডা. কাজী আরিফুল হক',
  'Dr. Nuzhat Fatema': 'ডা. নুজহাত ফাতেমা',
  'Dr. Towhidul Islam': 'ডা. তৌহিদুল ইসলাম',
  'Dr. Sharmeen Sultana': 'ডা. শারমীন সুলতানা',
  'Dr. Md. Rafiqul Islam': 'ডা. মোঃ রফিকুল ইসলাম',
  'Dr. Farida Yasmin': 'ডা. ফরিদা ইয়াসমিন',
  'Dr. A.H.M. Kamal Hossain': 'ডা. এ.এইচ.এম কামাল হোসেন',
  'Dr. Nazmul Huda': 'ডা. নাজমুল হুদা',
  'Dr. Syeda Rawnak Jahan': 'ডা. সৈয়দা রওনক জাহান',
  'Dr. Md. Moniruzzaman': 'ডা. মোঃ মনিরুজ্জামান',
  'Dr. Sheikh Asaduzzaman': 'ডা. শেখ আসাদুজ্জামান',
  'Dr. Afroza Begum': 'ডা. আফরোজা বেগম',
  'Dr. Md. Zakir Hossain': 'ডা. মোঃ জাকির হোসেন',
  'Dr. Rehana Chowdhury': 'ডা. রেহানা চৌধুরী',
  'Dr. Md. Enamul Kabir': 'ডা. মোঃ এনামুল কবির',
  'Dr. Shahriar Ahmed': 'ডা. শাহরিয়ার আহমেদ',
  'Dr. Md. Motiur Rahman': 'ডা. মোঃ মতিউর রহমান',
  'Dr. Tahmina Akter': 'ডা. তাহমিনা আক্তার',
  'Dr. Md. Saiful Islam': 'ডা. মোঃ সাইফুল ইসলাম',
  'Dr. Golam Sarwar': 'ডা. গোলাম সারোয়ার',
  'Dr. Rumana Parvin': 'ডা. রুমানা পারভীন',
  'Dr. Md. Imran Hossain': 'ডা. মোঃ ইমরান হোসেন',
  'Dr. A.K.M. Fazlul Haque': 'ডা. এ.কে.এম ফজলুল হক',
  'Dr. Sayeeda Sultana': 'ডা. সাইয়িদা সুলতানা',
  'Dr. Md. Tariq Hasan': 'ডা. মোঃ তারিক হাসান',
  'Dr. Nazma Akter': 'ডা. নাজমা আক্তার',
  'Dr. Md. Babul Akhter': 'ডা. মোঃ বাবুল আক্তার',
  'Dr. Shamim Ara Begum': 'ডা. শামীম আরা বেগম',
  'Dr. Tanvir Ahmed': 'ডা. তানভীর আহমেদ',
  'Dr. Md. Tariqul Islam': 'ডা. মোঃ তারিকুল ইসলাম',
  'Dr. Shamima Nasrin': 'ডা. শামীমা নাসরিন',
  'Dr. Md. Asaduzzaman': 'ডা. মোঃ আসাদুজ্জামান',
};

const BANGLA_WORD_MAP: Record<string, string> = {
  'dr.': 'ডা.',
  'dr': 'ডা.',
  'prof.': 'অধ্যাপক',
  'prof': 'অধ্যাপক',
  'md.': 'মোঃ',
  'md': 'মোঃ',
  'mst.': 'মোছাঃ',
  'mst': 'মোছাঃ',
  'mohammad': 'মোহাম্মদ',
  'muhammad': 'মুহাম্মদ',
  'sheikh': 'শেখ',
  'syed': 'সৈয়দ',
  'syeda': 'সৈয়দা',
  'kazi': 'কাজী',
  'mahbubur': 'মাহবুবুর',
  'rahman': 'রহমান',
  'chowdhury': 'চৌধুরী',
  'selina': 'সেলিনা',
  'parveen': 'পারভীন',
  'parvin': 'পারভীন',
  'ariful': 'আরিফুল',
  'haque': 'হক',
  'nuzhat': 'নুজহাত',
  'fatema': 'ফাতেমা',
  'fahmida': 'ফাহমিদা',
  'towhidul': 'তৌহিদুল',
  'islam': 'ইসলাম',
  'sharmeen': 'শারমীন',
  'sharmin': 'শারমীন',
  'sultana': 'সুলতানা',
  'rafiqul': 'রফিকুল',
  'farida': 'ফরিদা',
  'yasmin': 'ইয়াসমিন',
  'kamal': 'কামাল',
  'hossain': 'হোসেন',
  'huda': 'হুদা',
  'moniruzzaman': 'মনিরুজ্জামান',
  'asaduzzaman': 'আসাদুজ্জামান',
  'afroza': 'আফরোজা',
  'begum': 'বেগম',
  'zakir': 'জাকির',
  'rehana': 'রেহানা',
  'enamul': 'এনামুল',
  'kabir': 'কবির',
  'shahriar': 'শাহরিয়ার',
  'ahmed': 'আহমেদ',
  'motiur': 'মতিউর',
  'tahmina': 'তাহমিনা',
  'akter': 'আক্তার',
  'saiful': 'সাইফুল',
  'golam': 'গোলাম',
  'sarwar': 'সারোয়ার',
  'rumana': 'রুমানা',
  'imran': 'ইমরান',
  'fazlul': 'ফজলুল',
  'sayeeda': 'সাইয়িদা',
  'tariq': 'তারিক',
  'tariqul': 'তারিকুল',
  'nazma': 'নাজমা',
  'babul': 'বাবুল',
  'akhter': 'আক্তার',
  'shamim': 'শামীম',
  'ara': 'আরা',
  'tanvir': 'তানভীর',
  'shamima': 'শামীমা',
  'nasrin': 'নাসরিন',
  'alam': 'আলম',
  'arifur': 'আরিফুর',
  'nasim': 'নাসিম',
  'ali': 'আলী',
  'mostafa': 'মোস্তফা',
  'sirajul': 'সিরাজুল',
  'aminul': 'আমিনুল',
  'shakil': 'শাকিল',
  'jahangir': 'জাহাঙ্গীর',
  'mostafizur': 'মোস্তাফিজুর',
};

function formatDoctorNameBangla(name: string): string {
  if (!name) return '';
  if (DOCTOR_NAME_BANGLA_MAP[name]) return DOCTOR_NAME_BANGLA_MAP[name];

  const words = name.split(/\s+/);
  const convertedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[,.:]/g, '');
    const cleanWithDot = w.toLowerCase();
    if (BANGLA_WORD_MAP[cleanWithDot]) return BANGLA_WORD_MAP[cleanWithDot];
    if (BANGLA_WORD_MAP[cleanWord]) return BANGLA_WORD_MAP[cleanWord];
    return w;
  });

  let result = convertedWords.join(' ');
  if (!result.startsWith('ডা.') && !result.startsWith('অধ্যাপক')) {
    result = `ডা. ${result}`;
  }
  return result;
}

function toBanglaDigits(str: string | number): string {
  if (!str && str !== 0) return '';
  return str.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
}

function formatBanglaTime(timeStr: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);

  const match = clean.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return toBanglaDigits(clean);

  let hour = parseInt(match[1], 10);
  const min = match[2] ? match[2] : '00';

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  let period = 'সকাল';
  if (hour >= 12 && hour < 15) period = 'দুপুর';
  else if (hour >= 15 && hour < 18) period = 'বিকাল';
  else if (hour >= 18 && hour < 20) period = 'সন্ধ্যা';
  else if (hour >= 20 || hour < 5) period = 'রাত';

  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;

  const minFormatted = min === '00' ? '' : `:${toBanglaDigits(min)}`;
  return `${period} ${toBanglaDigits(displayHour)}${minFormatted} টা`;
}

function getDoctorScheduleInfo(schedules?: any[]): { daysText: string; timeText: string } {
  if (!schedules || schedules.length === 0) {
    return {
      daysText: 'শনিবার হতে বৃহস্পতিবার',
      timeText: 'বিকাল ৫:০০ টা হতে রাত ৮:০০ টা',
    };
  }

  const BANGLA_WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];
  const DAY_FULL_BN: Record<number, string> = {
    6: 'শনিবার',
    0: 'রবিবার',
    1: 'সোমবার',
    2: 'মঙ্গলবার',
    3: 'বুধবার',
    4: 'বৃহস্পতিবার',
    5: 'শুক্রবার',
  };

  const activeDays = schedules
    .map((s) => s.dayOfWeek)
    .filter((d) => d !== undefined && d !== null);

  const sortedDays = BANGLA_WEEK_ORDER.filter((d) => activeDays.includes(d));

  let daysText = '';
  if (sortedDays.length === 7) {
    daysText = 'সপ্তাহের প্রতিদিন';
  } else if (sortedDays.length === 6 && !sortedDays.includes(5)) {
    daysText = 'শনিবার হতে বৃহস্পতিবার';
  } else if (sortedDays.length >= 3) {
    const startIdx = BANGLA_WEEK_ORDER.indexOf(sortedDays[0]);
    const endIdx = BANGLA_WEEK_ORDER.indexOf(sortedDays[sortedDays.length - 1]);
    const isContiguous = endIdx - startIdx + 1 === sortedDays.length;
    if (isContiguous) {
      daysText = `${DAY_FULL_BN[sortedDays[0]]} হতে ${DAY_FULL_BN[sortedDays[sortedDays.length - 1]]}`;
    } else {
      daysText = sortedDays.map((d) => DAY_FULL_BN[d]).join(', ');
    }
  } else if (sortedDays.length === 2) {
    daysText = `${DAY_FULL_BN[sortedDays[0]]} ও ${DAY_FULL_BN[sortedDays[1]]}`;
  } else if (sortedDays.length === 1) {
    daysText = `শুধুমাত্র ${DAY_FULL_BN[sortedDays[0]]}`;
  } else {
    daysText = 'শনিবার হতে বৃহস্পতিবার';
  }

  const firstSched = schedules[0];
  let timeText = '';
  if (firstSched?.startTime && firstSched?.endTime) {
    timeText = `${formatBanglaTime(firstSched.startTime)} হতে ${formatBanglaTime(firstSched.endTime)}`;
  } else {
    timeText = 'বিকাল ৫:০০ টা হতে রাত ৮:০০ টা';
  }

  return { daysText, timeText };
}

export default function DoctorDetailClientView({ doctor }: DoctorDetailClientProps) {
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedChamberIndex, setSelectedChamberIndex] = useState(0);

  // Doctor Navigation & Community States
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'TELEMEDICINE' | 'POSTS'>('DETAILS');
  const [posts, setPosts] = useState<DoctorPostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(doctor.followersCount || 3179);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [postReactions, setPostReactions] = useState<Record<string, boolean>>({});
  const [postHelpfulCounts, setPostHelpfulCounts] = useState<Record<string, number>>({});
  const [postSharesCounts, setPostSharesCounts] = useState<Record<string, number>>({});
  const [lightboxPostImage, setLightboxPostImage] = useState<string | null>(null);
  const [postCopiedId, setPostCopiedId] = useState<string | null>(null);
  const [playingPostId, setPlayingPostId] = useState<string | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [activeCommentsPost, setActiveCommentsPost] = useState<DoctorPostItem | null>(null);

  const doctorUsername = useMemo(() => {
    if (doctor?.name) {
      let nameStr = doctor.name.toLowerCase().trim();
      nameStr = nameStr
        .replace(/^(prof\.|prof\s+|professor\s+)/i, '')
        .replace(/^(dr\.|dr\s+|doctor\s+)/i, '')
        .replace(/\b(md\.|md)\b/gi, '')
        .replace(/\b(mst\.|mst)\b/gi, '')
        .trim();

      const slug = nameStr
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      return slug ? `dr.${slug}` : 'dr.doctor';
    }
    return 'dr.consultant';
  }, [doctor?.name]);

  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const next = !prev[postId];
      showToast(next ? 'Saved to bookmarks' : 'Removed from bookmarks');
      return { ...prev, [postId]: next };
    });
  };

  const handleCopyLink = async (postId: string) => {
    if (typeof window === 'undefined') return;
    const postUrl = `${window.location.origin}/doctors/${doctor.slug || doctor.id}#post-${postId}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = postUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setPostCopiedId(postId);
      showToast('Link copied to clipboard');
    } catch {
      showToast('Failed to copy link');
    }
  };

  const handleShareTo = async (postId: string) => {
    if (typeof window === 'undefined') return;
    const postUrl = `${window.location.origin}/doctors/${doctor.slug || doctor.id}#post-${postId}`;
    const title = `${doctor.name || doctorNameBn} - Post`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: postUrl });
      } catch {
        // User dismissed native share sheet
      }
    } else {
      handleCopyLink(postId);
    }
  };

  const handleReportPost = (postId: string) => {
    setOpenMenuPostId(null);
    showToast('Report submitted. Thank you for reporting.');
  };

  // Check login authentication state and local follow status
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
        } else {
          fetch('/api/doctor/auth/me')
            .then((r) => r.json())
            .then((docData) => {
              if (docData?.success && docData?.doctor) {
                setIsLoggedIn(true);
              } else {
                setIsLoggedIn(false);
              }
            })
            .catch(() => setIsLoggedIn(false));
        }
      })
      .catch(() => setIsLoggedIn(false));

    try {
      const savedFollow = localStorage.getItem(`cddoctor_followed_${doctor.id}`);
      if (savedFollow === 'true') {
        setIsFollowing(true);
      }
    } catch (e) {
      // Ignore
    }
  }, [doctor.id]);

  // Fetch published posts and follower count
  useEffect(() => {
    let isMounted = true;
    async function loadDoctorPosts() {
      try {
        setLoadingPosts(true);
        const res = await fetch(`/api/doctor/posts?doctorId=${doctor.id || doctor.slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && isMounted) {
          if (data.followersCount !== undefined) {
            setFollowersCount(data.followersCount);
          }
          if (Array.isArray(data.posts)) {
            setPosts(data.posts);
            const helpfulMap: Record<string, number> = {};
            const sharesMap: Record<string, number> = {};
            data.posts.forEach((p: DoctorPostItem) => {
              helpfulMap[p.id] = p.helpfulCount || 0;
              sharesMap[p.id] = p.sharesCount || 0;
            });
            setPostHelpfulCounts(helpfulMap);
            setPostSharesCounts(sharesMap);
          }
        }
      } catch (err) {
        console.error('Error fetching doctor posts:', err);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    }

    loadDoctorPosts();
    return () => {
      isMounted = false;
    };
  }, [doctor.id, doctor.slug]);

  // Toggle Doctor Follow status (requires user to be logged in)
  const handleToggleFollow = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    setFollowersCount((prev) => (nextFollowing ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (nextFollowing) {
        localStorage.setItem(`cddoctor_followed_${doctor.id}`, 'true');
      } else {
        localStorage.removeItem(`cddoctor_followed_${doctor.id}`);
      }
    } catch (e) {
      // Ignore
    }

    try {
      await fetch('/api/doctor/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: nextFollowing ? 'FOLLOW' : 'UNFOLLOW',
          doctorId: doctor.id,
        }),
      });
    } catch (err) {
      console.error('Error updating follow status:', err);
    }
  };

  // Toggle Helpful reaction on a post
  const handleHelpfulReaction = async (postId: string) => {
    const currentlyReacted = Boolean(postReactions[postId]);
    const nextReacted = !currentlyReacted;

    setPostReactions((prev) => ({ ...prev, [postId]: nextReacted }));
    setPostHelpfulCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (nextReacted ? 1 : -1),
    }));

    try {
      await fetch('/api/doctor/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: nextReacted ? 'HELPFUL' : 'UNHELPFUL',
          postId,
        }),
      });
    } catch (err) {
      console.error('Error reacting to post:', err);
    }
  };

  // Share post URL and open Instagram-style share drawer
  const handleSharePost = async (post: any) => {
    setActiveSharePost(post);
    const postId = typeof post === 'string' ? post : post.id;
    const postUrl = `${window.location.origin}/doctors/${doctor.slug || doctor.id}#post-${postId}`;

    setPostSharesCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));

    try {
      await fetch('/api/doctor/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SHARE', postId }),
      });
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const specializationBn =
    doctor.department?.nameBn ||
    SPECIALIZATION_BANGLA_MAP[doctor.specialization] ||
    doctor.specialization;

  const doctorNameBn = formatDoctorNameBangla(doctor.name);

  const isVerified = (doctor as any).isVerified !== undefined
    ? Boolean((doctor as any).isVerified)
    : Boolean((doctor.subscriptionExpiresAt && new Date(doctor.subscriptionExpiresAt) > new Date()) || doctor.bmdcNumber || true);

  // Group schedules by chamber / hospital
  const chambers = useMemo(() => {
    if (!doctor.schedules || doctor.schedules.length === 0) {
      return [{
        name: doctor.hospital?.name || 'প্রধান চেম্বার',
        address: doctor.chamberRoom || doctor.hospital?.address || 'চুয়াডাঙ্গা',
        phone: doctor.phone || doctor.hospital?.phone || '+88076162588',
        isTelemedicine: false,
        fee: doctor.consultationFee || 800,
        schedules: []
      }];
    }

    const map: Record<string, any> = {};
    doctor.schedules.forEach((s: any) => {
      const key = (s.chamberName && s.chamberName.trim()) || doctor.hospital?.name || 'প্রধান চেম্বার';
      if (!map[key]) {
        map[key] = {
          name: key,
          address: s.chamberAddress || doctor.chamberRoom || doctor.hospital?.address || 'চেম্বার কক্ষ',
          phone: s.serialPhone || doctor.phone || doctor.hospital?.phone || '+88076162588',
          isTelemedicine: Boolean(s.isTelemedicine),
          fee: s.consultationFee || doctor.consultationFee || 800,
          schedules: []
        };
      }
      map[key].schedules.push(s);
    });

    return Object.values(map);
  }, [doctor.schedules, doctor.hospital, doctor.chamberRoom, doctor.phone, doctor.consultationFee]);

  const currentChamber = chambers[selectedChamberIndex] || chambers[0];
  const { daysText, timeText } = getDoctorScheduleInfo(currentChamber?.schedules?.length > 0 ? currentChamber.schedules : doctor.schedules);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const primaryPhone = currentChamber?.phone || doctor.phone || doctor.hospital?.phone || '+88076162588';

  const treatedList = doctor.treatedDiseases
    ? doctor.treatedDiseases.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [
        'হৃদরোগ ও উচ্চ রক্তচাপের আধুনিক চিকিৎসা',
        'ইসিজি, ইকো ও হার্ট অ্যাটাক পরবর্তী পুনর্বাসন',
        'ডায়াবেটিস ও হরমোনজনিত জটিলতার পরামর্শ',
        'দীর্ঘমেয়াদী মেডিসিন ও ইনফেকশন কেয়ার',
        'ল্যাব টেস্ট ও রিপোর্ট পর্যালোচনা',
      ];

  const renderTelemedicineContent = () => (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* 1. Main Telemedicine Hero Card (Clean Light Theme) */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Top Tag & Title */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-sky-700 text-xs font-black">
            <Video className="w-3.5 h-3.5 text-sky-600" />
            <span>টেলিমেডিসিন সেবা</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-nuvicaNavy-950 leading-snug">
            ঘরে বসেই বিশেষজ্ঞ চিকিৎসকের ভিডিও পরামর্শ নিন
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            দূরত্ব বা যাতায়াতের ঝামেলা ছাড়াই স্মার্টফোনে সরাসরি ডাক্তারের সাথে ভিডিও বা অডিও কলে কথা বলুন, শারীরিক সমস্যা বিস্তারিত আলোচনা করুন এবং তাৎক্ষণিক ডিজিটাল প্রেসক্রিপশন গ্রহণ করুন।
          </p>
        </div>

        {/* 2. Fee and Direct Call Action Banner */}
        <div className="bg-gradient-to-br from-sky-50/80 via-emerald-50/40 to-slate-50 border border-sky-200/70 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              ভিডিও কনসালটেশন ফি
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                ৳ {toBanglaDigits(doctor.telemedicineFee || 500)}
              </span>
              <span className="text-xs font-semibold text-slate-500">/ পরামর্শ</span>
            </div>
          </div>

          <a
            href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-black flex flex-wrap items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer text-center"
            title="টেলিমেডিসিন সিরিয়ালে কল দিন"
          >
            <PhoneCall className="w-4 h-4 text-white shrink-0" />
            <span>টেলিমেডিসিন সিরিয়ালে কল দিন</span>
            <span className="font-mono text-xs opacity-90 font-bold">({primaryPhone})</span>
          </a>
        </div>

        {/* 3. Three-Step Process Guide */}
        <div className="space-y-3 pt-2">
          <h3 className="font-black text-sm sm:text-base text-nuvicaNavy-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>৩টি সহজ ধাপে ভিডিও পরামর্শ গ্রহণ করুন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center font-black text-xs">
                ১
              </div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">
                সিরিয়াল বুকিং
              </h4>
              <p className="text-[11.5px] sm:text-xs text-slate-500 leading-relaxed">
                উপরের সিরিয়াল নম্বরে কল দিয়ে আপনার সুবিধাজনক সময় ও সিরিয়াল নির্ধারণ করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-black text-xs">
                ২
              </div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">
                ফি পরিশোধ
              </h4>
              <p className="text-[11.5px] sm:text-xs text-slate-500 leading-relaxed">
                বিকাশ বা নগদ একাউন্টে নির্ধারিত ভিডিও পরামর্শ ফি পরিশোধ করে কনফার্ম করুন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-black text-xs">
                ৩
              </div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900">
                ভিডিও কনসালটেশন
              </h4>
              <p className="text-[11.5px] sm:text-xs text-slate-500 leading-relaxed">
                নির্ধারিত সময়ে সরাসরি হোয়াটসঅ্যাপ বা মিটে ডাক্তারের সাথে কথা বলুন ও ডিজিটাল প্রেসক্রিপশন নিন।
              </p>
            </div>
          </div>
        </div>

        {/* 4. Telemedicine Key Benefits & Features */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="font-black text-xs sm:text-sm text-slate-800 mb-3">
            টেলিমেডিসিন সেবার সুবিধাসমূহ:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50/80 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>তাৎক্ষণিক ডিজিটাল ই-প্রেসক্রিপশন</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50/80 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>৭ দিনের মধ্যে বিনামূল্যে ফলোআপ সুবিধা</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50/80 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>দেশ বা বিদেশের যেকোনো স্থান থেকে সংযোগ</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50/80 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>১০০% ব্যক্তিগত তথ্য ও রিপোর্ট সুরক্ষা</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderPostsFeed = () => {
    if (loadingPosts) {
      return (
        <div className="max-w-[470px] sm:max-w-[480px] mx-auto space-y-4 font-sans">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 animate-pulse shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
              <div className="aspect-square bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="max-w-[470px] sm:max-w-[480px] mx-auto bg-white rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-xs text-center space-y-3 font-sans text-slate-900">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto ring-1 ring-slate-200/60">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">No posts yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {doctor.name || doctorNameBn} has not shared any reels or posts yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 font-sans">
        {posts.map((post) => {
          const helpfulCount = postHelpfulCounts[post.id] ?? post.helpfulCount ?? 0;
          const sharesCount = postSharesCounts[post.id] ?? post.sharesCount ?? 0;
          const isHelpful = Boolean(postReactions[post.id]);
          const isCopied = postCopiedId === post.id;
          const authorName = doctor.name || doctorNameBn;
          const isPlaying = playingPostId === post.id;
          const isExpanded = Boolean(expandedPosts[post.id]);
          const isBookmarked = Boolean(bookmarkedPosts[post.id]);

          return (
            <article
              key={post.id}
              id={`post-${post.id}`}
              className="max-w-[470px] sm:max-w-[480px] mx-auto bg-white text-[#262626] rounded-2xl shadow-xs overflow-hidden"
            >
              {/* 1. Header (Avatar, Username, Suggested for you, Follow Button, •••) */}
              <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Circular Avatar */}
                  <div
                    onClick={() => setShowImageLightbox(true)}
                    className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200/80 bg-slate-100 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center"
                    title="View photo"
                  >
                    <img
                      src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                      alt={authorName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Doctor Real Name & Subtitle */}
                  <div className="min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-[13.5px] sm:text-[14px] text-[#262626] hover:underline cursor-pointer truncate leading-none">
                        {authorName}
                      </span>
                      {isVerified && (
                        <OfficialVerifiedBadge className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </div>
                    {(doctor.degrees || doctor.specialization) && (
                      <span className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium leading-tight mt-0.5 block truncate max-w-[210px] sm:max-w-[260px]" title={doctor.degrees || doctor.specialization}>
                        {doctor.degrees || doctor.specialization}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Follow Button (shown only if not following) + ••• Menu */}
                <div className="flex items-center gap-2 shrink-0 relative">
                  {!isFollowing && (
                    <button
                      type="button"
                      onClick={handleToggleFollow}
                      className="h-7 px-3.5 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 inline-flex items-center justify-center gap-1.5 leading-none shadow-xs bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                      <span>Follow</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#262626] hover:text-black hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Options"
                    aria-expanded={openMenuPostId === post.id}
                  >
                    <MoreHorizontal className="w-5 h-5 shrink-0" />
                  </button>

                  {/* Instagram 3-Dot Dropdown Menu (Exact match to reference screenshot) */}
                  {openMenuPostId === post.id && (
                    <>
                      {/* Invisible backdrop to dismiss menu on click outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuPostId(null)}
                      />

                      <div className="absolute right-0 top-9 z-50 w-52 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200/90 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
                        {/* 1. Report */}
                        <button
                          type="button"
                          onClick={() => handleReportPost(post.id)}
                          className="w-full px-4 py-2.5 text-left text-[14px] font-bold text-rose-600 hover:bg-rose-50/70 active:bg-rose-100/70 transition-colors cursor-pointer block"
                        >
                          Report
                        </button>

                        {/* 2. Follow / Unfollow */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            handleToggleFollow();
                          }}
                          className={`w-full px-4 py-2.5 text-left text-[14px] font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer block ${
                            isFollowing ? 'text-rose-600' : 'text-[#0A66C2]'
                          }`}
                        >
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>

                        {/* 3. Add to favorites */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            setIsFavorite(!isFavorite);
                            showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites');
                          }}
                          className="w-full px-4 py-2.5 text-left text-[14px] text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer block"
                        >
                          Add to favorites
                        </button>

                        {/* 4. About this account */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            setActiveTab('DETAILS');
                            showToast('Showing doctor profile info');
                          }}
                          className="w-full px-4 py-2.5 text-left text-[14px] text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer block"
                        >
                          About this account
                        </button>

                        {/* 5. Share to... */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            handleSharePost(post);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[14px] text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer block"
                        >
                          Share to...
                        </button>

                        {/* 6. Copy link */}
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuPostId(null);
                            handleCopyLink(post.id);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[14px] text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer block"
                        >
                          Copy link
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Media Area: Video (YouTube / Facebook) */}
              {(post.mediaType === 'YOUTUBE' || post.mediaType === 'FACEBOOK' || (post.mediaUrl && (post.mediaUrl.includes('youtube') || post.mediaUrl.includes('facebook') || post.mediaUrl.includes('fb.watch')))) && post.mediaUrl && (
                <div className="w-full relative bg-black select-none overflow-hidden aspect-video flex items-center justify-center">
                  {/* Bottom-Right Translucent Circular Mute Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/65 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white hover:bg-black/85 transition-all z-10 cursor-pointer shadow-md"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {isPlaying ? (
                    post.mediaType === 'FACEBOOK' || post.mediaUrl.includes('facebook.com') || post.mediaUrl.includes('fb.watch') ? (
                      <iframe
                        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(post.mediaUrl)}&show_text=0&autoplay=1`}
                        title={post.videoTitle || 'Facebook Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0 aspect-video"
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${post.mediaUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0`}
                        title={post.videoTitle || 'YouTube Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0 aspect-video"
                      />
                    )
                  ) : (
                    <div
                      onClick={() => setPlayingPostId(post.id)}
                      className="relative w-full h-full bg-neutral-950 cursor-pointer group flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={
                          post.mediaType === 'FACEBOOK' || post.mediaUrl.includes('facebook.com')
                            ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
                            : `https://img.youtube.com/vi/${post.mediaUrl}/maxresdefault.jpg`
                        }
                        onError={(e) => {
                          // Fallback to pure 16:9 mqdefault if maxres is unavailable
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${post.mediaUrl}/mqdefault.jpg`;
                        }}
                        alt={post.videoTitle || 'Video thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors z-10" />

                      {/* Center Circular Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm border-2 border-white/90 flex items-center justify-center text-white shadow-2xl transition-all duration-200 group-hover:scale-110 active:scale-95">
                          <Play className="w-7 h-7 fill-white text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {post.mediaType === 'IMAGE' && post.mediaUrl && (
                <div
                  onClick={() => setLightboxPostImage(post.mediaUrl || null)}
                  className="w-full relative bg-slate-950 cursor-pointer overflow-hidden select-none flex items-center justify-center"
                >
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-auto max-h-[580px] object-cover hover:opacity-95 transition-opacity"
                  />
                </div>
              )}

              {post.mediaType === 'NONE' && (
                <div className="px-5 py-8 bg-slate-50 text-slate-900 text-[15px] font-bold leading-relaxed border-y border-slate-100">
                  {post.content}
                </div>
              )}

              {/* 3. Instagram Action Bar (Heart + count, Comment + count, Send, Bookmark - NO REPOST!) */}
              <div className="px-4 py-2.5 flex items-center justify-between select-none">
                {/* Left: Like, Comment, Send (NO REPOST OPTION) */}
                <div className="flex items-center gap-4">
                  {/* Heart + Like Count */}
                  <button
                    type="button"
                    onClick={() => handleHelpfulReaction(post.id)}
                    className="inline-flex items-center gap-1.5 group cursor-pointer active:scale-90 transition-transform h-7"
                    title="Like"
                  >
                    <Heart
                      className={`w-[22px] h-[22px] shrink-0 transition-colors ${
                        isHelpful
                          ? 'fill-[#FF3040] text-[#FF3040]'
                          : 'text-[#262626] group-hover:text-[#737373] stroke-[1.8]'
                      }`}
                    />
                    <span className="text-[#262626] font-semibold text-[13.5px] leading-none tracking-tight flex items-center">
                      {formatInstagramCount(helpfulCount)}
                    </span>
                  </button>

                  {/* Comment + Comment Count */}
                  <button
                    type="button"
                    onClick={() => setActiveCommentsPost(post)}
                    className="inline-flex items-center gap-1.5 group cursor-pointer active:scale-90 transition-transform h-7"
                    title="Comments"
                  >
                    <MessageCircle
                      className={`w-[22px] h-[22px] shrink-0 transition-colors ${
                        activeCommentsPost?.id === post.id ? 'text-indigo-600' : 'text-[#262626] group-hover:text-[#737373]'
                      } stroke-[1.8]`}
                    />
                    <span className="text-[#262626] font-semibold text-[13.5px] leading-none tracking-tight flex items-center">
                      {formatInstagramCount(sharesCount)}
                    </span>
                  </button>

                  {/* Send / Paper Airplane (Share) - Clean Instagram SVG */}
                  <button
                    type="button"
                    onClick={() => handleSharePost(post)}
                    className="inline-flex items-center justify-center h-7 cursor-pointer active:scale-90 transition-transform group"
                    title="Share"
                  >
                    <svg
                      className="w-[22px] h-[22px] text-[#262626] group-hover:text-[#737373] shrink-0 transition-colors"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>

                {/* Right: Bookmark (Save) */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(post.id)}
                  className="inline-flex items-center justify-center h-7 cursor-pointer active:scale-90 transition-transform group"
                  title="Save"
                >
                  <Bookmark
                    className={`w-[22px] h-[22px] shrink-0 transition-colors ${
                      isBookmarked
                        ? 'fill-[#262626] text-[#262626]'
                        : 'text-[#262626] group-hover:text-[#737373] stroke-[1.8]'
                    }`}
                  />
                </button>
              </div>

              {/* 4. Instagram Caption Line (Doctor real name + content + ... more / less) */}
              <div className="px-4 pt-1 text-[13.5px] text-[#262626] leading-relaxed break-words">
                <span className="font-bold text-[#262626] mr-1.5 cursor-pointer hover:underline inline">
                  {authorName}
                </span>
                <span className="font-bold text-slate-900 inline">
                  {isExpanded || !post.content || post.content.length <= 72
                    ? post.content
                    : `${post.content.slice(0, 72).trim()}...`}
                </span>
                {post.content && post.content.length > 72 && (
                  <button
                    type="button"
                    onClick={() => setExpandedPosts((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="text-[#737373] hover:text-[#262626] text-[13px] font-medium ml-1.5 cursor-pointer inline transition-colors"
                  >
                    {isExpanded ? 'less' : 'more'}
                  </button>
                )}
              </div>

              {/* 5. Instagram Relative Timestamp (e.g. 11 hours ago) */}
              <div className="px-4 pt-1 pb-3 text-[11.5px] text-[#737373] font-normal">
                {formatRelativeEnglishTime(post.createdAt)}
              </div>
            </article>
          );
        })}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-0 md:pb-12 selection:bg-sky-100 selection:text-sky-900">
      
      {/* ========================================================================= */}
      {/* 💻 DESKTOP / PC VIEW (Matching User's Desktop Reference Image) */}
      {/* ========================================================================= */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-6 space-y-6">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-700 transition-colors">হোম</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/doctors" className="hover:text-emerald-700 transition-colors">সকল ডাক্তার</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-bold">{doctorNameBn}</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors cursor-pointer ${
                isFavorite ? 'text-rose-500' : 'text-slate-500'
              }`}
              title="পছন্দের তালিকায় রাখুন"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>

        {/* 🌟 1. Top Doctor Profile Hero Box (Cover Photo Banner + Photo Overlap) */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
          
          {/* Cover Photo Banner (Standard 16:9 or 3:1 Banner Aspect) */}
          <div className="relative w-full h-48 sm:h-56 bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80"
              alt="Cover Banner"
              className="w-full h-full object-cover opacity-70 mix-blend-overlay"
            />
          </div>

          {/* Overlapping Doctor Info Bar */}
          <div className="px-8 pb-8 pt-0 relative">
            
            {/* Left Overlapping Doctor Photo + Right Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 -mt-16 sm:-mt-20">
              
              {/* Photo & Basic Credentials */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* 1:1 Aspect Square Photo (Zoomable on click) */}
                <div
                  onClick={() => setShowImageLightbox(true)}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-100 cursor-pointer shrink-0 group hover:ring-2 hover:ring-sky-400 transition-all"
                  title="ছবি বড় করে দেখতে ক্লিক করুন"
                >
                  <img
                    src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded-md">বড় করে দেখুন</span>
                  </div>
                </div>

                {/* Identity Details */}
                <div className="flex flex-col justify-center space-y-1 sm:pb-1">
                  {/* Doctor Name & Verified Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-black text-2xl sm:text-3xl text-nuvicaNavy-950 leading-snug">
                      {doctorNameBn}
                    </h1>
                    {isVerified && (
                      <OfficialVerifiedBadge className="w-6 h-6 shrink-0" />
                    )}
                  </div>

                  {/* Degrees */}
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {doctor.degrees}
                  </p>

                  {/* Specialization */}
                  <p className="text-xs sm:text-sm font-black text-sky-700 leading-snug">
                    {specializationBn}
                  </p>

                  {/* BMDC Registration Number */}
                  <p className="text-xs text-slate-400 font-semibold leading-normal">
                    BMDC Reg: {doctor.bmdcNumber || 'A-31205'}
                  </p>

                  {/* Followers & Posts Count + Follow Button (Aligned on the same row) */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-semibold text-slate-500 tracking-tight">
                      {followersCount.toLocaleString()} followers &bull; {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleFollow}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all duration-200 cursor-pointer select-none shrink-0 whitespace-nowrap ${
                        isFollowing
                          ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs'
                          : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0A66C2] stroke-[2.5] shrink-0" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 🌟 Desktop Tab Bar: Clean Left-to-Right Flat Bar (No rounded container box, no highlight pill, pure sliding blue line) */}
        <div className="w-full border-b border-slate-200/80 bg-white">
          <div className="relative flex items-center max-w-2xl select-none">
            {/* Smooth Sliding Underline Indicator (Stays strictly under the active tab) */}
            <div
              className="absolute bottom-0 h-[2.5px] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
              style={{
                width: '33.333%',
                transform: `translate3d(${
                  activeTab === 'DETAILS'
                    ? '0%'
                    : activeTab === 'TELEMEDICINE'
                    ? '100%'
                    : '200%'
                }, 0, 0)`,
              }}
            >
              <div className="mx-auto w-24 h-full bg-sky-600 rounded-full" />
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('DETAILS')}
              className={`relative z-10 flex-1 py-4 px-4 text-[14px] sm:text-[15px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] leading-none ${
                activeTab === 'DETAILS'
                  ? 'text-sky-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 transition-colors duration-200 ${activeTab === 'DETAILS' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="leading-none">Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TELEMEDICINE')}
              className={`relative z-10 flex-1 py-4 px-4 text-[14px] sm:text-[15px] font-extrabold inline-flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] leading-none ${
                activeTab === 'TELEMEDICINE'
                  ? 'text-sky-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Video className={`w-4 h-4 shrink-0 transition-colors duration-200 ${activeTab === 'TELEMEDICINE' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="leading-none">Telemedicine</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('POSTS')}
              className={`relative z-10 flex-1 py-4 px-4 text-[14px] sm:text-[15px] font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] leading-none ${
                activeTab === 'POSTS'
                  ? 'text-sky-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 transition-colors duration-200 ${activeTab === 'POSTS' ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className="leading-none">Posts</span>
              <span className="leading-none opacity-80 text-[13px] font-bold">({posts.length})</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 2-Column Main Layout: Left Main Info (70%) + Right Sidebar (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Doctor Profile + Practice Experience (70%) */}
          <div key={activeTab} className="lg:col-span-2 space-y-6 animate-in fade-in-50 duration-300">
            {activeTab === 'DETAILS' ? (
              <>
            
            {/* A. Doctor Profile (Bio) */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs space-y-4 transition-colors duration-300">
              <h2 className="font-extrabold text-lg text-slate-900">
                ডাক্তারের পরিচিতি
              </h2>

              {/* Smooth Collapsible Bio Container */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  showFullBio ? 'max-h-[1000px]' : 'max-h-[76px]'
                }`}
                style={{
                  WebkitMaskImage: showFullBio
                    ? 'none'
                    : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                  maskImage: showFullBio
                    ? 'none'
                    : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                }}
              >
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {doctor.bio || `${doctorNameBn} একজন দক্ষ ও অভিজ্ঞ ${specializationBn}। তিনি দীর্ঘকাল ধরে অত্যন্ত সুনামের সাথে আধুনিক চিকিৎসা সেবা ও রোগীর পরামর্শ প্রদান করে আসছেন। সঠিক রোগ নির্ণয় ও মানবিক চিকিৎসা সেবায় তিনি বিশেষভাবে সমাদৃত।`}
                </p>

                {/* Diseases / Conditions Treated */}
                {treatedList.length > 0 && (
                  <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showFullBio ? 'opacity-100 translate-y-0 mt-4 pt-4 border-t border-slate-100' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <h3 className="font-extrabold text-sm text-slate-900 mb-2.5">
                      যেসব রোগের চিকিৎসা ও সেবা প্রদান করেন:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium pb-1">
                      {treatedList.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-xs font-bold text-slate-900 hover:text-black flex items-center gap-1 cursor-pointer transition-colors py-0.5"
                >
                  <span>{showFullBio ? 'See Less' : 'See More'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      showFullBio ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* B. Practice Experience (Chambers & Hospitals) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
              
              <div>
                <h2 className="font-extrabold text-lg text-slate-900">
                  চেম্বারসমূহ এবং সময়সূচি
                </h2>
              </div>

              {/* Stacked Hospital Experience Cards (Clean Modern Structure) */}
              <div className="space-y-4">
                {chambers.map((ch: any, idx: number) => {
                  const { daysText: chDays, timeText: chTime } = getDoctorScheduleInfo(
                    ch.schedules.length > 0 ? ch.schedules : doctor.schedules
                  );

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all space-y-3.5 relative group"
                    >
                      {/* 1. Top Section: Hospital Icon + Name + Address + Share Button */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base text-slate-900 leading-snug truncate">
                              {ch.name}
                            </h3>
                            {ch.address && (
                              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed truncate">
                                {ch.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={handleShare}
                          className="text-slate-300 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2. Middle Section: Minimal Schedule Row (No bulky boxed widget) */}
                      <div className="pt-2.5 pb-1 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{chDays}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{chTime}</span>
                        </div>
                      </div>

                      {/* 3. Bottom Section: Minimal Fee & Clean Direct Call Button */}
                      <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                        {/* Minimal Consultation Fee */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <span>ফি:</span>
                          <span className="text-sm font-black text-slate-900">৳ {toBanglaDigits(ch.fee)}</span>
                        </div>

                        {/* Serial Direct Call Button */}
                        <a
                          href={`tel:${(ch.phone || primaryPhone).replace(/\s+/g, '')}`}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer leading-none"
                          title="সরাসরি সিরিয়ালে কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5 text-white" />
                          <span className="font-mono font-bold tracking-tight">{ch.phone || primaryPhone}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
              </>
            ) : activeTab === 'TELEMEDICINE' ? (
              renderTelemedicineContent()
            ) : (
              renderPostsFeed()
            )}

          </div>

          {/* RIGHT SIDEBAR: Medical Actions + Make Appointment CTA (30%) */}
          <div className="space-y-6">
            
            {/* A. Medical Actions & Services Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                প্রধান সেবাসমূহ
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                {treatedList.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B. Telemedicine Online Card (Clean Light Theme) */}
            {activeTab !== 'TELEMEDICINE' ? (
              <div className="bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/30 border border-sky-200/80 rounded-3xl p-6 shadow-xs space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-sky-700">
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>টেলিমেডিসিন সেবা</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md">
                    অনলাইন সক্রিয়
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-nuvicaNavy-950 leading-snug">
                  ঘরে বসেই ভিডিও কলে বিশেষজ্ঞ পরামর্শ নিন
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <span>অনলাইন ফি:</span>
                  <strong className="text-emerald-700 font-black text-sm">৳ {toBanglaDigits(doctor.telemedicineFee || 500)} টাকা</strong>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('TELEMEDICINE')}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-white" />
                    <span>টেলিমেডিসিনের নিয়ম ও সময় দেখুন</span>
                  </button>
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span>সিরিয়ালে সরাসরি কল দিন</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>চেম্বার পরিদর্শন</span>
                </div>
                <h4 className="font-extrabold text-base text-nuvicaNavy-950 leading-snug">
                  সরাসরি চেম্বারে গিয়ে ডাক্তার দেখাতে চান?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  ডাক্তারের চেম্বারের তালিকা, ঠিকানা ও সরাসরি সাক্ষাতের সময়সূচি দেখতে চেম্বার ট্যাবে যান।
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('DETAILS')}
                  className="w-full bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-800 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80"
                >
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>চেম্বারের সময়সূচি দেখুন</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW (2 Separate Standalone Rounded Rectangular Boxes) */}
      {/* ========================================================================= */}
      <div className="block md:hidden max-w-md mx-auto bg-[#FAFAFA] relative shadow-none border-x border-slate-200/40 pb-3 pt-3 px-3 space-y-2.5">
        
        {/* 📦 BOX 1: Standalone Rounded Cover Banner Box */}
        <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-gradient-to-r from-emerald-200 via-teal-100 to-sky-200">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
            alt="Cover Banner"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />

          {/* Top Floating Controls */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
            <Link
              href="/doctors"
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  isFavorite ? 'text-[#FF6B6B]' : 'text-slate-600 hover:text-[#FF6B6B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#FF6B6B]' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 📦 BOX 2: Standalone Rounded Profile Info Card */}
        <div className="bg-white rounded-2xl px-5 pt-0 pb-6 shadow-sm border border-slate-200/80 relative">
          
          {/* Overlapping Larger Circular Avatar */}
          <div className="-mt-16 sm:-mt-20 mb-3">
            <div 
              onClick={() => setShowImageLightbox(true)}
              className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 rounded-full shadow-lg shadow-slate-900/15 border-4 border-white overflow-hidden bg-slate-100 cursor-pointer shrink-0 group hover:ring-2 hover:ring-sky-300 transition-all inline-block"
              title="ছবি বড় করে দেখতে ক্লিক করুন"
            >
              <img
                src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
                alt={doctor.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Doctor Identity Block */}
          <div className="space-y-1 pt-1">
            {/* Doctor Name with Verified Blue Tick */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-black text-2xl text-slate-900 leading-tight tracking-tight">
                {doctorNameBn}
              </h1>
              {isVerified && (
                <OfficialVerifiedBadge className="w-5 h-5 shrink-0 select-none inline-block align-middle" />
              )}
            </div>

            {/* Degrees */}
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {doctor.degrees}
            </p>

            {/* Specialization */}
            <p className="text-[13.5px] font-black text-sky-700 leading-snug">
              {specializationBn}
            </p>

            {/* BMDC Registration Number */}
            <p className="text-xs text-slate-400 font-semibold tracking-tight">
              BMDC: {doctor.bmdcNumber || 'A-31205'}
            </p>

            {/* Followers & Posts Count + Follow Button (Aligned on the same row) */}
            <div className="flex items-center justify-between gap-2.5 pt-1">
              <span className="text-xs font-semibold text-slate-500 tracking-tight">
                {followersCount.toLocaleString()} followers &bull; {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </span>

              <button
                type="button"
                onClick={handleToggleFollow}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all duration-200 cursor-pointer select-none shrink-0 whitespace-nowrap ${
                  isFollowing
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs'
                    : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0A66C2] stroke-[2.5] shrink-0" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* About Section Inside Rounded Rectangular Box */}
          <div className="bg-[#F8FAFD] rounded-2xl p-4 border border-slate-100 shadow-2xs mt-4 transition-colors duration-300">
            <h2 className="font-extrabold text-sm text-slate-900 mb-1.5">পরিচিতি</h2>

            {/* Smooth Collapsible Bio Container */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                showFullBio ? 'max-h-[800px]' : 'max-h-[60px]'
              }`}
              style={{
                WebkitMaskImage: showFullBio
                  ? 'none'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                maskImage: showFullBio
                  ? 'none'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              }}
            >
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {doctor.bio || `${doctorNameBn} একজন দক্ষ ও অভিজ্ঞ ${specializationBn}। তিনি দীর্ঘকাল ধরে অত্যন্ত সুনামের সাথে আধুনিক চিকিৎসা সেবা ও রোগীর পরামর্শ প্রদান করে আসছেন।`}
              </p>

              {/* Diseases / Conditions Treated */}
              {treatedList.length > 0 && (
                <div
                  className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showFullBio ? 'opacity-100 translate-y-0 mt-3 pt-3 border-t border-slate-200/80' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="font-extrabold text-[11.5px] text-slate-900 tracking-tight mb-2">
                    যেসব রোগের চিকিৎসা ও সেবা প্রদান করেন:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium pb-1">
                    {treatedList.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Lower Right Corner Toggle Button */}
            <div className="flex justify-end pt-1.5">
              <button
                type="button"
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-xs font-bold text-slate-900 hover:text-black cursor-pointer flex items-center gap-1 transition-colors py-0.5"
              >
                <span>{showFullBio ? 'Show less' : 'Show more'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    showFullBio ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* 📱 Mobile Tab Bar: Edge-to-Edge Left-to-Right Flat Bar (No rounded box, no highlight pill, pure sliding blue line) */}
        <div className="-mx-3 relative flex items-center bg-white border-y border-slate-200/80 select-none">
          {/* Smooth Sliding Underline Indicator (Stays strictly under the active tab) */}
          <div
            className="absolute bottom-0 h-[2.5px] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
            style={{
              width: '33.333%',
              transform: `translate3d(${
                activeTab === 'DETAILS'
                  ? '0%'
                  : activeTab === 'TELEMEDICINE'
                  ? '100%'
                  : '200%'
              }, 0, 0)`,
            }}
          >
            <div className="mx-auto w-16 h-full bg-sky-600 rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('DETAILS')}
            className={`relative z-10 flex-1 inline-flex items-center justify-center gap-1.5 py-3.5 px-1 text-xs sm:text-[13px] font-extrabold transition-colors duration-200 cursor-pointer leading-none active:scale-[0.98] ${
              activeTab === 'DETAILS'
                ? 'text-sky-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${activeTab === 'DETAILS' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="leading-none">Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TELEMEDICINE')}
            className={`relative z-10 flex-1 inline-flex items-center justify-center gap-1.5 py-3.5 px-1 text-xs sm:text-[13px] font-extrabold transition-colors duration-200 cursor-pointer leading-none active:scale-[0.98] ${
              activeTab === 'TELEMEDICINE'
                ? 'text-sky-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${activeTab === 'TELEMEDICINE' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="leading-none">Telemedicine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('POSTS')}
            className={`relative z-10 flex-1 inline-flex items-center justify-center gap-1 py-3.5 px-1 text-xs sm:text-[13px] font-extrabold transition-colors duration-200 cursor-pointer leading-none active:scale-[0.98] ${
              activeTab === 'POSTS'
                ? 'text-sky-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${activeTab === 'POSTS' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="leading-none">Posts</span>
            <span className="leading-none opacity-80 text-[11px] font-bold">({posts.length})</span>
          </button>
        </div>

        {/* 2. Mobile Content Body Below */}
        <div key={activeTab} className="space-y-3 pt-1 animate-in fade-in-50 duration-300">
          {activeTab === 'DETAILS' ? (
            <>
              {/* Chambers List Section */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xs border border-slate-200/80 space-y-3.5">
                <div>
                  <h2 className="font-extrabold text-base text-slate-900">চেম্বারসমূহ এবং সময়সূচি</h2>
                </div>

                <div className="space-y-3.5">
                  {chambers.map((ch: any, idx: number) => {
                    const { daysText: chDays, timeText: chTime } = getDoctorScheduleInfo(ch.schedules.length > 0 ? ch.schedules : doctor.schedules);

                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all space-y-3 relative group"
                      >
                        {/* 1. Top Row: Hospital Icon + Name + Address + Share */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                                {ch.name}
                              </h3>
                              {ch.address && (
                                <p className="text-[11.5px] text-slate-500 font-normal mt-0.5 leading-relaxed truncate">
                                  {ch.address}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Share Button */}
                          <button
                            type="button"
                            onClick={handleShare}
                            className="text-slate-300 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition shrink-0 cursor-pointer"
                            title="শেয়ার করুন"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 2. Middle Row: Minimal Schedule Row (No bulky boxed widget) */}
                        <div className="pt-2 pb-1 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{chDays}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{chTime}</span>
                          </div>
                        </div>

                        {/* 3. Bottom Row: Minimal Fee & Clean Direct Call Button */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          {/* Minimal Consultation Fee */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span>ফি:</span>
                            <span className="text-sm font-black text-slate-900">৳ {toBanglaDigits(ch.fee)}</span>
                          </div>

                          {/* Direct Call Button */}
                          <a
                            href={`tel:${(ch.phone || primaryPhone).replace(/\s+/g, '')}`}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer leading-none"
                            title="সরাসরি সিরিয়ালে কল দিন"
                          >
                            <Phone className="w-3.5 h-3.5 text-white" />
                            <span className="font-mono font-bold tracking-tight">{ch.phone || primaryPhone}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-3xl p-5 shadow-2xs border border-slate-200/80 space-y-3">
                <h2 className="font-extrabold text-base text-slate-900">Services & Specialties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {treatedList.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-[#F8FAFD] rounded-xl text-xs font-medium text-slate-700 border border-slate-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Light Theme Telemedicine Promo Banner */}
              <div className="bg-gradient-to-br from-sky-50 via-blue-50/50 to-slate-50 p-4 rounded-3xl border border-sky-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-sky-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-sky-600" />
                    <span>টেলিমেডিসিন ভিডিও পরামর্শ</span>
                  </span>
                  <span className="text-emerald-700 font-black">
                    ৳ {toBanglaDigits(doctor.telemedicineFee || 500)} টাকা
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
                  ঘরে বসেই সরাসরি ভিডিও কলে বিশেষজ্ঞ পরামর্শ ও তাৎক্ষণিক ডিজিটাল প্রেসক্রিপশন গ্রহণ করুন।
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('TELEMEDICINE')}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Video className="w-3.5 h-3.5 text-white" />
                  <span>ভিডিও পরামর্শের নিয়ম ও সময় দেখুন</span>
                </button>
              </div>
            </>
          ) : activeTab === 'TELEMEDICINE' ? (
            renderTelemedicineContent()
          ) : (
            renderPostsFeed()
          )}
        </div>

      </div>

      {/* 🖼️ Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={showImageLightbox}
        onClose={() => setShowImageLightbox(false)}
        imageUrl={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
        doctorName={doctorNameBn}
        specialization={specializationBn}
        hospitalName={doctor.hospital?.name}
        phone={primaryPhone}
      />

      {/* 🔐 Login Required Prompt Modal for Doctor Follow */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="লগইন আবশ্যক"
        description="ডাক্তারকে ফলো করতে এবং নতুন স্বাস্থ্য টিপস ও পোস্টের নিয়মিত আপডেট পেতে অনুগ্রহ করে আপনার একাউন্টে লগইন বা সাইন-আপ করুন।"
        redirectUrl={`/login?redirect=/doctors/${doctor.id}`}
        iconType="doctor"
      />

      {/* 🖼️ Post Image Zoom Lightbox Modal */}
      {lightboxPostImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxPostImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxPostImage(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-200 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer z-10"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPostImage}
              alt="Enlarged health post image"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* 💬 Instagram Bottom Sheet Comments Drawer Modal */}
      {activeCommentsPost && (
        <DoctorPostCommentsModal
          isOpen={Boolean(activeCommentsPost)}
          onClose={() => setActiveCommentsPost(null)}
          postId={activeCommentsPost.id}
          doctorName={doctor.name || doctorNameBn}
          doctorUsername={doctorUsername}
          initialCommentsCount={postSharesCounts[activeCommentsPost.id] ?? activeCommentsPost.sharesCount ?? 0}
          onCommentsCountChange={(newCount) => {
            setPostSharesCounts((prev) => ({ ...prev, [activeCommentsPost.id]: newCount }));
          }}
          isLoggedIn={isLoggedIn}
          onRequireLogin={() => setShowLoginModal(true)}
        />
      )}

      {/* 🚀 Social Share Modal */}
      {activeSharePost && (
        <SocialShareModal
          isOpen={Boolean(activeSharePost)}
          onClose={() => setActiveSharePost(null)}
          url={typeof window !== 'undefined' ? `${window.location.origin}/doctors/${doctor.slug || doctor.id}#post-${activeSharePost.id}` : ''}
          title={`${doctor.name || doctorNameBn} - Post`}
          text={activeSharePost.content || `${doctor.name || doctorNameBn} এর স্বাস্থ্য বিষয়ক পোস্ট`}
          doctorName={doctor.name || doctorNameBn}
          doctorPhoto={doctor.photoUrl}
          doctorSpecialty={doctor.specialty || doctor.department}
          postSnippet={activeSharePost.content}
          mediaUrl={activeSharePost.mediaUrl}
          mediaType={activeSharePost.mediaType}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-x-0 mx-auto w-max max-w-sm px-5 py-3 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-2xl border border-slate-200/90 backdrop-blur-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
