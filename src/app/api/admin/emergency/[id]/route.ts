import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const helpline = await db.emergencyHelpline.findUnique({
      where: { id: params.id },
    });
    if (!helpline) {
      return NextResponse.json({ error: 'Helpline not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, helpline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const body = await request.json();

    const existing = await db.emergencyHelpline.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Helpline not found' }, { status: 404 });
    }

    const { title, number, desc, badge, icon, isAvailable, orderIndex } = body;

    const updated = await db.emergencyHelpline.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(number !== undefined && { number }),
        ...(desc !== undefined && { desc }),
        ...(badge !== undefined && { badge }),
        ...(icon !== undefined && { icon }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(orderIndex !== undefined && { orderIndex: Number(orderIndex) }),
      },
    });

    return NextResponse.json({ success: true, helpline: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update helpline' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);

    const existing = await db.emergencyHelpline.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Helpline not found' }, { status: 404 });
    }

    await db.emergencyHelpline.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Helpline deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete helpline' }, { status: 500 });
  }
}

