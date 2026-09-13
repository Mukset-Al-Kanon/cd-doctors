import React from 'react';
import { Metadata } from 'next';
import TelemedicineClientView from './TelemedicineClientView';

export const metadata: Metadata = {
  title: 'টেলিমেডিসিন | অনলাইন ভিডিও কনসালটেশন - CD Doctors',
  description: 'ঘরে বসেই দেশের সেরা বিশেষজ্ঞ চিকিৎসকদের সাথে সরাসরি ভিডিও কলে পরামর্শ নিন এবং ডিজিটাল প্রেসক্রিপশন সংগ্রহ করুন।',
};

export default function TelemedicinePage() {
  return <TelemedicineClientView />;
}
