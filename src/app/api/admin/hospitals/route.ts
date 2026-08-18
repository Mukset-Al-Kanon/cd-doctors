import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const hospitals = await db.hospital.findMany({
      where: {
        district: { slug: 'chuadanga' },
        OR: query
          ? [
              { name: { contains: query } },
              { address: { contains: query } },
              { licenseNumber: { contains: query } },
            ]
          : undefined,
      },
      include: {
        district: true,
        facilities: true,
        _count: { select: { doctors: true, departments: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ hospitals });
  } catch (error: any) {
    console.error('Error fetching admin hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospital records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userHeader = request.headers.get('x-user');
    const userRoleHeader = request.headers.get('x-user-role');
    const isOwnerAdmin = userHeader === 'OWNER_ADMIN' || userRoleHeader === 'SUPER_ADMIN' || userRoleHeader === 'ADMIN';

    const body = await request.json();
    const {
      name,
      hospitalType,
      address,
      phone,
      emergencyPhone,
      email,
      website,
      googleMapUrl,
      establishedYear,
      description,
      licenseNumber,
      status,
      isFeatured,
      facilities,
      logoUrl,
      coverUrl,
    } = body;

    if (!name || !address || !phone) {
      return NextResponse.json({ error: 'Hospital Name, Address, and Contact Phone are required.' }, { status: 400 });
    }

    // Default to Chuadanga District
    let dist = await db.district.findUnique({ where: { slug: 'chuadanga' } });
    if (!dist) {
      dist = await db.district.findFirst({ where: { nameEn: 'Chuadanga' } });
    }

    if (!dist) {
      return NextResponse.json({ error: 'Chuadanga District location record not found.' }, { status: 500 });
    }

    // Auto-generate unique slug
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = 'chuadanga-hospital';

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await db.hospital.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newHospital = await db.hospital.create({
      data: {
        name,
        slug: uniqueSlug,
        districtId: dist.id,
        hospitalType: hospitalType || 'Private Hospital',
        address,
        phone,
        emergencyPhone,
        email,
        website,
        googleMapUrl: googleMapUrl || undefined,
        establishedYear: establishedYear ? parseInt(establishedYear.toString()) : undefined,
        description,
        licenseNumber,
        status: status || 'ACTIVE',
        isFeatured: isFeatured ?? false,
        logoUrl: logoUrl || undefined,
        coverUrl: coverUrl || undefined,
        facilities: facilities && Array.isArray(facilities) && facilities.length > 0
          ? {
              create: facilities.map((f: string) => ({ facilityName: f })),
            }
          : undefined,
      },
      include: { facilities: true, district: true },
    });

    // Create Audit Log
    try {
      await db.auditLog.create({
        data: {
          action: 'CREATE_HOSPITAL',
          hospitalId: newHospital.id,
          details: `Created hospital ${name} with logo and cover photo in Chuadanga District.`,
        },
      });
    } catch (e) {
      console.log('Audit log skipped');
    }

    return NextResponse.json({ hospital: newHospital });
  } catch (error: any) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: error.message || 'Failed to create hospital record' }, { status: 500 });
  }
}
