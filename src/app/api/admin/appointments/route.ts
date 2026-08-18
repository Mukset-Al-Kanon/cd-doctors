import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN']);
    const appointments = await db.appointment.findMany({
      include: {
        hospital: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true, specialization: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth(['SUPER_ADMIN']);
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status },
    });

    await db.auditLog.create({
      data: {
        userId: user.userId,
        hospitalId: appointment.hospitalId,
        action: 'APPOINTMENT_STATUS_UPDATED',
        details: `Updated appointment ${appointment.appointmentCode} status to ${status}.`,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
