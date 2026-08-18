import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const helplines = await db.emergencyHelpline.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ success: true, helplines });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch helplines' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();

    const { title, number, desc, badge, icon, isAvailable, orderIndex } = body;

    if (!title || !number) {
      return NextResponse.json({ error: 'Title and Phone Number are required.' }, { status: 400 });
    }

    const helpline = await db.emergencyHelpline.create({
      data: {
        title,
        number,
        desc: desc || '',
        badge: badge || 'Emergency 24/7',
        icon: icon || 'PhoneCall',
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
      },
    });

    return NextResponse.json({ success: true, helpline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create helpline' }, { status: 500 });
  }
}
