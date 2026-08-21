import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Live real-time data always

const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const DAY_SHORT_BN = ['রবি', 'সোম', 'মঙ্গ', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const specialty = searchParams.get('specialty') || searchParams.get('department') || '';
    const hospital = searchParams.get('hospital') || searchParams.get('hospitalSlug') || searchParams.get('hospitalId') || '';
    const area = searchParams.get('area') || searchParams.get('district') || searchParams.get('location') || '';
    const minFee = searchParams.get('minFee') ? parseInt(searchParams.get('minFee')!, 10) : undefined;
    const maxFee = searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')!, 10) : undefined;
    const dayParam = searchParams.get('day') || searchParams.get('dayOfWeek');
    const availableToday = searchParams.get('availableToday') === 'true';
    const limit = searchParams.get('limit') ? Math.min(100, Math.max(1, parseInt(searchParams.get('limit')!, 10))) : 50;
    const page = searchParams.get('page') ? Math.max(1, parseInt(searchParams.get('page')!, 10)) : 1;
    const sortBy = searchParams.get('sortBy') || 'experience_desc';

    // Calculate target day of week if specified
    let targetDayOfWeek: number | undefined;
    if (availableToday) {
      targetDayOfWeek = new Date().getDay();
    } else if (dayParam !== null && dayParam !== undefined && dayParam !== '') {
      const parsed = parseInt(dayParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
        targetDayOfWeek = parsed;
      }
    }

    // Determine sort order
    let orderBy: any = { experienceYears: 'desc' };
    if (sortBy === 'fee_asc') orderBy = { consultationFee: 'asc' };
    else if (sortBy === 'fee_desc') orderBy = { consultationFee: 'desc' };
    else if (sortBy === 'name_asc') orderBy = { name: 'asc' };
    else if (sortBy === 'experience_asc') orderBy = { experienceYears: 'asc' };

    // Build filter criteria
    const where: any = {
      status: 'ACTIVE',
    };

    // Filter by Hospital
    if (hospital) {
      where.hospital = {
        OR: [
          { id: hospital },
          { slug: hospital },
          { name: { contains: hospital } },
        ],
      };
    }

    // Filter by Area / District
    if (area) {
      where.hospital = {
        ...(where.hospital || {}),
        OR: [
          ...(where.hospital?.OR || []),
          { address: { contains: area } },
          { district: { nameEn: { contains: area } } },
          { district: { nameBn: { contains: area } } },
        ],
      };
    }

    // Filter by Fee range
    if (minFee !== undefined || maxFee !== undefined) {
      where.consultationFee = {};
      if (minFee !== undefined && !isNaN(minFee)) where.consultationFee.gte = minFee;
      if (maxFee !== undefined && !isNaN(maxFee)) where.consultationFee.lte = maxFee;
    }

    // Filter by Day of Week Schedule
    if (targetDayOfWeek !== undefined) {
      where.schedules = {
        some: {
          dayOfWeek: targetDayOfWeek,
        },
      };
    }

    // General text search / specialty filter
    const searchConditions: any[] = [];
    if (query) {
      searchConditions.push(
        { name: { contains: query } },
        { specialization: { contains: query } },
        { degrees: { contains: query } },
        { bio: { contains: query } },
        { treatedDiseases: { contains: query } },
        { chamberRoom: { contains: query } },
        { department: { nameEn: { contains: query } } },
        { department: { nameBn: { contains: query } } },
        { hospital: { name: { contains: query } } }
      );
    }

    if (specialty) {
      searchConditions.push(
        { specialization: { contains: specialty } },
        { department: { id: specialty } },
        { department: { nameEn: { contains: specialty } } },
        { department: { nameBn: { contains: specialty } } }
      );
    }

    if (searchConditions.length > 0) {
      where.OR = searchConditions;
    }

    // Execute queries with pagination
    const [totalCount, rawDoctors] = await Promise.all([
      db.doctor.count({ where }),
      db.doctor.findMany({
        where,
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              slug: true,
              hospitalType: true,
              address: true,
              phone: true,
              emergencyPhone: true,
              district: {
                select: {
                  nameEn: true,
                  nameBn: true,
                },
              },
            },
          },
          department: {
            select: {
              id: true,
              nameEn: true,
              nameBn: true,
            },
          },
          schedules: {
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              slotDurationMinutes: true,
              maxPatients: true,
            },
            orderBy: { dayOfWeek: 'asc' },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Format doctors with human-friendly metadata
    const doctors = rawDoctors.map((doc) => {
      const scheduleDaysBn = doc.schedules.map((s) => `${DAY_NAMES_BN[s.dayOfWeek]} (${s.startTime} - ${s.endTime})`);
      const scheduleDaysShortBn = doc.schedules.map((s) => DAY_SHORT_BN[s.dayOfWeek]);
      const availableDayIndices = doc.schedules.map((s) => s.dayOfWeek);
      const contactPhone = doc.phone || doc.hospital?.phone || doc.hospital?.emergencyPhone || '';

      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        degrees: doc.degrees,
        specialization: doc.specialization,
        bmdcNumber: doc.bmdcNumber,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        feeFormatted: `${doc.consultationFee} ৳`,
        chamberRoom: doc.chamberRoom,
        phone: contactPhone,
        callUrl: contactPhone ? `tel:${contactPhone.replace(/\s+/g, '')}` : '',
        photoUrl: doc.photoUrl,
        bio: doc.bio || '',
        treatedDiseases: doc.treatedDiseases || '',
        languages: doc.languages,
        status: doc.status,
        department: {
          id: doc.department?.id || '',
          nameEn: doc.department?.nameEn || '',
          nameBn: doc.department?.nameBn || '',
        },
        hospital: {
          id: doc.hospital?.id || '',
          name: doc.hospital?.name || '',
          slug: doc.hospital?.slug || '',
          type: doc.hospital?.hospitalType || '',
          address: doc.hospital?.address || '',
          districtEn: doc.hospital?.district?.nameEn || '',
          districtBn: doc.hospital?.district?.nameBn || '',
          phone: doc.hospital?.phone || '',
          emergencyPhone: doc.hospital?.emergencyPhone || '',
        },
        schedules: doc.schedules,
        scheduleSummaryBn: scheduleDaysBn.length > 0 ? scheduleDaysBn.join(', ') : 'নির্ধারিত সময়সূচি',
        availableDaysBn: scheduleDaysShortBn,
        availableDayIndices,
      };
    });

    return NextResponse.json(
      {
        success: true,
        metadata: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          filters: {
            query: query || null,
            specialty: specialty || null,
            hospital: hospital || null,
            area: area || null,
            minFee: minFee ?? null,
            maxFee: maxFee ?? null,
            targetDayOfWeek: targetDayOfWeek ?? null,
          },
        },
        count: doctors.length,
        doctors,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in /api/doctors:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'ডাক্তারদের তথ্য আনতে সমস্যা হয়েছে।',
      },
      { status: 500 }
    );
  }
}
