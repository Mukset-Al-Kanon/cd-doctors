import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 0; // Dynamic on every request

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const specialty = searchParams.get('specialty') || '';
    const hospital = searchParams.get('hospital') || '';

    const doctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
        ...(hospital
          ? {
              hospital: {
                OR: [{ id: hospital }, { slug: hospital }, { name: { contains: hospital } }],
              },
            }
          : {}),
        ...(query || specialty
          ? {
              OR: [
                { name: { contains: query } },
                { specialization: { contains: query || specialty } },
                { degrees: { contains: query } },
                { department: { nameEn: { contains: query || specialty } } },
                { department: { nameBn: { contains: query || specialty } } },
              ],
            }
          : {}),
      },
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
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            slotDurationMinutes: true,
            maxPatients: true,
          },
        },
      },
      orderBy: { experienceYears: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error: any) {
    console.error('Error fetching doctors in /api/doctors:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'ডাক্তারদের তথ্য আনতে সমস্যা হয়েছে।',
      },
      { status: 500 }
    );
  }
}
