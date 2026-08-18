import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const specialty = searchParams.get('specialty');

    // Restrict search to Chuadanga District
    const chuadangaDist = await db.district.findUnique({ where: { slug: 'chuadanga' } });
    const districtId = chuadangaDist?.id;

    // Search Hospitals in Chuadanga
    const hospitals = await db.hospital.findMany({
      where: {
        status: 'APPROVED',
        districtId: districtId ? districtId : undefined,
        OR: query
          ? [
              { name: { contains: query } },
              { description: { contains: query } },
              { address: { contains: query } },
            ]
          : undefined,
      },
      include: {
        district: { include: { division: true } },
        _count: { select: { doctors: true, departments: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });

    // Search Doctors in Chuadanga
    const doctors = await db.doctor.findMany({
      where: {
        status: 'ACTIVE',
        hospital: {
          status: 'APPROVED',
          districtId: districtId ? districtId : undefined,
        },
        OR: query || specialty
          ? [
              { name: { contains: query } },
              { specialization: { contains: query || specialty || '' } },
              { degrees: { contains: query } },
              { department: { nameEn: { contains: query || specialty || '' } } },
            ]
          : undefined,
      },
      include: {
        hospital: { select: { id: true, name: true, slug: true, address: true, district: true } },
        department: true,
      },
      orderBy: { experienceYears: 'desc' },
    });

    return NextResponse.json({
      hospitals,
      doctors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
