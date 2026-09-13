export interface AmbulanceItem {
  id: string;
  name: string;
  type: 'ICU' | 'AC' | 'NON_AC' | 'FREEZER';
  typeNameBn: string;
  district: string;
  upazila: string;
  locationDetails: string;
  driverName: string;
  driverPhone: string;
  regNumber: string;
  vehicleModel: string;
  isAvailable: boolean;
  facilities: string[];
  approxFare: string;
  rating?: number;
  totalTrips?: number;
}

export const STATIC_AMBULANCES: AmbulanceItem[] = [
  {
    id: 'amb-1',
    name: 'আল-শেফা আইসিইউ ও কার্ডিয়াক অ্যাম্বুলেন্স',
    type: 'ICU',
    typeNameBn: 'আইসিইউ লাইফ সাপোর্ট',
    district: 'চুয়াডাঙ্গা',
    upazila: 'চুয়াডাঙ্গা সদর',
    locationDetails: 'সদর হাসপাতাল গেট সংলগ্ন, চুয়াডাঙ্গা',
    driverName: 'মোঃ রফিকুল ইসলাম',
    driverPhone: '01712445566',
    regNumber: 'ঢাকা মেট্রো-ছ ১১-২৪১৮',
    vehicleModel: 'Toyota HiAce High Roof (ICU Setup)',
    isAvailable: true,
    facilities: ['সেন্ট্রাল ভেন্টিলেটর', 'কার্ডিয়াক মনিটর', 'হাই-ফ্লো অক্সিজেন', 'অভিজ্ঞ প্যারামেডিক'],
    approxFare: 'লোকাল: ৳১,৫০০ | ঢাকা/রাজশাহী: আলোচনা সাপেক্ষে',
    rating: 4.9,
    totalTrips: 184,
  },
  {
    id: 'amb-2',
    name: 'চুয়াডাঙ্গা রেড ক্রিসেন্ট এসি অ্যাম্বুলেন্স',
    type: 'AC',
    typeNameBn: 'এসি অ্যাম্বুলেন্স',
    district: 'চুয়াডাঙ্গা',
    upazila: 'চুয়াডাঙ্গা সদর',
    locationDetails: 'রেড ক্রিসেন্ট ইউনিট অফিস, কোর্ট রোড',
    driverName: 'মোঃ কামাল হোসেন',
    driverPhone: '01715889900',
    regNumber: 'কুষ্টিয়া-ছ ১২-০৯৫২',
    vehicleModel: 'Toyota HiAce AC',
    isAvailable: true,
    facilities: ['সেন্ট্রাল অক্সিজেন', 'ফোল্ডিং স্ট্রেচার', 'ফার্স্ট এইড কিট', 'এসি কেবিন'],
    approxFare: 'লোকাল: ৳১,২০০ | বিভাগীয় ট্রিপ: সরকারি রেট',
    rating: 4.8,
    totalTrips: 310,
  },
  {
    id: 'amb-3',
    name: 'আলমডাঙ্গা এক্সপ্রেস ফ্রিজার অ্যাম্বুলেন্স',
    type: 'FREEZER',
    typeNameBn: 'ফ্রিজিং (লাশবাহী)',
    district: 'চুয়াডাঙ্গা',
    upazila: 'আলমডাঙ্গা',
    locationDetails: 'আলমডাঙ্গা বাসস্ট্যান্ড মোড়, আলমডাঙ্গা',
    driverName: 'মোঃ শাহিন আলম',
    driverPhone: '01718223344',
    regNumber: 'ঢাকা মেট্রো-ছ ৭২-৩১৪০',
    vehicleModel: 'Freezer Van (Minus 20°C)',
    isAvailable: true,
    facilities: ['মাইনাস ২০° ফ্রিজিং চেম্বার', 'দূরপাল্লার পরিবহন', 'স্টেইনলেস স্টিল ট্রে'],
    approxFare: 'দূরত্ব অনুযায়ী কিলোমিটার রেট',
    rating: 4.9,
    totalTrips: 92,
  },
  {
    id: 'amb-4',
    name: 'জীবননগর সিটি এসি অ্যাম্বুলেন্স',
    type: 'AC',
    typeNameBn: 'এসি অ্যাম্বুলেন্স',
    district: 'চুয়াডাঙ্গা',
    upazila: 'জীবননগর',
    locationDetails: 'জীবননগর উপজেলা স্বাস্থ্য কমপ্লেক্স রোড',
    driverName: 'মোঃ তারেক রহমান',
    driverPhone: '01734112233',
    regNumber: 'খুলনা মেট্রো-ছ ১৪-২১২০',
    vehicleModel: 'Toyota Noah Super AC',
    isAvailable: true,
    facilities: ['সেন্ট্রাল অক্সিজেন', 'হুইলচেয়ার সাপোর্ট', 'নরমাল স্ট্রেচার', 'এসি সুবিধা'],
    approxFare: 'লোকাল: ৳১,০০০ | যশোর/কুষ্টিয়া: সাশ্রয়ী প্যাকেজ',
    rating: 4.7,
    totalTrips: 145,
  },
  {
    id: 'amb-5',
    name: 'দামুড়হুদা লাইফলাইন সাধারণ অ্যাম্বুলেন্স',
    type: 'NON_AC',
    typeNameBn: 'সাধারণ (নন-এসি)',
    district: 'চুয়াডাঙ্গা',
    upazila: 'দামুড়হুদা',
    locationDetails: 'দামুড়হুদা বাজার মোড়',
    driverName: 'মোঃ আনসার আলী',
    driverPhone: '01723556677',
    regNumber: 'চুয়াডাঙ্গা-ছ ১১-০৪০৫',
    vehicleModel: 'Microbus Patient Carrier',
    isAvailable: false,
    facilities: ['জরুরি অক্সিজেন সিলিন্ডার', 'ফোল্ডিং স্ট্রেচার', 'লোকাল ট্রিপ'],
    approxFare: 'লোকাল: ৳৮০০ - ৳১,০০০',
    rating: 4.6,
    totalTrips: 215,
  },
  {
    id: 'amb-6',
    name: 'সেন্ট্রাল ট্রমা কেয়ার হাইওয়ে আইসিইউ অ্যাম্বুলেন্স',
    type: 'ICU',
    typeNameBn: 'আইসিইউ লাইফ সাপোর্ট',
    district: 'চুয়াডাঙ্গা',
    upazila: 'চুয়াডাঙ্গা সদর',
    locationDetails: 'বড় বাজার ট্রাফিক মোড়, চুয়াডাঙ্গা',
    driverName: 'মোঃ সেলিম রেজা',
    driverPhone: '01745990011',
    regNumber: 'ঢাকা মেট্রো-ছ ৮৮-৫২০১',
    vehicleModel: 'Toyota Grand Cabin (Full ICU)',
    isAvailable: true,
    facilities: ['পোর্টেবল ভেন্টিলেটর', 'ডিফিব্রিলেটর', 'সাকশন মেশিন', 'মেডিকেল অফিসার/প্যারামেডিক'],
    approxFare: 'জরুরি ক্রিটিক্যাল ট্রিপ (ঢাকা/রাজশাহী/খুলনা)',
    rating: 5.0,
    totalTrips: 128,
  }
];

export const NATIONAL_HOTLINES = [
  {
    id: 'nat-1',
    name: '৯৯৯ (জাতীয় জরুরি সেবা)',
    phone: '999',
    badge: 'টোল-ফ্রি ২৪/৭',
    desc: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস',
    type: 'national',
  },
  {
    id: 'nat-2',
    name: 'সদর হাসপাতাল জরুরি বিভাগ',
    phone: '01712345678',
    badge: 'চুয়াডাঙ্গা সদর',
    desc: '২৪ ঘণ্টা ইমার্জেন্সি ও ট্রমা ভর্তি',
    type: 'hospital',
  },
  {
    id: 'nat-3',
    name: 'ফায়ার ও রেসকিউ সার্ভিস',
    phone: '01711223344',
    badge: 'ফায়ার ইউনিট',
    desc: 'অগ্নিনির্বাপণ ও উদ্ধার তৎপরতা',
    type: 'fire',
  },
  {
    id: 'nat-4',
    name: 'কেন্দ্রীয় ব্লাড ব্যাংক',
    phone: '01711998800',
    badge: 'রক্তদান হটলাইন',
    desc: 'জরুরি রক্তদাতা ও ট্রান্সফিউশন',
    type: 'blood',
  },
];
