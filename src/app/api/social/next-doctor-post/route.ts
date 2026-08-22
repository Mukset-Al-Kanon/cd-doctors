import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_N8N_API_KEY = process.env.N8N_API_KEY || 'cddoctors_n8n_sec_key_2026';

const DAY_NAMES_BN: Record<number, string> = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'Saturday',
};

const DAY_SHORT_BN: Record<number, string> = {
  0: 'রবি',
  1: 'সোম',
  2: 'মঙ্গ',
  3: 'বুধ',
  4: 'বৃহ',
  5: 'শুক্র',
  6: 'শনি',
};

function formatTimeBn(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;

  const isPm = h >= 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const period = isPm ? (h >= 17 ? 'সন্ধ্যা/রাত' : 'দুপুর/বিকাল') : 'সকাল';
  return `${period} ${h12}:${m}`;
}

function generateHashtags(specialization: string, hospitalName: string): string[] {
  const tags = new Set<string>([
    '#CDDoctors',
    '#Chuadanga',
    '#ChuadangaHealthcare',
    '#DoctorAppointment',
    '#চুয়াডাঙ্গা',
    '#ডাক্তার_সিরিয়াল',
  ]);

  if (specialization) {
    if (specialization.includes('মেডিসিন') || specialization.toLowerCase().includes('medicine')) tags.add('#MedicineSpecialist');
    if (specialization.includes('প্রসূতি') || specialization.includes('স্ত্রী') || specialization.toLowerCase().includes('gynae')) {
      tags.add('#Gynaecologist');
      tags.add('#MaternityCare');
    }
    if (specialization.includes('শিশু') || specialization.toLowerCase().includes('pedia')) tags.add('#ChildSpecialist');
    if (specialization.includes('হৃদরোগ') || specialization.includes('কার্ডি') || specialization.toLowerCase().includes('cardio')) tags.add('#Cardiologist');
    if (specialization.includes('হাড়') || specialization.includes('অর্থো') || specialization.toLowerCase().includes('ortho')) tags.add('#OrthopedicSurgeon');
    if (specialization.includes('চর্ম') || specialization.toLowerCase().includes('derma')) tags.add('#Dermatologist');
    if (specialization.includes('সার্জারি') || specialization.toLowerCase().includes('surgeon')) tags.add('#GeneralSurgeon');
    if (specialization.includes('নাক') || specialization.includes('কান') || specialization.toLowerCase().includes('ent')) tags.add('#ENTSpecialist');
    if (specialization.includes('চক্ষু') || specialization.toLowerCase().includes('eye')) tags.add('#EyeSpecialist');
    if (specialization.includes('দাঁত') || specialization.toLowerCase().includes('dental')) tags.add('#DentalSurgeon');
  }

  if (hospitalName) {
    const cleanHospTag = '#' + hospitalName.replace(/[^\w\u0980-\u09FF]/g, '');
    if (cleanHospTag.length > 2) tags.add(cleanHospTag);
  }

  return Array.from(tags);
}

