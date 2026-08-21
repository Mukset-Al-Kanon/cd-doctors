import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Live real-time database query on every request

const DEFAULT_N8N_API_KEY = process.env.N8N_API_KEY || 'cddoctors_n8n_sec_key_2026';

const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const DAY_SHORT_BN = ['রবি', 'সোম', 'মঙ্গ', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

// Symptom & Keyword to Specialty / Department Knowledge Map
const SYMPTOM_SPECIALTY_MAP: Record<string, string[]> = {
  cardiology: ['বুক ধড়ফড়', 'বুকে ব্যথা', 'হার্ট', 'হৃদরোগ', 'প্রেসার', 'উচ্চ রক্তচাপ', 'heart', 'chest pain', 'cardiac', 'hypertension', 'ecg'],
  gynecology: ['প্রসূতি', 'গর্ভবতী', 'স্ত্রী রোগ', 'মাসিক', 'গর্ভকালীন', 'ইনফার্টিলিটি', 'বন্ধ্যাত্ব', 'gynae', 'pregnancy', 'obstetrics', 'women', 'uterus'],
  pediatrics: ['শিশু', 'বাচ্চা', 'নবজাতক', 'শিশুর জ্বর', 'শিশুর কাশি', 'child', 'pediatric', 'baby', 'infant', 'newborn', 'pedia'],
  orthopedics: ['হাড়', 'ভাঙা', 'মচকে', 'কোমর ব্যথা', 'হাঁটু ব্যথা', 'পেইন', 'স্পাইন', 'হাড়জোড়', 'ortho', 'bone', 'joint', 'fracture', 'spine', 'back pain'],
  dermatology: ['চর্ম', 'এলার্জি', 'চুলকানি', 'দাদ', 'ব্রণ', 'মেছতা', 'চুল পড়া', 'skin', 'derma', 'allergy', 'rash', 'eczema', 'acne', 'laser'],
  neurology: ['মাথাব্যথা', 'স্ট্রোক', 'প্যারালাইসিস', 'মৃগীরোগ', 'হাত পা কাঁপা', 'neuro', 'brain', 'stroke', 'headache', 'migraine', 'epilepsy', 'paralysis'],
  gastroenterology: ['পেট ব্যথা', 'গ্যাস্ট্রিক', 'হজম', 'লিভার', 'জন্ডিস', 'বমি', 'আলসার', 'ডায়রিয়া', 'gastric', 'liver', 'stomach', 'endoscopy', 'ulcer', 'jaundice'],
  diabetes: ['ডায়াবেটিস', 'চিনি', 'সুগার', 'হরমোন', 'থাইরয়েড', 'অতিরিক্ত প্রস্রাব', 'diabetes', 'hormone', 'sugar', 'thyroid', 'insulin'],
  ent: ['নাক', 'কান', 'গলা', 'টনসিল', 'কানে কম শোনা', 'নাক বন্ধ', 'ent', 'ear', 'nose', 'throat', 'tonsil'],
  ophthalmology: ['চোখ', 'চোখে কম দেখা', 'ছানি', 'চোখ লাল', 'eye', 'vision', 'cataract', 'glasses'],
  urology: ['কিডনি পাথর', 'প্রস্রাবে জ্বালাপোড়া', 'প্রস্টেট', 'মূত্রনালী', 'kidney stone', 'urology', 'urinary', 'prostate'],
  medicine: ['জ্বর', 'কাশি', 'দুর্বলতা', 'ঠান্ডা', 'ব্যাথাবেদনা', 'টাইফয়েড', 'medicine', 'fever', 'general physician', 'cold', 'weakness'],
  surgery: ['অপারেশন', 'সার্জারি', 'টিউমার', 'অ্যাপেন্ডিসাইটিস', 'হার্নিয়া', 'হাইড্রোসিল', 'surgery', 'laparoscopy', 'operation', 'hernia', 'appendix'],
  dental: ['দাঁত', 'মাড়ি', 'দাঁতে ব্যথা', 'রুট ক্যানেল', 'স্কেলিং', 'dental', 'teeth', 'tooth', 'gums'],
  pulmonology: ['শ্বাসকষ্ট', 'অ্যাজমা', 'হাঁপানি', 'বক্ষব্যাধি', 'যক্ষ্মা', 'ফুসফুস', 'asthma', 'chest medicine', 'respiratory', 'lungs', 'tb', 'copd'],
};

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

async function handleDoctorQuery(params: {
  query?: string;
  specialty?: string;
  symptom?: string;
  hospital?: string;
  area?: string;
  maxFee?: number;
  minFee?: number;
  day?: string;
  limit?: number;
}) {
  const rawQuery = (params.query || '').trim();
  const rawSpecialty = (params.specialty || '').trim();
  const rawSymptom = (params.symptom || '').trim();
  const rawHospital = (params.hospital || '').trim();
  const rawArea = (params.area || '').trim();
  const maxFee = params.maxFee ? Number(params.maxFee) : undefined;
  const minFee = params.minFee ? Number(params.minFee) : undefined;
  const limit = params.limit ? Math.min(20, Math.max(1, Number(params.limit))) : 5;

  // Infer medical department from query or symptom keywords
  const detectedSpecialtyKeywords: string[] = [];
  const textToScan = `${rawQuery} ${rawSpecialty} ${rawSymptom}`.toLowerCase();

  for (const [deptKey, keywords] of Object.entries(SYMPTOM_SPECIALTY_MAP)) {
    if (keywords.some((kw) => textToScan.includes(kw.toLowerCase()))) {
      detectedSpecialtyKeywords.push(deptKey);
    }
  }

  // Day filter
  let targetDayOfWeek: number | undefined;
  if (params.day === 'today') {
    targetDayOfWeek = new Date().getDay();
  } else if (params.day !== undefined && params.day !== '') {
    const parsed = parseInt(params.day, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
      targetDayOfWeek = parsed;
    }
  }

  // Build Prisma Where Clause
  const where: any = {
    status: 'ACTIVE',
  };

  if (rawHospital) {
    where.hospital = {
      OR: [
        { id: rawHospital },
        { slug: rawHospital },
        { name: { contains: rawHospital } },
      ],
    };
  }

  if (rawArea) {
    where.hospital = {
      ...(where.hospital || {}),
      OR: [
        ...(where.hospital?.OR || []),
        { address: { contains: rawArea } },
        { district: { nameEn: { contains: rawArea } } },
        { district: { nameBn: { contains: rawArea } } },
      ],
    };
  }

  if (minFee !== undefined || maxFee !== undefined) {
    where.consultationFee = {};
    if (minFee !== undefined && !isNaN(minFee)) where.consultationFee.gte = minFee;
    if (maxFee !== undefined && !isNaN(maxFee)) where.consultationFee.lte = maxFee;
  }

  if (targetDayOfWeek !== undefined) {
    where.schedules = {
      some: { dayOfWeek: targetDayOfWeek },
    };
  }

  // Search by text, specialty, or mapped symptoms
  const searchOr: any[] = [];

  if (rawQuery) {
    searchOr.push(
      { name: { contains: rawQuery } },
      { specialization: { contains: rawQuery } },
      { degrees: { contains: rawQuery } },
      { bio: { contains: rawQuery } },
      { treatedDiseases: { contains: rawQuery } },
      { department: { nameEn: { contains: rawQuery } } },
      { department: { nameBn: { contains: rawQuery } } },
      { hospital: { name: { contains: rawQuery } } }
    );
  }

  if (rawSpecialty) {
    searchOr.push(
      { specialization: { contains: rawSpecialty } },
      { department: { nameEn: { contains: rawSpecialty } } },
      { department: { nameBn: { contains: rawSpecialty } } }
    );
  }

  // Include mapped symptom specialties
  for (const dept of detectedSpecialtyKeywords) {
    searchOr.push(
      { specialization: { contains: dept } },
      { department: { nameEn: { contains: dept } } },
      { department: { nameBn: { contains: dept } } }
    );
  }

  if (searchOr.length > 0) {
    where.OR = searchOr;
  }

  // Execute database query
  const doctors = await db.doctor.findMany({
    where,
    include: {
      hospital: {
        select: {
          id: true,
          name: true,
          slug: true,
          address: true,
          phone: true,
          emergencyPhone: true,
          district: { select: { nameEn: true, nameBn: true } },
        },
      },
      department: {
        select: { id: true, nameEn: true, nameBn: true },
      },
      schedules: {
        select: { dayOfWeek: true, startTime: true, endTime: true },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
    orderBy: { experienceYears: 'desc' },
    take: limit,
  });

  // If no exact match found with all filters, perform a soft fallback for top relevant doctors
  let finalDoctors = doctors;
  if (finalDoctors.length === 0 && (rawQuery || rawSpecialty)) {
    finalDoctors = await db.doctor.findMany({
      where: { status: 'ACTIVE' },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            phone: true,
            emergencyPhone: true,
            district: { select: { nameEn: true, nameBn: true } },
          },
        },
        department: { select: { id: true, nameEn: true, nameBn: true } },
        schedules: {
          select: { dayOfWeek: true, startTime: true, endTime: true },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
      orderBy: { experienceYears: 'desc' },
      take: limit,
    });
  }

  // Format AI context response
  const formattedDoctors = finalDoctors.map((doc) => {
    const scheduleDays = doc.schedules.map((s) => `${DAY_NAMES_BN[s.dayOfWeek]} (${s.startTime}-${s.endTime})`);
    const availableDaysBn = doc.schedules.map((s) => DAY_SHORT_BN[s.dayOfWeek]);
    const phone = doc.phone || doc.hospital?.phone || doc.hospital?.emergencyPhone || '';

    return {
      id: doc.id,
      name: doc.name,
      degrees: doc.degrees,
      specialization: doc.specialization,
      department: doc.department?.nameBn || doc.department?.nameEn || doc.specialization,
      experience_years: doc.experienceYears,
      consultation_fee_bdt: doc.consultationFee,
      hospital_name: doc.hospital?.name || 'চুয়াডাঙ্গা',
      hospital_address: doc.hospital?.address || '',
      chamber_room: doc.chamberRoom,
      contact_phone: phone,
      call_url: phone ? `tel:${phone.replace(/\s+/g, '')}` : '',
      visiting_schedule: scheduleDays.length > 0 ? scheduleDays.join(', ') : 'শনিবার-বৃহস্পতিবার (বিকাল ৪:০০ - রাত ৮:০০)',
      available_days_short: availableDaysBn,
      bio: doc.bio || '',
      treated_diseases: doc.treatedDiseases || '',
    };
  });

  // Generate Natural AI Context Text for n8n AI Agent LLM
  let aiContextText = '';
  if (formattedDoctors.length > 0) {
    aiContextText = formattedDoctors
      .map(
        (d, idx) =>
          `${idx + 1}. **${d.name}** (${d.specialization})\n` +
          `   - ডিগ্রি: ${d.degrees} | অভিজ্ঞতা: ${d.experience_years} বছর\n` +
          `   - হাসপাতাল ও চেম্বার: ${d.hospital_name} (${d.chamber_room})\n` +
          `   - ভিজিট ফি: ৳${d.consultation_fee_bdt} টাকা\n` +
          `   - রোগী দেখার সময়সূচি: ${d.visiting_schedule}\n` +
          `   - সিরিয়ালের জন্য কল করুন: ${d.contact_phone}`
      )
      .join('\n\n');
  } else {
    aiContextText = 'দুঃখিত, আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ডাক্তারের তথ্য পাওয়া যায়নি। চুয়াডাঙ্গা সদর হাসপাতাল বা জরুরি সেবায় যোগাযোগ করুন।';
  }

  // Generate concise Messenger / WhatsApp Card response
  const messengerResponse = formattedDoctors
    .slice(0, 3)
    .map(
      (d) =>
        `🩺 *${d.name}*\n` +
        `👨‍⚕️ ${d.specialization}\n` +
        `🏥 ${d.hospital_name} (${d.chamber_room})\n` +
        `💰 ভিজিট ফি: ৳${d.consultation_fee_bdt}\n` +
        `📅 সময়: ${d.visiting_schedule}\n` +
        `📞 সিরিয়াল: ${d.contact_phone}`
    )
    .join('\n\n---\n\n');

  return {
    success: true,
    total_matches: formattedDoctors.length,
    inferred_specialties: detectedSpecialtyKeywords,
    query_interpreted: rawQuery || rawSpecialty || rawSymptom || 'All Doctors',
    ai_context_string: aiContextText,
    messenger_card_text: messengerResponse,
    doctors: formattedDoctors,
    suggested_quick_replies: [
      '📞 সিরিয়ালের জন্য সরাসরি কল করুন',
      '🏥 হাসপাতালের ঠিকানা ও লোকেশন জানুন',
      '🩸 জরুরি রক্তদাতার সন্ধান করুন',
      '🚑 ২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা',
    ],
    timestamp: new Date().toISOString(),
  };
}

// GET Handler (for easy n8n HTTP Request node GET calls with query params)
export async function GET(req: Request) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Invalid or missing n8n API Key. Please provide header "x-api-key" or query param "?apiKey=..."',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const result = await handleDoctorQuery({
      query: searchParams.get('query') || searchParams.get('q') || searchParams.get('message') || '',
      specialty: searchParams.get('specialty') || searchParams.get('dept') || '',
      symptom: searchParams.get('symptom') || '',
      hospital: searchParams.get('hospital') || searchParams.get('hospitalSlug') || '',
      area: searchParams.get('area') || searchParams.get('district') || '',
      maxFee: searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')!, 10) : undefined,
      minFee: searchParams.get('minFee') ? parseInt(searchParams.get('minFee')!, 10) : undefined,
      day: searchParams.get('day') || '',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 5,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/ai/query-doctors GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error in query-doctors API',
      },
      { status: 500 }
    );
  }
}

// POST Handler (for n8n AI Agent Tool node or JSON Body calls)
export async function POST(req: Request) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Invalid or missing n8n API Key. Please provide header "x-api-key" or body "apiKey".',
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const result = await handleDoctorQuery({
      query: body.query || body.message || body.q || '',
      specialty: body.specialty || body.department || body.dept || '',
      symptom: body.symptom || '',
      hospital: body.hospital || body.hospitalSlug || '',
      area: body.area || body.district || body.location || '',
      maxFee: body.maxFee ? Number(body.maxFee) : undefined,
      minFee: body.minFee ? Number(body.minFee) : undefined,
      day: body.day !== undefined ? String(body.day) : '',
      limit: body.limit ? Number(body.limit) : 5,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/ai/query-doctors POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error in query-doctors API',
      },
      { status: 500 }
    );
  }
}
