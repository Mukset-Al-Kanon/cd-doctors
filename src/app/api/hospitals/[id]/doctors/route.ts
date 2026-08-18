import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DAY_NAMES_BN: Record<number, string> = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'শনিবার',
};

const DAY_NAMES_EN: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || '00';
  if (isNaN(hour)) return timeStr;

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hospitalIdentifier = params.id;

    if (!hospitalIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Hospital ID or Slug is required' },
        { status: 400 }
      );
    }

    // Find hospital by ID or Slug
    const hospital = await db.hospital.findFirst({
      where: {
        OR: [
          { id: hospitalIdentifier },
          { slug: hospitalIdentifier },
        ],
      },
      include: {
        district: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        {
          success: false,
          error: `Hospital '${hospitalIdentifier}' not found.`,
        },
        { status: 404 }
      );
    }

    // Find all active doctors in this hospital
    const doctors = await db.doctor.findMany({
      where: {
        hospitalId: hospital.id,
        status: 'ACTIVE',
      },
      include: {
        department: true,
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
      orderBy: { experienceYears: 'desc' },
    });

    const formattedDoctors = doctors.map((doc) => {
      const daysBn = doc.schedules.map((s) => DAY_NAMES_BN[s.dayOfWeek] || `Day ${s.dayOfWeek}`);
      const daysEn = doc.schedules.map((s) => DAY_NAMES_EN[s.dayOfWeek] || `Day ${s.dayOfWeek}`);

      // Generate human-readable consultation time string
      const timeSlots = doc.schedules.map((s) => {
        const start = formatTime12h(s.startTime);
        const end = formatTime12h(s.endTime);
        const day = DAY_NAMES_BN[s.dayOfWeek] || DAY_NAMES_EN[s.dayOfWeek];
        return `${day}: ${start} - ${end}`;
      });

      const genericConsultationTime =
        doc.schedules.length > 0
          ? `${formatTime12h(doc.schedules[0].startTime)} - ${formatTime12h(doc.schedules[0].endTime)}`
          : 'সময়সূচী নির্ধারিত হয়নি';

      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        specialty: doc.specialization || doc.department?.nameBn || doc.department?.nameEn,
        chamber_location: doc.chamberRoom 
          ? `${doc.chamberRoom}, ${hospital.name}`
          : hospital.name,
        consultation_days: daysBn.length > 0 ? daysBn.join(', ') : 'সকল দিন / নির্ধারিত নেই',
        consultation_days_list: daysBn,
        consultation_days_en: daysEn,
        consultation_time: genericConsultationTime,
        consultation_schedule_details: timeSlots,
        poster_url: doc.photoUrl || null,
        
        // Additional detailed fields
        degrees: doc.degrees,
        experience_years: doc.experienceYears,
        consultation_fee: doc.consultationFee,
        chamber_room: doc.chamberRoom,
        phone: doc.phone || hospital.phone,
        bmdc_number: doc.bmdcNumber,
        bio: doc.bio,
        treated_diseases: doc.treatedDiseases,
        department: {
          id: doc.department.id,
          name_en: doc.department.nameEn,
          name_bn: doc.department.nameBn,
        },
        hospital: {
          id: hospital.id,
          name: hospital.name,
          slug: hospital.slug,
          address: hospital.address,
        },
        schedules: doc.schedules,
      };
    });

    return NextResponse.json({
      success: true,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        slug: hospital.slug,
        address: hospital.address,
        district: hospital.district.nameEn,
      },
      count: formattedDoctors.length,
      data: formattedDoctors,
      doctors: formattedDoctors,
    });
  } catch (error: any) {
    console.error(`Error fetching doctors for hospital ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'ডাক্তারদের তথ্য আনতে সমস্যা হয়েছে।',
      },
      { status: 500 }
    );
  }
}
