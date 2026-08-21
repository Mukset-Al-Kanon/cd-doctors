import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Live real-time data always

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const slug = searchParams.get('slug') || '';
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const district = searchParams.get('district') || searchParams.get('area') || '';
    const type = searchParams.get('type') || searchParams.get('hospitalType') || '';
    const limit = searchParams.get('limit') ? Math.min(100, Math.max(1, parseInt(searchParams.get('limit')!, 10))) : 50;

    // Single hospital lookup by ID or Slug
    if (id || slug) {
      const hospital = await db.hospital.findFirst({
        where: {
          OR: [
            ...(id ? [{ id }] : []),
            ...(slug ? [{ slug }] : []),
          ],
        },
        include: {
          district: {
            include: { division: true },
          },
          facilities: {
            where: { isAvailable: true },
          },
          departments: true,
          doctors: {
            where: { status: 'ACTIVE' },
            include: {
              department: true,
              schedules: {
                orderBy: { dayOfWeek: 'asc' },
              },
            },
            orderBy: { experienceYears: 'desc' },
          },
          _count: {
            select: {
              doctors: true,
              departments: true,
            },
          },
        },
      });

      if (!hospital) {
        return NextResponse.json(
          { success: false, error: 'হাসপাতাল খুঁজে পাওয়া যায়নি (Hospital not found).' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          hospital: {
            id: hospital.id,
            name: hospital.name,
            slug: hospital.slug,
            hospitalType: hospital.hospitalType,
            status: hospital.status,
            isFeatured: hospital.isFeatured,
            address: hospital.address,
            district: hospital.district.nameEn,
            districtBn: hospital.district.nameBn,
            division: hospital.district.division.nameEn,
            phone: hospital.phone,
            emergencyPhone: hospital.emergencyPhone,
            email: hospital.email,
            website: hospital.website,
            googleMapUrl: hospital.googleMapUrl,
            establishedYear: hospital.establishedYear,
            description: hospital.description,
            logoUrl: hospital.logoUrl,
            coverUrl: hospital.coverUrl,
            licenseNumber: hospital.licenseNumber,
            facilities: hospital.facilities.map((f) => f.facilityName),
            departments: hospital.departments.map((d) => ({
              id: d.id,
              nameEn: d.nameEn,
              nameBn: d.nameBn,
            })),
            doctorsCount: hospital._count.doctors,
            doctors: hospital.doctors.map((doc) => ({
              id: doc.id,
              name: doc.name,
              slug: doc.slug,
              specialization: doc.specialization,
              degrees: doc.degrees,
              consultationFee: doc.consultationFee,
              chamberRoom: doc.chamberRoom,
              phone: doc.phone || hospital.phone,
              schedules: doc.schedules,
            })),
            createdAt: hospital.createdAt,
          },
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    // Filter criteria for hospital list
    const where: any = {
      status: 'ACTIVE',
    };

    if (type) {
      where.hospitalType = { contains: type };
    }

    if (district) {
      where.OR = [
        { address: { contains: district } },
        { district: { nameEn: { contains: district } } },
        { district: { nameBn: { contains: district } } },
        { district: { slug: { contains: district } } },
      ];
    }

    if (query) {
      const searchConditions = [
        { name: { contains: query } },
        { address: { contains: query } },
        { description: { contains: query } },
        { hospitalType: { contains: query } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const hospitals = await db.hospital.findMany({
      where,
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
        facilities: {
          where: { isAvailable: true },
          select: { facilityName: true },
        },
        departments: {
          select: { id: true, nameEn: true, nameBn: true },
        },
        _count: {
          select: {
            doctors: true,
            departments: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      take: limit,
    });

    const formattedHospitals = hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      slug: h.slug,
      hospitalType: h.hospitalType,
      hospital_type: h.hospitalType,
      address: h.address,
      location: h.address,
      district: h.district.nameEn,
      districtBn: h.district.nameBn,
      division: h.district.division.nameEn,
      phone: h.phone,
      emergencyPhone: h.emergencyPhone,
      emergency_phone: h.emergencyPhone,
      email: h.email,
      website: h.website,
      googleMapUrl: h.googleMapUrl,
      google_map_url: h.googleMapUrl,
      establishedYear: h.establishedYear,
      description: h.description,
      logoUrl: h.logoUrl,
      coverUrl: h.coverUrl,
      totalDoctors: h._count.doctors,
      total_doctors: h._count.doctors,
      totalDepartments: h._count.departments,
      total_departments: h._count.departments,
      facilities: h.facilities.map((f) => f.facilityName),
      departments: h.departments.map((d) => d.nameBn),
      createdAt: h.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedHospitals.length,
        hospitals: formattedHospitals,
        data: formattedHospitals,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in /api/hospitals:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'হাসপাতালের তালিকা আনতে সমস্যা হয়েছে।',
      },
      { status: 500 }
    );
  }
}
