import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const q = searchParams.get('q');

    const whereClause: any = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (bloodGroup && bloodGroup !== 'All') {
      whereClause.bloodGroup = bloodGroup;
    }

    if (area && area !== 'All') {
      whereClause.area = area;
    }

    if (q && q.trim() !== '') {
      whereClause.OR = [
        { fullName: { contains: q.trim() } },
        { phone: { contains: q.trim() } },
        { address: { contains: q.trim() } },
      ];
    }

    const [donors, totalCount, pendingCount, approvedCount, availableCount, unavailableCount] =
      await Promise.all([
        db.bloodDonor.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        }),
        db.bloodDonor.count(),
        db.bloodDonor.count({ where: { status: 'pending' } }),
        db.bloodDonor.count({ where: { status: 'approved' } }),
        db.bloodDonor.count({ where: { status: 'approved', availability: 'available' } }),
        db.bloodDonor.count({ where: { status: 'approved', availability: 'unavailable' } }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        available: availableCount,
        unavailable: unavailableCount,
      },
      donors,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch donors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();

    const { fullName, phone, bloodGroup, age, gender, address, area, availability, lastDonationDate, note, status } = body;

    if (!fullName || !phone || !bloodGroup || !age || !address || !area) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    const existingDonor = await db.bloodDonor.findUnique({
      where: { phone: phone.trim() },
    });

    if (existingDonor) {
      return NextResponse.json({ error: 'A donor with this mobile number already exists.' }, { status: 400 });
    }

    const newDonor = await db.bloodDonor.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        bloodGroup,
        age: Number(age),
        gender: gender || 'Male',
        address: address.trim(),
        area: area.trim(),
        availability: availability || 'available',
        lastDonationDate: lastDonationDate || null,
        note: note ? note.trim() : null,
        consent: true,
        status: status || 'approved',
        approvedAt: status === 'approved' || !status ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, donor: newDonor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create donor' }, { status: 500 });
  }
}
