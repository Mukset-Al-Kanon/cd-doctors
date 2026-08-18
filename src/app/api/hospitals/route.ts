import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const district = searchParams.get('district') || '';

    const hospitals = await db.hospital.findMany({
      where: {
        status: 'APPROVED',
        ...(district
          ? {
              district: {
                OR: [
                  { id: district },
                  { slug: district },
                  { nameEn: { contains: district } },
                  { nameBn: { contains: district } },
                ],
              },
            }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { address: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        district: {
          select: {
            id: true,
            nameEn: true,
            nameBn: true,
            slug: true,
            division: {
              select: {
                nameEn: true,
                nameBn: true,
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            departments: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    });

    const formattedHospitals = hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      slug: h.slug,
      hospital_type: h.hospitalType,
      address: h.address,
      location: h.address,
      district: h.district.nameEn,
      district_bn: h.district.nameBn,
      division: h.district.division.nameEn,
      phone: h.phone,
      emergency_phone: h.emergencyPhone,
      email: h.email,
      website: h.website,
      google_map_url: h.googleMapUrl,
      established_year: h.establishedYear,
      description: h.description,
      logo_url: h.logoUrl,
      cover_url: h.coverUrl,
      total_doctors: h._count.doctors,
      total_departments: h._count.departments,
      created_at: h.createdAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedHospitals.length,
      data: formattedHospitals,
      hospitals: formattedHospitals,
    });
  } catch (error: any) {
    console.error('Error fetching hospitals in /api/hospitals:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'হাসপাতালের তালিকা আনতে সমস্যা হয়েছে।',
      },
      { status: 500 }
    );
  }
}
