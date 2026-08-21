import React from 'react';

export const metadata = {
  title: 'Privacy Policy | CD Doctors - HealthBD',
  description: 'Privacy policy and data protection terms for CD Doctors Chuadanga healthcare platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-6">গোপনীয়তা নীতি (Privacy Policy)</h1>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          <strong>CD Doctors (HealthBD)</strong> চুয়াডাঙ্গা জেলার রোগীদের নির্ভুল স্বাস্থ্যসেবা, বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল সংক্রান্ত তথ্য প্রদানে প্রতিশ্রুতিবদ্ধ। এই প্ল্যাটফর্ম ব্যবহারকারীদের তথ্যের সর্বোচ্চ গোপনীয়তা ও সুরক্ষা নিশ্চিত করে।
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">১. সংগৃহীত তথ্য</h2>
        <p className="text-slate-600 mb-4 leading-relaxed">
          আমরা কোনো অননুমোদিত ব্যক্তিগত তথ্য সংগ্রহ বা সংরক্ষণ করি না। ফেসবুক মেসেঞ্জার বা চ্যাটবটের মাধ্যমে শুধুমাত্র ব্যবহারকারীর পাঠানো স্বাস্থ্যবিষয়ক প্রশ্নাবলি তাৎক্ষণিক উত্তর প্রদানের কাজে ব্যবহৃত হয়।
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">২. তথ্যের ব্যবহার</h2>
        <p className="text-slate-600 mb-4 leading-relaxed">
          ব্যবহারকারীর বার্তা শুধুমাত্র সঠিক বিশেষজ্ঞ ডাক্তার, হাসপাতাল চেম্বার, সময়সূচি এবং সিরিয়াল নম্বর প্রদানের সুবিধার্থে স্বয়ংক্রিয়ভাবে প্রক্রিয়াজাত করা হয়। কোনো তথ্য তৃতীয় পক্ষের নিকট বিক্রয় বা হস্তান্তর করা হয় না।
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">৩. ইউজার ডেটা ডিলিশন (Data Deletion)</h2>
        <p className="text-slate-600 mb-4 leading-relaxed">
          ব্যবহারকারী যেকোনো সময় তাদের আলাপচারিতা মুছে ফেলার জন্য অনুরোধ জানাতে পারেন। ডেটা মুছে ফেলার জন্য আমাদের ফেসবুক পেজ অথবা সরাসরি অ্যাডমিনের সাথে যোগাযোগ করুন।
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">৪. যোগাযোগ</h2>
        <p className="text-slate-600 leading-relaxed">
          গোপনীয়তা নীতি সংক্রান্ত যেকোনো তথ্যের জন্য যোগাযোগ করুন:<br />
          ইমেইল: <strong>support@cddoctors.com</strong><br />
          ঠিকানা: চুয়াডাঙ্গা সদর, চুয়াডাঙ্গা, বাংলাদেশ।
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          সর্বশেষ হালনাগাদ: আগস্ট ২০২৬ | CD Doctors - HealthBD
        </div>
      </div>
    </div>
  );
}
