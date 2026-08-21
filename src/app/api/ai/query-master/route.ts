import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CD_DOCTORS_PLATFORM_KNOWLEDGE } from '@/lib/platformKnowledge';
import { FALLBACK_DONORS, FALLBACK_DOCTORS, FALLBACK_HOSPITALS } from '@/lib/staticHospitalData';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Live real-time data always

const DEFAULT_N8N_API_KEY = process.env.N8N_API_KEY || 'cddoctors_n8n_sec_key_2026';

const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const DAY_SHORT_BN = ['রবি', 'সোম', 'মঙ্গ', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

// Exhaustive Bilingual (Bangla, Banglish, English) Symptom & Keyword to Specialty Map
const SYMPTOM_SPECIALTY_MAP: Record<string, string[]> = {
  orthopedics: [
    'মাজা', 'মাজায়', 'কোমর', 'কোমরে', 'হাড়ের', 'হাড়ভাঙা', 'হাড় ভাঙা',
    'মচকে', 'হাঁটু', 'পিঠ', 'ঘাড়', 'মেরুদণ্ড', 'পেইন', 'স্পাইন', 'হাড়জোড়', 'বাত',
    'majai', 'maja', 'komor', 'komore', 'harer', 'har vanga', 'har betha',
    'spine', 'back pain', 'lumbar', 'bone', 'joint', 'fracture',
    'ortho', 'orthopedic', 'knee pain', 'sciatica', 'plid'
  ],
  cardiology: [
    'বুক', 'বুকে', 'বুক ধড়ফড়', 'হার্ট', 'হৃদরোগ', 'প্রেসার', 'উচ্চ রক্তচাপ', 'রক্তচাপ', 'হার্ট অ্যাটাক',
    'buk', 'buke', 'dhorphor', 'heart', 'chest pain',
    'cardiac', 'hypertension', 'ecg', 'high pressure', 'bp', 'cardiologist', 'heart attack'
  ],
  pediatrics: [
    'শিশু', 'বাচ্চা', 'বাচ্চার', 'বাচ্চাদের', 'পোলাপান', 'নবজাতক', 'শিশুর জ্বর', 'শিশুর কাশি', 'টিকা', 'ছোট বাচ্চা',
    'shishu', 'bacha', 'bachar', 'bachader', 'baccader', 'baccha', 'child', 'pediatric',
    'baby', 'infant', 'newborn', 'pedia', 'pediatrician'
  ],
  gynecology: [
    'প্রসূতি', 'গর্ভবতী', 'স্ত্রী রোগ', 'মেয়েদের', 'মাসিক', 'গর্ভকালীন', 'ইনফার্টিলিটি', 'বন্ধ্যাত্ব', 'জরায়ু', 'ডেলিভারি',
    'meyeder', 'gorvoboti', 'masik', 'gynae', 'pregnancy', 'obstetrics',
    'uterus', 'period', 'infertility', 'preg', 'pregnant', 'gynecologist', 'maternity'
  ],
  dermatology: [
    'চর্ম', 'এলার্জি', 'চুলকানি', 'দাদ', 'ব্রণ', 'মেছতা', 'চুল পড়া', 'ত্বক', 'চামড়া', 'ঘামাচি',
    'chul pora', 'chulkani', 'dad', 'skin', 'derma', 'allergy', 'rash', 'eczema',
    'acne', 'laser', 'alergy', 'dermatologist'
  ],
  neurology: [
    'মাথাব্যথা', 'মাথা ঘোরা', 'স্ট্রোক', 'প্যারালাইসিস', 'মৃগীরোগ', 'হাত পা কাঁপা', 'নিউরো', 'জ্ঞান হারানো',
    'matha', 'mathai', 'neuro', 'brain', 'stroke', 'headache',
    'migraine', 'epilepsy', 'paralysis', 'neurologist'
  ],
  gastroenterology: [
    'পেট', 'পেটে', 'গ্যাস্ট্রিক', 'হজম', 'লিভার', 'জন্ডিস', 'বমি', 'আলসার', 'ডায়রিয়া', 'পায়খানা', 'কোষ্ঠকাঠিন্য',
    'pet', 'pete', 'gas', 'gastric', 'liver', 'stomach', 'endoscopy',
    'ulcer', 'jaundice', 'acidity', 'gastro', 'gastroenterologist', 'ibs'
  ],
  diabetes: [
    'ডায়াবেটিস', 'চিনি', 'সুগার', 'হরমোন', 'থাইরয়েড', 'অতিরিক্ত প্রস্রাব',
    'diabetes', 'hormone', 'sugar', 'thyroid', 'insulin', 'shugar', 'daibetes', 'endocrinology'
  ],
  ent: [
    'নাক', 'কান', 'গলা', 'টনসিল', 'কানে কম শোনা', 'নাক বন্ধ', 'নাক দিয়ে রক্ত',
    'nak', 'kaner', 'golar', 'ent', 'ear', 'nose', 'throat', 'tonsil'
  ],
  ophthalmology: [
    'চোখ', 'চোখে', 'ছানি', 'চোখ লাল', 'চোখ দিয়ে জল পড়া', 'চশমা',
    'chokh', 'chokhe', 'eye', 'vision', 'cataract', 'glasses', 'ophthalmology'
  ],
  urology: [
    'কিডনি পাথর', 'প্রস্রাবে জ্বালাপোড়া', 'প্রস্টেট', 'মূত্রনালী', 'কিডনি',
    'kidney', 'kidney stone', 'urology', 'urinary', 'prostate', 'peshab', 'nephrology'
  ],
  medicine: [
    'জ্বর', 'কাশি', 'দুর্বলতা', 'ঠান্ডা', 'টাইফয়েড', 'শরীর ব্যথা',
    'medicine', 'fever', 'general physician', 'cold', 'weakness', 'jor', 'shoril betha'
  ],
  surgery: [
    'অপারেশন', 'সার্জারি', 'টিউমার', 'অ্যাপেন্ডিসাইটিস', 'হার্নিয়া', 'হাইড্রোসিল', 'পাইলস', 'ফিস্টুলা',
    'surgery', 'laparoscopy', 'operation', 'hernia', 'appendix', 'piles', 'surgeon'
  ],
  dental: [
    'দাঁত', 'দাঁতে', 'মাড়ি', 'রুট ক্যানেল', 'স্কেলিং', 'দাঁত তোলা',
    'dant', 'dante', 'dental', 'teeth', 'tooth', 'gums', 'dentist'
  ],
  pulmonology: [
    'শ্বাসকষ্ট', 'অ্যাজমা', 'হাঁপানি', 'বক্ষব্যাধি', 'যক্ষ্মা', 'ফুসফুস',
    'kashi', 'shash', 'shashkosto', 'asthma', 'chest medicine', 'respiratory', 'lungs', 'tb', 'copd'
  ],
};

const STOP_WORDS = new Set([
  'amar', 'ki', 'korbo', 'er', 'ami', 'hobe', 'lagbe', 'kothai', 'karo', 'kache', 'bhalo', 'valo',
  'ache', 'achhe', 'dekhte', 'dekhabo', 'chai', 'dorkar', 'bolun', 'janan', 'doctor', 'doctorer',
  'আমার', 'কী', 'কি', 'করব', 'করবো', 'দরকার', 'লাগবে', 'আছে', 'কোথায়', 'কাছে', 'ভালো', 'কে', 'দেখান', 'ডাক্তার'
]);

function authenticateRequest(req: Request): boolean {
  const url = new URL(req.url);
  const apiKeyHeader = req.headers.get('x-api-key') || req.headers.get('X-API-KEY');
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const queryApiKey = url.searchParams.get('apiKey') || url.searchParams.get('api_key') || url.searchParams.get('key');

  const providedKey =
    apiKeyHeader ||
    queryApiKey ||
    (authHeader?.startsWith('Bearer ') ? authHeader.replace(/^Bearer\s+/i, '').trim() : null);

  if (!providedKey) return false;
  return providedKey === DEFAULT_N8N_API_KEY;
}

// Master Query Processor for All Website Data
async function processUniversalQuery(params: {
  query?: string;
  category?: 'all' | 'doctors' | 'hospitals' | 'blood' | 'emergency' | 'tests' | 'platform';
  bloodGroup?: string;
  area?: string;
  limit?: number;
}) {
  const rawQuery = (params.query || '').trim();
  const queryLower = rawQuery.toLowerCase();
  const category = params.category || 'all';
  const limit = params.limit ? Math.min(10, Math.max(1, Number(params.limit))) : 2;

  // Determine intent triggers
  const isBloodQuery =
    category === 'blood' ||
    ['রক্ত', 'ব্লাড', 'blood', 'ডোনার', 'donor', 'o+', 'a+', 'b+', 'ab+', 'o-', 'a-', 'b-', 'ab-'].some((k) =>
      queryLower.includes(k)
    );

  const isEmergencyQuery =
    category === 'emergency' ||
    ['জরুরি', 'অ্যাম্বুলেন্স', 'ambulance', 'ফায়ার', 'fire', 'পুলিশ', 'police', '999', 'helpline', 'ইমার্জেন্সি'].some((k) =>
      queryLower.includes(k)
    );

  const isHospitalQuery =
    category === 'hospitals' ||
    ['হাসপাতাল', 'hospital', 'ক্লিনিক', 'clinic', 'evercare', 'মেডিকেল সেন্টার', 'specialized', 'সদর হাসপাতাল', 'ডায়াগনস্টিক'].some((k) =>
      queryLower.includes(k)
    );

  const isTestQuery =
    category === 'tests' ||
    ['টেস্ট', 'পরীক্ষা', 'test', 'cbc', 'x-ray', 'ecg', 'echo', 'usg', 'আল্ট্রা', 'hba1c', 'ক্রিয়েটিনিন', 'লিপিড', 'দাম'].some((k) =>
      queryLower.includes(k)
    );

  const isPlatformQuery =
    category === 'platform' ||
    ['ওয়েবসাইট', 'মালিক', 'founder', 'mukset', 'kanon', 'মুকসেত', 'about', 'সম্পর্কে', 'উদ্দেশ্য', 'যোগাযোগ', 'সার্ভিস'].some((k) =>
      queryLower.includes(k)
    );

// Doctor Name Bilingual (Bengali & English) Transliteration Map
const DOCTOR_NAME_ALIASES: Array<{ nameEn: string; aliases: string[] }> = [
  {
    nameEn: 'Dr. Mahbubur Rahman Chowdhury',
    aliases: ['mahbubur', 'mahbub', 'মাহবুবুর', 'মাহবুব', 'mahbubur rahman', 'chowdhury', 'চৌধুরী'],
  },
  {
    nameEn: 'Dr. Selina Parveen',
    aliases: ['selina', 'parveen', 'parvin', 'সেলিনা', 'পারভীন', 'পারভিন', 'selina parveen'],
  },
  {
    nameEn: 'Dr. Kazi Ariful Haque',
    aliases: ['kazi ariful', 'ariful', 'haque', 'কাজী আরিফুল', 'আরিফুল', 'আরিফুল হক', 'হক'],
  },
  {
    nameEn: 'Dr. Nuzhat Fatema',
    aliases: ['nuzhat', 'fatema', 'নুজহাত', 'ফাতেমা', 'নুজহাত ফাতেমা'],
  },
  {
    nameEn: 'Dr. Towhidul Islam',
    aliases: ['towhidul', 'tauhidul', 'তৌহিদুল', 'তৌহিদ', 'তৌহিদুল ইসলাম'],
  },
  {
    nameEn: 'Dr. Sharmeen Sultana',
    aliases: ['sharmeen', 'sharmin', 'sultana', 'শারমীন', 'শারমিন', 'শারমিন সুলতানা'],
  },
  {
    nameEn: 'Dr. Md. Rafiqul Islam',
    aliases: ['rafiqul', 'rafiq', 'রফিকুল', 'রফিক', 'রফিকুল ইসলাম'],
  },
  {
    nameEn: 'Dr. Farida Yasmin',
    aliases: ['farida', 'yasmin', 'ফরিদা', 'ইয়াসমিন', 'ফরিদা ইয়াসমিন'],
  },
  {
    nameEn: 'Dr. A.H.M. Kamal Hossain',
    aliases: ['kamal', 'kamal hossain', 'কামাল', 'কামাল হোসেন'],
  },
  {
    nameEn: 'Dr. Nazmul Huda',
    aliases: ['nazmul', 'huda', 'নাজমুল', 'হুদা', 'নাজমুল হুদা'],
  },
  {
    nameEn: 'Dr. Syeda Rawnak Jahan',
    aliases: ['rawnak', 'jahan', 'রওনক', 'জাহান', 'রওনক জাহান', 'সৈয়দা রওনক জাহান'],
  },
  {
    nameEn: 'Dr. Md. Moniruzzaman',
    aliases: ['moniruzzaman', 'monir', 'মনিরুজ্জামান', 'মনির'],
  },
  {
    nameEn: 'Dr. Sheikh Asaduzzaman',
    aliases: ['asaduzzaman', 'asad', 'আসাদুজ্জামান', 'আসাদ', 'শেখ আসাদুজ্জামান'],
  },
  {
    nameEn: 'Dr. Afroza Begum',
    aliases: ['afroza', 'begum', 'আফরোজা', 'বেগম', 'আফরোজা বেগম'],
  },
  {
    nameEn: 'Dr. Md. Zakir Hossain',
    aliases: ['zakir', 'zakir hossain', 'জাকির', 'জাকির হোসেন'],
  },
  {
    nameEn: 'Dr. Rehana Chowdhury',
    aliases: ['rehana', 'রেহানা', 'রেহানা চৌধুরী'],
  },
  {
    nameEn: 'Dr. Md. Enamul Kabir',
    aliases: ['enamul', 'kabir', 'এনামুল', 'কবির', 'এনামুল কবির'],
  },
  {
    nameEn: 'Dr. Shahriar Ahmed',
    aliases: ['shahriar', 'ahmed', 'শাহরিয়ার', 'আহমেদ', 'শাহরিয়ার আহমেদ'],
  },
  {
    nameEn: 'Dr. Md. Motiur Rahman',
    aliases: [
      'motiur', 'matiur', 'motior', 'motiur rahman', 'matiur rahman',
      'মতিউর', 'মসিউর', 'মতিউর রহমান', 'মতিউর ডাক্তার', 'ডা. মতিউর', 'ডা মতিউর', 'ডাক্তার মতিউর'
    ],
  },
  {
    nameEn: 'Dr. Tahmina Akter',
    aliases: ['tahmina', 'তাহমিনা', 'তাহমিনা আক্তার'],
  },
  {
    nameEn: 'Dr. Md. Saiful Islam',
    aliases: ['saiful', 'saiful islam', 'সাইফুল', 'সাইফুল ইসলাম'],
  },
  {
    nameEn: 'Dr. Golam Sarwar',
    aliases: ['golam', 'sarwar', 'গোলাম', 'সারওয়ার', 'গোলাম সারওয়ার'],
  },
  {
    nameEn: 'Dr. Rumana Parvin',
    aliases: ['rumana', 'parvin', 'রুমানা', 'পারভিন', 'রুমানা পারভিন'],
  },
  {
    nameEn: 'Dr. Md. Imran Hossain',
    aliases: ['imran', 'imran hossain', 'ইমরান', 'ইমরান হোসেন'],
  },
  {
    nameEn: 'Dr. A.K.M. Fazlul Haque',
    aliases: ['fazlul', 'fazlul haque', 'ফজলুল', 'ফজলুল হক'],
  },
  {
    nameEn: 'Dr. Sayeeda Sultana',
    aliases: ['sayeeda', 'সাঈদা', 'সায়িদা', 'সাঈদা সুলতানা'],
  },
  {
    nameEn: 'Dr. Md. Tariq Hasan',
    aliases: ['tariq', 'hasan', 'তারেক', 'তারিক', 'তারিক হাসান'],
  },
  {
    nameEn: 'Dr. Nazma Akter',
    aliases: ['nazma', 'nazma akter', 'নাজমা', 'নাজমা আক্তার'],
  },
  {
    nameEn: 'Dr. Md. Babul Akhter',
    aliases: ['babul', 'babul akhter', 'বাবুল', 'বাবুল আক্তার'],
  },
  {
    nameEn: 'Dr. Fahmida Rahman',
    aliases: ['fahmida', 'fahmida rahman', 'ফাহমিদা', 'ফাহমিদা রহমান'],
  },
];

  // 1. Detect specific doctor by exact name or alias (Bengali/English)
  const matchedDoctorNames: string[] = [];
  for (const doc of DOCTOR_NAME_ALIASES) {
    if (doc.aliases.some((alias) => queryLower.includes(alias.toLowerCase()))) {
      matchedDoctorNames.push(doc.nameEn);
    }
  }

  // 2. Detect medical departments from symptom dictionary
  const detectedSpecialties: string[] = [];
  for (const [deptKey, keywords] of Object.entries(SYMPTOM_SPECIALTY_MAP)) {
    if (keywords.some((kw) => queryLower.includes(kw.toLowerCase()))) {
      detectedSpecialties.push(deptKey);
    }
  }

  // Tokenize query words without stopwords
  const tokens = queryLower
    .split(/[\s,.-]+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const doctorSearchOr: any[] = [];

  // Priority 1: Exact matched doctor names
  if (matchedDoctorNames.length > 0) {
    for (const exactName of matchedDoctorNames) {
      doctorSearchOr.push({ name: exactName });
    }
  } else if (detectedSpecialties.length > 0) {
    // Priority 2: Specific medical specialty detected
    for (const dept of detectedSpecialties) {
      doctorSearchOr.push(
        { specialization: { contains: dept } },
        { department: { nameEn: { contains: dept } } },
        { department: { nameBn: { contains: dept } } }
      );
      if (dept === 'orthopedics') {
        doctorSearchOr.push(
          { specialization: { contains: 'Ortho' } },
          { specialization: { contains: 'Spine' } },
          { department: { nameEn: { contains: 'Ortho' } } },
          { department: { nameEn: { contains: 'Spine' } } },
          { department: { nameBn: { contains: 'অর্থোপেডিক্স' } } },
          { department: { nameBn: { contains: 'স্পাইন' } } },
          { department: { nameBn: { contains: 'হাড়জোড়' } } }
        );
      } else if (dept === 'cardiology') {
        doctorSearchOr.push(
          { specialization: { contains: 'Cardio' } },
          { department: { nameEn: { contains: 'Cardio' } } },
          { department: { nameBn: { contains: 'কার্ডিওলজি' } } },
          { department: { nameBn: { contains: 'হৃদরোগ' } } }
        );
      } else if (dept === 'pediatrics') {
        doctorSearchOr.push(
          { specialization: { contains: 'Pediatric' } },
          { specialization: { contains: 'Child' } },
          { department: { nameEn: { contains: 'Pediatric' } } },
          { department: { nameBn: { contains: 'শিশু' } } }
        );
      } else if (dept === 'gynecology') {
        doctorSearchOr.push(
          { specialization: { contains: 'Gynae' } },
          { specialization: { contains: 'Gynecol' } },
          { department: { nameEn: { contains: 'Gynecol' } } },
          { department: { nameBn: { contains: 'স্ত্রী' } } },
          { department: { nameBn: { contains: 'প্রসূতি' } } }
        );
      }
    }
  } else if (tokens.length > 0) {
    // Priority 3: Search by individual token words
    for (const token of tokens) {
      doctorSearchOr.push(
        { name: { contains: token } },
        { specialization: { contains: token } },
        { degrees: { contains: token } },
        { bio: { contains: token } },
        { treatedDiseases: { contains: token } },
        { department: { nameEn: { contains: token } } },
        { department: { nameBn: { contains: token } } },
        { hospital: { name: { contains: token } } }
      );
    }
  } else if (rawQuery) {
    doctorSearchOr.push(
      { name: { contains: rawQuery } },
      { specialization: { contains: rawQuery } },
      { department: { nameEn: { contains: rawQuery } } },
      { department: { nameBn: { contains: rawQuery } } }
    );
  }

  // Fetch doctors matching the specific criteria
  let doctors = await db.doctor.findMany({
    where: {
      status: 'ACTIVE',
      ...(doctorSearchOr.length > 0 ? { OR: doctorSearchOr } : {}),
    },
    include: {
      hospital: {
        select: { name: true, address: true, phone: true, emergencyPhone: true },
      },
      department: { select: { nameBn: true, nameEn: true } },
      schedules: {
        select: { dayOfWeek: true, startTime: true, endTime: true },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
    orderBy: { experienceYears: 'desc' },
    take: limit,
  });

  // If still 0 doctors and this wasn't a symptom query (e.g. general platform query), fetch top general doctors
  if (doctors.length === 0 && !detectedSpecialties.length && !isBloodQuery && !isEmergencyQuery && !isTestQuery) {
    doctors = await db.doctor.findMany({
      where: { status: 'ACTIVE' },
      include: {
        hospital: { select: { name: true, address: true, phone: true, emergencyPhone: true } },
        department: { select: { nameBn: true, nameEn: true } },
        schedules: { select: { dayOfWeek: true, startTime: true, endTime: true }, orderBy: { dayOfWeek: 'asc' } },
      },
      orderBy: { experienceYears: 'desc' },
      take: limit,
    });
  }

  // Fetch from other entities
  const [hospitals, bloodDonors, emergencyServices, diagnosticTests] = await Promise.all([
    // Hospitals
    db.hospital.findMany({
      where: {
        status: 'ACTIVE',
        ...(isHospitalQuery && rawQuery
          ? {
              OR: [
                { name: { contains: rawQuery } },
                { address: { contains: rawQuery } },
                { hospitalType: { contains: rawQuery } },
              ],
            }
          : {}),
      },
      include: {
        facilities: { where: { isAvailable: true }, select: { facilityName: true } },
        departments: { select: { nameBn: true } },
        _count: { select: { doctors: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      take: isHospitalQuery ? limit : 2,
    }),

    // Blood Donors
    db.bloodDonor.findMany({
      where: {
        status: 'approved',
        ...(isBloodQuery && rawQuery
          ? {
              OR: [
                { bloodGroup: { contains: rawQuery.toUpperCase().replace(/\s+/g, '') } },
                { fullName: { contains: rawQuery } },
                { area: { contains: rawQuery } },
              ],
            }
          : {}),
        ...(params.bloodGroup ? { bloodGroup: params.bloodGroup.toUpperCase() } : {}),
      },
      take: isBloodQuery ? limit : 3,
    }),

    // Emergency Services
    db.emergencyHelpline.findMany({
      where: { isAvailable: true },
      orderBy: { orderIndex: 'asc' },
      take: isEmergencyQuery ? limit : 2,
    }),

    // Diagnostic Tests
    db.diagnosticTest.findMany({
      where: {
        isActive: true,
        ...(isTestQuery && rawQuery
          ? {
              OR: [
                { name: { contains: rawQuery } },
                { aliases: { contains: rawQuery } },
                { category: { contains: rawQuery } },
              ],
            }
          : {}),
      },
      include: {
        availabilities: {
          where: { availabilityStatus: 'AVAILABLE' },
          include: { hospital: { select: { name: true, phone: true } } },
        },
      },
      take: isTestQuery ? limit : 3,
    }),
  ]);

  // Platform knowledge matching
  const matchedPlatformInfo = CD_DOCTORS_PLATFORM_KNOWLEDGE.filter((item) =>
    item.keywords.some((kw) => queryLower.includes(kw))
  );

  // Format Doctors
  let formattedDoctors = doctors.map((d) => {
    const schedules = d.schedules.map((s) => `${DAY_NAMES_BN[s.dayOfWeek]} (${s.startTime}-${s.endTime})`);
    const phone = d.phone || d.hospital?.phone || d.hospital?.emergencyPhone || '';
    return {
      name: d.name,
      specialization: d.specialization,
      degrees: d.degrees,
      department: d.department?.nameBn || d.specialization,
      experienceYears: d.experienceYears,
      fee: `${d.consultationFee} ৳`,
      hospitalName: d.hospital?.name || '',
      hospitalAddress: d.hospital?.address || '',
      chamberRoom: d.chamberRoom,
      phone,
      visitingSchedule: schedules.join(', ') || 'শনিবার-বৃহস্পতিবার (বিকাল ৪:০০ - রাত ৮:০০)',
    };
  });

  if (formattedDoctors.length === 0) {
    const filteredDocs = FALLBACK_DOCTORS.filter((doc) => {
      if (matchedDoctorNames.length > 0) {
        return matchedDoctorNames.includes(doc.name);
      }
      if (detectedSpecialties.length > 0) {
        return detectedSpecialties.some((dept) =>
          (doc.specialization && doc.specialization.toLowerCase().includes(dept)) ||
          (doc.department?.nameEn && doc.department.nameEn.toLowerCase().includes(dept))
        );
      }
      return true;
    });

    formattedDoctors = (filteredDocs.length > 0 ? filteredDocs : FALLBACK_DOCTORS).map((d) => ({
      name: d.name,
      specialization: d.specialization,
      degrees: d.degrees,
      department: d.department?.nameBn || d.specialization,
      experienceYears: d.experienceYears,
      fee: `${d.consultationFee} ৳`,
      hospitalName: d.hospital?.name || '',
      hospitalAddress: d.hospital?.address || '',
      chamberRoom: d.chamberRoom,
      phone: d.phone,
      visitingSchedule: 'শনিবার-বৃহস্পতিবার (বিকাল ৪:০০ - রাত ৮:০০)',
    }));
  }

  // Format Blood Donors
  let formattedBloodDonors = bloodDonors.map((b) => ({
    name: b.fullName,
    bloodGroup: b.bloodGroup,
    area: b.area,
    phone: b.phone,
    availability: b.availability === 'available' ? 'রক্তদানে প্রস্তুত' : 'সাময়িক অনুপলব্ধ',
  }));

  if (formattedBloodDonors.length === 0) {
    const bgFilter = params.bloodGroup ? params.bloodGroup.toUpperCase() : '';
    const filtered = FALLBACK_DONORS.filter((donor) => {
      if (bgFilter && donor.bloodGroup !== bgFilter) return false;
      return true;
    });
    formattedBloodDonors = filtered.map((b) => ({
      name: b.fullName,
      bloodGroup: b.bloodGroup,
      area: b.area,
      phone: b.phone,
      availability: 'রক্তদানে প্রস্তুত (Emergency Ready)',
    }));
  }

  // Format Diagnostic Tests
  const formattedTests = diagnosticTests.map((t) => ({
    testName: t.name,
    category: t.category,
    pricing: t.availabilities.map((a) => ({
      hospital: a.hospital.name,
      price: a.price ? `${a.price} ৳` : 'ফি প্রযোজ্য',
      phone: a.hospital.phone,
    })),
  }));

  // Build Clean AI Context Text without markdown asterisks
  const contextParts: string[] = [];

  // If symptom was detected, highlight the matching department
  if (detectedSpecialties.length > 0) {
    contextParts.push(
      `লক্ষণ অনুযায়ী প্রস্তাবিত বিভাগ: ${detectedSpecialties.join(', ').toUpperCase()}\nচুয়াডাঙ্গায় এই বিভাগের বিশেষজ্ঞ ডাক্তারদের তালিকা নিচে দেওয়া হলো:`
    );
  }

  // Doctor list
  if (formattedDoctors.length > 0 && !isBloodQuery && !isEmergencyQuery && !isTestQuery) {
    contextParts.push(
      formattedDoctors
        .map(
          (d, idx) =>
            `${idx + 1}. ডাক্তারের নাম: ${d.name}\n` +
            `   বিশেষজ্ঞ: ${d.specialization} (${d.department})\n` +
            `   ডিগ্রি: ${d.degrees} | অভিজ্ঞতা: ${d.experienceYears} বছর\n` +
            `   চেম্বার: ${d.hospitalName} (${d.chamberRoom})\n` +
            `   ভিজিট ফি: ${d.fee}\n` +
            `   রোগী দেখার সময়: ${d.visitingSchedule}\n` +
            `   সিরিয়াল নম্বর: ${d.phone}`
        )
        .join('\n\n')
    );
  }

  // Blood Donor list
  if (isBloodQuery && formattedBloodDonors.length > 0) {
    contextParts.push(
      'রক্তদাতাদের তালিকা (Blood Donors):\n' +
        formattedBloodDonors
          .map((b) => `• নাম: ${b.name} | ব্লাড গ্রুপ: ${b.bloodGroup} | এলাকা: ${b.area} | ফোন: ${b.phone}`)
          .join('\n')
    );
  }

  // Emergency list
  if (isEmergencyQuery && emergencyServices.length > 0) {
    contextParts.push(
      '২৪/৭ জরুরি হেল্পলাইন ও অ্যাম্বুলেন্স:\n' +
        emergencyServices.map((e) => `• ${e.title}: ফোন নম্বর: ${e.number} (${e.desc})`).join('\n')
    );
  }

  // Diagnostic tests list
  if (isTestQuery && formattedTests.length > 0) {
    contextParts.push(
      'ডায়াগনস্টিক টেস্ট ও মূল্য তালিকা:\n' +
        formattedTests
          .map((t) => `• ${t.testName}:\n` + t.pricing.map((p) => `  - ${p.hospital}: ${p.price}`).join('\n'))
          .join('\n')
    );
  }

  const aiContextString =
    contextParts.length > 0
      ? contextParts.join('\n\n')
      : 'দুঃখিত, আপনার অনুসন্ধানের সাথে মিলে এমন কোনো তথ্য পাওয়া যায়নি। চুয়াডাঙ্গা সদর হাসপাতাল জরুরি বিভাগে যোগাযোগ করুন: ০১৭১১-৬২৫৮৮০।';

  return {
    success: true,
    detected_specialties: detectedSpecialties,
    ai_context_string: aiContextString,
    doctors: formattedDoctors,
    hospitals: hospitals.map((h) => ({ name: h.name, address: h.address, phone: h.phone })),
    blood_donors: formattedBloodDonors,
    emergency_services: emergencyServices,
    diagnostic_tests: formattedTests,
  };
}

export async function GET(req: Request) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const result = await processUniversalQuery({
      query: searchParams.get('query') || searchParams.get('q') || '',
      category: (searchParams.get('category') as any) || 'all',
      bloodGroup: searchParams.get('bloodGroup') || '',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 5,
    });
    return NextResponse.json(result, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    const result = await processUniversalQuery({
      query: body.query || body.message || body.q || '',
      category: body.category || 'all',
      bloodGroup: body.bloodGroup || '',
      limit: body.limit ? Number(body.limit) : 5,
    });
    return NextResponse.json(result, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
