// CD Doctors About Page
import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  Droplet, 
  Siren, 
  PhoneCall, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  HeartHandshake, 
  Compass, 
  Target, 
  Sparkles, 
  MapPin, 
  UserCheck, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  Globe, 
  Mail, 
  Phone, 
  Activity, 
  Users, 
  Award, 
  Share2, 
  Info,
  HelpCircle,
  FileText,
  Clock,
  Layers,
  Send,
  Zap,
  Check,
  TrendingUp,
} from 'lucide-react';

export const metadata = {
  title: 'CD Doctors সম্পর্কে | চুয়াডাঙ্গার Digital Healthcare Platform',
  description: 'CD Doctors হলো চুয়াডাঙ্গাভিত্তিক একটি Digital Healthcare Platform, যেখানে হাসপাতাল, ডাক্তার, রক্তদাতা ও জরুরি স্বাস্থ্যসেবা সম্পর্কিত গুরুত্বপূর্ণ তথ্য সহজে খুঁজে পাওয়া যায়।',
  keywords: ['CD Doctors', 'CD Doctors সম্পর্কে', 'Mukset Al Kanon', 'Chuadanga Healthcare', 'Chuadanga Hospital', 'Chuadanga Doctor', 'Chuadanga Blood Donor', 'Chuadanga Emergency'],
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pt-10 pb-20 overflow-hidden font-bengali">

      {/* ==================================================
          SECTION 2 — WHAT IS CD DOCTORS?
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50/80 via-white to-sky-50/40 rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-nuvica space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center font-black shrink-0 border border-sky-200/60 shadow-2xs">
              <Compass className="w-5.5 h-5.5 text-sky-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-nuvicaNavy-900 leading-[1.35] tracking-tight font-noto-bengali-heading">
              CD Doctors কী?
            </h2>
          </div>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            CD Doctors হলো চুয়াডাঙ্গাভিত্তিক একটি <span className="font-extrabold text-nuvicaNavy-900">Digital Healthcare Platform</span>, যেখানে সাধারণ মানুষ একটি নির্দিষ্ট জায়গা থেকে স্থানীয় হাসপাতাল, ডাক্তার, রক্তদাতা এবং জরুরি স্বাস্থ্যসেবা সম্পর্কিত গুরুত্বপূর্ণ তথ্য সহজে খুঁজে পেতে পারে।
          </p>


        </div>
      </section>

      {/* ==================================================
          SECTION 3 — WHY WE STARTED
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200/80">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>প্রেক্ষাপট ও প্রয়োজন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-nuvicaNavy-900 tracking-tight">
            কেন CD Doctors তৈরি করা হয়েছে?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            প্রয়োজনের সময় সঠিক স্বাস্থ্যসেবার তথ্য যেন সহজে ও দ্রুত পাওয়া যায়—এই লক্ষ্যেই CD Doctors-এর যাত্রা।
          </p>
        </div>

        {/* 4 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-base shrink-0">
                01
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 leading-snug">
                তথ্যের বিচ্ছিন্নতা
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              হাসপাতাল, চিকিৎসক ও স্বাস্থ্যসেবার তথ্য বিভিন্ন মাধ্যমে ছড়িয়ে থাকায় প্রয়োজনের সময় সঠিক তথ্য খুঁজে পাওয়া কঠিন।
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-base shrink-0">
                02
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 leading-snug">
                সময়ের অপচয়
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              উপযুক্ত চিকিৎসক, হাসপাতাল বা জরুরি সেবা খুঁজতে অতিরিক্ত সময় ব্যয় করতে হয়—যা জরুরি মুহূর্তে আরও গুরুত্বপূর্ণ।
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base shrink-0">
                03
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 leading-snug">
                ডিজিটাল তথ্যের ঘাটতি
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              স্থানীয় স্বাস্থ্যসেবা প্রতিষ্ঠান থাকলেও তাদের তথ্য সবসময় একটি সুসংগঠিত ও সহজলভ্য ডিজিটাল প্ল্যাটফর্মে পাওয়া যায় না।
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-base shrink-0">
                04
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 leading-snug">
                জরুরি যোগাযোগ
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              রক্ত বা জরুরি চিকিৎসার প্রয়োজনে দ্রুত সঠিক ব্যক্তি বা প্রতিষ্ঠানের সঙ্গে যোগাযোগ করা অত্যন্ত গুরুত্বপূর্ণ।
            </p>
          </div>
        </div>

        {/* Closing Banner */}
        <div className="bg-sky-50/90 border border-sky-200/80 p-5 rounded-2xl text-center">
          <p className="text-sm font-extrabold text-nuvicaNavy-900">
            💡 এই বাস্তব সমস্যাগুলোর সমাধানের লক্ষ্যেই CD Doctors—চুয়াডাঙ্গার স্বাস্থ্যসেবার তথ্যকে আরও সহজ, সংযুক্ত ও সহজলভ্য করার একটি উদ্যোগ।
          </p>
        </div>
      </section>









      {/* ==================================================
          SECTION 8 — FOR PATIENTS
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50/70 p-8 sm:p-12 rounded-3xl border border-sky-200/80 space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-sky-700 text-xs font-black shadow-2xs">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>রোগী ও স্বজনদের জন্য</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-900 tracking-tight">
              সাধারণ মানুষের জন্য CD Doctors
            </h2>

            <p className="text-base text-slate-700 font-medium leading-relaxed">
              স্বাস্থ্যসেবা সম্পর্কিত গুরুত্বপূর্ণ তথ্য খুঁজতে যেন মানুষকে একাধিক জায়গায় ঘুরতে না হয়—CD Doctors সেই অভিজ্ঞতাকে আরও সহজ করার চেষ্টা করে।
            </p>
          </div>


        </div>
      </section>

      {/* ==================================================
          SECTION 9 — FOR HOSPITALS & DOCTORS
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-nuvica space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Healthcare Providers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-900 tracking-tight">
              হাসপাতাল ও ডাক্তারদের জন্য CD Doctors
            </h2>

            <p className="text-base text-slate-700 font-medium leading-relaxed">
              CD Doctors শুধু patients-এর জন্য নয়। স্থানীয় healthcare providers-এর জন্যও এটি একটি professional digital presence তৈরির সুযোগ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 01 */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 hover:bg-white hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm shrink-0">
                  01
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 tracking-tight">
                  Professional Profile
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                হাসপাতাল ও চিকিৎসকদের জন্য একটি সুসংগঠিত ডিজিটাল প্রোফাইল।
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 hover:bg-white hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                  02
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 tracking-tight">
                  Online Visibility
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                স্থানীয় মানুষের কাছে হাসপাতাল ও চিকিৎসকদের তথ্য আরও সহজে পৌঁছে দেওয়ার সুযোগ।
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 hover:bg-white hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
                  03
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 tracking-tight">
                  Patient Reach
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                প্রয়োজনীয় তথ্যের মাধ্যমে সম্ভাব্য রোগীদের আপনার সেবা সম্পর্কে জানতে সহায়তা করা।
              </p>
            </div>

            {/* Card 04 */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 hover:bg-white hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0">
                  04
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900 tracking-tight">
                  Digital Promotion
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ওয়েবসাইট ও CD Doctors-এর সামাজিক যোগাযোগমাধ্যমের মাধ্যমে স্বাস্থ্যসেবা প্রতিষ্ঠানের প্রচারের সুযোগ।
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs font-extrabold text-slate-600">
              🤝 আমাদের লক্ষ্য healthcare providers এবং সাধারণ মানুষের মধ্যে একটি আরও সহজ digital connection তৈরি করা।
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 10 — BLOOD DONOR INITIATIVE
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-50/90 via-white to-slate-50 p-8 sm:p-12 rounded-3xl border border-rose-200/80 shadow-nuvica space-y-8 relative overflow-hidden">
          {/* Header Badge & Title */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-black border border-rose-200">
              <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>রক্তদান নেটওয়ার্ক</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-nuvicaNavy-900 leading-[1.35] tracking-tight font-noto-bengali-heading">
              রক্তদানে একটি ডিজিটাল সংযোগ
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              CD Doctors-এর Blood section-এর মাধ্যমে মানুষ blood group অনুযায়ী registered donor খুঁজে পেতে পারে এবং প্রয়োজনে donor-এর সঙ্গে যোগাযোগ করতে পারে।
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Verification Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-nuvicaNavy-900">তথ্য যাচাই ও প্রকাশ</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  যারা রক্তদাতা হিসেবে নিবন্ধন করবেন, তাদের তথ্য Admin review-এর পর directory-তে প্রকাশ করা হবে।
                </p>
              </div>
            </div>

            {/* Disclaimer Card */}
            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-amber-900">জরুরি সতর্কাংশ</h3>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Donor availability পরিবর্তিত হতে পারে। রক্তের প্রয়োজন হলে যোগাযোগের আগে donor-এর বর্তমান availability নিশ্চিত করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 11 — INFORMATION & TRUST
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-nuvica space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-900 tracking-tight">
                তথ্যের নির্ভরযোগ্যতা ও দায়িত্বশীলতা
              </h2>
              <span className="text-xs text-slate-500 font-bold">Reliable & Responsible Information Policy</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            স্বাস্থ্যসেবা সম্পর্কিত তথ্যের ক্ষেত্রে সঠিকতা ও দায়িত্বশীলতা অত্যন্ত গুরুত্বপূর্ণ। CD Doctors তথ্যকে সংগঠিত ও আপডেট রাখার চেষ্টা করে। তবে doctor schedule, appointment availability, consultation fee, emergency service এবং donor availability-এর মতো পরিবর্তনশীল তথ্য ব্যবহার করার আগে সংশ্লিষ্ট ব্যক্তি বা প্রতিষ্ঠানের সঙ্গে সরাসরি নিশ্চিত হওয়ার পরামর্শ দেওয়া হয়।
          </p>
        </div>
      </section>

      {/* ==================================================
          SECTION 12 — PRIVACY
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-nuvica space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/90 shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>তথ্য সুরক্ষা</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-nuvicaNavy-900 leading-[1.35] tracking-tight font-noto-bengali-heading">
                Privacy আমাদের কাছে গুরুত্বপূর্ণ
              </h2>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            CD Doctors ব্যবহারকারীদের ব্যক্তিগত তথ্য দায়িত্বশীলভাবে পরিচালনা করার প্রতি গুরুত্ব দেয়। বিশেষ করে Blood Donor Directory-তে কোনো ব্যক্তির তথ্য প্রকাশের আগে তার সম্মতি এবং Admin approval-এর ব্যবস্থা থাকবে।
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs font-extrabold text-slate-700">
            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ব্যবহারকারীর পূর্ণ সম্মতি
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              অ্যাডমিন যাচাইকরণ ব্যবস্থা
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 13 — FOUNDER
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-nuvicaNavy-900 via-sky-950 to-nuvicaNavy-950 p-8 sm:p-12 rounded-3xl text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Founder Visual Badge */}
            <div className="md:col-span-4 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-sky-600 to-sky-400 p-1 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-nuvicaNavy-900 flex flex-col items-center justify-center space-y-2 border border-white/20">
                  <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 font-black text-2xl">
                    MK
                  </div>
                  <span className="text-[11px] font-black tracking-wider text-sky-400 uppercase">Founder</span>
                </div>
              </div>
            </div>

            {/* Founder Info */}
            <div className="md:col-span-8 space-y-4">


              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">Mukset Al Kanon</h2>
                <p className="text-xs font-extrabold text-sky-400 mt-0.5">Founder, CD Doctors</p>
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                CD Doctors-এর Founder Mukset Al Kanon healthcare information-কে আরও সহজে accessible এবং digitally organized করার উদ্যোগ নিয়েছেন।
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                CD Doctors-এর লক্ষ্য হলো প্রযুক্তিকে ব্যবহার করে healthcare information ecosystem-কে আরও organized, accessible এবং connected করে তোলা।
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Chuadanga, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ==================================================
          SECTION 15 — FUTURE ROADMAP
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-black border border-sky-200/80">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>রোডম্যাপ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-nuvicaNavy-900 tracking-tight">
            আমাদের ভবিষ্যৎ পরিকল্পনা
          </h2>

        </div>

        {/* Compact 3-Card Roadmap with Desktop & Mobile Connecting Lines */}
        <div className="relative max-w-5xl mx-auto">
          {/* Subtle Horizontal Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-sky-200/70 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {/* Card 01 */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between h-full group">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 font-black text-xs flex items-center justify-center border border-sky-100/90 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                  01
                </span>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-900 tracking-tight">
                  Local Foundation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                চুয়াডাঙ্গায় হাসপাতাল, ডাক্তার, রক্তদাতা ও জরুরি স্বাস্থ্যসেবার তথ্যকে আরও সুসংগঠিত করা।
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between h-full group">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 font-black text-xs flex items-center justify-center border border-sky-100/90 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                  02
                </span>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-900 tracking-tight">
                  Digital Expansion
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                অ্যাপয়েন্টমেন্ট, উন্নত অনুসন্ধান ও আরও কার্যকর ডিজিটাল স্বাস্থ্যসেবা যুক্ত করা।
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between h-full group">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 font-black text-xs flex items-center justify-center border border-sky-100/90 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                  03
                </span>
                <h3 className="text-base sm:text-lg font-black text-nuvicaNavy-900 tracking-tight">
                  Future Growth
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                সফলভাবে চুয়াডাঙ্গায় ভিত্তি গড়ে তুলে ভবিষ্যতে অন্যান্য জেলায় CD Doctors সম্প্রসারণের সুযোগ তৈরি করা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 16 — OUR PRINCIPLES
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-black">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>মূলনীতি</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-nuvicaNavy-900 tracking-tight">
            আমাদের মূল মূল্যবোধ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900">সহজলভ্যতা</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              প্রযুক্তিকে ব্যবহার করে জটিল ও ছড়িয়ে থাকা স্বাস্থ্যসেবার তথ্যকে প্রতিটি মানুষের হাতের নাগালে এনে দেওয়া।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900">মানুষের প্রয়োজনকে অগ্রাধিকার</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              রোগী, স্বজন ও রক্তদাতাদের চাহিদাকে বিবেচনায় রেখে সব সেবা ডিজাইন করা।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900">দায়িত্বশীলতা</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              তথ্যের বস্তুনিষ্ঠতা বজায় রাখা এবং দায়িত্বশীলভাবে তথ্য প্রচার করা।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-nuvicaNavy-900">প্রযুক্তির সঠিক ব্যবহার</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              আধুনিক ডিজিটাল ফ্রেমওয়ার্কের মাধ্যমে চুয়াডাঙ্গার হেলথকেয়ার ইকোসিস্টেমকে গতিশীল রাখা।
            </p>
          </div>
        </div>
      </section>



      {/* ==================================================
          SECTION 19 — CONTACT
          ================================================== */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-nuvica space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-black">
              <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
              <span>যোগাযোগ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-nuvicaNavy-900 tracking-tight">
              যোগাযোগ করুন
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-700 font-medium">
            {/* Platform Info */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-nuvicaNavy-900">Platform</h3>
                  <p className="text-slate-500">CD Doctors</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <p><strong>Founder:</strong> Mukset Al Kanon</p>
                <p><strong>Location:</strong> Chuadanga, Bangladesh</p>
              </div>
            </div>

            {/* Helpline & Email */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-nuvicaNavy-900">Phone & Email</h3>
                  <p className="text-slate-500">Support Hotline</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-600" /> +880 761-62588</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-600" /> support@cddoctors.com</p>
              </div>
            </div>

            {/* Web & Social */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-nuvicaNavy-900">Digital Platforms</h3>
                  <p className="text-slate-500">Online Handles</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <p><strong>Website:</strong> www.cddoctors.com</p>
                <p><strong>Facebook:</strong> facebook.com/cddoctors</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
