import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'CD Doctors AI সম্পূর্ণ টেক্সট-ভিত্তিক হেলথকেয়ার ইনফরমেশন অ্যাসিস্ট্যান্ট হিসেবে পরিচালিত হচ্ছে। ইমেজ প্রসেসিং সুবিধাটি বর্তমানে নিষ্ক্রিয় রয়েছে।',
    },
    { status: 410 }
  );
}
