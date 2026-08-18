import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const divisions = await db.division.findMany({
      include: {
        districts: {
          include: {
            _count: { select: { hospitals: true } },
          },
        },
      },
      orderBy: { nameEn: 'asc' },
    });

    return NextResponse.json({ divisions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['SUPER_ADMIN']);
    const body = await request.json();
    const { type, divisionId, nameEn, nameBn } = body;

    if (!nameEn || !nameBn) {
      return NextResponse.json({ error: 'Name in English and Bangla required' }, { status: 400 });
    }

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (type === 'DIVISION') {
      const division = await db.division.create({
        data: { nameEn, nameBn, slug },
      });
      return NextResponse.json({ success: true, division });
    } else if (type === 'DISTRICT') {
      if (!divisionId) return NextResponse.json({ error: 'Division ID required for District' }, { status: 400 });
      const district = await db.district.create({
        data: { divisionId, nameEn, nameBn, slug },
      });
      return NextResponse.json({ success: true, district });
    }

    return NextResponse.json({ error: 'Invalid location type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
