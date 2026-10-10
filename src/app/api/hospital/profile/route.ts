import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: 'hospitalId is required' }, { status: 400 });
    }

    const hospital = await db.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        facilities: true,
        testAvailabilities: {
          include: { test: true },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json({ success: false, error: 'হাসপাতাল পাওয়া যায়নি।' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hospital });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      hospitalId,
      name,
      phone,
      emergencyPhone,
      email,
      address,
      website,
      googleMapUrl,
      description,
      logoUrl,
      coverUrl,
      licenseNumber,
      visitingHours,
      noticeText,
      bedStats, // JSON string or object
      hospitalType,
      establishedYear,
      facilities, // array of string names e.g. ["ICU", "24/7 Pharmacy"]
      testPrices, // array of { testId: string, price: number, availabilityStatus: string }
    } = body;

    if (!hospitalId) {
      return NextResponse.json({ success: false, error: 'hospitalId is required' }, { status: 400 });
    }

    const bedStatsString = typeof bedStats === 'object' ? JSON.stringify(bedStats) : bedStats;

    // 1. Update basic hospital info
    const updatedHospital = await db.hospital.update({
      where: { id: hospitalId },
      data: {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(emergencyPhone ? { emergencyPhone } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(googleMapUrl !== undefined ? { googleMapUrl } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        ...(coverUrl !== undefined ? { coverUrl } : {}),
        ...(licenseNumber ? { licenseNumber } : {}),
        ...(visitingHours !== undefined ? { visitingHours } : {}),
        ...(noticeText !== undefined ? { noticeText } : {}),
        ...(bedStatsString !== undefined ? { bedStats: bedStatsString } : {}),
        ...(hospitalType ? { hospitalType } : {}),
        ...(establishedYear ? { establishedYear: parseInt(establishedYear.toString(), 10) } : {}),
      },
    });

    // 2. Update facilities if provided
    if (Array.isArray(facilities)) {
      await db.hospitalFacility.deleteMany({
        where: { hospitalId },
      });

      for (const fName of facilities) {
        if (fName && fName.trim()) {
          await db.hospitalFacility.create({
            data: {
              hospitalId,
              facilityName: fName.trim(),
              isAvailable: true,
            },
          });
        }
      }
    }

    // 3. Update test prices if provided
    if (Array.isArray(testPrices)) {
      for (const tp of testPrices) {
        if (tp.testId) {
          await db.testAvailability.upsert({
            where: {
              testId_hospitalId: {
                testId: tp.testId,
                hospitalId,
              },
            },
            update: {
              price: tp.price !== undefined ? parseInt(tp.price.toString(), 10) : null,
              availabilityStatus: tp.availabilityStatus || 'AVAILABLE',
              lastVerifiedAt: new Date(),
            },
            create: {
              testId: tp.testId,
              hospitalId,
              price: tp.price !== undefined ? parseInt(tp.price.toString(), 10) : null,
              availabilityStatus: tp.availabilityStatus || 'AVAILABLE',
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'হাসপাতালের প্রোফাইল ও সুবিধাসমূহ সফলভাবে হালনাগাদ করা হয়েছে!',
      hospital: updatedHospital,
    });
  } catch (error: any) {
    console.error('Hospital profile update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
