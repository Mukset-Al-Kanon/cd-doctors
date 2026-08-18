/**
 * CD Doctors Official Knowledge Base Repository (RAG Knowledge Source)
 * Contains verified public facts about the CD Doctors platform, founder, mission, services, roadmap, and contact details.
 */

export interface PlatformKnowledgeItem {
  id: string;
  topic: string;
  keywords: string[];
  contentBn: string;
  contentEn: string;
}

export const CD_DOCTORS_PLATFORM_KNOWLEDGE: PlatformKnowledgeItem[] = [
  {
    id: 'info-1',
    topic: 'About CD Doctors',
    keywords: ['cd doctors', 'platform', 'কি', 'কী', 'website', 'ওয়েবসাইট', 'সার্ভিস', 'about'],
    contentBn:
      'CD Doctors হলো চুয়াডাঙ্গাভিত্তিক একটি Digital Healthcare Information Platform। এখানে চুয়াডাঙ্গা জেলার স্থানীয় হাসপাতাল, ক্লিনিক, বিশেষজ্ঞ ডাক্তার, রক্তদাতা (Blood Donors) এবং জরুরি স্বাস্থ্যসেবার তথ্য সহজে খুঁজে পাওয়া যায়।',
    contentEn:
      'CD Doctors is a digital healthcare discovery platform for Chuadanga, Bangladesh. It provides structured access to local hospitals, specialist doctors, blood donors, and 24/7 emergency services.',
  },
  {
    id: 'info-2',
    topic: 'Founder & Leadership',
    keywords: ['founder', 'creator', 'who created', 'who built', 'কে তৈরি করেছে', 'মালিক', 'তৈরি', 'mukset', 'kanon', 'মুকসেত'],
    contentBn:
      'CD Doctors-এর Founder হলেন Mukset Al Kanon। তিনি চুয়াডাঙ্গার স্বাস্থ্যসেবার তথ্যসমূহকে প্রযুক্তির সাহায্যে আরও সুসংগঠিত, সহজলভ্য এবং ডিজিটালভাবে সংযুক্ত করার লক্ষ্যে এই প্ল্যাটফর্মটি প্রতিষ্ঠা করেছেন।',
    contentEn:
      'The Founder of CD Doctors is Mukset Al Kanon. He initiated CD Doctors to centralize and digitalize healthcare information across Chuadanga, Bangladesh.',
  },
  {
    id: 'info-3',
    topic: 'Mission & Vision',
    keywords: ['mission', 'vision', 'লক্ষ্য', 'উদ্দেশ্য', 'কেন তৈরি', 'purpose'],
    contentBn:
      'CD Doctors-এর মূল লক্ষ্য হলো চুয়াডাঙ্গার সাধারণ মানুষ যেন জরুরি মুহূর্তে একটি নির্দিষ্ট ডিজিটাল প্ল্যাটফর্ম থেকে সঠিক হাসপাতাল, উপযুক্ত বিশেষজ্ঞ ডাক্তার, রক্তদাতা এবং এ্যাম্বুলেন্সের তথ্য সহজে খুঁজে পান।',
    contentEn:
      'The mission of CD Doctors is to empower residents of Chuadanga with fast, reliable, and verified healthcare information from a single digital hub.',
  },
  {
    id: 'info-4',
    topic: 'Services Provided',
    keywords: ['service', 'services', 'সেবা', 'সুবিধা', 'কি কি সেবা'],
    contentBn:
      'CD Doctors-এ চারটি মূল সেবা পাওয়া যায়:\n১. হাসপাতাল ও ক্লিনিক ডিরেক্টরি (ICU ও Emergency সহ)\n২. বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিডিউল ডিরেক্টরি\n৩. যাচাইকৃত রক্তদাতা (Blood Donor) নেটওয়ার্ক\n৪. ২৪/৭ জরুরি এ্যাম্বুলেন্স ও হাসপাতাল হেল্পলাইন',
    contentEn:
      'CD Doctors provides 4 main services:\n1. Hospital & Clinic Directory (including ICU & Emergency)\n2. Specialist Doctor Directory & Chamber Schedules\n3. Verified Blood Donor Network\n4. 24/7 Emergency Helplines & Ambulance Services',
  },
  {
    id: 'info-5',
    topic: 'Future Roadmap & Expansion',
    keywords: ['roadmap', 'পরিকল্পনা', 'ভবিষ্যৎ', 'expansion', 'growth'],
    contentBn:
      'আমাদের ভবিষ্যৎ পরিকল্পনা তিনটি ধাপে বিভক্ত:\n১. চুয়াডাঙ্গা স্থানীয় ভিত্তি শক্তিশালী করা\n২. ডিজিটাল অ্যাপয়েন্টমেন্ট ও অ্যাডভান্সড সার্চ যুক্ত করা\n৩. চুয়াডাঙ্গার সাফল্যের ওপর ভিত্তি করে সারাদেশে সেবা সম্প্রসারণ করা',
    contentEn:
      'Future roadmap:\n1. Strengthen local Chuadanga healthcare foundation\n2. Introduce digital appointments and enhanced search\n3. Expand to other districts across Bangladesh.',
  },
  {
    id: 'info-6',
    topic: 'Contact & Support Information',
    keywords: ['contact', 'phone', 'email', 'যোগাযোগ', 'ফোন', 'ইমেইল', 'ঠিকানা', 'address', 'helpline', 'যোগাযোগ করব'],
    contentBn:
      'CD Doctors-এর সাথে যোগাযোগের মাধ্যমসমূহ:\n• হটলাইন: +880 761-62588\n• ইমেইল: support@cddoctors.com\n• ওয়েবসাইট: www.cddoctors.com\n• ফেসবুক: facebook.com/cddoctors\n• ঠিকানা: চুয়াডাঙ্গা, বাংলাদেশ।',
    contentEn:
      'Contact Information:\n• Hotline: +880 761-62588\n• Email: support@cddoctors.com\n• Website: www.cddoctors.com\n• Facebook: facebook.com/cddoctors\n• Location: Chuadanga, Bangladesh.',
  },
];

/**
 * Retrieve relevant platform knowledge by query matching
 */
export function getPlatformKnowledge(query: string): string {
  const q = query.toLowerCase().trim();

  const matched = CD_DOCTORS_PLATFORM_KNOWLEDGE.filter((item) =>
    item.keywords.some((kw) => q.includes(kw))
  );

  if (matched.length > 0) {
    return matched.map((m) => `[${m.topic}]: ${m.contentBn}`).join('\n\n');
  }

  // Default summary if general platform query
  return CD_DOCTORS_PLATFORM_KNOWLEDGE.map((m) => `[${m.topic}]: ${m.contentBn}`).join('\n\n');
}
