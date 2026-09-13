import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CURATED_HEALTH_TIPS = [
  {
    id: 'tip-1',
    category: 'EYE_CARE',
    categoryBn: 'চোখের যত্ন',
    title: '২০-২০-২০ নিয়ম মেনে চলুন',
    tipBn: 'মোবাইল বা কম্পিউটারে কাজের সময় প্রতি ২০ মিনিট পর পর ২০ ফুট দূরের কোনো বস্তুর দিকে অন্তত ২০ সেকেন্ড তাকিয়ে থাকুন। এটি চোখের ড্রাইনেস ও স্ক্রিন স্ট্রেন রোধ করে।',
    icon: 'Eye',
    actionText: 'নিয়মটি মেনে চলব',
  },
  {
    id: 'tip-2',
    category: 'NUTRITION',
    categoryBn: 'পুষ্টি ও খাবার',
    title: 'খাবারের পর হালকা হাঁটা',
    tipBn: 'দুপুর বা রাতের ভারী খাবারের পরপরই শুয়ে না পড়ে অন্তত ১০-১৫ মিনিট ধীরেসুস্থে হাঁটুন। এটি রক্তে গ্লুকোজ স্পাইক নিয়ন্ত্রণ করে এবং বুক জ্বালাপোড়া ও এসিডিটি কমায়।',
    icon: 'Apple',
    actionText: 'অভ্যাস তৈরি করব',
  },
  {
    id: 'tip-3',
    category: 'SEASONAL',
    categoryBn: 'মৌসুমি সতর্কতা',
    title: 'জ্বর হলে প্যারাসিটামল ছাড়া অন্য ব্যথানাশক নয়',
    tipBn: 'বর্ষা মৌসুমে জ্বর হলে ডাক্তারের পরামর্শ ছাড়া ভুলেও অ্যাসপিরিন বা আইবুপ্রোফেন জাতীয় ব্যথানাশক খাবেন না। প্রচুর তরল, স্যালাইন ও ডাবের পানি পান করুন এবং সিবিসি টেস্ট করান।',
    icon: 'ShieldAlert',
    actionText: 'বুঝেছি ও সতর্ক থাকব',
  },
  {
    id: 'tip-4',
    category: 'HEART',
    categoryBn: 'হৃদরোগ ও রক্তচাপ',
    title: 'লবণের মাত্রা নিয়ন্ত্রণ',
    tipBn: 'খাবারের সাথে বাড়তি কাঁচা লবণ খাওয়া পরিহার করুন। অতিরিক্ত সোডিয়াম রক্তনালীতে চাপ ফেলে রক্তচাপ (Blood Pressure) বাড়িয়ে দেয়।',
    icon: 'Heart',
    actionText: 'কাঁচা লবণ বর্জন করব',
  },
  {
    id: 'tip-5',
    category: 'MENTAL_HEALTH',
    categoryBn: 'মানসিক প্রশান্তি ও ঘুম',
    title: 'ঘুমানোর ৩০ মিনিট আগে স্ক্রিন অফ',
    tipBn: 'রাতে ঘুমানোর অন্তত আধা ঘণ্টা আগে মোবাইল ফোন ও ল্যাপটপের নীল আলো এড়িয়ে চলুন। এটি মস্তিষ্কে মেলাটোনিন হরমোন নিঃসরণ বাড়িয়ে গভীর ও আরামদায়ক ঘুম নিশ্চিত করে।',
    icon: 'Moon',
    actionText: 'আজ থেকেই চেষ্টা করব',
  },
  {
    id: 'tip-6',
    category: 'DIABETES',
    categoryBn: 'ডায়াবেটিস সচেতনতা',
    title: 'প্রতিদিনের আঁশযুক্ত খাবার',
    tipBn: 'শাকসবজি ও খোসাসহ ফলমূলে প্রচুর দ্রবণীয় ফাইবার থাকে যা রক্তে ধীরে ধীরে চিনি শোষিত হতে সাহায্য করে এবং দীর্ঘক্ষণ পেট ভরা রাখে।',
    icon: 'Activity',
    actionText: 'খাদ্যতালিকায় রাখব',
  },
];

export async function GET() {
  try {
    // Pick today's tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const todayTipIndex = dayOfYear % CURATED_HEALTH_TIPS.length;
    const todayTip = CURATED_HEALTH_TIPS[todayTipIndex];

    return NextResponse.json({
      success: true,
      todayTip,
      allTips: CURATED_HEALTH_TIPS,
    });
  } catch (error: any) {
    console.error('Error in health tips route:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch health tips' }, { status: 500 });
  }
}
