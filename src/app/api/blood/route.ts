import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const area = searchParams.get('area');
    const q = searchParams.get('q');

    const whereClause: any = {
      status: 'approved',
    };

    if (bloodGroup && bloodGroup !== 'All') {
      whereClause.bloodGroup = bloodGroup;
    }

    if (area && area !== 'All') {
      whereClause.area = area;
    }

    if (q && q.trim() !== '') {
      whereClause.OR = [
        { fullName: { contains: q.trim() } },
        { address: { contains: q.trim() } },
        { note: { contains: q.trim() } },
      ];
    }

    const donors = await db.bloodDonor.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        bloodGroup: true,
        age: true,
        gender: true,
        area: true,
        address: true,
        phone: true,
        availability: true,
        lastDonationDate: true,
        note: true,
        createdAt: true,
      },
      orderBy: [
        { availability: 'asc' }, // 'available' before 'unavailable'
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, count: donors.length, donors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blood donors' },
      { status: 500 }
    );
  }
}