function buildEngagingFacebookCaption(doc: any, scheduleSummary: string, profileUrl: string, hashtags: string[]): string {
  const treatedList = doc.treatedDiseases
    ? doc.treatedDiseases
        .split(',')
        .map((s: string) => `✓ ${s.trim()}`)
        .filter(Boolean)
        .slice(0, 5)
        .join('\n')
    : '';

  const phones = [doc.phone, doc.hospital?.phone, doc.hospital?.emergencyPhone]
    .filter((p, i, arr) => Boolean(p) && arr.indexOf(p) === i)
    .join(' | ');

  let caption = `${doc.name}
${doc.degrees || ''}
বিশেষত্ব: ${doc.specialization}
হাসপাতাল/চেম্বার: ${doc.hospital?.name || 'চুয়াডাঙ্গা'}
ঠিকানা: ${doc.hospital?.address || 'চুয়াডাঙ্গা'}

রোগী দেখার সময়: ${scheduleSummary || 'সাপ্তাহিক শিডিউল অনুযায়ী'}

সিরিয়ালের জন্য সরাসরি যোগাযোগ করুন:
${phones || '01700-000000'}

🌐 ডাক্তারের বিস্তারিত প্রোফাইল ও চেম্বার শিডিউল দেখুন:
    ${profileUrl}`;

  if (treatedList) {
    caption += `\n\n📌 যেসব রোগের চিকিৎসাসেবা ও পরামর্শ প্রদান করেন:\n${treatedList}`;
  }

  caption += `\n\nচুয়াডাঙ্গার সকল হাসপাতাল, বিশেষজ্ঞ ডাক্তার, ব্লাড ডোনার ও ২৪/৭ জরুরি অ্যাম্বুলেন্সের নির্ভরযোগ্য প্ল্যাটফর্ম — CD Doctors।\n\n${hashtags.join(' ')}`;

  return caption;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || 
                   searchParams.get('apiKey');

    if (!apiKey || apiKey !== DEFAULT_N8N_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Provide valid x-api-key header or ?apiKey= parameter.' 
        }, 
        { status: 401 }
      );
    }

    const hospitalId = searchParams.get('hospitalId');
    const doctorId = searchParams.get('doctorId');
    const previewOnly = searchParams.get('previewOnly') === 'true';
    const getAllQueue = searchParams.get('all') === 'true';

    // 1. If requesting full queue of doctors with posters
    if (getAllQueue) {
      const queue = await db.doctor.findMany({
        where: {
          status: 'ACTIVE',
          posterUrl: { not: null },
        },
        include: {
          hospital: { select: { id: true, name: true, address: true, phone: true } },
          department: { select: { id: true, nameEn: true, nameBn: true } },
          schedules: true,
        },
        orderBy: [
          { lastSocialPostedAt: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      return NextResponse.json({
        success: true,
        total_with_posters: queue.length,
        queue: queue.map((d) => ({
          id: d.id,
          name: d.name,
          specialization: d.specialization,
          hospital_name: d.hospital?.name,
          poster_url: d.posterUrl,
          last_posted_at: d.lastSocialPostedAt,
        })),
      });
    }

    // 2. Query next eligible doctor
    let doctor = null;

    if (doctorId) {
      doctor = await db.doctor.findUnique({
        where: { id: doctorId },
        include: {
          hospital: true,
          department: true,
          schedules: true,
        },
      });
    } else {
      // Find active doctor with posterUrl, prioritized by earliest lastSocialPostedAt (nulls first)
      const whereClause: any = {
        status: 'ACTIVE',
        posterUrl: { not: null },
      };

      if (hospitalId) {
        whereClause.hospitalId = hospitalId;
      }

      // First try to find a doctor with posterUrl
      doctor = await db.doctor.findFirst({
        where: whereClause,
        include: {
          hospital: true,
          department: true,
          schedules: true,
        },
        orderBy: [
          { lastSocialPostedAt: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      // Fallback: If no doctor with posterUrl found, pick any active doctor
      if (!doctor) {
        doctor = await db.doctor.findFirst({
          where: {
            status: 'ACTIVE',
            ...(hospitalId ? { hospitalId } : {}),
          },
          include: {
            hospital: true,
            department: true,
            schedules: true,
          },
          orderBy: [
            { lastSocialPostedAt: 'asc' },
            { createdAt: 'asc' },
          ],
        });
      }
    }

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          error: 'No eligible doctor profiles found in database.',
        },
        { status: 404 }
      );
    }

    // 3. Format Schedule Summary
    const sortedSchedules = (doctor.schedules || []).slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    const daysBnList = sortedSchedules.map((s) => DAY_SHORT_BN[s.dayOfWeek] || `Day ${s.dayOfWeek}`);
    const daysEnList = sortedSchedules.map((s) => DAY_NAMES_BN[s.dayOfWeek] || `Day ${s.dayOfWeek}`);
    
    let timeRangeBn = '';
    if (sortedSchedules.length > 0) {
      const first = sortedSchedules[0];
      timeRangeBn = `${formatTimeBn(first.startTime)} থেকে ${formatTimeBn(first.endTime)}`;
    }

    const scheduleSummaryBn = daysBnList.length > 0
      ? `${daysBnList.join(', ')} (${timeRangeBn || 'নির্ধারিত সময়ে'})`
      : 'প্রতিদিন (সাপ্তাহিক শিডিউল অনুযায়ী)';

    // 4. Construct Public Profile URL & Assets
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cddoctors.com';
    const profileUrl = `${baseUrl}/doctors/${doctor.slug}`;
    const posterUrl = doctor.posterUrl || doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';
    const isFallbackPoster = !doctor.posterUrl;

    const hashtags = generateHashtags(doctor.specialization, doctor.hospital?.name || '');
    const suggestedCaption = buildEngagingFacebookCaption(doctor, scheduleSummaryBn, profileUrl, hashtags);

    const firstComment = `চুয়াডাঙ্গাতে ২৪/৭ ডাক্তার, হাসপাতাল, রক্ত বা স্বাস্থ্যসেবা সংক্রান্ত তাৎক্ষণিক যেকোনো তথ্য সেবা পেতে আমাদের পেইজে সরাসরি মেসেজ (Inbox) করুন।

🌐 ওয়েবসাইট: ${baseUrl}`;

    const responsePayload = {
      success: true,
      data: {
        doctor_id: doctor.id,
        name: doctor.name,
        slug: doctor.slug,
        degrees: doctor.degrees,
        specialization: doctor.specialization,
        bmdc_number: doctor.bmdcNumber,
        experience_years: doctor.experienceYears,
        chamber_room: doctor.chamberRoom,
        consultation_fee: doctor.consultationFee,
        phone: doctor.phone,
        bio: doctor.bio,
        treated_diseases: doctor.treatedDiseases,
        treated_diseases_list: doctor.treatedDiseases
          ? doctor.treatedDiseases.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        hospital: {
          id: doctor.hospital?.id,
          name: doctor.hospital?.name,
          slug: doctor.hospital?.slug,
          address: doctor.hospital?.address,
          phone: doctor.hospital?.phone,
          emergency_phone: doctor.hospital?.emergencyPhone,
        },
        department: {
          id: doctor.department?.id,
          name_en: doctor.department?.nameEn,
          name_bn: doctor.department?.nameBn,
        },
        schedule: {
          available_days_bn: daysBnList,
          available_days_full_bn: daysEnList,
          schedule_summary_bn: scheduleSummaryBn,
          time_range_bn: timeRangeBn,
          raw_schedules: doctor.schedules,
        },
        social_assets: {
          poster_url: posterUrl,
          is_fallback_poster: isFallbackPoster,
          doctor_avatar_url: doctor.photoUrl,
          profile_url: profileUrl,
        },
        facebook_post: {
          caption: suggestedCaption,
          first_comment: firstComment,
          hashtags: hashtags,
          image_url: posterUrl,
        },
        metadata: {
          last_social_posted_at: doctor.lastSocialPostedAt,
          preview_mode: previewOnly,
          generated_at: new Date().toISOString(),
        },
      },
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error('Error fetching social doctor post data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!apiKey || apiKey !== DEFAULT_N8N_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid x-api-key header.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { doctorId, facebookPostId, notes } = body;

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'doctorId is required in request body.' },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.findUnique({
      where: { id: doctorId },
      include: { hospital: { select: { id: true, name: true } } },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor record not found.' },
        { status: 404 }
      );
    }

    const now = new Date();

    // Update doctor's lastSocialPostedAt timestamp
    await db.doctor.update({
      where: { id: doctorId },
      data: {
        lastSocialPostedAt: now,
      },
    });

    // Record in Audit Log
    try {
      await db.auditLog.create({
        data: {
          action: 'DOCTOR_SOCIAL_POSTED',
          hospitalId: doctor.hospitalId,
          details: `Doctor ${doctor.name} posted on Facebook Page (Post ID: ${facebookPostId || 'n8n-auto'}) on ${now.toISOString()}. Notes: ${notes || 'Automated n8n Schedule'}`,
        },
      });
    } catch (auditErr) {
      console.log('Audit log skipped for social post callback');
    }

    return NextResponse.json({
      success: true,
      message: `Doctor ${doctor.name} social post logged successfully. Rotation updated.`,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      hospital_name: doctor.hospital?.name,
      last_social_posted_at: now.toISOString(),
      facebook_post_id: facebookPostId || null,
    });
  } catch (error: any) {
    console.error('Error logging social doctor post callback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
